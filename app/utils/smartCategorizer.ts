export interface SmartCategorizationResult {
  suggestedCategory: string
  isShared: boolean
  cleanName: string
}

interface RuleDefinition {
  categoria: string
  isShared: boolean
  keywords: string[]
}

const CATEGORY_RULES: RuleDefinition[] = [
  // Alimentação / Mercado / Restaurantes (Compartilhado 50/50 por padrão)
  {
    categoria: 'Alimentação',
    isShared: true,
    keywords: [
      'IFOOD', 'RAPPI', 'RESTAURANTE', 'PADARIA', 'OUTBACK', 'MCDONALD',
      'BURGER KING', 'SUPERMERCADO', 'MERCADO', 'CARREFOUR', 'PAO DE ACUCAR',
      'ASSAI', 'ATACADAO', 'HORTIFRUTI', 'BAR ', 'LANCHES', 'PIZZARIA', 'SORVETE',
      'FEIRA', 'PADARIA'
    ]
  },
  // Moradia / Contas Fixas da Casa (Compartilhado 50/50 por padrão)
  {
    categoria: 'Moradia',
    isShared: true,
    keywords: [
      'ALUGUEL', 'CONDOMINIO', 'ENEL', 'LIGHT', 'SABESP', 'COPASA', 'CEMIG',
      'CLARO', 'VIVO', 'TIM', 'NET', 'ULTRAFEZ', 'INTERNET', 'LIXO'
    ]
  },
  // Pets / Animais de Estimação (Compartilhado 50/50 por padrão)
  {
    categoria: 'Outros', // Mapeado para categoria pets/outros
    isShared: true,
    keywords: [
      'PETZ', 'COBASI', 'PETSHOP', 'VETERINARIA', 'PET ', 'ANIMAL'
    ]
  },
  // Transporte / Combustível (Individual por padrão)
  {
    categoria: 'Transporte',
    isShared: false,
    keywords: [
      'UBER', '99APP', '99TAXI', 'CABIFY', 'SHELL', 'IPIRANGA', 'POSTO',
      'COMBUSTIVEL', 'ESTACIONAMENTO', 'PEDAGIO', 'AUTO POSTO', 'SEM PARAR', 'CONCESSIONARIA'
    ]
  },
  // Saúde / Fitness / Farmácia (Individual por padrão)
  {
    categoria: 'Saúde',
    isShared: false,
    keywords: [
      'DROGARIA', 'FARMACIA', 'DROGASIL', 'PAGLESS', 'PANVEL', 'HOSPITAL',
      'EXAME', 'LABORATORIO', 'DENTISTA', 'CONSULTORIO', 'MEDICO', 'SKYFIT',
      'SMARTFIT', 'ACADEMIA', 'GYMPASS'
    ]
  },
  // Lazer / Entretenimento (Individual por padrão)
  {
    categoria: 'Lazer',
    isShared: false,
    keywords: [
      'NETFLIX', 'SPOTIFY', 'PRIME VIDEO', 'STEAM', 'PLAYSTATION', 'NINTENDO',
      'CINEMA', 'INGRESSO', 'EXPOSICAO', 'SHOW ', 'TEATRO', 'SYMPLA'
    ]
  },
  // E-commerce / Compras (Individual por padrão)
  {
    categoria: 'Outros',
    isShared: false,
    keywords: [
      'MERCADO LIVRE', 'MERCADOLIVRE', 'ALIEXPRESS', 'SHOPEE', 'AMAZON',
      'MAGAZINE LUIZA', 'CASAS BAHIA', 'ZATTINI', 'SHEIN'
    ]
  },
  // Salário e Proventos (Receita)
  {
    categoria: 'Salário',
    isShared: false,
    keywords: [
      'SALARIO', 'PAYROLL', 'FOLHA', 'RENDIMENTO', 'PROVENTOS', 'PIX RECEBIDO',
      'TRANSFERENCIA RECEBIDA', 'DOC/TED RECEBIDO'
    ]
  }
]

/**
 * Limpa prefixos bancários ruidosos como "PGTO *", "UBER *TRIP", "EBN*", "PAG*", "PIX "
 */
export function sanitizeDescription(description: string): string {
  if (!description) return 'Lançamento Importado'

  let clean = description.trim()

  // Remover prefixos comuns de adquirentes e PIX
  clean = clean.replace(/^(PGTO\*|PAG\*|EBN\*|MP\*|PAYPAL\*|STRIPE\*|PIX\s+ENVIADO\s+|PIX\s+RECEBIDO\s+|COMPRA\s+COM\s+CARTAO\s+)/i, '')
  clean = clean.replace(/^(UBER\s*\*TRIP\s*|UBER\s*\*EATS\s*)/i, 'Uber ')

  // Remover códigos ruidosos de terminais e asteriscos no início/fim
  clean = clean.replace(/\*+/g, ' ').replace(/\s+/g, ' ').trim()

  // Capitalizar formato legível (Title Case)
  return clean
    .toLowerCase()
    .split(' ')
    .map(word => word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(' ')
}

/**
 * Analisa a descrição da transação, limpa a string, sugere a categoria e a regra de rateio (Individual ou 50/50)
 */
export function analyzeTransaction(description: string): SmartCategorizationResult {
  const cleanName = sanitizeDescription(description)
  const textUpper = description.toUpperCase()

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (textUpper.includes(kw)) {
        return {
          suggestedCategory: rule.categoria,
          isShared: rule.isShared,
          cleanName
        }
      }
    }
  }

  // Fallback padrão se nenhuma regra casar
  return {
    suggestedCategory: 'Outros',
    isShared: false,
    cleanName
  }
}
