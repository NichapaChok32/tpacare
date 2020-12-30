<template>
  <div id="ClaimStatus">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="!isloading" class="claimstatus-detail">
      <v-card
        v-for="(item, index) in claimList"
        :key="index"
        class="claim-card"
      >
        <v-row class="claim-row">
          <v-col class="claim-header">
            <label class="lbClaim">{{ lang.startDate }}</label>
          </v-col>
          <v-col class="claim-data">
            <label class="lbClaim">{{ item.VisitDate }}</label>
          </v-col>
        </v-row>
        <v-row class="claim-row">
          <v-col class="claim-header">
            <label class="lbClaim">{{ lang.cardType }}</label>
          </v-col>
          <v-col class="claim-data">
            <label class="lbClaim">{{
              item.CardType !== null ? item.CardType : '-'
            }}</label>
          </v-col>
        </v-row>
        <v-row class="claim-row">
          <v-col class="claim-header">
            <label class="lbClaim">{{ lang.companiesName }}</label>
          </v-col>
          <v-col class="claim-data">
            <label class="lbClaim">{{
              item.InsurerName !== null ? item.InsurerName : '-'
            }}</label>
          </v-col>
        </v-row>
        <v-row class="claim-row">
          <v-col class="claim-header">
            <label class="lbClaim">{{ lang.lastUpdate }}</label>
          </v-col>
          <v-col class="claim-data">
            <label class="lbClaim">{{
              item.StatusDate !== null ? item.StatusDate : '-'
            }}</label>
          </v-col>
        </v-row>
        <v-row class="claim-row status-row" @click="goToDetail(item)">
          <v-col class="claim-header">
            <label class="lbClaimBlue">{{ item.StatusClaim }}</label>
          </v-col>
          <v-col class="claim-data">
            <div class="claim-type">
              <img
                v-if="item.IsEclaim"
                src="../../assets/images/eclaim-icon.svg"
                class="icon"
              />
              <v-btn class="btnDetail">
                <img
                  class="claim-next"
                  center
                  src="../../assets/images/claim-next.svg"
                  alt="center image"
                />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
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
      token: '',
      claimList: [],
      backPath: '',
      path: 'claim',
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.$auth.$storage.removeLocalStorage('claim-status')
    vm.$auth.$storage.removeLocalStorage('currentType')
    vm.backPath = vm.getPath()
    vm.getClaimStatus()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
    }),
    async getClaimStatus() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/claim?lang=${vm.locale}`).then((response) => {
          const res = response.data
          vm.claimList = res.data
          for (let i = 0; i <= vm.claimList.length - 1; i++) {
            const status = vm.claimList[i].ClaimStatus
            for (let j = status.length - 1; j >= 0; j--) {
              if (
                status[j].StatusDate !== '' &&
                (status[j].StatusCondition === 'Done' ||
                  status[j].StatusCondition === 'Completed')
              ) {
                vm.claimList[i].StatusDate = status[j].StatusDate
                vm.claimList[i].StatusClaim = status[j].StatusName
                break
              }
            }
          }
          vm.isloading = false
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    goToDetail(item) {
      const vm = this
      vm.$auth.$storage.setLocalStorage('claim-status', item)
      firebase.analytics().logEvent('claim-detail-buton')
      if (vm.locale === 'th') {
        vm.setPath('/claim-status')
        vm.$router.push(`/claim-status/${item.PolNo}`)
      } else if (vm.locale === 'en') {
        vm.setPath('/en/claim-status')
        vm.$router.push(`/en/claim-status/${item.PolNo}`)
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
    padding: 69px 28px 70px;
    background-color: #f1f8ff;
    .claim-card {
      width: 100%;
      padding: 9px 0;
      margin-bottom: 19px;
      border: none;
      border-radius: 6px;
      box-shadow: #00000029 0 3px 6px;
      background-color: #fff;
      .lbClaim {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #2f2e41;
        line-height: 18px;
      }
      .lbClaimBlue {
        font-family: 'Anuphan-Medium';
        font-size: 14px;
        color: #3ba9fe;
        line-height: 18px;
      }
      .claim-row {
        width: 100%;
        padding: 10px 10px 11px;
        margin: 0 auto;
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
              margin: auto 11px auto 0;
            }
            .btnDetail {
              background: none;
              border: none;
              padding: 0;
              .claim-next {
                width: 22px;
                height: 22px;
              }
            }
          }
        }
      }
      .status-row {
        border-bottom: none;
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/claim-status.css');
</style>
