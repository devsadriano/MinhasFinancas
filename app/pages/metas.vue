<template>
  <div class="space-y-8 pb-12">
    <!-- Header da Página -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span>🎯</span> Caixinhas & Metas Compartilhadas
        </h1>
        <p class="text-xs text-gray-400 mt-1">
          Planeje e economize dinheiro junto com seu parceiro(a) para a realização de grandes sonhos.
        </p>
      </div>

      <!-- Toggle Visão Workspace / Casal -->
      <WorkspaceToggle />
    </div>

    <!-- Componente Principal de Metas -->
    <MetasCompartilhadas />
  </div>
</template>

<script setup lang="ts">
import WorkspaceToggle from '~/components/WorkspaceToggle.vue'
import MetasCompartilhadas from '~/components/MetasCompartilhadas.vue'

useHead({
  title: 'Metas Compartilhadas - MinhasFinancas'
})
</script>
