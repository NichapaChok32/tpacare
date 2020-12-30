<template>
  <div id="ClaimStatus">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div
      v-if="!isloading"
      class="claimstatus-detail"
      :class="{
        lastmargin:
          (claim.IsEClaim && !claim.EnableAddMoreFile) || !claim.IsEClaim,
      }"
    >
      <div class="claim-card">
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.startDate }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ claim.VisitDate }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.cardType }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{
              claim.CardType !== null ? claim.CardType : '-'
            }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.companiesName }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{
              claim.InsurerName !== null ? claim.InsurerName : '-'
            }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.polNo }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ claim.PolNo }}</label>
          </div>
        </div>
      </div>
      <div v-for="(item, index) in statusList" :key="index" class="status-list">
        <div class="status-badge">
          <img
            v-if="item.StatusCondition === 'Completed'"
            class="badge-icon"
            center
            src="../../assets/images/success.svg"
            alt="center image"
          />
          <img
            v-if="item.StatusCondition === 'Done'"
            class="badge-icon"
            center
            src="../../assets/images/pass.svg"
            alt="center image"
          />
          <img
            v-if="item.StatusCondition === 'reject'"
            class="badge-icon"
            center
            src="../../assets/images/worst.svg"
            alt="center image"
          />
          <div v-if="item.StatusCondition === 'None'" class="badge-none"></div>
          <div v-if="index !== statusList.length - 1" class="status-line"></div>
        </div>
        <div class="status-detail">
          <label class="lbStatus">{{ item.StatusName }}</label>
          <label class="lbDate">
            {{ item.StatusDate.replace(' ', ' | ') }}</label
          >
        </div>
      </div>
      <div v-if="claim.EnableAddMoreFile" class="add-more-file">
        <v-btn
          type="submit"
          variant="primary"
          class="btnAddAttach"
          @click="addAttachFile()"
        >
          {{ lang.btnAttach }}
        </v-btn>
      </div>
    </div>
    <div class="claimstatus-footer">
      <Footer :path="path" :backPath="backPath" />
    </div>
  </div>
</template>

<script>
import Dexie from 'dexie'
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
import Footer from '../../components/footer'
export default {
  name: 'ClaimStatus',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      lang: this.$t('claimStatus'),
      locale: this.$i18n.locale,
      isloading: true,
      claim: {},
      id: this.$route.params.id,
      statusList: [],
      path: 'claim',
      backPath: '',
      db: new Dexie('s3'),
    }
  },
  mounted() {
    const vm = this
    vm.backPath = vm.getPath()
    Dexie.delete('s3')
    vm.$auth.$storage.removeLocalStorage('e-claim')
    if (vm.locale === 'th') {
      vm.setPath('/')
    } else if (vm.locale === 'en') {
      vm.setPath('/en')
    }
    vm.setDataClaim()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
    }),
    setDataClaim() {
      const vm = this
      vm.claim = vm.$auth.$storage.getLocalStorage('claim-status')
      vm.statusList = vm.claim.ClaimStatus
      for (let i = vm.statusList.length - 1; i >= 0; i--) {
        if (
          vm.statusList[i].StatusDate !== '' &&
          (vm.statusList[i].StatusCondition === 'Done' ||
            vm.statusList[i].StatusCondition === 'Completed')
        ) {
          vm.claim.StatusNo = vm.statusList[i].StatusNo
          vm.claim.StatusDate = vm.statusList[i].StatusDate
          vm.claim.StatusClaim = vm.statusList[i].StatusName
          break
        }
      }
      vm.isloading = false
    },
    addAttachFile() {
      const vm = this
      const body = {
        policy_no: vm.claim.PolNo,
        claim_no: vm.claim.ClaimNo,
        status_no: vm.claim.StatusNo,
        lang: vm.locale,
        receipt_attachment: [],
        medical_certificate_attachment: [],
        other_attachment: [],
      }
      firebase.analytics().logEvent('add-other-attach-buton')
      vm.$auth.$storage.setLocalStorage('e-claim', body)
      if (vm.locale === 'th') {
        vm.setPath(`/claim-status/${vm.id}`)
        vm.$router.push('/attach-file-other')
      } else if (vm.locale === 'en') {
        vm.setPath(`/en/claim-status/${vm.id}`)
        vm.$router.push('/en/attach-file-other')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#ClaimStatus {
  height: 100%;
  position: relative;
  .claimstatus-detail {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 51px 0 30px;
    background-color: #fff;
    .claim-card {
      width: 100%;
      height: 100%;
      margin-bottom: 26px;
      .lbClaim {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #2f2e41;
        line-height: 18px;
        vertical-align: middle;
      }
      .lbClaimBlue {
        font-family: 'Anuphan-Medium';
        font-size: 14px;
        color: #3ba9fe;
        line-height: 18px;
        vertical-align: middle;
      }
      .claim-row {
        width: 100%;
        padding: 10px 28px 11px;
        display: inline-flex;
        border-bottom: 0.5px solid #e7ecee;
        .claim-header {
          width: 50%;
          text-align: left;
        }
        .claim-data {
          width: 50%;
          text-align: right;
          .claim-type {
            margin-left: auto;
            display: inline-flex;
            .icon {
              width: 15px;
              height: 24px;
              margin-right: 11px;
            }
            .btnDetail {
              background: none;
              border: none;
              padding: 0;
              .claim-next {
                width: 11px;
                height: 11px;
              }
            }
          }
        }
      }
    }
    .status-list {
      width: 100%;
      height: 100%;
      padding: 0 28px;
      display: inline-flex;
      .status-badge {
        margin-right: 17px;
        .badge-icon {
          width: 45px;
          height: 45px;
        }
        .badge-none {
          width: 45px;
          height: 45px;
          border-radius: 50px;
          border: 2px solid #eee;
          background-color: #fff;
        }
        .status-line {
          width: 2px;
          height: 20px;
          margin: 5px 0 5px 22px;
          border-left: 2px solid #eee;
          background-color: #eee;
          display: block;
        }
      }
      .status-detail {
        text-align: left;
        .lbStatus {
          padding-bottom: 4px;
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          color: #2196f3;
          line-height: 20px;
        }
        .lbDate {
          font-family: 'Anuphan-Medium';
          font-size: 10px;
          color: #617d8c;
          line-height: 8px;
          display: block;
        }
      }
    }
    .add-more-file {
      width: 100%;
      margin: 56px auto 34px;
      text-align: center;
      .btnAddAttach {
        width: 304px;
        height: 45px;
        border-radius: 6px;
        border-color: #3ba9fe;
        background-color: #3ba9fe;
        padding: 10px 77px;
        font-family: 'Anuphan-Medium';
        font-size: 18px;
        color: #fffbfb;
        line-height: 24px;
        letter-spacing: 0;
      }
    }
  }
  .lastmargin {
    margin-bottom: 35px;
    padding-bottom: 70px;
  }
  .claimstatus-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: fit-content;
    background-color: #3ba9fe;
  }
}
</style>
<style>
@import url('../../assets/css/claim-status.css');
</style>
