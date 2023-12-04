// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devtools: { enabled: true },
  // routeRules:{
  // }
  css: ["@/assets/main.css"],

  modules: ["@nuxtjs/supabase",'@vueuse/nuxt',"@pinia/nuxt"],

  typescript: {
    tsConfig: {},
  },
  runtimeConfig:{
    public:{
      baseURL: process.env.BASE_URL || 'http://localhost:3000/',
    }
  },
  build: {
    transpile: ['trpc-nuxt']
  }
});
