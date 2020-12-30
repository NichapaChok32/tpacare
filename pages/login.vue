<template>
  <div id="LoginIndex">
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-else-if="!lineIsClient"></div>
    <v-container
      v-else-if="!isloading"
      id="Login"
      v-click-outside="onClickOutside"
    >
      <v-row class="float-right lang-nav" justify="end">
        <v-col md="5" class="lang-nav-item">
          <nuxt-link
            class="btnLang langTh"
            :to="switchLocalePath('th')"
            :class="{ linkActive: locale === 'th' }"
          >
            {{ lang.langTh }}
          </nuxt-link>
        </v-col>
        <v-divider class="sd-2" vertical></v-divider>
        <v-col md="5" class="lang-nav-item">
          <nuxt-link
            class="btnLang"
            :to="switchLocalePath('en')"
            :class="{ linkActive: locale === 'en' }"
          >
            {{ lang.langEng }}
          </nuxt-link>
        </v-col>
      </v-row>
      <v-row class="login-logo" justify="center">
        <img class="logo" src="../assets/images/logo.svg" />
        <label class="lbLogin"> {{ lang.title }} </label>
      </v-row>
      <v-form method="post" @submit.prevent="validate">
        <v-text-field
          v-model="username"
          :rules="[rules.required]"
          :label="lang.txtUser"
          single-line
          outlined
          class="txtForm"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required]"
          :type="show ? 'text' : 'password'"
          :label="lang.txtPass"
          single-line
          outlined
          class="txtForm"
          @click:append="show = !show"
        ></v-text-field>
        <v-btn
          type="submit"
          depressed
          color="primary"
          :disabled="isloading"
          class="btnLogin"
        >
          {{ lang.btnLogin }}
        </v-btn>
      </v-form>
      <v-row class="forget-nav" justify="center">
        <v-col sd="4" class="forget-nav-item">
          <v-btn
            text
            color="primary"
            class="btnForget"
            @click="goNext('/forget-username')"
          >
            {{ lang.lostUser }}
          </v-btn>
        </v-col>
        <v-divider class="sd-4" vertical></v-divider>
        <v-col sd="4" class="forget-nav-item">
          <v-btn
            text
            color="primary"
            class="btnForget"
            @click="goNext('/forget-password')"
          >
            {{ lang.lostPass }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="register-nav" justify="center">
        <label class="lbRegister"> {{ lang.registerTitle }} </label>
        <v-btn
          text
          color="primary"
          class="btnRegister"
          @click="goNext('/condition')"
        >
          {{ lang.registerLink }}
        </v-btn>
      </v-row>
    </v-container>
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
              v-if="isSuccess && !warning && !isOldUser"
              class="icon-header"
              center
              src="../assets/images/correct.svg"
              alt="Center image"
            />
            <img
              v-if="!isSuccess && !isOldUser"
              class="icon-header"
              center
              src="../assets/images/worst.svg"
              alt="Center image"
            />
            <img
              v-if="isOldUser"
              class="icon-header"
              center
              src="../assets/images/warning.svg"
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
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Login',
  auth: 'guest',
  data() {
    return {
      username: '',
      password: '',
      token: '',
      isCondition: false,
      isPolicy: false,
      isloading: true,
      type: 'password',
      isShow: false,
      content: '',
      path: '/login',
      goPath: '/otp',
      isSuccess: false,
      lang: this.$t('login'),
      locale: this.$i18n.locale,
      rules: {
        required: (value) => !!value || 'Required.',
      },
      error: null,
      show: false,
      isOldUser: false,
    }
  },
  computed: {
    ...mapGetters({
      lineIsClient: 'getLineIsClient',
    }),
  },
  mounted() {
    const vm = this
    vm.$auth.$storage.removeLocalStorage('token')
    vm.resetToken()
    vm.resetCondition()
    vm.resetPrivacy()
    if (
      vm.getPath() === '/forget-username' ||
      vm.getPath() === '/en/forget-username'
    ) {
      vm.username = vm.getUsername()
    }
    vm.isloading = false
  },
  methods: {
    ...mapMutations({
      setToken: 'setToken',
      resetToken: 'resetToken',
      setPath: 'setPath',
      resetUsername: 'resetUsername',
      setCondition: 'setCondition',
      setPrivacy: 'setPrivacy',
      setProfile: 'setProfile',
      setRegister: 'setRegister',
      resetPrivacy: 'resetPrivacy',
      resetCondition: 'resetCondition',
      resetRegister: 'resetRegister',
    }),
    ...mapGetters({
      getUsername: 'getUsername',
      getPath: 'getPath',
    }),
    validate() {
      const vm = this
      firebase.analytics().logEvent('login-button')
      vm.isloading = true
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        if (vm.username === '' && vm.password === '') {
          vm.content = vm.lang.error
        } else if (vm.username === '') {
          vm.content = vm.lang.validateUser
        } else if (vm.password === '') {
          vm.content = vm.lang.validatePass
        }
      } else {
        vm.login()
      }
    },
    checkValidate() {
      const vm = this
      return vm.username === '' || vm.password === ''
    },
    async login() {
      const vm = this
      try {
        const data = {
          username: vm.username,
          password: vm.password,
          device_type: 'web',
          device_token: 'xxxxx',
          lang: 'th',
        }
        await vm.$axios.post('/signin', data).then((response) => {
          const res = response.data
          if (res.data.is_old_user) {
            vm.oldUser()
          } else {
            vm.isValid = false
            vm.token = res.data.access_token
            vm.$auth.$storage.setLocalStorage('token', vm.token)
            vm.$auth.setUserToken(vm.token)
            vm.getCondition()
          }
          firebase.analytics().logEvent('login_button')
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        vm.content = e.response.data.message
      }
    },
    async oldUser() {
      const vm = this
      try {
        event.preventDefault()
        const data = {
          username: vm.username,
          lang: 'th',
        }
        await vm.$axios.post('/forgot-password', data).then((response) => {
          const res = response.data
          const params = {
            token: res.recovery_token,
            ref: res.ref_no,
            phone: res.mobile,
            ttl_minute: res.ttl_minute,
            is_old_user: true,
          }
          vm.setRegister(params)
          if (res.status === 'ok') {
            vm.isShow = true
            vm.isloading = false
            vm.isOldUser = true
            vm.content = vm.lang.oldUser
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isShow = true
        vm.isloading = false
        vm.isOldUser = false
        vm.isSuccess = false
        vm.content = e.response.data.message
      }
    },
    async getCondition() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get('/agreement/check/1').then((response) => {
          const res = response.data
          if (res.status === 'error' && res.force) {
            const condition = {
              id: res.data.id,
              isForce: res.force,
              isAgree: false,
            }
            vm.setCondition(condition)
            vm.setPath('/login')
            vm.isloading = false
            vm.$router.push('/condition')
          } else {
            vm.getPrivacy()
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isShow = true
        vm.isloading = false
        vm.content = e.response.data.message
      }
    },
    async getPrivacy() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get('/agreement/check/2').then((response) => {
          const res = response.data
          if (res.status === 'error' && res.force) {
            const privacy = {
              id: res.data.id,
              isForce: res.force,
              isAgree: false,
            }
            vm.setPrivacy(privacy)
            vm.setPath('/login')
            vm.isloading = false
            vm.$router.push('/privacy')
          } else {
            vm.resetRegister()
            vm.isloading = false
            if (vm.locale === 'th') {
              vm.$router.push('/')
            } else if (vm.locale === 'en') {
              vm.$router.push('/en/')
            }
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isShow = true
        vm.isloading = false
        vm.content = e.response.data.message
      }
    },
    goNext(path) {
      const vm = this
      vm.resetUsername()
      firebase.analytics().logEvent(path)
      if (vm.locale === 'th') {
        vm.setPath('/login')
        vm.$router.push(path)
      } else if (vm.locale === 'en') {
        vm.setPath('/en/login')
        vm.$router.push('/en' + path)
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isOldUser) {
        vm.setPath('/login')
        vm.$router.push('/otp')
      } else if (!vm.isSuccess) {
        vm.isShow = false
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isShow = false
      if (vm.isOldUser) {
        vm.setPath('/login')
        vm.$router.push('/otp')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) and (max-width: 320px) {
  #LoginIndex {
    #Login {
      padding: 20px !important;
      .btnLogin {
        max-width: 280px;
        padding: 11px 20px !important;
      }
    }
  }
}
@media screen and (min-height: 688px) and (max-height: 731px) {
  #LoginIndex {
    #Login {
      padding: 20px 30px 60px !important;
    }
  }
}
@media screen and (min-height: 732px) and (max-height: 750px) {
  #LoginIndex {
    #Login {
      padding: 20px 30px 70px !important;
    }
  }
}
@media screen and (min-height: 751px) and (max-height: 823px) {
  #LoginIndex {
    #Login {
      padding: 20px 30px 150px !important;
    }
  }
}
@media screen and (min-height: 824px) and (max-height: 1023px) {
  #LoginIndex {
    #Login {
      padding: 20px 30px 250px !important;
    }
  }
}
@media screen and (min-height: 1024px) and (max-height: 1050px) {
  #LoginIndex {
    #Login {
      padding: 170px 30px 250px !important;
    }
  }
}
// For iPad Pro
@media screen and (min-height: 1366px) and (max-height: 1366px) {
  #LoginIndex {
    #Login {
      padding: 290px 150px 290px !important;
      .lang-nav {
        .lang-nav-item {
          .btnLang {
            font-size: 24px !important;
            margin: 0 !important;
          }
        }
        .v-divider {
          height: 24px !important;
        }
      }
      .login-logo {
        margin: 25px auto !important;
        .logo {
          margin: 37px auto 40px !important;
        }
        .lbLogin {
          font-size: 24px !important;
          line-height: 30px !important;
          padding: 0 20px 40px;
        }
      }
      .forget-nav {
        .forget-nav-item {
          .btnForget {
            width: 100%;
            min-width: 100% !important;
            font-size: 24px !important;
            line-height: 30px !important;
          }
        }
        .v-divider {
          margin: auto 24px !important;
        }
      }
      .register-nav {
        .lbRegister {
          font-size: 24px !important;
          line-height: 30px !important;
        }
        .btnRegister {
          font-size: 24px !important;
          line-height: 30px !important;
        }
      }
      .btnLogin {
        height: 65px !important;
        margin-bottom: 26px !important;
        font-size: 24px !important;
        line-height: 30px !important;
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px) {
  #LoginIndex {
    #Login {
      margin: 0;
      max-width: 100%;
      .login-logo {
        display: block;
        .logo {
          text-align: center;
          display: block;
        }
        .lbLogin {
          width: 100% !important;
        }
      }
      .v-form {
        padding: 0 50px;
      }
    }
  }
}
#LoginIndex {
  height: 100%;
  #Login {
    height: 100%;
    background-image: url('../assets/images/LoginBG.svg');
    background-size: 100%;
    background-position: center top;
    background-repeat: no-repeat;
    padding: 20px 30px;
    .lang-nav {
      width: fit-content;
      margin-left: auto;
      margin-right: 0;
      .lang-nav-item {
        padding: 0;
        .btnLang {
          min-width: fit-content;
          height: fit-content;
          padding: 0;
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          letter-spacing: 0.05px;
          line-height: 20px;
          color: #2f2e41;
        }
        .langTh {
          float: right;
          margin: 2.5px 0;
        }
        .linkActive {
          color: #3ba9fe;
        }
      }
      .v-divider {
        height: 15px;
        margin: auto 5px;
        border-color: #2f2e41;
      }
    }
    .login-logo {
      width: 100%;
      margin: 0 auto;
      .logo {
        max-height: 133px;
        max-width: 203px;
        margin: 37px auto 20px;
      }
      .lbLogin {
        width: fit-content;
        padding-bottom: 40px;
        text-align: center;
        font-family: 'Anuphan-Medium';
        font-size: 14px;
        line-height: 20px;
        color: #004899;
      }
    }
    .txtForm {
      margin-bottom: 37px;
      border: solid 0.5px #2f2e41;
      border-radius: 6px;
    }
    .btnLogin {
      width: 100%;
      height: 45px;
      margin: 26px auto 16px;
      padding: 11px 114px;
      border-radius: 6px;
      background-color: #3ba9fe !important;
      font-family: 'Anuphan-Regular';
      font-size: 18px;
      line-height: 12px;
      letter-spacing: 0.36px;
      color: #fff;
      text-transform: none;
    }
    .forget-nav {
      width: fit-content;
      margin: 0 auto 37px;
      .forget-nav-item {
        padding: 0;
        .btnForget {
          min-width: fit-content;
          height: fit-content;
          padding: 0;
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          letter-spacing: 0.32px;
          line-height: 12px;
          color: #6c63ff;
          text-transform: none;
        }
      }
      .v-divider {
        height: 25px;
        margin: auto 18px;
        border-color: #6c63ff;
      }
    }
    .register-nav {
      width: fit-content;
      margin: 0 auto;
      .lbRegister {
        width: fit-content;
        min-width: fit-content;
        height: fit-content;
        padding-right: 11px;
        font-family: 'Anuphan-Medium';
        font-size: 14px;
        line-height: 19px;
        color: #4f5358;
      }
      .btnRegister {
        width: fit-content;
        min-width: fit-content;
        height: fit-content;
        font-family: 'Anuphan-Medium';
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0;
        padding: 0;
        color: #6c63ff !important;
        text-transform: none;
      }
    }
  }
}
</style>
<style>
@import url('../assets/css/login.css');
</style>
