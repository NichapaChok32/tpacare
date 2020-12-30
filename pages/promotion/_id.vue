<template>
  <div id="Promotion">
    <Header :title="lang.title" :backPath="goBack()" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div
      v-if="!isloading && !isShowPictures"
      class="promotion-detail"
      :class="{ promotionNotImage: isNotImage }"
    >
      <div v-if="isNotImage">
        <img class="img-promotion" src="../../assets/images/not-image.jpg" />
      </div>
      <div v-else>
        <b-link v-if="imagesList.length === 1" @click="isShowPictures = true">
          <img class="img-promotion" :src="imagesList[0]" />
        </b-link>
        <v-carousel
          v-if="imagesList.length > 1"
          id="carouselImgPromotion"
          v-model="imgIndex"
          :show-arrows="false"
          delimiter-icon="icon-carousel-circle"
          class="promotion-images"
          height="100%"
        >
          <v-carousel-item
            v-for="(item, index) in imagesList"
            :key="index"
            :aria-sort="index"
          >
            <b-link @click="isShowPictures = true">
              <img class="img-promotion" :src="item" />
            </b-link>
          </v-carousel-item>
        </v-carousel>
      </div>
      <div class="promotion-header-detail">
        <label class="lbPromotionHeader">
          {{ promotion.title }}
        </label>
      </div>
      <div class="promotion-form">
        <label class="lbHeader">{{ lang.promotionAvg }}</label>
        <label class="lbDetail">
          {{ fromDate + ' - ' + toDate }}
        </label>
      </div>
      <div class="promotion-form">
        <label class="lbHeader">{{ lang.promotionFor }}</label>
        <label class="lbDetail">
          {{ promotion.gender }}
        </label>
        <label class="lbDetail">
          {{ promotion.age_range }}
        </label>
      </div>
      <div class="promotion-form">
        <label class="lbHeader">{{ lang.promotionContact }}</label>
        <b-link
          class="lnkWebSite"
          :href="'http://' + hospitalLink"
          target="_blank"
        >
          {{ promotion.hospital }}
        </b-link>
      </div>
    </div>
    <div class="promotion-footer">
      <Footer
        :path="path"
        :backPath="locale === 'th' ? `/promotion/${id}` : `/en/promotion/${id}`"
      />
    </div>
    <div v-if="isShowPictures" class="show-pictures">
      <v-icon
        class="btn-close-icon"
        right
        color="#4F5358"
        @click="isShowPictures = false"
        >fa-times-circle</v-icon
      >
      <div v-if="imagesList.length === 1" class="show-promotion">
        <img
          class="imgPromotion"
          :src="imagesList[0]"
          @click="goToZoom(imagesList[0])"
        />
      </div>
      <div v-if="imagesList.length > 1">
        <v-carousel
          id="carouselImgShowPromotion"
          v-model="imgIndex"
          :show-arrows="false"
          delimiter-icon="icon-carousel-circle"
          class="promotion-images"
          height="100%"
        >
          <v-carousel-item
            v-for="(item, index) in imagesList"
            :key="index"
            :aria-sort="index"
            class="show-promotion-carousel"
          >
            <img class="imgPromotion" :src="item" @click="goToZoom(item)" />
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Footer from '../../components/footer'
import Header from '../../components/header'
export default {
  name: 'Promotion',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      id: this.$route.params.id,
      token: '',
      isloading: true,
      promotion: {},
      path: 'promotion',
      imgIndex: 0,
      isShowPictures: false,
      fromDate: '',
      toDate: '',
      hospitalLink: '',
      lang: this.$t('promotionDetail'),
      locale: this.$i18n.locale,
      imagesList: [],
      isNotImage: false,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('promotion-detail')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.getPromotionsDetail()
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        vm.setPath('/')
        return '/promotion'
      } else {
        vm.setPath('/en')
        return '/en/promotion'
      }
    },
    async getPromotionsDetail() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/promotions/${vm.id}?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.promotion = res.data
              if (
                res.data.pictures !== null &&
                res.data.pictures !== undefined
              ) {
                vm.imagesList = res.data.pictures
              } else {
                vm.isNotImage = true
              }
              const [from, to] = vm.promotion.date.split(' - ')
              const [fromDay, fromMonth, fromYear] = from.split('/')
              moment.locale(vm.locale)
              vm.fromDate = moment(
                new Date(
                  parseInt(fromYear),
                  parseInt(fromMonth) - 1,
                  parseInt(fromDay)
                )
              ).format('DD MMMM YYYY')
              const [toDay, toMonth, toYear] = to.split('/')
              vm.toDate = moment(
                new Date(
                  parseInt(toYear),
                  parseInt(toMonth) - 1,
                  parseInt(toDay)
                )
              ).format('DD MMMM YYYY')
              vm.getHospitalLink()
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getHospitalLink() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/hospital-search?lang=${vm.locale}&keyword=${vm.promotion.hospital}`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              const hospital = res.data[0].code
              vm.$nextTick(() => {
                vm.getLink(hospital)
              })
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getLink(hospital) {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/hospital/${hospital}?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospitalLink = res.data.website
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    goToZoom(value) {
      const vm = this
      vm.$zoom(value)
    },
  },
}
</script>

<style lang="scss">
label {
  margin-bottom: 0 !important;
}
#Promotion {
  width: 100%;
  height: 100%;
  position: relative;
  .show-pictures {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .btn-close-icon {
      font-size: 30px;
      text-align: right;
      margin: 60px 0 0 90%;
    }
    .show-promotion {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25%;
      .imgPromotion {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .show-promotion-carousel {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25% 5%;
      .imgPromotion {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
  }
  .promotion-detail {
    width: 100%;
    height: 100%;
    padding: 51px 0 60px;
    .img-promotion {
      width: 100%;
      height: 100%;
    }
    .promotion-images {
      width: 402px;
      height: fit-content !important;
    }
    .promotion-header-detail {
      width: 100%;
      height: 75px;
      padding: 24px 17px;
      background-color: #f1f8ff;
      .lbPromotionHeader {
        font-family: 'Anuphan-Regular';
        font-size: 20px;
        line-height: 27px;
        color: #004899;
        text-align: left;
      }
    }
    .promotion-form {
      width: 100%;
      height: auto;
      padding: 15px 17px;
      background-color: #fff;
      border-bottom: 0.5px solid #e7ecee;
      .lbHeader {
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        line-height: 20px;
        color: #004899;
        text-align: left;
        display: block;
      }
      .lbDetail {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        line-height: 20px;
        color: #2f2e41;
        text-align: left;
        display: block;
      }
      .lnkWebSite {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        line-height: 20px;
        color: #2f2e41;
        text-align: left;
        display: block;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .promotionNotImage {
    padding: 51px 0 0;
  }
  .promotion-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: fit-content;
    background-color: #3ba9fe;
  }
}
</style>
<style>
@import url('../../assets/css/promotion.css');
@import url('vue-image-zoom/dist/vue-image-zoom.css');
</style>
