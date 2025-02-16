export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ["@/assets/css/global.scss"],
  
  vite: {
    server: {
      host: true, // Expose to external devices
      port: 8080, // Adjust if needed
      hmr: {
        clientPort: 8080, // Ensures the browser connects to the correct WebSocket port
        path: '/_nuxt/'   // Match Nuxt's WebSocket path
      }
    }
  }
});
