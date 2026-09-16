<template>
  <div v-if="aberto" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
    <div class="bg-dark-800 border border-dark-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl overflow-hidden animate-scale-in">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-dark-700/80 bg-dark-850">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-dark-600 rounded-full sm:hidden"></div>
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full" :class="modoEditar ? 'bg-blue-400' : 'bg-brand'"></span>
          {{ modoEditar ? 'Editar Lançamento' : 'Novo Lançamento' }}
        </h3>
        <button @click="$emit('fechar')" class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="salvar" class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        <!-- Type Switch -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-dark-900 border border-dark-700 rounded-xl">
          <button
            type="button"
            @click="form.tipo = 'receita'; form.usarCartao = false"
            class="py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
            :class="form.tipo === 'receita' ? 'bg-income/20 text-income border border-income/40 shadow-sm' : 'text-gray-400 hover:text-white'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Receita
          </button>
          <button
            type="button"
            @click="form.tipo = 'despesa'"
            class="py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
            :class="form.tipo === 'despesa' ? 'bg-expense/20 text-expense border border-expense/40 shadow-sm' : 'text-gray-400 hover:text-white'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            Despesa
          </button>
        </div>

        <!-- Toggle Cartão (só para despesa) -->
        <div v-if="form.tipo === 'despesa'" class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-white">Cartão de Crédito</p>
              <p class="text-[11px] text-gray-400">Lançar na fatura / parcelar</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.usarCartao" class="sr-only peer">
            <div class="w-9 h-5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
          </label>
        </div>

        <!-- Toggle Divisão 50/50 do Casal (só para despesa) -->
        <div v-if="form.tipo === 'despesa'" class="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-dark-900 border border-brand/30 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-brand/15 border border-brand/30 flex items-center justify-center text-brand text-base font-bold">
                👩‍❤️‍👨
              </div>
              <div>
                <p class="text-xs font-bold text-white flex items-center gap-1.5">
                  Dividir 50/50 com {{ nomeParceiro }}
                </p>
                <p class="text-[11px] text-gray-400">Rateio automático do consumo da despesa</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.dividir5050" class="sr-only peer">
              <div class="w-9 h-5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>

          <!-- Breakdown Visual do Rateio 50/50 -->
          <div v-if="form.dividir5050 && form.valor" class="pt-2 border-t border-brand/20 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-1 text-gray-300">
              <span class="w-2 h-2 rounded-full bg-brand"></span>
              <span>Você consome: <strong class="text-brand">R$ {{ (form.valor / 2).toFixed(2) }}</strong></span>
            </div>
            <div class="flex items-center gap-1 text-gray-300">
              <span class="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>{{ nomeParceiro }} consome: <strong class="text-purple-300">R$ {{ (form.valor / 2).toFixed(2) }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Descrição</label>
          <input
            v-model="form.descricao"
            type="text"
            placeholder="Ex: Salário, Supermercado, Netflix..."
            required
            class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
          />
        </div>

        <!-- Valor & Data -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              {{ form.usarCartao && form.totalParcelas > 1 ? 'Valor Total (R$)' : 'Valor (R$)' }}
            </label>
            <input
              v-model.number="form.valor"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Data</label>
            <input
              v-model="form.data"
              type="date"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </div>

        <!-- Categoria & Conta/Cartão -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Categoria</label>
            <select
              v-model="form.categoria"
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
            >
              <option v-for="cat in categoriasFiltradas" :key="cat.id || cat.nome" :value="cat.nome">
                {{ cat.icone }} {{ cat.nome }}
              </option>
            </select>
          </div>

          <div v-if="form.usarCartao">
            <label class="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1.5">Cartão</label>
            <select
              v-model="form.cartao_id"
              class="w-full bg-dark-900 border border-purple-500/40 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option v-for="card in cartoes" :key="card.id" :value="card.id">{{ card.nome }}</option>
            </select>
          </div>
          <div v-else>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Conta / Banco</label>
            <select
              v-model="form.conta"
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
            >
              <option v-for="banco in bancos" :key="banco.id || banco.nome" :value="banco.nome">{{ banco.nome }}</option>
            </select>
          </div>
        </div>

        <!-- Parcelamento (cartão) -->
        <div v-if="form.usarCartao" class="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-purple-300">
            <span>Parcelamento da Compra</span>
            <span v-if="form.valor && form.totalParcelas > 1" class="font-mono text-white">
              {{ form.totalParcelas }}x de R$ {{ (form.valor / form.totalParcelas).toFixed(2) }}
            </span>
          </div>
          <select
            v-model.number="form.totalParcelas"
            class="w-full bg-dark-900 border border-purple-500/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
          >
            <option :value="1">À vista (1x de R$ {{ (form.valor || 0).toFixed(2) }})</option>
            <option v-for="n in 23" :key="n" :value="n + 1">
              {{ n + 1 }}x de R$ {{ form.valor ? (form.valor / (n + 1)).toFixed(2) : '0.00' }}
            </option>
          </select>
        </div>

        <!-- Observação (opcional) -->
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Observação (opcional)</label>
          <input
            v-model="form.observacao"
            type="text"
            placeholder="Anotação adicional..."
            class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-dark-700/80">
          <button
            type="button"
            @click="$emit('fechar')"
            class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex-1 sm:flex-none"
            :class="modoEditar ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-brand hover:bg-brand-400 text-dark-950 shadow-glow-emerald'"
          >
            {{ modoEditar ? '💾 Salvar Alterações' : '+ Salvar Lançamento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'
import { useWorkspace } from '~/composables/useWorkspace'

const props = defineProps({
  aberto: { type: Boolean, default: false },
  lancamentoParaEditar: { type: Object, default: null }
})

const emit = defineEmits(['fechar', 'salvar'])
const { bancos, cartoes, categorias, carregarTudo } = useFinancas()
const { membrosGrupo } = useWorkspace()
const user = useSupabaseUser()

const today = new Date().toISOString().split('T')[0]
const modoEditar = computed(() => !!props.lancamentoParaEditar)

const nomeParceiro = computed(() => {
  const parceiro = membrosGrupo.value.find(m => m.user_id !== user.value?.id)
  return parceiro?.perfil?.nome || 'Parceiro(a)'
})

const form = reactive({
  tipo: 'despesa',
  usarCartao: false,
  dividir5050: true,
  cartao_id: '',
  totalParcelas: 1,
  descricao: '',
  valor: null,
  data: today,
  categoria: '',
  conta: '',
  observacao: ''
})

// Categorias filtradas pelo tipo selecionado
const categoriasFiltradas = computed(() => {
  return categorias.value.filter(c => c.tipo === form.tipo)
})

const initForm = () => {
  if (props.lancamentoParaEditar) {
    const l = props.lancamentoParaEditar
    form.tipo = l.tipo || 'despesa'
    form.descricao = l.descricao || ''
    form.valor = l.valor || null
    form.data = l.data || today
    form.categoria = l.categoria || ''
    form.conta = l.conta || ''
    form.usarCartao = !!l.cartao_id
    form.cartao_id = l.cartao_id || ''
    form.dividir5050 = true
    form.totalParcelas = l.total_parcelas || 1
    form.observacao = l.observacao || ''
  } else {
    form.tipo = 'despesa'
    form.descricao = ''
    form.valor = null
    form.data = today
    form.usarCartao = false
    form.dividir5050 = true
    form.cartao_id = cartoes.value[0]?.id || ''
    form.totalParcelas = 1
    form.conta = bancos.value[0]?.nome || ''
    form.categoria = categorias.value.find(c => c.tipo === 'despesa')?.nome || ''
    form.observacao = ''
  }
}

onMounted(async () => {
  await carregarTudo()
  initForm()
})

watch(() => props.aberto, (novo) => {
  if (novo) initForm()
})

// Quando tipo muda, atualiza categoria padrão
watch(() => form.tipo, (novoTipo) => {
  const catDoTipo = categorias.value.find(c => c.tipo === novoTipo)
  if (catDoTipo) form.categoria = catDoTipo.nome
})

watch(() => form.usarCartao, (novo) => {
  if (novo && (!form.cartao_id || form.cartao_id === '') && cartoes.value.length > 0) {
    form.cartao_id = cartoes.value[0].id || ''
  }
})

const salvar = () => {
  emit('salvar', {
    ...form,
    id: props.lancamentoParaEditar?.id || Date.now(),
    _editando: modoEditar.value
  })
  emit('fechar')
}
</script>
