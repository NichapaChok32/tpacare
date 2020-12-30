<template>
  <div id="ForgetUser">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isloading"
      method="put"
      class="ForgetUser-detail"
      @submit.prevent="validate"
    >
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.newUser }}
        </label>
        <v-btn
          v-click-outside="onClickOutside"
          class="btnTooltip"
          max-width="13"
          max-height="13"
          @click="show3 = !show3"
        >
          <img class="ttp" src="../../assets/images/tooltip.svg" />
        </v-btn>
        <v-tooltip v-model="show3" bottom content-class="tpPass">
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
          @click:append="show1 = !show1"
        ></v-text-field>
        <label v-if="vPass" class="validate">
          {{ lang.validateNewPass }}
        </label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.comfirmUser }}
        </label>
        <v-text-field
          v-model="confirmPassword"
          :append-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required, rules.same]"
          :type="show2 ? 'text' : 'password'"
          single-line
          outlined
          class="txtForm"
          @click:append="show2 = !show2"
        ></v-text-field>
        <label v-if="vConfirmPass" class="validate">{{
          lang.validateConfirm
        }}</label>
      </v-row>
      <v-row class="form-group btn-group">
        <v-btn type="submit" depressed color="primary" class="btnSummit">
          {{ lang.btnAgree }}
        </v-btn>
      </v-row>
    </v-form>
    <v-row v-if="isShow" justify="center">
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
import Header from '../../components/header'
export default {
  name: 'ReNewPassword',
  auth: 'guest',
  components: {
    Header,
  },
  data() {
    return {
      password: '',
      confirmPassword: '',
      vPass: false,
      vConfirmPass: false,
      token: '',
      backPath: '',
      tooltipPass: this.$t('forgetPass').tooltipPass,
      showPass: false,
      params: {},
      lang: this.$t('forgetPass'),
      locale: this.$i18n.locale,
      isloading: true,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length <= 8 || 'Min 8 characters',
        same: (v) => v === this.confirmPassword || 'Not Same Password',
      },
      error: null,
      show1: false,
      show2: false,
      show3: false,
      isShow: false,
      content: '',
    }
  },
  mounted() {
    const vm = this
    vm.backPath = vm.getPath()
    vm.token = vm.getToken()
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
      getPath: 'getPath',
      getToken: 'getToken',
    }),
    validate() {
      const vm = this
      vm.isloading = true
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        if (
          vm.password.length < 8 ||
          vm.password.length > 15 ||
          vm.password === ''
        ) {
          vm.content = vm.lang.validateNewPass
        } else if (
          vm.password !== '' &&
          (!/[A-Z]/.test(vm.password) ||
            !/[a-z]/.test(vm.password) ||
            !/[0-9]/.test(vm.password))
        ) {
          vm.content = vm.lang.validateCorrectPass
        } else if (vm.confirmPassword === '') {
          vm.content = vm.lang.validateConfirm
        } else if (vm.password !== '' && vm.confirmPassword !== vm.password) {
          vm.content = vm.lang.validateCon
        }
      } else {
        vm.forgetPass()
      }
    },
    checkValidate() {
      const vm = this
      return (
        vm.password.length < 8 ||
        vm.password.length > 15 ||
        vm.password === '' ||
        !/[A-Z]/.test(vm.password) ||
        !/[a-z]/.test(vm.password) ||
        !/[0-9]/.test(vm.password) ||
        vm.confirmPassword === '' ||
        (vm.password !== '' && vm.confirmPassword !== vm.password)
      )
    },
    async forgetPass() {
      const vm = this
      try {
        event.preventDefault()
        const data = {
          recovery_token: vm.token,
          password: vm.password,
          passconf: vm.confirmPassword,
          lang: vm.locale,
        }
        await vm.$axios
          .put('/forgot-password/change-password', data)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.isLoading = false
              vm.isShow = true
              if (res.status === 'ok') {
                vm.resetToken()
                vm.resetRegister()
                vm.isSuccess = true
                vm.isShow = true
                vm.content = vm.lang.successPass
              } else {
                vm.isSuccess = false
                vm.content = res.message
              }
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/forget-password')
          vm.$router.push('/login')
        } else if (vm.locale === 'en') {
          vm.setPath('/en/forget-password')
          vm.$router.push('/en/login')
        }
      } else {
        vm.isShow = false
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.show3 = false
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
    padding: 68px 28px 105px;
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
        margin-bottom: 8px !important;
        padding-right: 5px;
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
      .validate {
        margin: 0;
        padding-top: 8px;
        font-family: 'Sarabun-Regular';
        font-size: 12px;
        color: #ff0000;
        line-height: 24px;
      }
    }
    .btn-group {
      margin: 380px auto 0;
    }
    .form-lb {
      width: 100%;
      margin: 20px auto 270px;
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
@import url('../../assets/css/reNewPassword.css');
</style>
