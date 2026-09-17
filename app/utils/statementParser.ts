import { analyzeTransaction } from './smartCategorizer'

export interface ParcelaInfo {
  atual: number
  total: number
}

export interface ParsedTransaction {
  id: string
  data: string // YYYY-MM-DD
  descricao: string
  cleanName?: string
  valor: number // Valor absoluto sempre positivo
  tipo: 'receita' | 'despesa'
  categoria: string
  dividir5050?: boolean
  parcela?: ParcelaInfo | null
  selecionado: boolean
}

/**
 * Sanitiza strings removendo null bytes (\u0000) e caracteres de controle que causam erro no PostgreSQL
 */
export function sanitizeText(str: string): string {
  if (!str) return ''
  return String(str)
    .replace(/\u0000/g, '')
    .replace(/[\u0001-\u0008\u000B-\u001F\u007F-\u009F]/g, '')
    .replace(/[\uD800-\uDFFF]/g, '')
    .trim()
}

// Dicionário de auto-categorização inteligente
const KEYWORD_MAP: Record<string, string[]> = {
  Alimentação: [
    'IFOOD', 'RAPPI', 'RESTAURANTE', 'PADARIA', 'OUTBACK', 'MCDONALD',
    'BURGER KING', 'SUPERMERCADO', 'MERCADO', 'CARREFOUR', 'PAO DE ACUCAR',
    'ASSAI', 'ATACADAO', 'HORTIFRUTI', 'BAR ', 'LANCHES', 'PIZZARIA', 'SORVETE'
  ],
  Transporte: [
    'UBER', '99APP', '99TAXI', 'CABIFY', 'SHELL', 'IPIRANGA', 'POSTO',
    'COMBUSTIVEL', 'ESTACIONAMENTO', 'PEDAGIO', 'AUTO POSTO', 'CONCESSIONARIA'
  ],
  Moradia: [
    'ALUGUEL', 'CONDOMINIO', 'ENEL', 'LIGHT', 'SABESP', 'COPASA', 'CEMIG',
    'CLARO', 'VIVO', 'TIM', 'NET', 'ULTRAFEZ', 'INTERNET'
  ],
  Saúde: [
    'DROGARIA', 'FARMACIA', 'DROGASIL', 'PAGLESS', 'PANVEL', 'HOSPITAL',
    'EXAME', 'LABORATORIO', 'DENTISTA', 'CONSULTORIO', 'MEDICO'
  ],
  Lazer: [
    'NETFLIX', 'SPOTIFY', 'PRIME VIDEO', 'STEAM', 'PLAYSTATION', 'NINTENDO',
    'CINEMA', 'INGRESSO', 'EXPOSICAO', 'SHOW ', 'TEATRO', 'SYMPLA'
  ],
  Salário: [
    'SALARIO', 'PAYROLL', 'FOLHA', 'RENDIMENTO', 'PROVENTOS', 'PIX RECEBIDO',
    'TRANSFERENCIA RECEBIDA', 'DOC/TED RECEBIDO'
  ],
  Investimentos: [
    'XP INVEST', 'NUINVEST', 'BTG', 'INTER INVEST', 'TESOURO', 'CRIPTO',
    'BINANCE', 'B3', 'RDB', 'CDB', 'POUPANCA'
  ]
}

const MESES_MAP: Record<string, string> = {
  jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
  jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
}

/**
 * Leitor universal de qualquer formato de data (YYYY-MM-DD, DD/MM/YYYY, DD-AGO-2026, YYYYMMDD etc.)
 */
export function parseAnyDate(dateStr: string): string {
  const fallback = new Date().toISOString().split('T')[0] || ''
  if (!dateStr) return fallback
  const raw = dateStr.trim()
  const clean = raw.replace(/[.:]/g, '/')

  // Formato YYYY-MM-DD ou YYYY/MM/DD
  if (/^\d{4}[\\/\-]\d{1,2}[\\/\-]\d{1,2}/.test(clean)) {
    const parts = clean.split(/[\\/\-]/)
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
    }
  }

  // Formato DD/MM/YYYY ou DD-MM-YYYY
  if (/^\d{1,2}[\\/\-]\d{1,2}[\\/\-]\d{2,4}/.test(clean)) {
    const parts = clean.split(/[\\/\-]/)
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      const d = parts[0].padStart(2, '0')
      const m = parts[1].padStart(2, '0')
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2]
      return `${y}-${m}-${d}`
    }
  }

  // Formato compacto OFX: YYYYMMDD ou YYYYMMDDHHMMSS[tz]
  if (/^\d{8}/.test(raw)) {
    const y = raw.slice(0, 4)
    const m = raw.slice(4, 6)
    const d = raw.slice(6, 8)
    if (y && m && d) return `${y}-${m}-${d}`
  }

  // Formato com mês por extensão ex: 15/AGO/2026 ou apenas "16 AGO" (sem ano — padrão Nubank CSV)
  for (const [sigla, num] of Object.entries(MESES_MAP)) {
    if (clean.toLowerCase().includes(sigla)) {
      const nums = clean.match(/\d+/g)
      if (nums && nums.length >= 2 && nums[0] && nums[1]) {
        // Tem dia e ano explícito
        const d = nums[0].padStart(2, '0')
        const y = nums[1].length === 2 ? `20${nums[1]}` : nums[1]
        return `${y}-${num}-${d}`
      }
      if (nums && nums.length === 1 && nums[0]) {
        // Apenas dia, sem ano (ex: "16 AGO") — infere o ano atual
        const d = nums[0].padStart(2, '0')
        const y = new Date().getFullYear().toString()
        return `${y}-${num}-${d}`
      }
    }
  }

  // Fallback: loga no console para ajudar no diagnóstico
  if (typeof window !== 'undefined') {
    console.warn('[parseAnyDate] Formato não reconhecido, usando hoje:', JSON.stringify(raw))
  }
  return fallback
}

/**
 * Converte qualquer string de moeda (-45,90 | -45.90 | 45,90 D | (45.90)) para number com sinal
 */
export function parseCurrencyNumber(str: string): number {
  if (!str) return 0
  let clean = str.replace('R$', '').replace(/\s/g, '').trim()

  const isDebit = /D$/i.test(clean) || /^\(.*\)$/.test(clean) || clean.includes('-')
  clean = clean.replace(/[DC\-\(\)]/gi, '').trim()

  if (clean.includes(',')) {
    clean = clean.replace(/\./g, '').replace(',', '.')
  }

  const num = parseFloat(clean)
  if (isNaN(num)) return 0

  return isDebit ? -Math.abs(num) : Math.abs(num)
}

/**
 * Inferência de categoria por palavra-chave
 */
export function autoCategorizar(descricao: string): string {
  const descUpper = descricao.toUpperCase()
  for (const [categoria, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (descUpper.includes(kw)) {
        return categoria
      }
    }
  }
  return 'Outros'
}

/**
 * Detecta padrão de parcelas na descrição ex: "LOJA XYZ 03/10" ou "PARC 2 DE 5"
 */
export function detectParcela(descricao: string): ParcelaInfo | null {
  const regex1 = /(?:parc|parcela)?\s*(\d{1,2})\s*[\/\-]\s*(\d{1,2})/i
  const regex2 = /(?:parc|parcela)?\s*(\d{1,2})\s+de\s+(\d{1,2})/i

  const match = descricao.match(regex1) || descricao.match(regex2)
  if (match && match[1] && match[2]) {
    const atual = parseInt(match[1], 10)
    const total = parseInt(match[2], 10)
    if (atual > 0 && total > 0 && atual <= total && total <= 99) {
      return { atual, total }
    }
  }
  return null
}

/**
 * Detecta linhas que representam pagamentos de fatura, estornos ou saldos residuais
 * que NÃO devem ser importados como lançamentos (Nubank e outros bancos BR)
 */
export function isPagamentoFatura(descricao: string): boolean {
  if (!descricao) return false
  const d = descricao.toUpperCase().trim()
  return (
    /^PAGAMENTO\s+(DE|DA|EM|RECEBIDO|FATURA|EFETUADO)/.test(d) ||
    /PAGAMENTO DA FATURA/.test(d) ||
    /PAGAMENTO DE FATURA/.test(d) ||
    /^SALDO RESTANTE/.test(d) ||
    /FATURA ANTERIOR/.test(d) ||
    /CREDITO DE FATURA/.test(d) ||
    /ESTORNO DE FATURA/.test(d) ||
    /SUBTOTAL DOS/.test(d) ||
    /TOTAL GERAL DOS/.test(d)
  )
}

/**
 * Parser resiliente para arquivos OFX (SGML/XML) de qualquer banco
 */
export function parseOFX(content: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = []
  
  // Divide por tag de abertura <STMTTRN> de forma case-insensitive
  const blocks = content.split(/<STMTTRN>/i)
  if (blocks.length <= 1) return transactions

  let idCounter = 1
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i] || ''

    const trnAmtMatch = block.match(/<TRNAMT>\s*([^<\r\n]+)/i)
    const dtPostedMatch = block.match(/<DTPOSTED>\s*([^<\r\n]+)/i)
    const memoMatch = block.match(/<(?:MEMO|NAME|PAYEE)>\s*([^<\r\n]+)/i)

    const rawAmt = (trnAmtMatch && trnAmtMatch[1]) ? parseCurrencyNumber(trnAmtMatch[1]) : 0
    if (isNaN(rawAmt) || rawAmt === 0) continue

    const tipo: 'receita' | 'despesa' = rawAmt > 0 ? 'receita' : 'despesa'
    const valor = Math.abs(rawAmt)
    const data = (dtPostedMatch && dtPostedMatch[1]) ? parseAnyDate(dtPostedMatch[1]) : (new Date().toISOString().split('T')[0] || '')
    const descricaoClean = sanitizeText((memoMatch && memoMatch[1]) ? memoMatch[1] : 'Lançamento Importado')

    // Ignora linhas de pagamento de fatura / saldo restante
    if (isPagamentoFatura(descricaoClean)) continue

    const parcela = detectParcela(descricaoClean)
    const smart = analyzeTransaction(descricaoClean)

    transactions.push({
      id: `ofx-${Date.now()}-${idCounter++}`,
      data,
      descricao: descricaoClean,
      cleanName: sanitizeText(smart.cleanName || descricaoClean),
      valor,
      tipo,
      categoria: smart.suggestedCategory || autoCategorizar(descricaoClean),
      dividir5050: tipo === 'despesa' ? smart.isShared : false,
      parcela,
      selecionado: true
    })
  }

  return transactions
}

/**
 * Parser resiliente para arquivos CSV / TXT com suporte a delimitadores e cabeçalhos variados
 */
export function parseCSV(content: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = []
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0)
  if (lines.length === 0 || !lines[0]) return transactions

  // Detectar delimitador (vírgula, ponto-e-vírgula ou tabulação ou pipe)
  const firstLine = lines[0]
  let separator = ','
  if (firstLine.includes(';')) separator = ';'
  else if (firstLine.includes('\t')) separator = '\t'
  else if (firstLine.includes('|')) separator = '|'

  let dateIdx = -1
  let descIdx = -1
  let amtIdx = -1
  let catIdx = -1

  // Analisar cabeçalho da primeira linha
  const headerCols = firstLine.split(separator).map(c => c.trim().replace(/^["']|["']$/g, '').toLowerCase())
  const hasHeader = headerCols.some(h => /data|date|valor|amount|title|descri|categoria|category|estabelecimento|historico|memo/i.test(h))

  if (hasHeader) {
    headerCols.forEach((col, idx) => {
      if (/data|date/i.test(col)) dateIdx = idx
      else if (/valor|amount|quantia/i.test(col)) amtIdx = idx
      else if (/title|descri|estabelecimento|memo|hist|pagador|recebedor/i.test(col)) descIdx = idx
      else if (/categoria|category/i.test(col)) catIdx = idx
    })
  }

  const startLine = hasHeader ? 1 : 0
  let idCounter = 1

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const cols = line.split(separator).map(c => c.trim().replace(/^["']|["']$/g, ''))
    if (cols.length < 2) continue

    let data = ''
    let descricao = ''
    let rawAmt = 0
    let categoriaSugerida = ''

    if (dateIdx !== -1 && cols[dateIdx]) data = parseAnyDate(cols[dateIdx]!)
    if (descIdx !== -1 && cols[descIdx]) descricao = cols[descIdx]!
    if (amtIdx !== -1 && cols[amtIdx]) rawAmt = parseCurrencyNumber(cols[amtIdx]!)
    if (catIdx !== -1 && cols[catIdx]) categoriaSugerida = cols[catIdx]!

    // Fallbacks para arquivos sem correspondência de cabeçalho
    if (!data || !descricao || isNaN(rawAmt) || rawAmt === 0) {
      if (cols.length >= 4) {
        data = parseAnyDate(cols[0]!)
        if (!descricao) descricao = cols[2]! || cols[1]!
        if (isNaN(rawAmt) || rawAmt === 0) rawAmt = parseCurrencyNumber(cols[3]!)
      } else if (cols.length === 3) {
        data = parseAnyDate(cols[0]!)
        if (!descricao) descricao = cols[1]!
        if (isNaN(rawAmt) || rawAmt === 0) rawAmt = parseCurrencyNumber(cols[2]!)
      } else if (cols.length === 2) {
        if (!descricao) descricao = cols[0]!
        if (isNaN(rawAmt) || rawAmt === 0) rawAmt = parseCurrencyNumber(cols[1]!)
        data = new Date().toISOString().split('T')[0] || ''
      }
    }

    if (isNaN(rawAmt) || rawAmt === 0 || !descricao) continue

    const descricaoClean = sanitizeText(descricao)
    if (!descricaoClean) continue

    // Ignora linhas de pagamento de fatura / saldo restante (padrão Nubank e outros BR)
    if (isPagamentoFatura(descricaoClean)) continue

    const tipo: 'receita' | 'despesa' = rawAmt > 0 ? 'receita' : 'despesa'
    const valor = Math.abs(rawAmt)
    const parcela = detectParcela(descricaoClean)
    const smart = analyzeTransaction(descricaoClean)
    const categoria = (categoriaSugerida && categoriaSugerida.length > 2) ? categoriaSugerida : smart.suggestedCategory

    transactions.push({
      id: `csv-${Date.now()}-${idCounter++}`,
      data,
      descricao: descricaoClean,
      cleanName: sanitizeText(smart.cleanName || descricaoClean),
      valor,
      tipo,
      categoria: sanitizeText(categoria),
      dividir5050: tipo === 'despesa' ? smart.isShared : false,
      parcela,
      selecionado: true
    })
  }

  return transactions
}

export interface BankProfile {
  nome: string
  bandeira: string
  cor: string
  tipo: 'cartao' | 'conta'
  dia_fechamento?: number
  dia_vencimento?: number
  limite?: number
}

const BANK_KNOWLEDGE: Record<string, { nome: string; bandeira: string; cor: string; keywords: string[]; dia_fechamento: number; dia_vencimento: number; limite: number }> = {
  nubank: {
    nome: 'Nubank',
    bandeira: 'Mastercard Black',
    cor: '#820ad1',
    keywords: ['NUBANK', 'NU PAGAMENTOS', 'NU FINANCEIRA', 'NU_'],
    dia_fechamento: 16,
    dia_vencimento: 23,
    limite: 9650.00
  },
  picpay: {
    nome: 'PicPay',
    bandeira: 'Mastercard Platinum',
    cor: '#11c76f',
    keywords: ['PICPAY', 'PIC PAY', 'PICPAY CARD'],
    dia_fechamento: 9,
    dia_vencimento: 15,
    limite: 5690.00
  },
  mercadopago: {
    nome: 'Mercado Pago',
    bandeira: 'Visa',
    cor: '#009ee3',
    keywords: ['MERCADO PAGO', 'MERCADOPAGO', 'MP_'],
    dia_fechamento: 15,
    dia_vencimento: 21,
    limite: 10600.00
  },
  itau: {
    nome: 'Itaú Unibanco',
    bandeira: 'Visa Infinite',
    cor: '#ec7000',
    keywords: ['ITAU', 'ITAÚ', 'PERSONNALITE', 'UNIBANCO'],
    dia_fechamento: 15,
    dia_vencimento: 25,
    limite: 15000.00
  },
  inter: {
    nome: 'Banco Inter',
    bandeira: 'Mastercard',
    cor: '#ff7a00',
    keywords: ['INTER', 'BANCO INTER', 'INTERMEDIUM'],
    dia_fechamento: 10,
    dia_vencimento: 17,
    limite: 8000.00
  },
  c6: {
    nome: 'C6 Bank',
    bandeira: 'Mastercard Black',
    cor: '#242424',
    keywords: ['C6', 'C6BANK', 'C6 BANK'],
    dia_fechamento: 12,
    dia_vencimento: 20,
    limite: 10000.00
  },
  bradesco: {
    nome: 'Bradesco',
    bandeira: 'Visa',
    cor: '#cc092f',
    keywords: ['BRADESCO', 'BRADESCO CARTÕES', 'BRADESCO CARTOES'],
    dia_fechamento: 15,
    dia_vencimento: 22,
    limite: 7000.00
  },
  santander: {
    nome: 'Santander',
    bandeira: 'Mastercard',
    cor: '#ec0000',
    keywords: ['SANTANDER', 'BANCO SANTANDER'],
    dia_fechamento: 14,
    dia_vencimento: 21,
    limite: 6000.00
  },
  caixa: {
    nome: 'Caixa Econômica',
    bandeira: 'Visa',
    cor: '#0066b3',
    keywords: ['CAIXA', 'CEF', 'CAIXA ECONOMICA'],
    dia_fechamento: 17,
    dia_vencimento: 25,
    limite: 5000.00
  },
  bb: {
    nome: 'Banco do Brasil',
    bandeira: 'Visa Infinite',
    cor: '#fcf000',
    keywords: ['BANCO DO BRASIL', 'BB_', 'BB CART'],
    dia_fechamento: 15,
    dia_vencimento: 23,
    limite: 8000.00
  }
}

/**
 * Detecta a instituição financeira a partir do conteúdo do extrato ou nome do arquivo
 */
export function detectInstitution(content: string, fileName: string): BankProfile | null {
  const textUpper = (content + ' ' + fileName).toUpperCase()
  
  const orgMatch = content.match(/<ORG>\s*([^<\r\n]+)/i)
  const orgText = orgMatch && orgMatch[1] ? orgMatch[1].toUpperCase() : ''

  for (const key of Object.keys(BANK_KNOWLEDGE)) {
    const bank = BANK_KNOWLEDGE[key]!
    for (const kw of bank.keywords) {
      if (orgText.includes(kw) || textUpper.includes(kw)) {
        return {
          nome: bank.nome,
          bandeira: bank.bandeira,
          cor: bank.cor,
          tipo: 'cartao',
          dia_fechamento: bank.dia_fechamento,
          dia_vencimento: bank.dia_vencimento,
          limite: bank.limite
        }
      }
    }
  }

  return null
}

/**
 * Extrai texto de um arquivo PDF no navegador utilizando a biblioteca pdfjs-dist
 */
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
      const version = pdfjsLib.version || '6.3.289'
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.mjs`
    }

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
    const pdf = await loadingTask.promise
    let fullText = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const tokenProps = await page.getTextContent()

      // Agrupar por coordenada Y com tolerância de 4px para juntar elementos da mesma linha visual
      const TOLERANCE = 4.0
      const lineRows: { y: number; items: { x: number; str: string }[] }[] = []

      for (const item of tokenProps.items as any[]) {
        if (!item || !item.str) continue
        const x = item.transform ? Number(item.transform[4]) : 0
        const y = item.transform ? Number(item.transform[5]) : 0

        let row = lineRows.find(r => Math.abs(r.y - y) <= TOLERANCE)
        if (!row) {
          row = { y, items: [] }
          lineRows.push(row)
        }
        row.items.push({ x, str: item.str })
      }

      // Ordena as linhas do topo para o rodapé da página (Y decrescente)
      lineRows.sort((a, b) => b.y - a.y)

      for (const row of lineRows) {
        // Ordena os itens da esquerda para a direita (X crescente)
        row.items.sort((a, b) => a.x - b.x)
        const lineText = row.items.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim()
        if (lineText) fullText += lineText + '\n'
      }
    }

    return fullText
  } catch (err) {
    console.error('Erro ao extrair texto do PDF:', err)
    return ''
  }
}

/**
 * Parser resiliente para textos extraídos de faturas PDF (Mercado Pago, PicPay, Itaú etc.)
 */
export function parsePDFText(text: string, fileName: string = ''): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = []
  if (!text) return transactions

  let defaultYear = new Date().getFullYear()
  let referenceMonth = new Date().getMonth() + 1

  const combinedHeader = (text.slice(0, 1500) + ' ' + fileName).toUpperCase()
  
  const dateMatchHeader = combinedHeader.match(/(?:VENCIMENTO|FECHAMENTO):\s*\d{1,2}\/(\d{1,2})\/(\d{4})/) ||
                          fileName.match(/(\d{2})(20\d{2})/) ||
                          combinedHeader.match(/\b(\d{1,2})\/(20\d{2})\b/)

  if (dateMatchHeader && dateMatchHeader[1] && dateMatchHeader[2]) {
    referenceMonth = parseInt(dateMatchHeader[1], 10)
    defaultYear = parseInt(dateMatchHeader[2], 10)
  } else {
    const yearOnlyMatch = combinedHeader.match(/\b(202\d)\b/)
    if (yearOnlyMatch && yearOnlyMatch[1]) {
      defaultYear = parseInt(yearOnlyMatch[1], 10)
    }
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  let idCounter = 1

  for (const line of lines) {
    const cleanLine = sanitizeText(line)
    if (!cleanLine) continue

    const uLine = cleanLine.toUpperCase()
    if (
      uLine.includes('VENCIMENTO:') ||
      uLine.includes('PÁGINA') ||
      uLine.includes('TOTAL A PAGAR') ||
      uLine.includes('RESUMO DA FATURA') ||
      uLine.includes('LIMITES DE CRÉDITO') ||
      uLine.includes('OPÇÕES DE PAGAMENTO') ||
      uLine.includes('SAIBA QUAIS SÃO') ||
      uLine.includes('JUROS DO ROTATIVO') ||
      uLine.includes('IMPOSTOS') ||
      uLine.includes('SUBTOTAL DOS') ||
      uLine.includes('TOTAL GERAL DOS') ||
      uLine.includes('FATURA ANTERIOR') ||
      uLine.includes('RESUMO - MÊS') ||
      uLine.includes('OPÇÕES DE') ||
      uLine.includes('TRANSAÇÕES NACIONAIS') ||
      uLine.includes('TRANSAÇÕES INTERNACIONAIS') ||
      uLine.includes('ESTABELECIMENTO')
    ) {
      continue
    }

    // Match de data no início da linha: DD/MM ou DD/MM/YYYY
    const dateMatch = cleanLine.match(/^(?:[•\-*\s]*)\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b\s+(.+)/)
    if (!dateMatch || !dateMatch[1] || !dateMatch[2]) continue

    const dateStr = dateMatch[1]
    const rest = dateMatch[2].trim()

    // Extrair o valor no final da string: ex "R$ 174,70" ou "12,66" ou "-30,19" ou "429,66"
    const amountMatch = rest.match(/((?:-\s*)?(?:R\$\s*)?\d+(?:\.\d{3})*(?:[,\.]\d{2}))\s*$/i)
    if (!amountMatch || !amountMatch[1]) continue

    const amountStr = amountMatch[1]
    const rawAmt = parseCurrencyNumber(amountStr)
    if (isNaN(rawAmt) || rawAmt === 0) continue

    const descRaw = rest.slice(0, rest.length - amountStr.length).trim()
    const descricaoClean = sanitizeText(descRaw)

    if (!descricaoClean || descricaoClean.length < 2) continue

    if (isPagamentoFatura(descricaoClean)) continue

    let data = ''
    const shortDateMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})$/)
    if (shortDateMatch && shortDateMatch[1] && shortDateMatch[2]) {
      const d = shortDateMatch[1].padStart(2, '0')
      const m = parseInt(shortDateMatch[2], 10)
      const mStr = String(m).padStart(2, '0')
      const y = m > referenceMonth ? defaultYear - 1 : defaultYear
      data = `${y}-${mStr}-${d}`
    } else {
      data = parseAnyDate(dateStr)
    }

    const tipo: 'receita' | 'despesa' = rawAmt > 0 ? 'receita' : 'despesa'
    const valor = Math.abs(rawAmt)
    const parcela = detectParcela(descricaoClean)
    const smart = analyzeTransaction(descricaoClean)

    transactions.push({
      id: `pdf-${Date.now()}-${idCounter++}`,
      data,
      descricao: descricaoClean,
      cleanName: sanitizeText(smart.cleanName || descricaoClean),
      valor,
      tipo,
      categoria: sanitizeText(smart.suggestedCategory || autoCategorizar(descricaoClean)),
      dividir5050: tipo === 'despesa' ? smart.isShared : false,
      parcela,
      selecionado: true
    })
  }

  return transactions
}

/**
 * Função principal resiliente para extratos OFX, CSV, TXT ou PDF
 */
export function parseStatementFile(content: string, fileName: string): ParsedTransaction[] {
  if (!content || content.trim().length === 0) return []

  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'ofx' || content.includes('<STMTTRN>') || content.includes('<stmttrn>')) {
    return parseOFX(content)
  }
  if (ext === 'pdf' || content.includes('%PDF')) {
    return parsePDFText(content, fileName)
  }
  return parseCSV(content)
}
