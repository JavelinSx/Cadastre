// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/ui', '@pinia/nuxt'],
  css: ['@/assets/global.css'],
  devServer: {
    port: 3000
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3001',
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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  imports: {
    dirs: ['composables'],
  },
  ui: {
    global: true,
  },
  build: {
    transpile: ['gsap'],
  },
  compatibilityDate: '2025-01-16',
});
