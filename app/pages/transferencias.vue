<template>
  <div>
    <Header 
      title="Transferências Entre Contas" 
      subtitle="Movimente dinheiro entre suas próprias contas bancárias"
      :showAction="false"
    />

    <main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <!-- Form de Nova Transferência -->
      <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
        <h3 class="text-base font-bold text-white mb-5 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          Nova Transferência
        </h3>

        <form @submit.prevent="realizarTransferencia" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <!-- Conta Origem -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">De (Conta Origem)</label>
            <select
              v-model="form.conta_origem_id"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
            >
              <option value="" disabled>Selecione a origem</option>
              <option
                v-for="banco in bancos"
                :key="banco.id"
                :value="banco.id"
                :disabled="banco.id === form.conta_destino_id"
              >
                {{ banco.nome }} (R$ {{ banco.saldo.toFixed(2) }})
              </option>
            </select>
          </div>

          <!-- Conta Destino -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Para (Conta Destino)</label>
            <select
              v-model="form.conta_destino_id"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
            >
              <option value="" disabled>Selecione o destino</option>
              <option
                v-for="banco in bancos"
                :key="banco.id"
                :value="banco.id"
                :disabled="banco.id === form.conta_origem_id"
              >
                {{ banco.nome }} (R$ {{ banco.saldo.toFixed(2) }})
              </option>
            </select>
          </div>

          <!-- Valor -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Valor (R$)</label>
            <input
              v-model.number="form.valor"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0,00"
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-400"
            />
          </div>

          <!-- Data + Botão -->
          <div class="flex flex-col gap-2">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Data</label>
              <input
                v-model="form.data"
                type="date"
                required
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <!-- Descrição -->
          <div class="lg:col-span-3">
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Descrição (opcional)</label>
            <input
              v-model="form.descricao"
              type="text"
              placeholder="Ex: Reserva de emergência, pagamento cartão..."
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div class="flex items-end">
            <button
              type="submit"
              :disabled="!podeTransferir"
              class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transferir
            </button>
          </div>
        </form>

        <!-- Preview da Transferência -->
        <div v-if="podeTransferir" class="mt-4 p-4 bg-dark-900 border border-blue-500/20 rounded-xl flex items-center justify-center gap-4">
          <div class="text-center">
            <p class="text-xs text-gray-400">Origem</p>
            <p class="text-sm font-bold text-white">{{ contaOrigem?.nome }}</p>
            <p class="text-xs font-mono text-expense">- R$ {{ (form.valor || 0).toFixed(2) }}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div class="text-center">
            <p class="text-xs text-gray-400">Destino</p>
            <p class="text-sm font-bold text-white">{{ contaDestino?.nome }}</p>
            <p class="text-xs font-mono text-income">+ R$ {{ (form.valor || 0).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Histórico de Transferências -->
      <div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase">
        <h3 class="text-base font-bold text-white mb-5 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          Histórico de Transferências
        </h3>

        <div v-if="carregando" class="py-8 text-center text-blue-400">
          <svg class="animate-spin h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="transferencias.length === 0" class="py-12 text-center">
          <div class="text-4xl mb-3">↕️</div>
          <p class="text-white font-bold mb-1">Nenhuma transferência realizada</p>
          <p class="text-gray-400 text-sm">Realize sua primeira transferência entre contas acima</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th class="pb-3">Data</th>
                <th class="pb-3">De</th>
                <th class="pb-3">Para</th>
                <th class="pb-3">Descrição</th>
                <th class="pb-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-700/60 text-sm">
              <tr v-for="t in transferencias" :key="t.id" class="hover:bg-dark-750/60 transition-colors">
                <td class="py-3.5 text-xs text-gray-400 font-mono">{{ formatData(t.data) }}</td>
                <td class="py-3.5 font-medium text-white">{{ t.conta_origem_nome }}</td>
                <td class="py-3.5 font-medium text-white">{{ t.conta_destino_nome }}</td>
                <td class="py-3.5 text-xs text-gray-400">{{ t.descricao || '—' }}</td>
                <td class="py-3.5 text-right font-bold font-mono text-blue-400">R$ {{ Number(t.valor).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'

const { bancos, transferencias, carregando, carregarTudo, transferirEntreContas } = useFinancas()

const today = new Date().toISOString().split('T')[0]
const form = reactive({
  conta_origem_id: '',
  conta_destino_id: '',
  valor: null,
  data: today,
  descricao: ''
})

onMounted(async () => {
  await carregarTudo()
  if (bancos.value.length >= 2) {
    form.conta_origem_id = bancos.value[0].id || ''
    form.conta_destino_id = bancos.value[1].id || ''
  }
})

const contaOrigem = computed(() => bancos.value.find(b => b.id === form.conta_origem_id))
const contaDestino = computed(() => bancos.value.find(b => b.id === form.conta_destino_id))

const podeTransferir = computed(() =>
  form.conta_origem_id &&
  form.conta_destino_id &&
  form.conta_origem_id !== form.conta_destino_id &&
  form.valor > 0 &&
  form.data
)

const realizarTransferencia = async () => {
  if (!podeTransferir.value) return
  await transferirEntreContas({
    conta_origem_id: form.conta_origem_id,
    conta_destino_id: form.conta_destino_id,
    valor: form.valor,
    descricao: form.descricao,
    data: form.data
  })
  form.valor = null
  form.descricao = ''
}

const formatData = (str) => {
  if (!str) return ''
  const parts = str.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str
}
</script>
