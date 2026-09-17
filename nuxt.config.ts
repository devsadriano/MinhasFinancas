// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  ssr: true,
  experimental: {
    payloadExtraction: false
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Minhas Finanças',
      short_name: 'Finanças',
      description: 'Gestão e Inteligência Financeira Pessoal & Casal',
      theme_color: '#18181b',
      background_color: '#18181b',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  nitro: {
    preset: 'vercel'
  },
  supabase: {
    url: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/confirm'],
      saveRedirectToCookie: true
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: 'lax',
      secure: false
    }
  },
  css: [
    '~/assets/css/main.css',
    'vue-toastification/dist/index.css'
  ],
  build: {
    transpile: ['vue-toastification']
  }
})
