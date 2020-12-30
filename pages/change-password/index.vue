<template>
  <div id="ChangePassword">
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
        <label class="lbFrom"> {{ lang.currPassLabel }} </label>
        <v-text-field
          v-model="oldPassword"
          :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required]"
          :type="show1 ? 'text' : 'password'"
          single-line
          outlined
          class="txtForm"
          @click:append="show1 = !show1"
        ></v-text-field>
        <label v-if="vOldPass" class="validate">{{
          lang.validateCurrPass
        }}</label>
      </v-row>
      <v-row class="form-group">
        <label class="lbFrom">
          {{ lang.newPassLabel }}
        </label>
        <v-btn
          v-click-outside="onClickOutside"
          class="btnTooltip"
          max-width="13"
          max-height="13"
          @click="show2 = !show2"
        >
          <img class="ttp" src="../../assets/images/tooltip.svg" />
        </v-btn>
        <v-tooltip v-model="show2" bottom content-class="tpPass">
          <span>{{ tooltipPass }}</span>
        </v-tooltip>
        <v-text-field
          v-model="password"
          :append-icon="show3 ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required, rules.min]"
          :type="show3 ? 'text' : 'password'"
          single-line
          outlined
          class="txtForm"
          @click:append="show3 = !show3"
        ></v-text-field>
        <label v-if="vPass" class="validate">
          {{ lang.validateNewPass }}
        </label>
      </v-row>
      <v-row class="form-group form-username">
        <label class="lbFrom"> {{ lang.confirmPassLabel }} </label>
        <v-text-field
          v-model="confirmPassword"
          :append-icon="show4 ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[rules.required]"
          :type="show4 ? 'text' : 'password'"
          single-line
          outlined
          class="txtForm"
          @click:append="show4 = !show4"
        ></v-text-field>
        <label v-if="vConfirmPass" class="validate">{{
          lang.validateConfirm
        }}</label>
      </v-row>
      <v-row class="form-group submit-group">
        <b-btn type="submit" variant="primary" class="btnSummit">
          {{ lang.btnSubmit }}
        </b-btn>
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
  name: 'ChangePassword',
  components: {
    Header,
  },
  data() {
    return {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      vOldPass: false,
      vPass: false,
      vConfirmPass: false,
      token: '',
      backPath: '',
      tooltipPass: this.$t('change-password').tooltipPass,
      showPass: false,
      type: 'password',
      typeConfirm: 'password',
      typeOld: 'password',
      params: {},
      isShow: false,
      content: '',
      isSuccess: false,
      lang: this.$t('change-password'),
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
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
    }),
    openTooltipPass() {
      const vm = this
      vm.showPass = true
    },
    clearValidate() {
      const vm = this
      vm.vPass = false
      vm.vConfirmPass = false
      vm.vOldPass = false
    },
    setValidate() {
      const vm = this
      vm.vOldPass = vm.oldPassword === ''
      vm.vPass =
        vm.password.length < 8 ||
        vm.password.length > 15 ||
        vm.password === '' ||
        !/[A-Z]/.test(vm.password) ||
        !/[a-z]/.test(vm.password) ||
        !/[0-9]/.test(vm.password)
      vm.vSamePass = vm.oldPassword === vm.password
    },
    validate() {
      const vm = this
      vm.isloading = true
      vm.content = ''
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        if (vm.oldPassword === '') {
          vm.content = vm.lang.validateCurrPass
        } else if (
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
        } else if (vm.oldPassword === vm.password) {
          vm.content = vm.lang.validateSamePass
        }
      } else {
        vm.changePass()
      }
    },
    checkValidate() {
      const vm = this
      return (
        vm.oldPassword === '' ||
        vm.password.length < 8 ||
        vm.password.length > 15 ||
        vm.password === '' ||
        !/[A-Z]/.test(vm.password) ||
        !/[a-z]/.test(vm.password) ||
        !/[0-9]/.test(vm.password) ||
        vm.oldPassword === vm.password ||
        (vm.password !== '' && vm.confirmPassword !== vm.password)
      )
    },
    async changePass() {
      const vm = this
      try {
        event.preventDefault()
        const data = {
          passcurr: vm.oldPassword,
          password: vm.password,
          passconf: vm.confirmPassword,
          lang: vm.locale,
        }
        await vm.$axios.put('/setpass', data).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            vm.isloading = false
            vm.isShow = true
            vm.isSuccess = true
            vm.content = vm.lang.correct
          }
        })
        firebase.analytics().logEvent('change-password-buton')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        vm.content = e.response.data.message
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.show2 = false
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.$router.push('/setting')
        } else if (vm.locale === 'en') {
          vm.$router.push('/en/setting')
        }
      } else {
        vm.isShow = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#ChangePassword {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .ForgetUser-detail {
    height: 100%;
    padding: 69px 28px 33px;
    margin: 0 auto;
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
      .txtValidate {
        border: 0.5px solid #ff0000;
      }
      .btnSummit {
        margin-top: 290px;
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
  }
}
</style>
<style>
@import url('../../assets/css/change-password.css');
</style>
