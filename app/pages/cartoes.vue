<template>
  <div>
    <Header 
      title="Cartões de Crédito & Faturas" 
      subtitle="Acompanhe seus limites, faturas e vencimentos"
      :showAction="false"
    />

    <main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <!-- Action Bar -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          Meus Cartões ({{ cartoes.length }})
        </h3>

        <div class="flex items-center gap-2">
          <!-- Filtro de mês da fatura -->
          <select
            v-model="mesFatura"
            class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold"
          >
            <option :value="0">Todas as Faturas (Ver Tudo)</option>
            <option v-for="(nome, idx) in nomesMeses" :key="idx" :value="idx + 1">Fatura {{ nome }}</option>
          </select>
          <select
            v-model="anoFatura"
            class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
          </select>

          <button 
            @click="abrirModalImportar"
            class="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-gray-200 font-bold px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span class="hidden sm:inline">Importar Extrato</span>
          </button>

          <button 
            @click="abrirModalNovo"
            class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Novo Cartão</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="carregando" class="py-12 text-center text-purple-400">
        <svg class="animate-spin h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <template v-else>
        <!-- Empty state -->
        <div v-if="cartoes.length === 0" class="py-16 text-center">
          <div class="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-white font-bold mb-1">Nenhum cartão cadastrado</p>
          <p class="text-gray-400 text-sm mb-4">Adicione seu primeiro cartão de crédito</p>
          <button @click="abrirModalNovo" class="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm">
            + Novo Cartão
          </button>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="card in cartoesComLimite" 
            :key="card.id"
            @click="cartaoSelecionadoId = card.id"
            class="rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all cursor-pointer border hover:scale-[1.01]"
            :class="cartaoSelecionadoId === card.id ? 'ring-2 ring-purple-400 border-purple-500' : 'border-dark-700/80 hover:border-dark-600'"
            :style="{ background: `linear-gradient(135deg, ${card.cor}25 0%, #171c26 100%)` }"
          >
            <div class="absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-30" :style="{ backgroundColor: card.cor }"></div>

            <!-- Header do Cartão -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-7 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center shadow-inner">
                  <div class="w-6 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                    <div class="bg-amber-600/30"></div>
                    <div class="bg-amber-600/30"></div>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white tracking-wide leading-tight">{{ card.nome }}</h4>
                  <span class="text-[10px] text-gray-400 font-mono">{{ card.bandeira }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1" @click.stop>
                <button
                  @click="abrirModalEditar(card)"
                  class="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmarExcluir(card)"
                  class="p-1.5 rounded-lg text-gray-500 hover:text-expense hover:bg-expense/10 transition-colors"
                  title="Excluir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Limite e Progresso -->
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-400">Fatura {{ periodoFaturaLabel }}</span>
                  <span class="font-mono font-bold text-white">R$ {{ card.gastosFatura.toFixed(2) }}</span>
                </div>
                <div class="w-full bg-dark-950/80 rounded-full h-2 overflow-hidden border border-dark-700/60">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="card.percUtilizado > 80 ? 'bg-expense' : card.percUtilizado > 60 ? 'bg-amber-400' : ''"
                    :style="{ width: `${Math.min(card.percUtilizado, 100)}%`, backgroundColor: card.percUtilizado <= 60 ? card.cor : undefined }"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs font-mono pt-1">
                <div>
                  <span class="text-[11px] text-gray-500 block">Limite Total</span>
                  <span class="font-bold text-gray-300">R$ {{ card.limite.toFixed(2) }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-gray-500 block">Disponível</span>
                  <span class="font-bold text-brand">R$ {{ card.limiteDisponivel.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="mt-5 pt-3 border-t border-dark-700/40 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>Fecha dia {{ card.dia_fechamento }} · Vence dia {{ card.dia_vencimento }}</span>
              <span 
                class="font-semibold"
                :class="card.percUtilizado > 80 ? 'text-expense animate-pulse' : 'text-purple-400'"
              >
                {{ card.percUtilizado.toFixed(0) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Fatura Detalhada -->
        <div v-if="cartaoAtivo" class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700/80 pb-4">
            <div>
              <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Fatura: <span class="text-purple-400">{{ cartaoAtivo?.nome }}</span> · {{ periodoFaturaLabel }}
              </h3>
              <p class="text-xs text-gray-400">Lançamentos atribuídos a este cartão</p>
            </div>
            <div class="flex items-center gap-4 bg-dark-900 border border-dark-700 rounded-xl p-3">
              <div>
                <span class="text-[11px] text-gray-400 uppercase tracking-wider block font-mono">Total da Fatura</span>
                <span class="text-xl font-extrabold font-mono text-purple-400">R$ {{ totalFaturaAtiva.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Tabela da Fatura -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th class="pb-3">Descrição</th>
                  <th class="pb-3">Parcela</th>
                  <th class="pb-3">Categoria</th>
                  <th class="pb-3">Data</th>
                  <th class="pb-3 text-right">Valor (R$)</th>
                  <th class="pb-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-700/60 text-sm">
                <tr 
                  v-for="item in lancamentosDoCartao" 
                  :key="item.id"
                  class="group hover:bg-dark-750/50 transition-colors"
                >
                  <td class="py-3.5 font-medium text-white">
                    <div class="flex items-center gap-3">
                      <div class="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                        💳
                      </div>
                      <span>{{ item.descricao }}</span>
                    </div>
                  </td>
                  <td class="py-3.5">
                    <span v-if="item.total_parcelas > 1" class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold">
                      Parc {{ item.parcela_atual }}/{{ item.total_parcelas }}
                    </span>
                    <span v-else class="text-xs text-gray-500 font-mono">À vista</span>
                  </td>
                  <td class="py-3.5">
                    <span class="text-xs px-2.5 py-1 rounded-md bg-dark-900 border border-dark-700 text-gray-300 font-medium">
                      {{ item.categoria }}
                    </span>
                  </td>
                  <td class="py-3.5 text-xs text-gray-400 font-mono">{{ formatData(item.data) }}</td>
                  <td class="py-3.5 text-right font-bold font-mono text-expense">
                    - R$ {{ item.valor.toFixed(2) }}
                  </td>
                  <td class="py-3.5 text-center">
                    <button 
                      @click="removerLancamento(item.id)"
                      class="text-gray-500 hover:text-expense p-1 rounded hover:bg-expense/10 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="lancamentosDoCartao.length === 0">
                  <td colspan="6" class="py-8 text-center text-gray-400 text-sm">
                    Nenhum gasto registrado na fatura de {{ periodoFaturaLabel }} para este cartão.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </main>

    <!-- Modal Novo/Editar Cartão -->
    <div v-if="modalAberto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-dark-700 pb-3">
          <h3 class="text-base font-bold text-white">{{ modoEditar ? 'Editar Cartão' : 'Cadastrar Cartão de Crédito' }}</h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="salvarCartao" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome do Cartão</label>
            <input 
              v-model="form.nome"
              type="text"
              placeholder="Ex: Nubank, C6 Black, Itaú"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Bandeira</label>
              <select 
                v-model="form.bandeira"
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Mastercard">Mastercard</option>
                <option value="Mastercard Black">Mastercard Black</option>
                <option value="Visa">Visa</option>
                <option value="Visa Infinite">Visa Infinite</option>
                <option value="Elo">Elo</option>
                <option value="American Express">Amex</option>
                <option value="Hipercard">Hipercard</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Limite (R$)</label>
              <input 
                v-model.number="form.limite"
                type="number"
                step="100"
                required
                placeholder="5000.00"
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Dia Fechamento</label>
              <input 
                v-model.number="form.dia_fechamento"
                type="number"
                min="1"
                max="31"
                required
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Dia Vencimento</label>
              <input 
                v-model.number="form.dia_vencimento"
                type="number"
                min="1"
                max="31"
                required
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Cor do Cartão</label>
            <div class="flex items-center gap-3">
              <input 
                v-model="form.cor"
                type="color"
                class="w-12 h-10 bg-dark-900 border border-dark-700 rounded-lg p-1 cursor-pointer"
              />
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="cor in coresSugeridas"
                  :key="cor"
                  type="button"
                  @click="form.cor = cor"
                  class="w-6 h-6 rounded-full border-2 transition-all"
                  :style="{ backgroundColor: cor }"
                  :class="form.cor === cor ? 'border-white scale-110' : 'border-transparent'"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-xs text-gray-400">Cancelar</button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-lg text-xs">
              {{ modoEditar ? 'Salvar Alterações' : 'Cadastrar Cartão' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Exclusão -->
    <div v-if="modalExcluir" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-dark-800 border border-expense/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-expense/15 border border-expense/30 flex items-center justify-center text-expense">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">Excluir Cartão</h3>
            <p class="text-xs text-gray-400">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <p class="text-sm text-gray-300">
          Deseja excluir o cartão <strong class="text-white">{{ cartaoParaExcluir?.nome }}</strong>?
        </p>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button @click="modalExcluir = false" class="px-4 py-2 text-xs text-gray-400">Cancelar</button>
          <button @click="executarExcluir" class="bg-expense hover:bg-red-500 text-white font-bold px-5 py-2 rounded-lg text-xs">
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Importar Extrato -->
    <ModalImportarExtrato
      :aberto="modalImportarAberto"
      :cartaoPreSelecionadoId="cartaoSelecionadoId"
      @fechar="modalImportarAberto = false"
      @importar="handleImportarEmLote"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'

const { cartoes, transacoes, carregando, carregarTudo, adicionarCartao, editarCartao, excluirCartao, removerLancamento } = useFinancas()

const modalAberto = ref(false)
const modalExcluir = ref(false)
const modalImportarAberto = ref(false)
const modoEditar = ref(false)
const cartaoParaExcluir = ref(null)
const cartaoEditandoId = ref(null)
const cartaoSelecionadoId = ref('')

const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const agora = new Date()
const mesFatura = ref(agora.getMonth() + 1)
const anoFatura = ref(agora.getFullYear())
const anos = computed(() => { const a = new Date().getFullYear(); return [a-1, a, a+1] })
const periodoFaturaLabel = computed(() => `${nomesMeses[mesFatura.value - 1]}/${anoFatura.value}`)

const coresSugeridas = ['#820ad1', '#ec7000', '#3ecf8e', '#3b82f6', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899', '#84cc16', '#8b5cf6']

const form = reactive({
  nome: '',
  bandeira: 'Mastercard',
  limite: 5000,
  dia_fechamento: 1,
  dia_vencimento: 10,
  cor: '#820ad1'
})

onMounted(async () => {
  await carregarTudo()
  if (cartoes.value.length > 0 && !cartaoSelecionadoId.value) {
    cartaoSelecionadoId.value = cartoes.value[0].id || ''
  }
})

const parseMesAno = (str) => {
  if (!str) return { mes: 0, ano: 0 }
  const clean = String(str).trim()
  if (clean.includes('-')) {
    const parts = clean.split('-').map(Number)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      if (parts[0] > 1000) return { ano: parts[0], mes: parts[1] }
      if (parts[2]) return { ano: parts[2], mes: parts[1] }
    }
  }
  if (clean.includes('/')) {
    const parts = clean.split('/').map(Number)
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      if (parts[0] > 1000) return { ano: parts[0], mes: parts[1] }
      return { ano: parts[2], mes: parts[1] }
    }
  }
  const d = new Date(clean)
  if (!isNaN(d.getTime())) {
    return { mes: d.getMonth() + 1, ano: d.getFullYear() }
  }
  return { mes: 0, ano: 0 }
}

const pertenceAoCartao = (t, c) => {
  if (!t || !c) return false
  const cId = c.id ? String(c.id).trim().toLowerCase() : ''
  const cNome = c.nome ? String(c.nome).trim().toLowerCase() : ''

  if (t.cartao_id) {
    const tId = String(t.cartao_id).trim().toLowerCase()
    if ((cId && tId === cId) || (cNome && tId === cNome) || (cNome && tId.includes(cNome)) || (cNome && cNome.includes(tId))) {
      return true
    }
  }

  if (t.cartao_nome) {
    const tCardName = String(t.cartao_nome).trim().toLowerCase()
    if ((cNome && tCardName === cNome) || (cNome && tCardName.includes(cNome)) || (cNome && cNome.includes(tCardName))) {
      return true
    }
  }

  // Fallback: transações de extrato sem conta bancária associada pertencem ao cartão
  if (!t.conta_id && (!t.conta || t.conta === '')) {
    return true
  }

  return false
}

const pertenceAFatura = (t, c, mesAlvo, anoAlvo) => {
  if (!t || !c) return false
  if (!pertenceAoCartao(t, c)) return false
  if (!mesAlvo || mesAlvo === 0) return true

  const diaFechamento = Number(c.dia_fechamento) || 15
  if (!t.data) return false

  const parts = t.data.split('-').map(Number)
  if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return false

  const y = parts[0]
  const m = parts[1]
  const d = parts[2]

  const dataCompra = new Date(y, m - 1, d)
  const dataFimCiclo = new Date(anoAlvo, mesAlvo - 1, diaFechamento, 23, 59, 59)
  const dataInicioCiclo = new Date(anoAlvo, mesAlvo - 2, diaFechamento + 1, 0, 0, 0)

  return dataCompra >= dataInicioCiclo && dataCompra <= dataFimCiclo
}

const cartoesComLimite = computed(() =>
  cartoes.value.map(c => {
    const gastosFatura = transacoes.value
      .filter(t => pertenceAFatura(t, c, mesFatura.value, anoFatura.value))
      .reduce((acc, curr) => acc + curr.valor, 0)

    const limiteDisponivel = Math.max(c.limite - gastosFatura, 0)
    const percUtilizado = c.limite > 0 ? (gastosFatura / c.limite) * 100 : 0
    return { ...c, gastosFatura, limiteDisponivel, percUtilizado }
  })
)

const cartaoAtivo = computed(() =>
  cartoesComLimite.value.find(c => (c.id && c.id === cartaoSelecionadoId.value) || (c.nome && c.nome === cartaoSelecionadoId.value)) || cartoesComLimite.value[0]
)

const lancamentosDoCartao = computed(() => {
  if (!cartaoAtivo.value) return []
  return transacoes.value.filter(t => pertenceAFatura(t, cartaoAtivo.value, mesFatura.value, anoFatura.value))
})

const totalFaturaAtiva = computed(() =>
  lancamentosDoCartao.value.reduce((a, c) => a + c.valor, 0)
)

const abrirModalNovo = () => {
  modoEditar.value = false
  cartaoEditandoId.value = null
  form.nome = ''
  form.bandeira = 'Mastercard'
  form.limite = 5000
  form.dia_fechamento = 1
  form.dia_vencimento = 10
  form.cor = '#820ad1'
  modalAberto.value = true
}

const abrirModalEditar = (card) => {
  modoEditar.value = true
  cartaoEditandoId.value = card.id
  form.nome = card.nome
  form.bandeira = card.bandeira
  form.limite = card.limite
  form.dia_fechamento = card.dia_fechamento
  form.dia_vencimento = card.dia_vencimento
  form.cor = card.cor
  modalAberto.value = true
}

const fecharModal = () => { modalAberto.value = false }

const salvarCartao = async () => {
  if (modoEditar.value && cartaoEditandoId.value) {
    await editarCartao(cartaoEditandoId.value, { ...form })
  } else {
    await adicionarCartao({ ...form })
    if (cartoes.value.length > 0) {
      cartaoSelecionadoId.value = cartoes.value[cartoes.value.length - 1].id || ''
    }
  }
  fecharModal()
}

const confirmarExcluir = (card) => {
  cartaoParaExcluir.value = card
  modalExcluir.value = true
}

const executarExcluir = async () => {
  if (cartaoParaExcluir.value?.id) {
    await excluirCartao(cartaoParaExcluir.value.id)
    if (cartoes.value.length > 0) cartaoSelecionadoId.value = cartoes.value[0].id || ''
  }
  modalExcluir.value = false
}

const abrirModalImportar = () => { modalImportarAberto.value = true }
// O modal já salva os lançamentos internamente.
// Aqui só recarregamos os dados para atualizar a UI.
const handleImportarEmLote = async (itens) => {
  await carregarTudo(true)
  if (itens && itens.length > 0) {
    const primeiraData = itens[0]?.data
    if (primeiraData) {
      const parts = primeiraData.split('-').map(Number)
      if (parts[0] && parts[1]) {
        anoFatura.value = parts[0]
        mesFatura.value = parts[1]
      }
    }
  }
}

const formatData = (str) => {
  if (!str) return ''
  const parts = str.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str
}
</script>
