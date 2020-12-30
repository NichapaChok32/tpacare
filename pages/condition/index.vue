<template>
  <div id="Condition">
    <Header :title="lang.title" :backPath="backPath" />
    <v-container class="condition-detail">
      <label class="lbDetailHD">{{ lang.header }}</label>
      <v-progress-circular
        v-if="isloading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div v-if="!isloading" class="pDetail" v-html="content"></div>
      <div
        v-if="!isloading && backPath !== '/setting'"
        class="condition-footer"
      >
        <div class="pDetail condition-agree">
          <v-checkbox
            v-model="condition.isAgree"
            class="chkAgree"
            :label="lang.agreement"
          ></v-checkbox>
        </div>
        <div class="condition-summit">
          <v-btn
            :class="{
              disabled: !condition.isAgree,
              btnSummit: condition.isAgree,
            }"
            @click="pushAgree()"
          >
            {{ lang.btnAgree }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'Condition',
  auth: 'guest',
  components: {
    Header,
  },
  data() {
    return {
      isAgree: false,
      content: '',
      privacy: {
        id: 0,
        isForce: false,
        isAgree: false,
      },
      condition: {
        id: 0,
        isForce: false,
        isAgree: false,
      },
      token: '',
      backPath: '',
      isloading: true,
      params: {},
      lang: this.$t('term-condition'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    vm.condition = vm.getCondition()
    vm.privacy = vm.getPrivacy()
    vm.backPath = vm.getPath()
    if (vm.$auth.$storage.getLocalStorage('token') !== '') {
      vm.token = vm.$auth.$storage.getLocalStorage('token')
    } else {
      vm.token = vm.getToken()
    }
    vm.getAgree()
  },
  methods: {
    ...mapGetters({
      getToken: 'getToken',
      getCondition: 'getCondition',
      getPrivacy: 'getPrivacy',
      getPath: 'getPath',
      getRegister: 'getRegister',
    }),
    ...mapMutations({
      setPath: 'setPath',
      setCondition: 'setCondition',
    }),
    async pushAgree() {
      const vm = this
      vm.setPath('/condition')
      if (vm.condition.isAgree) {
        if (vm.token !== null) {
          vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
          await vm.$axios
            .post(`/agreement/consent/${vm.condition.id}`)
            .then((response) => {
              const res = response.data
              if (res.status === 'ok') {
                vm.getStatusPrivacy()
                vm.checkRedirect()
              }
            })
        } else {
          vm.checkRedirect()
        }
      }
    },
    async getStatusPrivacy() {
      const vm = this
      try {
        if (vm.token !== '') {
          vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        }
        await vm.$axios.get('/agreement/check/2').then((response) => {
          const res = response.data
          vm.privacy.isForce = res.force
          if (res.status === 'ok') {
            vm.privacy.isAgree = true
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async getAgree() {
      const vm = this
      try {
        await vm.$axios
          .get(`/agreement/1?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            vm.condition.id = res.data.id
            vm.content = res.data.content
            vm.isloading = false
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    checkRedirect() {
      const vm = this
      firebase.analytics().logEvent('Terms & Conditions agree-buton')
      vm.params = vm.getRegister()
      if (vm.locale === 'th') {
        if (vm.privacy.isForce || !vm.privacy.isAgree) {
          vm.setPath('/condition')
          vm.$router.push('/privacy')
        } else if (vm.privacy.isAgree && vm.condition.isAgree) {
          vm.$router.push('/')
        } else if (vm.params.is_old_user && vm.privacy.isAgree) {
          vm.$router.push('/')
        }
      } else if (vm.locale === 'en') {
        if (vm.privacy.isForce || !vm.privacy.isAgree) {
          vm.setPath('/en/condition')
          vm.$router.push('/en/privacy')
        } else if (vm.privacy.isAgree && vm.condition.isAgree) {
          vm.$router.push('/en')
        } else if (vm.params.is_old_user && vm.privacy.isAgree) {
          vm.$router.push('/en')
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) and (max-width: 359px) {
  #Condition {
    .condition-detail {
      .lbDetailHD {
        font-size: 16px !important;
      }
    }
  }
}
#Condition {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .condition-detail {
    height: 100%;
    position: relative;
    padding: 68px 16px 0;
    background-color: #f1f8ff;
    .lbDetailHD {
      font-family: 'Anuphan-Regular';
      font-size: 18px;
      color: #004899;
      line-height: 24px;
      margin-bottom: 21px !important;
    }
    .pDetail {
      font-family: 'Sarabun-Regular';
      font-size: 14px;
      color: #4f5358;
      line-height: 24px;
    }
    .condition-footer {
      .condition-summit {
        padding: 38px 0 28px;
        .btnSummit {
          width: 100%;
          height: 45px;
          background-color: #3ba9fe;
          border: none;
          border-radius: 6px;
          font-family: 'Anuphan-Medium';
          font-size: 18px;
          color: #fff;
          line-height: 31px;
          letter-spacing: 0px;
          :disabled {
            background-color: #d3d3d3;
          }
        }
        .disabled {
          width: 100%;
          height: 45px;
          background-color: #d3d3d3;
          border: none;
          border-radius: 6px;
          font-family: 'Anuphan-Medium';
          font-size: 18px;
          color: #fff;
          line-height: 31px;
          letter-spacing: 0px;
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/condition.css');
</style>
