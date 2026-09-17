<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-dark-850/90 backdrop-blur-lg border-t border-dark-700/80 pb-[env(safe-area-inset-bottom)] select-none">
    <div class="flex items-center justify-around h-16 px-2 relative">
      <!-- 1. Início -->
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors"
        :class="route.path === '/' ? 'text-brand font-bold' : 'text-gray-400 hover:text-gray-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px] mt-0.5">Início</span>
      </NuxtLink>

      <!-- 2. Extrato -->
      <NuxtLink
        to="/lancamentos"
        class="flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors"
        :class="route.path === '/lancamentos' ? 'text-brand font-bold' : 'text-gray-400 hover:text-gray-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span class="text-[10px] mt-0.5">Extrato</span>
      </NuxtLink>

      <!-- 3. FAB (+) Botão Flutuante Central -->
      <div class="relative -top-5 flex items-center justify-center">
        <button
          @click="emit('abrirNovoLancamento')"
          class="w-13 h-13 rounded-full bg-brand text-dark-950 font-extrabold flex items-center justify-center shadow-glow-emerald border-4 border-dark-900 active:scale-95 transition-transform cursor-pointer"
          title="Novo Lançamento"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- 4. Metas -->
      <NuxtLink
        to="/metas"
        class="flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors"
        :class="route.path === '/metas' ? 'text-brand font-bold' : 'text-gray-400 hover:text-gray-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span class="text-[10px] mt-0.5">Metas</span>
      </NuxtLink>

      <!-- 5. Ajustes / Configurações -->
      <NuxtLink
        to="/configuracoes"
        class="flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors"
        :class="route.path === '/configuracoes' ? 'text-brand font-bold' : 'text-gray-400 hover:text-gray-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-[10px] mt-0.5">Ajustes</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['abrirNovoLancamento'])
</script>
