<template>
  <div id="Others">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isLoading" class="other-categories">
      <label v-if="type === 'hospital'" class="lbOtherHeader">{{
        lang.hospitalHeader
      }}</label>
      <label v-if="type === 'promotion'" class="lbOtherHeader">{{
        lang.promotionHeader
      }}</label>
      <label v-if="type === 'article'" class="lbOtherHeader">{{
        lang.articleHeader
      }}</label>
      <div v-if="type === 'hospital'" class="other-badge-categories">
        <span class="badge btnCategories" @click="getAll()">{{
          lang.all
        }}</span>
        <span
          v-for="item in hospitalGroupList"
          :key="item.id"
          class="badge btnCategories"
          :class="{ currentGroup: currentType.id === item.id }"
          @click="getCurrentType(item)"
          >{{ item.name }}</span
        >
      </div>
      <div v-if="type === 'promotion'" class="other-badge-categories">
        <span class="badge btnCategories" @click="getAll()">{{
          lang.all
        }}</span>
        <span
          v-for="item in promotionCategoriesList"
          :key="item.id"
          class="badge btnCategories"
          :class="{ currentGroup: currentType.id === item.id }"
          @click="getCurrentType(item)"
          >{{ item.name }}</span
        >
      </div>
      <div v-if="type === 'article'" class="other-badge-categories">
        <span class="badge btnCategories" @click="getAll()">{{
          lang.all
        }}</span>
        <span
          v-for="item in articleCategoiesList"
          :key="item.id"
          class="badge btnCategories"
          :class="{ currentGroup: currentType.id === item.id }"
          @click="getCurrentType(item)"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <div class="other-footer">
      <Footer
        :path="path"
        :backPath="locale === 'th' ? `/others/${type}` : `/en/others/${type}`"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Footer from '../../components/footer'
import Header from '../../components/header'
export default {
  name: 'Others',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      type: this.$route.params.type,
      promotionCategoriesList: [],
      token: '',
      isloading: true,
      currentType: {},
      hospitalGroupList: [],
      articleCategoiesList: [],
      backPath: '',
      lang: this.$t('otherList'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    vm.$auth.$storage.removeLocalStorage('currentType')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.checkType()
    vm.backPath = vm.getPath()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
    }),
    checkType() {
      const vm = this
      switch (vm.type) {
        case 'hospital':
          vm.getHospitalGroup()
          break
        case 'promotion':
          vm.getPromotionCategories()
          break
        case 'article':
          vm.getArticleCategories()
          break
      }
    },
    async getHospitalGroup() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/hospital-group?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospitalGroupList = res.data
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getPromotionCategories() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/promotions-category?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.promotionCategoriesList = res.data
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async getArticleCategories() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/articles-category?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.articleCategoiesList = res.data
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    getCurrentType(value) {
      const vm = this
      vm.isloading = true
      vm.currentType = value
      vm.$auth.$storage.setLocalStorage('currentType', vm.currentType)
      vm.setPath('/')
      switch (vm.type) {
        case 'hospital':
          if (vm.locale === 'th') {
            vm.$router.push('/search-hospital')
          } else {
            vm.$router.push('/en/search-hospital')
          }
          break
        case 'promotion':
          if (vm.locale === 'th') {
            vm.$router.push('/promotion')
          } else {
            vm.$router.push('/en/promotion')
          }
          break
        case 'article':
          if (vm.locale === 'th') {
            vm.$router.push('/article')
          } else {
            vm.$router.push('/en/article')
          }
          break
      }
    },
  },
}
</script>

<style lang="scss">
#Others {
  width: 100%;
  height: 100%;
  position: relative;
  .other-categories {
    width: 100%;
    height: 100%;
    padding-top: 51px;
    position: relative;
    .lbOtherHeader {
      padding: 20px 26px 0;
      font-family: 'Anuphan-Medium';
      font-size: 16px;
      color: #004899;
      line-height: 20px;
      margin-bottom: 11px;
    }
    .other-badge-categories {
      height: 100%;
      padding: 0 26px 20px;
      .btnCategories {
        display: inline-flex;
        width: auto;
        height: 30px;
        padding: 8px 11px 7px;
        margin: 0 7px 10px 0;
        background-color: #fff;
        border-radius: 6px;
        border: none;
        box-shadow: #00000029 0 0 6px;
        font-family: 'Anuphan-Regular';
        font-size: 12px;
        color: #2f2e41;
        line-height: 15px;
      }
    }
  }
  .other-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: fit-content;
    background-color: #3ba9fe;
  }
}
</style>
<style>
@import url('../../assets/css/others.css');
</style>
