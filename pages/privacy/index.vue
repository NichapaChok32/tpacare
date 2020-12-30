<template>
  <div id="Privacy">
    <Header :title="lang.title" :backPath="backPath" />
    <v-container class="privacy-detail">
      <label class="lbDetailHD">{{ lang.header }}</label>
      <v-progress-circular
        v-if="isloading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div v-if="!isloading" class="pDetail" v-html="content"></div>
      <div v-if="!isloading && backPath !== '/setting'" class="privacy-footer">
        <div class="pDetail privacy-agree">
          <v-checkbox
            v-model="privacy.isAgree"
            class="chkAgree"
            :label="lang.agreement"
          ></v-checkbox>
        </div>
        <div class="privacy-summit">
          <v-btn
            :class="{ disabled: !privacy.isAgree, btnSummit: privacy.isAgree }"
            @click="pushAgree()"
          >
            {{ lang.btnAgree }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'Privacy',
  auth: 'guest',
  components: {
    Header,
  },
  data() {
    return {
      isAgree: false,
      content: '',
      backPath: '',
      token: '',
      privacy: {
        id: 0,
        isForce: false,
        isAgree: false,
      },
      condition: {
        id: 0,
        isForce: false,
        isAgree: false,
      },
      isloading: true,
      params: {},
      lang: this.$t('privacy-policy'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    vm.condition = vm.getCondition()
    vm.privacy = vm.getPrivacy()
    vm.backPath = vm.getPath()
    vm.checkBackPath()
    if (vm.$auth.$storage.getLocalStorage('token') !== '') {
      vm.token = vm.$auth.$storage.getLocalStorage('token')
    } else {
      vm.token = vm.getToken()
    }
    vm.getAgree()
  },
  methods: {
    ...mapGetters({
      getToken: 'getToken',
      getPath: 'getPath',
      getCondition: 'getCondition',
      getPrivacy: 'getPrivacy',
      getRegister: 'getRegister',
    }),
    ...mapMutations({
      setPath: 'setPath',
      setPrivacy: 'setPrivacy',
    }),
    checkBackPath() {
      const vm = this
      if (vm.locale === 'th') {
        switch (vm.backPath) {
          case '/condition':
            vm.setPath('/login')
            break
          case '/setting':
            vm.setPath('/')
            break
        }
      } else if (vm.locale === 'en') {
        switch (vm.backPath) {
          case '/en/condition':
            vm.setPath('/en/login')
            break
          case '/en/setting':
            vm.setPath('/en')
            break
        }
      }
    },
    async pushAgree() {
      const vm = this
      if (vm.locale === 'th') {
        vm.setPath('/privacy')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/privacy')
      }
      if (vm.privacy.isAgree) {
        if (vm.token !== null) {
          try {
            vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
            await vm.$axios
              .post(`/agreement/consent/${vm.privacy.id}`)
              .then((response) => {
                const res = response.data
                if (res.status === 'ok') {
                  vm.$router.push('/')
                }
              })
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
            vm.isloading = false
            vm.log = e.response.data.message
          }
        } else {
          vm.setRoutePath()
        }
      }
    },
    async getAgree() {
      const vm = this
      try {
        await vm.$axios
          .get(`/agreement/2?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            vm.content = res.data.content
            vm.privacy.id = res.data.id
            vm.isloading = false
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    checkAgree() {
      const vm = this
      vm.privacy.isAgree = true
    },
    setRoutePath() {
      const vm = this
      firebase.analytics().logEvent('Privacy Policy agree-buton')
      if (vm.locale === 'en') {
        vm.setPath('/en/privacy')
        vm.$router.push('/en/register')
      } else {
        vm.setPath('/privacy')
        vm.$router.push('/register')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) and (max-width: 359px) {
  #Privacy {
    .privacy-detail {
      .lbDetailHD {
        font-size: 16px !important;
      }
    }
  }
}
#Privacy {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .privacy-detail {
    position: relative;
    padding: 68px 16px 0;
    background-color: #f1f8ff;
    .lbDetailHD {
      font-family: 'Anuphan-Regular';
      font-size: 18px;
      color: #004899;
      line-height: 24px;
      margin-bottom: 21px !important;
    }
    .pDetail {
      font-family: 'Sarabun-Regular';
      font-size: 14px;
      color: #4f5358;
      line-height: 24px;
    }
    .privacy-footer {
      .privacy-summit {
        padding: 38px 0 28px;
        .btnSummit {
          width: 100%;
          height: 45px;
          background-color: #3ba9fe;
          border: none;
          border-radius: 6px;
          font-family: 'Anuphan-Medium';
          font-size: 18px;
          color: #fff;
          line-height: 31px;
          letter-spacing: 0px;
          :disabled {
            background-color: #d3d3d3;
          }
        }
        .disabled {
          width: 100%;
          height: 45px;
          background-color: #d3d3d3;
          border: none;
          border-radius: 6px;
          font-family: 'Anuphan-Medium';
          font-size: 18px;
          color: #fff;
          line-height: 31px;
          letter-spacing: 0px;
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/privacy.css');
</style>
