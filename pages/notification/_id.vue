<template>
  <div id="Notification">
    <Header :title="lang.title" :backPath="goBack()" />
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div
      v-if="!isLoading && Object.keys(notification).length !== 0"
      class="notification-detail"
    >
      <div class="header-detail">
        <label class="lbNotificationType">
          {{ notification.type }}
        </label>
        <label class="lbNotificationHeader">
          {{ notification.title }}
        </label>
      </div>
      <div class="notification-form">
        <div class="notification-date">
          <label class="lbNotificationDate">
            {{ notification.createDate + ' | ' + notification.createdTime }}
          </label>
        </div>
        <p class="notification-paragraph">
          {{ notification.detail }}
        </p>
      </div>
    </div>
    <div
      v-if="
        notification.url !== '' && notification.notificationType !== 'claim'
      "
      class="notification-footer"
    >
      <v-btn
        type="submit"
        variant="primary"
        class="btnOther"
        :href="'http://' + notification.url"
        target="_blank"
      >
        {{ lang.btnOther }}
      </v-btn>
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
      id: this.$route.params.id,
      backPath: '',
      profile: {},
      locale: this.$i18n.locale,
      lang: this.$t('notification'),
      notification: {},
      isLoading: true,
      path: 'notification',
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('notification-detail-page')
    vm.notification = {}
    vm.backPath = vm.getPath()
    vm.profile = vm.$auth.$storage.getLocalStorage('profile')
    vm.getDetail()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        return '/notification'
      } else {
        return '/en/notification'
      }
    },
    async getDetail() {
      const vm = this
      vm.isLoading = true
      const response = await vm.$http.get(
        `https://push-gears-mk2.appspot.com/push_message/${vm.id}`
      )
      const data = await response.json()
      const obj = JSON.parse(data.raw_data)
      const [date, fulltime] = data.create_dt.split('T')
      const time = fulltime.split('.')[0]
      switch (obj.data.type) {
        case 'claim':
          if (vm.locale === 'en') {
            vm.notification = {
              id: data.id,
              title: obj.data.title_en,
              detail: obj.data.detail_en,
              createDate: date,
              createdTime: time,
              moreFile: obj.data.enable_add_more_file,
              type: 'Claim Status',
              notificationType: obj.data.type,
            }
          } else {
            vm.notification = {
              id: data.id,
              title: obj.data.title_th,
              detail: obj.data.detail_th,
              createDate: date,
              createdTime: time,
              moreFile: obj.data.enable_add_more_file,
              type: 'สถานะการเคลม',
              notificationType: obj.data.type,
            }
          }
          break
        case ('promotion', 'article'):
          if (vm.locale === 'en') {
            vm.notification = {
              id: data.id,
              title: obj.data.title_en,
              detail: obj.data.detail_en,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              type: 'Promotion and Health Tips',
              notificationType: obj.data.type,
            }
          } else {
            vm.notification = {
              id: data.id,
              title: obj.data.title_th,
              detail: obj.data.detail_th,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              type: 'โปรโมชั่นและบทความ',
              notificationType: obj.data.type,
            }
          }
          break
        case 'normal':
          if (vm.locale === 'en') {
            vm.notification = {
              id: data.id,
              title: obj.data.title_en,
              detail: obj.data.detail_en,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              type: 'General',
              notificationType: obj.data.type,
            }
          } else {
            vm.notification = {
              id: data.id,
              title: obj.data.title_th,
              detail: obj.data.detail_th,
              createDate: date,
              createdTime: time,
              url: obj.data.url,
              type: 'ทั่วไป',
              notificationType: obj.data.type,
            }
          }
          break
      }
      vm.isLoading = false
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
    .notification-lists {
      width: 100%;
      margin-top: 87px;
      position: relative;
    }
    .header-detail {
      width: 100%;
      height: auto;
      padding: 14px 20px;
      background-color: #f1f8ff;
      .lbNotificationType {
        font-family: 'Anuphan-Regular';
        font-size: 20px;
        line-height: 27px;
        color: #004899;
        display: block;
      }
      .lbNotificationHeader {
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        line-height: 20px;
        color: #004899;
        display: block;
      }
    }
    .notification-form {
      width: 100%;
      height: auto;
      padding: 17px;
      .notification-date {
        padding-bottom: 15px;
        .lbNotificationDate {
          font-family: 'Anuphan-Regular';
          font-size: 12px;
          line-height: 20px;
          color: #7a828d;
        }
      }
      .notification-paragraph {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        line-height: 20px;
        color: #2f2e41;
      }
    }
  }
  .notification-footer {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    .btnOther {
      width: 319px;
      height: 45px;
      margin-top: 5px;
      border-radius: 6px;
      border-color: #3ba9fe;
      background-color: #3ba9fe;
      padding: 10px 60px;
      text-align: center;
      font-family: 'Anuphan-Medium';
      font-size: 18px;
      color: #fffbfb;
      line-height: 24px;
    }
  }
}
</style>
<style>
@import url('../../assets/css/notification.css');
</style>
