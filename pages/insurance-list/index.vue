<template>
  <div v-if="isAddCard || isEditCard" id="InsuranceList">
    <Header :title="lang.title" :backPath="backPath" />
    <div class="insurance-detail">
      <div class="insurance-search">
        <v-text-field
          v-model="search"
          :label="lang.searchPlaceholder"
          type="search"
          class="txtSearch"
          append-icon="mdi-magnify"
          solo
          @click="getSearch"
        ></v-text-field>
      </div>
    </div>
    <div class="list-detail">
      <v-progress-circular
        v-if="isloading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <b-tabs
        v-if="!isloading && companies.length !== 0 && banks.length !== 0"
        id="coverage-tab"
        no-body
      >
        <b-tab :title="lang.insuranceNameTitle">
          <div v-if="resultCompany.length !== 0">
            <b-table
              ref="selectableCompany"
              class="table-insurance"
              thead-class="thead-insurance"
              tbody-class="tbody-insurance"
              :items="resultCompany"
              :fields="fields"
              selectable
              :select-mode="selectMode"
              @row-selected="onInsuranceSelected"
            ></b-table>
          </div>
          <div v-else>
            <b-table
              ref="selectableCompany"
              class="table-insurance"
              thead-class="thead-insurance"
              tbody-class="tbody-insurance"
              :items="companies"
              :fields="fields"
              selectable
              :select-mode="selectMode"
              @row-selected="onInsuranceSelected"
            ></b-table>
            <div v-if="companies.length === 0" class="no-data">
              <label class="lbNoData">{{ lang.notInsuranceList }}</label>
            </div>
          </div>
        </b-tab>
        <b-tab :title="lang.bankNameTitle">
          <div v-if="resultBank.length !== 0">
            <b-table
              ref="selectableBank"
              class="table-insurance"
              thead-class="thead-insurance"
              tbody-class="tbody-insurance"
              :items="resultBank"
              :fields="fields"
              selectable
              :select-mode="selectMode"
              @row-selected="onBanksSelected"
            ></b-table>
          </div>
          <div v-else>
            <b-table
              ref="selectableBank"
              class="table-insurance"
              thead-class="thead-insurance"
              tbody-class="tbody-insurance"
              :items="banks"
              :fields="fields"
              selectable
              :select-mode="selectMode"
              @row-selected="onBanksSelected"
            ></b-table>
            <div v-if="banks.length === 0" class="no-data">
              <label class="lbNoData">{{ lang.notBankList }}</label>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
export default {
  name: 'InsuranceList',
  data() {
    return {
      lang: this.$t('insuranceList'),
      locale: this.$i18n.locale,
      search: '',
      isloading: true,
      isloadingDetail: true,
      companies: [],
      banks: [],
      token: '',
      insurance: '',
      fields: [{ key: 'name', label: '' }],
      selectMode: 'single',
      resultCompany: [],
      resultBank: [],
      backPath: '',
      isAddCard: false,
      isEditCard: false,
    }
  },
  mounted() {
    const vm = this
    vm.isAddCard = vm.getIsAddCard()
    vm.isEditCard = vm.getIsEditCard()
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    firebase.analytics().logEvent('insurer-list-page')
    if (vm.isAddCard || vm.isEditCard) {
      vm.getCompanies()
      vm.getBanks()
    }
  },
  methods: {
    ...mapMutations({
      setCompanyName: 'setCompanyName',
    }),
    ...mapGetters({
      getPath: 'getPath',
      getIsAddCard: 'getIsAddCard',
      getIsEditCard: 'getIsEditCard',
    }),
    async getCompanies() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/companies?lang=${vm.locale}`).then((response) => {
          const res = response.data
          vm.companies = res.data
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getBanks() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/bank?lang=${vm.locale}`).then((response) => {
          const res = response.data
          vm.banks = res.data
          vm.isloading = false
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    onInsuranceSelected(item, index) {
      const vm = this
      vm.insurance = item[0]
      vm.$refs.selectableCompany.selectRow(index)
      vm.setCompanyName(vm.insurance)
      vm.$router.push(vm.backPath)
    },
    clearInsuranceSelected() {
      const vm = this
      vm.insurance = ''
      vm.$refs.selectableCompany.clearSelected()
    },
    onBanksSelected(item, index) {
      const vm = this
      vm.insurance = item[0]
      vm.$refs.selectableBank.selectRow(index)
      vm.setCompanyName(vm.insurance)
      vm.$router.push(vm.backPath)
    },
    clearBanksSelected() {
      const vm = this
      vm.insurance = ''
      vm.$refs.selectableBank.clearSelected()
    },
    getSearch(e) {
      const vm = this
      vm.isloading = true
      firebase.analytics().logEvent('search-insurer-list')
      vm.searchList()
    },
    searchList() {
      const vm = this
      vm.resultCompany = vm.companies.filter((e) => e.name.match(vm.search))
      vm.resultBank = vm.banks.filter((e) => e.name.match(vm.search))
      vm.isloading = false
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#InsuranceList {
  height: 100%;
  position: relative;
  .insurance-detail {
    height: 100%;
    overflow: auto;
    padding: 69px 0 0;
    background-color: #f1f8ff;
    .insurance-search {
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
    .list-detail {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
<style>
@import url('../../assets/css/insurance-list.css');
</style>
