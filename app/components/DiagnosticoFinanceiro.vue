<template>
  <div class="bg-gradient-to-br from-dark-800 to-dark-850 border border-dark-700/80 rounded-2xl p-5 md:p-6 shadow-supabase space-y-6">
    <!-- Header do Diagnóstico -->
    <div class="flex items-center justify-between flex-wrap gap-3 border-b border-dark-700/60 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xl font-bold">
          ⚡
        </div>
        <div>
          <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Diagnóstico & Reserva de Emergência
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Método Primo Pobre
            </span>
          </h3>
          <p class="text-xs text-gray-400">Análise do seu Custo de Vida Básico e meta de segurança para 6 meses</p>
        </div>
      </div>

      <!-- Badge de Saúde Financeira -->
      <div 
        class="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5"
        :class="statusSaude.classe"
      >
        <span>{{ statusSaude.icone }}</span>
        <span>{{ statusSaude.texto }}</span>
      </div>
    </div>

    <!-- Grid de Métricas Principais (Entradas, Essenciais, Não Essenciais e Sobra) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Entradas -->
      <div class="bg-dark-900/80 border border-dark-700/80 rounded-xl p-4">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Receitas Totais</span>
          <span class="text-income font-bold">100%</span>
        </div>
        <p class="text-lg font-extrabold font-mono text-income">+ R$ {{ totalReceitas.toFixed(2) }}</p>
        <p class="text-[10px] text-gray-500 font-mono mt-1">Entradas do mês</p>
      </div>

      <!-- Despesas Essenciais -->
      <div class="bg-dark-900/80 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span class="text-amber-300 font-medium">⚡ Custo Básico (Essencial)</span>
          <span class="text-amber-400 font-mono font-bold">{{ percEssencialDaRenda.toFixed(0) }}%</span>
        </div>
        <p class="text-lg font-extrabold font-mono text-amber-400">- R$ {{ despesasEssenciais.toFixed(2) }}</p>
        <p class="text-[10px] text-gray-400 font-mono mt-1">Moradia, Comida, Saúde, Transp.</p>
      </div>

      <!-- Despesas Não Essenciais -->
      <div class="bg-dark-900/80 border border-purple-500/20 rounded-xl p-4">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span class="text-purple-300 font-medium">🎈 Supérfluos (Não Essencial)</span>
          <span class="text-purple-400 font-mono font-bold">{{ percNaoEssencialDaRenda.toFixed(0) }}%</span>
        </div>
        <p class="text-lg font-extrabold font-mono text-purple-300">- R$ {{ despesasNaoEssenciais.toFixed(2) }}</p>
        <p class="text-[10px] text-gray-400 font-mono mt-1">Lazer, Assinaturas, Extras</p>
      </div>

      <!-- Sobra Líquida -->
      <div 
        class="bg-dark-900/80 border rounded-xl p-4"
        :class="sobraMensal >= 0 ? 'border-brand/30' : 'border-expense/30'"
      >
        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Sobra Líquida</span>
          <span 
            class="font-mono font-bold"
            :class="sobraMensal >= 0 ? 'text-brand' : 'text-expense'"
          >
            {{ percSobraDaRenda.toFixed(0) }}%
          </span>
        </div>
        <p 
          class="text-lg font-extrabold font-mono"
          :class="sobraMensal >= 0 ? 'text-brand' : 'text-expense'"
        >
          {{ sobraMensal >= 0 ? '+' : '' }}R$ {{ sobraMensal.toFixed(2) }}
        </p>
        <p class="text-[10px] text-gray-400 font-mono mt-1">Capacidade de investimento</p>
      </div>
    </div>

    <!-- Barra de Distribuição Visual (Regra 50/30/20) -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-semibold text-gray-300">
        <span>Distribuição da sua Renda</span>
        <span class="text-[11px] text-gray-400 font-normal">Recomendado Primo Pobre: Essenciais até 60%</span>
      </div>
      <div class="w-full h-3 bg-dark-950 rounded-full overflow-hidden flex p-0.5 border border-dark-700">
        <div 
          class="h-full rounded-l-full bg-amber-400 transition-all duration-500" 
          :style="{ width: `${Math.min(percEssencialDaRenda, 100)}%` }" 
          :title="`Essenciais: ${percEssencialDaRenda.toFixed(1)}%`"
        ></div>
        <div 
          class="h-full bg-purple-500 transition-all duration-500" 
          :style="{ width: `${Math.min(percNaoEssencialDaRenda, 100 - percEssencialDaRenda)}%` }" 
          :title="`Não Essenciais: ${percNaoEssencialDaRenda.toFixed(1)}%`"
        ></div>
        <div 
          class="h-full rounded-r-full bg-brand transition-all duration-500" 
          :style="{ width: `${Math.max(0, Math.min(percSobraDaRenda, 100 - percEssencialDaRenda - percNaoEssencialDaRenda))}%` }" 
          :title="`Sobra / Investimentos: ${percSobraDaRenda.toFixed(1)}%`"
        ></div>
      </div>
      <div class="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-1">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Essenciais ({{ despesasEssenciais.toFixed(2) }})</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-purple-500"></span> Não Essenciais ({{ despesasNaoEssenciais.toFixed(2) }})</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-brand"></span> Sobra ({{ sobraMensal.toFixed(2) }})</span>
      </div>
    </div>

    <!-- SEÇÃO DA RESERVA DE EMERGÊNCIA IDEAL (6 MESES DE CUSTO BÁSICO) -->
    <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 rounded-xl p-4 md:p-5 relative overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">🎯 Meta de Segurança Financeria</span>
          </div>
          <h4 class="text-base font-extrabold text-white">
            Reserva de Emergência Ideal (6 meses de custo básico)
          </h4>
          <p class="text-xs text-gray-300 max-w-xl">
            Com base nas suas despesas essenciais deste mês (<strong class="text-amber-300">R$ {{ despesasEssenciais.toFixed(2) }}</strong>), seu fundo de emergência de 6 meses deve ser:
          </p>
        </div>

        <div class="bg-dark-900/90 border border-amber-500/40 rounded-xl p-3.5 text-right shrink-0">
          <span class="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Valor Ideal Calculado</span>
          <p class="text-2xl font-black font-mono text-amber-400">R$ {{ reservaIdeal6Meses.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Barra de progresso da Reserva com o Saldo Atual em Conta -->
      <div class="mt-4 pt-3 border-t border-amber-500/20 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-300 font-medium">Saldo Atual em Contas / Investimentos:</span>
          <span class="font-mono font-bold text-white">
            R$ {{ saldoTotal.toFixed(2) }} de R$ {{ reservaIdeal6Meses.toFixed(2) }}
            <span class="text-amber-400">({{ percReservaConcluida.toFixed(1) }}%)</span>
          </span>
        </div>
        <div class="w-full bg-dark-950 rounded-full h-3 overflow-hidden p-0.5 border border-dark-700">
          <div 
            class="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
            :style="{ width: `${Math.min(percReservaConcluida, 100)}%` }"
          ></div>
        </div>
        <p class="text-[11px] text-gray-400 font-mono">
          <span v-if="percReservaConcluida >= 100" class="text-brand font-bold">🎉 Parabéns! Sua Reserva de Emergência para 6 meses está 100% garantida.</span>
          <span v-else>Faltam <strong class="text-amber-300">R$ {{ Math.max(0, reservaIdeal6Meses - saldoTotal).toFixed(2) }}</strong> acumulados para atingir sua meta total de tranquilidade.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transacoesDoPeriodo: { type: Array, default: () => [] },
  categorias: { type: Array, default: () => [] },
  saldoTotal: { type: Number, default: 0 }
})

const totalReceitas = computed(() =>
  props.transacoesDoPeriodo.filter(i => i.tipo === 'receita').reduce((a, c) => a + c.valor, 0)
)

const despesasEssenciais = computed(() => {
  return props.transacoesDoPeriodo
    .filter(t => t.tipo === 'despesa')
    .filter(t => {
      const cat = props.categorias.find(c => c.nome === t.categoria || c.id === t.categoria_id)
      if (cat && typeof cat.essencial === 'boolean') {
        return cat.essencial
      }
      // Fallback inteligente para categorias padrão
      const catNome = (t.categoria || '').toLowerCase()
      return catNome.includes('alimenta') || catNome.includes('moradia') || catNome.includes('saúde') || catNome.includes('saude') || catNome.includes('transporte') || catNome.includes('luz') || catNome.includes('água') || catNome.includes('agua')
    })
    .reduce((a, c) => a + c.valor, 0)
})

const despesasTotais = computed(() =>
  props.transacoesDoPeriodo.filter(i => i.tipo === 'despesa').reduce((a, c) => a + c.valor, 0)
)

const despesasNaoEssenciais = computed(() =>
  Math.max(0, despesasTotais.value - despesasEssenciais.value)
)

const sobraMensal = computed(() => totalReceitas.value - despesasTotais.value)

const percEssencialDaRenda = computed(() =>
  totalReceitas.value > 0 ? (despesasEssenciais.value / totalReceitas.value) * 100 : 0
)

const percNaoEssencialDaRenda = computed(() =>
  totalReceitas.value > 0 ? (despesasNaoEssenciais.value / totalReceitas.value) * 100 : 0
)

const percSobraDaRenda = computed(() =>
  totalReceitas.value > 0 ? (sobraMensal.value / totalReceitas.value) * 100 : 0
)

const reservaIdeal6Meses = computed(() => despesasEssenciais.value * 6)

const percReservaConcluida = computed(() =>
  reservaIdeal6Meses.value > 0 ? (props.saldoTotal / reservaIdeal6Meses.value) * 100 : 0
)

const statusSaude = computed(() => {
  const perc = percEssencialDaRenda.value
  if (totalReceitas.value === 0) {
    return { icone: 'ℹ️', texto: 'Aguardando receitas do mês', classe: 'bg-dark-700/50 text-gray-400 border-dark-600' }
  }
  if (perc <= 55) {
    return { icone: '🟢', texto: 'Orçamento Excelente (Essenciais ≤ 55%)', classe: 'bg-income/10 text-income border-income/30' }
  }
  if (perc <= 70) {
    return { icone: '⚠️', texto: 'Atenção (Essenciais até 70%)', classe: 'bg-amber-400/10 text-amber-400 border-amber-400/30' }
  }
  return { icone: '🚨', texto: 'Custo Básico Elevado (> 70%)', classe: 'bg-expense/10 text-expense border-expense/30' }
})
</script>
