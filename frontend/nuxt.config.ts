export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/ui', '@pinia/nuxt'],
  css: ['@/assets/global.css'],

  devServer: {
    port: 3000,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.API_BASE_URL || 'http://localhost:3001',
        changeOrigin: true,
        cookieDomainRewrite: {
          '*': '',
        },
        secure: false,
      },
    },
  },

  tailwindcss: {
    exposeConfig: true,
    config: './tailwind.config.ts',
  },

  app: {
    head: {
      title: 'Кадастровые услуги',
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  imports: {
    dirs: ['./composables', './types', './stores'],
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          '~/*': ['./*'],
          '@/*': ['./*'],
        },
      },
    },
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },

  ui: {
    global: true,
  },

  build: {
    transpile: ['gsap'],
  },

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2025-02-12',
});