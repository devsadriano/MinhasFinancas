<template>
  <div class="min-h-screen bg-dark-900 text-gray-100 flex font-sans antialiased selection:bg-brand/30 selection:text-brand">
    <!-- Sidebar Navigation (Desktop & Mobile drawer) -->
    <Sidebar ref="sidebarRef" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-grid-pattern pb-24 md:pb-0">
      <!-- Mobile Top Bar -->
      <div class="lg:hidden h-14 bg-dark-850/90 backdrop-blur-md border-b border-dark-700/60 flex items-center justify-between px-4 sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <button
            class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-dark-700 transition-colors focus:outline-none"
            @click="openSidebar"
            aria-label="Abrir menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="font-bold text-white text-sm">Minhas Finanças</span>
          </div>
        </div>

        <button
          @click="modalNovoLancamentoAberto = true"
          class="bg-brand text-dark-950 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-glow-emerald"
        >
          <span>+ Novo</span>
        </button>
      </div>

      <slot />

      <!-- PWA Bottom Navigation Bar (Mobile only) -->
      <BottomNav @abrirNovoLancamento="modalNovoLancamentoAberto = true" />

      <!-- Modal Global de Novo Lançamento -->
      <ModalNovoLancamento
        :aberto="modalNovoLancamentoAberto"
        @fechar="modalNovoLancamentoAberto = false"
        @salvar="handleSalvarNovoLancamento"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import BottomNav from '~/components/BottomNav.vue'
import ModalNovoLancamento from '~/components/ModalNovoLancamento.vue'
import { useFinancas } from '~/composables/useFinancas'

const sidebarRef = ref<any>(null)
const modalNovoLancamentoAberto = ref(false)
const { adicionarLancamento } = useFinancas()

const openSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.mobileOpen = true
  }
}

const handleSalvarNovoLancamento = async (item: any) => {
  await adicionarLancamento(item)
  modalNovoLancamentoAberto.value = false
}
</script>
