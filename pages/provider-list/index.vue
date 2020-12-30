<template>
  <div id="ProviderList">
    <Header :title="lang.title" :backPath="goBack()" />
    <div class="provider-detail">
      <div class="provider-search">
        <v-text-field
          v-model="search"
          :label="lang.searchPlaceholder"
          type="search"
          class="txtSearch"
          append-icon="mdi-magnify"
          solo
          @click:append="getSearch()"
          @keyup="getSearch()"
        ></v-text-field>
      </div>
    </div>
    <div class="list-detail">
      <v-progress-circular
        v-if="isloading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div v-if="!isloading">
        <div v-if="result.length !== 0">
          <b-table
            ref="selectableProvider"
            class="table-provider"
            thead-class="thead-provider"
            tbody-class="tbody-provider"
            :items="result"
            :fields="fields"
            selectable
            :select-mode="selectMode"
            @row-selected="onRowSelected"
          ></b-table>
          <div v-if="result.length === 0" class="no-data">
            <label class="lbNoData">{{ lang.providerValidate }}</label>
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
            <label class="lbNoData">{{ lang.providerValidate }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="provider-footer">
      <b-btn
        type="submit"
        variant="primary"
        class="btnSummit"
        :class="{ disabled: Object.keys(hospital).length === 0 }"
        @click="Object.keys(hospital).length !== 0 ? saveHospital() : ''"
      >
        {{ lang.btnConfirm }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'ProviderList',
  components: {
    Header,
  },
  data() {
    return {
      lang: this.$t('providerList'),
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
      currentPath: '/provider-list',
      token: '',
      contentAfter: '',
      isOpen: false,
      record_id: '',
      isloading: true,
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('provider-list-page')
    vm.backPath = vm.getPath()
    vm.position = vm.$auth.$storage.getLocalStorage('position')
    vm.insurance = vm.getInsurance()
    vm.getHospital()
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
      getInsurance: 'getInsurance',
    }),
    ...mapMutations({
      setHospital: 'setHospital',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        return '/e-claim'
      } else {
        return '/en/e-claim'
      }
    },
    async getHospital() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/hospital?lang=${vm.locale}}`).then((response) => {
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
      vm.hospital = item[0]
      vm.$refs.selectableProvider.selectRow(index)
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
      firebase.analytics().logEvent('save-provider-button')
      vm.setHospital(vm.hospital)
      if (vm.locale === 'th') {
        vm.$router.push('/e-claim')
      } else {
        vm.$router.push('/en/e-claim')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#ProviderList {
  height: 100%;
  position: relative;
  .provider-detail {
    width: 100%;
    max-height: 320px;
    overflow: auto;
    padding: 69px 0 0;
    background-color: #f1f8ff;
    .provider-search {
      width: 100%;
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
  }
  .provider-footer {
    width: 100%;
    height: 100%;
    padding: 0 28px;
    margin: 0 auto;
    position: fixed;
    top: 87%;
    .lbFooter {
      padding-bottom: 11px;
      font-family: 'Anuphan-Regular';
      font-size: 14px;
      color: #000;
      line-height: 24px;
      text-align: center;
    }
    .btnSummit {
      width: 100%;
      height: 45px;
      padding: 10px 14px;
      background-color: #3ba9fe;
      border-radius: 6px;
      border: none;
      font-family: 'Anuphan-Medium';
      font-size: 18px;
      color: #fff;
      line-height: 24px;
      text-align: center;
    }
    .disabled {
      cursor: not-allowed;
    }
  }
}
</style>
<style>
@import url('../../assets/css/provider-list.css');
</style>
