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
 * Leitor universal de qualquer formato de data (YYYY-MM-DD, DD/MM/YYYY, DD-AGO-2026, etc.)
 */
export function parseAnyDate(dateStr: string): string {
  const fallback = new Date().toISOString().split('T')[0] || ''
  if (!dateStr) return fallback
  const clean = dateStr.trim().replace(/[.:]/g, '/')

  // Formato YYYY-MM-DD ou YYYY/MM/DD
  if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/.test(clean)) {
    const parts = clean.split(/[\/\-]/)
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
    }
  }

  // Formato DD/MM/YYYY ou DD-MM-YYYY
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(clean)) {
    const parts = clean.split(/[\/\-]/)
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      const d = parts[0].padStart(2, '0')
      const m = parts[1].padStart(2, '0')
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2]
      return `${y}-${m}-${d}`
    }
  }

  // Formato com mês por extensão ex: 15/AGO/2026
  for (const [sigla, num] of Object.entries(MESES_MAP)) {
    if (clean.toLowerCase().includes(sigla)) {
      const nums = clean.match(/\d+/g)
      if (nums && nums.length >= 2 && nums[0] && nums[1]) {
        const d = nums[0].padStart(2, '0')
        const y = nums[1].length === 2 ? `20${nums[1]}` : nums[1]
        return `${y}-${num}-${d}`
      }
    }
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
    const descricao = (memoMatch && memoMatch[1]) ? memoMatch[1].trim() : 'Lançamento Importado'
    const parcela = detectParcela(descricao)
    const smart = analyzeTransaction(descricao)

    transactions.push({
      id: `ofx-${Date.now()}-${idCounter++}`,
      data,
      descricao,
      cleanName: smart.cleanName,
      valor,
      tipo,
      categoria: smart.suggestedCategory || autoCategorizar(descricao),
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

    const tipo: 'receita' | 'despesa' = rawAmt > 0 ? 'receita' : 'despesa'
    const valor = Math.abs(rawAmt)
    const parcela = detectParcela(descricao)
    const smart = analyzeTransaction(descricao)
    const categoria = (categoriaSugerida && categoriaSugerida.length > 2) ? categoriaSugerida : smart.suggestedCategory

    transactions.push({
      id: `csv-${Date.now()}-${idCounter++}`,
      data,
      descricao,
      cleanName: smart.cleanName,
      valor,
      tipo,
      categoria,
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
}

const BANK_KNOWLEDGE: Record<string, { nome: string; bandeira: string; cor: string; keywords: string[] }> = {
  nubank: {
    nome: 'Nubank',
    bandeira: 'Mastercard Black',
    cor: '#820ad1',
    keywords: ['NUBANK', 'NU PAGAMENTOS', 'NU FINANCEIRA', 'NU_']
  },
  mercadopago: {
    nome: 'Mercado Pago',
    bandeira: 'Visa',
    cor: '#009ee3',
    keywords: ['MERCADO PAGO', 'MERCADOPAGO', 'MP_']
  },
  itau: {
    nome: 'Itaú Unibanco',
    bandeira: 'Visa Infinite',
    cor: '#ec7000',
    keywords: ['ITAU', 'ITAÚ', 'PERSONNALITE', 'UNIBANCO']
  },
  inter: {
    nome: 'Banco Inter',
    bandeira: 'Mastercard',
    cor: '#ff7a00',
    keywords: ['INTER', 'BANCO INTER', 'INTERMEDIUM']
  },
  c6: {
    nome: 'C6 Bank',
    bandeira: 'Mastercard Black',
    cor: '#242424',
    keywords: ['C6', 'C6BANK', 'C6 BANK']
  },
  bradesco: {
    nome: 'Bradesco',
    bandeira: 'Visa',
    cor: '#cc092f',
    keywords: ['BRADESCO', 'BRADESCO CARTÕES', 'BRADESCO CARTOES']
  },
  santander: {
    nome: 'Santander',
    bandeira: 'Mastercard',
    cor: '#ec0000',
    keywords: ['SANTANDER', 'BANCO SANTANDER']
  },
  caixa: {
    nome: 'Caixa Econômica',
    bandeira: 'Visa',
    cor: '#0066b3',
    keywords: ['CAIXA', 'CEF', 'CAIXA ECONOMICA']
  },
  bb: {
    nome: 'Banco do Brasil',
    bandeira: 'Visa Infinite',
    cor: '#fcf000',
    keywords: ['BANCO DO BRASIL', 'BB_', 'BB CART']
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
          tipo: 'cartao'
        }
      }
    }
  }

  return null
}

/**
 * Função principal resiliente para extratos OFX, CSV ou TXT
 */
export function parseStatementFile(content: string, fileName: string): ParsedTransaction[] {
  if (!content || content.trim().length === 0) return []

  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'ofx' || content.includes('<STMTTRN>') || content.includes('<stmttrn>')) {
    return parseOFX(content)
  }
  return parseCSV(content)
}
