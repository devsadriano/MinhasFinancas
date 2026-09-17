<template>
  <div>
    <Header 
      title="Visão Geral das Finanças" 
      subtitle="Acompanhe seus saldos, receitas e despesas em tempo real"
      @abrirModal="modalAberto = true"
      @abrirModalImportacao="modalImportarAberto = true"
    />

    <main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <!-- Filtro de Período -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl p-1">
          <button
            v-for="m in mesesRapidos"
            :key="m.label"
            @click="setMes(m.mes, m.ano)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :class="mesSelecionado === m.mes && anoSelecionado === m.ano
              ? 'bg-brand text-dark-950 shadow'
              : 'text-gray-400 hover:text-white'"
          >
            {{ m.label }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <select
            v-model="mesSelecionado"
            class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
          >
            <option v-for="(nome, idx) in nomesMeses" :key="idx" :value="idx + 1">{{ nome }}</option>
          </select>
          <select
            v-model="anoSelecionado"
            class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
          >
            <option v-for="a in anosDisponiveis" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>
      </div>

      <!-- Indicador de carregamento -->
      <div v-if="carregando" class="flex items-center justify-center py-12 text-brand">
        <svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <template v-else>
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <KpiCard
            title="Saldo Total"
            :valor="saldoTotal"
            variant="brand"
            badgeText="Em Conta"
            badgeClass="bg-brand/15 text-brand border-brand/30 font-mono"
            descricao="Soma de todos os saldos de bancos e carteiras"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </KpiCard>

          <KpiCard
            title="Receitas no Mês"
            :valor="totalReceitas"
            variant="income"
            :badgeText="periodoLabel"
            badgeClass="bg-income/15 text-income border-income/30 font-mono"
            descricao="Total de entradas e rendimentos no período"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </template>
          </KpiCard>

          <KpiCard
            title="Despesas no Mês"
            :valor="totalDespesas"
            variant="expense"
            :badgeText="periodoLabel"
            badgeClass="bg-expense/15 text-expense border-expense/30 font-mono"
            descricao="Total de saídas e custos operacionais"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </template>
          </KpiCard>

          <KpiCard
            title="Balanço do Mês"
            :valor="economia"
            variant="neutral"
            :badgeText="economia >= 0 ? 'Superávit' : 'Déficit'"
            :badgeClass="economia >= 0 ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-mono' : 'bg-expense/15 text-expense border-expense/30 font-mono'"
            descricao="Receitas menos despesas do período"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </template>
          </KpiCard>
        </div>

        <!-- Diagnóstico Financeiro & Reserva de Emergência Primo Pobre -->
        <DiagnosticoFinanceiro
          :transacoesDoPeriodo="transacoesDoPeriodo"
          :categorias="categorias"
          :saldoTotal="saldoTotal"
        />

        <!-- Gráficos -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficoCategoria :transacoes="transacoesDoPeriodo" :categorias="categorias" />
          <GraficoEvolucao :transacoes="transacoes" />
        </div>

        <!-- Orçamentos -->
        <ModuloOrcamento :transacoes="transacoesDoPeriodo" :categorias="categorias" :mes="mesSelecionado" :ano="anoSelecionado" />

        <!-- Lançamentos e Bancos -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <!-- Lançamentos recentes -->
          <div class="lg:col-span-2 bg-dark-800 border border-dark-700/80 rounded-2xl p-4 md:p-6 shadow-supabase">
            <div class="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand"></span>
                  Últimos Lançamentos
                </h3>
                <p class="text-xs text-gray-400 hidden sm:block">{{ periodoLabel }}</p>
              </div>
              <NuxtLink to="/lancamentos" class="text-xs font-semibold text-brand hover:underline flex items-center gap-1 whitespace-nowrap">
                Ver Extrato &rarr;
              </NuxtLink>
            </div>

            <!-- Mobile cards -->
            <div class="sm:hidden space-y-3">
              <div
                v-for="item in ultimosLancamentos"
                :key="item.id"
                class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700/80"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold shrink-0"
                    :class="item.tipo === 'receita' ? 'bg-income/15 border-income/30 text-income' : 'bg-expense/15 border-expense/30 text-expense'"
                  >
                    {{ item.tipo === 'receita' ? '+' : '-' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-white truncate">{{ item.descricao }}</p>
                    <p class="text-[11px] text-gray-400 font-mono">{{ item.categoria }} · {{ formatData(item.data) }}</p>
                  </div>
                </div>
                <span
                  class="text-sm font-bold font-mono shrink-0 ml-2"
                  :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'"
                >
                  {{ item.tipo === 'receita' ? '+' : '-' }}R${{ item.valor.toFixed(2) }}
                </span>
              </div>
              <div v-if="ultimosLancamentos.length === 0" class="py-8 text-center text-gray-400 text-xs">
                Nenhum lançamento em {{ periodoLabel }}. Clique em "+ Novo Lançamento" para começar.
              </div>
            </div>

            <!-- Desktop table -->
            <div class="hidden sm:block overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <th class="pb-3">Descrição</th>
                    <th class="pb-3">Categoria</th>
                    <th class="pb-3 hidden md:table-cell">Conta</th>
                    <th class="pb-3 hidden md:table-cell">Data</th>
                    <th class="pb-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-dark-700/60 text-sm">
                  <tr
                    v-for="item in ultimosLancamentos"
                    :key="item.id"
                    class="group hover:bg-dark-750/50 transition-colors"
                  >
                    <td class="py-3.5 font-medium text-white">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-7 h-7 rounded-lg flex items-center justify-center border text-xs shrink-0"
                          :class="item.tipo === 'receita' ? 'bg-income/15 border-income/30 text-income' : 'bg-expense/15 border-expense/30 text-expense'"
                        >
                          {{ item.tipo === 'receita' ? '+' : '-' }}
                        </div>
                        <span>{{ item.descricao }}</span>
                      </div>
                    </td>
                    <td class="py-3.5">
                      <span class="text-xs px-2.5 py-1 rounded-md bg-dark-700 border border-dark-600 text-gray-300 font-medium">
                        {{ item.categoria }}
                      </span>
                    </td>
                    <td class="py-3.5 text-xs text-gray-400 font-mono hidden md:table-cell">{{ item.conta || item.cartao_nome || '—' }}</td>
                    <td class="py-3.5 text-xs text-gray-400 font-mono hidden md:table-cell">{{ formatData(item.data) }}</td>
                    <td
                      class="py-3.5 text-right font-bold font-mono"
                      :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'"
                    >
                      {{ item.tipo === 'receita' ? '+' : '-' }} R$ {{ item.valor.toFixed(2) }}
                    </td>
                  </tr>
                  <tr v-if="ultimosLancamentos.length === 0">
                    <td colspan="5" class="py-8 text-center text-gray-400 text-xs">
                      Nenhum lançamento em {{ periodoLabel }}.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Painel lateral direito -->
          <div class="space-y-6">
            <!-- Saldos por Banco -->
            <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Saldos por Banco
                </h3>
                <NuxtLink to="/contas" class="text-xs text-brand hover:underline">Gerenciar →</NuxtLink>
              </div>
              <div class="space-y-3">
                <div v-for="banco in bancos" :key="banco.id || banco.nome" class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700/80">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: banco.cor }"></div>
                    <span class="text-sm font-semibold text-gray-200">{{ banco.nome }}</span>
                  </div>
                  <span
                    class="text-sm font-bold font-mono"
                    :class="banco.saldo >= 0 ? 'text-white' : 'text-expense'"
                  >
                    R$ {{ banco.saldo.toFixed(2) }}
                  </span>
                </div>
                <div v-if="bancos.length === 0" class="text-xs text-gray-400 text-center py-4">
                  Nenhuma conta cadastrada
                </div>
              </div>
            </div>

            <!-- Cartões Ativos -->
            <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Faturas Abertas
                </h3>
                <NuxtLink to="/cartoes" class="text-xs text-purple-400 hover:underline">Ver Cartões →</NuxtLink>
              </div>
              <div class="space-y-3">
                <div v-for="card in cartoesComFatura" :key="card.id" class="p-3 rounded-xl bg-dark-900 border border-dark-700/80">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: card.cor }"></div>
                      <span class="text-sm font-semibold text-gray-200">{{ card.nome }}</span>
                    </div>
                    <span class="text-sm font-bold font-mono text-purple-400">R$ {{ card.fatura.toFixed(2) }}</span>
                  </div>
                  <div class="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :style="{ width: `${Math.min(card.perc, 100)}%`, backgroundColor: card.cor }"
                    ></div>
                  </div>
                  <p class="text-[10px] text-gray-500 font-mono mt-1">Vence dia {{ card.dia_vencimento }} · {{ card.perc.toFixed(0) }}% do limite</p>
                </div>
                <div v-if="cartoesComFatura.length === 0" class="text-xs text-gray-400 text-center py-4">
                  Nenhum cartão cadastrado
                </div>
              </div>
            </div>

            <!-- Importação Rápida -->
            <div class="bg-gradient-to-br from-dark-800 to-dark-850 border border-brand/20 rounded-2xl p-6 relative overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="flex items-center gap-2 text-brand text-xs font-mono font-bold uppercase mb-2">
                <span>💡 Importação Rápida</span>
              </div>
              <h4 class="text-sm font-bold text-white mb-1">Importe sua fatura bancária</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-4">
                Baixe a fatura do seu cartão ou extrato em OFX/CSV e deixe o sistema organizar tudo por você.
              </p>
              <button 
                @click="modalImportarAberto = true"
                class="w-full bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>+ Importar Extrato (OFX/CSV)</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Modais -->
    <ModalNovoLancamento 
      :aberto="modalAberto" 
      @fechar="modalAberto = false" 
      @salvar="handleSalvar" 
    />
    <ModalImportarExtrato
      :aberto="modalImportarAberto"
      @fechar="modalImportarAberto = false"
      @importar="handleImportarEmLote"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'

const modalAberto = ref(false)
const modalImportarAberto = ref(false)

const agora = new Date()
const mesSelecionado = ref(agora.getMonth() + 1)
const anoSelecionado = ref(agora.getFullYear())

const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const anosDisponiveis = computed(() => {
  const ano = new Date().getFullYear()
  return [ano - 2, ano - 1, ano, ano + 1]
})

const mesesRapidos = computed(() => {
  const hoje = new Date()
  const resultado = []
  for (let i = 2; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    resultado.push({
      label: nomesMeses[d.getMonth()].substring(0, 3),
      mes: d.getMonth() + 1,
      ano: d.getFullYear()
    })
  }
  return resultado
})

const periodoLabel = computed(() => `${nomesMeses[mesSelecionado.value - 1]} ${anoSelecionado.value}`)

const setMes = (mes, ano) => {
  mesSelecionado.value = mes
  anoSelecionado.value = ano
}

import { useWorkspace } from '~/composables/useWorkspace'

const { modoVisao } = useWorkspace()
const user = useSupabaseUser()

const {
  transacoes,
  bancos,
  cartoes,
  categorias,
  carregando,
  carregarTudo,
  adicionarLancamento,
  adicionarLancamentosEmLote
} = useFinancas()

onMounted(() => carregarTudo())

const transacoesDoPeriodo = computed(() => {
  const filtradas = transacoes.value.filter(t => {
    if (!t.data) return false
    const [ano, mes] = t.data.split('-').map(Number)
    return mes === mesSelecionado.value && ano === anoSelecionado.value
  })

  if (modoVisao.value === 'pessoal') {
    const currentUserId = user.value?.id
    return filtradas.map(t => {
      if (t.rateios && t.rateios.length > 0) {
        const meuRateio = t.rateios.find(r => r.user_id === currentUserId)
        const valorCalculado = meuRateio ? Number(meuRateio.valor) : Number(t.valor) / 2
        return { ...t, valor: valorCalculado }
      }
      if (t.tipo === 'despesa' && (t.dividir5050 || ['Alimentação', 'Moradia', 'Pets'].includes(t.categoria))) {
        return { ...t, valor: Number(t.valor) / 2 }
      }
      return t
    })
  }

  return filtradas
})

const totalReceitas = computed(() =>
  transacoesDoPeriodo.value.filter(i => i.tipo === 'receita').reduce((a, c) => a + c.valor, 0)
)

const totalDespesas = computed(() =>
  transacoesDoPeriodo.value.filter(i => i.tipo === 'despesa').reduce((a, c) => a + c.valor, 0)
)

const saldoTotal = computed(() => bancos.value.reduce((a, c) => a + c.saldo, 0))
const economia = computed(() => totalReceitas.value - totalDespesas.value)

const ultimosLancamentos = computed(() => transacoesDoPeriodo.value.slice(0, 10))

const cartoesComFatura = computed(() =>
  cartoes.value.map(c => {
    const fatura = transacoes.value
      .filter(t => {
        if (t.cartao_id !== c.id) return false
        const [ano, mes] = (t.data || '').split('-').map(Number)
        return mes === mesSelecionado.value && ano === anoSelecionado.value
      })
      .reduce((a, t) => a + t.valor, 0)
    return {
      ...c,
      fatura,
      perc: c.limite > 0 ? (fatura / c.limite) * 100 : 0
    }
  })
)

const handleSalvar = async (item) => await adicionarLancamento(item)
const handleImportarEmLote = async (itens) => await adicionarLancamentosEmLote(itens)

const formatData = (str) => {
  if (!str) return ''
  const parts = str.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str
}
</script>
