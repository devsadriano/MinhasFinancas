<template>
  <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-brand"></span>
        Distribuição de Despesas por Categoria
      </h3>
      <span class="text-xs text-gray-400 font-mono">Mês Atual</span>
    </div>

    <div v-if="dadosCategorias.length === 0" class="py-12 text-center text-gray-500 text-xs font-mono">
      Nenhum gasto registrado neste mês para exibir o gráfico.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
      <!-- SVG Donut Chart -->
      <div class="relative w-48 h-48 mx-auto flex items-center justify-center">
        <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
          <circle
            v-for="(seg, idx) in segmentos"
            :key="idx"
            cx="50"
            cy="50"
            r="38"
            fill="transparent"
            :stroke="seg.cor"
            stroke-width="14"
            :stroke-dasharray="`${seg.dash} ${100 - seg.dash}`"
            :stroke-dashoffset="-seg.offset"
            class="transition-all duration-500 hover:opacity-85 cursor-pointer"
            @mouseenter="hoveredIndex = idx"
            @mouseleave="hoveredIndex = null"
          />
        </svg>

        <!-- Center Total Text -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span class="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Total Gastos</span>
          <span class="text-base font-extrabold font-mono text-white">R$ {{ totalGeral.toFixed(0) }}</span>
        </div>
      </div>

      <!-- Legend & Percentages List -->
      <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        <div 
          v-for="(item, idx) in dadosCategorias" 
          :key="item.nome"
          class="flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border"
          :class="hoveredIndex === idx ? 'bg-dark-700/80 border-dark-600' : 'bg-dark-900/60 border-dark-800 hover:bg-dark-800'"
          @mouseenter="hoveredIndex = idx"
          @mouseleave="hoveredIndex = null"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: item.cor }"></div>
            <span class="text-xs font-semibold text-gray-200 truncate">{{ item.icone }} {{ item.nome }}</span>
          </div>

          <div class="flex items-center gap-3 font-mono shrink-0 ml-2">
            <span class="text-xs text-gray-400 font-medium">{{ item.percentual.toFixed(1) }}%</span>
            <span class="text-xs font-bold text-white">R$ {{ item.valor.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  transacoes: { type: Array, default: () => [] },
  categorias: { type: Array, default: () => [] }
})

const hoveredIndex = ref(null)

const dadosCategorias = computed(() => {
  const despesas = props.transacoes.filter(t => t.tipo === 'despesa')
  const total = despesas.reduce((acc, t) => acc + t.valor, 0)
  if (total === 0) return []

  const mapa = new Map()
  despesas.forEach(t => {
    const catNome = t.categoria || 'Outros'
    const atual = mapa.get(catNome) || 0
    mapa.set(catNome, atual + t.valor)
  })

  const resultado = []
  mapa.forEach((valor, nome) => {
    const catInfo = props.categorias.find(c => c.nome.toLowerCase() === nome.toLowerCase())
    const cor = catInfo?.cor || '#3b82f6'
    const icone = catInfo?.icone || '📦'
    const percentual = (valor / total) * 100

    resultado.push({ nome, valor, percentual, cor, icone })
  })

  return resultado.sort((a, b) => b.valor - a.valor)
})

const totalGeral = computed(() => {
  return dadosCategorias.value.reduce((acc, c) => acc + c.valor, 0)
})

const segmentos = computed(() => {
  let offsetAcumulado = 0
  const circunferência = 2 * Math.PI * 38 // ~238.76

  return dadosCategorias.value.map(item => {
    const dash = (item.percentual / 100) * circunferência
    const offset = (offsetAcumulado / 100) * circunferência
    offsetAcumulado += item.percentual

    return {
      cor: item.cor,
      dash,
      offset
    }
  })
})
</script>
