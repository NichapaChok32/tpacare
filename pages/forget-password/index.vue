<template v-click-outside="onClickOutside">
  <div id="ForgetUser">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isloading"
      method="post"
      class="ForgetUser-detail"
      @submit.prevent="validate"
    >
      <v-row class="form-group form-username">
        <label class="lbFrom">{{ lang.header }}</label>
        <v-text-field
          v-model="username"
          :rules="[rules.required]"
          single-line
          outlined
          class="txtForm"
        ></v-text-field>
        <label v-if="vUser" for="txtPhone" class="validate">
          {{ lang.validatePass }}
        </label>
      </v-row>
      <v-row class="form-group">
        <v-btn type="submit" depressed color="primary" class="btnSummit">
          {{ lang.btnAgree }}
        </v-btn>
      </v-row>
    </v-form>
    <v-row v-if="isShow && !isloading" justify="center">
      <v-dialog
        v-model="isShow"
        persistent
        max-width="319"
        class="popup-dialog"
      >
        <v-card id="PopUp">
          <v-card-title class="popup-header">
            <img
              v-if="isSuccess"
              class="icon-header"
              center
              src="../../assets/images/correct.svg"
              alt="Center image"
            />
            <img
              v-if="!isSuccess"
              class="icon-header"
              center
              src="../../assets/images/worst.svg"
              alt="Center image"
            />
          </v-card-title>
          <v-card-text class="popup-body">
            {{ content }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn class="modal-default-button" @click="summitPopup()">
              <label class="lbBtnPopUp">
                {{ lang.agree }}
              </label>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'ForgetPass',
  auth: 'guest',
  components: {
    Header,
  },
  data() {
    return {
      username: '',
      vUser: false,
      isShow: false,
      isSuccess: false,
      backPath: '',
      path: '/forget-password',
      goPath: '/otp',
      content: '',
      lang: this.$t('forgetPass'),
      locale: this.$i18n.locale,
      rules: {
        required: (value) => !!value || 'Required.',
      },
      isloading: true,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('forget-password-page')
    vm.backPath = vm.getPath()
    vm.resetRegister()
    vm.isloading = false
  },
  methods: {
    ...mapMutations({
      setRegister: 'setRegister',
      resetRegister: 'resetRegister',
      setToken: 'setToken',
      setPath: 'setPath',
      resetToken: 'resetToken',
    }),
    ...mapGetters({
      getRegister: 'getRegister',
      getPath: 'getPath',
    }),
    validate() {
      const vm = this
      firebase.analytics().logEvent('forget-password-page', {
        action_name: 'submit-button',
      })
      vm.isloading = true
      if (vm.username === '') {
        event.preventDefault()
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        if (vm.username === '') {
          vm.content = vm.lang.validatePass
        }
      } else {
        vm.ForgetUser()
      }
    },
    async ForgetUser() {
      const vm = this
      try {
        event.preventDefault()
        const data = {
          username: vm.username,
          lang: vm.locale,
        }
        await vm.$axios.post('/forgot-password', data).then((response) => {
          const res = response.data
          const params = {
            token: res.recovery_token,
            ref: res.ref_no,
            phone: res.mobile,
            ttl_minute: res.ttl_minute,
            is_old_user: false,
          }
          vm.setRegister(params)
          vm.isloading = false
          vm.isShow = true
          if (res.status === 'ok') {
            vm.isSuccess = true
            vm.content = vm.lang.correct
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isShow = true
        vm.isSuccess = false
        vm.isloading = false
        vm.content = e.response.data.message
      }
    },
    goLogin() {
      const vm = this
      firebase.analytics().logEvent('forget-password-page', {
        action_name: 'login-button',
      })
      event.preventDefault()
      vm.resetToken()
      if (vm.locale === 'th') {
        vm.setPath('/forget-password')
        vm.$router.push('/login')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/forget-password')
        vm.$router.push('/en/login')
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isShow = false
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/forget-password')
          vm.$router.push('/otp')
        } else if (vm.locale === 'en') {
          vm.setPath('/en/forget-password')
          vm.$router.push('/en/otp')
        }
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/forget-password')
          vm.$router.push('/otp')
        } else if (vm.locale === 'en') {
          vm.setPath('/en/forget-password')
          vm.$router.push('/en/otp')
        }
      } else {
        vm.isShow = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#ForgetUser {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .ForgetUser-detail {
    position: relative;
    height: 100%;
    padding: 68px 28px 33px;
    .form-group {
      width: 100%;
      margin: 0 auto 28px;
      display: block;
      .lbFrom {
        width: 100%;
        margin-bottom: 8px !important;
        padding-right: 5px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #004899;
        line-height: 24px;
      }
      .txtForm {
        margin-bottom: 20px;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .validate {
        margin: 0;
        padding-top: 8px;
        font-family: 'Sarabun-Regular';
        font-size: 12px;
        color: #ff0000;
        line-height: 24px;
      }
    }
    .form-username {
      margin-bottom: 500px;
    }
    .form-lb {
      width: 100%;
      margin: 20px auto 400px;
      text-align: center;
      .lbForgot {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #000;
        line-height: 24px;
      }
    }
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
    }
  }
}
</style>
<style>
@import url('../../assets/css/forgetUsername.css');
</style>
