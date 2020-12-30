<template>
  <div
    id="Coverage"
    :class="{
      'bg-nodata': isAddCard,
    }"
  >
    <Header
      :title="lang.title"
      :backPath="goBack()"
      :isNotCard="isNotInsurance"
      @goToSearch="goSearchIdCard"
    />
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="!isLoading && !isShowPictures" class="Coverage-detail">
      <v-row
        v-if="!isNotInsurance"
        class="coverage-card"
        :class="{
          fullPadding:
            currentInsurance.inapp ||
            (currentInsurance.isExpired && !currentInsurance.isEClaimShow),
        }"
      >
        <v-carousel
          id="carouselCard"
          v-model="cardIndex"
          :show-arrows="false"
          :class="{
            notIndicator: insurance.length === 0 || insurance.length > 5,
          }"
          delimiter-icon="icon-carousel-circle"
          width="300"
          :height="
            !currentInsurance.inapp
              ? insurance.length < 5
                ? '230'
                : '190'
              : '200'
          "
          @change="getCurrent"
        >
          <v-carousel-item v-for="item in insurance" :key="item.id">
            <TPACard :card="item" />
          </v-carousel-item>
          <v-carousel-item v-if="isShowAdd">
            <v-btn class="btnAddCard" @click="goAddCard">
              <img src="../../assets/images/add-card.svg" class="add-card" />
            </v-btn>
          </v-carousel-item>
          <ol
            v-if="insurance.length > 5"
            class="carousel-indicators"
            :class="{
              hideCarousel: insurance.length === 0 || insurance.length < 5,
            }"
          >
            <li
              data-target="#carousel-example-generic"
              data-slide-to="0"
              :class="{ active: cardIndex === 0 }"
            ></li>
            <li
              data-target="#carousel-example-generic"
              data-slide-to="1"
              :class="{ active: cardIndex === 1 }"
            ></li>
            <li
              data-target="#carousel-example-generic"
              data-slide-to="2"
              :class="{ active: cardIndex === 2 }"
            ></li>
            <li
              data-target="#carousel-example-generic"
              data-slide-to="3"
              :class="{ active: cardIndex === 3 }"
            ></li>
            <li
              data-target="#carousel-example-generic"
              data-slide-to="4"
              :class="{ active: cardIndex >= 4 }"
            ></li>
          </ol>
        </v-carousel>
        <div v-if="!isAddCard" class="div-control">
          <v-row
            v-if="
              !currentInsurance.isExpired &&
              !currentInsurance.inapp &&
              isActivate &&
              currentInsurance.isEClaimShow &&
              currentInsurance.isUseCard
            "
            class="card-row"
            :class="{
              controlPadding: insurance.length === 0 || insurance.length >= 5,
            }"
          >
            <v-col class="col-left">
              <v-btn
                type="submit"
                color="primary"
                class="btnCard"
                :class="{
                  smallNameBtn: locale === 'en',
                }"
                max-width="152"
                @click="useCard()"
              >
                {{ lang.btnUseCard }}
              </v-btn>
            </v-col>
            <v-col class="col-right">
              <v-btn
                type="submit"
                color="primary"
                class="btnCard"
                max-width="152"
                @click="eClaim()"
              >
                {{ lang.btnEClaim }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            v-if="
              isActivate &&
              !currentInsurance.inapp &&
              !currentInsurance.isExpired &&
              !currentInsurance.isEClaimShow &&
              currentInsurance.isUseCard
            "
            class="card-row"
            :class="{
              controlPadding: insurance.length === 0 || insurance.length >= 5,
            }"
          >
            <v-btn
              type="submit"
              color="primary"
              class="btnCard"
              @click="useCard()"
            >
              {{ lang.btnUseCard }}
            </v-btn>
          </v-row>
          <v-row
            v-if="
              isActivate &&
              !currentInsurance.inapp &&
              currentInsurance.isEClaimShow &&
              !currentInsurance.isUseCard
            "
            class="card-row"
            :class="{
              controlPadding: insurance.length === 0 || insurance.length >= 5,
            }"
          >
            <v-btn
              type="submit"
              color="primary"
              class="btnCard"
              @click="eClaim()"
            >
              {{ lang.btnEClaim }}
            </v-btn>
          </v-row>
        </div>
        <div v-if="isAddCard && !isNotInsurance" class="coverage-tab">
          <label class="lbNotData">{{ lang.addCard }}</label>
        </div>
      </v-row>
      <div v-if="isAddCard && isNotInsurance" class="coverage-tab">
        <v-btn class="btnAddCard" @click="goAddCard">
          <img src="../../assets/images/add-card.svg" class="add-card" />
        </v-btn>
        <label class="lbNotData">{{ lang.addCard }}</label>
      </div>
      <v-progress-circular
        v-if="isLoadingDetail"
        color="primary"
        indeterminate
        class="loading-detail"
      ></v-progress-circular>
      <div
        v-if="
          Object.keys(currentInsurance).length !== 0 &&
          !isAddCard &&
          !isLoadingDetail
        "
        class="coverage-tab"
        :class="{
          coverageTabNotUse:
            currentInsurance.inapp &&
            currentInsurance.isExpired &&
            !currentInsurance.isEClaimShow,
        }"
      >
        <div
          v-if="!isActivate && !isAddCard"
          class="text-center detail-notSame"
        >
          <v-btn
            type="submit"
            variant="primary"
            class="btnCard"
            @click="openDetail()"
          >
            {{ lang.btnDetail }}
          </v-btn>
          <label class="lbCoverage">{{ lang.notSameDesc }}</label>
        </div>
        <b-tabs
          v-if="
            isActivate &&
            !currentInsurance.inapp &&
            !isAddCard &&
            !isLoadingDetail
          "
          id="coverage-tab"
          no-body
        >
          <b-tab :title="lang.tabDetail">
            <div v-if="listOfPolDet.length !== 0" class="header-tab-detail">
              <label class="lbCoverage">{{ lang.coverageDesc }}</label>
            </div>
            <v-expansion-panels>
              <v-expansion-panel
                v-for="(item, index) in listOfPolDet"
                :key="index"
                class="table-detail"
              >
                <v-expansion-panel-header
                  class="btnPA"
                  expand-icon="icon-open"
                  disable-icon-rotate
                >
                  <div class="lbBenefit">{{ item.MainBenefit }}</div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <b-table
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
                    :items="getCoverage(item.Coverage)"
                    :fields="fields_list"
                    :head-variant="headVariant"
                    :table-variant="tableVariant"
                    tbody-tr-class="tr-data"
                    thead-tr-class="tr-head"
                    class="table-coverage"
                  ></b-table>
                  <b-table
                    :borderless="true"
                    :items="getExt(item.Coverage)"
                    :fields="fields_ext"
                    thead-class="hidden_header"
                    tbody-tr-class="borderless"
                    class="table-ext"
                  ></b-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <div v-if="listOfPolDet.length === 0" class="no-data">
              <label class="lbNoData">{{
                lang.detailHeader.noDataDetail
              }}</label>
            </div>
          </b-tab>
          <b-tab :title="lang.tabHistoryClaim">
            <div v-for="(item, index) in listOfPolClaim" :key="index">
              <div class="table-claim">
                <div class="claim-left">
                  <label class="lbClaim">{{ item.ClmProvider }}</label>
                  <label class="lbClaim">{{
                    lang.historyHeader.admitedDate + item.ClmVisitDate
                  }}</label>
                  <label v-if="item.ClmPayable !== 0" class="lbClaim">{{
                    lang.historyHeader.amount +
                    item.ClmPayable +
                    lang.historyHeader.bath
                  }}</label>
                  <label v-if="item.ClmPayable === 0" class="lbClaim">{{
                    lang.historyHeader.amount + ' -'
                  }}</label>
                </div>
                <div class="claim-right">
                  <div
                    v-if="
                      item.ClmStatusTxt === 'อนุมัติ' ||
                      item.ClmStatusTxt === 'Approved'
                    "
                    class="claimStatus"
                  >
                    <img class="status" src="../../assets/images/correct.svg" />
                    <label class="lbStatus">
                      {{ item.ClmStatusTxt }}
                    </label>
                  </div>
                  <div
                    v-if="
                      item.ClmStatusTxt === 'อยู่ระหว่างดำเนินการ' ||
                      item.ClmStatusTxt === 'Pending'
                    "
                    class="claimStatus"
                  >
                    <img class="status" src="../../assets/images/pending.png" />
                    <label class="lbStatus">
                      {{ item.ClmStatusTxt }}
                    </label>
                  </div>
                  <div
                    v-if="
                      item.ClmStatusTxt === 'ปฏิเสธ' ||
                      item.ClmStatusTxt === 'Rejected'
                    "
                    class="claimStatus"
                  >
                    <img class="status" src="../../assets/images/worst.svg" />
                    <label class="lbStatus">
                      {{ item.ClmStatusTxt }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="listOfPolClaim.length === 0" class="no-data">
              <label class="lbNoData">{{
                lang.historyHeader.noDataHistory
              }}</label>
            </div>
          </b-tab>
        </b-tabs>
        <div
          v-if="
            isActivate &&
            currentInsurance.inapp &&
            !isAddCard &&
            !isLoadingDetail
          "
          class="table-detail"
        >
          <label class="lbDetail">{{ lang.tabDetail }}</label>
          <b-table
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
            :items="coverage"
            :fields="fields_coverage"
            :head-variant="headVariant"
            :table-variant="tableVariant"
            tbody-tr-class="tbody-unapp"
            class="table-inapp"
          ></b-table>
          <v-container fluid class="p-4 card-container">
            <v-row class="hd-row">
              <label class="lbCardHd">{{ lang.card }}</label>
            </v-row>
            <v-row class="v-card-row">
              <v-col v-if="currentInsurance.card_front !== ''" cols="6">
                <b-link @click="isShowPictures = true">
                  <v-img
                    max-width="152"
                    max-height="95"
                    :src="currentInsurance.card_front"
                  ></v-img>
                </b-link>
                <label class="lbCard">{{ lang.frontCard }}</label>
              </v-col>
              <v-col v-if="currentInsurance.card_back !== ''" cols="6">
                <b-link @click="isShowPictures = true">
                  <v-img
                    max-width="152"
                    max-height="95"
                    :src="currentInsurance.card_back"
                  ></v-img>
                </b-link>
                <label class="lbCard">{{ lang.backCard }}</label>
              </v-col>
              <v-col v-if="currentInsurance.card_front === ''" cols="6">
                <v-img
                  max-width="152"
                  max-height="95"
                  src="../../_nuxt/assets/images/image.png"
                />
                <label class="lbCard">{{ lang.frontCard }}</label>
              </v-col>
              <v-col v-if="currentInsurance.card_back === ''" cols="6">
                <v-img
                  max-width="152"
                  max-height="95"
                  src="../../_nuxt/assets/images/image.png"
                />
                <label class="lbCard">{{ lang.backCard }}</label>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </v-container>
    <Footer :path="path" :backPath="locale === 'th' ? '/' : '/en/'" />
    <div v-if="isShowPictures" class="show-pictures">
      <v-icon
        class="btn-close-icon"
        right
        color="#fff"
        @click="isShowPictures = false"
        >fa-times-circle</v-icon
      >
      <div v-if="imagesList.length > 1">
        <v-carousel
          id="carouselImgShowCard"
          v-model="imgIndex"
          :show-arrows="false"
          delimiter-icon="icon-carousel-circle"
          class="card-images"
          height="100%"
        >
          <v-carousel-item
            v-for="(item, index) in imagesList"
            :key="index"
            :aria-sort="index"
            class="show-card-carousel"
          >
            <img class="imgCard" :src="item" @click="goToZoom(item)" />
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import Dexie from 'dexie'
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Footer from '../../components/footer'
import TPACard from '../../components/card/tpa-card'
import Header from '../../components/header'
export default {
  name: 'CoverageIndex',
  components: {
    Footer,
    TPACard,
    Header,
  },
  data() {
    return {
      isShow: false,
      insurance: [],
      backPath: '',
      fields_list: [
        { key: 'CovNo', label: this.$t('my-coverages').detailHeader.order },
        { key: 'CovDesc', label: this.$t('my-coverages').detailHeader.benefit },
        {
          key: 'CovLimit',
          label: this.$t('my-coverages').detailHeader.coverage,
        },
        {
          key: 'CovUtilized',
          label: this.$t('my-coverages').detailHeader.used,
        },
      ],
      fields_ext: [
        { key: 'CovNo', label: '' },
        { key: 'CovDesc', label: '' },
      ],
      fields_coverage: [
        { key: 'cov_index', label: this.$t('my-coverages').detailHeader.order },
        {
          key: 'cov_desc',
          label: this.$t('my-coverages').detailHeader.benefit,
        },
        {
          key: 'cov_limit',
          label: this.$t('my-coverages').detailHeader.coverage,
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
      listOfPolClaim: [],
      path: 'coverage',
      currentInsurance: {},
      listOfPolDet: [],
      cardIndex: 0,
      coverage: [],
      isActivate: false,
      isLoading: true,
      isLoadingDetail: true,
      isAddCard: false,
      addIndex: 0,
      isShowAdd: false,
      lang: this.$t('my-coverages'),
      locale: this.$i18n.locale,
      isNotInsurance: false,
      isShowPictures: false,
      imagesList: [],
    }
  },
  mounted() {
    const vm = this
    Dexie.delete('s3')
    vm.resetIsAddCard()
    vm.resetCompanyName()
    vm.resetCoverage()
    vm.resetCard()
    vm.$auth.$storage.removeLocalStorage('e-claim')
    vm.$auth.$storage.removeLocalStorage('insurance')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.isActivate = vm.$auth.$storage.getLocalStorage('isActivate')
    vm.getInsurance()
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
      setInsurance: 'setInsurance',
      resetClaim: 'resetClaim',
      resetSympton: 'resetSympton',
      resetHospital: 'resetHospital',
      setIsAddCard: 'setIsAddCard',
      resetIsAddCard: 'resetIsAddCard',
      resetCompanyName: 'resetCompanyName',
      resetCoverage: 'resetCoverage',
      resetCard: 'resetCard',
    }),
    ...mapGetters({
      getPath: 'getPath',
      getActivate: 'getActivate',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        return '/'
      } else if (vm.locale === 'en') {
        return '/en'
      }
    },
    async getInsurance() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/policy/list?insured_type=member&lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok' && res.data.length !== 0) {
              for (let i = 0; i < res.data.length; i++) {
                vm.insurance[i] = {
                  id: i,
                  insurerName: res.data[i].InsurerName,
                  firstName: res.data[i].Name,
                  lastName: res.data[i].Surname,
                  code: res.data[i].InsurerCode,
                  from: res.data[i].EffFrom,
                  to: res.data[i].EffTo,
                  bg: !res.data[i].inapp ? res.data[i].background : '',
                  inapp: res.data[i].inapp,
                  polNo: res.data[i].PolNo,
                  memberNo: !res.data[i].inapp ? res.data[i].MemberCode : '',
                  cardId: res.data[i].inapp ? res.data[i].id : 0,
                  companyName: !res.data[i].inapp
                    ? res.data[i].CompanyName
                    : '',
                  card_front: res.data[i].inapp ? res.data[i].card_front : '',
                  card_back: res.data[i].inapp ? res.data[i].card_back : '',
                  staffNo: res.data[i].StaffNo,
                  type: res.data[i].CardType,
                  telNo: res.data[i].TelNo,
                  isExpired: res.data[i].expired,
                  evenMBAccident: !res.data[i].inapp
                    ? res.data[i].EvenMBAccident.split('|')
                    : [],
                  evenMBIllness: !res.data[i].inapp
                    ? res.data[i].EvenMBIllness.split('|')
                    : [],
                  ownerType: 'member',
                  eclaimInsurerName: res.data[i].EclaimInsurerName,
                  eclaimInsurerNameEN: res.data[i].EclaimInsurerNameEN,
                  color: res.data[i].color,
                  isEClaimShow: !res.data[i].inapp
                    ? res.data[i].isEclaimShow
                    : false,
                  isUseCard: !res.data[i].expired
                    ? vm.checkStartDate(res.data[i].EffFrom)
                    : false,
                }
              }
              vm.addIndex = vm.insurance.length
              vm.currentInsurance = vm.insurance[0]
              vm.isLoading = false
              if (vm.cardIndex === vm.addIndex) {
                vm.isShowAdd = true
                vm.isAddCard = true
              } else if (vm.cardIndex === vm.insurance.length - 1) {
                vm.isShowAdd = true
                vm.isAddCard = false
                vm.currentInsurance = vm.insurance[vm.cardIndex]
                if (vm.currentInsurance.inapp) {
                  vm.imagesList.push(vm.currentInsurance.card_front)
                  vm.imagesList.push(vm.currentInsurance.card_back)
                  vm.getDetailInapp()
                } else {
                  vm.getDetail()
                }
              } else {
                vm.isShowAdd = false
                vm.isAddCard = false
                vm.currentInsurance = vm.insurance[vm.cardIndex]
                if (vm.currentInsurance.inapp) {
                  vm.imagesList.push(vm.currentInsurance.card_front)
                  vm.imagesList.push(vm.currentInsurance.card_back)
                  vm.getDetailInapp()
                } else {
                  vm.getDetail()
                }
              }
            } else if (res.status === 'ok' && res.data.length === 0) {
              vm.insurance = []
              vm.isNotInsurance = true
              vm.isLoading = false
              vm.isLoadingDetail = false
              vm.isShowAdd = true
              vm.isAddCard = true
            }
            firebase.analytics().logEvent('coverages')
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isLoading = false
        vm.isLoadingDetail = false
        vm.isAddCard = true
        vm.isNotInsurance = true
      }
    },
    getCoverage(coverage) {
      const cov = []
      for (let i = 0; i < coverage.length; i++) {
        if (
          coverage[i].CovNo !== 'หมายเหตุ' &&
          coverage[i].CovNo !== 'Remarks' &&
          coverage[i].CovNo !== ''
        ) {
          cov.push(coverage[i])
        }
      }
      return cov
    },
    getExt(coverage) {
      const ext = []
      for (let i = 0; i < coverage.length; i++) {
        if (
          coverage[i].CovNo === 'หมายเหตุ' ||
          coverage[i].CovNo === 'Remarks' ||
          coverage[i].CovNo === ''
        ) {
          const obj = {
            CovNo: coverage[i].CovNo,
            CovDesc: coverage[i].CovDesc,
          }
          ext.push(obj)
        }
      }
      return ext
    },
    async getDetail() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        const memberNo = vm.currentInsurance.memberNo
        const list = memberNo.split('/')
        const no = list[0]
        await vm.$axios
          .get(
            `/policy/detail/${vm.currentInsurance.polNo}/${no}?lang=${vm.locale}`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.listOfPolClaim = res.data.ListOfPolClaim
              vm.listOfPolDet = res.data.ListOfPolDet
              vm.isLoadingDetail = false
            }
          })
        firebase.analytics().logEvent('coverages-detail')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isLoadingDetail = false
      }
    },
    async getDetailInapp() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/policy/detail/${vm.currentInsurance.cardId}?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.coverage = res.data.coverages
              for (let i = 0; i < vm.coverage.length; i++) {
                vm.coverage[i].cov_limit = vm.numberWithCommas(
                  vm.coverage[i].cov_limit
                )
              }
              vm.isLoadingDetail = false
            }
          })
        firebase.analytics().logEvent('coverages-detail')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isLoadingDetail = false
      }
    },
    useCard() {
      const vm = this
      vm.setInsurance(vm.currentInsurance)
      firebase.analytics().logEvent('used-card-button')
      if (vm.locale === 'th') {
        vm.setPath('/coverages')
        vm.$router.push('/hospital-list')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/coverages')
        vm.$router.push('/en/hospital-list')
      }
    },
    getCurrent(slide) {
      const vm = this
      vm.isLoadingDetail = true
      vm.currentInsurance = {}
      if (vm.cardIndex === vm.addIndex) {
        vm.isAddCard = true
        vm.isLoadingDetail = false
      } else if (vm.cardIndex === vm.insurance.length - 1) {
        vm.isShowAdd = true
        vm.isAddCard = false
        vm.currentInsurance = vm.insurance[vm.cardIndex]
        if (vm.currentInsurance.inapp) {
          vm.imagesList.push(vm.currentInsurance.card_front)
          vm.imagesList.push(vm.currentInsurance.card_back)
          vm.getDetailInapp()
        } else {
          vm.getDetail()
        }
      } else {
        vm.isShowAdd = false
        vm.isAddCard = false
        vm.currentInsurance = vm.insurance[vm.cardIndex]
        if (vm.currentInsurance.inapp) {
          vm.imagesList.push(vm.currentInsurance.card_front)
          vm.imagesList.push(vm.currentInsurance.card_back)
          vm.getDetailInapp()
        } else {
          vm.getDetail()
        }
      }
    },
    eClaim() {
      const vm = this
      vm.$auth.$storage.removeLocalStorage('e-claim')
      vm.resetClaim()
      vm.resetSympton()
      vm.resetHospital()
      vm.$auth.$storage.setLocalStorage('insurance', vm.currentInsurance)
      firebase.analytics().logEvent('eclaim-button')
      if (vm.locale === 'th') {
        vm.setPath('/coverages')
        vm.$router.push('/e-claim')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/coverages')
        vm.$router.push('/en/e-claim')
      }
    },
    checkStartDate(from) {
      let resultDay = false
      let resultMonth = false
      let resultYear = false
      const startDay = parseInt(from.split('/')[0])
      const startMonth = parseInt(from.split('/')[1])
      const startYear = parseInt(from.split('/')[2])
      const now = new Date()
      const nowDate =
        now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear()
      const day = parseInt(nowDate.split('/')[0])
      const month = parseInt(nowDate.split('/')[1])
      const year = parseInt(nowDate.split('/')[2])
      if (startYear <= year) {
        resultYear = true
      }
      if (startMonth <= month) {
        resultMonth = true
      }
      if (resultYear && resultMonth) {
        if (startDay === day) {
          resultDay = true
        } else if (startDay <= day) {
          resultDay = true
        } else if (startDay >= day && resultMonth) {
          resultDay = true
        }
      }
      return resultYear && resultMonth && resultDay
    },
    goAddCard() {
      const vm = this
      firebase.analytics().logEvent('add-card-button')
      vm.setIsAddCard(true)
      if (vm.locale === 'th') {
        vm.setPath('/coverages')
        vm.$router.push('/add-card')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/coverages')
        vm.$router.push('/en/add-card')
      }
    },
    goSearchIdCard() {
      const vm = this
      firebase.analytics().logEvent('search-idcard-button')
      if (vm.locale === 'th') {
        vm.setPath('/coverages')
        vm.$router.push('/search-idcard')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/coverages')
        vm.$router.push('/en/search-idcard')
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    goToZoom(value) {
      const vm = this
      vm.$zoom(value)
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#Coverage.bg-nodata {
  background-color: #f1f8ff;
  .Coverage-detail {
    min-height: 800px;
    padding: 51px 0 0;
  }
}
#Coverage {
  width: 100%;
  height: 100%;
  position: relative;
  .show-pictures {
    width: 100%;
    height: 100%;
    background-color: #310606;
    .btn-close-icon {
      font-size: 30px;
      text-align: right;
      margin: 60px 0 0 90%;
    }
    .show-card {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25%;
      .imgCard {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .show-card-carousel {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25% 5% 56%;
      .imgCard {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
  }
  .Coverage-detail {
    height: 100%;
    overflow: auto;
    padding: 51px 0 70px;
    margin: 0 auto;
    .detail-notSame {
      width: 100%;
      padding: 20px 28px;
      .btnCard {
        width: 100%;
        height: 45px;
        padding: 11px 20px;
        border-radius: 6px;
        border: none;
        background-color: #3ba9fe;
        text-align: center;
        font-family: 'Anuphan-Medium';
        font-size: 18px;
        color: #fff;
        line-height: 24px;
      }
      .lbCoverage {
        padding: 20px 0 0;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #4f5358;
        line-height: 22px;
      }
    }
    .coverage-card {
      width: 100%;
      padding: 30px 0;
      margin: 0 auto;
      text-align: center;
      background-color: #f1f8ff;
      #carouselCard {
        width: 100%;
        overflow: visible;
      }
      .div-control {
        width: 100%;
      }
      .fixed-bottom-row {
        padding-top: 100px;
      }
      .btnAddCard {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        border: none;
        background: none;
        text-align: center;
        .add-card {
          height: 200px;
        }
      }
      .card-row {
        width: 100%;
        padding: 5px 28px 0;
        margin: 0 auto;
        display: inline-flex;
        text-align: center;
        .col-left {
          margin-right: 7.5px;
          max-width: 100%;
        }
        .col-right {
          margin-left: 7.5px;
          max-width: 100%;
        }
        .btnCard {
          width: 100%;
          text-transform: none;
          height: 45px;
          padding: 11px 20px;
          border-radius: 6px;
          border: none;
          background-color: #3ba9fe;
          text-align: center;
          font-family: 'Anuphan-Medium';
          font-size: 18px;
          color: #fff;
          line-height: 24px;
        }
        .smallNameBtn {
          font-size: 16px;
          line-height: 20px;
          padding: 7px 10px;
        }
        .fullCard {
          width: 100%;
          margin-right: 0;
          .btnCard {
            width: 100%;
          }
        }
      }
      .controlPadding {
        padding: 50px 28px 0;
      }
    }
    .hideCard {
      display: none;
    }
    .fullPadding {
      padding-bottom: 60px;
    }
    .coverage-tab {
      width: 100%;
      text-align: center;
      padding: 8px 0 0;
      .lbNotData {
        padding: 40px 30px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #4f5358;
        line-height: 22px;
        text-align: center;
      }
      .no-data {
        padding-top: 30px;
        .lbNoData {
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #4f5358;
          line-height: 20px;
        }
      }
      .header-tab-detail {
        padding: 14px 0;
        .lbCoverage {
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #2c2f33;
          line-height: 18px;
        }
      }
      .table-detail {
        width: 100%;
        text-align: center;
        background-color: #fff;
        .lbDetail {
          padding: 8px 0 13px;
          font-family: 'Anuphan-Medium';
          font-size: 16px;
          color: #004899;
          line-height: 20px;
        }
        .card-container {
          padding: 17px 16px !important;
          .v-card-row {
            width: 100%;
            margin: 0 auto;
          }
          .hd-row {
            padding: 0 16px;
          }
          .lbCardHd {
            padding-bottom: 17px;
            text-align: left;
            font-family: 'Anuphan-Medium';
            font-size: 14px;
            color: #004899;
            line-height: 24px;
          }
          .lbCard {
            padding: 9px 0 0;
            text-align: center;
            font-family: 'Anuphan-Regular';
            font-size: 12px;
            color: #4f5358;
            line-height: 15px;
          }
        }
        .btnPA {
          width: 100%;
          height: auto;
          min-height: 35px;
          padding: 9px 23px;
          font-family: 'Anuphan-Medium';
          font-size: 14px;
          color: #004899;
          line-height: 18px;
          background-color: #c7dcec;
          border: none;
          border-radius: 0;
          display: inline-flex;
          .lbBenefit {
            width: 95%;
            margin: 0 auto;
            text-align: center;
          }
          .icon-benefit {
            width: 5%;
            text-align: right;
            margin-left: auto;
            margin-top: -1px;
          }
        }
        .table-tpa {
          .lbDetail {
            padding: 5px 16px 10px;
            text-align: left;
          }
        }
      }
    }
    .slideUp {
      top: -150px;
    }
    .coverageTabNotUse {
      padding: 30px 0 0;
    }
  }
}
</style>
<style>
@import url('../../assets/css/coverages.css');
@import url('vue-image-zoom/dist/vue-image-zoom.css');
</style>
