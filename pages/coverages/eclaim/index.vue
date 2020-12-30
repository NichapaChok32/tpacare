<template>
  <div>
    <div id="Coverage">
      <Header :title="lang.title" :backPath="goBack()" />
      <v-progress-circular
        v-if="isLoading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <v-container v-if="!isLoading" class="Coverage-detail">
        <v-row v-if="insurance.length !== 0" class="coverage-card">
          <v-carousel
            id="carouselCard"
            v-model="cardIndex"
            :show-arrows="false"
            delimiter-icon="icon-carousel-circle"
            width="300"
            height="190"
            :class="{
              notIndicator: insurance.length === 0 || insurance.length > 5,
            }"
            @change="getCurrent"
          >
            <v-carousel-item v-for="item in insurance" :key="item.id">
              <TPACard :card="item" />
            </v-carousel-item>
            <ol v-if="insurance.length > 5" class="carousel-indicators">
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
          <div
            class="div-control"
            :class="{ 'fixed-bottom-row': insurance.length > 33 }"
          >
            <v-row class="card-row">
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
        </v-row>
        <v-progress-circular
          v-if="isLoadingDetail"
          color="primary"
          indeterminate
          class="loading-detail"
        ></v-progress-circular>
        <div
          v-if="Object.keys(currentInsurance).length !== 0 && !isLoadingDetail"
          class="coverage-tab"
          :class="{
            coverageTabNotUse:
              currentInsurance.inapp &&
              currentInsurance.isExpired &&
              !currentInsurance.isEClaimShow,
          }"
        >
          <b-tabs v-if="!isLoadingDetail" id="coverage-tab" no-body>
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
                      <img
                        class="status"
                        src="../../../assets/images/correct.svg"
                      />
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
                      <img
                        class="status"
                        src="../../../assets/images/pending.png"
                      />
                      <label class="lbStatus">
                        {{ item.ClmStatusTxt }}
                      </label>
                    </div>
                    <div
                      v-if="
                        item.ClmStatusTxt === 'ไม่อนุมัติ' ||
                        item.ClmStatusTxt === 'Not Approved'
                      "
                      class="claimStatus"
                    >
                      <img
                        class="status"
                        src="../../../assets/images/worst.svg"
                      />
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
        </div>
        <div v-if="insurance.length === 0" class="coverage-tab">
          <label class="lbNotData">{{ lang.notFoundData }}</label>
        </div>
      </v-container>
      <Footer :path="path" :backPath="locale === 'th' ? '/' : '/en/'" />
    </div>
  </div>
</template>

<script>
import Dexie from 'dexie'
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Footer from '../../../components/footer'
import TPACard from '../../../components/card/tpa-card'
import Header from '../../../components/header'
export default {
  name: 'CoverageEclaim',
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
        { key: 'CovNo', label: this.$t('eclaim').detailHeader.order },
        { key: 'CovDesc', label: this.$t('eclaim').detailHeader.benefit },
        {
          key: 'CovLimit',
          label: this.$t('eclaim').detailHeader.coverage,
        },
        {
          key: 'CovUtilized',
          label: this.$t('eclaim').detailHeader.used,
        },
      ],
      fields_ext: [
        { key: 'CovNo', label: '' },
        { key: 'CovDesc', label: '' },
      ],
      fields_coverage: [
        { key: 'cov_index', label: this.$t('eclaim').detailHeader.order },
        {
          key: 'cov_desc',
          label: this.$t('eclaim').detailHeader.benefit,
        },
        {
          key: 'cov_limit',
          label: this.$t('eclaim').detailHeader.coverage,
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
      path: 'coverage/eclaim',
      currentInsurance: {},
      listOfPolDet: [],
      coverage: [],
      isLoading: true,
      isLoadingDetail: true,
      lang: this.$t('eclaim'),
      locale: this.$i18n.locale,
      cardIndex: 0,
      isActivate: false,
    }
  },
  mounted() {
    const vm = this
    Dexie.delete('s3')
    vm.$auth.$storage.removeLocalStorage('e-claim')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.$auth.$storage.removeLocalStorage('insurance')
    vm.isActivate = vm.$auth.$storage.getLocalStorage('isActivate')
    vm.resetHospital()
    vm.getInsurance()
  },
  methods: {
    ...mapMutations({
      setPosition: 'setPosition',
      setPath: 'setPath',
      resetClaim: 'resetClaim',
      resetSympton: 'resetSympton',
      resetHospital: 'resetHospital',
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
          .get(`/policy/list?is_claim=1&lang=${vm.locale}`)
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
                  ownerType: res.data[i].InsuredType,
                  eclaimInsurerName: res.data[i].EclaimInsurerName,
                  eclaimInsurerNameEN: res.data[i].EclaimInsurerNameEN,
                  isEClaimShow: res.data[i].isEclaimShow,
                  color: res.data[i].color,
                  cardType: res.data[i].CardType,
                }
              }
              vm.currentInsurance = vm.insurance[0]
              vm.isLoading = false
              if (vm.currentInsurance.inapp) {
                vm.getDetailInapp()
              } else {
                vm.getDetail()
              }
            } else if (res.status === 'ok' && res.data.length === 0) {
              vm.insurance = []
              vm.isNotInsurance = true
              vm.isLoading = false
              vm.isLoadingDetail = false
            }
            firebase.analytics().logEvent('coverages')
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isLoading = false
        vm.isLoadingDetail = false
        vm.isNotInsurance = true
      }
    },
    getCoverage(coverage) {
      const cov = []
      for (let i = 0; i < coverage.length; i++) {
        if (coverage[i].CovNo !== 'หมายเหตุ' && coverage[i].CovNo !== '') {
          cov.push(coverage[i])
        }
      }
      return cov
    },
    getExt(coverage) {
      const ext = []
      for (let i = 0; i < coverage.length; i++) {
        if (coverage[i].CovNo === 'หมายเหตุ' || coverage[i].CovNo === '') {
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
    getCurrent(slide) {
      const vm = this
      vm.isLoadingDetail = true
      vm.currentInsurance = vm.insurance[vm.cardIndex]
      if (vm.currentInsurance.inapp) {
        vm.getDetailInapp()
      } else {
        vm.getDetail()
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
        vm.setPath('/coverages/eclaim')
        vm.$router.push('/e-claim')
      } else if (vm.locale === 'en') {
        vm.setPath('/en/coverages/eclaim')
        vm.$router.push('/en/e-claim')
      }
    },
    checkExpiredDate() {
      const vm = this
      let result = false
      const [toDay, toMonth, toYear] = vm.currentInsurance.to.split('/')
      const nextYear = parseInt(toYear) + 1
      const now = new Date()
      const nowDate =
        now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear()
      const [day, month, year] = nowDate.split('/')
      if (toDay === day && toMonth === month && nextYear === year) {
        result = true
      }
      return result
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
    min-height: 600px;
    padding: 51px 0 0;
  }
}
#Coverage {
  height: 100%;
  position: relative;
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
          height: 176px;
        }
      }
      .card-row {
        width: 100%;
        padding: 50px 28px 0;
        margin: 0 auto;
        display: inline-flex;
        .col-left {
          margin-right: 7.5px;
          max-width: 166px;
        }
        .col-right {
          margin-left: 7.5px;
          max-width: 152px;
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
    }
    .fullPadding {
      padding-bottom: 60px;
    }
    .hideButton {
      padding: 30px 0 60px;
    }
    .coverage-tab {
      text-align: center;
      padding: 8px 0 0;
      .lbNotData {
        padding: 40px 30px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #4f5358;
        line-height: 22px;
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
          height: 35px;
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
    .coverageTabNotUse {
      padding: 30px 0 0;
    }
  }
}
</style>
<style>
@import url('../../../assets/css/coverages.css');
</style>
