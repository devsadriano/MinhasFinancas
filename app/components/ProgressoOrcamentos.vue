<template>
  <div class="bg-dark-800/90 border border-dark-700/80 rounded-2xl p-5 md:p-6 shadow-supabase space-y-5 backdrop-blur-md">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3 border-b border-dark-700/60 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand text-lg font-bold">
          🎯
        </div>
        <div>
          <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Teto de Gastos do Casal
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-dark-900 text-gray-300 border border-dark-700">
              {{ periodoLabel }}
            </span>
          </h3>
          <p class="text-xs text-gray-400">Controle de orçamentos por categoria (despesas reais)</p>
        </div>
      </div>

      <button
        type="button"
        @click="modalAberto = true"
        class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-glow-emerald flex items-center gap-1.5 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Definir Teto</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="py-8 text-center text-brand">
      <svg class="animate-spin h-7 w-7 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Empty State -->
      <div v-if="orcamentosComProgresso.length === 0" class="py-8 text-center space-y-2">
        <p class="text-white font-bold text-sm">Nenhum orçamento definido para {{ periodoLabel }}</p>
        <p class="text-xs text-gray-400">Estipule limites de gastos para evitar surpresas no final do mês!</p>
        <button
          @click="modalAberto = true"
          class="text-brand text-xs font-bold hover:underline mt-1"
        >
          + Definir Primeiro Orçamento
        </button>
      </div>

      <!-- Lista de Orçamentos -->
      <div v-else class="space-y-4">
        <div
          v-for="item in orcamentosComProgresso"
          :key="item.orcamento_id || item.categoria_nome"
          class="p-4 rounded-xl bg-dark-900/80 border border-dark-700/80 hover:border-dark-600 transition-all space-y-2.5 group"
        >
          <!-- Top Row: Ícone, Nome, Valores e Badge -->
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5">
              <span
                class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base border shrink-0 transition-transform group-hover:scale-105"
                :style="{ backgroundColor: (item.cor || '#3b82f6') + '20', borderColor: (item.cor || '#3b82f6') + '40', color: item.cor }"
              >
                {{ item.icone || '🏷️' }}
              </span>
              <div>
                <h4 class="font-bold text-white leading-tight">{{ item.categoria_nome }}</h4>
                <p class="text-[11px] text-gray-400 font-mono mt-0.5">
                  Gasto: <strong class="text-white">R$ {{ Number(item.total_gasto).toFixed(2) }}</strong> de R$ {{ Number(item.limite).toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Porcentagem Badge -->
            <span
              class="px-2.5 py-1 rounded-lg font-mono font-bold text-xs border"
              :class="getBadgeClass(item.porcentagem_utilizada)"
            >
              {{ item.porcentagem_utilizada.toFixed(0) }}%
            </span>
          </div>

          <!-- Micro-animada Progress Bar -->
          <div class="w-full bg-dark-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-dark-700/60">
            <div
              class="h-full rounded-full transition-all duration-500 ease-out"
              :class="getBarColorClass(item.porcentagem_utilizada)"
              :style="{ width: montado ? `${Math.min(item.porcentagem_utilizada, 100)}%` : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Definir Orçamento -->
    <ModalDefinirOrcamento
      :aberto="modalAberto"
      :mes="mes"
      :ano="ano"
      @fechar="modalAberto = false"
      @salvo="carregarProgresso"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFinancas } from '~/composables/useFinancas'
import { useWorkspace } from '~/composables/useWorkspace'

const props = withDefaults(
  defineProps<{
    mes?: number
    ano?: number
  }>(),
  {
    mes: () => new Date().getMonth() + 1,
    ano: () => new Date().getFullYear()
  }
)

const { transacoes, categorias, orcamentos, carregarOrcamentos } = useFinancas()
const { grupoAtivo } = useWorkspace()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const db = supabase as any

const montado = ref(false)
const carregando = ref(false)
const modalAberto = ref(false)
const dadosRpc = ref<any[]>([])

const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const periodoLabel = computed(() => `${nomesMeses[props.mes - 1]} ${props.ano}`)

const carregarProgresso = async () => {
  carregando.value = true
  try {
    if (user.value) {
      // 1. Tenta buscar via RPC do Supabase
      const { data, error } = await db.rpc('obter_progresso_orcamentos', {
        p_grupo_id: grupoAtivo.value?.id || null,
        p_mes: props.mes,
        p_ano: props.ano
      })

      if (!error && data) {
        dadosRpc.value = data
      } else {
        // Fallback Supabase tradicional
        await carregarOrcamentos(props.mes, props.ano)
        dadosRpc.value = []
      }
    }
  } catch (e) {
    console.error('Erro ao carregar progresso de orçamentos:', e)
  } finally {
    carregando.value = false
  }
}

// Calculo em memória como fallback inteligente
const orcamentosComProgresso = computed(() => {
  if (dadosRpc.value.length > 0) return dadosRpc.value

  return orcamentos.value
    .filter(o => o.mes === props.mes && o.ano === props.ano)
    .map(o => {
      const cat = categorias.value.find(c => c.nome === o.categoria_nome || c.id === o.categoria_id)
      const totalGasto = transacoes.value
        .filter(t => {
          if (t.tipo !== 'despesa') return false // Ignora receitas e transferencia_interna
          const [ano, mes] = (t.data || '').split('-').map(Number)
          if (mes !== props.mes || ano !== props.ano) return false
          return t.categoria === o.categoria_nome || t.categoria_id === o.categoria_id
        })
        .reduce((acc, t) => acc + t.valor, 0)

      const perc = o.limite > 0 ? (totalGasto / o.limite) * 100 : 0
      return {
        orcamento_id: o.id,
        categoria_id: o.categoria_id,
        categoria_nome: o.categoria_nome,
        icone: cat?.icone || o.icone || '🏷️',
        cor: cat?.cor || o.cor || '#3b82f6',
        limite: o.limite,
        total_gasto: totalGasto,
        porcentagem_utilizada: perc
      }
    })
    .sort((a, b) => b.porcentagem_utilizada - a.porcentagem_utilizada)
})

const getBarColorClass = (perc: number) => {
  if (perc >= 95) return 'bg-red-500 shadow-glow-red'
  if (perc >= 75) return 'bg-amber-500 shadow-glow-amber'
  return 'bg-emerald-500 shadow-glow-emerald'
}

const getBadgeClass = (perc: number) => {
  if (perc >= 95) return 'bg-red-500/15 border-red-500/40 text-red-400'
  if (perc >= 75) return 'bg-amber-500/15 border-amber-500/40 text-amber-400'
  return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
}

onMounted(async () => {
  await carregarProgresso()
  // Ativa a micro-animação da barra após 100ms
  setTimeout(() => { montado.value = true }, 100)
})

watch(() => [props.mes, props.ano, grupoAtivo.value?.id], () => {
  carregarProgresso()
})
</script>
