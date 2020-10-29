import path from 'path'
import fs from 'fs'

export default {
  loading: {
    color: 'white',
    height: '5px'
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  publicRuntimeConfig: {
    // client: 'http://192.168.254.116',
    client: 'https://www.appdistribute.cc',
    // downloadServer: 'http://localhost:4000/files',
    downloadServer: 'https://appdistribute.cc:4000',
    uploaderServer: 'https://appdistribute.cc:4000/uploads',
    socketServer: 'https://appdistribute.info:4000'
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
      { name: 'google-site-verification', content: 'of3FqiRqKiDjs33Ip2sRvaUUpsZztiKU72RHW7B7Aag' },
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
    'nuxt-i18n',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  // Or with global options
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true
      // onlyOnRoot: true,
    },
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en-US.js'
      },
      {
        code: 'zh-CN',
        name: '中文',
        file: 'zh-CN.js'
      },
      {
        code: 'TH',
        name: 'อักษรไทย',
        file: 'TH.js'
      },
      {
        code: 'VI',
        name: 'Chữ Quốc Ngữ',
        file: 'VI.js'
      },
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
    }
  },
  auth: {
    // Options
    redirect: {
      home: false
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          user: { url: '/me', method: 'get', propertyName: false },
          logout: false
        }
      },
      autoFetchUser: true,
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
    baseURL: 'https://appdistribute.info:4000/user'
    // baseURL: 'http://localhost:4000/user'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
