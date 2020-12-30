<template>
  <div id="EClaim">
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="eclaim-card">
      <Header :title="lang.title" :backPath="backPath" />
      <div class="eclaim-process">
        <div class="d-flex justify-content-between">
          <div v-for="item in stepper" :key="item.id" class="eclaim-stepper">
            <div
              class="eclaim-badge"
              :class="{
                badgeSelected:
                  stepNo === item.id || item.status || item.passLine,
              }"
            >
              <span class="stepper-no">{{ item.id }}</span>
            </div>
            <label class="stepper-status">{{ item.title }}</label>
            <span
              v-if="item.id !== stepper.length"
              class="horizontal-line gray"
              :class="{
                grayLine: item.id === stepper.length - 1,
                passLine: item.passLine,
              }"
            ></span>
          </div>
        </div>
      </div>
      <div v-if="stepNo === 1" class="first-detail">
        <div class="claim-card">
          <div v-if="insurance.type === 'Self-Insured'" class="claim-row">
            <div class="claim-header">
              <label class="lbClaim">{{ lang.detailHeader.empID }}</label>
            </div>
            <div class="claim-data">
              <label class="lbClaim">{{ insurance.staffNo }}</label>
            </div>
          </div>
          <div v-if="insurance.type !== 'Self-Insured'" class="claim-row">
            <div class="claim-header">
              <label class="lbClaim">{{ lang.detailHeader.polNo }}</label>
            </div>
            <div class="claim-data">
              <label class="lbClaim">{{ insurance.polNo }}</label>
            </div>
          </div>
          <div class="claim-row">
            <div class="claim-header">
              <label class="lbClaim">{{ lang.detailHeader.InsurerName }}</label>
            </div>
            <div class="claim-data">
              <label class="lbClaim">{{
                insurance.firstName + ' ' + insurance.lastName
              }}</label>
            </div>
          </div>
          <div class="claim-row claim-row-last">
            <div class="claim-header">
              <label class="lbClaim">{{ lang.detailHeader.mobile }}</label>
            </div>
            <div class="claim-data">
              <label class="lbClaim">{{ insurance.telNo }}</label>
            </div>
          </div>
        </div>
      </div>
      <div v-if="stepNo === 1" class="eclaim-form">
        <EClaimForm @setSetpper="setSetpper"></EClaimForm>
      </div>
      <div v-if="stepNo === 2" class="eclaim-attach">
        <AttachForm @setSetpper="setSetpper"></AttachForm>
      </div>
      <div v-if="stepNo === 3">
        <ClaimReview @setSetpper="setSetpper"></ClaimReview>
      </div>
      <div v-if="stepNo === 4">
        <EClaimSuccess></EClaimSuccess>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EClaimForm from '../../components/e-claim/claim-form'
import AttachForm from '../../components/e-claim/attach-form'
import ClaimReview from '../../components/e-claim/claim-review'
import EClaimSuccess from '../../components/e-claim/eclaim-success'
import Header from '../../components/header'
export default {
  name: 'EClaim',
  components: {
    EClaimForm,
    AttachForm,
    ClaimReview,
    EClaimSuccess,
    Header,
  },
  data() {
    return {
      lang: this.$t('eclaimReport'),
      locale: this.$i18n.locale,
      isloading: true,
      backPath: '',
      path: '/e-claim',
      token: '',
      stepper: [
        {
          id: 1,
          title: this.$t('eclaimReport').stepper1,
          status: false,
          passLine: false,
        },
        {
          id: 2,
          title: this.$t('eclaimReport').stepper2,
          status: false,
          passLine: false,
        },
        {
          id: 3,
          title: this.$t('eclaimReport').stepper3,
          status: false,
          passLine: false,
        },
        {
          id: 4,
          title: this.$t('eclaimReport').stepper4,
          status: false,
          passLine: false,
        },
      ],
      stepNo: 1,
      insurance: {},
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    vm.insurance = vm.$auth.$storage.getLocalStorage('insurance')
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getInsurance: 'getInsurance',
    }),
    setSetpper(value) {
      const vm = this
      vm.stepNo = value
      if (vm.stepNo > 1) {
        vm.stepper[vm.stepNo - 2].passLine = true
      }
      vm.stepper[vm.stepNo - 1].status = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('../../assets/css/dropzone.css');
label {
  margin-bottom: 0 !important;
}
#EClaim {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .eclaim-card {
    position: relative;
    .eclaim-process {
      width: 100%;
      height: 100%;
      padding: 68px 16px 12px;
      background-color: #f1f8ff;
      .eclaim-stepper {
        width: 100%;
        text-align: center;
        position: relative;
        .eclaim-badge {
          width: 35px;
          height: 35px;
          margin: 0 auto 7px;
          border: 2px solid #eee;
          border-radius: 50px;
          background-color: #fff;
          text-align: center;
          .stepper-no {
            font-family: 'Sarabun-Medium';
            font-size: 14px;
            color: #051d0d;
            line-height: 28px;
          }
        }
        .badgeSelected {
          border: 2px solid #3ba9fe;
        }
        .stepper-status {
          margin: 0 auto;
          font-family: 'Anuphan-Medium';
          font-size: 14px;
          color: #2196f3;
          line-height: 18px;
          text-align: center;
        }
        .horizontal-line {
          position: absolute;
          height: 2px;
          width: 35px;
          top: 18px;
          left: 80%;
        }
        .gray {
          background-color: #eee;
        }
        .grayLine {
          width: 30px;
        }
        .passLine {
          background-color: #3ba9fe;
        }
      }
    }
    .first-detail {
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: #fff;
      .claim-card {
        width: 100%;
        height: 100%;
        .lbClaim {
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #2f2e41;
          line-height: 18px;
          vertical-align: top;
        }
        .claim-row {
          width: 100%;
          height: 40px;
          padding: 10px 28px;
          display: inline-flex;
          border-bottom: 0.5px solid #e7ecee;
          .claim-header {
            width: 50%;
            text-align: left;
          }
          .claim-data {
            width: 50%;
            text-align: right;
          }
        }
        .claim-row-last {
          border-bottom: none;
        }
      }
    }
    .eclaim-form {
      width: 100%;
      height: 100%;
      padding: 19px 28px 39px;
      overflow: auto;
      background-color: #f1f8ff;
    }
    .eclaim-attach {
      width: 100%;
      height: 100%;
      padding: 19px 28px 39px;
      overflow: auto;
      background-color: #fff;
    }
  }
}
</style>
<style>
@import url('../../assets/css/e-claim.css');
</style>
