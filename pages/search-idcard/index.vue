<template v-click-outside="onClickOutside">
  <div>
    <div id="SearchIDCard">
      <Header :title="lang.title" :backPath="backPath" />
      <v-progress-circular
        v-if="isloading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <v-form
        v-if="!isloading"
        method="get"
        class="ForgetUser-detail"
        @submit.prevent="validate"
      >
        <v-row class="form-group form-username">
          <label class="lbFrom">{{ lang.header }}</label>
          <input
            v-model="idCard"
            type="text"
            pattern="[0-9]*"
            maxlength="13"
            :rules="[rules.required]"
            class="txtIdForm"
          />
          <label v-if="vUser" class="validate">
            {{ lang.validateIdCard }}
          </label>
        </v-row>
        <v-row class="form-group">
          <v-btn type="submit" variant="primary" class="btnSummit">
            {{ lang.btnSearch }}
          </v-btn>
        </v-row>
      </v-form>
      <Footer :path="path" :backPath="locale === 'th' ? '/' : '/en/'" />
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
                src="../../assets/images/warning.svg"
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Footer from '../../components/footer'
import Header from '../../components/header'
export default {
  name: 'SearchIDCard',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      idCard: '',
      baseUrl: '',
      vUser: false,
      isShow: false,
      isSuccess: false,
      backPath: '',
      token: '',
      path: '/search-idcard',
      goPath: '',
      content: '',
      isloading: true,
      lang: this.$t('searchIdcard'),
      locale: this.$i18n.locale,
      isNotFound: false,
      isSameMobile: false,
      cardList: [],
      rules: {
        required: (value) => !!value || 'Required.',
      },
      profile: '',
      phoneList: [],
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('search-idcard-page')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.profile = vm.$auth.$storage.getLocalStorage('profile')
    vm.backPath = vm.getPath()
    vm.isloading = false
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
      setActivate: 'setActivate',
    }),
    ...mapGetters({
      getToken: 'getToken',
      getPath: 'getPath',
    }),
    clearValidate() {
      const vm = this
      vm.vUser = false
    },
    setValidate() {
      const vm = this
      vm.vUser =
        vm.idCard === '' ||
        vm.idCard.length < 13 ||
        /[A-Za-z-!@#$%&'*+/=?^_`{|}~]/.test(vm.idCard)
    },
    checkValidate() {
      const vm = this
      return (
        vm.idCard === '' ||
        vm.idCard.length < 13 ||
        /[A-Za-z-!@#$%&'*+/=?^_`{|}~]/.test(vm.idCard)
      )
    },
    validate() {
      const vm = this
      firebase.analytics().logEvent('search-button')
      vm.isloading = true
      vm.clearValidate()
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.setValidate()
        vm.isloading = false
      } else {
        vm.checkID()
      }
    },
    async checkID() {
      const vm = this
      try {
        event.preventDefault()
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/policy/list/${vm.idCard}?insured_type=member&lang=${vm.locale}`
          )
          .then((response) => {
            const res = response.data
            vm.isShow = true
            if (res.status === 'ok') {
              vm.isloading = false
              if (res.data.length === 0) {
                vm.isSuccess = false
                vm.isNotFound = true
                vm.content = vm.lang.notFound
              } else if (res.data.length !== 0) {
                vm.cardList = res.data
                vm.getMobileList(vm.profile.mobile)
                if (vm.isSameMobile) {
                  vm.isSuccess = true
                  vm.$auth.$storage.setLocalStorage(
                    'ViewCardAuthenication',
                    true
                  )
                  vm.$auth.$storage.setLocalStorage('isActivate', true)
                  vm.content = vm.lang.correct
                } else {
                  vm.isSuccess = false
                  vm.content = vm.lang.notCorrect
                }
              }
              vm.$auth.$storage.setLocalStorage('idcard', vm.idCard)
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
    getMobileList(phone) {
      const vm = this
      let number = ''
      for (let i = 0; i < vm.cardList.length; i++) {
        if (vm.phoneList.length === 0) {
          vm.phoneList.push(vm.cardList[i].TelNo)
        } else {
          for (let j = 0; j < vm.phoneList.length; j++) {
            number = vm.phoneList[j]
            if (number !== vm.cardList[i].TelNo) {
              vm.phoneList.push(vm.cardList[i].TelNo)
            }
          }
        }
      }
      for (let k = 0; k < vm.phoneList.length; k++) {
        number = vm.phoneList[k]
        if (number === phone) {
          vm.isSameMobile = true
          break
        }
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push('/coverages')
        } else if (vm.locale === 'en') {
          vm.setPath('/en')
          vm.$router.push('/en/coverages')
        }
      } else if (!vm.isSameMobile) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push(`/coverages/${vm.idCard}`)
        } else if (vm.locale === 'en') {
          vm.setPath('/en')
          vm.$router.push(`/en/coverages/${vm.idCard}`)
        }
      } else if (vm.isNotFound) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push('/coverages')
        } else if (vm.locale === 'en') {
          vm.setPath('/en')
          vm.$router.push('/en/coverages')
        }
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isShow = false
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push('/coverages')
        } else if (vm.locale === 'en') {
          vm.setPath('/en')
          vm.$router.push('/en/coverages')
        }
      } else if (!vm.isSameMobile) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push(`/coverages/${vm.idCard}`)
        } else if (vm.locale === 'en') {
          vm.setPath('/en')
          vm.$router.push(`/en/coverages/${vm.idCard}`)
        }
      } else if (vm.isNotFound) {
        if (vm.locale === 'th') {
          vm.setPath('/')
          vm.$router.push('/coverages')
        } else if (vm.locale === 'en') {
          vm.setPath('/en')
          vm.$router.push('/en/coverages')
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#SearchIDCard {
  height: 100%;
  background-color: #f1f8ff;
  position: relative;
  .ForgetUser-detail {
    height: 100%;
    overflow: auto;
    padding: 69px 28px 60px;
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
      .txtIdForm {
        padding: 12px 16px;
        margin-bottom: 0;
        min-height: auto;
        max-height: 45px;
        background-color: #fff;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
        width: 100%;
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
      margin: 0 auto 450px;
    }
    .form-lb {
      margin-top: 20px;
      margin-bottom: 434px;
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
@import url('../../assets/css/search-idcard.css');
</style>
