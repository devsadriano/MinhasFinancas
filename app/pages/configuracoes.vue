<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-16">
    <!-- Header da Tela -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700/80 pb-5">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span>⚙️</span> Configurações do Workspace & Perfil
        </h1>
        <p class="text-xs text-gray-400 mt-1">
          Gerencie suas credenciais, nome do grupo de casal e vincule a conta do seu parceiro(a).
        </p>
      </div>

      <WorkspaceToggle />
    </div>

    <!-- Alert de Feedback Global -->
    <div 
      v-if="mensagemFeedback.texto" 
      class="p-4 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-lg transition-all animate-fade-in"
      :class="mensagemFeedback.tipo === 'sucesso' ? 'bg-income/15 border-income/30 text-income' : 'bg-expense/15 border-expense/30 text-expense'"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm">{{ mensagemFeedback.tipo === 'sucesso' ? '✅' : '⚠️' }}</span>
        <span>{{ mensagemFeedback.texto }}</span>
      </div>
      <button @click="mensagemFeedback.texto = ''" class="text-gray-400 hover:text-white font-bold text-sm">✕</button>
    </div>

    <!-- SESSÃO 1: MEU PERFIL E NOME DO GRUPO -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Card: Dados do Perfil -->
      <div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-supabase space-y-4">
        <div class="flex items-center gap-3 border-b border-dark-700 pb-3">
          <div class="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-bold">
            {{ userInitial }}
          </div>
          <div>
            <h2 class="text-sm font-bold text-white leading-tight">Meu Perfil</h2>
            <p class="text-xs text-gray-400 font-mono">Conta Autenticada</p>
          </div>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="text-gray-400 font-medium block mb-1">Nome Completo</label>
            <input 
              type="text"
              :value="userName"
              disabled
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-gray-300 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label class="text-gray-400 font-medium block mb-1">Endereço de E-mail</label>
            <input 
              type="email"
              :value="userEmail"
              disabled
              class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-gray-300 font-mono cursor-not-allowed"
            />
          </div>

          <div class="pt-2 flex items-center justify-between text-gray-400 font-mono text-[11px]">
            <span>Status: <strong class="text-brand">Ativo</strong></span>
            <span>ID: {{ userIdCurto }}</span>
          </div>
        </div>
      </div>

      <!-- Card: Dados do Grupo Familiar (Workspace) -->
      <div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-supabase space-y-4">
        <div class="flex items-center justify-between border-b border-dark-700 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xl font-bold">
              🏠
            </div>
            <div>
              <h2 class="text-sm font-bold text-white leading-tight">Meus Workspaces (Grupos)</h2>
              <p class="text-xs text-gray-400 font-mono">Gerencie e alterne seus painéis compartilhados</p>
            </div>
          </div>
          <span class="text-xs bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-bold px-2.5 py-1 rounded-full">
            {{ gruposDisponiveis.length }} grupo(s)
          </span>
        </div>

        <!-- Lista de Grupos Existentes -->
        <div class="space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-1">
          <div 
            v-for="g in gruposDisponiveis" 
            :key="g.id"
            class="p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer"
            :class="g.id === grupoAtivo?.id ? 'bg-brand/10 border-brand/40 text-white' : 'bg-dark-900 border-dark-700/80 text-gray-300 hover:bg-dark-750'"
            @click="trocarGrupo(g.id)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-base shrink-0">{{ g.id === grupoAtivo?.id ? '✨' : '🏡' }}</span>
              <div class="min-w-0">
                <p class="font-bold truncate" :class="g.id === grupoAtivo?.id ? 'text-brand' : 'text-white'">
                  {{ g.nome }}
                </p>
                <p class="text-[10px] text-gray-400 font-mono truncate" v-if="g.id === grupoAtivo?.id">
                  Workspace Ativo Selecionado
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span 
                v-if="g.id === grupoAtivo?.id"
                class="text-[10px] bg-brand/20 border border-brand/40 text-brand font-bold px-2 py-0.5 rounded-full uppercase"
              >
                Ativo
              </span>
              <button 
                v-else
                @click.stop="trocarGrupo(g.id)"
                class="text-[11px] bg-dark-700 hover:bg-dark-600 text-gray-200 px-2.5 py-1 rounded-lg font-medium transition-all"
              >
                Ativar
              </button>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleCriarGrupo" class="pt-3 border-t border-dark-700/80 space-y-2 text-xs">
          <label class="text-gray-300 font-semibold flex items-center justify-between">
            <span>➕ Criar Novo Workspace</span>
          </label>

          <div class="flex gap-2">
            <input 
              v-model="novoGrupoInput"
              type="text"
              placeholder="Digite o nome do novo workspace (ex: Casa Silva)"
              class="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-gray-500 font-medium focus:outline-none focus:border-brand"
            />
            <button 
              type="submit"
              :disabled="salvandoGrupo || !novoGrupoInput.trim()"
              class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 cursor-pointer shrink-0 shadow-glow-emerald"
            >
              {{ salvandoGrupo ? 'Criando...' : '+ Criar' }}
            </button>
          </div>
        </form>

        <!-- Opção de Renomear Grupo Ativo Atual -->
        <div v-if="grupoAtivo" class="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-dark-750">
          <span v-if="!editandoNomeGrupo">
            Renomear ativo: <strong class="text-white">{{ grupoAtivo.nome }}</strong>
          </span>
          <button 
            v-if="!editandoNomeGrupo"
            @click="editandoNomeGrupo = true; nomeGrupoEditavel = grupoAtivo.nome"
            class="text-brand hover:underline font-semibold"
          >
            ✏️ Editar Nome
          </button>

          <form v-else @submit.prevent="handleAtualizarNomeGrupo" class="w-full flex items-center gap-2">
            <input 
              v-model="nomeGrupoEditavel"
              type="text"
              required
              class="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-white"
            />
            <button type="submit" class="bg-brand text-dark-950 font-bold px-2.5 py-1 rounded-lg text-xs">
              Salvar
            </button>
            <button type="button" @click="editandoNomeGrupo = false" class="text-gray-400 hover:text-white text-xs">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- SESSÃO 2: MEMBROS DO CASAL & FORMULÁRIO DE VÍNCULO -->
    <div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-supabase space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div>
          <h2 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>👥</span> Membros do Grupo Familiar
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">
            Pessoas que possuem acesso às contas, cartões e lançamentos deste workspace.
          </p>
        </div>

        <span class="text-xs bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-bold px-3 py-1 rounded-full self-start sm:self-auto">
          Visão Casal Ativa
        </span>
      </div>

      <!-- Lista de Membros Atuais -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="membro in membrosGrupo"
          :key="membro.id || membro.user_id"
          class="bg-dark-900 border border-dark-750 rounded-xl p-4 flex items-center justify-between gap-3 shadow-inner"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-sm shrink-0">
              {{ ((membro.perfil?.nome || membro.perfis?.nome) || 'P').substring(0, 2).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-white truncate">
                {{ (membro.perfil?.nome || membro.perfis?.nome) || 'Usuário do Casal' }}
                <span v-if="membro.user_id === user?.id" class="text-[10px] text-brand font-normal">(Você)</span>
              </p>
              <p class="text-[11px] text-gray-400 font-mono truncate">
                {{ (membro.perfil?.email || membro.perfis?.email) || 'email@exemplo.com' }}
              </p>
            </div>
          </div>

          <span 
            class="text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-full shrink-0 border"
            :class="membro.papel === 'admin' ? 'bg-brand/15 border-brand/30 text-brand' : 'bg-blue-500/15 border-blue-500/30 text-blue-300'"
          >
            {{ membro.papel === 'admin' ? 'Admin' : 'Membro' }}
          </span>
        </div>
      </div>

      <!-- Form: Vincular Parceiro(a) por E-mail -->
      <div class="bg-dark-900/60 border border-dark-700 rounded-xl p-5 space-y-4">
        <div>
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>🔗</span> Vincular Parceiro(a) ao Seu Grupo
          </h3>
          <p class="text-xs text-gray-400 mt-1">
            Digite o e-mail cadastrado pelo seu parceiro(a). Uma vez vinculado, ambos visualizarão as finanças em conjunto.
          </p>
        </div>

        <form @submit.prevent="handleVincularParceiro" class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <input 
              v-model="emailParceiro"
              type="email"
              required
              placeholder="exemplo: parceiro@email.com"
              class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand font-mono"
            />
          </div>

          <button
            type="submit"
            :disabled="salvandoParceiro || !emailParceiro.trim()"
            class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2.5 rounded-xl transition-all text-xs shadow-glow-emerald flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <svg v-if="salvandoParceiro" class="animate-spin h-4 w-4 text-dark-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>{{ salvandoParceiro ? 'Viculando...' : 'Vincular Conta' }}</span>
          </button>
        </form>

        <p class="text-[11px] text-gray-400 flex items-center gap-1.5">
          <span>ℹ️</span>
          <span>Seu parceiro(a) precisa ter criado uma conta no sistema com este mesmo e-mail antes do vínculo.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import WorkspaceToggle from '~/components/WorkspaceToggle.vue'
import { useWorkspace } from '~/composables/useWorkspace'

useHead({
  title: 'Configurações & Grupo - MinhasFinancas'
})

const { 
  grupoAtivo, 
  gruposDisponiveis,
  membrosGrupo, 
  carregarWorkspace, 
  trocarGrupo,
  adicionarParceiro, 
  atualizarNomeGrupo,
  criarNovoGrupo
} = useWorkspace()

const user = useSupabaseUser()

const emailParceiro = ref('')
const novoGrupoInput = ref('')
const nomeGrupoEditavel = ref('')
const editandoNomeGrupo = ref(false)
const salvandoParceiro = ref(false)
const salvandoGrupo = ref(false)

const mensagemFeedback = ref<{ texto: string; tipo: 'sucesso' | 'erro' }>({
  texto: '',
  tipo: 'sucesso'
})

const userEmail = computed(() => user.value?.email || 'usuario@financas.app')
const userName = computed(() => user.value?.user_metadata?.nome || userEmail.value.split('@')[0] || 'Usuário')
const userInitial = computed(() => userName.value.substring(0, 2).toUpperCase())
const userIdCurto = computed(() => user.value?.id ? `${user.value.id.substring(0, 8)}...` : 'Local-Demo')

onMounted(async () => {
  await carregarWorkspace()
})

// Aguarda o auth do Supabase carregar antes de buscar o workspace
watch(user, async (novoUser) => {
  if (novoUser) {
    await carregarWorkspace()
  }
}, { immediate: true })

watch(grupoAtivo, (novo) => {
  if (novo) {
    nomeGrupoEditavel.value = novo.nome || ''
  }
}, { immediate: true })

const handleCriarGrupo = async () => {
  if (!novoGrupoInput.value.trim()) return
  salvandoGrupo.value = true
  const res = await criarNovoGrupo(novoGrupoInput.value)
  mensagemFeedback.value = {
    texto: res.mensagem,
    tipo: res.sucesso ? 'sucesso' : 'erro'
  }
  if (res.sucesso) {
    novoGrupoInput.value = '' // Deixa o input limpo/vazio por padrão
  }
  salvandoGrupo.value = false
}

const handleAtualizarNomeGrupo = async () => {
  if (!nomeGrupoEditavel.value.trim()) return
  salvandoGrupo.value = true
  const res = await atualizarNomeGrupo(nomeGrupoEditavel.value)
  mensagemFeedback.value = {
    texto: res.mensagem,
    tipo: res.sucesso ? 'sucesso' : 'erro'
  }
  if (res.sucesso) {
    editandoNomeGrupo.value = false
  }
  salvandoGrupo.value = false
}

const handleVincularParceiro = async () => {
  if (!emailParceiro.value.trim()) return

  salvandoParceiro.value = true
  mensagemFeedback.value = { texto: '', tipo: 'sucesso' }

  const res = await adicionarParceiro(emailParceiro.value)

  if (res.sucesso) {
    mensagemFeedback.value = {
      texto: res.mensagem,
      tipo: 'sucesso'
    }
    emailParceiro.value = ''
  } else {
    mensagemFeedback.value = {
      texto: res.mensagem,
      tipo: 'erro'
    }
  }

  salvandoParceiro.value = false
}
</script>
