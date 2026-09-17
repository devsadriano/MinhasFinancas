<template>
  <!-- Wrapper para reservar espaço no layout flex em desktop -->
  <div class="w-0 lg:w-64 shrink-0">
    <!-- Mobile Overlay -->
    <Transition name="overlay">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Sidebar Element -->
    <aside
      class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-dark-850 border-r border-dark-700 flex flex-col justify-between z-50 select-none transition-transform lg:transition-none duration-300 ease-in-out"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Top section: Logo & Nav -->
      <div>
        <!-- Brand Header -->
        <div class="h-16 flex items-center px-6 border-b border-dark-700/60 gap-3">
          <div class="w-9 h-9 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shadow-glow-emerald">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="font-bold text-white tracking-wide text-base leading-tight">Minhas Finanças</h1>
            <span class="text-[10px] text-brand font-mono font-medium tracking-wider uppercase bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20">Supabase Edition</span>
          </div>
          <!-- Close button mobile -->
          <button
            class="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors focus:outline-none"
            @click="mobileOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="p-4 space-y-1.5">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group outline-none focus:outline-none"
            :class="[
              route.path === item.path
                ? 'bg-dark-800 text-white border border-dark-700 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800/50'
            ]"
            @click="mobileOpen = false"
          >
            <div
              class="w-2 h-2 rounded-full transition-colors"
              :class="route.path === item.path ? 'bg-brand shadow-glow-emerald' : 'bg-transparent group-hover:bg-dark-600'"
            />
            <component :is="item.icon" class="w-5 h-5 transition-colors" :class="route.path === item.path ? 'text-brand' : 'text-gray-400 group-hover:text-gray-200'" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Bottom User profile & Logout -->
      <div class="p-4 border-t border-dark-700/60 bg-dark-900/40">
        <div class="flex items-center justify-between p-2 rounded-lg bg-dark-800/60 border border-dark-700/80">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-xs shrink-0">
              {{ userInitial }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-200 truncate">{{ userName }}</p>
              <p class="text-[11px] text-gray-400 truncate">{{ userEmail }}</p>
            </div>
          </div>

          <button 
            @click="logout" 
            class="text-gray-400 hover:text-expense p-1.5 rounded-lg hover:bg-expense/10 transition-colors ml-1 shrink-0"
            title="Sair da Conta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  TagIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  ChartPieIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SparklesIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const mobileOpen = ref(false)

const userEmail = computed(() => user.value?.email || 'usuario@financas.app')
const userName = computed(() => user.value?.user_metadata?.nome || userEmail.value.split('@')[0] || 'Usuário')
const userInitial = computed(() => userName.value.substring(0, 2).toUpperCase())

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}

const menuItems = [
  { label: 'Visão Geral', path: '/', icon: HomeIcon },
  { label: 'Extrato & Lançamentos', path: '/lancamentos', icon: ArrowsRightLeftIcon },
  { label: 'Cartões & Faturas', path: '/cartoes', icon: CreditCardIcon },
  { label: 'Caixinhas & Metas', path: '/metas', icon: SparklesIcon },
  { label: 'Transferências', path: '/transferencias', icon: ArrowPathIcon },
  { label: 'Orçamentos & Tetos', path: '/orcamentos', icon: ChartPieIcon },
  { label: 'Relatórios', path: '/relatorios', icon: ChartBarIcon },
  { label: 'Categorias', path: '/categorias', icon: TagIcon },
  { label: 'Contas & Bancos', path: '/contas', icon: BuildingLibraryIcon },
  { label: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon },
]

defineExpose({ mobileOpen })
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
