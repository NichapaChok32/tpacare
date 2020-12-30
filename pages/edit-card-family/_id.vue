<template v-click-outside="onClickOutside">
  <div id="EditCard">
    <Header
      :title="lang.title"
      :backPath="backPath"
      @checkDelete="checkDeleteCard"
    />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isloading"
      method="post"
      class="editcard-detail"
      @submit.prevent="editCoverage"
    >
      <v-row class="editcard-group">
        <label class="lbEditCard">{{ lang.insuranceNameTitle }}*</label>
        <v-text-field
          v-model="card.insurer_name"
          class="txtEditCard"
          :class="{ txtValidate: vInsurerName }"
          @click="goToInsurer()"
          @change="vInsurerName = false"
        />
        <label v-if="vInsurerName" class="validate">
          {{ lang.validateInsurance }}
        </label>
      </v-row>
      <v-row class="editcard-group">
        <label class="lbEditCard">{{ lang.polNoTitle }}*</label>
        <v-text-field
          v-model="card.policy_no"
          class="txtEditCard"
          :class="{ txtValidate: vCode }"
          @change="vCode = false"
        />
        <label v-if="vCode" class="validate">
          {{ lang.validatePolNo }}
        </label>
      </v-row>
      <v-row class="editcard-group">
        <label class="lbEditCard">{{ lang.insurerNameTitle }}*</label>
        <v-text-field
          v-model="card.insured_name"
          class="txtEditCard"
          :class="{ txtValidate: vName }"
          @change="vName = false"
        />
        <label v-if="vName" class="validate">
          {{ lang.validateInsurer }}
        </label>
      </v-row>
      <v-row class="editcard-group">
        <label class="lbEditCard">{{ lang.fromTitle }}*</label>
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
            class="pickerDateEdit"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
        <label v-if="vFrom" class="validate">
          {{ lang.validateFrom }}
        </label>
      </v-row>
      <v-row class="editcard-group">
        <label class="lbEditCard">{{ lang.toTitle }}*</label>
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
            v-if="card.effective_to === ''"
            v-model="card.effective_to"
            :first-day-of-week="1"
            :allowed-dates="minDate"
            :min="card.effective_from"
            class="pickerDateEdit"
            @input="menu2 = false"
          ></v-date-picker>
          <v-date-picker
            v-else
            v-model="card.effective_to"
            :first-day-of-week="1"
            class="pickerDateEdit"
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
        <label v-if="vTo" class="validate">{{ lang.validateTo }}</label>
      </v-row>
      <v-row class="editcoverage-group">
        <label class="lbEditCard">{{ lang.coverageDescHeader }}</label>
        <v-row class="coverage-detail">
          <v-col class="text-left">
            <label class="lbEditCard">{{
              lang.coveragesEN.benefitHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbEditCard">{{
              lang.coveragesEN.coverageHeader
            }}</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbEditCard">{{
              lang.coveragesEN.mediclaFeeHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbEditCard">0</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbEditCard">{{
              lang.coveragesEN.roomPriceHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbEditCard">0</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbEditCard">{{
              lang.coveragesEN.surgeryFeeHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbEditCard">0</label>
          </v-col>
        </v-row>
        <v-row v-if="card.coverages.length === 0" class="coverage-list">
          <v-col class="text-left">
            <label class="lbEditCard">{{
              lang.coveragesEN.medicineFeeHeader
            }}</label>
          </v-col>
          <v-col class="text-right">
            <label class="lbEditCard">0</label>
          </v-col>
        </v-row>
        <v-row
          v-for="(item, index) in card.coverages"
          :key="index"
          class="coverage-list"
        >
          <v-col class="col-detail-left">
            <label class="lbEditCard">{{ item.cov_desc }}</label>
          </v-col>
          <v-col class="col-detail-right">
            <label class="lbEditCard">{{
              numberWithCommas(item.cov_limit)
            }}</label>
          </v-col>
        </v-row>
        <v-btn
          variant="outline-primary"
          class="btnEditCoverage"
          @click="goEditCoverage()"
        >
          {{ lang.btnAddCoveragesDesc }}
        </v-btn>
      </v-row>
      <v-row class="editcard-group">
        <label class="lbEditCard">{{ lang.cardPicture }}</label>
        <v-row class="editimage-group">
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
      <v-btn type="submit" variant="primary" class="btnEdit">
        {{ lang.btnAddCoverage }}
      </v-btn>
    </v-form>
    <Footer :path="'coverages'" :backPath="backPath" />
    <v-row v-if="isPopup" justify="center">
      <v-dialog
        v-model="isPopup"
        persistent
        max-width="319"
        class="popup-dialog"
      >
        <v-card id="PopUpDelete">
          <v-card-title class="popup-header">
            <img
              class="icon-header"
              center
              src="../../assets/images/delete-icon.svg"
              alt="Center image"
            />
          </v-card-title>
          <v-card-text class="popup-body">
            {{ content }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn class="modal-default-button" @click="deleteCard(false)">
              {{ lang.cancel }}
            </v-btn>
            <v-divider vertical></v-divider>
            <v-btn class="modal-default-button" @click="deleteCard(true)">
              {{ lang.delete }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
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
            {{ contentAfter }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn class="modal-default-button" @click="summitPopup()">
              <label class="lbBtnPopUp">
                {{ lang.yes }}
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
  name: 'EditCardFamily',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      lang: this.$t('editCardFamily'),
      locale: this.$i18n.locale,
      id: this.$route.params.id,
      isloading: true,
      backPath: '',
      card: {
        insured_type: 'family',
        insurer_name: '',
        insurer_code: '',
        insured_name: '',
        policy_no: '',
        effective_from: '',
        effective_to: '',
        lang: 'th',
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
      path: '/edit-card-family',
      isActivate: false,
      token: '',
      fromSelected: '',
      toSelected: '',
      companyName: '',
      cardFront: '',
      cardBack: '',
      menu: false,
      modal: false,
      menu2: false,
      isPopup: false,
      contentAfter: '',
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
    vm.getCardDetail()
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
      setCoverage: 'setCoverage',
    }),
    chooseCardFront() {
      document.getElementById('cardFrontUpload').click()
    },
    chooseCardBack() {
      document.getElementById('cardBackUpload').click()
    },
    async getCardDetail() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/policy/detail/${vm.id}?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.card = {
                insured_type: 'family',
                insured_name: res.data.insured_name,
                policy_no: res.data.policy_no,
                lang: res.data.lang,
                card_front: res.data.card_front,
                card_back: res.data.card_back,
                coverages: res.data.coverages,
              }
              const company = vm.getCompanyName()
              if (company !== '') {
                vm.card.insurer_name = company.name
                vm.card.insurer_code = company.code
              } else {
                vm.getCompanies(res.data.insurer_code)
                vm.card.insurer_name =
                  res.data.insurer_name !== ''
                    ? res.data.insurer_name
                    : vm.companyName
                vm.card.insurer_code = res.data.insurer_code
              }
              vm.cardFront = res.data.card_front
              vm.cardBack = res.data.card_back
              const [day, month, year] = res.data.effective_from.split('/')
              vm.card.effective_from = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              )
                .toISOString()
                .substr(0, 10)
              const [d, m, y] = res.data.effective_to.split('/')
              vm.card.effective_to = new Date(
                parseInt(y),
                parseInt(m) - 1,
                parseInt(d)
              )
                .toISOString()
                .substr(0, 10)
              const cov = vm.getCoverage()
              if (cov.length !== 0) {
                vm.card.coverages = cov
              } else {
                vm.card.coverages = res.data.coverages
              }
              vm.isloading = false
              firebase.analytics().logEvent('edit-card-family-page')
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getCompanies(code) {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/companies?lang=${vm.locale}`).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            const obj = res.data.find((e) => e.code === code)
            vm.companyName = obj.name
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    goEditCoverage() {
      const vm = this
      firebase.analytics().logEvent('edit-benefit-family-button')
      if (vm.locale === 'th') {
        vm.setPath(`/edit-card-family/${vm.id}`)
        vm.setCoverage(vm.card.coverages)
        vm.$router.push('/edit-coverage-family')
      } else if (vm.locale === 'en') {
        vm.setPath(`/en/edit-card-family/${vm.id}`)
        vm.setCoverage(vm.card.coverages)
        vm.$router.push('/en/edit-coverage-family')
      }
    },
    goToInsurer() {
      const vm = this
      firebase.analytics().logEvent('edit-insurer-family-button')
      if (vm.locale === 'th') {
        vm.setPath(`/edit-card-family/${vm.id}`)
        vm.$router.push('/insurance-list')
      } else if (vm.locale === 'en') {
        vm.setPath(`/en/edit-card-family/${vm.id}`)
        vm.$router.push('/en/insurance-list')
      }
    },
    onCardFrontChange(e) {
      const vm = this
      const selectedImage = e.target.files[0]
      if (!selectedImage) {
        event.preventDefault()
        alert('No file chosen')
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      reader.onload = (e) => {
        vm.cardFront = e.target.result
      }
    },
    onCardBackChange(e) {
      const vm = this
      const selectedImage = e.target.files[0]
      if (!selectedImage) {
        event.preventDefault()
        alert('No file chosen')
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      reader.onload = (e) => {
        vm.cardBack = e.target.result
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
    editCoverage() {
      const vm = this
      vm.isloading = true
      vm.clearValidate()
      if (vm.validate()) {
        event.preventDefault()
        vm.setValidate()
        vm.isloading = false
      } else {
        vm.putCard()
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
    setData() {
      const vm = this
      let data = {}
      if (
        vm.card.card_front !== vm.cardFront &&
        vm.card.card_back !== vm.cardBack
      ) {
        data = {
          insured_type: 'family',
          insurer_code: vm.card.insurer_code,
          insured_name: vm.card.insured_name,
          policy_no: vm.card.policy_no,
          effective_from: vm.card.effective_from,
          effective_to: vm.card.effective_to,
          lang: vm.locale,
          card_front: vm.cardFront.split(',')[1].split('...')[0],
          card_back: vm.cardBack.split(',')[1].split('...')[0],
          coverages: vm.card.coverages,
        }
      } else if (
        vm.card.card_front === vm.cardFront &&
        vm.card.card_back !== vm.cardBack
      ) {
        data = {
          insured_type: 'family',
          insurer_code: vm.card.insurer_code,
          insured_name: vm.card.insured_name,
          policy_no: vm.card.policy_no,
          effective_from: vm.card.effective_from,
          effective_to: vm.card.effective_to,
          lang: vm.locale,
          card_back: vm.cardBack.split(',')[1].split('...')[0],
          coverages: vm.card.coverages,
        }
      } else if (
        vm.card.card_front !== vm.cardFront &&
        vm.card.card_back === vm.cardBack
      ) {
        data = {
          insured_type: 'family',
          insurer_code: vm.card.insurer_code,
          insured_name: vm.card.insured_name,
          policy_no: vm.card.policy_no,
          effective_from: vm.card.effective_from,
          effective_to: vm.card.effective_to,
          lang: vm.locale,
          card_front: vm.cardFront.split(',')[1].split('...')[0],
          coverages: vm.card.coverages,
        }
      } else if (
        vm.card.card_front === vm.cardFront &&
        vm.card.card_back === vm.cardBack
      ) {
        data = {
          insured_type: 'family',
          insurer_code: vm.card.insurer_code,
          insured_name: vm.card.insured_name,
          policy_no: vm.card.policy_no,
          effective_from: vm.card.effective_from,
          effective_to: vm.card.effective_to,
          lang: vm.locale,
          coverages: vm.card.coverages,
        }
      }
      return data
    },
    async putCard() {
      const vm = this
      const data = vm.setData()
      try {
        event.preventDefault()
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.put(`/policy/${vm.id}`, data).then((response) => {
          const res = response.data
          vm.isloading = false
          vm.isShow = true
          if (res.status === 'ok') {
            vm.isSuccess = true
            vm.contentAfter = vm.lang.correctAddCoverage
          }
        })
        firebase.analytics().logEvent('edit-card-family-button')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        vm.contentAfter = e.response.data.message
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
          vm.$router.push(vm.getPath())
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
    checkDeleteCard(value) {
      const vm = this
      event.preventDefault()
      vm.content = vm.lang.deleteCard
      vm.isPopup = value
    },
    deleteCard(value) {
      const vm = this
      vm.isPopup = false
      vm.isloading = true
      if (value) {
        vm.deletePolicy()
      }
    },
    async deletePolicy() {
      const vm = this
      vm.isPopup = false
      vm.isloading = true
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.delete(`/policy/${vm.id}`).then((response) => {
          const res = response.data
          vm.isShow = true
          if (res.status === 'ok') {
            vm.isSuccess = true
            vm.isloading = false
            vm.contentAfter = vm.lang.deleteSuccess
          } else {
            vm.isloading = false
            vm.contentAfter = vm.lang.deleteError
          }
        })
        firebase.analytics().logEvent('delete-card-family-button')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
        vm.isShow = true
        vm.isSuccess = false
        vm.contentAfter = e.response.data.message
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#EditCard {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .editcard-detail {
    height: 100%;
    overflow: auto;
    padding: 69px 28px 90px;
    .editcard-group {
      width: 100%;
      margin: 0 auto;
      display: block;
      padding-bottom: 28px;
      .lbEditCard {
        padding-bottom: 8px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        text-align: left;
        line-height: 24px;
        color: #004899;
      }
      .txtEditCard {
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
      .edit-time {
        width: 100%;
        .txtEditTime {
          width: 100%;
          height: 45px !important;
          padding: 14px 24px;
          border: 0.5px solid #2f2e41;
          border-radius: 6px;
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          text-align: left;
          line-height: 18px;
          color: #617d8c;
          background-color: #fff;
        }
      }
      .editimage-group {
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
    .editcoverage-group {
      padding-bottom: 28px;
      margin: 0 auto 28px;
      border-bottom: 0.5px solid #d4c8c8;
      .lbEditCard {
        padding-bottom: 8px;
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
          .lbEditCard {
            padding-bottom: 0;
          }
        }
        .col-detail-right {
          margin-left: auto;
          text-align: right;
          .lbEditCard {
            padding-bottom: 0;
          }
        }
      }
      .btnEditCoverage {
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
      }
    }
  }
  .btnEdit {
    width: 100%;
    height: 45px;
    margin-top: -2px;
    border-radius: 6px;
    border-color: #3ba9fe;
    background-color: #3ba9fe;
    padding: 10px 106px;
    text-align: center;
    font-family: 'Anuphan-Medium';
    font-size: 18px;
    color: #fffbfb;
    line-height: 24px;
  }
}
</style>
<style>
@import url('../../assets/css/edit-card.css');
</style>
