import type { Config } from 'tailwindcss'

export default <Config>{
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,vue}',
    './components/**/*.{js,ts,vue}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Verde Esmeralda Marca Supabase
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          DEFAULT: '#3ecf8e', // Cor Oficial Supabase
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        
        // Superfícies Escuras Estilo Supabase
        dark: {
          950: '#0a0a0a', // Fundo extremo
          900: '#121212', // Canvas principal
          850: '#171717', // Sidebar / Header
          800: '#1c1c1c', // Card Surface
          750: '#232323', // Elevado / Hover Card
          700: '#2e2e2e', // Bordas
          600: '#3e3e3e',
          500: '#525252',
          400: '#737373',
          300: '#a3a3a3',
          200: '#e5e5e5',
          100: '#f5f5f5',
        },

        // Receita (Entradas)
        income: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
          surface: 'rgba(16, 185, 129, 0.1)',
        },

        // Despesa (Saídas)
        expense: {
          DEFAULT: '#f43f5e',
          light: '#fb7185',
          dark: '#e11d48',
          surface: 'rgba(244, 63, 94, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'supabase': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-emerald': '0 0 25px -5px rgba(62, 207, 142, 0.3)',
        'glow-expense': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
      },
      borderColor: {
        'supabase': 'rgba(255, 255, 255, 0.08)',
        'supabase-hover': 'rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
