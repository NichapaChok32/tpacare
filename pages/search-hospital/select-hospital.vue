<template>
  <div id="HospitalList">
    <Header :title="lang.title" :backPath="goBack()" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="!isloading" class="provider-detail">
      <v-row class="provider-search">
        <v-text-field
          v-model="search"
          :label="lang.searchPlaceholder"
          type="search"
          class="txtSearch"
          append-icon="mdi-magnify"
          solo
          @click:append="getSearch()"
        ></v-text-field>
      </v-row>
    </v-container>
    <div v-if="!isloading" class="list-detail">
      <div v-if="result.length !== 0">
        <label v-if="search !== ''" class="no-data">
          {{ lang.resultKeyword + '"' + search + '"' }}
        </label>
        <b-table
          ref="selectableProvider"
          class="table-provider"
          thead-class="thead-provider"
          tbody-class="tbody-provider"
          :items="result"
          :fields="fields"
          selectable
          :select-mode="selectMode"
          :class="{ search: search !== '' }"
          @row-selected="onRowSelected"
        ></b-table>
        <div v-if="result.length === 0" class="no-data">
          <label class="lbNoData">{{ lang.notFound }}</label>
        </div>
      </div>
      <div v-else>
        <b-table
          ref="selectableProvider"
          class="table-provider"
          thead-class="thead-provider"
          tbody-class="tbody-provider"
          :items="hospitalList"
          :fields="fields"
          selectable
          :select-mode="selectMode"
          @row-selected="onRowSelected"
        ></b-table>
        <div v-if="hospitalList.length === 0" class="no-data">
          <label class="lbNoData">{{ lang.notFound }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Header from '../../components/header'
export default {
  name: 'HospitalList',
  components: {
    Header,
  },
  data() {
    return {
      lang: this.$t('selectHospital'),
      locale: this.$i18n.locale,
      position: {},
      search: '',
      hospitalList: [],
      result: [],
      backPath: '',
      hospital: {},
      fields: [{ key: 'name', label: '' }],
      tableVariants: [
        'primary',
        'secondary',
        'info',
        'danger',
        'warning',
        'success',
        'light',
        'dark',
      ],
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
      currentPath: '/select-hospital',
      token: '',
      contentAfter: '',
      isOpen: false,
      record_id: '',
      isloading: true,
    }
  },
  mounted() {
    const vm = this
    if (
      vm.$auth.$storage.getLocalStorage('position') !== undefined ||
      vm.$auth.$storage.getLocalStorage('position') !== '' ||
      vm.$auth.$storage.getLocalStorage('position') !== null
    ) {
      vm.position = vm.$auth.$storage.getLocalStorage('position')
      vm.insurance = vm.getInsurance()
      vm.getHospital()
    } else {
      vm.$nextTick(() => {
        vm.getNavigator()
        vm.position = vm.$auth.$storage.getLocalStorage('position')
        vm.insurance = vm.getInsurance()
        vm.getHospital()
      })
    }
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getInsurance: 'getInsurance',
    }),
    ...mapMutations({
      setHospital: 'setHospital',
      setPath: 'setPath',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        vm.setPath('/')
        return '/search-hospital'
      } else if (vm.locale === 'en') {
        vm.setPath('/en')
        return '/en/search-hospital'
      }
    },
    getNavigator() {
      const vm = this
      if (navigator.geolocation) {
        try {
          vm.$nextTick(() => {
            navigator.geolocation.getCurrentPosition((position) => {
              vm.$nextTick(() => {
                const location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
                vm.$auth.$storage.setLocalStorage('position', location)
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
    async getHospital() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(
            `/hospital?lang=${vm.locale}&latitude=${vm.position.latitude}&longitude=${vm.position.longitude}`
          )
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.hospitalList = res.data
              vm.isloading = false
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
      vm.$refs.selectableProvider.selectRow(index)
      vm.hospital = item[0]
      vm.saveHospital()
    },
    clearSelected() {
      const vm = this
      vm.hospital = ''
      vm.$refs.selectableProvider.clearSelected()
    },
    getSearch(e) {
      const vm = this
      vm.isloading = true
      vm.searchList()
    },
    async searchList() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/hospital-search?lang=${vm.locale}&keyword=${vm.search}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.result = res.data
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    saveHospital() {
      const vm = this
      vm.setHospital(vm.hospital)
      if (vm.locale === 'th') {
        vm.setPath('/')
        vm.$router.push('/search-hospital')
      } else {
        vm.setPath('/en')
        vm.$router.push('/en/search-hospital')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#HospitalList {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .provider-detail {
    width: 100%;
    max-height: 320px;
    overflow: auto;
    padding: 69px 0 0;
    background-color: #f1f8ff;
    .provider-search {
      width: 100%;
      margin: 0 auto;
      padding: 0 16px 19px;
      .txtSearch {
        position: relative;
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
        top: 13%;
      }
    }
  }
  .list-detail {
    width: 100%;
    height: 100%;
    overflow: auto;
    .table-provider {
      width: 100%;
      margin-bottom: 0;
    }
    .no-data {
      width: 100%;
      height: 45px;
      padding: 13px 0 11px;
      font-family: 'Anuphan-Regular';
      font-size: 16px;
      color: #617d8c;
      line-height: 20px;
      border-bottom: 1px solid #e6f2fe;
      background-color: #fff;
      text-align: center;
    }
  }
}
</style>
<style>
@import url('../../assets/css/select-hospital.css');
</style>
