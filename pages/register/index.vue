<template>
  <div id="Register">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isloading"
      method="get"
      class="register-detail"
      @submit.prevent="validate"
    >
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.user }}
        </label>
        <v-btn
          v-click-outside="onUserClickOutside"
          class="btnTooltip"
          max-width="13"
          max-height="13"
          @click="show3 = !show3"
        >
          <img class="ttp" src="../../assets/images/tooltip.svg" />
        </v-btn>
        <v-tooltip v-model="show3" bottom content-class="tpUser">
          <span>{{ tooltipUser }}</span>
        </v-tooltip>
        <v-text-field
          v-model="username"
          :rules="[rules.required]"
          single-line
          outlined
          class="txtForm"
          :class="{ txtValidate: vUser || vCorrectUser }"
          @change="clearValidateUser()"
        ></v-text-field>
        <label v-if="vUser" class="validate">
          {{ lang.validateUser }}
        </label>
        <label v-if="vCorrectUser" class="validate">
          {{ lang.validateCorrectUser }}
        </label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.pass }}
        </label>
        <v-btn
          v-click-outside="onPassClickOutside"
          class="btnTooltip"
          max-width="13"
          max-height="13"
          @click="show4 = !show4"
        >
          <img class="ttp" src="../../assets/images/tooltip.svg" />
        </v-btn>
        <v-tooltip v-model="show4" bottom content-class="tpPass">
          <span>{{ tooltipPass }}</span>
        </v-tooltip>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          single-line
          outlined
          class="txtForm"
          :class="{ txtValidate: vPass || vCorrectPass }"
          @click:append="show1 = !show1"
          @change="clearValidatePass()"
        ></v-text-field>
        <label v-if="vPass" class="validate">
          {{ lang.validatePass }}
        </label>
        <label v-if="vPass" class="validate">
          {{ lang.validateCorrectPass }}
        </label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.comfirm }}
        </label>
        <v-text-field
          v-model="confirmPassword"
          :append-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required, rules.same]"
          :type="show2 ? 'text' : 'password'"
          single-line
          outlined
          class="txtForm"
          :class="{ txtValidate: vConfirmPass || vCon }"
          @click:append="show2 = !show2"
          @change="clearValidateConfirm()"
        ></v-text-field>
        <label v-if="vConfirmPass" class="validate">{{
          lang.validateConfirm
        }}</label>
        <label v-if="vCon" class="validate">{{ lang.validateConfirm }}</label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.name }}
        </label>
        <v-text-field
          v-model="firstname"
          :rules="[rules.required]"
          single-line
          outlined
          class="txtForm"
          :class="{ txtValidate: vFirstName || vCorrectFirst }"
          @change="clearFirstName()"
        ></v-text-field>
        <label v-if="vFirstName" class="validate">
          {{ lang.validateName }}
        </label>
        <label v-if="vCorrectFirst" class="validate">
          {{ lang.validateCorrectName }}
        </label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.lastname }}
        </label>
        <v-text-field
          v-model="lastname"
          :rules="[rules.required]"
          single-line
          outlined
          type="text"
          class="txtForm"
          :class="{ txtValidate: vLastName || vCorrectLast }"
          @change="clearLastName()"
        ></v-text-field>
        <label v-if="vLastName" class="validate">
          {{ lang.validateSurname }}
        </label>
        <label v-if="vCorrectLast" class="validate">
          {{ lang.validateCorrectSurname }}
        </label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.phone }}
        </label>
        <input
          v-model="mobile"
          :rules="[rules.required]"
          type="tel"
          pattern="[0-9]*"
          maxlength="10"
          class="txtPhoneForm"
          :class="{ txtValidate: vMobile }"
          @change="vMobile = false"
        />
        <label v-if="vMobile" class="validate">
          {{ lang.validatePhone }}
        </label>
      </v-row>
      <v-row class="form-group">
        <v-btn
          type="submit"
          depressed
          color="primary"
          :disabled="isloading"
          class="btnSummit"
        >
          {{ lang.btnRegister }}
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
import { mapMutations, mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'Register',
  auth: 'guest',
  components: {
    Header,
  },
  data() {
    return {
      tooltipUser: this.$t('register').tooltipUser,
      tooltipPass: this.$t('register').tooltipPass,
      isSuccess: false,
      username: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: '',
      mobile: '',
      vUser: false,
      vPass: false,
      vConfirmPass: false,
      vFirstName: false,
      vLastName: false,
      vMobile: false,
      vCorrectFirst: false,
      vCorrectLast: false,
      isShow: false,
      backPath: '',
      content: '',
      lang: this.$t('register'),
      locale: this.$i18n.locale,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length <= 8 || 'Min 8 characters',
        same: (v) => v === this.confirmPassword || 'Not Same Password',
      },
      error: null,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      isloading: true,
      vCorrectUser: false,
      vCorrectPass: false,
      vCon: false,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('register-page')
    vm.resetRegister()
    vm.backPath = vm.getPath()
    vm.checkBackPath()
  },
  methods: {
    ...mapMutations({
      setRegister: 'setRegister',
      resetRegister: 'resetRegister',
      setPath: 'setPath',
    }),
    ...mapGetters({
      getPath: 'getPath',
    }),
    checkBackPath() {
      const vm = this
      if (vm.locale === 'th') {
        switch (vm.backPath) {
          case '/privacy':
            vm.setPath('/condition')
            break
        }
      } else if (vm.locale === 'en') {
        switch (vm.backPath) {
          case '/en/privacy':
            vm.setPath('/en/condition')
            break
        }
      }
      vm.isloading = false
    },
    openTooltipUser() {
      const vm = this
      vm.showUser = true
    },
    openTooltipPass() {
      const vm = this
      vm.showPass = true
    },
    clearValidate() {
      const vm = this
      vm.vUser = false
      vm.vCorrectUser = false
      vm.vPass = false
      vm.vCorrectPass = false
      vm.vConfirmPass = false
      vm.vFirstName = false
      vm.vCorrectFirst = false
      vm.vLastName = false
      vm.vCorrectLast = false
      vm.vMobile = false
    },
    setValidate() {
      const vm = this
      vm.vUser =
        vm.username.length < 5 || vm.username.length > 15 || vm.username === ''
      vm.vCorrectUser =
        vm.username !== '' && /[-!@#$%&'*+/=?^_`{|}~]/.test(vm.username)
      vm.vPass =
        vm.password.length < 8 || vm.password.length > 15 || vm.password === ''
      vm.vCorrectPass =
        vm.password !== '' &&
        (!/[A-Z]/.test(vm.password) ||
          !/[a-z]/.test(vm.password) ||
          !/[0-9]/.test(vm.password))
      vm.vConfirmPass = vm.password !== '' && vm.confirmPassword !== vm.password
      vm.vCon = vm.confirmPassword === ''
      vm.vFirstName = vm.firstname === ''
      vm.vCorrectFirst = /[0-9-!@#$%&'*+/=?^_`{|}~]/.test(vm.firstname)
      vm.vLastName = vm.lastname === ''
      vm.vCorrectLast = /[0-9-!@#$%&'*+/=?^_`{|}~]/.test(vm.lastname)
      vm.vMobile =
        vm.mobile === '' ||
        vm.mobile.length !== 10 ||
        /[A-Za-z-!@#$%&'*+/=?^_`{|}~]/.test(vm.mobile)
    },
    validate() {
      const vm = this
      firebase.analytics().logEvent('register-button')
      vm.isloading = true
      vm.clearValidate()
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.setValidate()
        vm.isloading = false
      } else {
        vm.register()
      }
    },
    checkValidate() {
      const vm = this
      return (
        vm.username.length < 5 ||
        vm.username.length > 15 ||
        vm.username === '' ||
        /[-!@#$%&'*+/=?^_`{|}~]/.test(vm.username) ||
        vm.password.length < 8 ||
        vm.password.length > 15 ||
        vm.password === '' ||
        !/[A-Z]/.test(vm.password) ||
        !/[a-z]/.test(vm.password) ||
        !/[0-9]/.test(vm.password) ||
        vm.confirmPassword === '' ||
        vm.confirmPassword !== vm.password ||
        vm.firstname === '' ||
        vm.firstname === ' ' ||
        /[0-9-!@#$%&'*+/=?^_`{|}~]/.test(vm.firstname) ||
        vm.lastname === '' ||
        vm.lastname === ' ' ||
        /[0-9-!@#$%&'*+/=?^_`{|}~]/.test(vm.lastname) ||
        vm.mobile === '' ||
        vm.mobile === ' ' ||
        vm.mobile.length !== 10 ||
        /[A-Za-z-!@#$%&'*+/=?^_`{|}~]/.test(vm.mobile)
      )
    },
    async register() {
      const vm = this
      try {
        event.preventDefault()
        const data = {
          username: vm.username,
          password: vm.password,
          passconf: vm.confirmPassword,
          name: vm.firstname,
          surname: vm.lastname,
          mobile: vm.mobile,
          device_type: 'web',
          device_token: 'xxxxx',
          lang: 'th',
        }
        await vm.$axios.post('/register', data).then((response) => {
          const res = response.data
          const params = {
            token: res.register_token,
            ref: res.ref_no,
            phone: vm.mobile,
            ttl_minute: res.ttl_minute,
          }
          vm.setRegister(params)
          vm.isShow = true
          vm.isloading = false
          if (res.status === 'ok') {
            vm.isSuccess = true
            vm.content = vm.lang.correctRegister
          } else {
            vm.isSuccess = false
            vm.content = res.message
          }
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
    onUserClickOutside(e) {
      const vm = this
      vm.show3 = false
    },
    onPassClickOutside(e) {
      const vm = this
      vm.show4 = false
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/register')
          vm.$router.push('/otp')
        } else if (vm.locale === 'en') {
          vm.setPath('/en/register')
          vm.$router.push('/en/otp')
        }
      } else {
        vm.isShow = false
      }
    },
    clearFirstName() {
      const vm = this
      vm.vFirstName = false
      vm.vCorrectFirst = false
    },
    clearLastName() {
      const vm = this
      vm.vLastName = false
      vm.vCorrectLast = false
    },
    clearValidateUser() {
      const vm = this
      vm.vUser = false
      vm.vCorrectUser = false
    },
    clearValidatePass() {
      const vm = this
      vm.vPass = false
      vm.vCorrectPass = false
    },
    clearValidateConfirm() {
      const vm = this
      vm.vConfirmPass = false
      vm.vCon = false
    },
  },
}
</script>

<style lang="scss" scoped>
#Register {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .register-detail {
    height: 100%;
    padding: 68px 28px 33px;
    .form-group {
      width: 100%;
      margin: 0 auto 28px;
      display: block;
      .btnTooltip {
        min-width: fit-content;
        width: fit-content;
        padding: 0;
        padding-left: 5px;
        cursor: pointer;
        background-color: transparent;
        .ttp {
          width: 13.33px;
          height: 13.33px;
          margin-bottom: 5px;
        }
      }
      .lbFrom {
        width: fit-content;
        margin: 0 auto 8px !important;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #004899;
        line-height: 24px;
      }
      .txtForm {
        margin-bottom: 28px;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .txtPhoneForm {
        padding: 12px 16px;
        margin-bottom: 0;
        min-height: auto;
        max-height: 45px;
        background-color: #fff;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
        width: 100%;
      }
      .txtValidate {
        border: 0.5px solid #ff0000;
        margin-bottom: 0;
      }
      .btnSummit {
        margin-top: 5px;
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
      .validate {
        margin: 0;
        padding-top: 8px;
        font-family: 'Sarabun-Regular';
        font-size: 10px;
        color: #ff0000;
        line-height: 24px;
      }
    }
    .submit-group {
      margin-bottom: 0;
    }
    .password-group {
      position: relative;
      .btnHidePassword {
        border: none;
        background: none;
        position: absolute;
        padding: 0;
        top: 55%;
        right: 5%;
        .btnHide {
          width: 100%;
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/register.css');
</style>
