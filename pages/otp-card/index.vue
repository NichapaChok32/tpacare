<template v-click-outside="onClickOutside">
  <div id="Otp">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isloading"
      method="post"
      class="otp-form"
      @submit.prevent="summit"
    >
      <v-row class="form-group" justify="center">
        <label class="lbFrom">{{ lang.header }}</label>
        <v-otp-input
          ref="otpInput"
          class="otpForm"
          input-classes="otp-input"
          separator=" "
          :num-inputs="6"
          :should-auto-focus="true"
          :is-input-num="true"
          autocomplete="off"
          @on-change="handleOnChange"
          @on-complete="handleOnComplete"
        />
      </v-row>
      <v-row class="otp-detail" justify="center">
        <label class="lbOTP">
          {{ lang.otpPhone }}
          <span class="phone">{{
            '(+66) ' + phone[0] + ' XXXXX' + phone[1]
          }}</span>
        </label>
        <br />
        <label class="lbOTP">
          {{ lang.refer }} <span class="phone">{{ params.ref_no }}</span>
        </label>
        <label v-if="validateContent !== ''" class="validate">
          {{ validateContent }}
        </label>
      </v-row>
      <v-row class="otp-link" justify="center">
        <v-btn
          v-if="isTimeOut"
          color="primary"
          class="otpLink"
          :class="{ openlink: isTimeOut }"
          text
          @click="resetOtp()"
        >
          {{ lang.resendOtp }}
        </v-btn>
        <label v-else class="otpLink">{{ lang.resendOtp }}</label>
        <br />
        <label class="lbOTP">
          {{ lang.countdown }}
          <span>
            <span>{{ '(' + minutes }}</span>
            <span>:</span>
            <span>{{ seconds + ')' }}</span>
          </span>
        </label>
      </v-row>
      <v-row class="otp-summit" justify="center">
        <v-btn type="submit" depressed color="primary" class="btnSummit">
          {{ lang.btnVerify }}
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
import Header from '../../components/header'
export default {
  name: 'Otp',
  components: {
    Header,
  },
  data() {
    return {
      params: {
        token: '',
        ref_no: '',
        phone: '',
        ttl_minute: 0,
      },
      otp: '',
      minutes: '--',
      seconds: '--',
      interval: 0,
      time: 0,
      total: 0,
      isComplete: false,
      isTimeOut: false,
      validateContent: '',
      backPath: '',
      mobile: '',
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
      token: '',
      phone: [],
      isShow: false,
      isSuccess: false,
      lang: this.$t('otp-card'),
      locale: this.$i18n.locale,
      profile: {},
      isSameMobile: false,
      isloading: true,
    }
  },
  mounted() {
    const vm = this
    vm.backPath = vm.getPath()
    vm.checkBackPath()
    vm.params = vm.getRegister()
    vm.mobile = vm.params.phone
    vm.phone[0] = vm.mobile.substr(0, 3)
    vm.phone[1] = vm.mobile.substr(8, 2)
    vm.condition = vm.getCondition()
    vm.privacy = vm.getPrivacy()
    vm.profile = vm.$auth.$storage.getLocalStorage('profile')
    vm.time = vm.params.ttl_minute * 60
    vm.total = parseInt(vm.time, 10)
    vm.isloading = false
    vm.interval = setInterval(() => {
      vm.tick()
    }, 1000)
  },
  methods: {
    ...mapMutations({
      setRegister: 'setRegister',
      setToken: 'setToken',
      setPath: 'setPath',
      setUsername: 'setUsername',
      resetCondition: 'resetCondition',
      resetPrivacy: 'resetPrivacy',
    }),
    ...mapGetters({
      getRegister: 'getRegister',
      getPath: 'getPath',
      getCondition: 'getCondition',
      getPrivacy: 'getPrivacy',
    }),
    checkBackPath() {
      const vm = this
      switch (vm.params.token) {
        case 'EditProfile':
          if (vm.locale === 'th') {
            vm.setPath('/setting')
          } else if (vm.locale === 'en') {
            vm.setPath('/en/setting')
          }
          break
        case 'ViewCardDetail':
          if (vm.locale === 'th') {
            vm.setPath('/')
          } else if (vm.locale === 'en') {
            vm.setPath('/en')
          }
          break
      }
    },
    str_pad_left(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length)
    },
    tick() {
      const vm = this
      const min = Math.floor(vm.total / 60)
      const sec = vm.total - min * 60
      vm.minutes = vm.str_pad_left(min, '0', 2)
      vm.seconds = vm.str_pad_left(sec, '0', 2)

      if (vm.total <= 0) {
        clearInterval(vm.interval)
        vm.isTimeOut = true
      } else {
        vm.total -= 1
      }
    },
    resetOtp() {
      const vm = this
      vm.isloading = true
      if (vm.isTimeOut) {
        vm.getOtp()
        vm.isTimeOut = false
        vm.total = parseInt(vm.time, 10)
        vm.interval = setInterval(() => {
          vm.tick()
        }, 1000)
      } else if (vm.params.token === 'EditProfile') {
        vm.getOtp()
      }
    },
    async getOtp() {
      const vm = this
      try {
        const profile = vm.$auth.$storage.getLocalStorage('profile')
        const data = {
          name: profile.name,
          surname: profile.surname,
          mobile: vm.params.phone,
          lang: vm.locale,
        }
        vm.$axios.setHeader(
          'Authorization',
          'Bearer ' + vm.$auth.$storage.getLocalStorage('token')
        )
        await vm.$axios.post('/profile/resendotp', data).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            vm.isloading = false
            vm.params = {
              token: vm.params.token,
              ref_no: res.ref_no,
              phone: vm.mobile,
              ttl_minute: res.ttl_minute,
              is_old_user: false,
            }
            vm.phone[0] = vm.mobile.substr(0, 3)
            vm.phone[1] = vm.mobile.substr(8, 2)
            vm.total = parseInt(vm.time, 10)
            vm.interval = setInterval(() => {
              vm.tick()
            }, 1000)
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isShow = true
        vm.isSuccess = false
        vm.isloading = false
        vm.content = e.response.data.message
        vm.total = 0
        vm.interval = 0
        vm.time = 0
      }
    },
    handleOnComplete(value) {
      const vm = this
      vm.otp = value
    },
    handleOnChange(value) {
      const vm = this
      vm.otp = value
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput()
    },
    async summit() {
      const vm = this
      vm.isloading = true
      try {
        const data = {
          otp: vm.otp,
          lang: vm.locale,
        }
        vm.$axios.setHeader(
          'Authorization',
          'Bearer ' + vm.$auth.$storage.getLocalStorage('token')
        )
        await vm.$axios.post('/profile/verifyotp', data).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            vm.updateProfile()
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
    async updateProfile() {
      const vm = this
      try {
        const data = {
          name: vm.profile.name,
          surname: vm.profile.surname,
          mobile: vm.params.phone !== '' ? vm.params.phone : vm.mobile,
          sex: vm.profile.sex,
          birthdate: vm.profile.birthDate,
          photo: vm.profile.photo,
          lang: vm.locale,
        }
        vm.$axios.setHeader(
          'Authorization',
          'Bearer ' + vm.$auth.$storage.getLocalStorage('token')
        )
        await vm.$axios.put('/profile', data).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            if (vm.params.token === 'EditProfile') {
              vm.$auth.$storage.setLocalStorage('profile', data)
              vm.isloading = false
              vm.isShow = true
              vm.isSuccess = true
              vm.content = vm.lang.successTel
            } else {
              vm.isloading = false
              vm.$auth.$storage.setLocalStorage('profile', data)
              vm.$auth.$storage.setLocalStorage('ViewCardAuthenication', true)
              vm.$auth.$storage.setLocalStorage('isActivate', true)
              const idCard = vm.$auth.$storage.getLocalStorage('idcard')
              if (vm.locale === 'th') {
                vm.setPath('/')
                vm.$router.push(`/coverages/${idCard}`)
              } else if (vm.locale === 'en') {
                vm.setPath('/en')
                vm.$router.push(`/en/coverages/${idCard}`)
              }
            }
          } else {
            vm.isShow = true
            vm.isSuccess = false
            vm.content = res.message
          }
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        vm.isLoading = false
        vm.isShow = true
        vm.isSuccess = false
        vm.content = error.response.data.message
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push('/edit-profile')
        } else {
          vm.setPath('/en')
          vm.$router.push('/en/edit-profile')
        }
      } else {
        vm.isShow = false
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isShow = false
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push('/edit-profile')
        } else {
          vm.setPath('/en')
          vm.$router.push('/en/edit-profile')
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#Otp {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .lbBtnPopUp {
    font-family: 'Anuphan-Regular';
    font-size: 18px;
    color: #3ba9fe;
    line-height: 23px;
  }
  .otp-form {
    height: 100%;
    padding: 69px 28px 70px;
    .form-group {
      width: 100%;
      margin: 0 auto 28px;
      display: block;
      .otpForm {
        width: 100%;
        margin: 0 auto;
        text-align: center;
      }
      .lbFrom {
        width: 100%;
        margin-bottom: 8px !important;
        padding-right: 5px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #004899;
        line-height: 24px;
      }
    }
    .otp-detail {
      width: 100%;
      margin: 23px auto 77px;
      display: block;
      .lbOTP {
        width: 100%;
        margin: 0 auto;
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #000;
        line-height: 14px;
        letter-spacing: 0.17px;
        text-align: center;
        .phone {
          color: #6c63ff !important;
        }
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
    .otp-link {
      width: 100%;
      margin: 0 auto 320px;
      display: block;
      .otpLink {
        width: 100%;
        margin: 0 auto;
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #617d8c;
        line-height: 14px;
        cursor: default;
        text-align: center;
      }
      .openlink {
        color: #6c63ff;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        letter-spacing: 0;
        background-color: transparent;
      }
      .lbOTP {
        width: 100%;
        margin: 0 auto;
        font-family: 'Anuphan-Regular';
        font-size: 12px;
        color: #000;
        line-height: 15px;
        text-align: center;
      }
    }
    .otp-summit {
      width: 100%;
      margin: 0 auto;
      display: block;
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
        letter-spacing: 0;
      }
    }
  }
}
</style>
<style lang="less">
input.otp-input {
  width: 47px;
  height: 47px;
  padding: 5px;
  margin: 0 6px;
  font-size: 20px;
  border-radius: 6px;
  border: 0.5px solid #2f2e41;
  text-align: center;
  background-color: #fff;
  &.error {
    border: 1px solid red !important;
  }
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
