<template>
  <div id="AddCoverage">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="!isloading" class="addcoverage-detail">
      <div class="table-detail">
        <v-row class="table-header">
          <v-col class="col-detail-left">
            <label class="lbAddCoverage">{{ lang.benefit }}</label>
          </v-col>
          <v-col class="col-detail-right">
            <label class="lbAddCoverage">{{ lang.coverage }}</label>
          </v-col>
        </v-row>
        <div class="table-list">
          <v-row class="rowlist">
            <v-col class="col-detail-left">
              <label class="lbAddCoverage">{{ lang.mediclaFee }}</label>
            </v-col>
            <v-col class="col-detail-right">
              <input
                v-model="medicalFee"
                placeholder="0"
                type="text"
                pattern="[0-9]*"
                maxlength="10"
                class="txtFee txtRight"
                @change="addCoverageDetail(lang.mediclaFee)"
              />
            </v-col>
          </v-row>
          <v-row class="rowlist">
            <v-col class="col-detail-left">
              <label class="lbAddCoverage">{{ lang.roomPrice }}</label>
            </v-col>
            <v-col class="col-detail-right">
              <input
                v-model="roomCost"
                type="text"
                placeholder="0"
                pattern="[0-9]*"
                maxlength="10"
                class="txtFee txtRight"
                @change="addCoverageDetail(lang.roomPrice)"
              />
            </v-col>
          </v-row>
          <v-row class="rowlist">
            <v-col class="col-detail-left">
              <label class="lbAddCoverage">{{ lang.surgeryFee }}</label>
            </v-col>
            <v-col class="col-detail-right">
              <input
                v-model="surgeryCost"
                type="text"
                placeholder="0"
                pattern="[0-9]*"
                maxlength="10"
                class="txtFee txtRight"
                @change="addCoverageDetail(lang.surgeryFee)"
              />
            </v-col>
          </v-row>
          <v-row class="rowlast">
            <v-col class="col-detail-left">
              <label class="lbAddCoverage">{{ lang.medicineFee }}</label>
            </v-col>
            <v-col class="col-detail-right">
              <input
                v-model="medicineCost"
                type="text"
                placeholder="0"
                pattern="[0-9]*"
                maxlength="10"
                class="txtFee txtRight"
                @change="addCoverageDetail(lang.medicineFee)"
              />
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-if="isAddOther" class="other-detail">
        <v-row v-for="(item, index) in others" :key="index" class="rowAdd">
          <v-col class="col-detail-left">
            <v-text-field
              v-model="item.cov_desc"
              type="text"
              class="txtDetail"
            />
          </v-col>
          <v-col class="col-detail-right">
            <input
              v-model="item.cov_limit"
              type="text"
              placeholder="0"
              pattern="[0-9]*"
              maxlength="10"
              class="txtOtherFee"
            />
            <v-btn class="btnClose" @click="close(index)">
              <img
                class="icon-close"
                center
                src="../../assets/images/cancel.svg"
                alt="center image"
              />
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-btn
        type="submit"
        variant="outline-primary"
        class="btnAddMore"
        @click="addMore"
      >
        <img src="../../assets/images/add-coverage.svg" class="icon" />
        {{ lang.btnAddBenefit }}
      </v-btn>
      <v-btn
        type="submit"
        variant="primary"
        class="btnAddAll"
        @click="addCoverageAll()"
      >
        {{ lang.btnAddCoverageDesc }}
      </v-btn>
    </v-container>
    <Footer :path="path" :backPath="backPath" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
import Footer from '../../components/footer'
export default {
  name: 'AddCoverage',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      lang: this.$t('addCoverage'),
      locale: this.$i18n.locale,
      isloading: true,
      coverages: [],
      medicalFee: '',
      roomCost: '',
      surgeryCost: '',
      medicineCost: '',
      isAddOther: false,
      no: 0,
      otherNo: 0,
      others: [],
      backPath: '',
      path: '',
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('add-benefit-page')
    vm.backPath = vm.getPath()
    if (vm.locale === 'th') {
      vm.setPath('/coverages')
    } else if (vm.locale === 'en') {
      vm.setPath('/en/coverages')
    }
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setCoverage: 'setCoverage',
      setPath: 'setPath',
    }),
    addCoverageDetail(desc) {
      const vm = this
      let obj = {
        cov_index: 0,
        cov_desc: '',
        cov_limit: 0,
      }
      switch (desc) {
        case vm.lang.mediclaFee:
          vm.no = vm.no + 1
          obj = {
            cov_index: vm.no,
            cov_desc: desc,
            cov_limit: vm.medicalFee !== '' ? parseInt(vm.medicalFee) : 0,
          }
          vm.coverages.push(obj)
          break
        case vm.lang.roomPrice:
          vm.no = vm.no + 1
          obj = {
            cov_index: vm.no,
            cov_desc: desc,
            cov_limit: vm.roomCost !== '' ? parseInt(vm.roomCost) : 0,
          }
          vm.coverages.push(obj)
          break
        case vm.lang.surgeryFee:
          vm.no = vm.no + 1
          obj = {
            cov_index: vm.no,
            cov_desc: desc,
            cov_limit: vm.surgeryCost !== '' ? parseInt(vm.surgeryCost) : 0,
          }
          vm.coverages.push(obj)
          break
        case vm.lang.medicineFee:
          vm.no = vm.no + 1
          obj = {
            cov_index: vm.no,
            cov_desc: desc,
            cov_limit: vm.medicineCost !== '' ? parseInt(vm.medicineCost) : 0,
          }
          vm.coverages.push(obj)
          break
      }
    },
    addMore(e) {
      const vm = this
      if (vm.no !== 0) {
        vm.otherNo = vm.no + 1
      } else {
        vm.no = vm.no + 1
      }
      vm.others.push({
        cov_index: vm.no !== 0 ? vm.otherNo : vm.no,
        cov_desc: '',
        cov_limit: '',
      })
      vm.isAddOther = true
    },
    close(index) {
      const vm = this
      vm.others.splice(index, 1)
    },
    addCoverageAll() {
      const vm = this
      if (vm.others.length !== 0) {
        for (let i = 0; i <= vm.others.length - 1; i++) {
          const obj = {
            cov_index: vm.others[i].cov_index,
            cov_desc: vm.others[i].cov_desc,
            cov_limit:
              vm.others[i].cov_limit !== ''
                ? parseInt(vm.others[i].cov_limit)
                : 0,
          }
          vm.coverages.push(obj)
        }
      }
      vm.setCoverage(vm.coverages)
      firebase.analytics().logEvent('add-benefit-page', {
        action_name: 'add-benefit-button',
      })
      if (vm.locale === 'th') {
        vm.$router.push('/add-card')
      } else if (vm.locale === 'en') {
        vm.$router.push('/en/add-card')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#AddCoverage {
  height: 100%;
  position: relative;
  .addcoverage-detail {
    height: 100%;
    overflow: auto;
    padding: 69px 28px 220px;
    background-color: #f1f8ff;
    .lbAddCoverage {
      font-family: 'Anuphan-Regular';
      font-size: 16px;
      text-align: left;
      line-height: 24px;
      color: #004899;
    }
    .txtFee {
      width: 100%;
      margin: 0 0 16px;
      padding: 14px 16px 13px;
      height: 47px;
      background-color: #fff;
      border: solid 0.5px #2f2e41;
      border-radius: 6px;
      font-family: 'Anuphan-Regular';
      font-size: 14px;
      line-height: 18px;
    }
    .txtRight {
      text-align: right;
    }
    .table-detail {
      width: 100%;
      padding: 1px 0 4px;
      border-bottom: 0.5px solid #d4c8c8;
      .table-header {
        width: 100%;
        margin: 0 auto;
        padding-bottom: 20px;
        border-bottom: 0.5px solid #d4c8c8;
        .lbEditCoverage {
          padding-bottom: 0;
        }
        .col-detail-left {
          text-align: left;
        }
        .col-detail-right {
          margin-left: auto;
          text-align: right;
        }
      }
      .table-list {
        width: 100%;
        margin: 0 auto;
        padding-top: 22px;
        .rowlist {
          width: 100%;
          margin: 0 auto;
          display: inline-flex;
          .lbAddCoverage {
            padding-bottom: 0;
            line-height: 40px;
          }
          .col-detail-left {
            text-align: left;
          }
          .col-detail-right {
            margin-left: auto;
            text-align: right;
          }
        }
        .rowlast {
          width: 100%;
          margin: 0 auto;
          padding-bottom: 0;
          display: inline-flex;
          .lbAddCoverage {
            padding-bottom: 0;
            line-height: 40px;
          }
          .col-detail-left {
            text-align: left;
          }
          .col-detail-right {
            margin-left: auto;
            text-align: right;
          }
        }
      }
    }
    .other-detail {
      margin-top: 20px;
      .txtDetail {
        margin: 0 0 16px;
        padding: 0;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .txtOtherFee {
        width: 100%;
        max-width: 155px;
        margin: 0 0 16px;
        padding: 14px 16px 13px;
        height: 45px;
        background-color: #fff;
        border: solid 0.5px #2f2e41;
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        line-height: 18px;
        text-align: right;
        border-radius: 6px 0 0 6px;
      }
      .rowAdd {
        width: 100%;
        margin: 0 auto;
        padding-bottom: 7px;
        display: inline-flex;
        .col-detail-left {
          margin-right: 4.5px;
          text-align: left;
        }
        .col-detail-right {
          margin-left: 4.5px;
          text-align: right;
          display: inline-flex;
          .btnClose {
            width: 30px;
            height: 45px;
            border: none;
            border-radius: 0 6px 6px 0;
            background-color: #f44336;
            padding: 9px;
            text-align: center;
          }
        }
      }
    }
    .btnAddMore {
      width: 100%;
      height: 45px;
      margin-top: 13px;
      border: 1px solid #3ba9fe;
      border-radius: 6px;
      background-color: #fff;
      padding: 10px 70px;
      display: inline-flex;
      text-align: center;
      font-family: 'Anuphan-Medium';
      font-size: 16px;
      color: #3ba9fe;
      line-height: 24px;
      letter-spacing: 0px;
      .icon {
        padding-right: 17px;
        padding-top: 3px;
      }
    }
    .btnAddAll {
      width: 100%;
      height: 45px;
      margin-top: 40px;
      border-radius: 6px;
      border-color: #3ba9fe;
      background-color: #3ba9fe;
      padding: 10px 90px;
      text-align: center;
      font-family: 'Anuphan-Medium';
      font-size: 18px;
      color: #fffbfb;
      line-height: 24px;
      letter-spacing: 0px;
    }
  }
}
</style>
<style>
@import url('../../assets/css/add-coverage.css');
</style>
