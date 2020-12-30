<template>
  <div id="HospitalList">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="hospital-detail">
      <b-table
        ref="selectableTable"
        class="table-hospital"
        thead-class="thead-hospital"
        tbody-class="tbody-hospital"
        :striped="striped"
        :bordered="bordered"
        :borderless="borderless"
        :outlined="outlined"
        :small="small"
        :hover="hover"
        :dark="dark"
        :fixed="fixed"
        :foot-clone="footClone"
        :no-border-collapse="noCollapse"
        :items="hospitalList"
        :fields="fields"
        :head-variant="headVariant"
        :table-variant="tableVariant"
        selectable
        :select-mode="selectMode"
        @row-selected="onRowSelected"
      ></b-table>
    </div>
    <div class="hospital-footer">
      <label class="lbFooter">{{ lang.Desc }}</label>
      <v-btn
        type="submit"
        variant="primary"
        class="btnSummit"
        :disabled="Object.keys(provider).length === 0"
        @click="Object.keys(provider).length !== 0 ? agree() : ''"
      >
        {{ lang.btnUseCard }}
      </v-btn>
    </div>
    <v-row v-if="isShow && !isloading" justify="center">
      <v-dialog
        v-model="isShow"
        persistent
        max-width="343"
        class="popup-dialog"
      >
        <v-card id="PopUpUseCard">
          <v-card-title class="popup-header">
            <div class="lbHeader" v-html="header"></div>
          </v-card-title>
          <v-card-text class="popup-body">
            <TPACardPopUp :card="insurance" />
            <label v-if="!isUseCard" class="lbBody">
              {{ content }}
              <br />
              {{ provider.name }}
            </label>
            <label v-if="isUseCard" class="lbBody">
              {{ content }}
              <span>
                <span>{{ '(' + minutes }}</span>
                <span>:</span>
                <span>{{ seconds + ')' }}</span>
              </span>
            </label>
          </v-card-text>
          <v-card-actions v-if="!isUseCard">
            <v-btn
              class="btnModal btnCancel"
              variant="outline-primary"
              :class="{ btnEn: locale === 'en' }"
              @click="cancel()"
            >
              {{ langPopUp.btnCancel }}
            </v-btn>
            <v-btn
              class="btnModal btnSummit"
              variant="primary"
              :class="{ btnEn: locale === 'en' }"
              @click="agreeUsed()"
            >
              {{ langPopUp.btnConfirm }}
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-btn
              class="btnModal btnCancel"
              variant="outline-primary"
              :class="{ btnEn: locale === 'en' }"
              @click="cancelCard()"
            >
              {{ langPopUp.btnCancel }}
            </v-btn>
            <v-btn
              class="btnModal btnSummit btnUseCard"
              variant="primary"
              :class="{ btnEn: locale === 'en' }"
              @click="unUsedCard()"
            >
              {{ langPopUp.btnClose }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row v-if="isPopup && !isloading" justify="center">
      <v-dialog
        v-model="isPopup"
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
              v-if="!isSuccess || isNotLocation"
              class="icon-header"
              center
              src="../../assets/images/worst.svg"
              alt="Center image"
            />
          </v-card-title>
          <v-card-text class="popup-body">
            {{ contentAfter }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn class="modal-default-button" @click="summitPopup()">
              <label v-if="!isNotLocation" class="lbBtnPopUp">
                {{ lang.agree }}
              </label>
              <label v-if="isNotLocation" class="lbBtnPopUp">
                {{ lang.close }}
              </label>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row v-if="isCancel && !isloading" justify="center">
      <v-dialog
        v-model="isCancel"
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
            {{ contentAfter }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn class="modal-default-button" @click="checkCancel(false)">
              <label class="lbBtnPopUp">
                {{ lang.cancel }}
              </label>
            </v-btn>
            <v-btn class="modal-default-button" @click="checkCancel(true)">
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
import { mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
import TPACardPopUp from '../../components/card/tpa-card-popup'
export default {
  name: 'HospitalList',
  components: {
    Header,
    TPACardPopUp,
  },
  data() {
    return {
      position: {},
      hospitalList: [],
      backPath: '',
      provider: {},
      fields: [
        {
          key: 'name',
          label: this.$t('hospitalList').hospitalHeader.hospitalName,
        },
        {
          key: 'distance',
          label: this.$t('hospitalList').hospitalHeader.distance,
        },
      ],
      tableVariants: [
        'primary',
        'secondary',
        'info',
        'danger',
        'warning',
        'success',
        'light',
        'dark',
      ],
      striped: false,
      bordered: false,
      borderless: false,
      outlined: false,
      small: false,
      hover: false,
      dark: false,
      fixed: false,
      footClone: false,
      headVariant: null,
      tableVariant: '',
      noCollapse: false,
      selectMode: 'single',
      content: '',
      goPath: '',
      header: '',
      insurance: {},
      isShow: false,
      isPopup: false,
      isSuccess: false,
      currentPath: '/hospital-list',
      token: '',
      contentAfter: '',
      isOpen: false,
      record_id: '',
      isloading: true,
      langPopUp: this.$t('useCardPopup'),
      lang: this.$t('hospitalList'),
      locale: this.$i18n.locale,
      minutes: '--',
      seconds: '--',
      interval: 0,
      time: 300,
      total: 0,
      isUseCard: false,
      isCancel: false,
      isNotLocation: false,
      isGetGPS: false,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('hospital-list-page')
    vm.initPage()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getInsurance: 'getInsurance',
    }),
    initPage() {
      const vm = this
      vm.token = vm.$auth.$storage.getLocalStorage('token')
      vm.backPath = vm.getPath()
      vm.insurance = vm.getInsurance()
      if (
        vm.$auth.$storage.getLocalStorage('position') !== undefined &&
        vm.$auth.$storage.getLocalStorage('position') !== '' &&
        vm.$auth.$storage.getLocalStorage('position') !== null
      ) {
        vm.isNotLocation = false
        vm.position = vm.$auth.$storage.getLocalStorage('position')
        vm.getHospital()
      } else {
        vm.isloading = false
        vm.isPopup = true
        vm.isNotLocation = true
        vm.contentAfter = vm.lang.validateLocation
        setTimeout(vm.getNavigator(), 5000)
        vm.isGetGPS = true
      }
    },
    getNavigator() {
      const vm = this
      if (navigator.geolocation) {
        try {
          vm.$nextTick(() => {
            navigator.geolocation.getCurrentPosition((position) => {
              vm.$nextTick(() => {
                const location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
                vm.$auth.$storage.setLocalStorage('position', location)
              })
            })
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    setPopup() {
      const vm = this
      vm.isloading = false
      vm.isShow = true
      vm.isNotGetLocation = true
      vm.content = vm.lang.validateLocation
    },
    async getHospital() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/hospital?lang=${vm.locale}&latitude=${vm.position.latitude}&longitude=${vm.position.longitude}&is_limit=true`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospitalList = res.data
              for (let i = 0; i < vm.hospitalList.length; i++) {
                if (vm.locale === 'th') {
                  vm.hospitalList[i].distance =
                    vm.hospitalList[i].distance.split(' ')[0] + ' กิโลเมตร'
                }
              }
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    onRowSelected(item, index) {
      const vm = this
      vm.provider = item[0]
      vm.$refs.selectableTable.selectRow(index)
    },
    clearSelected() {
      const vm = this
      vm.provider = ''
      vm.$refs.selectableTable.clearSelected()
    },
    agree() {
      const vm = this
      vm.header = vm.lang.confirmTitle
      vm.content = vm.lang.confirmContent
      vm.isShow = true
    },
    checkPopUp(value, id) {
      const vm = this
      vm.isSuccess = value
      vm.record_id = id
      if (vm.isSuccess) {
        vm.contentAfter = vm.lang.completeUseCard
        vm.isPopup = true
      } else {
        vm.contentAfter = vm.lang.confirmCancelCard
        vm.isCancel = true
      }
    },
    checkCancel(value) {
      const vm = this
      vm.isCancel = false
      vm.isPopup = true
      if (value) {
        vm.isUseCard = false
        vm.contentAfter = vm.lang.completeCancelCard
        vm.isSuccess = true
      } else {
        vm.isPopup = false
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
      }

      vm.total -= 1
    },
    agreeUsed() {
      const vm = this
      firebase.analytics().logEvent('used-card-button')
      vm.useCard()
    },
    cancel() {
      const vm = this
      vm.isShow = false
    },
    cancelCard() {
      const vm = this
      vm.checkPopUp(false, '')
    },
    async useCard() {
      const vm = this
      const data = {
        provider_code: vm.provider.code,
        insurer_code: vm.insurance.code,
        name: vm.insurance.firstName,
        surname: vm.insurance.lastName,
        lang: vm.locale,
      }
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .post(`policy/used/${vm.insurance.polNo}`, data)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok' && res.data !== []) {
              vm.isUseCard = true
              vm.params = res.data
              vm.header = vm.langPopUp.useCardTitle
              vm.content = vm.langPopUp.countdownContent
              vm.total = parseInt(vm.time, 10)
              vm.interval = setInterval(() => {
                vm.tick()
              }, 1000)
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    unUsedCard() {
      const vm = this
      vm.isUseCard = false
      vm.checkPopUp(true, vm.params.record_id)
      firebase.analytics().logEvent('cancel-button')
    },
    checkLocaitonGPS() {
      const vm = this
      if (vm.isGetGPS) {
        if (
          vm.$auth.$storage.getLocalStorage('position') === undefined ||
          vm.$auth.$storage.getLocalStorage('position') === '' ||
          vm.$auth.$storage.getLocalStorage('position') === null
        ) {
          vm.isNotGPS = true
        }
      } else {
        vm.initPage()
      }
    },
    summitPopup() {
      const vm = this
      vm.checkLocaitonGPS()
      if (vm.isSuccess || vm.isNotGPS) {
        vm.$router.push(vm.backPath)
      } else if (!vm.isNotGPS) {
        vm.isPopup = false
        vm.isloading = true
        vm.initPage()
      } else {
        vm.isPopup = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#HospitalList {
  height: 100%;
  position: relative;
  .hospital-detail {
    width: 100%;
    height: 100%;
    margin-bottom: auto;
    padding: 51px 0 0;
    overflow: auto;
  }
  .hospital-footer {
    width: 100%;
    height: 100%;
    padding: 0 28px 34px;
    margin: 0 auto;
    position: fixed;
    top: 75%;
    .lbFooter {
      padding-bottom: 11px;
      font-family: 'Anuphan-Regular';
      font-size: 14px;
      color: #000;
      line-height: 24px;
      text-align: center;
    }
    .btnSummit {
      width: 100%;
      height: 45px;
      padding: 10px 14px;
      background-color: #3ba9fe;
      border-radius: 6px;
      border: none;
      font-family: 'Anuphan-Medium';
      font-size: 18px;
      color: #fff;
      line-height: 24px;
      text-align: center;
    }
    .disabled {
      cursor: not-allowed;
    }
  }
}
.lbHeader {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  font-family: 'Anuphan-Medium';
  font-size: 18px;
  color: #004899;
  line-height: 24px;
  white-space: normal;
}
.lbBody {
  width: 100%;
  margin-top: 20px;
  text-align: center;
  font-family: 'Anuphan-Regular';
  font-size: 14px;
  color: #000;
  line-height: 24px;
}
.btnModal {
  width: 136px;
  height: 45px;
  margin: 0;
  padding: 11px 37px;
  font-family: 'Anuphan-Medium';
  font-size: 16px;
  color: #3ba9fe;
  line-height: 21px;
  text-align: center;
  border-color: #3ba9fe;
  border-radius: 6px;
  text-transform: none;
}
.btnEn {
  padding: 11px 13px;
}
.btnSummit {
  margin-left: 8px;
  color: #fffbfb;
  background-color: #3ba9fe;
}
.btnCancel {
  margin-right: 8px;
  background-color: #fff;
}
.btnUseCard {
  padding: 11px 28px;
}
</style>
<style>
@import url('../../assets/css/hospital-list.css');
</style>
