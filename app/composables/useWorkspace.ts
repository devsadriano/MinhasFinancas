import { ref, computed } from 'vue'
import type { 
  GrupoFamiliar, 
  MembroGrupo, 
  Transacao, 
  RateioTransacao, 
  AcertoDeContasView, 
  ResultadoCalculoAcerto 
} from '~/types/database.types'

// =============================================
// ESTADO GLOBAL REATIVO DO WORKSPACE (SINGLETON)
// =============================================
const grupoAtivo = ref<GrupoFamiliar | null>(null)
const gruposDisponiveis = ref<GrupoFamiliar[]>([])
const membrosGrupo = ref<MembroGrupo[]>([])
const modoVisao = ref<'casal' | 'pessoal'>('casal')
const carregandoWorkspace = ref(false)

export function useWorkspace() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const db = supabase as any

  // ──────────────────────────────────────────
  // CARREGAR GRUPOS E MEMBROS DO USUÁRIO
  // ──────────────────────────────────────────
  const carregarWorkspace = async () => {
    if (!user.value) {
      // Fallback convidado / local
      if (!grupoAtivo.value) {
        grupoAtivo.value = {
          id: 'grupo-demo-casal',
          nome: 'Casa Rocha (Casal)',
          user_criador_id: 'user-demo-1'
        }
        membrosGrupo.value = [
          {
            id: 'm-1',
            grupo_id: 'grupo-demo-casal',
            user_id: 'user-demo-1',
            papel: 'admin',
            perfil: { id: 'user-demo-1', nome: 'Você', email: 'voce@email.com', moeda: 'BRL' }
          },
          {
            id: 'm-2',
            grupo_id: 'grupo-demo-casal',
            user_id: 'user-demo-2',
            papel: 'membro',
            perfil: { id: 'user-demo-2', nome: 'Amor / Parco', email: 'parceiro@email.com', moeda: 'BRL' }
          }
        ]
      }
      return
    }

    carregandoWorkspace.value = true
    try {
      // 1. Buscar membros do usuário logado para encontrar os grupos que ele pertence
      const { data: membrosData } = await db
        .from('membros_grupo')
        .select('*, grupos_familiares(*), perfis(*)')
        .eq('user_id', user.value.id)

      if (membrosData && membrosData.length > 0) {
        gruposDisponiveis.value = membrosData
          .map((m: any) => m.grupos_familiares as GrupoFamiliar)
          .filter(Boolean)

        if (!grupoAtivo.value && gruposDisponiveis.value.length > 0) {
          grupoAtivo.value = gruposDisponiveis.value[0] || null
        }
      } else {
        // Se o usuário não tem grupo, cria o grupo padrão "Casa Rocha"
        const novoGrupo = {
          nome: 'Casa (Workspace)',
          user_criador_id: user.value.id
        }
        const { data: gCriado } = await db.from('grupos_familiares').insert([novoGrupo]).select().single()
        if (gCriado) {
          grupoAtivo.value = gCriado
          gruposDisponiveis.value = [gCriado]

          // Inserir usuário como admin do grupo
          await db.from('membros_grupo').insert([{
            grupo_id: gCriado.id,
            user_id: user.value.id,
            papel: 'admin'
          }])
        }
      }

      // 2. Buscar todos os membros do grupo ativo
      if (grupoAtivo.value) {
        const { data: todosMembros } = await db
          .from('membros_grupo')
          .select('*, perfis(*)')
          .eq('grupo_id', grupoAtivo.value.id)

        if (todosMembros) {
          membrosGrupo.value = todosMembros as MembroGrupo[]
        }
      }
    } catch (err) {
      console.error('Erro ao carregar workspace:', err)
    } finally {
      carregandoWorkspace.value = false
    }
  }

  // ──────────────────────────────────────────
  // TROCAR GRUPO / VISÃO
  // ──────────────────────────────────────────
  const trocarGrupo = async (grupoId: string) => {
    const g = gruposDisponiveis.value.find(item => item.id === grupoId)
    if (g) {
      grupoAtivo.value = g
      await carregarWorkspace()
    }
  }

  const alternarModoVisao = () => {
    modoVisao.value = modoVisao.value === 'casal' ? 'pessoal' : 'casal'
  }

  // ──────────────────────────────────────────
  // DIVISÃO DE DESPESA 50/50 (RATEIOS)
  // ──────────────────────────────────────────
  const criarRateio5050 = async (transacaoId: string, valorTotal: number): Promise<RateioTransacao[]> => {
    if (!membrosGrupo.value || membrosGrupo.value.length === 0) return []

    const qtd = Math.max(1, membrosGrupo.value.length)
    const valorPorPessoa = Math.round((valorTotal / qtd) * 100) / 100
    const porcentagem = Math.round((100 / qtd) * 100) / 100

    const rateios: RateioTransacao[] = membrosGrupo.value.map(membro => ({
      transacao_id: transacaoId,
      user_id: membro.user_id,
      valor: valorPorPessoa,
      porcentagem,
      perfil: membro.perfil
    }))

    if (user.value && transacaoId && !transacaoId.startsWith('tr-')) {
      try {
        const paraInserir = rateios.map(r => ({
          transacao_id: r.transacao_id,
          user_id: r.user_id,
          valor: r.valor,
          porcentagem: r.porcentagem
        }))
        await db.from('rateios_transacao').insert(paraInserir)
      } catch (e) {
        console.error('Erro ao inserir rateios 50/50:', e)
      }
    }

    return rateios
  }

  // ──────────────────────────────────────────
  // ACERTO DE CONTAS (CALCULO DE SALDOS)
  // ──────────────────────────────────────────
  const calcularAcertoDeContas = (transacoes: Transacao[]): ResultadoCalculoAcerto => {
    if (!membrosGrupo.value || membrosGrupo.value.length < 2) {
      return {
        devedor_id: '',
        devedor_nome: '',
        credor_id: '',
        credor_nome: '',
        valor_diferenca: 0,
        status: 'equilibrado'
      }
    }

    const membroA = membrosGrupo.value[0]!
    const membroB = membrosGrupo.value[1]!

    let pagoA = 0
    let pagoB = 0
    let consumidoA = 0
    let consumidoB = 0
    let liquidadoA = 0 // Transferências internas de A -> B
    let liquidadoB = 0 // Transferências internas de B -> A

    for (const t of transacoes) {
      if (t.tipo === 'despesa') {
        // Quem pagou de bolso
        if (t.user_id === membroA.user_id) pagoA += t.valor
        else if (t.user_id === membroB.user_id) pagoB += t.valor

        // Quem consumiu (via rateios ou 50/50)
        if (t.rateios && t.rateios.length > 0) {
          t.rateios.forEach(r => {
            if (r.user_id === membroA.user_id) consumidoA += r.valor
            else if (r.user_id === membroB.user_id) consumidoB += r.valor
          })
        } else {
          // Se não houver rateio explícito, assume 50/50 por padrão
          consumidoA += t.valor / 2
          consumidoB += t.valor / 2
        }
      } else if (t.tipo === 'transferencia_interna') {
        if (t.user_id === membroA.user_id) liquidadoA += t.valor
        else if (t.user_id === membroB.user_id) liquidadoB += t.valor
      }
    }

    // Saldo Líquido de cada um = (Pago - Consumido + Liquidado)
    const saldoA = (pagoA - consumidoA) + liquidadoA
    const saldoB = (pagoB - consumidoB) + liquidadoB

    // Se saldoA < 0, A deve para B
    if (Math.abs(saldoA) < 0.01) {
      return {
        devedor_id: '',
        devedor_nome: '',
        credor_id: '',
        credor_nome: '',
        valor_diferenca: 0,
        status: 'equilibrado'
      }
    }

    const nomeA = membroA.perfil?.nome || 'Pessoa 1'
    const nomeB = membroB.perfil?.nome || 'Pessoa 2'

    if (saldoA < 0) {
      return {
        devedor_id: membroA.user_id,
        devedor_nome: nomeA,
        credor_id: membroB.user_id,
        credor_nome: nomeB,
        valor_diferenca: Math.abs(saldoA),
        status: 'pendente'
      }
    } else {
      return {
        devedor_id: membroB.user_id,
        devedor_nome: nomeB,
        credor_id: membroA.user_id,
        credor_nome: nomeA,
        valor_diferenca: Math.abs(saldoB),
        status: 'pendente'
      }
    }
  }

  // ──────────────────────────────────────────
  // LIQUIDAR ACERTO DE CONTAS (TRANSFERENCIA INTERNA)
  // ──────────────────────────────────────────
  const liquidarAcertoDeContas = async (
    devedorId: string, 
    valor: number,
    adicionarLancamentoFn: (item: any) => Promise<void>
  ) => {
    const devedor = membrosGrupo.value.find(m => m.user_id === devedorId)
    const nomeDevedor = devedor?.perfil?.nome || 'Membro'

    await adicionarLancamentoFn({
      descricao: `🤝 Acerto de Contas: ${nomeDevedor} pagou a diferença`,
      valor: Number(valor),
      tipo: 'transferencia_interna',
      data: new Date().toISOString().split('T')[0],
      categoria: 'Outros',
      observacao: 'Liquidação de acerto de contas do casal (não afeta o gráfico de consumo)'
    })
  }

  // ──────────────────────────────────────────
  // VINCULAR PARCEIRO (RPC VINCULAR_PARCEIRO)
  // ──────────────────────────────────────────
  const adicionarParceiro = async (email: string): Promise<{ sucesso: boolean; mensagem: string }> => {
    if (!grupoAtivo.value?.id) {
      return { sucesso: false, mensagem: 'Nenhum workspace de casal ativo encontrado.' }
    }

    const emailLimpo = email ? email.trim().toLowerCase() : ''
    if (!emailLimpo || !emailLimpo.includes('@')) {
      return { sucesso: false, mensagem: 'Informe um endereço de e-mail válido.' }
    }

    // Modo Convidado / Demo local
    if (!user.value) {
      const novomembro: MembroGrupo = {
        id: `m-${Date.now()}`,
        grupo_id: grupoAtivo.value.id,
        user_id: `user-demo-${membrosGrupo.value.length + 1}`,
        papel: 'membro',
        perfil: {
          id: `user-demo-${membrosGrupo.value.length + 1}`,
          nome: emailLimpo.split('@')[0] || 'Parceiro(a)',
          email: emailLimpo,
          moeda: 'BRL'
        }
      }
      membrosGrupo.value.push(novomembro)
      return { sucesso: true, mensagem: `Parceiro(a) ${emailLimpo} vinculado(a) com sucesso ao seu grupo!` }
    }

    try {
      const { data, error } = await db.rpc('vincular_parceiro', {
        email_convidado: emailLimpo,
        p_grupo_id: grupoAtivo.value.id
      })

      if (error) {
        return { sucesso: false, mensagem: error.message || 'Não foi possível vincular a conta.' }
      }

      await carregarWorkspace()
      return {
        sucesso: true,
        mensagem: data?.mensagem || 'Parceiro(a) vinculado(a) com sucesso ao seu workspace!'
      }
    } catch (err: any) {
      return { sucesso: false, mensagem: err?.message || 'Erro inesperado ao vincular parceiro.' }
    }
  }

  // ──────────────────────────────────────────
  // ATUALIZAR NOME DO WORKSPACE
  // ──────────────────────────────────────────
  const atualizarNomeGrupo = async (novoNome: string) => {
    if (!grupoAtivo.value || !novoNome.trim()) return
    grupoAtivo.value.nome = novoNome.trim()

    if (user.value && grupoAtivo.value.id && !grupoAtivo.value.id.startsWith('grupo-demo-')) {
      try {
        await db.from('grupos_familiares').update({ nome: novoNome.trim() }).eq('id', grupoAtivo.value.id)
      } catch (e) {
        console.error('Erro ao atualizar nome do grupo:', e)
      }
    }
  }

  return {
    grupoAtivo,
    gruposDisponiveis,
    membrosGrupo,
    modoVisao,
    carregandoWorkspace,

    carregarWorkspace,
    trocarGrupo,
    alternarModoVisao,
    criarRateio5050,
    calcularAcertoDeContas,
    liquidarAcertoDeContas,
    adicionarParceiro,
    atualizarNomeGrupo
  }
}
