<template>
  <div id="Article">
    <Header :title="lang.title" :backPath="goBack()" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div
      v-if="!isloading && !isShowPictures"
      class="article-detail"
      :class="{ articleNotImage: isNotImage }"
    >
      <div v-if="isNotImage">
        <b-link @click="isShowPictures = true">
          <img class="img-article" src="../../assets/images/not-image.jpg" />
        </b-link>
      </div>
      <div v-else>
        <b-link v-if="imagesList.length === 1" @click="isShowPictures = true">
          <img class="img-article" :src="imagesList[0]" />
        </b-link>
        <v-carousel
          v-if="imagesList.length > 1"
          id="carouselImgArticle"
          v-model="imgIndex"
          :show-arrows="false"
          delimiter-icon="icon-carousel-circle"
          class="article-images"
          height="100%"
        >
          <v-carousel-item
            v-for="(item, index) in imagesList"
            :key="index"
            :aria-sort="index"
          >
            <b-link @click="isShowPictures = true">
              <img class="img-article" :src="item" />
            </b-link>
          </v-carousel-item>
        </v-carousel>
      </div>
      <div class="article-header-detail">
        <label class="lbArticleHeader">
          {{ article.title }}
        </label>
      </div>
      <div class="article-form">
        <div class="article-paragraph" v-html="article.detail"></div>
      </div>
    </div>
    <div class="article-footer">
      <Footer :path="path" :backPath="backPath" />
    </div>
    <div v-if="isShowPictures" class="show-pictures">
      <v-icon
        class="btn-close-icon"
        right
        color="#4F5358"
        @click="isShowPictures = false"
        >fa-times-circle</v-icon
      >
      <div v-if="imagesList.length === 1" class="show-article">
        <img
          class="imgArticle"
          :src="imagesList[0]"
          @click="goToZoom(imagesList[0])"
        />
      </div>
      <div v-if="imagesList.length > 1">
        <v-carousel
          id="carouselImgShowArticle"
          v-model="imgIndex"
          :show-arrows="false"
          delimiter-icon="icon-carousel-circle"
          class="article-images"
          height="100%"
        >
          <v-carousel-item
            v-for="(item, index) in imagesList"
            :key="index"
            :aria-sort="index"
            class="show-article-carousel"
          >
            <img class="imgArticle" :src="item" @click="goToZoom(item)" />
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Footer from '../../components/footer'
import Header from '../../components/header'
export default {
  name: 'Article',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      id: this.$route.params.id,
      token: '',
      isloading: true,
      article: {},
      path: 'article',
      imgIndex: 0,
      isShowPictures: false,
      fromDate: '',
      toDate: '',
      hospitalLink: '',
      lang: this.$t('articleDetail'),
      locale: this.$i18n.locale,
      imagesList: [],
      backPath: '',
      isNotImage: false,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('articles-detail-page')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    vm.getArticleDetail()
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
    }),
    ...mapGetters({
      getPath: 'getPath',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        vm.setPath('/')
        return '/article'
      } else {
        vm.setPath('/en')
        return '/en/article'
      }
    },
    async getArticleDetail() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/articles/${vm.id}?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.article = res.data
              if (
                res.data.pictures !== null &&
                res.data.pictures !== undefined
              ) {
                vm.imagesList = res.data.pictures
              } else {
                vm.isNotImage = true
              }
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
#Article {
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
    .show-article {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25%;
      .imgArticle {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .show-article-carousel {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25% 5%;
      .imgArticle {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
  }
  .article-detail {
    width: 100%;
    height: 100%;
    padding: 51px 0 0;
    .img-article {
      width: 100%;
      height: 100%;
    }
    .article-images {
      width: 100%;
      height: fit-content !important;
    }
    .article-header-detail {
      width: 100%;
      height: auto;
      padding: 24px 17px;
      background-color: #f1f8ff;
      .lbArticleHeader {
        font-family: 'Anuphan-Regular';
        font-size: 20px;
        line-height: 27px;
        color: #004899;
        text-align: left;
      }
    }
    .article-form {
      position: relative;
      overflow-y: scroll;
      width: 100%;
      padding: 15px 17px 70px;
      margin-bottom: 65px;
      background-color: #fff;
      .article-paragraph {
        font-family: 'Anuphan-Regular';
        p,
        ul,
        h3,
        h4 {
          font-family: 'Anuphan-Regular' !important;
        }
        ul {
          padding-left: 17px;
        }
      }
    }
  }
  .article-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: fit-content;
    background-color: #3ba9fe;
  }
}
</style>
<style>
@import url('../../assets/css/article.css');
@import url('vue-image-zoom/dist/vue-image-zoom.css');
</style>
