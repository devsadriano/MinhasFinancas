<template>
  <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700/80 pb-4">
      <div>
        <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          Teto de Gastos por Categoria (Orçamentos)
        </h3>
        <p class="text-xs text-gray-400">Defina limites para não estourar seu orçamento mensal</p>
      </div>

      <NuxtLink to="/orcamentos" class="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
        Gerenciar Orçamentos &rarr;
      </NuxtLink>
    </div>

    <!-- Lista de Orçamentos com Barra de Progresso -->
    <div class="space-y-4">
      <div 
        v-for="item in orcamentosProcessados" 
        :key="item.categoria"
        class="bg-dark-900 border border-dark-700/80 rounded-xl p-4 space-y-2.5"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{ item.icone }}</span>
            <div>
              <span class="text-xs font-bold text-white block leading-tight">{{ item.categoria }}</span>
              <span class="text-[10px] text-gray-400 font-mono">
                Gasto: R$ {{ item.gasto.toFixed(2) }} de R$ {{ item.limite.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Status Badge -->
          <span 
            class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
            :class="[
              item.status === 'excedido' ? 'bg-expense/15 text-expense border-expense/30 animate-pulse' :
              item.status === 'alerta' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
              'bg-income/15 text-income border-income/30'
            ]"
          >
            {{ item.statusText }}
          </span>
        </div>

        <!-- Barra de Progresso do Orçamento -->
        <div class="w-full bg-dark-950 rounded-full h-2.5 overflow-hidden border border-dark-700/60 relative">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="[
              item.status === 'excedido' ? 'bg-expense shadow-glow-expense' :
              item.status === 'alerta' ? 'bg-amber-400' :
              'bg-brand shadow-glow-emerald'
            ]"
            :style="{ width: `${Math.min(item.percentual, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transacoes: { type: Array, default: () => [] },
  categorias: { type: Array, default: () => [] }
})

// Limites padrões configurados de orçamento por categoria (podem ser salvos no Supabase)
const LIMITES_PADRAO = [
  { categoria: 'Alimentação', limite: 1500.00, icone: '🍔' },
  { categoria: 'Moradia', limite: 2500.00, icone: '🏠' },
  { categoria: 'Transporte', limite: 600.00, icone: '🚗' },
  { categoria: 'Lazer', limite: 500.00, icone: '✈️' },
]

const orcamentosProcessados = computed(() => {
  return LIMITES_PADRAO.map(meta => {
    const gasto = props.transacoes
      .filter(t => t.tipo === 'despesa' && t.categoria && t.categoria.toLowerCase() === meta.categoria.toLowerCase())
      .reduce((acc, t) => acc + t.valor, 0)

    const percentual = meta.limite > 0 ? (gasto / meta.limite) * 100 : 0
    let status = 'normal'
    let statusText = `${percentual.toFixed(0)}% Utilizado`

    if (percentual >= 100) {
      status = 'excedido'
      statusText = `Estourou +${(percentual - 100).toFixed(0)}%`
    } else if (percentual >= 75) {
      status = 'alerta'
      statusText = `Atenção (${percentual.toFixed(0)}%)`
    }

    return {
      ...meta,
      gasto,
      percentual,
      status,
      statusText
    }
  })
})
</script>
