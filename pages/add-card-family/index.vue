<template v-click-outside="onClickOutside">
  <div id="AddCard">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isloading"
      method="post"
      class="addcard-detail"
      @submit.prevent="addCoverage"
    >
      <v-row class="addcard-group">
        <label class="lbAddCard">{{ lang.insuranceNameTitle }}*</label>
        <v-text-field
          v-model="card.insurer_name"
          class="txtAddCard"
          :class="{ txtValidate: vInsurerName }"
          single-line
          outlined
          :label="lang.insuranceNameTitle"
          @click="goToInsurer()"
          @change="vInsurerName = false"
        />
        <label v-if="vInsurerName" class="validate">
          {{ lang.validateInsurance }}
        </label>
      </v-row>
      <v-row class="addcard-group">
        <label class="lbAddCard">{{ lang.polNoTitle }}*</label>
        <v-text-field
          v-model="card.policy_no"
          class="txtAddCard"
          :class="{ txtValidate: vCode }"
          single-line
          outlined
          :label="lang.polNoTitle"
          @change="vCode = false"
        />
        <label v-if="vCode" class="validate">
          {{ lang.validatePolNo }}
        </label>
      </v-row>
      <v-row class="addcard-group">
        <label class="lbAddCard">{{ lang.insurerNameTitle }}*</label>
        <v-text-field
          v-model="card.insured_name"
          class="txtAddCard"
          :class="{ txtValidate: vName }"
          single-line
          outlined
          :label="lang.insurerNameTitle"
          @change="vName = false"
        />
        <label v-if="vName" class="validate">
          {{ lang.validateInsurer }}
        </label>
      </v-row>
      <v-row class="addcard-group">
        <label class="lbAddCard">{{ lang.fromTitle }}*</label>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="card.effective_from"
              :label="lang.fromTitle"
              append-icon="icon-calendar"
              readonly
              outlined
              single-line
              class="txtDatePicker"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="card.effective_from"
            :first-day-of-week="1"
            :allowed-dates="allowedDates"
            :max="nowDate"
            class="pickerDateAdd"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
        <label v-if="vFrom" class="validate">
          {{ lang.validateFrom }}
        </label>
      </v-row>
      <v-row class="addcard-group">
        <label class="lbAddCard">{{ lang.toTitle }}*</label>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="card.effective_to"
              :label="lang.toTitle"
              append-icon="icon-calendar"
              readonly
              outlined
              single-line
              class="txtDatePicker"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="card.effective_to"
            :first-day-of-week="1"
            :allowed-dates="minDate"
            :min="card.effective_from"
            class="pickerDateAdd"
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
        <label v-if="vTo" class="validate">{{ lang.validateTo }}</label>
      </v-row>
      <v-row class="addcoverage-group">
        <label class="lbAddCard">{{ lang.coverageDescHeader }}</label>
        <v-row class="coverage-detail">
          <v-col class="text-left">
            <label class="lbAddCard">{{ lang.coverages.benefitHeader }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbAddCard">{{ lang.coverages.coverageHeader }}</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbAddCard">{{ lang.coverages.benefitHeader }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbAddCard">0</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbAddCard">{{
              lang.coverages.roomPriceHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbAddCard">0</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbAddCard">{{
              lang.coverages.surgeryFeeHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbAddCard">0</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbAddCard">{{
              lang.coverages.medicineFeeHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbAddCard">0</label>
          </v-col>
        </v-row>
        <v-row
          v-for="(item, index) in card.coverages"
          :key="index"
          class="coverage-list"
        >
          <v-col class="col-detail-left">
            <label class="lbAddCard">{{ item.cov_desc }}</label>
          </v-col>
          <v-col class="col-detail-right">
            <label class="lbAddCard">{{
              numberWithCommas(item.cov_limit)
            }}</label>
          </v-col>
        </v-row>
        <v-btn
          variant="outline-primary"
          class="btnAddCoverage"
          @click="goAddCoverage()"
        >
          {{ lang.btnAddCoveragesDesc }}
        </v-btn>
      </v-row>
      <v-row class="addcard-group">
        <label class="lbAddCard">{{ lang.cardPicture }}</label>
        <v-row class="addimage-group">
          <v-col class="col-image-left">
            <b-form-file
              id="cardFrontUpload"
              ref="cardFrontUpload"
              type="file"
              accept=".jpg, .png"
              hidden
              @change="onCardFrontChange"
            />
            <v-btn class="btnDropzone" @click="chooseCardFront">
              <img
                v-if="cardFront === ''"
                src="../../assets/images/add-image.png"
                class="icon-add-image"
              />
              <img v-else :src="cardFront" class="dropzone-image" />
            </v-btn>
            <label class="lbDropZone">{{ lang.frontCardPic }}</label>
          </v-col>
          <v-col class="col-image-right">
            <b-form-file
              id="cardBackUpload"
              ref="cardBackUpload"
              type="file"
              accept=".jpg, .png"
              hidden
              @change="onCardBackChange"
            />
            <v-btn class="btnDropzone" @click="chooseCardBack">
              <img
                v-if="cardBack === ''"
                src="../../assets/images/add-image.png"
                class="icon-add-image"
              />
              <img v-else :src="cardBack" class="dropzone-image" />
            </v-btn>
            <label class="lbDropZone">{{ lang.backCardPic }}</label>
          </v-col>
        </v-row>
      </v-row>
      <v-btn type="submit" variant="primary" class="btnAdd">
        {{ lang.btnAddCoverage }}
      </v-btn>
    </v-form>
    <Footer :path="'coverages'" :backPath="backPath" />
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
              {{ lang.agree }}
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
  name: 'AddCardFamily',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      lang: this.$t('addCardFamily'),
      locale: this.$i18n.locale,
      isloading: true,
      backPath: '',
      card: {
        insured_type: 'family',
        insurer_code: '',
        insurer_name: '',
        insured_name: '',
        policy_no: '',
        effective_from: '',
        effective_to: '',
        lang: this.locale,
        card_front: '',
        card_back: '',
        coverages: [],
      },
      vInsurerName: false,
      vCode: false,
      vName: false,
      vFrom: false,
      vTo: false,
      isShow: false,
      content: '',
      isSuccess: false,
      path: '/add-card-family',
      isActivate: false,
      token: '',
      cardFront: '',
      cardBack: '',
      menu: false,
      modal: false,
      menu2: false,
      nowDate: '',
      langBenefit: this.$t('addCoverage'),
      idCard: '',
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.isActivate = vm.$auth.$storage.getLocalStorage('isActivate')
    if (vm.$auth.$storage.getLocalStorage('idcard')) {
      vm.idCard = vm.$auth.$storage.getLocalStorage('idcard')
    }
    if (vm.isActivate) {
      if (vm.locale === 'th') {
        vm.backPath = '/family-coverages'
      } else if (vm.locale === 'en') {
        vm.backPath = '/en/family-coverages'
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (vm.locale === 'th') {
        vm.backPath = `/family-coverages/${vm.idCard}`
      } else if (vm.locale === 'en') {
        vm.backPath = `/en/family-coverages/${vm.idCard}`
      }
    }
    if (vm.getCompanyName() !== {}) {
      vm.card.insurer_name = vm.getCompanyName().name
      vm.card.insurer_code = vm.getCompanyName().code
    }
    if (vm.getCoverage().length !== 0) {
      vm.card.coverages = vm.getCoverage()
    } else {
      vm.addCoverageDetail(1, vm.langBenefit.mediclaFee)
      vm.addCoverageDetail(2, vm.langBenefit.roomPrice)
      vm.addCoverageDetail(3, vm.langBenefit.surgeryFee)
      vm.addCoverageDetail(4, vm.langBenefit.medicineFee)
    }
    const card = vm.getCard()
    if (card !== '') {
      vm.card.policy_no = card.policy_no
      vm.card.insured_name = card.insured_name
      vm.card.effective_from = card.effective_from
      vm.card.effective_to = card.effective_to
    }
    firebase.analytics().logEvent('add-card-family-page')
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getCompanyName: 'getCompanyName',
      getCoverage: 'getCoverage',
      getActivate: 'getActivate',
      getCard: 'getCard',
    }),
    ...mapMutations({
      setCard: 'setCard',
      setPath: 'setPath',
    }),
    chooseCardFront() {
      document.getElementById('cardFrontUpload').click()
    },
    chooseCardBack() {
      document.getElementById('cardBackUpload').click()
    },
    addCoverageDetail(no, desc) {
      const vm = this
      let obj = {
        cov_index: 0,
        cov_desc: '',
        cov_limit: 0,
      }
      switch (desc) {
        case vm.langBenefit.mediclaFee:
          obj = {
            cov_index: no,
            cov_desc: desc,
            cov_limit: 0,
          }
          vm.card.coverages.push(obj)
          break
        case vm.langBenefit.roomPrice:
          obj = {
            cov_index: no,
            cov_desc: desc,
            cov_limit: 0,
          }
          vm.card.coverages.push(obj)
          break
        case vm.langBenefit.surgeryFee:
          obj = {
            cov_index: no,
            cov_desc: desc,
            cov_limit: 0,
          }
          vm.card.coverages.push(obj)
          break
        case vm.langBenefit.medicineFee:
          obj = {
            cov_index: no,
            cov_desc: desc,
            cov_limit: 0,
          }
          vm.card.coverages.push(obj)
          break
      }
    },
    goAddCoverage() {
      const vm = this
      vm.setCard(vm.card)
      firebase.analytics().logEvent('add-card-family-page', {
        action_name: 'add-benefit-button',
      })
      if (vm.getCoverage().length !== 0) {
        if (vm.locale === 'th') {
          vm.setPath('/add-card-family')
          vm.setCoverage(vm.card.coverages)
          vm.$router.push('/edit-coverage-family')
        } else if (vm.locale === 'en') {
          vm.setPath('/en/add-card-family')
          vm.setCoverage(vm.card.coverages)
          vm.$router.push('/en/edit-coverage-family')
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (vm.locale === 'th') {
          vm.setPath('/add-card-family')
          vm.$router.push('/add-coverage-family')
        } else if (vm.locale === 'en') {
          vm.setPath('/en/add-card-family')
          vm.$router.push('/en/add-coverage-family')
        }
      }
    },
    goToInsurer() {
      const vm = this
      firebase.analytics().logEvent('add-card-family-page', {
        action_name: 'add-insurer-button',
      })
      if (vm.locale === 'th') {
        vm.setPath('/add-card-family')
        vm.$router.push('/insurance-list')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/add-card-family')
        vm.$router.push('/en/insurance-list')
      }
    },
    onCardFrontChange(e) {
      const vm = this
      const selectedImage = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      reader.onload = (e) => {
        vm.cardFront = e.target.result
      }
    },
    onCardBackChange(e) {
      const vm = this
      const selectedImage = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      reader.onload = (e) => {
        vm.cardBack = e.target.result
      }
    },
    convertBase64Image(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const test = e.target.result.split(',')[1]
        const str = test.split('...')[0]
        return str
      }
    },
    validate() {
      const vm = this
      return (
        vm.card.insurer_name === '' ||
        vm.card.insurer_name === undefined ||
        vm.card.policy_no === '' ||
        vm.card.policy_no === undefined ||
        vm.card.insured_name === '' ||
        vm.card.insured_name === undefined ||
        vm.card.effective_from === '' ||
        vm.card.effective_from === undefined ||
        vm.card.effective_to === '' ||
        vm.card.effective_to === undefined
      )
    },
    setValidate() {
      const vm = this
      vm.vInsurerName =
        vm.card.insurer_name === '' || vm.card.insurer_name === undefined
      vm.vCode = vm.card.policy_no === '' || vm.card.policy_no === undefined
      vm.vName =
        vm.card.insured_name === '' || vm.card.insured_name === undefined
      vm.vFrom =
        vm.card.effective_from === '' || vm.card.effective_from === undefined
      vm.vTo = vm.card.effective_to === '' || vm.card.effective_to === undefined
    },
    clearValidate() {
      const vm = this
      vm.vInsurerName = false
      vm.vCode = false
      vm.vName = false
      vm.vFrom = false
      vm.vTo = false
    },
    addCoverage() {
      const vm = this
      vm.isloading = true
      vm.clearValidate()
      if (vm.validate()) {
        event.preventDefault()
        vm.setValidate()
        vm.isloading = false
      } else {
        if (vm.cardFront !== '') {
          vm.card.card_front = vm.cardFront.split(',')[1].split('...')[0]
        }
        if (vm.cardBack !== '') {
          vm.card.card_back = vm.cardBack.split(',')[1].split('...')[0]
        }
        vm.pushCard()
      }
    },
    async pushCard() {
      const vm = this
      try {
        event.preventDefault()
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.post('/policy', vm.card).then((response) => {
          const res = response.data
          vm.isShow = true
          if (res.status === 'ok') {
            vm.isSuccess = true
            vm.content = vm.lang.correctAddCoverage
            vm.isloading = false
          }
        })
        firebase.analytics().logEvent('add-card-family-page', {
          action_name: 'add-card-button',
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
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.isActivate) {
          if (vm.locale === 'th') {
            vm.$router.push('/family-coverages')
          } else if (vm.locale === 'en') {
            vm.$router.push('/en/family-coverages')
          }
        } else {
          vm.$router.push(vm.backPath)
        }
      } else {
        vm.show = false
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isShow = false
      if (vm.isSuccess) {
        if (vm.isActivate) {
          if (vm.locale === 'th') {
            vm.$router.push('/family-coverages')
          } else if (vm.locale === 'en') {
            vm.$router.push('/en/family-coverages')
          }
        } else {
          vm.$router.push(vm.getPath())
        }
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    allowedDates(val) {
      const date = new Date().toISOString().substr(0, 10)
      if (
        parseInt(val.split('-')[1], 10) === parseInt(date.split('-')[1], 10)
      ) {
        return (
          parseInt(val.split('-')[2], 10) <= parseInt(date.split('-')[2], 10)
        )
      } else {
        return (
          parseInt(val.split('-')[1], 10) <= parseInt(date.split('-')[1], 10)
        )
      }
    },
    minDate(val) {
      const vm = this
      const effectiveFromDay = parseInt(
        vm.card.effective_from.split('-')[2],
        10
      )
      const effectiveFromMonth = parseInt(
        vm.card.effective_from.split('-')[1],
        10
      )
      const effectiveFromYear = parseInt(
        vm.card.effective_from.split('-')[0],
        10
      )
      if (
        parseInt(val.split('-')[2], 10) - effectiveFromDay <= -1 &&
        parseInt(val.split('-')[1], 10) === effectiveFromMonth &&
        parseInt(val.split('-')[0], 10) === effectiveFromYear
      ) {
        return false
      } else {
        return true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#AddCard {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .addcard-detail {
    height: 100%;
    overflow: auto;
    padding: 69px 28px 90px;
    .addcard-group {
      width: 100%;
      margin: 0 auto;
      display: block;
      padding-bottom: 28px;
      .txtValidate {
        border: 0.5px solid #ff0000 !important;
      }
      .validate {
        margin: 0;
        padding-top: 8px;
        font-family: 'Sarabun-Regular';
        font-size: 10px;
        color: #ff0000;
        line-height: 24px;
      }
      .lbAddCard {
        margin-bottom: 8px !important;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        text-align: left;
        line-height: 24px;
        color: #004899;
      }
      .txtAddCard {
        margin: 0;
        padding: 0;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .txtDatePicker {
        margin: 0;
        padding: 0;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .addimage-group {
        width: 100%;
        padding-top: 17px;
        margin: 0 auto;
        .col-image-left {
          position: relative;
          margin: 0 auto;
        }
        .col-image-right {
          position: relative;
          margin-left: 15px;
        }
        .btnDropzone {
          min-height: 95px;
          width: 100%;
          height: 95px;
          padding: 0;
          border: 1px solid #004899;
          border-radius: 6px;
          background-color: #fff;
          .icon-add-image {
            width: 30px;
            height: 30px;
            margin: 0 auto;
          }
          .dropzone-image {
            width: 100%;
            height: 95px;
            border-radius: 6px;
          }
        }
        .lbDropZone {
          width: 100%;
          margin: 9px auto 0;
          font-family: 'Anuphan-Regular';
          font-size: 12px;
          line-height: 15px;
          color: #4f5358;
          text-align: center;
        }
      }
    }
    .addcoverage-group {
      padding-bottom: 28px;
      margin: 0 auto 28px;
      border-bottom: 0.5px solid #d4c8c8;
      .lbAddCard {
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        text-align: left;
        line-height: 24px;
        color: #004899;
      }
      .coverage-detail {
        width: 100%;
        padding: 1px 0 12px;
        margin: 0 auto 22px;
        border-bottom: 0.5px solid #d4c8c8;
        .col-detail-left {
          text-align: left;
        }
        .col-detail-right {
          margin-left: auto;
          text-align: right;
        }
      }
      .coverage-list {
        width: 100%;
        padding: 0 0 20px;
        margin: 0 auto;
        .col-detail-left {
          text-align: left;
          .lbAddCard {
            padding-bottom: 0;
          }
        }
        .col-detail-right {
          margin-left: auto;
          text-align: right;
          .lbAddCard {
            padding-bottom: 0;
          }
        }
      }
      .btnAddCoverage {
        width: 100%;
        height: 45px;
        padding: 10px 0 11px;
        border: 1px solid #3ba9fe;
        border-radius: 6px;
        background-color: #fff;
        font-family: 'Anuphan-Medium';
        font-size: 16px;
        text-align: center;
        line-height: 24px;
        color: #3ba9fe;
        letter-spacing: 0px;
      }
    }
  }
  .btnAdd {
    width: 100%;
    height: 45px;
    border-radius: 6px;
    border-color: #3ba9fe;
    background-color: #3ba9fe;
    padding: 10px 106px;
    text-align: center;
    font-family: 'Anuphan-Medium';
    font-size: 18px;
    color: #fffbfb;
    line-height: 24px;
    letter-spacing: 0px;
  }
}
</style>
<style>
@import url('../../assets/css/add-card.css');
</style>
