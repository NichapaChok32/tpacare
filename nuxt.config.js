export default {
  mode: 'universal',
  target: 'server',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1 maximum-scale=1.0',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        charset: 'utf-8',
        src: 'https://static.line-scdn.net/liff/edge/2/sdk.js',
      },
      {
        src: 'https://unpkg.com/dexie@latest/dist/dexie.js',
      },
    ],
  },
  css: [
    '~/assets/scss/app.scss',
    '~/assets/scss/font-face.scss',
    '~/assets/css/dropzone.css',
    '~/assets/css/dropzone.min.css',
    '~/node_modules/font-awesome/css/font-awesome.css',
    '~/node_modules/font-awesome/css/font-awesome.min.css',
    '~/assets/scss/icon-font.scss',
  ],
  plugins: [
    { src: '~/plugins/vee-validate.js', ssr: false },
    { src: '~/plugins/vue-otp-input.js', ssr: false },
    { src: '~/plugins/axios.js', ssr: false },
    { src: '~/plugins/vue-browser-geolocation.js', ssr: false },
    { src: '~/plugins/firebase.js', ssr: false },
    { src: '~/plugins/nuxt-dropzone.js', ssr: false },
    { src: '~/plugins/vue2-google-maps.js', ssr: false },
    { src: '~/plugins/vue-image-zoom.js', ssr: false },
    { src: '~/plugins/line-liff.js', ssr: false },
  ],
  router: {
    middleware: ['auth', 'line-liff'],
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: false,
          user: false,
          logout: false,
        },
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
    },
    plugins: ['~/plugins/auth-lang-redirect.js'],
  },
  components: true,
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/router', '@nuxtjs/vuetify'],
  modules: [
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/axios',
      {
        baseURL: 'https://tpacare-v3-uat.azurewebsites.net/api/v1/',
        headers: {
          common: {
            'Content-Type': 'application/json',
            'x-api-key': 'ykRNP0wziQLCoC64NLpl',
          },
        },
      },
    ],
    '@nuxtjs/auth',
    '@nuxt/http',
    [
      'nuxt-i18n',
      {
        parsePages: false,
        pages: require('./assets/route/page.json'),
        encodePaths: false,
      },
    ],
  ],
  build: {
    vendor: ['vue-carousel', '@line/liff'],
  },
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
      },
      {
        code: 'th',
        iso: 'th-TH',
        name: 'ไทย',
      },
    ],
    defaultLocale: 'th',
    vueI18n: {
      messages: {
        // eslint-disable-next-line global-require
        th: require('./assets/lang/th.json'),
        // eslint-disable-next-line global-require
        en: require('./assets/lang/en.json'),
      },
    },
  },
}
