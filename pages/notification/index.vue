<template>
  <div id="Notification">
    <Header :title="lang.title" :backPath="goBack()" />
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div
      v-if="!isLoading && Object.keys(notification).length === 0"
      class="notification-detail"
    >
      <div class="notification-tabs">
        <div class="notification-tab-form">
          <v-tabs fixed-tabs icons-and-text class="v-tabs-notification">
            <v-tab
              v-for="item in tabsList"
              :key="item.id"
              class="v-tab-item"
              @click="tabId = item.id"
            >
              <div
                v-if="item.id === 1 && notReadClaim !== 0"
                class="notification-count"
              >
                {{ notReadClaim >= 9 ? '9+' : notReadClaim }}
              </div>
              <div
                v-if="item.id === 2 && notReadPromo !== 0"
                class="notification-count"
              >
                {{ notReadPromo >= 9 ? '9+' : notReadPromo }}
              </div>
              <div
                v-if="item.id === 3 && notReadGeneral !== 0"
                class="notification-count"
              >
                {{ notReadGeneral >= 9 ? '9+' : notReadGeneral }}
              </div>
              {{ item.name }}
              <v-icon class="v-tab-icon">
                {{ item.icon }}
              </v-icon>
            </v-tab>
          </v-tabs>
        </div>
      </div>
      <div class="notification-lists">
        <div v-if="tabId === 1 && locale === 'th'" class="claim-list">
          <v-list-item
            v-for="item in claimList"
            :key="item.id"
            three-line
            :class="{ notRead: !item.isRead }"
            @click="getDetail(item.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.detail }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="time">
                {{ item.createDate + ' | ' + item.createdTime }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-badge v-if="!item.isRead" class="unread" dot></v-badge>
          </v-list-item>
        </div>
        <div v-if="tabId === 1 && locale === 'en'" class="claim-list">
          <v-list-item
            v-for="item in claimListEN"
            :key="item.id"
            three-line
            :class="{ notRead: !item.isRead }"
            @click="getDetail(item.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.detail }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="time">
                {{ item.createDate + ' | ' + item.createdTime }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-badge v-if="!item.isRead" class="unread" dot></v-badge>
          </v-list-item>
        </div>
        <div v-if="tabId === 2 && locale === 'th'" class="promotion-list">
          <v-list-item
            v-for="item in promotionList"
            :key="item.id"
            three-line
            :class="{ notRead: !item.isRead }"
            @click="getDetail(item.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.detail }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="time">
                {{ item.createDate + ' | ' + item.createdTime }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-badge v-if="!item.isRead" class="unread" dot></v-badge>
          </v-list-item>
        </div>
        <div v-if="tabId === 2 && locale === 'en'" class="promotion-list">
          <v-list-item
            v-for="item in promotionListEN"
            :key="item.id"
            three-line
            :class="{ notRead: !item.isRead }"
            @click="getDetail(item.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.detail }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="time">
                {{ item.createDate + ' | ' + item.createdTime }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-badge v-if="!item.isRead" class="unread" dot></v-badge>
          </v-list-item>
        </div>
        <div v-if="tabId === 3 && locale === 'th'" class="normal-list">
          <v-list-item
            v-for="item in generalList"
            :key="item.id"
            three-line
            :class="{ notRead: !item.isRead }"
            @click="getDetail(item.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.detail }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="time">
                {{ item.createDate + ' | ' + item.createdTime }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-badge v-if="!item.isRead" class="unread" dot></v-badge>
          </v-list-item>
        </div>
        <div v-if="tabId === 3 && locale === 'en'" class="normal-list">
          <v-list-item
            v-for="item in generalListEN"
            :key="item.id"
            three-line
            :class="{ notRead: !item.isRead }"
            @click="getDetail(item.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.detail }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="time">
                {{ item.createDate + ' | ' + item.createdTime }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-badge v-if="!item.isRead" class="unread" dot></v-badge>
          </v-list-item>
        </div>
      </div>
    </div>
    <Footer :path="path" :backPath="backPath" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Footer from '../../components/footer'
import Header from '../../components/header'
export default {
  name: 'Notification',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      tabsList: [
        {
          id: 1,
          name: this.$t('notification').tabHeader.tabTitle1,
          icon: 'icon-noti-claim',
          count: 0,
        },
        {
          id: 2,
          name: this.$t('notification').tabHeader.tabTitle2,
          icon: 'icon-noti-promo',
          count: 0,
        },
        {
          id: 3,
          name: this.$t('notification').tabHeader.tabTitle3,
          icon: 'icon-noti-general',
          count: 0,
        },
      ],
      tab: {},
      tabId: 1,
      backPath: '',
      profile: {},
      pushGearsList: [],
      claimList: [],
      promotionList: [],
      generalList: [],
      claimListEN: [],
      promotionListEN: [],
      generalListEN: [],
      locale: this.$i18n.locale,
      lang: this.$t('notification'),
      notification: {},
      isLoading: true,
      path: 'notification',
      notReadClaim: 0,
      notReadPromo: 0,
      notReadGeneral: 0,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('notification-page')
    vm.notification = {}
    vm.backPath = vm.getPath()
    vm.profile = vm.$auth.$storage.getLocalStorage('profile')
    vm.getNotifications()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        return '/'
      } else {
        return '/en'
      }
    },
    async getNotifications() {
      const vm = this
      const response = await vm.$http.get(
        `https://push-gears-mk2.appspot.com/push_message/?user=tpa_prod_${vm.profile.username}`
      )
      const data = await response.json()
      vm.pushGearsList = data.results
      for (let i = 0; i < vm.pushGearsList.length; i++) {
        const obj = JSON.parse(vm.pushGearsList[i].raw_data)
        vm.setListByType(
          vm.pushGearsList[i].id,
          obj,
          vm.pushGearsList[i].create_dt,
          vm.pushGearsList[i].readed
        )
      }
      if (vm.locale === 'en') {
        vm.tabsList[0].count = vm.claimListEN.length
        vm.tabsList[1].count = vm.promotionListEN.length
        vm.tabsList[2].count = vm.generalListEN.length
      } else {
        vm.tabsList[0].count = vm.claimList.length
        vm.tabsList[1].count = vm.promotionList.length
        vm.tabsList[2].count = vm.generalList.length
      }
      vm.isLoading = false
    },
    setListByType(pushId, obj, pushDate, readed) {
      const vm = this
      const [date, fulltime] = pushDate.split('T')
      const time = fulltime.split('.')[0]
      switch (obj.data.type) {
        case 'claim':
          if (!readed) {
            vm.notReadClaim = vm.notReadClaim + 1
          }
          if (vm.locale === 'en') {
            vm.claimListEN.push({
              id: pushId,
              title: obj.data.title_en,
              detail: obj.data.detail_en,
              createDate: date,
              createdTime: time,
              isRead: readed,
            })
          } else {
            vm.claimList.push({
              id: pushId,
              title: obj.data.title_th,
              detail: obj.data.detail_th,
              createDate: date,
              createdTime: time,
              isRead: readed,
            })
          }
          break
        case ('promotion', 'article'):
          if (!readed) {
            vm.notReadPromo = vm.notReadPromo + 1
          }
          if (vm.locale === 'en') {
            vm.promotionListEN.push({
              id: pushId,
              title: obj.data.title_en,
              detail: obj.data.detail_en,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              isRead: readed,
            })
          } else {
            vm.promotionList.push({
              id: pushId,
              title: obj.data.title_th,
              detail: obj.data.detail_th,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              isRead: readed,
            })
          }
          break
        case 'normal':
          if (!readed) {
            vm.notReadGeneral = vm.notReadGeneral + 1
          }
          if (vm.locale === 'en') {
            vm.generalListEN.push({
              id: pushId,
              title: obj.data.title_en,
              detail: obj.data.detail_en,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              isRead: readed,
            })
          } else {
            vm.generalList.push({
              id: pushId,
              title: obj.data.title_th,
              detail: obj.data.detail_th,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              isRead: readed,
            })
          }
          break
      }
    },
    getDetail(id) {
      const vm = this
      firebase.analytics().logEvent('notification-detail')
      if (vm.locale === 'th') {
        vm.$router.push(`/notification/${id}`)
      } else {
        vm.$router.push(`/en/notification/${id}`)
      }
    },
  },
}
</script>

<style lang="scss">
label {
  margin-bottom: 0 !important;
}
#Notification {
  width: 100%;
  height: 100%;
  position: relative;
  .notification-detail {
    width: 100%;
    height: 100%;
    padding-top: 51px;
    position: relative;
    .notification-tabs {
      width: 100%;
      height: 73px;
      padding: 0;
      display: inline-flex;
      position: fixed;
      top: 51px;
      z-index: 1;
      background-color: #fff;
      border-bottom: 0.5px solid #e7ecee;
      .notification-tab-form {
        width: 100%;
        display: inline-flex;
        .v-tabs-notification {
          width: fit-content;
          .v-tab-item {
            position: relative;
            width: 110px;
            height: 100%;
            padding: 14px 7px 9px;
            font-family: 'Anuphan-Medium';
            font-size: 12px;
            line-height: 15px;
            color: #617d8c;
            text-align: center;
            letter-spacing: -0.3px;
            word-break: break-all;
            .v-tab-icon {
              padding-bottom: 6px;
              font-size: 29px;
              color: #617d8c;
            }
            .notification-count {
              position: absolute;
              top: 10px;
              right: 13px;
              width: 16px;
              height: 16px;
              padding: 1px;
              background-color: #ff0000;
              border-radius: 50px;
              font-family: 'Anuphan-Bold';
              font-size: 10px;
              line-height: 13px;
              color: #fff;
              text-align: center;
            }
          }
        }
      }
    }
    .notification-lists {
      margin-top: 73px;
      margin-bottom: 60px;
    }
  }
}
</style>
<style>
@import url('../../assets/css/notification.css');
</style>
