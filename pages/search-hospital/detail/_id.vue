<template>
  <div id="HospitalDetail">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading && !isShowPictures" class="provider-detail">
      <b-link v-if="!isNotImage" @click="isShowPictures = true">
        <img
          v-if="!isNotImage"
          class="img-hospital"
          :src="hospital.pictures[0]"
        />
      </b-link>
      <img
        v-if="isNotImage"
        class="img-hospital"
        src="../../../assets/images/not-image.jpg"
      />
      <v-row class="hospital-header">
        <v-col cols="9" class="header-part">
          <label class="lbHospitalHeader">{{ hospital.name }}</label>
        </v-col>
        <v-col cols="3" class="navigator-part">
          <v-btn
            class="btnNavigator"
            :href="`https://www.google.com/maps/dir/${parseFloat(
              position.latitude
            )},${parseFloat(position.longitude)}/${addressNo[0]}+${
              hospital.name
            }+${addressNo[1]}+${hospital.address_road}+${
              hospital.address_amphur
            }+${hospital.address_province}+${
              hospital.address_postcode
            }/@${parseFloat(hospital.latitude)},${parseFloat(
              hospital.longitude
            )},15z?hl=th`"
            target="_blank"
          >
            <img src="../../../assets/images/navigator.png" />
          </v-btn>
          <v-btn
            v-if="hospital.telephone.split('   ').length === 0"
            class="btnTel"
            :href="`tel:${hospital.telephone}`"
          >
            <img src="../../../assets/images/tel-button.png" />
          </v-btn>
          <v-menu v-else offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="btnTel" v-bind="attrs" v-on="on">
                <img src="../../../assets/images/tel-button.png" />
              </v-btn>
            </template>
            <v-list class="tel-list">
              <v-list-item v-for="(item, index) in telephoneList" :key="index">
                <v-list-item-title>
                  <v-btn
                    class="tel-link"
                    text
                    :href="`tel:${splitTel(item)}`"
                    >{{ item }}</v-btn
                  >
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <div class="hospital-detail">
        <div class="hospital-form">
          <img class="hospital-img" src="../../../assets/images/address.png" />
          <div class="hospital-address">
            <label class="lbAddress">{{
              hospital.address_no +
              ' ' +
              hospital.address_road +
              ' ' +
              hospital.address_amphur
            }}</label>
            <label class="lbAddress">{{
              hospital.address_province + ' ' + hospital.address_postcode
            }}</label>
            <label class="lbDistance">
              {{
                lang.distanceFromYou +
                parseFloat(hospital.distance) +
                lang.meter
              }}
            </label>
          </div>
        </div>
        <div class="hospital-form">
          <img
            class="hospital-img"
            src="../../../assets/images/telephone.png"
          />
          <label v-if="telephoneList.length === 0" class="lbHospital">{{
            hospital.telephone
          }}</label>
          <div v-else class="hospital-telephone">
            <v-btn
              v-for="(item, index) in telephoneList"
              :key="index"
              text
              class="lbHospitalPhone"
              :href="'tel:' + splitTel(item)"
              >{{ item }}</v-btn
            >
          </div>
        </div>
        <div class="hospital-form">
          <img class="hospital-img" src="../../../assets/images/website.png" />
          <b-link class="linkWebsite" :href="hospital.website" target="_blank">
            {{ hospital.website }}
          </b-link>
        </div>
        <div class="hospital-form">
          <img class="hospital-img" src="../../../assets/images/time.png" />
          <label v-if="timeList.length === 0" class="lbHospital">{{
            hospital.service_times
          }}</label>
          <div v-else class="hospital-times">
            <label
              v-for="(item, index) in timeList"
              :key="index"
              class="lbHospitalTime"
              >{{ item }}</label
            >
          </div>
        </div>
        <div v-if="hospital.service_fee !== ''" class="hospital-form">
          <img class="hospital-img" src="../../../assets/images/fee.png" />
          <label class="lbHospital">{{ hospital.service_fee }}</label>
        </div>
        <div v-if="hospital.description !== ''" class="hospital-description">
          <span class="lbDescription">{{ hospital.description }}</span>
        </div>
      </div>
    </div>
    <div v-if="isShowPictures" class="show-pictures">
      <v-icon
        class="btn-close-icon"
        right
        color="#4F5358"
        @click="isShowPictures = false"
        >fa-times-circle</v-icon
      >
      <div v-if="hospital.pictures.length === 1" class="show-hospital">
        <img
          class="imgHospital"
          :src="hospital.pictures[0]"
          @click="goToZoom(hospital.pictures[0])"
        />
      </div>
      <div v-if="hospital.pictures.length > 1">
        <v-carousel
          id="carouselImgShow"
          v-model="hospital.pictures"
          :show-arrows="false"
          delimiter-icon="icon-carousel-circle"
          class="hospital-images"
          height="100%"
        >
          <v-carousel-item
            v-for="(item, index) in hospital.pictures"
            :key="index"
            :aria-sort="index"
            class="show-hospital-carousel"
          >
            <img class="imgHospital" :src="item" @click="goToZoom(item)" />
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../../components/header'
export default {
  name: 'HospitalDetail',
  components: {
    Header,
  },
  data() {
    return {
      lang: this.$t('hospitalDetail'),
      locale: this.$i18n.locale,
      id: this.$route.params.id,
      token: '',
      hospital: {},
      backPath: '',
      isloading: true,
      telephoneList: [],
      timeList: [],
      isShowPictures: false,
      isNotImage: false,
      position: {},
      addressNo: [],
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('hospital-detail-page')
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.position = vm.$auth.$storage.getLocalStorage('position')
    vm.backPath = vm.getPath()
    if (vm.locale === 'th') {
      vm.setPath('/')
    } else {
      vm.setPath('/en')
    }
    vm.getHospital()
  },
  methods: {
    ...mapGetters({
      getPosition: 'getPosition',
      getPath: 'getPath',
    }),
    ...mapMutations({
      setPath: 'setPath',
      setHospital: 'setHospital',
    }),
    async getHospital() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/hospital/${vm.id}?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospital = res.data
              if (vm.hospital.telephone.split('   ').length !== 0) {
                vm.telephoneList = vm.hospital.telephone.split('   ')
              }
              if (vm.hospital.service_times.split(',').length !== 0) {
                vm.timeList = vm.hospital.service_times.split(',')
              }
              vm.isNotImage = vm.hospital.pictures === undefined
              vm.addressNo = vm.hospital.address_no.split('/')
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
    splitTel(phone) {
      const [tel1, tel2, tel3] = phone.split('-')
      return tel1 + tel2 + tel3
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#HospitalDetail {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .show-pictures {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .btn-close-icon {
      font-size: 30px;
      text-align: right;
      margin: 60px 0 0 90%;
    }
    .show-hospital {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 50% 0;
      .imgHospital {
        max-width: 375px;
        max-height: 195px;
      }
    }
  }
  .provider-detail {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 51px 0 0;
    background-color: #fff;
    .img-hospital {
      width: 100%;
      height: 100%;
      max-height: 195px;
    }
    .hospital-header {
      width: 100%;
      height: fit-content;
      padding: 20px 15px;
      margin: 0 auto;
      display: inline-flex;
      background-color: #f1f8ff;
      .header-part {
        .lbHospitalHeader {
          font-family: 'Anuphan-Regular';
          font-size: 20px;
          color: #004899;
          line-height: 27px;
        }
      }
      .navigator-part {
        margin-left: auto;
        display: inline-flex;
        .btnNavigator {
          width: 30px;
          height: 30px;
          min-width: 30px;
          margin-right: 10px;
          background-color: transparent;
          padding: 0;
        }
        .btnTel {
          width: 30px;
          height: 30px;
          min-width: 30px;
          background-color: transparent;
          padding: 0;
        }
      }
    }
    .hospital-detail {
      width: 100%;
      height: auto;
      .hospital-form {
        width: 100%;
        padding: 11px 16px;
        border-bottom: 0.5px solid #e7ecee;
        display: inline-flex;
        .hospital-img {
          float: left;
          width: 20px;
          height: 20px;
          margin-right: 20px;
        }
        .hospital-address {
          width: 100%;
          display: block;
          .lbAddress {
            font-family: 'Anuphan-Regular';
            font-size: 14px;
            color: #2f2e41;
            line-height: 20px;
            display: block;
          }
          .lbDistance {
            font-family: 'Anuphan-Regular';
            font-size: 12px;
            color: #7a828d;
            line-height: 20px;
          }
        }
        .hospital-telephone {
          width: 100%;
          text-align: left;
          display: block;
          .lbHospitalPhone {
            height: fit-content;
            font-family: 'Anuphan-Regular';
            font-size: 14px;
            color: #2f2e41;
            line-height: 20px;
            display: block;
            padding: 0;
            letter-spacing: 0;
            justify-content: left;
          }
        }
        .hospital-times {
          width: 100%;
          display: block;
          .lbHospitalTime {
            font-family: 'Anuphan-Regular';
            font-size: 14px;
            color: #2f2e41;
            line-height: 20px;
            display: block;
          }
        }
        .lbHospital {
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #2f2e41;
          line-height: 20px;
        }
        .linkWebsite {
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #2f2e41;
          line-height: 20px;
          text-decoration: none;
          cursor: pointer;
        }
      }
      .hospital-description {
        width: 100%;
        padding: 10px 16px 20px;
        .lbDescription {
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #2f2e41;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
<style>
@import url('vue-image-zoom/dist/vue-image-zoom.css');
@import url('../../../assets/css/hospital-detail.css');
</style>
