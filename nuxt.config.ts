export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ["@/assets/css/global.scss"],
  runtimeConfig: {
    public: {
      wsEndpoint: process.env.WS_ENDPOINT || "ws://localhost:8081",
    },
  },
});
