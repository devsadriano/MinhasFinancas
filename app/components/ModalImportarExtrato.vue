<template>
  <div v-if="aberto" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
    <div class="bg-dark-800 border border-dark-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-dark-700/80 bg-dark-850">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white leading-tight">Importar Extrato Bancário</h3>
            <p class="text-xs text-gray-400">Leitura automática de OFX e CSV com inteligência de parcelas</p>
          </div>
        </div>

        <button @click="fechar" class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Step 1: Upload Dropzone usando Label nativo de HTML5 -->
      <div v-if="transacoes.length === 0" class="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
        <label 
          for="file-input-statement"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="handleDrop"
          class="w-full max-w-xl border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
          :class="dragOver ? 'border-brand bg-brand/10 scale-[1.01]' : 'border-dark-600 hover:border-brand/50 bg-dark-900/50 hover:bg-dark-900'"
        >
          <input 
            id="file-input-statement"
            ref="fileInputRef" 
            type="file" 
            accept=".pdf,.ofx,.csv,.txt,.md,.markdown" 
            class="hidden" 
            @change="handleFileSelect"
          />

          <div class="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div>
            <p class="text-sm font-bold text-white">Clique aqui para selecionar seu arquivo .PDF, .OFX, .CSV, .TXT ou .MD</p>
            <p class="text-xs text-gray-400 mt-1">Suporta faturas PDF e extratos do Nubank, Itaú, Inter, Bradesco, C6, Santander, PicPay, Mercado Pago, etc.</p>
          </div>

          <span class="bg-brand/15 border border-brand/30 text-brand text-xs font-semibold px-4 py-2 rounded-lg transition-colors group-hover:bg-brand/25 pointer-events-none">
            Escolher Arquivo do Computador
          </span>
        </label>

        <div v-if="erroLeitura" class="p-3.5 rounded-xl bg-expense/15 border border-expense/30 text-expense text-xs font-semibold max-w-md shadow-lg">
          ⚠️ {{ erroLeitura }}
        </div>

        <div class="flex items-center gap-6 text-xs text-gray-400 font-mono pt-2">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span>Fatura PDF</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-brand"></span>OFX Bancário</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-400"></span>CSV / Excel</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-400"></span>Texto / Markdown</span>
        </div>
      </div>

      <!-- Step 2: Preview & Auto-Categorization Table -->
      <div v-else class="flex-1 flex flex-col min-h-0">
        <!-- Banner de erro (se houver na etapa 2) -->
        <div v-if="erroLeitura" class="mx-4 mt-3 p-3.5 rounded-xl bg-expense/15 border border-expense/30 text-expense text-xs font-semibold flex items-center justify-between shadow-lg">
          <span>⚠️ {{ erroLeitura }}</span>
          <button @click="erroLeitura = ''" class="text-expense font-bold">✕</button>
        </div>

        <!-- Banner de Auto-Detecção de Instituição -->
        <div v-if="instituicaoDetectada" class="px-5 py-2.5 bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-dark-850 border-b border-purple-500/30 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full animate-pulse shadow-glow-emerald" :style="{ backgroundColor: instituicaoDetectada.cor }"></span>
            <span class="text-white font-bold">
              🪄 Instituição Identificada: <span class="text-purple-300 font-extrabold">{{ instituicaoDetectada.nome }}</span>
            </span>
            <span class="text-gray-400 hidden sm:inline">· Cartão/Conta vinculado e criado automaticamente se necessário</span>
          </div>
          <span class="text-[10px] bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
            Auto-Detectado
          </span>
        </div>

        <!-- Top Toolbar -->
        <div class="p-4 bg-dark-850 border-b border-dark-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <!-- Destino + Seleção -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Toggle Conta vs Cartão -->
            <div class="flex items-center gap-1 bg-dark-900 border border-dark-700 rounded-lg p-0.5">
              <button
                @click="modoDestino = 'conta'"
                class="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                :class="modoDestino === 'conta' ? 'bg-brand text-dark-950' : 'text-gray-400'"
              >Conta</button>
              <button
                @click="modoDestino = 'cartao'"
                class="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                :class="modoDestino === 'cartao' ? 'bg-purple-500 text-white' : 'text-gray-400'"
              >💳 Cartão</button>
            </div>

            <div v-if="modoDestino === 'conta'" class="flex items-center gap-2">
              <label class="text-gray-400 font-medium">Conta:</label>
              <select 
                v-model="contaAlvo" 
                class="bg-dark-900 border border-dark-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand font-semibold"
              >
                <option v-for="banco in bancos" :key="banco.id || banco.nome" :value="banco.nome">
                  {{ banco.nome }}
                </option>
              </select>
            </div>

            <div v-else class="flex items-center gap-2">
              <label class="text-purple-300 font-medium">Cartão:</label>
              <select 
                v-model="cartaoAlvoId" 
                class="bg-dark-900 border border-purple-500/40 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-400 font-semibold"
              >
                <option v-for="card in cartoes" :key="card.id || card.nome" :value="card.id || card.nome">
                  {{ card.nome }}
                </option>
              </select>
            </div>

            <button 
              @click="toggleTodos"
              class="text-gray-300 hover:text-white px-2.5 py-1.5 bg-dark-800 border border-dark-700 rounded-lg transition-colors font-medium"
            >
              {{ todosSelecionados ? 'Desmarcar Todos' : 'Selecionar Todos' }}
            </button>
          </div>

          <!-- Resumo de valores -->
          <div class="flex items-center gap-4 font-mono font-semibold">
            <span class="text-income flex items-center gap-1">
              + R$ {{ totalEntradas.toFixed(2) }}
            </span>
            <span class="text-expense flex items-center gap-1">
              - R$ {{ totalSaidas.toFixed(2) }}
            </span>
            <span class="text-gray-400 bg-dark-900 px-2.5 py-1 rounded border border-dark-700">
              {{ qtdSelecionados }} de {{ transacoes.length }} itens
            </span>
          </div>
        </div>

        <!-- Scrollable Table Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Mobile view: Cards -->
          <div class="sm:hidden space-y-2.5">
            <div 
              v-for="item in transacoes" 
              :key="item.id"
              class="p-3 rounded-xl border transition-all flex items-start gap-3"
              :class="item.selecionado ? 'bg-dark-800 border-dark-600' : 'bg-dark-900/50 border-dark-800 opacity-60'"
            >
              <input 
                type="checkbox" 
                v-model="item.selecionado"
                class="mt-1 rounded border-dark-600 text-brand focus:ring-0 bg-dark-900 w-4 h-4 cursor-pointer"
              />

              <div class="flex-1 min-w-0 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-xs font-bold text-white truncate">{{ item.cleanName || item.descricao }}</p>
                  <span 
                    class="text-xs font-bold font-mono shrink-0"
                    :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'"
                  >
                    {{ item.tipo === 'receita' ? '+' : '-' }} R$ {{ item.valor.toFixed(2) }}
                  </span>
                </div>
                <p v-if="item.cleanName && item.cleanName !== item.descricao" class="text-[10px] text-gray-500 font-mono truncate">
                  Original: {{ item.descricao }}
                </p>

                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span v-if="item.parcela" class="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                      Parc {{ item.parcela.atual }}/{{ item.parcela.total }}
                    </span>
                    <span class="text-[10px] text-gray-400 font-mono">{{ formatData(item.data) }}</span>
                  </div>

                  <label v-if="item.tipo === 'despesa'" class="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
                    <span class="text-[10px] text-purple-300 font-semibold">50/50</span>
                    <div class="relative inline-flex items-center">
                      <input type="checkbox" v-model="item.dividir5050" class="sr-only peer">
                      <div class="w-6 h-3.5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                    </div>
                  </label>
                </div>

                <select 
                  v-model="item.categoria"
                  class="w-full bg-dark-900 border border-dark-700 rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-brand"
                >
                  <option v-for="cat in categorias" :key="cat.id || cat.nome" :value="cat.nome">
                    {{ cat.nome }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Desktop view: Table -->
          <div class="hidden sm:block">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400 pb-2">
                  <th class="p-2 w-10 text-center">Sel.</th>
                  <th class="p-2">Data</th>
                  <th class="p-2">Descrição Limpa / Original</th>
                  <th class="p-2">Categoria Sugerida</th>
                  <th class="p-2 text-center">Dividir 50/50</th>
                  <th class="p-2 text-right">Valor (R$)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-700/60 text-xs">
                <tr 
                  v-for="item in transacoes" 
                  :key="item.id"
                  class="transition-colors hover:bg-dark-750/50"
                  :class="{ 'opacity-40 bg-dark-900/30': !item.selecionado }"
                >
                  <td class="p-2.5 text-center">
                    <input 
                      type="checkbox" 
                      v-model="item.selecionado"
                      class="rounded border-dark-600 text-brand focus:ring-0 bg-dark-900 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td class="p-2.5 font-mono text-gray-400 whitespace-nowrap">{{ formatData(item.data) }}</td>
                  <td class="p-2.5 font-medium text-white">
                    <div class="flex items-center gap-2">
                      <span class="truncate max-w-xs font-bold text-white">{{ item.cleanName || item.descricao }}</span>
                      <span v-if="item.parcela" class="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap">
                        {{ item.parcela.atual }}/{{ item.parcela.total }}
                      </span>
                    </div>
                    <span v-if="item.cleanName && item.cleanName !== item.descricao" class="text-[10px] text-gray-500 font-mono block truncate max-w-xs">
                      Original: {{ item.descricao }}
                    </span>
                  </td>
                  <td class="p-2.5">
                    <select 
                      v-model="item.categoria"
                      class="bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-brand"
                    >
                      <option v-for="cat in categorias" :key="cat.id || cat.nome" :value="cat.nome">
                        {{ cat.nome }}
                      </option>
                    </select>
                  </td>
                  <td class="p-2.5 text-center">
                    <label v-if="item.tipo === 'despesa'" class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="item.dividir5050" class="sr-only peer">
                      <div class="w-7 h-4 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                    <span v-else class="text-[10px] text-gray-600 font-mono">—</span>
                  </td>
                  <td 
                    class="p-2.5 text-right font-bold font-mono text-sm whitespace-nowrap"
                    :class="item.tipo === 'receita' ? 'text-income' : 'text-expense'"
                  >
                    {{ item.tipo === 'receita' ? '+' : '-' }} R$ {{ item.valor.toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-dark-700/80 bg-dark-850 flex items-center justify-between gap-3">
          <button 
            @click="resetar"
            class="text-xs text-gray-400 hover:text-white px-3 py-2 hover:bg-dark-700 rounded-lg transition-colors font-medium"
          >
            ← Escolher Outro Arquivo
          </button>

          <div class="flex items-center gap-3">
            <button 
              @click="fechar"
              class="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              @click="confirmarImportacao"
              :disabled="qtdSelecionados === 0 || salvando"
              class="bg-brand hover:bg-brand-400 disabled:opacity-40 text-dark-950 font-bold px-5 py-2 rounded-lg text-xs transition-all shadow-glow-emerald flex items-center gap-2 cursor-pointer"
            >
              <svg v-if="salvando" class="animate-spin h-4 w-4 text-dark-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ salvando ? 'Importando...' : `Importar ${qtdSelecionados} Lançamentos` }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { parseStatementFile, detectInstitution, extractTextFromPDF } from '~/utils/statementParser'
import { useFinancas } from '~/composables/useFinancas'

const props = defineProps({
  aberto: { type: Boolean, default: false },
  cartaoPreSelecionadoId: { type: String, default: '' }
})

const emit = defineEmits(['fechar', 'importar'])

const { bancos, cartoes, categorias, carregarTudo, obterOuCriarCartao, obterOuCriarConta, adicionarLancamentosEmLote } = useFinancas()

const fileInputRef = ref(null)
const dragOver = ref(false)
const salvando = ref(false)
const erroLeitura = ref('')
const transacoes = ref([])
const contaAlvo = ref('')
const modoDestino = ref('conta')
const cartaoAlvoId = ref('')
const instituicaoDetectada = ref(null)

onMounted(async () => {
  await carregarTudo()
  if (bancos.value.length > 0) {
    contaAlvo.value = bancos.value[0].nome
  }
  if (cartoes.value.length > 0) {
    cartaoAlvoId.value = cartoes.value[0].id || cartoes.value[0].nome || ''
  }
})

watch(() => props.aberto, async (novo) => {
  if (novo) {
    erroLeitura.value = ''
    salvando.value = false
    transacoes.value = []
    instituicaoDetectada.value = null
    modoDestino.value = props.cartaoPreSelecionadoId ? 'cartao' : 'conta'
    await carregarTudo()
    if (bancos.value.length > 0) contaAlvo.value = bancos.value[0].nome
    if (props.cartaoPreSelecionadoId) {
      cartaoAlvoId.value = props.cartaoPreSelecionadoId
    } else if (cartoes.value.length > 0) {
      cartaoAlvoId.value = cartoes.value[0].id || cartoes.value[0].nome || ''
    }
  }
})

const processContent = async (content, fileName) => {
  erroLeitura.value = ''
  try {
    const parsed = parseStatementFile(content, fileName)
    if (!parsed || parsed.length === 0) {
      return false
    }
    transacoes.value = parsed

    // Auto-detecção inteligente de banco / cartão
    const detected = detectInstitution(content, fileName)
    instituicaoDetectada.value = detected

    if (detected) {
      if (detected.tipo === 'cartao') {
        modoDestino.value = 'cartao'
        const cardObj = await obterOuCriarCartao({
          nome: detected.nome,
          bandeira: detected.bandeira,
          cor: detected.cor,
          dia_fechamento: detected.dia_fechamento,
          dia_vencimento: detected.dia_vencimento,
          limite: detected.limite
        })
        if (cardObj) {
          // Preferência ao UUID real do Supabase para garantir o vínculo no banco
          cartaoAlvoId.value = cardObj.id && !String(cardObj.id).startsWith('card-')
            ? String(cardObj.id)
            : (cardObj.nome || '')
        }
      } else {
        modoDestino.value = 'conta'
        const contaObj = await obterOuCriarConta({
          nome: detected.nome,
          cor: detected.cor
        })
        if (contaObj && contaObj.nome) {
          contaAlvo.value = contaObj.nome
        }
      }
    }
    return true
  } catch (err) {
    return false
  }
}

const readFile = (file) => {
  if (!file) return
  erroLeitura.value = ''

  if (file.name.toLowerCase().endsWith('.pdf')) {
    salvando.value = true
    const readerArray = new FileReader()
    readerArray.onload = async (evt) => {
      try {
        const buffer = evt.target?.result
        if (buffer) {
          const textPdf = await extractTextFromPDF(buffer)
          const ok = await processContent(textPdf, file.name)
          if (!ok) {
            erroLeitura.value = `Não conseguimos reconhecer lançamentos válidos na fatura PDF "${file.name}".`
          }
        }
      } catch (err) {
        console.error('Erro ao ler PDF:', err)
        erroLeitura.value = `Ocorreu um erro ao processar o arquivo PDF "${file.name}".`
      } finally {
        salvando.value = false
        if (fileInputRef.value) fileInputRef.value.value = ''
      }
    }
    readerArray.readAsArrayBuffer(file)
    return
  }

  const readerUtf8 = new FileReader()
  readerUtf8.onload = async (evt) => {
    const contentUtf8 = (evt.target?.result || '').toString()
    const ok = await processContent(contentUtf8, file.name)

    // Se UTF-8 não decodificou nenhuma transação válida, tenta ISO-8859-1 (comum em bancos BR)
    if (!ok) {
      const readerIso = new FileReader()
      readerIso.onload = async (evtIso) => {
        const contentIso = (evtIso.target?.result || '').toString()
        const okIso = await processContent(contentIso, file.name)

        if (!okIso) {
          erroLeitura.value = `Não conseguimos reconhecer lançamentos no arquivo "${file.name}". Certifique-se de que é um extrato OFX, CSV ou PDF de fatura válido.`
        }
      }
      readerIso.readAsText(file, 'ISO-8859-1')
    }

    if (fileInputRef.value) fileInputRef.value.value = ''
  }
  readerUtf8.readAsText(file, 'UTF-8')
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    readFile(file)
  }
}

const handleDrop = (e) => {
  dragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) {
    readFile(file)
  }
}

const qtdSelecionados = computed(() => {
  return transacoes.value.filter(t => t.selecionado).length
})

const todosSelecionados = computed(() => {
  return transacoes.value.length > 0 && transacoes.value.every(t => t.selecionado)
})

const toggleTodos = () => {
  const novoEstado = !todosSelecionados.value
  transacoes.value.forEach(t => t.selecionado = novoEstado)
}

const totalEntradas = computed(() => {
  return transacoes.value
    .filter(t => t.selecionado && t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0)
})

const totalSaidas = computed(() => {
  return transacoes.value
    .filter(t => t.selecionado && t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0)
})

const resetar = () => {
  transacoes.value = []
  erroLeitura.value = ''
  salvando.value = false
}

watch(modoDestino, (novo) => {
  if (novo === 'cartao' && (!cartaoAlvoId.value || cartaoAlvoId.value === '') && cartoes.value.length > 0) {
    cartaoAlvoId.value = cartoes.value[0].id || ''
  }
})

const fechar = () => {
  resetar()
  emit('fechar')
}

const confirmarImportacao = async () => {
  erroLeitura.value = ''

  // Fallback inteligente: se estiver em modo cartão e cartaoAlvoId estiver vazio mas houver cartões disponíveis
  let targetCartaoId = cartaoAlvoId.value
  if (modoDestino.value === 'cartao') {
    if (!targetCartaoId && cartoes.value.length > 0) {
      targetCartaoId = cartoes.value[0]?.id || cartoes.value[0]?.nome || ''
      cartaoAlvoId.value = targetCartaoId
    }
    const cardObj = cartoes.value.find(c => 
      (c.id && String(c.id) === String(targetCartaoId)) ||
      (c.nome && c.nome.toLowerCase() === String(targetCartaoId).toLowerCase()) ||
      (c.nome && c.nome.toLowerCase().includes(String(targetCartaoId).toLowerCase())) ||
      (String(targetCartaoId).toLowerCase().includes(c.nome.toLowerCase()))
    )
    if (cardObj?.id && !String(cardObj.id).startsWith('card-')) {
      targetCartaoId = String(cardObj.id)
    } else if (cardObj?.nome) {
      targetCartaoId = cardObj.nome
    }
  }

  if (modoDestino.value === 'cartao' && (!targetCartaoId || cartoes.value.length === 0)) {
    erroLeitura.value = 'Selecione um cartão de crédito válido para importar a fatura.'
    return
  }

  salvando.value = true
  try {
    const aprovados = transacoes.value
      .filter(t => t.selecionado)
      .map(t => ({
        id: Date.now() + Math.random(),
        tipo: t.tipo,
        descricao: t.cleanName || t.descricao,
        valor: t.valor,
        categoria: t.categoria,
        conta: modoDestino.value === 'conta' ? contaAlvo.value : '',
        cartao_id: modoDestino.value === 'cartao' ? targetCartaoId : null,
        parcela_atual: t.parcela ? t.parcela.atual : 1,
        total_parcelas: t.parcela ? t.parcela.total : 1,
        data: t.data,
        dividir5050: t.dividir5050 || false
      }))

    const res = await adicionarLancamentosEmLote(aprovados)
    if (res && res.sucesso === false) {
      erroLeitura.value = res.mensagem || 'Erro ao importar no banco de dados.'
      salvando.value = false
      return
    }

    emit('importar', aprovados)
    salvando.value = false
    fechar()
  } catch (err) {
    console.error('Erro na importação:', err)
    erroLeitura.value = err?.message || 'Erro inesperado ao importar lançamentos.'
    salvando.value = false
  }
}

const formatData = (str) => {
  if (!str) return ''
  const parts = str.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return str
}
</script>
