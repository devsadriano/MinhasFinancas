<template>
  <div class="min-h-screen bg-dark-950 flex items-center justify-center p-4 bg-grid-pattern selection:bg-brand/30 selection:text-brand">
    <div class="w-full max-w-md bg-dark-900 border border-dark-700/90 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <!-- Glow Emerald Background -->
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header Logo -->
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand mx-auto mb-3 shadow-glow-emerald">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-extrabold text-white tracking-tight">Minhas Finanças</h2>
        <p class="text-xs text-gray-400 mt-1">Acesse ou crie sua conta para gerenciar seu patrimônio</p>
      </div>

      <!-- Tab Switch (Entrar / Cadastrar) -->
      <div class="grid grid-cols-2 gap-1 p-1 bg-dark-950 border border-dark-700/80 rounded-xl mb-6">
        <button
          type="button"
          @click="modo = 'login'"
          class="py-2 text-xs font-bold rounded-lg transition-all"
          :class="modo === 'login' ? 'bg-dark-800 text-white shadow-sm border border-dark-700' : 'text-gray-400 hover:text-white'"
        >
          Entrar
        </button>
        <button
          type="button"
          @click="modo = 'registro'"
          class="py-2 text-xs font-bold rounded-lg transition-all"
          :class="modo === 'registro' ? 'bg-dark-800 text-white shadow-sm border border-dark-700' : 'text-gray-400 hover:text-white'"
        >
          Criar Conta
        </button>
      </div>

      <!-- Mensagem de Erro / Sucesso -->
      <div v-if="mensagemErro" class="mb-4 p-3 rounded-lg bg-expense/10 border border-expense/30 text-expense text-xs font-medium">
        {{ mensagemErro }}
      </div>
      <div v-if="mensagemSucesso" class="mb-4 p-3 rounded-lg bg-income/10 border border-income/30 text-income text-xs font-medium">
        {{ mensagemSucesso }}
      </div>

      <!-- Form Login / Registro -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="modo === 'registro'">
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Nome Completo</label>
          <input 
            v-model="nome"
            type="text"
            placeholder="Seu nome"
            required
            class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">E-mail</label>
          <input 
            v-model="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            required
            class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Senha</label>
          <input 
            v-model="senha"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
          />
        </div>

        <button 
          type="submit"
          :disabled="carregando"
          class="w-full bg-brand hover:bg-brand-400 disabled:opacity-50 text-dark-950 font-bold py-3 rounded-lg text-sm transition-all shadow-glow-emerald mt-2 flex items-center justify-center gap-2"
        >
          <svg v-if="carregando" class="animate-spin h-4 w-4 text-dark-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ carregando ? 'Processando...' : (modo === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const modo = ref('login') // 'login' ou 'registro'
const nome = ref('')
const email = ref('')
const senha = ref('')
const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')

// Se o usuário já estiver logado, redireciona para a home
watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const handleSubmit = async () => {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  carregando.value = true

  try {
    if (modo.value === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: senha.value
      })

      if (error) throw error
      navigateTo('/')
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: senha.value,
        options: {
          data: {
            nome: nome.value
          }
        }
      })

      if (error) throw error

      mensagemSucesso.value = 'Conta criada com sucesso! Redirecionando para o sistema...'

      // Se o Supabase retornou sessão, navega direto. Caso contrário, faz login em seguida.
      if (data?.session) {
        await navigateTo('/')
      } else {
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: senha.value
        })
        if (!loginErr) {
          await navigateTo('/')
        } else {
          // Se precisar de confirmação por e-mail ou se auto-login falhar
          setTimeout(() => {
            navigateTo('/')
          }, 1200)
        }
      }
    }
  } catch (err: any) {
    let msg = err?.message || 'Erro ao processar solicitação'
    if (msg.toLowerCase().includes('rate limit')) {
      msg = 'Muitas tentativas seguidas de criação de conta/e-mail. No Supabase, desative a opção "Confirm email" em Authentication -> Providers -> Email para liberar criar contas instantaneamente sem limite.'
    } else if (msg.toLowerCase().includes('already registered')) {
      msg = 'Este e-mail já está cadastrado. Alterne para a aba "Entrar".'
    } else if (msg.toLowerCase().includes('invalid login credentials')) {
      msg = 'E-mail ou senha incorretos. Verifique os dados e tente novamente.'
    }
    mensagemErro.value = msg
  } finally {
    carregando.value = false
  }
}
</script>
