<template>
  <div id="Article">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="article-container">
      <div class="article-search">
        <v-text-field
          v-model="search"
          :label="lang.searchPlaceholder"
          type="search"
          class="txtSearch"
          append-icon="mdi-magnify"
          solo
          @click:append="getSearch()"
        ></v-text-field>
        <div class="article-categories">
          <span
            class="badge btnAll"
            :class="{ currentGroup: Object.keys(currentType).length === 0 }"
            @click="getAll()"
            >{{ lang.categoriesGroups.all }}</span
          >
          <span
            v-for="item in categoriesLst"
            :key="item.id"
            class="badge btnCategories"
            :class="{ currentGroup: currentType.id === item.id }"
            @click="getCurrentType(item)"
            >{{ item.name }}</span
          >
          <span class="badge btnOthers" @click="getOtherCategories(99)">{{
            lang.categoriesGroups.other
          }}</span>
        </div>
      </div>
      <div
        v-if="search === '' && articleList.length === 0"
        class="article-no-data"
      >
        <div v-if="Object.keys(currentType).length !== 0">
          <label class="lbNoDataType">
            {{ lang.notFoundDataType + '"' + currentType.name + '"' }}
          </label>
        </div>
      </div>
      <div
        v-if="search !== '' && articleList.length === 0"
        class="article-no-data"
      >
        <label class="lbNoDataType">
          {{ lang.notFoundDataSearch + '"' + search + '"' }}
        </label>
      </div>
      <div
        v-if="search !== '' && articleList.length !== 0"
        class="article-no-data"
      >
        <label class="lbNoDataType">
          {{ lang.foundDataSearch + '"' + search + '"' }}
        </label>
      </div>
      <div
        v-if="articleList.length !== 0"
        class="article-list"
        :class="{
          maxHeight: articleList.length <= 3 && articleList.length !== 0,
          notTop: search !== '' && articleList.length !== 0,
        }"
      >
        <div v-for="(item, i) in articleList" :key="i">
          <v-card class="article-card" @click="goToDetail(item.id)">
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-avatar class="ma-3 article-avatar" size="115" tile>
                <v-img class="article-img" :src="item.picture"></v-img>
              </v-avatar>
              <div class="article-card-detail">
                <label class="headline">{{ item.title }}</label>
                <div class="article-action">
                  <div class="article-subtitle">
                    <v-card-subtitle
                      class="subline"
                      v-text="item.hospital"
                    ></v-card-subtitle>
                    <v-card-subtitle
                      class="subline"
                      v-text="item.date"
                    ></v-card-subtitle>
                  </div>
                  <div class="article-click">
                    <btn class="btnDetail">
                      <img src="../../assets/images/promotion-detail.png" />
                    </btn>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </div>
    <Footer :path="path" :backPath="backPath" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
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
      categoriesLst: [],
      token: '',
      isloading: true,
      currentType: {},
      articleList: [],
      pagination: {},
      search: '',
      path: 'article',
      backPath: '',
      lang: this.$t('articleList'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('articles-page')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.getCategories()
    vm.backPath = vm.getPath()
    if (
      vm.$auth.$storage.getLocalStorage('currentType') !== undefined ||
      vm.$auth.$storage.getLocalStorage('currentType') !== '' ||
      vm.$auth.$storage.getLocalStorage('currentType') !== null
    ) {
      vm.currentType = vm.$auth.$storage.getLocalStorage('currentType')
      vm.getArticlesByCurrent()
    } else {
      vm.getArticles()
    }
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
    }),
    goBack() {
      const vm = this
      vm.$router.push(vm.backPath)
    },
    async getCategories() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/articles-category?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              if (res.data.length < 3) {
                vm.categoriesLst = res.data
              } else {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].id <= 3) {
                    vm.categoriesLst.push(res.data[i])
                  }
                }
              }
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async getArticles() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/articles?lang=${vm.locale}`).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            vm.articleList = res.data
            vm.pagination = res.pagination
            vm.isloading = false
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getArticlesByCurrent() {
      const vm = this
      try {
        const id = parseInt(vm.currentType.id)
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/articles?category_id=${id}&lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.articleList = res.data
              vm.pagination = res.pagination
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    getCurrentType(value) {
      const vm = this
      vm.isloading = true
      vm.currentType = value
      vm.$auth.$storage.setLocalStorage('currentType', vm.currentType)
      vm.articleList = []
      vm.search = ''
      vm.getArticlesByCurrent()
    },
    getAll() {
      const vm = this
      vm.isloading = true
      vm.$auth.$storage.removeLocalStorage('currentType')
      vm.currentType = {}
      vm.articleList = []
      vm.search = ''
      vm.getArticles()
    },
    getSearch(e) {
      const vm = this
      firebase.analytics().logEvent('articles-search-button')
      if (vm.search !== '') {
        vm.isloading = true
        vm.searchList()
      } else {
        vm.getArticles()
      }
    },
    async searchList() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/articles?lang=${vm.locale}&keyword=${vm.search}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.articleList = res.data
              vm.pagination = res.pagination
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    goToDetail(id) {
      const vm = this
      firebase.analytics().logEvent('articles-detail-button')
      if (vm.locale === 'th') {
        vm.$router.push(`/article/${id}`)
      } else {
        vm.$router.push(`/en/article/${id}`)
      }
    },
    getOtherCategories(value) {
      const vm = this
      if (value === 99) {
        if (vm.locale === 'th') {
          vm.setPath('/article')
          vm.$router.push(`/others/${vm.path}`)
        } else {
          vm.setPath('/en/article')
          vm.$router.push(`/en/others/${vm.path}`)
        }
      }
    },
  },
}
</script>

<style lang="scss">
#Article {
  width: 100%;
  height: 100%;
  position: relative;
  .article-container {
    width: 100%;
    height: 100%;
    padding: 51px 0 60px;
    position: relative;
    .article-search {
      width: 100%;
      margin: 0 auto;
      padding: 17px 16px 11px 20px;
      background-color: #f1f8ff;
      position: fixed;
      top: 51px;
      z-index: 1;
      text-align: center;
      .txtSearch {
        width: 100%;
        height: 45px;
        padding: 0 0 12px;
        margin-bottom: 13px;
        border-radius: 6px;
        border: none;
        box-shadow: #00000029 0 0 6px;
        font-family: 'Anuphan-Medium';
        font-size: 16px;
        color: #a89a9a;
        line-height: 20px;
        ::placeholder {
          font-family: 'Anuphan-Medium';
          font-size: 16px;
          line-height: 20px;
          color: #a89a9a;
        }
      }
      .article-categories {
        width: 100%;
        position: relative;
        overflow: auto;
        display: inline-flex;
        overflow-x: scroll;
        .btnCategories {
          width: 100%;
          height: 30px;
          padding: 8px 11px 7px;
          margin-right: 7px;
          background-color: #fff;
          border-radius: 6px;
          border: none;
          box-shadow: #00000029 0 0 6px;
          font-family: 'Anuphan-Regular';
          font-size: 12px;
          color: #2f2e41;
          line-height: 15px;
        }
        .btnAll {
          width: 100%;
          height: 30px;
          padding: 8px 11px 7px;
          margin-right: 7px;
          background-color: #fff;
          border-radius: 6px;
          border: none;
          box-shadow: #00000029 0 0 6px;
          font-family: 'Anuphan-Regular';
          font-size: 12px;
          color: #2f2e41;
          line-height: 15px;
        }
        .btnOthers {
          width: 100%;
          height: 30px;
          padding: 8px 11px 7px;
          background-color: #fff;
          border-radius: 6px;
          border: none;
          box-shadow: #00000029 0 0 6px;
          font-family: 'Anuphan-Regular';
          font-size: 12px;
          color: #2f2e41;
          line-height: 15px;
        }
        .currentGroup {
          background-color: #004899;
          color: #fff;
          cursor: not-allowed;
        }
      }
    }
    .article-list {
      height: auto;
      padding: 17px 16px 60px 20px;
      margin-top: 120px;
      position: relative;
      overflow: hidden;
      overflow-y: scroll;
      .article-card {
        margin-bottom: 18px;
        padding: 8px 16px 11px 11px;
        border-radius: 6px;
        box-shadow: #00000029 0 0 6px;
        .article-img {
          height: 96px !important;
          border-radius: 6px !important;
        }
        .article-card-detail {
          margin-left: 16px;
          padding-top: 6px;
          .headline {
            width: 100%;
            padding: 0;
            font-family: 'Anuphan-Medium';
            font-size: 14px;
            color: #004899;
            line-height: 18px;
            white-space: normal;
          }
          .article-action {
            width: 100%;
            margin-top: 12px;
            display: inline-flex;
            .article-subtitle {
              display: block;
              float: left;
              width: 90%;
              .subline {
                padding: 0;
                font-family: 'Anuphan-Regular';
                font-size: 12px;
                color: #2f2e41;
                line-height: 15px;
              }
            }
            .article-click {
              float: right;
              margin-left: auto;
              margin-top: 5px;
              width: 10%;
              .btnDetail {
                border: none;
                background: none;
              }
            }
          }
        }
      }
    }
    .maxHeight {
      height: 100%;
      min-height: 435px;
      background-color: #fff;
    }
    .notTop {
      margin-top: 0;
    }
    .article-no-data {
      width: 100%;
      padding: 17px 16px 11px;
      margin: 120px auto 0;
      text-align: center;
      border-bottom: 1px solid #e6f2fe;
      background-color: #fff;
      .lbNoDataType {
        margin-bottom: 0;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #617d8c;
        line-height: 20px;
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/article.css');
</style>
