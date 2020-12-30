<template v-click-outside="onClickOutside">
  <div id="ViewCardDetail">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="!isloading" class="view-card">
      <v-row class="view-card-detail">
        <div class="choose-mobile">
          <label class="lbViewCard">{{ lang.phoneHD }}</label>
          <div
            v-for="(mobile, index) in mobileList"
            :key="index"
            class="choose-mobile-button"
          >
            <v-btn
              class="btnChooseMobile"
              :class="{ lastItem: index === mobileList.length - 1 }"
              @click="sendOTP(mobile)"
            >
              {{ mobile.substr(0, 3) + '-xxx-x' + mobile.substr(7, 3) }}
            </v-btn>
          </div>
        </div>
        <div class="contact-line-id">
          <div class="or-line">
            <div class="other-line"></div>
            <label class="lbOr">{{ lang.orHD }}</label>
            <div class="other-line"></div>
          </div>
          <label class="lbAddLine">{{ lang.lineHD }}</label>
          <v-btn class="btnAddLine" href="http://line.me/ti/p/~@tpacare">{{
            lang.btnLine
          }}</v-btn>
        </div>
      </v-row>
    </v-container>
    <Footer :path="path" :backPath="backPath" />
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
import Footer from '../../components/footer'
export default {
  name: 'ViewCardDetail',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      isloading: true,
      backPath: '',
      token: '',
      mobileList: [],
      profile: {},
      isShow: false,
      content: '',
      path: 'view-card-detail',
      isSuccess: false,
      lang: this.$t('viewCardDetail'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('view-card-detail-page')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.profile = vm.$auth.$storage.getLocalStorage('profile')
    vm.backPath = vm.getPath()
    vm.mobileList = vm.getMobileList()
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getMobileList: 'getMobileList',
    }),
    ...mapMutations({
      setRegister: 'setRegister',
      setPath: 'setPath',
    }),
    async sendOTP(phone) {
      const vm = this
      firebase.analytics().logEvent('send-otp-button')
      vm.isloading = true
      try {
        event.preventDefault()
        const data = {
          name: vm.profile.name,
          surname: vm.profile.surname,
          mobile: phone,
          lang: vm.locale,
        }
        await vm.$axios.post('/profile/sendotp', data).then((response) => {
          const res = response.data
          vm.isloading = false
          vm.isShow = true
          if (res.status === 'ok') {
            vm.isSuccess = true
            vm.content = vm.lang.correct
            const params = {
              token: 'ViewCardDetail',
              ref: res.ref_no,
              phone: data.mobile,
              ttl_minute: res.ttl_minute,
            }
            vm.setRegister(params)
          } else {
            vm.isSuccess = false
            vm.content = res.message
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isShow = true
        vm.isloading = false
        vm.isSuccess = false
        vm.content = e.response.data.message
      }
    },
    summitPopup() {
      const vm = this
      vm.setPath(vm.backPath)
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.$router.push('/otp-card')
        } else if (vm.locale === 'en') {
          vm.$router.push('/en/otp-card')
        }
      } else {
        vm.isShow = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#ViewCardDetail {
  height: 100%;
  position: relative;
  .view-card {
    width: 100%;
    height: 100%;
    padding: 69px 28px 70%;
    margin: 0 auto;
    background-color: #f1f8ff;
    .view-card-detail {
      padding: 0;
      margin: 0 auto;
      .choose-mobile {
        width: 100%;
        margin: 0 auto 19px;
        .lbViewCard {
          width: 100%;
          margin: 0 auto;
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #004899;
          line-height: 24px;
          text-align: center;
        }
        .choose-mobile-button {
          margin-top: 23px;
          .btnChooseMobile {
            width: 100%;
            height: 45px;
            padding: 14px 10px 13px;
            margin-bottom: 13px;
            background-color: #3ba9fe;
            border: none;
            border-radius: 6px;
            font-family: 'Anuphan-Medium';
            font-size: 14px;
            color: #fff;
            line-height: 18px;
            text-align: center;
          }
          .lastItem {
            margin-bottom: 0;
          }
        }
      }
      .contact-line-id {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0 auto;
        .or-line {
          width: 100%;
          margin-bottom: 14px;
          padding: 0 10px;
          display: inline-flex;
          .other-line {
            width: 140px;
            height: 0px;
            margin: 9px 0;
            border: 1px solid #3ba9fe;
          }
          .lbOr {
            margin: 0 8px;
            font-family: 'Anuphan-Regular';
            font-size: 14px;
            color: #004899;
            line-height: 24px;
            text-align: center;
          }
        }
        .lbAddLine {
          width: 100%;
          margin: 0 auto;
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #004899;
          line-height: 24px;
          text-align: center;
        }
        .btnAddLine {
          width: 100%;
          height: 45px;
          padding: 14px 10px 13px;
          margin-top: 23px;
          background-color: #3ba9fe;
          border: none;
          border-radius: 6px;
          font-family: 'Anuphan-Medium';
          font-size: 14px;
          color: #fff;
          line-height: 18px;
          text-align: center;
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/view-card-detail.css');
</style>
