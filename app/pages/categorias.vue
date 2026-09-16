<template>
  <div>
    <Header 
      title="Categorias Financeiras" 
      subtitle="Organize suas despesas e receitas por grupos customizados"
      :showAction="false"
    />

    <main class="p-4 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6">
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-4">
          <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand"></span>
            Categorias ({{ categorias.length }})
          </h3>
          <!-- Filtro rápido -->
          <div class="flex items-center gap-1 bg-dark-800 border border-dark-700 rounded-lg p-1">
            <button
              @click="filtroTipo = 'todos'"
              class="px-3 py-1 rounded text-xs font-semibold transition-all"
              :class="filtroTipo === 'todos' ? 'bg-brand text-dark-950' : 'text-gray-400 hover:text-white'"
            >Todos</button>
            <button
              @click="filtroTipo = 'receita'"
              class="px-3 py-1 rounded text-xs font-semibold transition-all"
              :class="filtroTipo === 'receita' ? 'bg-income text-dark-950' : 'text-gray-400 hover:text-white'"
            >Receitas</button>
            <button
              @click="filtroTipo = 'despesa'"
              class="px-3 py-1 rounded text-xs font-semibold transition-all"
              :class="filtroTipo === 'despesa' ? 'bg-expense text-white' : 'text-gray-400 hover:text-white'"
            >Despesas</button>
            <button
              @click="filtroTipo = 'essenciais'"
              class="px-3 py-1 rounded text-xs font-semibold transition-all"
              :class="filtroTipo === 'essenciais' ? 'bg-amber-400 text-dark-950 font-bold' : 'text-gray-400 hover:text-white'"
            >⚡ Essenciais</button>
          </div>
        </div>

        <button 
          @click="abrirModalNova"
          class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-glow-emerald flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Nova Categoria</span>
        </button>
      </div>

      <div v-if="carregando" class="py-12 text-center text-brand">
        <svg class="animate-spin h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="cat in categoriasFiltradas" 
          :key="cat.id || cat.nome"
          class="bg-dark-800 border border-dark-700/80 rounded-2xl p-5 shadow-supabase hover:border-dark-600 transition-all group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div 
                class="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl border transition-all group-hover:scale-110"
                :style="{ backgroundColor: cat.cor + '20', borderColor: cat.cor + '40', color: cat.cor }"
              >
                {{ cat.icone }}
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">{{ cat.nome }}</h3>
                <div class="flex items-center gap-2 mt-0.5">
                  <span 
                    class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                    :class="cat.tipo === 'receita' ? 'bg-income/10 text-income border-income/30' : 'bg-expense/10 text-expense border-expense/30'"
                  >
                    {{ cat.tipo }}
                  </span>
                  <span 
                    v-if="cat.tipo === 'despesa'"
                    class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                    :class="cat.essencial ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'"
                  >
                    {{ cat.essencial ? '⚡ Essencial' : '🎈 Supérfluo' }}
                  </span>
                  <span class="text-[11px] text-gray-500 font-mono">{{ getLancamentosCount(cat) }} lançamentos</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="abrirModalEditar(cat)"
                class="p-1.5 rounded-lg text-gray-500 hover:text-brand hover:bg-brand/10 transition-colors"
                title="Editar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmarExcluir(cat)"
                :disabled="!cat.id || !cat.user_id"
                class="p-1.5 rounded-lg text-gray-500 hover:text-expense hover:bg-expense/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                :title="!cat.user_id ? 'Categoria padrão do sistema' : 'Excluir'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="categoriasFiltradas.length === 0" class="col-span-full py-16 text-center">
          <p class="text-white font-bold mb-1">Nenhuma categoria encontrada</p>
          <button @click="abrirModalNova" class="text-brand text-sm hover:underline mt-2">+ Nova Categoria</button>
        </div>
      </div>
    </main>

    <!-- Modal Criar/Editar Categoria -->
    <div v-if="modalAberto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-dark-700 pb-3">
          <h3 class="text-base font-bold text-white">{{ modoEditar ? 'Editar Categoria' : 'Nova Categoria' }}</h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="salvarCategoria" class="space-y-4">
          <!-- Preview -->
          <div class="flex items-center gap-3 p-3 bg-dark-900 border border-dark-700 rounded-xl">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl border"
              :style="{ backgroundColor: form.cor + '20', borderColor: form.cor + '40', color: form.cor }"
            >
              {{ form.icone || '🏷️' }}
            </div>
            <div>
              <p class="text-sm font-bold text-white">{{ form.nome || 'Nome da Categoria' }}</p>
              <span 
                class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border"
                :class="form.tipo === 'receita' ? 'bg-income/10 text-income border-income/30' : 'bg-expense/10 text-expense border-expense/30'"
              >
                {{ form.tipo }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome da Categoria</label>
            <input 
              v-model="form.nome"
              type="text"
              placeholder="Ex: Assinaturas, Pets, Educação"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Tipo</label>
              <select 
                v-model="form.tipo"
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              >
                <option value="despesa">Despesa (-)</option>
                <option value="receita">Receita (+)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Emoji / Ícone</label>
              <input 
                v-model="form.icone"
                type="text"
                maxLength="2"
                required
                placeholder="📦"
                class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand text-center text-xl"
              />
            </div>
          </div>

          <!-- Classificação de Custo Essencial vs Não Essencial (Primo Pobre) -->
          <div v-if="form.tipo === 'despesa'" class="p-3 bg-dark-900/80 border border-amber-500/20 rounded-xl space-y-1">
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input 
                v-model="form.essencial"
                type="checkbox"
                class="w-4 h-4 rounded border-dark-600 bg-dark-950 text-brand focus:ring-brand accent-amber-400"
              />
              <span class="text-xs font-bold text-white flex items-center gap-1.5">
                ⚡ Despesa Essencial (Custo Fixo/Básico)
              </span>
            </label>
            <p class="text-[11px] text-gray-400 pl-6 leading-tight">
              Moradia, alimentação, água, luz, saúde e transporte. Usado para calcular sua Reserva de Emergência (6x custo básico).
            </p>
          </div>

          <!-- Emojis sugeridos -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-2">Ícones Rápidos</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="emoji in emojisSugeridos"
                :key="emoji"
                type="button"
                @click="form.icone = emoji"
                class="w-8 h-8 rounded-lg text-lg transition-all hover:bg-dark-700 border"
                :class="form.icone === emoji ? 'border-brand bg-brand/10' : 'border-transparent'"
              >{{ emoji }}</button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Cor</label>
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

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-xs text-gray-400">Cancelar</button>
            <button type="submit" class="bg-brand text-dark-950 font-bold px-5 py-2 rounded-lg text-xs">
              {{ modoEditar ? 'Salvar' : 'Criar Categoria' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Exclusão -->
    <div v-if="modalExcluir" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-dark-800 border border-expense/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-white">Excluir Categoria</h3>
        <p class="text-sm text-gray-300">
          Deseja excluir <strong class="text-white">{{ catParaExcluir?.nome }}</strong>?
          Os lançamentos com esta categoria ficarão sem categoria definida.
        </p>
        <div class="flex items-center justify-end gap-2">
          <button @click="modalExcluir = false" class="px-4 py-2 text-xs text-gray-400">Cancelar</button>
          <button @click="executarExcluir" class="bg-expense text-white font-bold px-5 py-2 rounded-lg text-xs">
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'

const { categorias, transacoes, carregando, carregarTudo, adicionarCategoria, editarCategoria, excluirCategoria } = useFinancas()

const modalAberto = ref(false)
const modalExcluir = ref(false)
const modoEditar = ref(false)
const catParaExcluir = ref(null)
const catEditandoId = ref(null)
const filtroTipo = ref('todos')

const emojisSugeridos = ['🍔','🏠','💰','🚗','📈','✈️','🏥','📦','💡','🛒','👕','📚','🎮','💼','💻','🐾','🎵','💎','🔧','📱','⚽','🎂','🍷','☕']
const coresSugeridas = ['#3ecf8e','#ef4444','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#10b981','#84cc16','#f97316','#94a3b8','#820ad1']

const form = reactive({
  nome: '',
  tipo: 'despesa',
  icone: '🏷️',
  cor: '#3b82f6',
  essencial: true
})

const categoriasFiltradas = computed(() => {
  if (filtroTipo.value === 'todos') return categorias.value
  if (filtroTipo.value === 'essenciais') return categorias.value.filter(c => c.tipo === 'despesa' && c.essencial)
  return categorias.value.filter(c => c.tipo === filtroTipo.value)
})

const getLancamentosCount = (cat) => {
  return transacoes.value.filter(t =>
    t.categoria_id === cat.id || t.categoria === cat.nome
  ).length
}

onMounted(() => carregarTudo())

const abrirModalNova = () => {
  modoEditar.value = false
  catEditandoId.value = null
  form.nome = ''
  form.tipo = 'despesa'
  form.icone = '🏷️'
  form.cor = '#3b82f6'
  form.essencial = true
  modalAberto.value = true
}

const abrirModalEditar = (cat) => {
  modoEditar.value = true
  catEditandoId.value = cat.id
  form.nome = cat.nome
  form.tipo = cat.tipo
  form.icone = cat.icone
  form.cor = cat.cor
  form.essencial = cat.essencial ?? true
  modalAberto.value = true
}

const fecharModal = () => { modalAberto.value = false }

const salvarCategoria = async () => {
  if (modoEditar.value && catEditandoId.value) {
    await editarCategoria(catEditandoId.value, { ...form })
  } else {
    await adicionarCategoria({ ...form })
  }
  fecharModal()
}

const confirmarExcluir = (cat) => {
  catParaExcluir.value = cat
  modalExcluir.value = true
}

const executarExcluir = async () => {
  if (catParaExcluir.value?.id) {
    await excluirCategoria(catParaExcluir.value.id)
  }
  modalExcluir.value = false
}
</script>
