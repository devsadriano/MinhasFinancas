<template>
  <div v-if="aberto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
    <div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-dark-700 pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span>🎯 Definir Teto de Gastos</span>
        </h3>
        <button @click="$emit('fechar')" class="text-gray-400 hover:text-white">✕</button>
      </div>

      <form @submit.prevent="salvar" class="space-y-4">
        <!-- Categoria -->
        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Categoria de Despesa</label>
          <select
            v-model="form.categoria_id"
            @change="atualizarCategoriaNome"
            class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
            required
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option v-for="cat in categoriasDespesa" :key="cat.id || cat.nome" :value="cat.id || cat.nome">
              {{ cat.icone }} {{ cat.nome }}
            </option>
          </select>
        </div>

        <!-- Limite de Gastos (Moeda) -->
        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Limite Máximo Mensal (R$)</label>
          <input
            v-model.number="form.limite"
            type="number"
            step="10"
            min="1"
            required
            placeholder="Ex: 800.00"
            class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-brand"
          />
        </div>

        <!-- Mês e Ano (Exibição Informativa) -->
        <div class="p-3 bg-dark-900/60 border border-dark-700 rounded-xl flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Período Vigente:</span>
          <span class="font-bold text-white">{{ periodoLabel }}</span>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" @click="$emit('fechar')" class="px-4 py-2 text-xs text-gray-400">Cancelar</button>
          <button type="submit" class="bg-brand text-dark-950 font-bold px-5 py-2 rounded-xl text-xs shadow-glow-emerald">
            Salvar Teto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useFinancas } from '~/composables/useFinancas'

const props = withDefaults(
  defineProps<{
    aberto?: boolean
    mes?: number
    ano?: number
  }>(),
  {
    aberto: false,
    mes: () => new Date().getMonth() + 1,
    ano: () => new Date().getFullYear()
  }
)

const emit = defineEmits<{
  (e: 'fechar'): void
  (e: 'salvo'): void
}>()

const { categorias, salvarOrcamento } = useFinancas()

const categoriasDespesa = computed(() => categorias.value.filter(c => c.tipo === 'despesa'))
const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const periodoLabel = computed(() => `${nomesMeses[props.mes - 1]} ${props.ano}`)

const form = reactive({
  categoria_id: '',
  categoria_nome: '',
  limite: null as number | null,
  icone: '🏷️',
  cor: '#3b82f6'
})

const atualizarCategoriaNome = () => {
  const cat = categorias.value.find(c => c.id === form.categoria_id || c.nome === form.categoria_id)
  if (cat) {
    form.categoria_nome = cat.nome
    form.icone = cat.icone || '🏷️'
    form.cor = cat.cor || '#3b82f6'
  }
}

watch(() => props.aberto, (novo) => {
  if (novo) {
    form.categoria_id = categoriasDespesa.value[0]?.id || categoriasDespesa.value[0]?.nome || ''
    atualizarCategoriaNome()
    form.limite = null
  }
})

const salvar = async () => {
  if (!form.categoria_nome || !form.limite) return

  await salvarOrcamento({
    categoria_id: form.categoria_id,
    categoria_nome: form.categoria_nome,
    limite: Number(form.limite),
    mes: props.mes,
    ano: props.ano,
    icone: form.icone,
    cor: form.cor
  })

  emit('salvo')
  emit('fechar')
}
</script>
