<template>
  <div id="Sympton">
    <Header :title="lang.title" :backPath="goBack()" />
    <div class="sympton-detail">
      <div class="sympton-search">
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
        v-if="isloadingDetail"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div v-if="!isloadingDetail">
        <div v-if="result.length !== 0">
          <b-table
            ref="selectableSympton"
            class="table-sympton"
            thead-class="thead-sympton"
            tbody-class="tbody-sympton"
            :items="result"
            :fields="fields"
            selectable
            :select-mode="selectMode"
            @row-selected="onSymptonSelected"
          ></b-table>
          <div v-if="result.length === 0" class="no-data">
            <label class="lbNoData">{{ lang.symptonFindValidate }}</label>
          </div>
        </div>
        <div v-else>
          <b-table
            ref="selectableSympton"
            class="table-sympton"
            thead-class="thead-sympton"
            tbody-class="tbody-sympton"
            :items="sympton"
            :fields="fields"
            selectable
            :select-mode="selectMode"
            @row-selected="onSymptonSelected"
          ></b-table>
          <div v-if="sympton.length === 0" class="no-data">
            <label class="lbNoData">{{ lang.symptonFindValidate }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'Sympton',
  components: {
    Header,
  },
  data() {
    return {
      lang: this.$t('sympton'),
      locale: this.$i18n.locale,
      search: '',
      isloadingDetail: true,
      sympton: [],
      token: '',
      symp: '',
      fields: [{ key: 'name', label: '' }],
      selectMode: 'single',
      result: [],
    }
  },
  mounted() {
    const vm = this
    firebase.analytics().logEvent('sympton-page')
    vm.resetSympton()
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.getSympton()
  },
  methods: {
    ...mapMutations({
      setSympton: 'setSympton',
      resetSympton: 'resetSympton',
    }),
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        return '/e-claim'
      } else {
        return '/en/e-claim'
      }
    },
    async getSympton() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/claim/symptom?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            vm.sympton = res.data
            vm.isloadingDetail = false
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloadingDetail = false
      }
    },
    onSymptonSelected(item, index) {
      const vm = this
      firebase.analytics().logEvent('sympton-selected')
      vm.symp = item[0].name
      vm.$refs.selectableSympton.selectRow(index)
      vm.setSympton(vm.symp)
      if (vm.locale === 'th') {
        vm.$router.push('/e-claim')
      } else {
        vm.$router.push('/en/e-claim')
      }
    },
    clearSymptonSelected() {
      const vm = this
      vm.symp = ''
      vm.$refs.selectableSympton.clearSelected()
    },
    getSearch(e) {
      const vm = this
      vm.isloadingDetail = true
      vm.searchList()
    },
    async searchList() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/claim/symptom?lang=${vm.locale}&keyword=${vm.search}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.result = res.data
              vm.isloadingDetail = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloadingDetail = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#Sympton {
  position: relative;
  .sympton-detail {
    width: 100%;
    height: 100%;
    padding: 69px 0 0;
    overflow: auto;
    background-color: #f1f8ff;
    .sympton-search {
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
    .loading-detail {
      position: absolute;
      top: 47%;
      left: 47%;
    }
  }
}
</style>
<style>
@import url('../../assets/css/symptom.css');
</style>
