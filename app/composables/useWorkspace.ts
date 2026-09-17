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
let carregandoLock = false // Mutex para evitar chamadas simultâneas

export function useWorkspace() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const db = supabase as any

  // ──────────────────────────────────────────
  // CARREGAR GRUPOS E MEMBROS DO USUÁRIO
  // ──────────────────────────────────────────
  const carregarWorkspace = async () => {
    if (carregandoLock) return // Bloqueia chamadas simultâneas

    // Obter sessão atual do Supabase Client
    const { data: sessionData } = await supabase.auth.getSession()
    const currentUser = sessionData?.session?.user || user.value

    // Sem usuário autenticado: dados de demonstração (SEM lock pois é síncrono)
    if (!currentUser) {
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
            perfil: { id: 'user-demo-2', nome: 'Amor / Parceiro(a)', email: 'parceiro@email.com', moeda: 'BRL' }
          }
        ]
      }
      return // Retorna SEM ativar o lock
    }

    // Usuário autenticado: ativa o lock só agora
    carregandoLock = true

    carregandoWorkspace.value = true
    try {
      // 1. Buscar membros do usuário logado para encontrar os grupos que ele pertence
      let membrosData: any[] | null = null
      
      // Tentar busca completa com JOIN
      const { data: dJoin, error: errJoin } = await db
        .from('membros_grupo')
        .select('*, grupos_familiares(*), perfis(*)')
        .eq('user_id', currentUser.id)

      if (!errJoin && dJoin) {
        membrosData = dJoin
      } else {
        // Fallback: Busca sem JOIN se a relação/FK ainda não foi criada no BD
        const { data: dSimples } = await db
          .from('membros_grupo')
          .select('*, grupos_familiares(*)')
          .eq('user_id', currentUser.id)
        membrosData = dSimples
      }

      if (membrosData && membrosData.length > 0) {
        gruposDisponiveis.value = membrosData
          .map((m: any) => m.grupos_familiares as GrupoFamiliar)
          .filter(Boolean)

        if (gruposDisponiveis.value.length > 0) {
          const pertence = gruposDisponiveis.value.find(g => g.id === grupoAtivo.value?.id)
          if (!pertence || grupoAtivo.value?.id.startsWith('grupo-demo-') || grupoAtivo.value?.id.startsWith('grupo-temp-')) {
            grupoAtivo.value = gruposDisponiveis.value[0] || null
          }
        }
      } else {
        // Tentar buscar se o usuário já criou algum grupo como criador (sem ser via membros_grupo)
        const { data: gruposCriados } = await db
          .from('grupos_familiares')
          .select('*')
          .eq('user_criador_id', currentUser.id)

        if (gruposCriados && gruposCriados.length > 0) {
          grupoAtivo.value = gruposCriados[0]
          gruposDisponiveis.value = gruposCriados
          
          // Garantir que o criador está na tabela membros_grupo
          await db.from('membros_grupo').upsert([{
            grupo_id: gruposCriados[0].id,
            user_id: currentUser.id,
            papel: 'admin'
          }], { onConflict: 'grupo_id,user_id' })
        } else {
          // Usuário não tem grupo ainda — cria objeto local temporário.
          // O grupo real é criado no banco APENAS quando o usuário clicar em "Salvar Nome"
          const nomePadrao = currentUser.user_metadata?.nome 
            ? `Workspace de ${currentUser.user_metadata.nome}`
            : 'Meu Workspace'

          grupoAtivo.value = {
            id: `grupo-temp-${currentUser.id}`,
            nome: nomePadrao,
            user_criador_id: currentUser.id
          }
          gruposDisponiveis.value = [grupoAtivo.value]
        }
      }

      // 2. Buscar todos os membros do grupo ativo
      if (grupoAtivo.value && !grupoAtivo.value.id.startsWith('grupo-demo-')) {
        // Tentar select com join
        const { data: todosMembros, error: errTodos } = await db
          .from('membros_grupo')
          .select('*, perfis(*)')
          .eq('grupo_id', grupoAtivo.value.id)

        if (!errTodos && todosMembros && todosMembros.length > 0) {
          // Buscar manualmente perfis para quaisquer membros que vieram com perfis null
          const semPerfilIds = todosMembros
            .filter((m: any) => !m.perfil && !m.perfis)
            .map((m: any) => m.user_id)

          let perfisExtraMap = new Map()
          if (semPerfilIds.length > 0) {
            const { data: pExtra } = await db.from('perfis').select('*').in('id', semPerfilIds)
            if (pExtra) {
              perfisExtraMap = new Map(pExtra.map((p: any) => [p.id, p]))
            }
          }

          membrosGrupo.value = todosMembros.map((m: any) => {
            const perfilEncontrado = m.perfil || m.perfis || perfisExtraMap.get(m.user_id)
            return {
              ...m,
              perfil: perfilEncontrado || {
                id: m.user_id,
                nome: m.user_id === currentUser.id 
                  ? (currentUser.user_metadata?.nome || currentUser.email?.split('@')[0] || 'Você')
                  : 'Membro do Casal',
                email: m.user_id === currentUser.id ? (currentUser.email || '') : '',
                moeda: 'BRL'
              }
            }
          }) as MembroGrupo[]
        } else {
          // Fallback manual se a relação FK falhou
          const { data: membrosSemPerfil } = await db
            .from('membros_grupo')
            .select('*')
            .eq('grupo_id', grupoAtivo.value.id)

          if (membrosSemPerfil && membrosSemPerfil.length > 0) {
            const userIds = membrosSemPerfil.map((m: any) => m.user_id)
            const { data: perfisData } = await db.from('perfis').select('*').in('id', userIds)
            
            const perfisMap = new Map((perfisData || []).map((p: any) => [p.id, p]))

            membrosGrupo.value = membrosSemPerfil.map((m: any) => ({
              ...m,
              perfil: perfisMap.get(m.user_id) || {
                id: m.user_id,
                nome: m.user_id === user.value?.id 
                  ? (user.value?.user_metadata?.nome || user.value?.email?.split('@')[0] || 'Você')
                  : 'Membro do Casal',
                email: m.user_id === user.value?.id ? (user.value?.email || '') : '',
                moeda: 'BRL'
              }
            })) as MembroGrupo[]
          } else {
            membrosGrupo.value = []
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar workspace:', err)
    } finally {
      carregandoWorkspace.value = false
      carregandoLock = false // Libera o lock
    }
  }

  // (Watch removido — carregarWorkspace é chamado explicitamente pelo onMounted das páginas)

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
  const atualizarNomeGrupo = async (novoNome: string): Promise<{ sucesso: boolean; mensagem: string }> => {
    const nomeLimpo = novoNome ? novoNome.trim() : ''
    if (!nomeLimpo) {
      return { sucesso: false, mensagem: 'Informe um nome válido para o workspace.' }
    }

    // Obter a sessão ativa diretamente do Supabase Client
    const { data: sessionData } = await supabase.auth.getSession()
    const currentUser = sessionData?.session?.user || user.value

    if (!grupoAtivo.value) {
      if (currentUser) {
        grupoAtivo.value = {
          id: `grupo-temp-${currentUser.id}`,
          nome: nomeLimpo,
          user_criador_id: currentUser.id
        }
      } else {
        grupoAtivo.value = {
          id: 'grupo-demo-casal',
          nome: nomeLimpo,
          user_criador_id: 'user-demo-1'
        }
      }
    } else {
      grupoAtivo.value.nome = nomeLimpo
    }

    if (currentUser) {
      try {
        // Se for um grupo temporário ou demo, cria no banco de dados primeiro
        if (grupoAtivo.value.id.startsWith('grupo-temp-') || grupoAtivo.value.id.startsWith('grupo-demo-')) {
          const { data: novoG, error: errIns } = await db
            .from('grupos_familiares')
            .insert([{ nome: nomeLimpo, user_criador_id: currentUser.id }])
            .select()
            .single()

          if (errIns) {
            console.error('Erro ao criar grupo no Supabase:', errIns)
            if (errIns.message?.includes('row-level security')) {
              return { 
                sucesso: false, 
                mensagem: 'Erro de permissão no Supabase (RLS). Por favor, execute o script SQL "fix_rls_final.sql" no SQL Editor do Supabase para corrigir as permissões.' 
              }
            }
            return { sucesso: false, mensagem: `Erro ao criar no banco: ${errIns.message}` }
          }

          if (novoG) {
            grupoAtivo.value = novoG
            gruposDisponiveis.value = [novoG]

            await db.from('membros_grupo').insert([{
              grupo_id: novoG.id,
              user_id: currentUser.id,
              papel: 'admin'
            }])

            await carregarWorkspace()
            return { sucesso: true, mensagem: 'Workspace criado e nome salvo com sucesso!' }
          }
        } else {
          // Atualiza grupo existente no banco
          const { error } = await db
            .from('grupos_familiares')
            .update({ nome: nomeLimpo })
            .eq('id', grupoAtivo.value.id)

          if (error) {
            console.error('Erro ao atualizar nome do grupo no Supabase:', error)
            return { sucesso: false, mensagem: `Erro ao salvar no banco: ${error.message}` }
          }
          
          return { sucesso: true, mensagem: 'Nome do Workspace atualizado com sucesso!' }
        }
      } catch (e: any) {
        console.error('Erro ao atualizar nome do grupo:', e)
        return { sucesso: false, mensagem: e?.message || 'Erro de conexão ao salvar nome.' }
      }
    }

    return { sucesso: true, mensagem: 'Nome do Workspace atualizado (modo local)!' }
  }

  // ──────────────────────────────────────────
  // CRIAR UM NOVO WORKSPACE DEDICADO
  // ──────────────────────────────────────────
  const criarNovoGrupo = async (nome: string): Promise<{ sucesso: boolean; mensagem: string }> => {
    const nomeLimpo = nome ? nome.trim() : ''
    if (!nomeLimpo) {
      return { sucesso: false, mensagem: 'Informe um nome válido para o novo workspace.' }
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const currentUser = sessionData?.session?.user || user.value

    if (!currentUser) {
      const novoDemo: GrupoFamiliar = {
        id: `grupo-demo-${Date.now()}`,
        nome: nomeLimpo,
        user_criador_id: 'user-demo-1'
      }
      gruposDisponiveis.value.push(novoDemo)
      grupoAtivo.value = novoDemo
      return { sucesso: true, mensagem: `Workspace "${nomeLimpo}" criado (modo local)!` }
    }

    try {
      const { data: novoG, error: errIns } = await db
        .from('grupos_familiares')
        .insert([{ nome: nomeLimpo, user_criador_id: currentUser.id }])
        .select()
        .single()

      if (errIns) {
        console.error('Erro ao criar grupo no Supabase:', errIns)
        if (errIns.message?.includes('row-level security')) {
          return { 
            sucesso: false, 
            mensagem: 'Erro de permissão no Supabase (RLS). Execute o script "fix_rls_final.sql" no SQL Editor.' 
          }
        }
        return { sucesso: false, mensagem: `Erro ao criar no banco: ${errIns.message}` }
      }

      if (novoG) {
        await db.from('membros_grupo').insert([{
          grupo_id: novoG.id,
          user_id: currentUser.id,
          papel: 'admin'
        }])

        await carregarWorkspace()
        grupoAtivo.value = novoG
        return { sucesso: true, mensagem: `Workspace "${nomeLimpo}" criado com sucesso!` }
      }
    } catch (e: any) {
      console.error('Erro ao criar novo workspace:', e)
      return { sucesso: false, mensagem: e?.message || 'Erro de conexão ao criar workspace.' }
    }

    return { sucesso: false, mensagem: 'Não foi possível criar o workspace.' }
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
    atualizarNomeGrupo,
    criarNovoGrupo
  }
}
