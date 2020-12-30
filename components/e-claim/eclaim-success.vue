<template>
  <div id="EClaimSuccess">
    <img src="../../assets/images/send-data.png" class="icon-send" />
    <label class="lbClaimSuccess">{{ lang.successEClaim }}</label>
    <v-btn
      type="submit"
      variant="primary"
      class="btnEClaimSuccess"
      @click="eclaimSuccess()"
    >
      {{ lang.btnAgree }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'EClaimSuccess',
  data() {
    return {
      lang: this.$t('eclaimReport'),
      locale: this.$i18n.locale,
    }
  },
  methods: {
    eclaimSuccess() {
      const vm = this
      if (vm.locale === 'th') {
        vm.$router.push('/coverages/eclaim')
      } else {
        vm.$router.push('/en/coverages/eclaim')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#EClaimSuccess {
  width: 100%;
  height: 100%;
  padding: 76px 28px 70px;
  text-align: center;
  background-color: #fff;
  .icon-send {
    width: 175px;
    height: 79px;
    margin: 0 auto 26px;
  }
  .lbClaimSuccess {
    font-family: 'Anuphan-Medium';
    font-size: 16px;
    color: #3f67b4;
    line-height: 24px;
    word-break: break-word;
  }
  .btnEClaimSuccess {
    width: 100%;
    height: 45px;
    margin-top: 300px;
    padding: 10px 14px;
    background-color: #3ba9fe;
    border-radius: 6px;
    border: none;
    font-family: 'Anuphan-Medium';
    font-size: 18px;
    color: #fff;
    line-height: 24px;
    text-align: center;
  }
}
</style>
