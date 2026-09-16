<template>
  <div>
    <Header 
      title="Relatórios Financeiros" 
      subtitle="Análise detalhada das suas finanças por período com exportação de dados"
      :showAction="false"
    />

    <main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <!-- Filtro de Período -->
      <div class="bg-dark-800 border border-dark-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex items-center gap-3 flex-wrap">
          <div>
            <label class="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Data Inicial</label>
            <input
              v-model="dataInicio"
              type="date"
              class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label class="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Data Final</label>
            <input
              v-model="dataFim"
              type="date"
              class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
            />
          </div>
          <!-- Atalhos de Período -->
          <div class="flex gap-1.5 flex-wrap self-end pb-0.5">
            <button v-for="p in periodosRapidos" :key="p.label" @click="setPeriodo(p)" class="px-3 py-2 rounded-lg text-xs font-semibold bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors">
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="flex-1"></div>

        <button
          @click="exportarCSV"
          class="flex items-center gap-2 px-4 py-2 bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand font-bold rounded-lg text-xs transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <!-- KPIs do Período -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-dark-800 border border-income/20 rounded-xl p-5">
          <p class="text-xs text-gray-400 mb-1">Total Receitas</p>
          <p class="text-xl font-extrabold font-mono text-income">+ R$ {{ totalReceitas.toFixed(2) }}</p>
        </div>
        <div class="bg-dark-800 border border-expense/20 rounded-xl p-5">
          <p class="text-xs text-gray-400 mb-1">Total Despesas</p>
          <p class="text-xl font-extrabold font-mono text-expense">- R$ {{ totalDespesas.toFixed(2) }}</p>
        </div>
        <div class="bg-dark-800 border border-dark-700/80 rounded-xl p-5">
          <p class="text-xs text-gray-400 mb-1">Balanço</p>
          <p class="text-xl font-extrabold font-mono" :class="balanco >= 0 ? 'text-brand' : 'text-expense'">
            {{ balanco >= 0 ? '+' : '' }}R$ {{ balanco.toFixed(2) }}
          </p>
        </div>
        <div class="bg-dark-800 border border-dark-700/80 rounded-xl p-5">
          <p class="text-xs text-gray-400 mb-1">Lançamentos</p>
          <p class="text-xl font-extrabold font-mono text-white">{{ transacoesFiltradas.length }}</p>
        </div>
      </div>

      <!-- Análise de Custo Fixo vs Supérfluos (Primo Pobre) -->
      <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-5 shadow-supabase grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-lg font-bold">
            ⚡
          </div>
          <div>
            <span class="text-xs text-amber-400 font-bold uppercase tracking-wider block">Custo Básico Essencial</span>
            <p class="text-lg font-black font-mono text-white">R$ {{ despesasEssenciais.toFixed(2) }}</p>
            <p class="text-[11px] text-gray-400">
              {{ totalDespesas > 0 ? ((despesasEssenciais / totalDespesas) * 100).toFixed(0) : 0 }}% das despesas totais
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg font-bold">
            🎈
          </div>
          <div>
            <span class="text-xs text-purple-400 font-bold uppercase tracking-wider block">Gastos Supérfluos</span>
            <p class="text-lg font-black font-mono text-white">R$ {{ despesasNaoEssenciais.toFixed(2) }}</p>
            <p class="text-[11px] text-gray-400">
              {{ totalDespesas > 0 ? ((despesasNaoEssenciais / totalDespesas) * 100).toFixed(0) : 0 }}% das despesas totais
            </p>
          </div>
        </div>

        <div class="bg-dark-900 border border-dark-700 rounded-xl p-3 space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-300 font-semibold">Reserva de Emergência Ideal (6x)</span>
          </div>
          <p class="text-base font-extrabold font-mono text-amber-400">R$ {{ (despesasEssenciais * 6).toFixed(2) }}</p>
          <p class="text-[10px] text-gray-500 font-mono">Calculada sobre as despesas essenciais do período</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Despesas por Categoria -->
        <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
          <h3 class="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-expense"></span>
            Despesas por Categoria
          </h3>
          <div class="space-y-3">
            <div v-for="cat in despesasPorCategoria" :key="cat.nome" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-300 font-medium">{{ cat.icone }} {{ cat.nome }}</span>
                <span class="font-mono font-bold text-white">R$ {{ cat.total.toFixed(2) }} <span class="text-gray-500">({{ cat.perc.toFixed(1) }}%)</span></span>
              </div>
              <div class="w-full bg-dark-950 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :style="{ width: `${cat.perc}%`, backgroundColor: cat.cor }"
                ></div>
              </div>
            </div>
            <div v-if="despesasPorCategoria.length === 0" class="py-8 text-center text-gray-400 text-sm">
              Sem despesas no período selecionado
            </div>
          </div>
        </div>

        <!-- Receitas por Categoria -->
        <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
          <h3 class="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-income"></span>
            Receitas por Categoria
          </h3>
          <div class="space-y-3">
            <div v-for="cat in receitasPorCategoria" :key="cat.nome" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-300 font-medium">{{ cat.icone }} {{ cat.nome }}</span>
                <span class="font-mono font-bold text-white">R$ {{ cat.total.toFixed(2) }} <span class="text-gray-500">({{ cat.perc.toFixed(1) }}%)</span></span>
              </div>
              <div class="w-full bg-dark-950 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :style="{ width: `${cat.perc}%`, backgroundColor: cat.cor }"
                ></div>
              </div>
            </div>
            <div v-if="receitasPorCategoria.length === 0" class="py-8 text-center text-gray-400 text-sm">
              Sem receitas no período selecionado
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela Detalhada -->
      <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand"></span>
            Lançamentos do Período
          </h3>
          <span class="text-xs text-gray-400 font-mono">{{ transacoesFiltradas.length }} registros</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th class="pb-3">Data</th>
                <th class="pb-3">Descrição</th>
                <th class="pb-3">Categoria</th>
                <th class="pb-3">Conta/Cartão</th>
                <th class="pb-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-700/60 text-sm">
              <tr v-for="item in transacoesFiltradas" :key="item.id" class="hover:bg-dark-750/60 transition-colors">
                <td class="py-3 text-xs text-gray-400 font-mono">{{ formatData(item.data) }}</td>
                <td class="py-3 font-medium text-white">{{ item.descricao }}</td>
                <td class="py-3">
                  <span class="text-xs px-2 py-0.5 rounded bg-dark-900 border border-dark-700 text-gray-300">{{ item.categoria }}</span>
                </td>
                <td class="py-3 text-xs text-gray-400">
                  <span v-if="item.cartao_nome" class="text-purple-400">💳 {{ item.cartao_nome }}</span>
                  <span v-else>{{ item.conta || '—' }}</span>
                </td>
                <td class="py-3 text-right font-bold font-mono" :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'">
                  {{ item.tipo === 'receita' ? '+' : '-' }} R$ {{ item.valor.toFixed(2) }}
                </td>
              </tr>
              <tr v-if="transacoesFiltradas.length === 0">
                <td colspan="5" class="py-8 text-center text-gray-400 text-sm">Nenhum lançamento no período selecionado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'

const { transacoes, categorias, carregando, carregarTudo } = useFinancas()

// Período padrão: mês atual
const hoje = new Date()
const dataInicio = ref(`${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`)
const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()
const dataFim = ref(`${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${ultimoDia}`)

const periodosRapidos = [
  { label: 'Este Mês', inicio: () => { const h = new Date(); return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,'0')}-01` }, fim: () => { const h = new Date(); const d = new Date(h.getFullYear(), h.getMonth()+1, 0); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getDate()}` } },
  { label: 'Mês Passado', inicio: () => { const h = new Date(); const d = new Date(h.getFullYear(), h.getMonth()-1, 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01` }, fim: () => { const h = new Date(); const d = new Date(h.getFullYear(), h.getMonth(), 0); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getDate()}` } },
  { label: 'Este Ano', inicio: () => `${new Date().getFullYear()}-01-01`, fim: () => `${new Date().getFullYear()}-12-31` },
]

const setPeriodo = (p) => {
  dataInicio.value = p.inicio()
  dataFim.value = p.fim()
}

onMounted(() => carregarTudo())

const transacoesFiltradas = computed(() =>
  transacoes.value.filter(t => t.data >= dataInicio.value && t.data <= dataFim.value)
)

const totalReceitas = computed(() => transacoesFiltradas.value.filter(i => i.tipo === 'receita').reduce((a, c) => a + c.valor, 0))
const totalDespesas = computed(() => transacoesFiltradas.value.filter(i => i.tipo === 'despesa').reduce((a, c) => a + c.valor, 0))
const balanco = computed(() => totalReceitas.value - totalDespesas.value)

const despesasEssenciais = computed(() => {
  return transacoesFiltradas.value
    .filter(t => t.tipo === 'despesa')
    .filter(t => {
      const cat = categorias.value.find(c => c.nome === t.categoria || c.id === t.categoria_id)
      if (cat && typeof cat.essencial === 'boolean') return cat.essencial
      const catNome = (t.categoria || '').toLowerCase()
      return catNome.includes('alimenta') || catNome.includes('moradia') || catNome.includes('saúde') || catNome.includes('saude') || catNome.includes('transporte') || catNome.includes('luz') || catNome.includes('água') || catNome.includes('agua')
    })
    .reduce((a, c) => a + c.valor, 0)
})

const despesasNaoEssenciais = computed(() => Math.max(0, totalDespesas.value - despesasEssenciais.value))

const despesasPorCategoria = computed(() => {
  const mapa = {}
  transacoesFiltradas.value
    .filter(t => t.tipo === 'despesa')
    .forEach(t => {
      const cat = categorias.value.find(c => c.nome === t.categoria)
      if (!mapa[t.categoria]) mapa[t.categoria] = { nome: t.categoria, total: 0, icone: cat?.icone || '📦', cor: cat?.cor || '#94a3b8' }
      mapa[t.categoria].total += t.valor
    })
  const lista = Object.values(mapa).sort((a, b) => b.total - a.total)
  return lista.map(i => ({ ...i, perc: totalDespesas.value > 0 ? (i.total / totalDespesas.value) * 100 : 0 }))
})

const receitasPorCategoria = computed(() => {
  const mapa = {}
  transacoesFiltradas.value
    .filter(t => t.tipo === 'receita')
    .forEach(t => {
      const cat = categorias.value.find(c => c.nome === t.categoria)
      if (!mapa[t.categoria]) mapa[t.categoria] = { nome: t.categoria, total: 0, icone: cat?.icone || '💰', cor: cat?.cor || '#3ecf8e' }
      mapa[t.categoria].total += t.valor
    })
  const lista = Object.values(mapa).sort((a, b) => b.total - a.total)
  return lista.map(i => ({ ...i, perc: totalReceitas.value > 0 ? (i.total / totalReceitas.value) * 100 : 0 }))
})

const exportarCSV = () => {
  const cabecalho = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Conta/Cartão', 'Valor']
  const linhas = transacoesFiltradas.value.map(t => [
    t.data,
    `"${t.descricao}"`,
    t.tipo,
    t.categoria,
    t.cartao_nome ? `Cartão: ${t.cartao_nome}` : (t.conta || ''),
    t.tipo === 'receita' ? t.valor : -t.valor
  ])

  const csv = [cabecalho, ...linhas].map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio_${dataInicio.value}_${dataFim.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const formatData = (str) => {
  if (!str) return ''
  const parts = str.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str
}
</script>
