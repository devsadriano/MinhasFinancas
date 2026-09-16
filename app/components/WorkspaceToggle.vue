<template>
  <div class="flex items-center gap-3">
    <!-- Selector de Grupo / Workspace -->
    <div v-if="gruposDisponiveis.length > 1" class="relative">
      <select
        :value="grupoAtivo?.id"
        @change="e => trocarGrupo((e.target as HTMLSelectElement).value)"
        class="bg-dark-800 border border-dark-700 hover:border-brand/40 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-brand transition-colors cursor-pointer pr-8 appearance-none"
      >
        <option v-for="g in gruposDisponiveis" :key="g.id" :value="g.id">
          🏠 {{ g.nome }}
        </option>
      </select>
      <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Toggle Pill Visão Casal vs Minha Visão -->
    <div class="relative bg-dark-900 border border-dark-700/80 p-1 rounded-xl flex items-center shadow-inner">
      <!-- Sliders / Background animado -->
      <div
        class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-brand to-emerald-400 rounded-lg shadow-glow-emerald transition-all duration-300 ease-out"
        :class="modoVisao === 'casal' ? 'left-1' : 'left-[calc(50%+2px)] bg-gradient-to-r from-purple-600 to-purple-400 shadow-purple-500/20'"
      ></div>

      <!-- Botão 1: Visão Casal -->
      <button
        type="button"
        @click="setModo('casal')"
        class="relative z-10 flex-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
        :class="modoVisao === 'casal' ? 'text-dark-950 font-black' : 'text-gray-400 hover:text-white'"
      >
        <span>👩‍❤️‍👨</span>
        <span>Visão Casal</span>
      </button>

      <!-- Botão 2: Minha Visão -->
      <button
        type="button"
        @click="setModo('pessoal')"
        class="relative z-10 flex-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
        :class="modoVisao === 'pessoal' ? 'text-white font-black' : 'text-gray-400 hover:text-white'"
      >
        <span>👤</span>
        <span>Minha Visão</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspace } from '~/composables/useWorkspace'

const emit = defineEmits<{
  (e: 'change', modo: 'casal' | 'pessoal'): void
}>()

const { grupoAtivo, gruposDisponiveis, modoVisao, trocarGrupo, alternarModoVisao } = useWorkspace()

const setModo = (novoModo: 'casal' | 'pessoal') => {
  if (modoVisao.value !== novoModo) {
    alternarModoVisao()
    emit('change', novoModo)
  }
}
</script>
