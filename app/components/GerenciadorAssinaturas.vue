<template>
  <div class="space-y-6">
    <!-- Header e Ação do Módulo -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          Assinaturas & Contas Recorrentes ({{ recorrentes.length }})
        </h3>
        <p class="text-xs text-gray-400">Despesas geradas automaticamente no dia do vencimento</p>
      </div>

      <button
        @click="abrirModal"
        class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>+ Nova Recorrência</span>
      </button>
    </div>

    <!-- Indicador de Carregamento -->
    <div v-if="carregando" class="py-12 text-center text-purple-400">
      <svg class="animate-spin h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Empty State -->
      <div v-if="recorrentes.length === 0" class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-8 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 text-2xl font-bold">
          🔄
        </div>
        <div>
          <h4 class="text-sm font-bold text-white">Nenhuma despesa recorrente cadastrada</h4>
          <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Cadastre suas assinaturas (Netflix, Spotify, Luz, Aluguel) e deixe o sistema lançar e dividir automaticamente todo mês!
          </p>
        </div>
        <button
          @click="abrirModal"
          class="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
        >
          + Cadastrar Primeira Recorrência
        </button>
      </div>

      <!-- Grid de Assinaturas e Recorrências -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in recorrentes"
          :key="item.id || item.descricao"
          class="bg-dark-800/90 border rounded-2xl p-4 shadow-supabase transition-all hover:border-dark-600 flex flex-col justify-between space-y-4 relative overflow-hidden group"
          :class="item.ativo ? 'border-dark-700/80' : 'border-dark-800 opacity-50 bg-dark-900/40'"
        >
          <!-- Top Card: Ícone, Nome e Badges -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div 
                class="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold border shrink-0 transition-transform group-hover:scale-105"
                :style="{ backgroundColor: (item.categoria_cor || '#8b5cf6') + '20', borderColor: (item.categoria_cor || '#8b5cf6') + '40', color: item.categoria_cor || '#8b5cf6' }"
              >
                {{ item.categoria_icone || '🔄' }}
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-white truncate leading-tight">{{ item.descricao }}</h4>
                <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span class="text-[10px] bg-dark-900 border border-dark-700 text-gray-300 px-2 py-0.5 rounded font-mono font-medium">
                    Vence dia {{ item.dia_vencimento }}
                  </span>
                  <span v-if="item.dividir_50_50" class="text-[10px] bg-brand/10 border border-brand/30 text-brand px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    👩‍❤️‍👨 50/50
                  </span>
                </div>
              </div>
            </div>

            <!-- Toggle Ativo/Inativo -->
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                :checked="item.ativo"
                @change="toggleAtivo(item)"
                class="sr-only peer"
              >
              <div class="w-8 h-4 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          <!-- Bottom Card: Valor e Ações -->
          <div class="pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs">
            <div>
              <span class="text-[10px] text-gray-500 uppercase tracking-wider block font-mono">Valor Mensal</span>
              <span class="text-base font-extrabold font-mono text-expense">R$ {{ Number(item.valor).toFixed(2) }}</span>
            </div>

            <button
              @click="excluir(item.id)"
              class="text-gray-500 hover:text-expense p-1.5 rounded-lg hover:bg-expense/10 transition-colors"
              title="Excluir Recorrência"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Simplificado de Cadastro de Nova Assinatura/Recorrência -->
    <div v-if="modalAberto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-dark-700 pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span>🔄 Nova Despesa Recorrente</span>
          </h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="salvar" class="space-y-4">
          <!-- Nome da Despesa -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome da Assinatura / Conta</label>
            <input 
              v-model="form.descricao"
              type="text"
              placeholder="Ex: Netflix, Internet Enel, Aluguel, Spotify"
              required
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <!-- Valor e Dia do Vencimento -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Valor (R$)</label>
              <input 
                v-model.number="form.valor"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="55.90"
                class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
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
                placeholder="10"
                class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Categoria</label>
            <select
              v-model="form.categoria_id"
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            >
              <option v-for="cat in categoriasDespesa" :key="cat.id" :value="cat.id">
                {{ cat.icone }} {{ cat.nome }}
              </option>
            </select>
          </div>

          <!-- Toggle Dividir 50/50 -->
          <div class="p-3 bg-dark-900 border border-brand/30 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">👩‍❤️‍👨</span>
              <div>
                <p class="text-xs font-bold text-white">Dividir 50/50 com o Casal</p>
                <p class="text-[10px] text-gray-400">Gera rateio automático no acerto de contas</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.dividir_50_50" class="sr-only peer">
              <div class="w-9 h-5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-xs text-gray-400">Cancelar</button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-xl text-xs">
              + Cadastrar Recorrência
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useFinancas } from '~/composables/useFinancas'
import { useWorkspace } from '~/composables/useWorkspace'

const { categorias, carregarTudo } = useFinancas()
const { grupoAtivo } = useWorkspace()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const db = supabase as any

const carregando = ref(false)
const modalAberto = ref(false)
const recorrentes = ref<any[]>([])

const categoriasDespesa = computed(() => categorias.value.filter(c => c.tipo === 'despesa'))

const form = reactive({
  descricao: '',
  valor: null,
  dia_vencimento: 10,
  categoria_id: '',
  dividir_50_50: true,
  frequencia: 'mensal',
  tipo: 'despesa'
})

const carregarRecorrentes = async () => {
  carregando.value = true
  try {
    if (user.value) {
      const { data } = await db
        .from('transacoes_recorrentes')
        .select('*, categorias(nome, icone, cor)')
        .order('dia_vencimento', { ascending: true })

      if (data) {
        recorrentes.value = data.map((r: any) => ({
          ...r,
          categoria_icone: r.categorias?.icone || '🔄',
          categoria_cor: r.categorias?.cor || '#8b5cf6'
        }))
      }
    } else {
      // Fallback local
      if (recorrentes.value.length === 0) {
        recorrentes.value = [
          { id: 'rec-1', descricao: 'Netflix 4K', valor: 55.90, dia_vencimento: 10, dividir_50_50: true, ativo: true, categoria_icone: '🍿', categoria_cor: '#ef4444' },
          { id: 'rec-2', descricao: 'Spotify Família', valor: 34.90, dia_vencimento: 15, dividir_50_50: true, ativo: true, categoria_icone: '🎵', categoria_cor: '#10b981' },
          { id: 'rec-3', descricao: 'Conta de Luz (Enel)', valor: 240.00, dia_vencimento: 20, dividir_50_50: true, ativo: true, categoria_icone: '💡', categoria_cor: '#f59e0b' }
        ]
      }
    }
  } catch (e) {
    console.error('Erro ao carregar recorrentes:', e)
  } finally {
    carregando.value = false
  }
}

onMounted(async () => {
  await carregarTudo()
  await carregarRecorrentes()
})

const abrirModal = () => {
  form.descricao = ''
  form.valor = null
  form.dia_vencimento = 10
  form.categoria_id = categoriasDespesa.value[0]?.id || ''
  form.dividir_50_50 = true
  modalAberto.value = true
}

const fecharModal = () => { modalAberto.value = false }

const salvar = async () => {
  const cat = categorias.value.find(c => c.id === form.categoria_id)
  const novoItem: any = {
    id: `rec-${Date.now()}`,
    descricao: form.descricao,
    valor: Number(form.valor),
    dia_vencimento: form.dia_vencimento,
    categoria_id: form.categoria_id || null,
    categoria_icone: cat?.icone || '🔄',
    categoria_cor: cat?.cor || '#8b5cf6',
    dividir_50_50: form.dividir_50_50,
    ativo: true,
    frequencia: 'mensal',
    tipo: 'despesa'
  }

  recorrentes.value.push(novoItem)

  if (user.value) {
    try {
      const { data } = await db.from('transacoes_recorrentes').insert([{
        user_id: user.value.id,
        grupo_id: grupoAtivo.value?.id || null,
        categoria_id: form.categoria_id || null,
        descricao: form.descricao,
        valor: Number(form.valor),
        dia_vencimento: form.dia_vencimento,
        dividir_50_50: form.dividir_50_50,
        frequencia: 'mensal',
        tipo: 'despesa',
        ativo: true
      }]).select().single()

      if (data) novoItem.id = data.id
    } catch (e) {
      console.error('Erro ao salvar recorrente no Supabase:', e)
    }
  }

  fecharModal()
}

const toggleAtivo = async (item: any) => {
  item.ativo = !item.ativo
  if (user.value && item.id && !item.id.startsWith('rec-')) {
    await db.from('transacoes_recorrentes').update({ ativo: item.ativo }).eq('id', item.id)
  }
}

const excluir = async (id: string) => {
  recorrentes.value = recorrentes.value.filter(r => r.id !== id)
  if (user.value && id && !id.startsWith('rec-')) {
    await db.from('transacoes_recorrentes').delete().eq('id', id)
  }
}
</script>
