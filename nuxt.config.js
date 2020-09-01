export default {
  server: {
    port: 80, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  publicRuntimeConfig: {
    // downloadServer: 'http://localhost:1080/files',
    // client: 'http://192.168.254.100',
    downloadServer: 'http://198.13.52.160:1080/files',
    client: 'http://198.13.52.160',
    socketServer: 'http://198.13.52.160:4000'
  },
  privateRuntimeConfig: {},
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.dev.js', async: true, defer: true },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io-stream/0.9.1/socket.io-stream.js', async: true, defer: true },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js', async: false, defer: false }
    ],
  },
  /*
  ** Global CSS
  */
  css: [
    'iview/dist/styles/iview.css',
    'assets/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/iview',
    '@/plugins/clipboard2'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth: {
    // Options
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          user: { url: '/me', method: 'get', propertyName: false},
          logout: false
        }
      },
      tokenRequired: true,
      tokenType: 'bearer',
      globalToken: true
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'http://198.13.52.160:4000/user'
    // baseURL: 'http://localhost:4000/user'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
