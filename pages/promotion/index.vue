<template>
  <div id="Promotion">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="promotion-container">
      <div class="promotion-search">
        <v-text-field
          v-model="search"
          :label="lang.searchPlaceholder"
          type="search"
          class="txtSearch"
          append-icon="mdi-magnify"
          solo
          @click:append="getSearch()"
        ></v-text-field>
        <div class="promotion-categories">
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
        v-if="search === '' && promotionList.length === 0"
        class="promotion-no-data"
      >
        <div v-if="Object.keys(currentType).length !== 0">
          <label class="lbNoDataType">
            {{ lang.notFoundDataType + '"' + currentType.name + '"' }}
          </label>
        </div>
      </div>
      <div
        v-if="search !== '' && promotionList.length === 0"
        class="promotion-no-data"
      >
        <label class="lbNoDataType">
          {{ lang.notFoundDataSearch + '"' + search + '"' }}
        </label>
      </div>
      <div
        v-if="search !== '' && promotionList.length !== 0"
        class="promotion-no-data"
      >
        <label class="lbNoDataType">
          {{ lang.foundDataSearch + '"' + search + '"' }}
        </label>
      </div>
      <div
        v-if="promotionList.length !== 0"
        class="promotion-list"
        :class="{
          maxHeight: promotionList.length <= 3 && promotionList.length !== 0,
          notTop: search !== '' && promotionList.length !== 0,
        }"
      >
        <div v-for="(item, i) in promotionList" :key="i">
          <v-card class="promotion-card" @click="goToDetail(item.id)">
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-avatar class="ma-3 promotion-img" size="115" tile>
                <v-img class="promo-img" :src="item.picture"></v-img>
              </v-avatar>
              <div class="promotion-card-detail">
                <label class="headline">{{ item.title }}</label>
                <div class="promotion-action">
                  <div class="promotion-subtitle">
                    <v-card-subtitle
                      class="subline"
                      v-text="item.hospital"
                    ></v-card-subtitle>
                    <v-card-subtitle
                      class="subline"
                      v-text="item.date"
                    ></v-card-subtitle>
                  </div>
                  <div class="promotion-click">
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
    <Footer :path="path" :backPath="locale === 'th' ? '/' : '/en/'" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
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
      categoriesLst: [],
      token: '',
      isloading: true,
      currentType: {},
      promotionList: [],
      pagination: {},
      search: '',
      path: 'promotion',
      backPath: '',
      lang: this.$t('promotionList'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('promotions-page')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    vm.getCategories()
    if (
      vm.$auth.$storage.getLocalStorage('currentType') !== undefined ||
      vm.$auth.$storage.getLocalStorage('currentType') !== '' ||
      vm.$auth.$storage.getLocalStorage('currentType') !== null
    ) {
      vm.currentType = vm.$auth.$storage.getLocalStorage('currentType')
      vm.getPromotionByCurrent()
    } else {
      vm.getPromotions()
    }
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
    }),
    async getCategories() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/promotions-category?lang=${vm.locale}`)
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
    async getPromotions() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/promotions?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.promotionList = res.data
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
    async getPromotionByCurrent() {
      const vm = this
      try {
        const id = parseInt(vm.currentType.id)
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/promotions?category_id=${id}&lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.promotionList = res.data
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
      vm.promotionList = []
      vm.search = ''
      vm.getPromotionByCurrent()
    },
    getAll() {
      const vm = this
      vm.isloading = true
      vm.$auth.$storage.removeLocalStorage('currentType')
      vm.currentType = {}
      vm.promotionList = []
      vm.search = ''
      vm.getPromotions()
    },
    getSearch(e) {
      const vm = this
      firebase.analytics().logEvent('search-promotions')
      if (vm.search !== '') {
        vm.isloading = true
        vm.promotionList = []
        vm.searchList()
      } else {
        vm.getPromotions()
      }
    },
    async searchList() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/promotions?lang=${vm.locale}&keyword=${vm.search}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.promotionList = res.data
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
      firebase.analytics().logEvent('promotion-detail')
      if (vm.locale === 'th') {
        vm.$router.push(`/promotion/${id}`)
      } else {
        vm.$router.push(`/en/promotion/${id}`)
      }
    },
    getOtherCategories(value) {
      const vm = this
      if (value === 99) {
        if (vm.locale === 'th') {
          vm.setPath('/promotion')
          vm.$router.push(`/others/${vm.path}`)
        } else {
          vm.setPath('/en/promotion')
          vm.$router.push(`/en/others/${vm.path}`)
        }
      }
    },
  },
}
</script>

<style lang="scss">
#Promotion {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .promotion-container {
    width: 100%;
    height: 100%;
    padding: 51px 0 60px;
    position: relative;
    .promotion-search {
      width: 100%;
      padding: 17px 16px 11px;
      background-color: #f1f8ff;
      position: fixed;
      top: 51px;
      z-index: 1;
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
      .promotion-categories {
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
    .promotion-list {
      height: auto;
      padding: 17px 16px 70px;
      margin-top: 120px;
      position: relative;
      overflow: hidden;
      overflow-y: scroll;
      .promotion-card {
        margin-bottom: 18px;
        padding: 8px 16px 11px 11px;
        border-radius: 6px;
        box-shadow: #00000029 0 0 6px;
        .promotion-img {
          height: 96px !important;
          border-radius: 6px !important;
        }
        .promotion-card-detail {
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
          .promotion-action {
            width: 100%;
            margin-top: 12px;
            display: inline-flex;
            .promotion-subtitle {
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
            .promotion-click {
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
    .promotion-no-data {
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
@import url('../../assets/css/promotion.css');
</style>
