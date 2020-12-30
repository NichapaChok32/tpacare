<template>
  <div id="Setting">
    <Header :title="lang.title" :backPath="goBack()" />
    <div class="setting-list">
      <div class="setting-form" @click="goTo('/edit-profile')">
        <label class="lbSetting">{{ lang.editProfile }}</label>
        <b-link class="linkNext">
          <img src="../../assets/images/go.png" />
        </b-link>
      </div>
      <div class="setting-form" @click="goTo('/change-password')">
        <label class="lbSetting">{{ lang.changePass }}</label>
        <b-link class="linkNext">
          <img src="../../assets/images/go.png" />
        </b-link>
      </div>
      <div class="setting-form" @click="goTo('/condition-setting')">
        <label class="lbSetting">{{ lang.condition }}</label>
        <b-link class="linkNext">
          <img src="../../assets/images/go.png" />
        </b-link>
      </div>
      <div class="setting-form" @click="goTo('/privacy-setting')">
        <label class="lbSetting">{{ lang.policy }}</label>
        <b-link class="linkNext">
          <img src="../../assets/images/go.png" />
        </b-link>
      </div>
      <div class="setting-form">
        <label class="lbSetting">{{ lang.lang }}</label>
        <div class="setting-language">
          <nuxt-link :to="switchLocalePath('th')" class="linkNext">
            <span class="lbSetting" :class="{ linkActive: locale === 'th' }">{{
              lang.langTh
            }}</span>
          </nuxt-link>
          <div class="border-side"></div>
          <nuxt-link :to="switchLocalePath('en')" class="linkNext">
            <span class="lbSetting" :class="{ linkActive: locale === 'en' }">{{
              lang.langEng
            }}</span>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="setting-powered">
      <label class="lbVersion">TPA Care : {{ lang.version }} 1.1.9 (13)</label>
      <label class="lbPowered"
        >Powered by <img class="logo" src="../../assets/images/thaire-logo.png"
      /></label>
    </div>
    <div class="setting-logout">
      <b-btn class="btnLogOut" @click="checkPopUp()">{{
        lang.btnLogout
      }}</b-btn>
    </div>
    <ConditionPopUp
      :is_open="isOpen"
      :paragraph="content"
      :is_logout="isLogout"
      @checkCancel="checkLogout"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import vClickOutSide from 'v-click-outside'
import ConditionPopUp from '../../components/condition-pop'
import Header from '../../components/header'
export default {
  name: 'Setting',
  directives: {
    clickOutside: vClickOutSide.directive,
  },
  components: {
    ConditionPopUp,
    Header,
  },
  data() {
    return {
      backPath: '',
      isOpen: false,
      content: '',
      isLogout: false,
      isSuccess: false,
      lang: this.$t('setting'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('setting-page')
    vm.backPath = vm.getPath()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      resetProfile: 'resetProfile',
      setPath: 'setPath',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        return '/'
      } else if (vm.locale === 'en') {
        return '/en'
      }
    },
    async logout() {
      const vm = this
      firebase.analytics().logEvent('logout-button')
      vm.$auth.$storage.removeLocalStorage('isActivate')
      vm.$auth.$storage.removeLocalStorage('idcard')
      vm.$auth.$storage.removeLocalStorage('profile')
      vm.$auth.$storage.removeLocalStorage('token')
      vm.$auth.$storage.removeLocalStorage('position')
      vm.$auth.$storage.removeLocalStorage('insurance')
      vm.$auth.$storage.removeLocalStorage('e-claim')
      vm.$auth.$storage.removeLocalStorage('claim-status')
      vm.$auth.$storage.removeLocalStorage('currentType')
      vm.$auth.$storage.removeLocalStorage('ViewCardAuthenication')
      let redirect = this.$auth.$storage.options.redirect
      if (vm.locale === 'th') {
        redirect = {
          login: '/login',
          logout: '/',
          callback: '/login',
          home: '/',
        }
      }
      this.$auth.$storage.options.redirect = redirect
      await this.$auth.logout()
    },
    goTo(path) {
      const vm = this
      firebase.analytics().logEvent(path)
      if (vm.locale === 'th') {
        vm.setPath('/setting')
        vm.$router.push(path)
      } else if (vm.locale === 'en') {
        vm.setPath('/en/setting')
        vm.$router.push('/en' + path)
      }
    },
    checkPopUp() {
      const vm = this
      vm.isLogout = true
      vm.content = vm.lang.question
      vm.isOpen = true
    },
    checkLogout(value) {
      const vm = this
      vm.isOpen = false
      vm.isSuccess = value
      if (vm.isSuccess) {
        vm.logout()
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
#Setting {
  .setting-list {
    width: 100%;
    height: 100%;
    padding-top: 51px;
    .setting-form {
      width: 100%;
      height: 65px;
      padding: 22px 28px;
      border-bottom: 0.5px solid #e7ecee;
      .lbSetting {
        float: left;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #2f2e41;
        line-height: 20px;
      }
      .linkNext {
        float: right;
        margin-left: auto;
      }
      .linkActive {
        color: #3ba9fe;
      }
      .setting-language {
        width: auto;
        float: right;
        display: inline-flex;
        .border-side {
          width: 0;
          height: 20px;
          border: 0.5px solid #2f2e41;
          background-color: #2f2e41;
          margin: 0 5px;
        }
      }
    }
  }
  .setting-powered {
    width: 100%;
    height: 100%;
    margin: 50% auto 0;
    text-align: center;
    .lbVersion {
      font-family: 'Anuphan-Regular';
      font-size: 14px;
      color: #004899;
      line-height: 20px;
      display: block;
    }
    .lbPowered {
      font-family: 'Anuphan-Regular';
      font-size: 14px;
      color: #004899;
      line-height: 20px;
      .logo {
        max-width: 49px;
        max-height: 28px;
        margin-left: 7px;
      }
    }
  }
  .setting-logout {
    width: 100%;
    height: 100%;
    margin: 5% auto 33px;
    text-align: center;
    .btnLogOut {
      width: 319px;
      height: 45px;
      padding: 11px 10px;
      margin: 0 auto;
      border: none;
      border-radius: 6px;
      background-color: #f44336;
      font-family: 'Anuphan-Regular';
      font-size: 14px;
      color: #fffbfb;
      line-height: 20px;
    }
  }
}
</style>
