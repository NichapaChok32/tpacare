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
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '../../components/header'
export default {
  name: 'ConditionSetting',
  components: {
    Header,
  },
  data() {
    return {
      content: '',
      token: '',
      backPath: '',
      isloading: true,
      lang: this.$t('term-condition-setting'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    vm.backPath = vm.getPath()
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.getAgree()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    async getAgree() {
      const vm = this
      try {
        await vm.$axios
          .get(`/agreement/1?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            vm.content = res.data.content
            vm.isloading = false
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
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
  }
}
</style>
<style>
@import url('../../assets/css/condition.css');
</style>
