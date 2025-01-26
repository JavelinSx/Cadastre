// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/ui'],
  css: ['@/assets/global.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
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
  compatibilityDate: '2025-01-16',
});
