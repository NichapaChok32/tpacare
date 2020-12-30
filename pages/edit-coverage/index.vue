<template>
  <div id="EditCoverage">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="!isloading" class="editCoverage-detail">
      <div class="table-detail">
        <v-row class="table-header">
          <v-col class="col-detail-left">
            <label class="lbEditCoverage">{{ lang.editBenefit }}</label>
          </v-col>
          <v-col class="col-detail-right">
            <label class="lbEditCoverage">{{ lang.editCoverage }}</label>
          </v-col>
        </v-row>
        <v-row class="table-list">
          <div v-for="item in coverages" :key="item.cov_index" class="rowlist">
            <v-col class="col-detail-left">
              <label class="lbEditCoverage">{{ item.cov_desc }}</label>
            </v-col>
            <v-col class="col-detail-right">
              <input
                v-model="item.cov_limit"
                placeholder="0"
                type="text"
                pattern="[0-9]*"
                maxlength="10"
                class="txtFee txtRight"
              />
            </v-col>
          </div>
        </v-row>
        <v-row v-if="others.length !== 0" class="other-list">
          <div
            v-for="(item, index) in others"
            :key="item.cov_index"
            class="rowlist"
          >
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
                placeholder="0"
                type="text"
                pattern="[0-9]*"
                maxlength="10"
                class="txtOtherFee"
              />
              <v-btn class="btnClose" @click="deleteOther(index)">
                <img
                  class="icon-close"
                  center
                  src="../../assets/images/cancel.svg"
                  alt="center image"
                />
              </v-btn>
            </v-col>
          </div>
        </v-row>
      </div>
      <div v-if="isAddOther" class="other-detail">
        <v-row v-for="(item, index) in etc" :key="index" class="rowAdd">
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
            <v-btn class="btnClose" @click="deleteEtc(index)">
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
        @click="EditCoverageAll()"
      >
        {{ lang.btnAddCoverageDesc }}
      </v-btn>
    </v-container>
    <Footer :path="path" :backPath="backPath" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
import Footer from '../../components/footer'
export default {
  name: 'EditCoverage',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      lang: this.$t('editCoverage'),
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
      fullCoverages: [],
      etc: [],
    }
  },
  mounted() {
    const vm = this
    if (vm.locale === 'th') {
      vm.path = '/coverages'
    } else if (vm.locale === 'en') {
      vm.path = '/en/coverages'
    }
    vm.fullCoverages = vm.getCoverage()
    vm.setCoverages()
    vm.backPath = vm.getPath()
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getCoverage: 'getCoverage',
    }),
    ...mapMutations({
      setCoverage: 'setCoverage',
    }),
    setCoverages() {
      const vm = this
      for (let i = 0; i < vm.fullCoverages.length; i++) {
        if (parseInt(vm.fullCoverages[i].cov_index) >= 5) {
          vm.others.push(vm.fullCoverages[i])
        } else {
          vm.coverages.push(vm.fullCoverages[i])
        }
      }
    },
    addMore(e) {
      const vm = this
      vm.no = vm.coverages.length + 1
      vm.etc.push({
        cov_index: vm.no,
        cov_desc: '',
        cov_limit: '',
      })
      vm.isAddOther = true
    },
    deleteOther(index) {
      const vm = this
      vm.others.splice(index, 1)
    },
    deleteEtc(index) {
      const vm = this
      vm.etc.splice(index, 1)
    },
    EditCoverageAll() {
      const vm = this
      let cov = []
      cov = vm.coverages
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
          cov.push(obj)
        }
      }
      if (vm.etc.length !== 0) {
        for (let i = 0; i <= vm.etc.length - 1; i++) {
          const obj = {
            cov_index: vm.etc[i].cov_index,
            cov_desc: vm.etc[i].cov_desc,
            cov_limit:
              vm.etc[i].cov_limit !== '' ? parseInt(vm.etc[i].cov_limit) : 0,
          }
          cov.push(obj)
        }
      }
      firebase.analytics().logEvent('edit-benefit-save-button')
      vm.setCoverage(cov)
      vm.$router.push(vm.backPath)
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#EditCoverage {
  height: 100%;
  position: relative;
  .editCoverage-detail {
    height: 100%;
    overflow: auto;
    padding: 69px 28px 220px;
    background-color: #f1f8ff;
    .lbEditCoverage {
      padding-bottom: 8px;
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
          display: inline-flex;
          .lbEditCoverage {
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
          padding-bottom: 0;
          display: inline-flex;
          .lbEditCoverage {
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
      .other-list {
        .rowlist {
          width: 100%;
          margin: 0 auto;
          padding-bottom: 7px;
          display: inline-flex;
          .col-detail-left {
            margin-right: 4.5px;
            text-align: left;
            .txtDetail {
              margin: 0 0 16px;
              padding: 0;
              border: solid 0.5px #2f2e41;
              border-radius: 6px;
              text-align: left;
            }
          }
          .col-detail-right {
            margin-left: 4.5px;
            text-align: right;
            display: inline-flex;
            .txtOtherFee {
              width: 100%;
              max-width: 147px;
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
            .btnClose {
              width: 40px;
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
    }
    .other-detail {
      margin-top: 20px;
      .txtDetail {
        margin: 0 0 16px;
        padding: 0;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
        text-align: left;
      }
      .txtOtherFee {
        width: 100%;
        max-width: 135px;
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
            width: 40px;
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
      .icon {
        padding-right: 17px;
        padding-top: 3px;
      }
    }
    .btnAddAll {
      width: 100%;
      height: 45px;
      margin-top: 100px;
      border-radius: 6px;
      border-color: #3ba9fe;
      background-color: #3ba9fe;
      padding: 10px 90px;
      text-align: center;
      font-family: 'Anuphan-Medium';
      font-size: 18px;
      color: #fffbfb;
      line-height: 24px;
    }
  }
}
</style>
<style>
@import url('../../assets/css/add-coverage.css');
</style>
