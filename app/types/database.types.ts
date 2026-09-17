export type TipoTransacao = 'receita' | 'despesa' | 'transferencia_interna'
export type PapelMembro = 'admin' | 'membro'
export type FrequenciaRecorrencia = 'semanal' | 'mensal' | 'anual'

export interface Perfil {
  id: string
  nome: string
  email: string
  moeda: string
  created_at?: string
}

export interface GrupoFamiliar {
  id: string
  nome: string
  user_criador_id: string
  created_at?: string
}

export interface MembroGrupo {
  id?: string
  grupo_id: string
  user_id: string
  papel: PapelMembro
  created_at?: string
  // Joins
  perfil?: Perfil
  perfis?: Perfil
}

export interface Conta {
  id?: string
  user_id?: string
  grupo_id?: string | null
  nome: string
  tipo: string
  saldo: number
  cor: string
  created_at?: string
}

export interface Cartao {
  id?: string
  user_id?: string
  grupo_id?: string | null
  nome: string
  bandeira: string
  limite: number
  dia_fechamento: number
  dia_vencimento: number
  cor: string
  created_at?: string
}

export interface Categoria {
  id?: string
  user_id?: string | null
  grupo_id?: string | null
  nome: string
  tipo: 'receita' | 'despesa'
  icone: string
  cor: string
  essencial?: boolean
  totalItens?: number
  created_at?: string
}

export interface RateioTransacao {
  id?: string
  transacao_id: string
  user_id: string
  valor: number
  porcentagem?: number
  created_at?: string
  // Joins
  perfil?: Perfil
}

export interface Transacao {
  id?: string
  user_id?: string
  grupo_id?: string | null
  conta_id?: string | null
  cartao_id?: string | null
  categoria_id?: string | null
  descricao: string
  valor: number
  tipo: TipoTransacao
  data: string
  pago?: boolean
  observacao?: string | null
  parcela_atual?: number
  total_parcelas?: number
  created_at?: string

  // Enriquecidos (Joins)
  categoria?: string
  conta?: string
  cartao_nome?: string
  rateios?: RateioTransacao[]
  pagador_nome?: string
}

export interface TransacaoRecorrente {
  id?: string
  grupo_id: string
  user_id: string
  conta_id?: string | null
  cartao_id?: string | null
  categoria_id?: string | null
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
  frequencia: FrequenciaRecorrencia
  dia_vencimento: number
  dividir_50_50: boolean
  ativo: boolean
  created_at?: string
}

export interface AcertoDeContasView {
  grupo_id: string
  user_id: string
  total_pago: number
  total_consumido: number
  total_liquidado: number
  saldo_acerto: number // + a receber, - a pagar
  perfil?: Perfil
}

export interface ResultadoCalculoAcerto {
  devedor_id: string
  devedor_nome: string
  credor_id: string
  credor_nome: string
  valor_diferenca: number
  status: 'equilibrado' | 'pendente'
}

export interface AporteMeta {
  id?: string
  meta_id: string
  user_id: string
  conta_origem_id?: string | null
  valor: number
  data: string
  created_at?: string
  perfil?: Perfil
}

export interface MetaCompartilhada {
  id: string
  grupo_id?: string
  user_criador_id?: string
  titulo: string
  valor_alvo: number
  icone: string
  cor: string
  prazo_data?: string | null
  created_at?: string
  aportes?: AporteMeta[]
  total_acumulado?: number
}
