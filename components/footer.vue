<template>
  <v-row class="d-flex footer-nav" fixed>
    <v-col class="nav-item" :class="{ active: path === 'home' }">
      <v-btn class="btnHome" @click="goNext('/')">
        <img class="logo" src="../assets/images/home.svg" />
      </v-btn>
    </v-col>
    <v-col class="nav-item" :class="{ active: path === 'coverage' }">
      <v-btn class="btnHome" @click="goCoverage('coverage')">
        <img class="logo" src="../assets/images/cover.svg" />
      </v-btn>
    </v-col>
    <v-col class="nav-item" :class="{ active: path === 'claim' }">
      <v-btn class="btnHome" @click="goNext('/claim-status')">
        <img class="logo" src="../assets/images/eclaim.svg" />
      </v-btn>
    </v-col>
    <v-col class="nav-item" :class="{ active: path === 'promotion' }">
      <v-btn class="btnHome" @click="goNext('/promotion')">
        <img class="logo" src="../assets/images/promotion.svg" />
      </v-btn>
    </v-col>
    <v-col class="nav-item" :class="{ active: path === 'article' }">
      <v-btn class="btnHome" @click="goNext('/article')">
        <img class="logo" src="../assets/images/article.svg" />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Footer',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    path: String,
    backPath: String,
  },
  data() {
    return {
      isActivate: false,
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    vm.isActivate = vm.$auth.$storage.getLocalStorage('isActivate')
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
    }),
    ...mapGetters({
      getActivate: 'getActivate',
    }),
    goCoverage() {
      const vm = this
      vm.setPath(vm.backPath)
      if (vm.locale === 'th') {
        if (vm.isActivate) {
          vm.$router.push('/coverages')
        } else {
          vm.$router.push('/search-idcard')
        }
      } else if (vm.locale === 'en') {
        if (vm.isActivate) {
          vm.$router.push('/en/coverages')
        } else {
          vm.$router.push('/en/search-idcard')
        }
      }
    },
    goNext(path) {
      const vm = this
      vm.setPath(vm.backPath)
      if (vm.locale === 'th') {
        vm.$router.push(path)
      } else if (vm.locale === 'en') {
        vm.$router.push('/en' + path)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.footer-nav {
  width: 100% !important;
  height: 60px !important;
  margin: 0 auto;
  background-color: #3ba9fc;
  text-align: center;
  position: fixed;
  bottom: 0;
  z-index: 99;
  .nav-item {
    width: 100%;
    height: fit-content;
    padding: 16px 24px 16px 24px;
    .btnHome {
      width: 100%;
      height: fit-content;
      margin: 0 auto;
      padding: 0;
      border: none;
      background: none;
      .logo {
        max-width: 27px;
        max-height: 27px;
        display: block;
      }
    }
  }
  .active {
    background-color: #369be9;
    .btnHome {
      .logo {
        background-color: #369be9;
      }
    }
  }
}
</style>
<style>
@import url('../assets/css/footer.css');
</style>
