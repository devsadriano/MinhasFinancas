<template>
  <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          Evolução Mensal (Receitas vs Despesas)
        </h3>
        <p class="text-xs text-gray-400">Comparativo histórico de entradas e saídas</p>
      </div>

      <!-- Legendas -->
      <div class="flex items-center gap-4 text-xs font-mono">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-income shadow-glow-emerald"></span>
          <span class="text-gray-300">Receitas</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-expense shadow-sm"></span>
          <span class="text-gray-300">Despesas</span>
        </div>
      </div>
    </div>

    <!-- Chart Bars Grid -->
    <div class="pt-6 pb-2">
      <div class="h-48 flex items-end justify-between gap-3 md:gap-6 px-2 border-b border-dark-700/80">
        <div 
          v-for="mes in dadosMensais" 
          :key="mes.nome"
          class="flex-1 flex items-end justify-center gap-1.5 h-full relative group"
        >
          <!-- Tooltip ao passar o mouse -->
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark-900 border border-dark-700 text-white text-[11px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap">
            <span class="text-income font-bold">+R$ {{ mes.receitas.toFixed(0) }}</span> | 
            <span class="text-expense font-bold">-R$ {{ mes.despesas.toFixed(0) }}</span>
          </div>

          <!-- Barra de Receita -->
          <div 
            class="w-full max-w-[24px] bg-income hover:brightness-110 rounded-t-md transition-all duration-500 shadow-glow-emerald"
            :style="{ height: `${mes.altReceita}%` }"
          ></div>

          <!-- Barra de Despesa -->
          <div 
            class="w-full max-w-[24px] bg-expense hover:brightness-110 rounded-t-md transition-all duration-500"
            :style="{ height: `${mes.altDespesa}%` }"
          ></div>
        </div>
      </div>

      <!-- Eixo X (Nomes dos Meses) -->
      <div class="flex items-center justify-between gap-3 md:gap-6 px-2 pt-3 text-xs font-mono text-gray-400">
        <span v-for="mes in dadosMensais" :key="mes.nome" class="flex-1 text-center">
          {{ mes.nome }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transacoes: { type: Array, default: () => [] }
})

const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const dadosMensais = computed(() => {
  const agora = new Date()
  const meses = []

  // Gerar últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
    const ano = d.getFullYear()
    const mesIndex = d.getMonth()
    const mesNome = NOMES_MESES[mesIndex]

    // Filtrar transações desse mês/ano
    const transDoMes = props.transacoes.filter(t => {
      if (!t.data) return false
      const [tAno, tMes] = t.data.split('-')
      return parseInt(tAno, 10) === ano && parseInt(tMes, 10) === (mesIndex + 1)
    })

    const receitas = transDoMes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)
    const despesas = transDoMes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0)

    meses.push({
      nome: `${mesNome}/${String(ano).slice(2)}`,
      receitas,
      despesas
    })
  }

  // Achar maior valor para calcular altura relativa das barras
  const maxValor = Math.max(
    ...meses.map(m => Math.max(m.receitas, m.despesas)),
    1000 // mínimo para escala não zerar
  )

  return meses.map(m => ({
    ...m,
    altReceita: Math.max((m.receitas / maxValor) * 100, 4), // mín 4% para barra ficar visível
    altDespesa: Math.max((m.despesas / maxValor) * 100, 4)
  }))
})
</script>
