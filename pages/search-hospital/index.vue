<template>
  <div id="SearchHospital">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="hospital-detail">
      <GmapMap
        :center="center"
        :zoom="mapZoom"
        map-type-id="roadmap"
        :options="{
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false,
          disableDefaultUI: true,
          draggable: true,
          clickable: true,
        }"
        style="width: 100%; height: 100%; overflow: auto;"
      >
        <GmapMarker
          ref="currentMap"
          :position="center"
          :clickable="true"
          :icon="{ url: require('../../assets/images/current-pin.svg') }"
        />
        <GmapMarker
          v-for="(item, i) in allList"
          ref="allMap"
          :key="item.id"
          :position="item"
          :clickable="true"
          :icon="{ url: require('../../assets/images/some-coverage.svg') }"
          @click="toggleInfoWindow(item, i)"
        />
        <GmapMarker
          v-for="(item, j) in someList"
          ref="someMap"
          :key="item.id"
          :position="item"
          :clickable="true"
          :icon="{ url: require('../../assets/images/all-coverage.svg') }"
          @click="toggleInfoWindow(item, j)"
        />
        <gmap-info-window
          :options="infoOptions"
          :position="infoWindowPos"
          :opened="infoWinOpen"
          @closeclick="clearInfoWindow()"
        >
        </gmap-info-window>
      </GmapMap>
    </div>
    <div v-if="!isloading" class="hospital-search">
      <v-row class="search-section">
        <v-text-field
          v-model="search"
          :label="lang.searchPlaceholder"
          type="search"
          class="txtSearch"
          append-icon="mdi-magnify"
          solo
          @click="getSearch"
        ></v-text-field>
      </v-row>
      <v-row class="type-section">
        <v-chip
          class="btnAll"
          :class="{
            currentGroup:
              currentType === '' ||
              currentType === null ||
              currentType === undefined,
          }"
          @click="getAll()"
          >{{ lang.categoriesGroups.all }}</v-chip
        >
        <v-chip
          v-for="item in groupList"
          :key="item.id"
          class="btnGroup"
          :class="{
            currentGroup:
              currentType !== '' &&
              currentType !== null &&
              currentType !== undefined &&
              currentType.id === item.id,
          }"
          @click="getCurrentType(item)"
          >{{ item.name }}</v-chip
        >
        <v-chip class="btnOthers" @click="getOtherCategories(99)">{{
          lang.categoriesGroups.other
        }}</v-chip>
      </v-row>
    </div>
    <div v-if="!isloading" class="hospital-footer">
      <v-btn
        class="btnCurrent"
        :class="{ isOpen: isSildeOpen }"
        @click="setCurrentLocation()"
      >
        <img src="../../assets/images/current-button.svg" />
      </v-btn>
      <v-row v-if="!isSildeOpen" class="slide-list-close" @click="setSlideUp">
        <v-row class="list-header">
          <v-col cols="11" class="list-lb">
            <label class="lbListHeader">{{ lang.nearPlaces }}</label>
          </v-col>
          <v-col cols="1" class="list-up">
            <img class="btnUp" src="../../assets/images/up.svg" />
          </v-col>
        </v-row>
        <v-row class="list-status">
          <v-col class="list-status-form">
            <img class="currentPin" src="../../assets/images/current-pin.svg" />
            <label class="lbListStatus">{{ lang.currentPlaces }}</label>
          </v-col>
          <v-col class="list-status-form">
            <div class="allPin"></div>
            <label class="lbListStatus">{{ lang.allCoverage }}</label>
          </v-col>
          <v-col class="list-status-form last">
            <div class="somePin"></div>
            <label class="lbListStatus">{{ lang.someCoverage }}</label>
          </v-col>
        </v-row>
      </v-row>
      <div
        v-if="isSildeOpen"
        class="slide-list-open"
        :class="{ smallSlide: Object.keys(provider).length !== 0 }"
      >
        <v-row
          v-if="Object.keys(provider).length === 0"
          class="list-header"
          @click="setSlideDown"
        >
          <v-col cols="11" class="list-lb">
            <label class="lbListHeader">{{ lang.nearPlaces }}</label>
          </v-col>
          <v-col cols="1" class="list-up">
            <img class="btnUp" src="../../assets/images/down.svg" />
          </v-col>
        </v-row>
        <v-row v-if="Object.keys(provider).length === 0" class="list-status">
          <v-col class="list-status-form">
            <img class="currentPin" src="../../assets/images/current-pin.svg" />
            <label class="lbListStatus">{{ lang.currentPlaces }}</label>
          </v-col>
          <v-col class="list-status-form">
            <div class="allPin"></div>
            <label class="lbListStatus">{{ lang.allCoverage }}</label>
          </v-col>
          <v-col class="list-status-form last">
            <div class="somePin"></div>
            <label class="lbListStatus">{{ lang.someCoverage }}</label>
          </v-col>
        </v-row>
        <div class="list-details-scroll">
          <v-row
            v-if="Object.keys(provider).length !== 0"
            class="list-detail"
            @click="goToDetail(provider)"
          >
            <v-col cols="10" class="list-hospital-detail">
              <v-btn class="btnHospitalName" @click="goToDistance(item)">{{
                provider.name
              }}</v-btn>
              <label class="lbHospitalAddress">
                {{ address }}
              </label>
              <label class="lbDistance">{{
                lang.distanceFromYou + hospital.distance + lang.meter
              }}</label>
            </v-col>
            <v-col cols="2" class="list-hospital-link">
              <v-btn class="btnHospitalDetail">
                <img src="../../assets/images/go-detail.svg" />
              </v-btn>
            </v-col>
          </v-row>
          <div v-else>
            <v-row
              v-for="item in hospitalList"
              :key="item.code"
              class="list-detail"
              @click="goToDetail(item)"
            >
              <v-col cols="10" class="list-hospital-detail">
                <v-btn class="btnHospitalName" @click="goToDistance(item)">{{
                  item.name
                }}</v-btn>
                <label class="lbDistance">{{
                  lang.distanceFromYou +
                  parseFloat(item.distance.split(' ')[0]) +
                  lang.meter
                }}</label>
              </v-col>
              <v-col cols="2" class="list-hospital-link">
                <v-btn class="btnHospitalDetail">
                  <img src="../../assets/images/go-detail.svg" />
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
    <v-row v-if="isShow && !isloading" justify="center">
      <v-dialog
        v-model="isShow"
        persistent
        max-width="319"
        class="popup-dialog"
      >
        <v-card id="PopUp">
          <v-card-title class="popup-header">
            <img
              v-if="isNotLocation"
              class="icon-header"
              center
              src="../../assets/images/warning.svg"
              alt="Center image"
            />
          </v-card-title>
          <v-card-text class="popup-body">
            {{ content }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn class="modal-default-button" @click="summitPopup()">
              <label class="lbBtnPopUp">
                {{ lang.agree }}
              </label>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'SearchHospital',
  components: {
    Header,
  },
  data() {
    return {
      lang: this.$t('searchHospital'),
      locale: this.$i18n.locale,
      position: {
        latitude: 0,
        longitude: 0,
      },
      hospitalList: [],
      backPath: '',
      provider: {},
      striped: false,
      bordered: false,
      borderless: false,
      outlined: false,
      small: false,
      hover: false,
      dark: false,
      fixed: false,
      footClone: false,
      headVariant: null,
      tableVariant: '',
      noCollapse: false,
      selectMode: 'single',
      content: '',
      goPath: '',
      header: '',
      insurance: {},
      isShow: false,
      isPopup: false,
      isSuccess: false,
      currentPath: '/search-hospital',
      token: '',
      contentAfter: '',
      isOpen: false,
      record_id: '',
      isloading: true,
      search: '',
      center: {},
      markers: [],
      allList: [],
      someList: [],
      groupList: [],
      currentType: '',
      infoWindowPos: null,
      infoWinOpen: false,
      infoOptions: {
        content: '',
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      currentMidx: null,
      mapZoom: 0,
      isSildeOpen: false,
      path: 'hospital',
      address: '',
      pot: '',
      isNotLocation: false,
      hospital: '',
      isNotGPS: false,
      isGetGPS: false,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('search-hospital-page')
    vm.initPage()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getHospital: 'getHospital',
      getType: 'getType',
      getCenter: 'getCenter',
    }),
    ...mapMutations({
      setPath: 'setPath',
      resetHospital: 'resetHospital',
      setCenter: 'setCenter',
    }),
    initPage() {
      const vm = this
      vm.token = vm.$auth.$storage.getLocalStorage('token')
      vm.backPath = vm.getPath()
      if (
        vm.$auth.$storage.getLocalStorage('position') !== undefined &&
        vm.$auth.$storage.getLocalStorage('position') !== '' &&
        vm.$auth.$storage.getLocalStorage('position') !== null
      ) {
        vm.isNotLocation = false
        vm.center.lat = vm.$auth.$storage.getLocalStorage('position').latitude
        vm.center.lng = vm.$auth.$storage.getLocalStorage('position').longitude
        vm.clearInfoWindow()
      } else {
        vm.isloading = false
        vm.isShow = true
        vm.isNotLocation = true
        vm.content = vm.lang.validateLocation
        setTimeout(vm.getNavigator(), 5000)
        vm.isGetGPS = true
      }
    },
    getNavigator() {
      const vm = this
      if (navigator.geolocation) {
        try {
          vm.$nextTick(() => {
            navigator.geolocation.getCurrentPosition((position) => {
              vm.$nextTick(() => {
                if (
                  position.coords !== undefined &&
                  position.coords !== '' &&
                  position.coords !== null
                ) {
                  const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  }
                  vm.$auth.$storage.setLocalStorage('position', location)
                }
              })
            })
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    goBack() {
      const vm = this
      vm.resetHospital()
      vm.$router.push('/')
    },
    checkGetData() {
      const vm = this
      if (
        vm.$auth.$storage.getLocalStorage('currentType') !== undefined &&
        vm.$auth.$storage.getLocalStorage('currentType') !== '' &&
        vm.$auth.$storage.getLocalStorage('currentType') !== null
      ) {
        vm.currentType = vm.$auth.$storage.getLocalStorage('currentType')
        if (
          vm.currentType !== undefined &&
          vm.currentType !== '' &&
          vm.currentType !== null
        ) {
          vm.getHospitalByGroup()
        } else {
          vm.getHospitalLists()
        }
      } else {
        vm.getHospitalLists()
      }
      if (Object.keys(vm.getHospital()).length !== 0) {
        vm.provider = vm.getHospital()
        vm.search = vm.provider.name
        vm.getHospitalAddress()
      }
    },
    setCurrentLocation() {
      const vm = this
      vm.infoWinOpen = false
      vm.$refs.currentMap.$mapPromise.then((map) => {
        map.panTo({ lat: vm.center.lat, lng: vm.center.lng })
      })
    },
    mapGenerate() {
      const vm = this
      for (let i = 0; i < vm.hospitalList.length; i++) {
        let hospitalLatLng = {}
        switch (vm.hospitalList[i].type) {
          case 'ครอบคลุมทั้งหมด':
            hospitalLatLng = {
              id: i,
              lat: parseFloat(vm.hospitalList[i].latitude),
              lng: parseFloat(vm.hospitalList[i].longitude),
            }
            vm.someList.push(hospitalLatLng)
            break
          case 'ครอบคลุมบางรายการ':
            hospitalLatLng = {
              id: i,
              lat: parseFloat(vm.hospitalList[i].latitude),
              lng: parseFloat(vm.hospitalList[i].longitude),
            }
            vm.allList.push(hospitalLatLng)
            break
        }
      }
      vm.isloading = false
    },
    async getGroup() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/hospital-group?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.groupList = res.data
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getHospitalLists() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/hospital?lang=${vm.locale}&latitude=${vm.center.lat}&longitude=${vm.center.lng}`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospitalList = res.data
              vm.mapZoom = 16
              vm.mapGenerate()
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getHospitalByGroup() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/hospital?lang=${vm.locale}&latitude=${vm.center.lat}&longitude=${vm.center.lng}&group=${vm.currentType.id}`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospitalList = res.data
              vm.mapGenerate()
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    onRowSelected(item, index) {
      const vm = this
      vm.provider = item[0]
      vm.$refs.selectableTable.selectRow(index)
    },
    clearSelected() {
      const vm = this
      vm.provider = ''
      vm.$refs.selectableTable.clearSelected()
    },
    setLocation(longitude, latitude) {
      const obj = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      }
      return obj
    },
    getSearch(e) {
      const vm = this
      firebase.analytics().logEvent('search-hospital-button')
      vm.isloading = true
      if (vm.locale === 'th') {
        vm.setPath('/search-hospital')
        vm.$router.push('/search-hospital/select-hospital')
      } else {
        vm.setPath('/en/search-hospital')
        vm.$router.push('/en/search-hospital/select-hospital')
      }
    },
    getCurrentType(current) {
      const vm = this
      vm.isloading = true
      vm.currentType = current
      vm.hospitalList = []
      vm.allList = []
      vm.someList = []
      vm.infoWindowPos = null
      vm.provider = {}
      vm.infoOptions.content = ''
      vm.infoWinOpen = false
      vm.currentMidx = null
      vm.isSildeOpen = false
      vm.getHospitalByGroup()
    },
    getAll() {
      const vm = this
      vm.$auth.$storage.removeLocalStorage('currentType')
      vm.isloading = true
      vm.currentType = ''
      vm.hospitalList = []
      vm.allList = []
      vm.someList = []
      vm.infoWindowPos = null
      vm.provider = {}
      vm.infoOptions.content = ''
      vm.infoWinOpen = false
      vm.currentMidx = null
      vm.isSildeOpen = false
      vm.getHospitalLists()
    },
    getOtherCategories(value) {
      const vm = this
      if (value === 99) {
        if (vm.locale === 'th') {
          vm.setPath('/search-hospital')
          vm.$router.push(`/others/${vm.path}`)
        } else {
          vm.setPath('/en/search-hospital')
          vm.$router.push(`/en/others/${vm.path}`)
        }
      }
    },
    toggleInfoWindow(marker, idx) {
      const vm = this
      vm.mapZoom = 16
      const list = vm.hospitalList
      vm.infoWindowPos = marker
      for (let i = 0; i < list.length; i++) {
        if (
          marker.lat === parseFloat(list[i].latitude) &&
          marker.lng === parseFloat(list[i].longitude)
        ) {
          vm.provider = list[i]
          vm.getHospitalAddress()
          vm.setProviderDistance()
          vm.isSildeOpen = true
          vm.infoOptions.content = list[i].name
          vm.currentMidx = idx
          vm.infoWinOpen = true
          break
        }
      }
    },
    clearInfoWindow() {
      const vm = this
      vm.infoWindowPos = null
      vm.provider = {}
      vm.infoOptions.content = ''
      vm.infoWinOpen = false
      vm.currentMidx = null
      vm.isSildeOpen = false
      vm.mapZoom = 16
      vm.getGroup()
      vm.checkGetData()
    },
    currentPlace(marker, idx) {
      const vm = this
      const list = vm.hospitalList
      vm.infoWindowPos = marker
      for (let i = 0; i < list.length; i++) {
        if (
          marker.lat === parseFloat(list[i].latitude) &&
          marker.lng === parseFloat(list[i].longitude)
        ) {
          vm.provider = list[i]
          vm.infoOptions.content = list[i].name
        }
      }
      if (vm.currentMidx === idx) {
        vm.infoWinOpen = !vm.infoWinOpen
      } else {
        vm.infoWinOpen = true
        vm.currentMidx = idx
      }
    },
    setSlideUp(e) {
      const vm = this
      vm.isSildeOpen = true
    },
    setSlideDown(e) {
      const vm = this
      vm.isSildeOpen = false
      vm.infoWinOpen = false
    },
    goToDistance(value) {
      const vm = this
      const idx = vm.hospitalList.findIndex((e) => e.name === value.name)
      const position = {
        lat: value.latitude,
        lng: value.longitude,
      }
      vm.currentPlace(position, idx)
    },
    setProviderDistance() {
      const vm = this
      vm.isSildeOpen = true
      const idx = vm.hospital.name
      const position = {
        lat: parseFloat(vm.hospital.latitude),
        lng: parseFloat(vm.hospital.longitude),
      }
      vm.infoWindowPos = position
      vm.infoOptions.content = vm.hospital.name
      if (vm.currentMidx === idx) {
        vm.infoWinOpen = !vm.infoWinOpen
      } else {
        vm.infoWinOpen = true
        vm.currentMidx = idx
      }
    },
    goToDetail(value) {
      const vm = this
      if (vm.locale === 'th') {
        vm.setPath('/search-hospital')
        vm.$router.push(`/search-hospital/detail/${value.code}`)
      } else {
        vm.setPath('/en/search-hospital')
        vm.$router.push(`/en/search-hospital/detail/${value.code}`)
      }
    },
    async getHospitalAddress() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/hospital/${vm.provider.code}?lang=${vm.locale}&latitude=${vm.center.lat}&longitude=${vm.center.lng}`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospital = res.data
              vm.setProviderDistance()
              vm.address =
                res.data.address_no +
                ' ' +
                res.data.address_road +
                ' ' +
                res.data.address_amphur +
                ' ' +
                res.data.address_province +
                ' ' +
                res.data.address_postcode
            }
            vm.isloading = false
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    checkLocaitonGPS() {
      const vm = this
      if (vm.isGetGPS) {
        if (
          vm.$auth.$storage.getLocalStorage('position') === undefined ||
          vm.$auth.$storage.getLocalStorage('position') === '' ||
          vm.$auth.$storage.getLocalStorage('position') === null
        ) {
          vm.isNotGPS = true
        }
      } else {
        vm.initPage()
      }
    },
    summitPopup() {
      const vm = this
      vm.checkLocaitonGPS()
      if (vm.isNotGPS) {
        vm.$router.push(vm.backPath)
      } else {
        vm.isShow = false
        vm.isloading = true
        vm.initPage()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#SearchHospital {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .hospital-detail {
    width: 100%;
    height: 100%;
    padding-top: 51px;
    position: fixed;
    overflow: auto;
    background-color: transparent;
  }
  .hospital-search {
    width: 100%;
    padding: 69px 0 19px;
    position: relative;
    overflow: auto;
    background-color: transparent;
    z-index: 99;
    .search-section {
      margin: 0 auto 13px;
      padding: 0 16px;
      .txtSearch {
        width: 100%;
        height: 45px;
        border: none;
        border-radius: 6px;
        box-shadow: #00000029 0 0 6px;
        font-family: 'Anuphan-Medium';
        font-size: 16px;
        color: #a89a9a;
        line-height: 20px;
      }
      .icon {
        position: absolute;
        right: 8%;
        top: 47%;
      }
    }
    .type-section {
      width: 100%;
      padding: 0 16px;
      margin: 0 auto;
      position: relative;
      overflow: auto;
      display: inline-flex;
      overflow-x: scroll;
      .btnGroup {
        width: fit-content;
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
        text-align: center;
      }
      .btnAll {
        width: 88px;
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
        text-align: center;
      }
      .btnOthers {
        width: 60px;
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
        text-align: center;
      }
      .currentGroup {
        background-color: #004899;
        color: #fff;
      }
    }
  }
  .hospital-footer {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    .btnCurrent {
      position: fixed;
      bottom: 110px;
      right: 0;
      width: 44px;
      height: 45px;
      padding: 0;
      margin-right: 16px;
      background-color: transparent;
      border: none;
    }
    .isOpen {
      bottom: auto;
    }
    .slide-list-close {
      width: 100%;
      height: 100%;
      padding: 17px 16px 21px;
      margin: 0 auto;
      display: inline-flex;
      background-color: rgb(255 255 255 / 86%);
      opacity: 1;
      position: fixed;
      bottom: 0;
      max-height: 100px;
      transition: max-height 0.3s ease-out;
      .slide-divider {
        width: 50%;
        height: 5px;
        background-color: #a89a9a;
        border: 1px solid #a89a9a;
        border-radius: 5px;
        margin: 0 auto 11px;
      }
      .list-header {
        width: 100%;
        margin: 0 auto;
        display: inline-flex;
        .lbListHeader {
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          color: #004899;
          line-height: 20px;
        }
      }
      .list-up {
        margin-left: auto;
        float: right;
        .btnUp {
          width: 14.03px;
          height: 20px;
          margin-left: auto;
          border: none;
          background-color: transparent;
          padding: 0;
        }
      }
      .list-status {
        width: 100%;
        padding-bottom: 9px;
        margin: 10px auto 0;
        display: inline-flex;
        .list-status-form {
          width: fit-content;
          display: inline-flex;
          .currentPin {
            width: 10px;
            height: 10px;
            margin-right: 6px;
            margin-top: 5px;
          }
          .allPin {
            width: 10px;
            height: 10px;
            margin-right: 6px;
            margin-top: 5px;
            border-radius: 4px;
            background-color: #2196f3;
          }
          .somePin {
            width: 10px;
            height: 10px;
            margin-right: 6px;
            margin-top: 5px;
            border-radius: 4px;
            background-color: #fdc30b;
          }
          .lbListStatus {
            font-family: 'Anuphan-Regular';
            font-size: 12px;
            color: #2f2e41;
            line-height: 18px;
          }
        }
        .last {
          margin-right: 0;
        }
      }
    }
    .slide-list-open {
      width: 100%;
      height: 100%;
      max-height: 284px;
      padding: 27px 16px 21px;
      margin: 17px auto 0;
      background-color: rgb(255 255 255 / 86%);
      opacity: 1;
      position: fixed;
      bottom: 0;
      min-height: 100px;
      transition: min-height 0.3s ease-out;
      .slide-divider {
        width: 50%;
        height: 5px;
        background-color: #a89a9a;
        border: 1px solid #a89a9a;
        border-radius: 5px;
        margin: 0 auto 11px;
      }
      .list-header {
        width: 100%;
        margin: 0 auto;
        display: inline-flex;
        .list-lb {
          .lbListHeader {
            font-family: 'Anuphan-Regular';
            font-size: 16px;
            color: #004899;
            line-height: 20px;
          }
        }
        .list-up {
          width: fit-content;
          margin: 0 auto;
          .btnUp {
            width: 14.03px;
            height: 20px;
            margin-left: auto;
            border: none;
            background-color: transparent;
            padding: 0;
          }
        }
      }
      .list-status {
        width: 100%;
        padding-bottom: 9px;
        margin: 10px auto 0;
        display: inline-flex;
        border-bottom: 1px solid #00000033;
        .list-status-form {
          width: fit-content;
          display: inline-flex;
          .currentPin {
            width: 10px;
            height: 10px;
            margin-right: 6px;
            margin-top: 5px;
          }
          .allPin {
            width: 10px;
            height: 10px;
            margin-right: 6px;
            margin-top: 5px;
            border-radius: 4px;
            background-color: #2196f3;
          }
          .somePin {
            width: 10px;
            height: 10px;
            margin-right: 6px;
            margin-top: 5px;
            border-radius: 4px;
            background-color: #fdc30b;
          }
          .lbListStatus {
            font-family: 'Anuphan-Regular';
            font-size: 12px;
            color: #2f2e41;
            line-height: 18px;
          }
        }
        .last {
          margin-right: 0;
        }
      }
      .list-details-scroll {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        .list-detail {
          width: 100%;
          padding: 10px 0;
          margin: 0 auto;
          display: inline-flex;
          border-bottom: 1px solid #00000033;
          .list-hospital-detail {
            width: 100%;
            .lbHospitalName {
              font-family: 'Anuphan-Regular';
              font-size: 16px;
              color: #004899;
              line-height: 18px;
              display: block;
            }
            .btnHospitalName {
              height: fit-content;
              font-family: 'Anuphan-Regular';
              font-size: 16px;
              color: #004899;
              line-height: 18px;
              padding: 0;
              border: none;
              background-color: transparent;
              display: block;
              text-align: left;
              letter-spacing: 0;
            }
            .lbHospitalAddress {
              padding-top: 10px;
              font-family: 'Anuphan-Regular';
              font-size: 14px;
              color: #2f2e41;
              line-height: 18px;
              word-wrap: break-word;
            }
            .lbDistance {
              font-family: 'Anuphan-Regular';
              font-size: 12px;
              color: #7a828d;
              line-height: 18px;
            }
          }
          .list-hospital-link {
            max-width: 65px;
            margin-left: auto;
            padding: 5px 0;
            .btnHospitalDetail {
              width: 28px;
              height: 28px;
              padding: 0;
              border: none;
              background-color: transparent;
            }
          }
        }
      }
    }
    .smallSlide {
      max-height: 155px;
      padding: 22px 17px;
      .list-details-scroll {
        .list-detail {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/search-hospital.css');
</style>
