<template>
  <div>
    <Header 
      title="Extrato & Lançamentos" 
      subtitle="Gerencie todas as suas movimentações de entrada e saída"
      @abrirModal="abrirModalNovo"
      @abrirModalImportacao="modalImportarAberto = true"
    />

    <main class="p-4 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6">
      <!-- Loading -->
      <div v-if="carregando" class="flex items-center justify-center py-12 text-brand">
        <svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <template v-else>
        <!-- Filter Bar -->
        <div class="bg-dark-800 border border-dark-700/80 rounded-xl p-4 flex flex-col gap-3 shadow-supabase">
          <!-- Row 1: Período + Busca -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Período -->
            <div class="flex items-center gap-2">
              <select
                v-model="mesFiltro"
                class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"
              >
                <option value="0">Todos os Meses</option>
                <option v-for="(nome, idx) in nomesMeses" :key="idx" :value="idx + 1">{{ nome }}</option>
              </select>
              <select
                v-model="anoFiltro"
                class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"
              >
                <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>

            <!-- Busca -->
            <div class="relative flex-1">
              <input
                v-model="busca"
                type="text"
                placeholder="Buscar por descrição..."
                class="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand placeholder:text-gray-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Row 2: Filtros Adicionais -->
          <div class="flex flex-wrap items-center gap-2">
            <select
              v-model="filtroTipo"
              class="flex-1 min-w-[130px] bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="receita">Receitas (+)</option>
              <option value="despesa">Despesas (-)</option>
            </select>

            <select
              v-model="filtroCategoria"
              class="flex-1 min-w-[140px] bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand"
            >
              <option value="todas">Todas as Categorias</option>
              <option v-for="cat in categorias" :key="cat.id || cat.nome" :value="cat.nome">{{ cat.nome }}</option>
            </select>

            <select
              v-model="filtroConta"
              class="flex-1 min-w-[130px] bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand"
            >
              <option value="todas">Todas as Contas</option>
              <option v-for="banco in bancos" :key="banco.id" :value="banco.nome">{{ banco.nome }}</option>
              <option value="cartao">Cartão de Crédito</option>
            </select>

            <button
              @click="limparFiltros"
              class="text-xs text-gray-400 hover:text-white px-3 py-2 hover:bg-dark-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Limpar
            </button>
          </div>
        </div>

        <!-- Resumo do Período -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-dark-800 border border-income/20 rounded-xl p-4">
            <p class="text-xs text-gray-400 mb-1">Receitas</p>
            <p class="text-lg font-extrabold font-mono text-income">+ R$ {{ totalReceitas.toFixed(2) }}</p>
          </div>
          <div class="bg-dark-800 border border-expense/20 rounded-xl p-4">
            <p class="text-xs text-gray-400 mb-1">Despesas</p>
            <p class="text-lg font-extrabold font-mono text-expense">- R$ {{ totalDespesas.toFixed(2) }}</p>
          </div>
          <div class="bg-dark-800 border border-dark-700/80 rounded-xl p-4">
            <p class="text-xs text-gray-400 mb-1">Balanço</p>
            <p
              class="text-lg font-extrabold font-mono"
              :class="balanco >= 0 ? 'text-brand' : 'text-expense'"
            >
              {{ balanco >= 0 ? '+' : '' }}R$ {{ balanco.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-4 md:p-6 shadow-supabase">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs text-gray-400 font-mono">
              {{ lancamentosFiltrados.length }} lançamentos encontrados
            </span>
          </div>

          <!-- Mobile cards -->
          <div class="sm:hidden space-y-3">
            <div
              v-for="item in lancamentosFiltrados"
              :key="item.id"
              class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700/80 group"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0"
                  :class="item.tipo === 'receita' ? 'bg-income/15 border-income/30 text-income' : 'bg-expense/15 border-expense/30 text-expense'"
                >
                  {{ item.tipo === 'receita' ? 'ENT' : 'SAÍ' }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold text-white truncate">{{ item.descricao }}</p>
                    <span v-if="isItemShared(item)" class="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap shrink-0">
                      🤝 50/50
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-400 font-mono">{{ item.categoria }} · {{ formatData(item.data) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0 ml-2">
                <span
                  class="text-sm font-bold font-mono"
                  :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'"
                >
                  {{ item.tipo === 'receita' ? '+' : '-' }}R${{ item.valor.toFixed(2) }}
                </span>
                <div class="flex flex-col gap-0.5">
                  <button @click="abrirModalEditar(item)" class="text-gray-600 hover:text-brand p-1 rounded hover:bg-brand/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="handleRemover(item.id)" class="text-gray-600 hover:text-expense p-1 rounded hover:bg-expense/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="lancamentosFiltrados.length === 0" class="py-8 text-center text-gray-400 text-sm">
              Nenhum lançamento encontrado com os filtros selecionados.
            </div>
          </div>

          <!-- Desktop table -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th class="pb-3">Tipo & Descrição</th>
                  <th class="pb-3 hidden md:table-cell">Categoria</th>
                  <th class="pb-3 hidden lg:table-cell">Conta / Cartão</th>
                  <th class="pb-3 hidden md:table-cell">Data</th>
                  <th class="pb-3 text-right">Valor (R$)</th>
                  <th class="pb-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-700/60 text-sm">
                <tr
                  v-for="item in lancamentosFiltrados"
                  :key="item.id"
                  class="group hover:bg-dark-750/60 transition-colors"
                >
                  <td class="py-4 font-medium text-white">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0"
                        :class="item.tipo === 'receita' ? 'bg-income/15 border-income/30 text-income' : 'bg-expense/15 border-expense/30 text-expense'"
                      >
                        {{ item.tipo === 'receita' ? 'ENT' : 'SAÍ' }}
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <p class="text-sm font-semibold text-white">{{ item.descricao }}</p>
                          <span v-if="isItemShared(item)" class="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap">
                            🤝 50/50
                          </span>
                        </div>
                        <span class="text-[11px] text-gray-400 font-mono">
                          {{ item.tipo === 'receita' ? 'Entrada' : 'Saída' }}
                          {{ item.total_parcelas > 1 ? ` · Parc ${item.parcela_atual}/${item.total_parcelas}` : '' }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 hidden md:table-cell">
                    <span class="text-xs px-2.5 py-1 rounded-md bg-dark-900 border border-dark-700 text-gray-300 font-medium">
                      {{ item.categoria }}
                    </span>
                  </td>
                  <td class="py-4 text-xs font-mono text-gray-300 hidden lg:table-cell">
                    <span v-if="item.cartao_nome" class="text-purple-400">💳 {{ item.cartao_nome }}</span>
                    <span v-else>{{ item.conta || '—' }}</span>
                  </td>
                  <td class="py-4 text-xs font-mono text-gray-400 hidden md:table-cell">{{ formatData(item.data) }}</td>
                  <td
                    class="py-4 text-right font-bold font-mono text-base"
                    :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'"
                  >
                    {{ item.tipo === 'receita' ? '+' : '-' }} R$ {{ item.valor.toFixed(2) }}
                  </td>
                  <td class="py-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="abrirModalEditar(item)"
                        class="text-gray-500 hover:text-brand p-1.5 rounded-lg hover:bg-brand/10 transition-colors"
                        title="Editar Lançamento"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="handleRemover(item.id)"
                        class="text-gray-500 hover:text-expense p-1.5 rounded-lg hover:bg-expense/10 transition-colors"
                        title="Excluir Lançamento"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="lancamentosFiltrados.length === 0">
                  <td colspan="6" class="py-8 text-center text-gray-400 text-sm">
                    Nenhum lançamento encontrado com os filtros selecionados.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </main>

    <!-- Modal Novo/Editar Lançamento -->
    <ModalNovoLancamento 
      :aberto="modalAberto"
      :lancamento-para-editar="lancamentoEditando"
      @fechar="fecharModalLancamento"
      @salvar="handleSalvar"
    />

    <!-- Modal Importar Extrato -->
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
const lancamentoEditando = ref(null)

const busca = ref('')
const filtroTipo = ref('todos')
const filtroCategoria = ref('todas')
const filtroConta = ref('todas')

const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const agora = new Date()
const mesFiltro = ref(agora.getMonth() + 1)
const anoFiltro = ref(agora.getFullYear())
const anos = computed(() => { const a = new Date().getFullYear(); return [a-2, a-1, a, a+1] })

const {
  transacoes,
  bancos,
  categorias,
  carregando,
  carregarTudo,
  adicionarLancamento,
  editarLancamento,
  adicionarLancamentosEmLote,
  removerLancamento
} = useFinancas()

onMounted(() => carregarTudo())

const lancamentosFiltrados = computed(() => {
  return transacoes.value.filter(item => {
    const bateBusca = !busca.value || item.descricao.toLowerCase().includes(busca.value.toLowerCase())
    const bateTipo = filtroTipo.value === 'todos' || item.tipo === filtroTipo.value
    const bateCategoria = filtroCategoria.value === 'todas' || item.categoria === filtroCategoria.value
    const bateConta = filtroConta.value === 'todas' ||
      (filtroConta.value === 'cartao' ? !!item.cartao_id : item.conta === filtroConta.value)

    let batePeriodo = true
    if (mesFiltro.value > 0 && item.data) {
      const [ano, mes] = item.data.split('-').map(Number)
      batePeriodo = mes === mesFiltro.value && ano === anoFiltro.value
    }

    return bateBusca && bateTipo && bateCategoria && bateConta && batePeriodo
  })
})

const totalReceitas = computed(() => lancamentosFiltrados.value.filter(i => i.tipo === 'receita').reduce((a, c) => a + c.valor, 0))
const totalDespesas = computed(() => lancamentosFiltrados.value.filter(i => i.tipo === 'despesa').reduce((a, c) => a + c.valor, 0))
const balanco = computed(() => totalReceitas.value - totalDespesas.value)

const abrirModalNovo = () => {
  lancamentoEditando.value = null
  modalAberto.value = true
}

const abrirModalEditar = (item) => {
  lancamentoEditando.value = { ...item }
  modalAberto.value = true
}

const fecharModalLancamento = () => {
  modalAberto.value = false
  lancamentoEditando.value = null
}

const handleSalvar = async (item) => {
  if (item._editando && item.id) {
    await editarLancamento(item.id, item)
  } else {
    await adicionarLancamento(item)
  }
}

const handleImportarEmLote = async (itens) => await adicionarLancamentosEmLote(itens)
const handleRemover = async (id) => await removerLancamento(id)

const limparFiltros = () => {
  busca.value = ''
  filtroTipo.value = 'todos'
  filtroCategoria.value = 'todas'
  filtroConta.value = 'todas'
}

const isItemShared = (item) => {
  if (item.dividir5050) return true
  if (item.rateios && item.rateios.length > 0) return true
  if (item.tipo === 'despesa' && ['Alimentação', 'Moradia', 'Pets', 'Saúde'].includes(item.categoria)) return true
  return false
}

const formatData = (str) => {
  if (!str) return ''
  const parts = str.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str
}
</script>
