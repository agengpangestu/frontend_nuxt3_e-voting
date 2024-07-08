// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  plugins: [],
  build: { transpile: ['@vuepic/vue-datepicker'] },
  axios: {
    baseURL: process.env.VITE_APP_ENV,
  },
  css: [
    '~/assets/css/main.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  router: {
    middleware: ['authentication', 'not-authentication', 'auth-vote', 'not-auth-vote']
  },
  routeRules: {
    '/app/**': { appMiddleware: "authentication", ssr: false },
    '/login': { appMiddleware: "not-authentication", ssr: false },
    '/form-page': { appMiddleware: 'not-auth-vote', ssr: false },
    '/vote-page': { appMiddleware: 'auth-vote', ssr: false },
  },
})
