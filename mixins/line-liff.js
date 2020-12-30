export default {
  data() {
    return {
      liffEnabled: false,
    }
  },
  created() {
    const { $liff, $router, $store } = this
    if (!this.liffEnabled) {
      $store.commit('setLineIsClient', true)
      return
    }
    if ($liff) {
      // if (this.getCurrentRoute($router) === '/login') {
      //   $store.commit('setLineIsClient', true)
      //   return
      // }
      $liff.ready.then(() => {
        if (!$liff.isLoggedIn() && !$liff.isInClient()) {
          $router.push({
            path: '/not-found',
          })
          $store.commit('setLineIsClient', false)
        } else {
          $store.commit('setLineIdToken', $liff.getIDToken())
          $store.commit('setLineIsClient', true)
          this.setUserId($liff, $store)
        }
        $store.commit('setLineIsReady', true)
      })
    }
  },
  methods: {
    async getUserId(liff) {
      const profile = await liff.getProfile().userId
      return profile
    },
    setUserId(liff, store) {
      liff
        .getProfile()
        .then((profile) => {
          store.commit('setLineUserId', profile.userId)
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log('error', err)
        })
    },
    getCurrentRoute(router) {
      return router.history.current.path.replace('/en/', '/')
    },
  },
}
