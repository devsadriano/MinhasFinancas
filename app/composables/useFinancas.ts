import { ref } from 'vue'

// =============================================
// INTERFACES
// =============================================
export interface Conta {
  id?: string
  nome: string
  tipo: string
  saldo: number
  cor: string
  user_id?: string
}

export interface Cartao {
  id?: string
  user_id?: string
  nome: string
  bandeira: string
  limite: number
  dia_fechamento: number
  dia_vencimento: number
  cor: string
}

export interface Categoria {
  id?: string
  nome: string
  tipo: 'receita' | 'despesa'
  icone: string
  cor: string
  essencial?: boolean
  user_id?: string
  totalItens?: number
}

export interface Transacao {
  id?: string
  user_id?: string
  conta_id?: string | null
  cartao_id?: string | null
  categoria_id?: string | null
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
  data: string
  pago?: boolean
  observacao?: string | null
  parcela_atual?: number
  total_parcelas?: number
  // Campos enriquecidos (joins)
  categoria?: string
  conta?: string
  cartao_nome?: string
}

export interface Orcamento {
  id?: string
  user_id?: string
  categoria_id?: string
  categoria_nome: string
  limite: number
  mes: number
  ano: number
  icone: string
  cor: string
}

export interface Meta {
  id?: string
  user_id?: string
  titulo: string
  icone: string
  alvo: number
  atual: number
  prazo?: string
  cor: string
}

export interface Transferencia {
  id?: string
  user_id?: string
  conta_origem_id: string
  conta_destino_id: string
  valor: number
  descricao?: string
  data: string
  // Enriquecidos
  conta_origem_nome?: string
  conta_destino_nome?: string
}

// =============================================
// ESTADO GLOBAL COMPARTILHADO (SINGLETON)
// =============================================
const transacoes = ref<Transacao[]>([])
const bancos = ref<Conta[]>([])
const cartoes = ref<Cartao[]>([])
const categorias = ref<Categoria[]>([])
const orcamentos = ref<Orcamento[]>([])
const metas = ref<Meta[]>([])
const transferencias = ref<Transferencia[]>([])
const carregando = ref(false)
const carregadoInicial = ref(false)

// Seeds padrão
const CONTAS_PADRAO = [
  { nome: 'Nubank', tipo: 'Conta Corrente', saldo: 5450.00, cor: '#820ad1' },
  { nome: 'Itaú Unibanco', tipo: 'Conta Corrente', saldo: 3200.00, cor: '#ec7000' },
  { nome: 'Banco Inter', tipo: 'Investimentos', saldo: 1800.00, cor: '#ff7a00' },
  { nome: 'Carteira Física', tipo: 'Dinheiro', saldo: 350.00, cor: '#3ecf8e' },
]

const CARTOES_PADRAO = [
  { nome: 'Nubank Ultravioleta', bandeira: 'Mastercard Black', limite: 7500.00, dia_fechamento: 1, dia_vencimento: 10, cor: '#820ad1' },
  { nome: 'Itaú Personalité', bandeira: 'Visa Infinite', limite: 15000.00, dia_fechamento: 15, dia_vencimento: 25, cor: '#ec7000' },
]

const CATEGORIAS_PADRAO: Categoria[] = [
  { nome: 'Alimentação', icone: '🍔', cor: '#f59e0b', tipo: 'despesa', essencial: true },
  { nome: 'Moradia', icone: '🏠', cor: '#3b82f6', tipo: 'despesa', essencial: true },
  { nome: 'Salário', icone: '💰', cor: '#3ecf8e', tipo: 'receita', essencial: false },
  { nome: 'Transporte', icone: '🚗', cor: '#ef4444', tipo: 'despesa', essencial: true },
  { nome: 'Investimentos', icone: '📈', cor: '#10b981', tipo: 'receita', essencial: false },
  { nome: 'Lazer', icone: '✈️', cor: '#8b5cf6', tipo: 'despesa', essencial: false },
  { nome: 'Saúde', icone: '🏥', cor: '#ec4899', tipo: 'despesa', essencial: true },
  { nome: 'Outros', icone: '📦', cor: '#94a3b8', tipo: 'despesa', essencial: false },
]

// =============================================
// COMPOSABLE PRINCIPAL
// =============================================
export function useFinancas() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const db = supabase as any

  // ──────────────────────────────────────────
  // CARREGAR TUDO
  // ──────────────────────────────────────────
  const carregarTudo = async (forcar = false) => {
    if (carregadoInicial.value && !forcar) return
    carregando.value = true

    try {
      if (user.value) {
        // 1. Contas
        const { data: contasData } = await db
          .from('contas')
          .select('*')
          .order('created_at', { ascending: true })

        if (contasData && contasData.length > 0) {
          bancos.value = contasData.map((c: any) => ({ ...c, saldo: Number(c.saldo) }))
        } else {
          const paraInserir = CONTAS_PADRAO.map(c => ({ ...c, user_id: user.value?.id }))
          const { data: novasContas } = await db.from('contas').insert(paraInserir).select()
          if (novasContas) bancos.value = novasContas.map((c: any) => ({ ...c, saldo: Number(c.saldo) }))
        }

        // 2. Cartões
        const { data: cartoesData } = await db.from('cartoes').select('*').order('created_at', { ascending: true })
        if (cartoesData && cartoesData.length > 0) {
          cartoes.value = cartoesData.map((c: any) => ({ ...c, limite: Number(c.limite) }))
        } else {
          const cartoesInserir = CARTOES_PADRAO.map(c => ({ ...c, user_id: user.value?.id }))
          const { data: novosCartoes } = await db.from('cartoes').insert(cartoesInserir).select()
          if (novosCartoes) cartoes.value = novosCartoes.map((c: any) => ({ ...c, limite: Number(c.limite) }))
        }

        // 3. Categorias
        const { data: catData } = await db.from('categorias').select('*').order('created_at', { ascending: true })
        if (catData && catData.length > 0) {
          categorias.value = catData as Categoria[]
        } else {
          const catInserir = CATEGORIAS_PADRAO.map(c => ({ ...c, user_id: user.value?.id }))
          const { data: novasCats } = await db.from('categorias').insert(catInserir).select()
          if (novasCats) categorias.value = novasCats as Categoria[]
        }

        // 4. Transações
        const { data: transData } = await db
          .from('transacoes')
          .select('*, contas(nome), categorias(nome, icone, cor), cartoes(nome)')
          .order('data', { ascending: false })
          .order('created_at', { ascending: false })

        if (transData) {
          transacoes.value = transData.map((t: any) => ({
            id: t.id,
            user_id: t.user_id,
            conta_id: t.conta_id,
            cartao_id: t.cartao_id,
            categoria_id: t.categoria_id,
            descricao: t.descricao,
            valor: Number(t.valor),
            tipo: t.tipo,
            data: t.data,
            pago: t.pago,
            observacao: t.observacao,
            parcela_atual: t.parcela_atual || 1,
            total_parcelas: t.total_parcelas || 1,
            conta: t.contas?.nome || '',
            categoria: t.categorias?.nome || 'Outros',
            cartao_nome: t.cartoes?.nome
          }))
        }

        // 5. Orçamentos (mês atual)
        const agora = new Date()
        await carregarOrcamentos(agora.getMonth() + 1, agora.getFullYear())

        // 6. Metas
        await carregarMetas()

        // 7. Transferências
        await carregarTransferencias()

      } else {
        // Fallback local se não estiver logado
        if (bancos.value.length === 0) bancos.value = CONTAS_PADRAO
        if (cartoes.value.length === 0) cartoes.value = CARTOES_PADRAO
        if (categorias.value.length === 0) categorias.value = CATEGORIAS_PADRAO
      }
      carregadoInicial.value = true
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      carregando.value = false
    }
  }

  // ──────────────────────────────────────────
  // LANÇAMENTOS — CRUD COMPLETO
  // ──────────────────────────────────────────
  const adicionarLancamento = async (item: any) => {
    const contaEncontrada = bancos.value.find(b =>
      b.nome.toLowerCase().includes((item.conta || '').toLowerCase())
    ) || bancos.value[0]
    const catEncontrada = categorias.value.find(c =>
      c.nome.toLowerCase() === (item.categoria || '').toLowerCase()
    )

    const cartaoEncontrado = item.usarCartao ? cartoes.value.find(c => c.id === item.cartao_id) : null

    const formatado: Transacao = {
      id: `tr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      descricao: item.descricao,
      valor: Number(item.valor),
      tipo: item.tipo,
      data: item.data,
      categoria: item.categoria || 'Outros',
      conta: item.usarCartao ? '' : (item.conta || ''),
      cartao_id: item.usarCartao ? (item.cartao_id || null) : null,
      cartao_nome: cartaoEncontrado?.nome || '',
      observacao: item.observacao || '',
      pago: true,
      parcela_atual: item.parcela_atual || 1,
      total_parcelas: item.total_parcelas || 1
    }

    transacoes.value.unshift(formatado)

    // Atualiza saldo local se for conta corrente
    if (contaEncontrada && !item.usarCartao) {
      if (item.tipo === 'receita') contaEncontrada.saldo += Number(item.valor)
      else contaEncontrada.saldo -= Number(item.valor)
    }

    if (user.value) {
      try {
        const novoDado = {
          user_id: user.value.id,
          conta_id: item.usarCartao ? null : (contaEncontrada?.id || null),
          cartao_id: item.usarCartao && item.cartao_id ? item.cartao_id : null,
          categoria_id: catEncontrada?.id || null,
          descricao: item.descricao,
          valor: Number(item.valor),
          tipo: item.tipo,
          data: item.data,
          pago: true,
          observacao: item.observacao || null,
          parcela_atual: item.parcela_atual || 1,
          total_parcelas: item.total_parcelas || 1
        }

        const { data: inserido } = await db.from('transacoes').insert([novoDado]).select().single()
        if (inserido) formatado.id = inserido.id

        // Persiste saldo da conta
        if (!item.usarCartao && contaEncontrada?.id) {
          await db.from('contas').update({ saldo: contaEncontrada.saldo }).eq('id', contaEncontrada.id)
        }
      } catch (e) {
        console.error('Erro na sincronização Supabase:', e)
      }
    }
  }

  const editarLancamento = async (id: string, dados: Partial<Transacao>) => {
    const idx = transacoes.value.findIndex(t => t.id === id)
    if (idx === -1) return

    const antigo = transacoes.value[idx]!
    const contaEncontrada = bancos.value.find(b =>
      b.nome.toLowerCase().includes((dados.conta || antigo.conta || '').toLowerCase())
    )
    const catEncontrada = categorias.value.find(c =>
      c.nome.toLowerCase() === (dados.categoria || antigo.categoria || '').toLowerCase()
    )

    // Reverter saldo anterior
    if (antigo.conta_id && contaEncontrada) {
      if (antigo.tipo === 'receita') contaEncontrada.saldo -= antigo.valor
      else contaEncontrada.saldo += antigo.valor
    }

    // Aplicar novo saldo
    if (contaEncontrada && !dados.cartao_id) {
      const novoValor = Number(dados.valor ?? antigo.valor)
      const novoTipo = dados.tipo ?? antigo.tipo
      if (novoTipo === 'receita') contaEncontrada.saldo += novoValor
      else contaEncontrada.saldo -= novoValor
    }

    // Atualizar estado local
    transacoes.value[idx] = {
      ...antigo,
      ...dados,
      descricao: dados.descricao ?? antigo.descricao,
      valor: Number(dados.valor ?? antigo.valor),
      categoria: dados.categoria || antigo.categoria,
      conta: dados.conta || antigo.conta
    } as Transacao

    if (user.value && id && !id.startsWith('tr-')) {
      try {
        await db.from('transacoes').update({
          descricao: dados.descricao,
          valor: Number(dados.valor),
          tipo: dados.tipo,
          data: dados.data,
          categoria_id: catEncontrada?.id || antigo.categoria_id,
          conta_id: dados.conta_id || antigo.conta_id,
          observacao: dados.observacao,
          pago: dados.pago
        }).eq('id', id)

        if (contaEncontrada?.id) {
          await db.from('contas').update({ saldo: contaEncontrada.saldo }).eq('id', contaEncontrada.id)
        }
      } catch (e) {
        console.error('Erro ao editar lançamento:', e)
      }
    }
  }

  const removerLancamento = async (id: string) => {
    const item = transacoes.value.find(t => t.id === id)
    if (!item) return

    // Reverter saldo
    if (item.conta) {
      const conta = bancos.value.find(b => b.nome === item.conta || b.id === item.conta_id)
      if (conta) {
        if (item.tipo === 'receita') conta.saldo -= item.valor
        else conta.saldo += item.valor

        if (user.value && conta.id) {
          await db.from('contas').update({ saldo: conta.saldo }).eq('id', conta.id)
        }
      }
    }

    transacoes.value = transacoes.value.filter(t => t.id !== id)

    if (user.value && id && !id.startsWith('tr-')) {
      await db.from('transacoes').delete().eq('id', id)
    }
  }

  const adicionarLancamentosEmLote = async (itens: any[]) => {
    if (!itens || itens.length === 0) return

    const formatados: Transacao[] = []
    const paraBanco: any[] = []

    for (const item of itens) {
      const contaEncontrada = bancos.value.find(b =>
        b.nome.toLowerCase().includes((item.conta || '').toLowerCase())
      ) || bancos.value[0]
      const catEncontrada = categorias.value.find(c =>
        c.nome.toLowerCase() === (item.categoria || '').toLowerCase()
      )

      const cartaoIdValid = item.cartao_id && String(item.cartao_id).trim().length > 0 ? String(item.cartao_id) : null
      const cartaoEncontrado = cartaoIdValid ? cartoes.value.find(c => c.id === cartaoIdValid) : null

      const tempId = `tr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const formatado: Transacao = {
        id: tempId,
        descricao: item.descricao,
        valor: Number(item.valor),
        tipo: item.tipo,
        data: item.data,
        categoria: item.categoria || 'Outros',
        conta: cartaoIdValid ? '' : (item.conta || ''),
        cartao_id: cartaoIdValid,
        cartao_nome: cartaoEncontrado?.nome || item.cartao_nome || '',
        pago: true,
        parcela_atual: Number(item.parcela_atual || item.parcela?.atual || 1),
        total_parcelas: Number(item.total_parcelas || item.parcela?.total || 1)
      }

      formatados.push(formatado)

      if (contaEncontrada && !cartaoIdValid) {
        if (item.tipo === 'receita') contaEncontrada.saldo += Number(item.valor)
        else contaEncontrada.saldo -= Number(item.valor)
      }

      if (user.value) {
        paraBanco.push({
          user_id: user.value.id,
          conta_id: cartaoIdValid ? null : (contaEncontrada?.id || null),
          cartao_id: cartaoIdValid,
          categoria_id: catEncontrada?.id || null,
          descricao: item.descricao,
          valor: Number(item.valor),
          tipo: item.tipo,
          data: item.data,
          pago: true,
          parcela_atual: Number(item.parcela_atual || item.parcela?.atual || 1),
          total_parcelas: Number(item.total_parcelas || item.parcela?.total || 1)
        })
      }
    }

    transacoes.value = [...formatados, ...transacoes.value]

    const workspace = useWorkspace()

    if (user.value && paraBanco.length > 0) {
      try {
        const { data: inseridos, error } = await db
          .from('transacoes')
          .insert(paraBanco)
          .select('*, contas(nome), categorias(nome)')

        if (error) {
          console.error('Erro ao salvar lote no Supabase:', error)
        } else if (inseridos) {
          for (let idx = 0; idx < inseridos.length; idx++) {
            const ins = inseridos[idx]
            const orig = itens[idx]
            if (formatados[idx] && ins) {
              formatados[idx]!.id = ins.id
            }
            if (orig?.dividir5050 && ins?.id) {
              await workspace.criarRateio5050(ins.id, Number(ins.valor))
            }
          }
        }
      } catch (e) {
        console.error('Erro na requisição em lote Supabase:', e)
      }
    } else {
      for (let idx = 0; idx < formatados.length; idx++) {
        const orig = itens[idx]
        if (orig?.dividir5050 && formatados[idx]?.id) {
          await workspace.criarRateio5050(formatados[idx]!.id!, formatados[idx]!.valor)
        }
      }
    }
  }

  // ──────────────────────────────────────────
  // CONTAS — CRUD COMPLETO
  // ──────────────────────────────────────────
  const adicionarConta = async (novaConta: { nome: string; tipo: string; saldo: number; cor: string }) => {
    const local: Conta = { ...novaConta, saldo: Number(novaConta.saldo) }
    bancos.value.push(local)

    if (user.value) {
      try {
        const { data } = await db.from('contas').insert([{ ...novaConta, user_id: user.value.id }]).select().single()
        if (data) local.id = data.id
      } catch (e) {
        console.error('Erro ao adicionar conta:', e)
      }
    }
  }

  const editarConta = async (id: string, dados: Partial<Conta>) => {
    const idx = bancos.value.findIndex(b => b.id === id)
    if (idx === -1) return
    bancos.value[idx] = { ...bancos.value[idx]!, ...dados, saldo: Number(dados.saldo ?? bancos.value[idx]!.saldo) } as Conta

    if (user.value) {
      await db.from('contas').update({
        nome: dados.nome,
        tipo: dados.tipo,
        saldo: Number(dados.saldo),
        cor: dados.cor
      }).eq('id', id)
    }
  }

  const excluirConta = async (id: string) => {
    bancos.value = bancos.value.filter(b => b.id !== id)
    if (user.value) {
      await db.from('contas').delete().eq('id', id)
    }
  }

  // ──────────────────────────────────────────
  // CARTÕES — CRUD COMPLETO
  // ──────────────────────────────────────────
  const obterOuCriarCartao = async (dados: { nome: string; bandeira?: string; cor?: string }): Promise<Cartao> => {
    const nomeNorm = dados.nome.toLowerCase()
    const existente = cartoes.value.find(c => c.nome.toLowerCase().includes(nomeNorm) || nomeNorm.includes(c.nome.toLowerCase()))
    if (existente) return existente

    const novo = {
      nome: dados.nome,
      bandeira: dados.bandeira || 'Mastercard',
      limite: 5000.00,
      dia_fechamento: 1,
      dia_vencimento: 10,
      cor: dados.cor || '#820ad1'
    }
    await adicionarCartao(novo)
    return cartoes.value[cartoes.value.length - 1] || { ...novo, id: `card-${Date.now()}` }
  }

  const obterOuCriarConta = async (dados: { nome: string; cor?: string }): Promise<Conta> => {
    const nomeNorm = dados.nome.toLowerCase()
    const existente = bancos.value.find(b => b.nome.toLowerCase().includes(nomeNorm) || nomeNorm.includes(b.nome.toLowerCase()))
    if (existente) return existente

    const novo = {
      nome: dados.nome,
      tipo: 'Conta Corrente',
      saldo: 0,
      cor: dados.cor || '#3ecf8e'
    }
    await adicionarConta(novo)
    return bancos.value[bancos.value.length - 1] || { ...novo, id: `banco-${Date.now()}` }
  }

  const adicionarCartao = async (novoCartao: { nome: string; bandeira: string; limite: number; dia_fechamento: number; dia_vencimento: number; cor: string }) => {
    const local: Cartao = { ...novoCartao, limite: Number(novoCartao.limite) }
    cartoes.value.push(local)

    if (user.value) {
      try {
        const { data } = await db.from('cartoes').insert([{ ...novoCartao, user_id: user.value.id }]).select().single()
        if (data) local.id = data.id
      } catch (e) {
        console.error('Erro ao adicionar cartão:', e)
      }
    }
  }

  const editarCartao = async (id: string, dados: Partial<Cartao>) => {
    const idx = cartoes.value.findIndex(c => c.id === id)
    if (idx === -1) return
    cartoes.value[idx] = { ...cartoes.value[idx]!, ...dados, limite: Number(dados.limite ?? cartoes.value[idx]!.limite) } as Cartao

    if (user.value) {
      await db.from('cartoes').update({
        nome: dados.nome,
        bandeira: dados.bandeira,
        limite: Number(dados.limite),
        dia_fechamento: dados.dia_fechamento,
        dia_vencimento: dados.dia_vencimento,
        cor: dados.cor
      }).eq('id', id)
    }
  }

  const excluirCartao = async (id: string) => {
    cartoes.value = cartoes.value.filter(c => c.id !== id)
    if (user.value) {
      await db.from('cartoes').delete().eq('id', id)
    }
  }

  // ──────────────────────────────────────────
  // CATEGORIAS — CRUD COMPLETO
  // ──────────────────────────────────────────
  const adicionarCategoria = async (novaCat: { nome: string; tipo: 'receita' | 'despesa'; icone: string; cor: string; essencial?: boolean }) => {
    const local: Categoria = { ...novaCat }
    categorias.value.push(local)

    if (user.value) {
      try {
        const { data } = await db.from('categorias').insert([{ ...novaCat, user_id: user.value.id }]).select().single()
        if (data) local.id = data.id
      } catch (e) {
        console.error('Erro ao adicionar categoria:', e)
      }
    }
  }

  const editarCategoria = async (id: string, dados: Partial<Categoria>) => {
    const idx = categorias.value.findIndex(c => c.id === id)
    if (idx === -1) return
    categorias.value[idx] = { ...categorias.value[idx]!, ...dados } as Categoria

    if (user.value) {
      await db.from('categorias').update({
        nome: dados.nome,
        tipo: dados.tipo,
        icone: dados.icone,
        cor: dados.cor,
        essencial: dados.essencial
      }).eq('id', id)
    }
  }

  const excluirCategoria = async (id: string) => {
    categorias.value = categorias.value.filter(c => c.id !== id)
    if (user.value) {
      await db.from('categorias').delete().eq('id', id)
    }
  }

  // ──────────────────────────────────────────
  // ORÇAMENTOS — CRUD COMPLETO
  // ──────────────────────────────────────────
  const carregarOrcamentos = async (mes: number, ano: number) => {
    if (!user.value) return
    const { data } = await db
      .from('orcamentos')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('mes', mes)
      .eq('ano', ano)
    if (data) orcamentos.value = data as Orcamento[]
  }

  const salvarOrcamento = async (dados: Omit<Orcamento, 'id' | 'user_id'>) => {
    const existente = orcamentos.value.find(o =>
      o.categoria_nome === dados.categoria_nome &&
      o.mes === dados.mes &&
      o.ano === dados.ano
    )

    if (existente) {
      const idx = orcamentos.value.findIndex(o => o.id === existente.id)
      orcamentos.value[idx] = { ...existente, ...dados }

      if (user.value && existente.id) {
        await db.from('orcamentos').update({ limite: dados.limite }).eq('id', existente.id)
      }
    } else {
      const novoOrc: Orcamento = { ...dados }
      orcamentos.value.push(novoOrc)

      if (user.value) {
        const { data } = await db.from('orcamentos').insert([{
          ...dados,
          user_id: user.value.id
        }]).select().single()
        if (data) novoOrc.id = data.id
      }
    }
  }

  const excluirOrcamento = async (id: string) => {
    orcamentos.value = orcamentos.value.filter(o => o.id !== id)
    if (user.value) {
      await db.from('orcamentos').delete().eq('id', id)
    }
  }

  // ──────────────────────────────────────────
  // METAS DE ECONOMIA — CRUD COMPLETO
  // ──────────────────────────────────────────
  const carregarMetas = async () => {
    if (!user.value) return
    const { data } = await db.from('metas').select('*').eq('user_id', user.value.id).order('created_at', { ascending: true })
    if (data) metas.value = data.map((m: any) => ({ ...m, alvo: Number(m.alvo), atual: Number(m.atual) }))
  }

  const salvarMeta = async (dados: Omit<Meta, 'id' | 'user_id'>) => {
    const novaMeta: Meta = { ...dados, atual: 0 }
    metas.value.push(novaMeta)

    if (user.value) {
      const { data } = await db.from('metas').insert([{ ...dados, user_id: user.value.id }]).select().single()
      if (data) novaMeta.id = data.id
    }
  }

  const editarMeta = async (id: string, dados: Partial<Meta>) => {
    const idx = metas.value.findIndex(m => m.id === id)
    if (idx === -1) return
    metas.value[idx] = { ...metas.value[idx]!, ...dados } as Meta

    if (user.value) {
      await db.from('metas').update({
        titulo: dados.titulo,
        icone: dados.icone,
        alvo: dados.alvo,
        prazo: dados.prazo,
        cor: dados.cor
      }).eq('id', id)
    }
  }

  const aportarNaMeta = async (id: string, valor: number) => {
    const idx = metas.value.findIndex(m => m.id === id)
    if (idx === -1) return
    const meta = metas.value[idx]!
    meta.atual += valor

    if (user.value) {
      await db.from('metas').update({ atual: meta.atual }).eq('id', id)
    }
  }

  const excluirMeta = async (id: string) => {
    metas.value = metas.value.filter(m => m.id !== id)
    if (user.value) {
      await db.from('metas').delete().eq('id', id)
    }
  }

  // ──────────────────────────────────────────
  // TRANSFERÊNCIAS ENTRE CONTAS
  // ──────────────────────────────────────────
  const carregarTransferencias = async () => {
    if (!user.value) return
    const { data } = await db
      .from('transferencias')
      .select('*, contas_origem:conta_origem_id(nome), contas_destino:conta_destino_id(nome)')
      .eq('user_id', user.value.id)
      .order('data', { ascending: false })

    if (data) {
      transferencias.value = data.map((t: any) => ({
        ...t,
        valor: Number(t.valor),
        conta_origem_nome: t.contas_origem?.nome || '',
        conta_destino_nome: t.contas_destino?.nome || ''
      }))
    }
  }

  const transferirEntreContas = async (dados: { conta_origem_id: string; conta_destino_id: string; valor: number; descricao?: string; data: string }) => {
    const origem = bancos.value.find(b => b.id === dados.conta_origem_id)
    const destino = bancos.value.find(b => b.id === dados.conta_destino_id)
    if (!origem || !destino) return

    const valor = Number(dados.valor)
    origem.saldo -= valor
    destino.saldo += valor

    const novaTransf: Transferencia = {
      ...dados,
      conta_origem_nome: origem.nome,
      conta_destino_nome: destino.nome
    }
    transferencias.value.unshift(novaTransf)

    if (user.value) {
      try {
        const { data } = await db.from('transferencias').insert([{
          ...dados,
          user_id: user.value.id
        }]).select().single()
        if (data) novaTransf.id = data.id

        await db.from('contas').update({ saldo: origem.saldo }).eq('id', origem.id)
        await db.from('contas').update({ saldo: destino.saldo }).eq('id', destino.id)
      } catch (e) {
        console.error('Erro ao transferir:', e)
      }
    }
  }

  // ──────────────────────────────────────────
  // RETURN
  // ──────────────────────────────────────────
  return {
    // Estado
    transacoes,
    bancos,
    cartoes,
    categorias,
    orcamentos,
    metas,
    transferencias,
    carregando,
    carregarTudo,

    // Lançamentos
    adicionarLancamento,
    editarLancamento,
    removerLancamento,
    adicionarLancamentosEmLote,

    // Contas
    adicionarConta,
    editarConta,
    excluirConta,
    obterOuCriarConta,

    // Cartões
    adicionarCartao,
    editarCartao,
    excluirCartao,
    obterOuCriarCartao,

    // Categorias
    adicionarCategoria,
    editarCategoria,
    excluirCategoria,

    // Orçamentos
    carregarOrcamentos,
    salvarOrcamento,
    excluirOrcamento,

    // Metas
    carregarMetas,
    salvarMeta,
    editarMeta,
    aportarNaMeta,
    excluirMeta,

    // Transferências
    carregarTransferencias,
    transferirEntreContas
  }
}
