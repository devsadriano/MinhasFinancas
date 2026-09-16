<template>
  <div class="space-y-6">
    <!-- Header com estatísticas gerais e ação -->
    <div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-5 md:p-6 backdrop-blur-sm shadow-supabase flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-brand animate-pulse"></span>
          <h2 class="text-lg font-bold text-white tracking-tight">Metas Compartilhadas (Caixinhas)</h2>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          Guarde dinheiro junto com seu parceiro(a) e acompanhe quem mais contribuiu para cada objetivo.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-[11px] text-gray-400 font-medium">Total Guardado em Caixinhas</p>
          <p class="text-base font-extrabold text-brand font-mono">
            R$ {{ totalGeralGuardado.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </p>
        </div>

        <button
          @click="abrirModalNovaMeta"
          class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-glow-emerald flex items-center gap-2 cursor-pointer shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nova Meta</span>
        </button>
      </div>
    </div>

    <!-- Grid de Caixinhas -->
    <div v-if="metas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="meta in metasComEstatisticas"
        :key="meta.id"
        class="bg-dark-800/90 border border-dark-700/80 hover:border-brand/40 rounded-2xl p-5 backdrop-blur-md shadow-supabase flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] group relative overflow-hidden"
      >
        <!-- Brilho no topo -->
        <div 
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
          :style="{ backgroundImage: `linear-gradient(to right, ${meta.cor}, #3ecf8e)` }"
        ></div>

        <div>
          <!-- Top Card Header -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-inner transition-transform group-hover:scale-105"
                :style="{ backgroundColor: `${meta.cor}18`, borderColor: `${meta.cor}40` }"
              >
                {{ meta.icone || '🎯' }}
              </div>
              <div>
                <h3 class="text-sm font-bold text-white group-hover:text-brand transition-colors leading-snug">
                  {{ meta.titulo }}
                </h3>
                <p v-if="meta.prazo_data" class="text-[11px] text-gray-400 font-mono mt-0.5">
                  Prazo: {{ formatarData(meta.prazo_data) }}
                </p>
              </div>
            </div>

            <span 
              class="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full border border-dark-600 bg-dark-900/60"
              :class="meta.porcentagem >= 100 ? 'text-income border-income/30 bg-income/10' : 'text-purple-300 border-purple-500/30'"
            >
              {{ meta.porcentagem.toFixed(1) }}%
            </span>
          </div>

          <!-- Barra de Progresso -->
          <div class="space-y-1.5 mb-4">
            <div class="w-full h-3 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-dark-700">
              <div
                class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-brand via-emerald-400 to-emerald-300 shadow-glow-emerald"
                :style="{ width: `${Math.min(100, meta.porcentagem)}%` }"
              ></div>
            </div>

            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-gray-300 font-bold">
                R$ {{ meta.totalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </span>
              <span class="text-gray-500">
                de R$ {{ Number(meta.valor_alvo).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
          </div>

          <!-- Breakdown de Contribuições de Casal -->
          <div class="bg-dark-900/70 border border-dark-750 rounded-xl p-3 space-y-2 mb-4">
            <p class="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1.5">
              <span>👥</span> Divisão de Aportes
            </p>
            
            <div class="grid grid-cols-2 gap-2 text-xs">
              <!-- Você -->
              <div class="bg-dark-800/80 p-2 rounded-lg border border-dark-700/60">
                <span class="text-[10px] text-gray-400 block truncate">Você</span>
                <span class="text-xs font-extrabold font-mono text-emerald-400">
                  R$ {{ meta.aporteVoce.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </span>
              </div>

              <!-- Parceiro(a) -->
              <div class="bg-dark-800/80 p-2 rounded-lg border border-dark-700/60">
                <span class="text-[10px] text-gray-400 block truncate">{{ nomeParceiro }}</span>
                <span class="text-xs font-extrabold font-mono text-purple-300">
                  R$ {{ meta.aporteParceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão de Aporte -->
        <button
          @click="abrirModalAporte(meta)"
          class="w-full bg-dark-750 hover:bg-brand hover:text-dark-950 text-gray-200 border border-dark-600 hover:border-brand font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Aportar Dinheiro</span>
        </button>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div v-else class="bg-dark-800/50 border border-dashed border-dark-700 rounded-2xl p-12 text-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center mx-auto text-3xl">
        🎯
      </div>
      <div>
        <h3 class="text-base font-bold text-white">Nenhuma meta criada ainda</h3>
        <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Crie caixinhas para viagens, reforma da casa, reservas de emergência ou compra de bens.
        </p>
      </div>
      <button
        @click="abrirModalNovaMeta"
        class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-glow-emerald"
      >
        + Criar Primeira Meta
      </button>
    </div>

    <!-- Modal 1: Realizar Aporte -->
    <div v-if="modalAporteAberto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div class="flex items-center justify-between border-b border-dark-700 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ metaSelecionada?.icone || '🎯' }}</span>
            <h3 class="text-base font-bold text-white">Aportar em {{ metaSelecionada?.titulo }}</h3>
          </div>
          <button @click="modalAporteAberto = false" class="text-gray-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        <form @submit.prevent="confirmarAporte" class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-300 font-semibold mb-1">Valor do Aporte (R$)</label>
            <input
              v-model.number="formAporte.valor"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="Ex: 250.00"
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-brand"
            />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Debitar da Conta</label>
            <select
              v-model="formAporte.contaId"
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-brand"
            >
              <option v-for="banco in bancos" :key="banco.id || banco.nome" :value="banco.id || banco.nome">
                {{ banco.nome }} (Saldo: R$ {{ Number(banco.saldo).toFixed(2) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Data do Aporte</label>
            <input
              v-model="formAporte.data"
              type="date"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand"
            />
          </div>

          <div class="pt-2 flex items-center justify-end gap-3 border-t border-dark-700">
            <button
              type="button"
              @click="modalAporteAberto = false"
              class="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="salvando"
              class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2 rounded-xl transition-all shadow-glow-emerald disabled:opacity-50"
            >
              {{ salvando ? 'Aportando...' : 'Confirmar Aporte' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Nova Meta -->
    <div v-if="modalNovaMetaAberto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div class="flex items-center justify-between border-b border-dark-700 pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span>🎯</span> Criar Nova Meta de Casal
          </h3>
          <button @click="modalNovaMetaAberto = false" class="text-gray-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        <form @submit.prevent="confirmarNovaMeta" class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-300 font-semibold mb-1">Título da Meta</label>
            <input
              v-model="formNovaMeta.titulo"
              type="text"
              required
              placeholder="Ex: Viagem de Férias, Reforma da Cozinha"
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand font-medium"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-300 font-semibold mb-1">Valor Alvo (R$)</label>
              <input
                v-model.number="formNovaMeta.valor_alvo"
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="Ex: 5000"
                class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label class="block text-gray-300 font-semibold mb-1">Ícone Emoji</label>
              <select
                v-model="formNovaMeta.icone"
                class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand text-sm"
              >
                <option value="🌴">🌴 Viagem</option>
                <option value="🚗">🚗 Veículo</option>
                <option value="🏠">🏠 Casa / Imóvel</option>
                <option value="💍">💍 Casamento</option>
                <option value="🛡️">🛡️ Reserva Emergência</option>
                <option value="🎓">🎓 Estudos</option>
                <option value="💻">💻 Eletrônicos</option>
                <option value="🎯">🎯 Outros</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Prazo Desejado (Opcional)</label>
            <input
              v-model="formNovaMeta.prazo_data"
              type="date"
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand"
            />
          </div>

          <div class="pt-2 flex items-center justify-end gap-3 border-t border-dark-700">
            <button
              type="button"
              @click="modalNovaMetaAberto = false"
              class="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="salvando"
              class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2 rounded-xl transition-all shadow-glow-emerald disabled:opacity-50"
            >
              {{ salvando ? 'Criando...' : 'Criar Meta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'
import { useWorkspace } from '~/composables/useWorkspace'
import type { MetaCompartilhada, AporteMeta } from '~/types/database.types'

const { bancos, adicionarLancamento, carregarTudo } = useFinancas()
const { grupoAtivo, membrosGrupo } = useWorkspace()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const db = supabase as any

const metas = ref<MetaCompartilhada[]>([])
const aportesGlobal = ref<AporteMeta[]>([])
const salvando = ref(false)

const modalAporteAberto = ref(false)
const modalNovaMetaAberto = ref(false)
const metaSelecionada = ref<MetaCompartilhada | null>(null)

const formAporte = ref({
  valor: 100,
  contaId: '',
  data: new Date().toISOString().substring(0, 10)
})

const formNovaMeta = ref({
  titulo: '',
  valor_alvo: 5000,
  icone: '🌴',
  cor: '#3ecf8e',
  prazo_data: ''
})

// Metas padrão para demonstração inicial se o banco estiver vazio
const METAS_DEMO: MetaCompartilhada[] = [
  {
    id: 'm-demo-1',
    titulo: 'Viagem para Cancún 🌴',
    valor_alvo: 12000,
    icone: '🌴',
    cor: '#3ecf8e',
    prazo_data: '2027-01-15'
  },
  {
    id: 'm-demo-2',
    titulo: 'Reserva de Emergência 🏠',
    valor_alvo: 30000,
    icone: '🏠',
    cor: '#820ad1',
    prazo_data: '2027-12-31'
  },
  {
    id: 'm-demo-3',
    titulo: 'Troca do Carro 🚗',
    valor_alvo: 25000,
    icone: '🚗',
    cor: '#f59e0b',
    prazo_data: '2026-11-30'
  }
]

const APORTES_DEMO: AporteMeta[] = [
  { id: 'ap-1', meta_id: 'm-demo-1', user_id: 'user-demo-1', valor: 3500, data: '2026-08-01' },
  { id: 'ap-2', meta_id: 'm-demo-1', user_id: 'user-demo-2', valor: 2800, data: '2026-08-15' },
  { id: 'ap-3', meta_id: 'm-demo-2', user_id: 'user-demo-1', valor: 8000, data: '2026-07-10' },
  { id: 'ap-4', meta_id: 'm-demo-2', user_id: 'user-demo-2', valor: 9500, data: '2026-08-05' }
]

const carregarMetasEAportes = async () => {
  await carregarTudo()
  if (bancos.value.length > 0 && !formAporte.value.contaId) {
    formAporte.value.contaId = bancos.value[0]?.id || bancos.value[0]?.nome || ''
  }

  if (!user.value) {
    metas.value = METAS_DEMO
    aportesGlobal.value = APORTES_DEMO
    return
  }

  try {
    const { data: metasData } = await db
      .from('metas')
      .select('*')
      .order('created_at', { ascending: true })

    if (metasData && metasData.length > 0) {
      metas.value = metasData as MetaCompartilhada[]

      const metaIds = metas.value.map(m => m.id)
      const { data: aportesData } = await db
        .from('aportes_meta')
        .select('*')
        .in('meta_id', metaIds)

      if (aportesData) {
        aportesGlobal.value = aportesData as AporteMeta[]
      }
    } else {
      metas.value = METAS_DEMO
      aportesGlobal.value = APORTES_DEMO
    }
  } catch (err) {
    console.error('Erro ao carregar metas compartilhadas:', err)
    metas.value = METAS_DEMO
    aportesGlobal.value = APORTES_DEMO
  }
}

onMounted(() => {
  carregarMetasEAportes()
})

const nomeParceiro = computed(() => {
  if (!membrosGrupo.value || membrosGrupo.value.length < 2) return 'Parceiro(a)'
  const parceiro = membrosGrupo.value.find(m => m.user_id !== user.value?.id)
  return parceiro?.perfil?.nome || 'Parceiro(a)'
})

const metasComEstatisticas = computed(() => {
  return metas.value.map(meta => {
    const aportesDaMeta = aportesGlobal.value.filter(a => a.meta_id === meta.id)
    const totalAcumulado = aportesDaMeta.reduce((acc, a) => acc + Number(a.valor), 0)
    const porcentagem = meta.valor_alvo > 0 ? (totalAcumulado / Number(meta.valor_alvo)) * 100 : 0

    const currentUserId = user.value?.id || 'user-demo-1'
    const aporteVoce = aportesDaMeta
      .filter(a => a.user_id === currentUserId)
      .reduce((acc, a) => acc + Number(a.valor), 0)

    const aporteParceiro = aportesDaMeta
      .filter(a => a.user_id !== currentUserId)
      .reduce((acc, a) => acc + Number(a.valor), 0)

    return {
      ...meta,
      totalAcumulado,
      porcentagem,
      aporteVoce,
      aporteParceiro
    }
  })
})

const totalGeralGuardado = computed(() => {
  return metasComEstatisticas.value.reduce((acc, m) => acc + m.totalAcumulado, 0)
})

const abrirModalAporte = (meta: MetaCompartilhada) => {
  metaSelecionada.value = meta
  formAporte.value.valor = 100
  if (bancos.value.length > 0) {
    formAporte.value.contaId = bancos.value[0]?.id || bancos.value[0]?.nome || ''
  }
  modalAporteAberto.value = true
}

const abrirModalNovaMeta = () => {
  formNovaMeta.value = {
    titulo: '',
    valor_alvo: 5000,
    icone: '🌴',
    cor: '#3ecf8e',
    prazo_data: ''
  }
  modalNovaMetaAberto.value = true
}

const confirmarAporte = async () => {
  if (!metaSelecionada.value || formAporte.value.valor <= 0) return

  salvando.value = true
  try {
    const userId = user.value?.id || 'user-demo-1'
    const conta = bancos.value.find(b => b.id === formAporte.value.contaId || b.nome === formAporte.value.contaId)

    const novoAporte: AporteMeta = {
      id: `ap-${Date.now()}`,
      meta_id: metaSelecionada.value.id,
      user_id: userId,
      conta_origem_id: conta?.id || null,
      valor: Number(formAporte.value.valor),
      data: formAporte.value.data
    }

    // 1. Salvar aporte localmente
    aportesGlobal.value.push(novoAporte)

    // 2. Criar transação de saída no fluxo de caixa geral
    await adicionarLancamento({
      descricao: `Aporte Meta: ${metaSelecionada.value.titulo}`,
      valor: Number(formAporte.value.valor),
      tipo: 'despesa',
      categoria: 'Investimentos',
      conta: conta?.nome || '',
      data: formAporte.value.data,
      observacao: `Aporte direcionado para a caixinha ${metaSelecionada.value.titulo}`
    })

    // 3. Persistir no Supabase se logado
    if (user.value && !metaSelecionada.value.id.startsWith('m-demo-')) {
      await db.from('aportes_meta').insert([{
        meta_id: metaSelecionada.value.id,
        user_id: user.value.id,
        conta_origem_id: conta?.id || null,
        valor: Number(formAporte.value.valor),
        data: formAporte.value.data
      }])
    }

    modalAporteAberto.value = false
  } catch (err) {
    console.error('Erro ao registrar aporte:', err)
  } finally {
    salvando.value = false
  }
}

const confirmarNovaMeta = async () => {
  if (!formNovaMeta.value.titulo || formNovaMeta.value.valor_alvo <= 0) return

  salvando.value = true
  try {
    const novaMeta: MetaCompartilhada = {
      id: `m-${Date.now()}`,
      grupo_id: grupoAtivo.value?.id,
      user_criador_id: user.value?.id || 'user-demo-1',
      titulo: formNovaMeta.value.titulo,
      valor_alvo: Number(formNovaMeta.value.valor_alvo),
      icone: formNovaMeta.value.icone,
      cor: formNovaMeta.value.cor,
      prazo_data: formNovaMeta.value.prazo_data || null
    }

    metas.value.push(novaMeta)

    if (user.value && grupoAtivo.value) {
      const { data } = await db.from('metas').insert([{
        grupo_id: grupoAtivo.value.id,
        user_criador_id: user.value.id,
        titulo: formNovaMeta.value.titulo,
        valor_alvo: Number(formNovaMeta.value.valor_alvo),
        icone: formNovaMeta.value.icone,
        cor: formNovaMeta.value.cor,
        prazo_data: formNovaMeta.value.prazo_data || null
      }]).select().single()

      if (data) {
        novaMeta.id = data.id
      }
    }

    modalNovaMetaAberto.value = false
  } catch (err) {
    console.error('Erro ao criar meta:', err)
  } finally {
    salvando.value = false
  }
}

const formatarData = (str?: string | null) => {
  if (!str) return ''
  const parts = str.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str
}
</script>
