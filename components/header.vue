<template>
  <v-row fixed class="header-nav">
    <v-col class="float-left back-col" sm="1">
      <v-btn max-width="11" max-height="22" class="btnBack" @click="goBack()">
        <img class="back" src="../assets/images/back.svg" />
      </v-btn>
    </v-col>
    <v-col
      v-if="
        route === 'edit-card' || route === 'edit-card-family' || isSearchIDCard
      "
      sm="10"
      class="title-col"
      justify="center"
    >
      <label class="lbHeader">{{ title }}</label>
    </v-col>
    <v-col v-else sm="11" class="title-col" justify="center">
      <label class="lbHeader">{{ title }}</label>
    </v-col>
    <v-col
      v-if="route === 'edit-card' || route === 'edit-card-family'"
      sm="1"
      class="btn-col"
      justify="center"
    >
      <v-btn class="btnDelete" @click="confirmDeleteCard()">
        <img class="delete-icon" src="../assets/images/delete-card.svg" />
      </v-btn>
    </v-col>
    <v-col v-if="isSearchIDCard" sm="1" class="btn-col" justify="center">
      <v-btn class="btnDelete" @click="goToSearchID()">
        <img class="delete-icon" src="../assets/images/search-idcard.svg" />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: String,
    backPath: String,
    isNotCard: Boolean,
  },
  data() {
    return {
      route: '',
      token: '',
      isActivate: false,
      isSearchIDCard: false,
    }
  },
  mounted() {
    this.route = this.$route.path.split('/')[1]
    this.$nextTick(() => {
      if (this.route === 'family-coverages' || this.route === 'coverages') {
        this.isActivate = this.$auth.$storage.getLocalStorage('isActivate')
        if (!this.isActivate) {
          this.isSearchIDCard = true
        }
      }
    })
  },
  methods: {
    goBack() {
      const vm = this
      if (
        vm.backPath === '/coverages/eclaim' ||
        vm.backPath === '/coverages' ||
        vm.backPath === '/en/coverages/eclaim' ||
        vm.backPath === '/en/coverages'
      ) {
        vm.$auth.$storage.removeLocalStorage('e-claim')
      }
      vm.$router.push(vm.backPath)
    },
    confirmDeleteCard() {
      this.$nextTick(() => {
        this.$emit('checkDelete', true)
      })
    },
    goToSearchID() {
      this.$nextTick(() => {
        this.$emit('goToSearch')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header-nav {
  width: 100%;
  height: 51px;
  padding: 14px 32px;
  margin: 0 auto;
  background-color: #3ba9fc;
  position: fixed;
  z-index: 999;
  .back-col {
    max-width: fit-content;
    .btnBack {
      min-width: fit-content;
      padding: 0;
      .back {
        max-height: 22px;
      }
    }
  }
  .title-col {
    max-width: fit-content;
    line-height: 23px;
    text-align: center;
    margin: 0 auto;
    .lbHeader {
      font-family: 'Anuphan-Regular';
      font-size: 18px;
      color: #fff;
      line-height: 23px;
      text-align: center;
      margin-bottom: 0;
    }
  }
  .btn-col {
    max-width: fit-content;
    line-height: 21px;
    text-align: right;
    .btnDelete {
      width: 20px;
      height: 21px;
    }
  }
}
</style>
<style>
@import url('../assets/css/header.css');
</style>
