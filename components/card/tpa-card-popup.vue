<template>
  <v-container>
    <v-container>
      <v-card
        class="tpa-card"
        max-width="320"
        max-height="190"
        :img="!card.inapp ? card.bg : ''"
        :class="{
          'inapp-card': card.inapp && !checkExpiredDateCard(card.to),
          'expire-card': card.inapp && checkExpiredDateCard(card.to),
          notBG: card.inapp,
          defaultBG:
            !card.inapp &&
            (card.bg === undefined || card.bg === '' || card.bg === null),
          hideDetail: !isActivate,
        }"
      >
        <v-row
          v-if="
            isActivate &&
            !card.inapp &&
            (card.bg === undefined || card.bg === '' || card.bg === null)
          "
        >
          <v-col cols="10">
            <v-card-title
              class="card-header titleHideDetail"
              :class="{
                openDetail: openDetail || isActivate,
                white: card.inapp,
              }"
              :style="`color: ${card.color};`"
            >
              {{ card.insurerName }}
            </v-card-title>
          </v-col>
        </v-row>
        <v-row v-if="(openDetail || isActivate) && card.inapp">
          <v-col cols="10">
            <v-card-title
              class="card-header titleHideDetail"
              :class="{
                openDetail: openDetail || isActivate,
                white: card.inapp,
              }"
              :style="`color: ${card.color};`"
            >
              {{ card.insurerName }}
            </v-card-title>
          </v-col>
          <v-col cols="2" class="float-right edit-col">
            <v-btn
              class="btnEdit"
              max-width="20"
              max-height="20"
              @click="goToCardDetail(card.cardId, card.ownerType)"
            >
              <img class="edit" src="../../assets/images/edit.svg" />
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title
          v-if="openDetail || isActivate"
          class="card-header"
          :style="`color: ${card.color};`"
          :class="{
            white: card.inapp,
          }"
        >
          {{ card.firstName + ' ' + card.lastName }}
        </v-card-title>
        <v-card-subtitle v-if="!openDetail && !isActivate" class="lbDetail">
          <div
            v-if="card.type === 'Group Insurance'"
            class="typeHideDetail"
            :style="`color: ${card.color};`"
          >
            {{ locale === 'en' ? card.type : 'บัตรประกันแบบกลุ่ม' }}
          </div>
          <div
            v-if="card.type === 'Individual Policy'"
            class="typeHideDetail"
            :style="`color: ${card.color};`"
          >
            {{ locale === 'en' ? card.type : 'บัตรประกันรายบุคคล' }}
          </div>
          <div
            v-if="card.type === 'Self-Insured'"
            class="typeHideDetail"
            :style="`color: ${card.color};`"
          >
            {{ locale === 'en' ? card.type : 'บัตรประกันภัยตนเอง' }}
          </div>
        </v-card-subtitle>
        <v-card-subtitle
          v-if="(openDetail || isActivate) && !card.inapp"
          class="insurance-name"
          :style="`color: ${card.color};`"
        >
          {{ card.insurerName }}
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col class="detail-col">
              <label
                v-if="card.type === 'Self-Insured'"
                class="detail"
                :class="{ white: card.inapp && (openDetail || isActivate) }"
                :style="`color: ${card.color};`"
              >
                {{ lang.empID }}
              </label>
              <label
                v-else
                class="detail"
                :class="{ white: card.inapp && (openDetail || isActivate) }"
                :style="`color: ${card.color};`"
              >
                {{ lang.polNo }}
              </label>
            </v-col>
            <v-col class="data-col">
              <label
                v-if="card.type === 'Self-Insured'"
                class="detail polno"
                :class="{ white: card.inapp && (openDetail || isActivate) }"
                :style="`color: ${card.color};`"
              >
                {{
                  !openDetail && !isActivate
                    ? hidePolNo(card.staffNo)
                    : card.staffNo
                }}
              </label>
              <label
                v-else
                class="detail polno"
                :class="{ white: card.inapp && (openDetail || isActivate) }"
                :style="`color: ${card.color};`"
              >
                {{
                  !openDetail && !isActivate
                    ? hidePolNo(card.polNo)
                    : card.polNo
                }}
              </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="detail-col">
              <label
                class="detail"
                :class="{ white: card.inapp }"
                :style="`color: ${card.color};`"
              >
                {{ lang.period }}
              </label>
            </v-col>
            <v-col class="detail-col">
              <label
                v-if="!openDetail && !isActivate"
                class="detail"
                :style="`color: ${card.color};`"
                :class="{ hideperiod: !openDetail || !isActivate }"
              >
                -
              </label>
              <v-row v-if="openDetail || isActivate">
                <v-col v-if="locale === 'th'" cols="2">
                  <label
                    class="detail title-period"
                    :class="{ white: card.inapp }"
                    :style="`color: ${card.color};`"
                  >
                    {{ lang.fromDate }}
                  </label>
                </v-col>
                <v-col v-else>
                  <label
                    class="detail"
                    :class="{ white: card.inapp }"
                    :style="`color: ${card.color};`"
                  >
                    {{ lang.fromDate }}
                  </label>
                </v-col>
                <v-col v-if="locale === 'th'" cols="2">
                  <label
                    class="detail text-right"
                    :class="{ white: card.inapp, period: locale === 'th' }"
                    :style="`color: ${card.color};`"
                  >
                    {{ card.from }}
                  </label>
                </v-col>
                <v-col v-else>
                  <label
                    class="detail text-right"
                    :class="{ white: card.inapp, period: locale === 'th' }"
                    :style="`color: ${card.color};`"
                  >
                    {{ card.from }}
                  </label>
                </v-col>
              </v-row>
              <v-row v-if="openDetail || isActivate">
                <v-col v-if="locale === 'th'" cols="2">
                  <label
                    class="detail title-period"
                    :class="{ white: card.inapp }"
                    :style="`color: ${card.color};`"
                  >
                    {{ lang.toDate }}
                  </label>
                </v-col>
                <v-col v-else>
                  <label
                    class="detail"
                    :class="{ white: card.inapp }"
                    :style="`color: ${card.color};`"
                  >
                    {{ lang.toDate }}
                  </label>
                </v-col>
                <v-col v-if="locale === 'th'" cols="2">
                  <label
                    class="detail text-right"
                    :class="{ white: card.inapp, period: locale === 'th' }"
                    :style="`color: ${card.color};`"
                  >
                    {{ card.to }}
                  </label>
                </v-col>
                <v-col v-else>
                  <label
                    class="detail text-right"
                    :class="{ white: card.inapp, period: locale === 'th' }"
                    :style="`color: ${card.color};`"
                  >
                    {{ card.to }}
                  </label>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
export default {
  name: 'TPACard',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    card: Object,
    openDetail: Boolean,
  },
  data() {
    return {
      isActivate: false,
      lang: this.$t('card'),
      locale: this.$i18n.locale,
      idCard: '',
    }
  },
  mounted() {
    const vm = this
    vm.resetIsEditCard()
    vm.isActivate = vm.$auth.$storage.getLocalStorage('isActivate')
  },
  methods: {
    ...mapGetters({
      getActivate: 'getActivate',
    }),
    ...mapMutations({
      setPath: 'setPath',
      setIsEditCard: 'setIsEditCard',
      resetIsEditCard: 'resetIsEditCard',
    }),
    hidePolNo(pol) {
      if (pol !== '') {
        const lg = pol.length
        const first = pol.substr(0, 2)
        const last = pol.substr(lg - 2, lg)
        return first + 'xx xxxx xx' + last
      } else {
        return 'xxxx xxxx xxxx'
      }
    },
    goToCardDetail(id, ownerType) {
      const vm = this
      firebase.analytics().logEvent('card-detail')
      vm.setIsEditCard(true)
      if (!vm.isActivate) {
        vm.idCard = vm.$auth.$storage.getLocalStorage('idcard')
      }
      switch (ownerType) {
        case 'member':
          if (vm.locale === 'th') {
            vm.setPath(vm.isActivate ? '/coverages' : `/coverages/${vm.idCard}`)
            vm.$router.push(`/edit-card/${id}`)
          } else if (vm.locale === 'en') {
            vm.setPath(
              vm.isActivate ? '/en/coverages' : `/en/coverages/${vm.idCard}`
            )
            vm.$router.push(`/en/edit-card/${id}`)
          }
          break
        case 'family':
          if (vm.locale === 'th') {
            vm.setPath(
              vm.isActivate
                ? '/family-coverages'
                : `/family-coverages/${vm.idCard}`
            )
            vm.$router.push(`/edit-card-family/${id}`)
          } else if (vm.locale === 'en') {
            vm.setPath(
              vm.isActivate
                ? '/en/family-coverages'
                : `/en/family-coverages/${vm.idCard}`
            )
            vm.$router.push(`/en/edit-card-family/${id}`)
          }
          break
      }
    },
    checkExpiredDateCard(exp) {
      let resultDay = false
      let resultMonth = false
      let resultYear = false
      const toDay = parseInt(exp.split('/')[0])
      const toMonth = parseInt(exp.split('/')[1])
      const toYear = parseInt(exp.split('/')[2])
      const now = new Date()
      const nowDate =
        now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear()
      const day = parseInt(nowDate.split('/')[0])
      const month = parseInt(nowDate.split('/')[1])
      const year = parseInt(nowDate.split('/')[2])
      if (toYear <= year) {
        resultYear = true
      }
      if (toMonth <= month) {
        resultMonth = true
      }
      if (resultYear && resultMonth) {
        if (toDay === day) {
          resultDay = true
        } else if (toDay <= day) {
          resultDay = true
        } else if (toDay >= day && resultMonth) {
          resultDay = true
        }
      }
      return resultYear && resultMonth && resultDay
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  height: 100%;
}
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0;
}
.row {
  margin: 0 auto;
}
label {
  margin-bottom: 0;
}
.expire-card {
  padding: 18px 20px 42px !important;
  background-image: url('../../assets/images/bg-grey.png');
  background-color: transparent;
  background-size: 100%;
}
.expire-inapp-card {
  padding: 18px 20px 42px !important;
  background-image: url('../../assets/images/bg-grey.png');
  background-color: transparent;
  background-size: 100%;
}
.inapp-card {
  padding: 18px 20px 42px !important;
  background-image: url('../../assets/images/bg-white.png');
  background-color: transparent !important;
  background-size: 100%;
}
.defaultBG {
  padding: 25px 12px 42px 19px !important;
  background-image: url('../../assets/images/TPA_Standard_Card.jpg');
  background-color: transparent;
  background-size: 100%;
}
.tpa-card {
  width: 100%;
  height: 100%;
  min-height: 190px;
  margin: 0 auto;
  padding: 45px 12px 42px 19px;
  text-align: left;
  box-shadow: none !important;
  .white {
    color: #2f2e41 !important;
  }
  .card-header {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    font-family: 'Anuphan-Regular';
    font-size: 18px;
    color: #fff;
    line-height: 23px;
    letter-spacing: 0.22px;
    border: none;
    background-color: transparent;
  }
  .insurance-name {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    font-family: 'Anuphan-Regular';
    font-size: 12px;
    color: #fff;
    line-height: 15px;
    letter-spacing: 0.14px;
  }
  .detail-col {
    line-height: 15px;
    .detail {
      font-family: 'Anuphan-Regular';
      font-size: 12px;
      line-height: 15px;
    }
    .polno {
      word-break: break-all;
    }
    .period {
      padding-left: 30px;
    }
    .title-period {
      padding-left: 20px;
    }
    .hideperiod {
      padding-left: 20px;
    }
  }
  .data-col {
    padding-left: 33px;
    line-height: 15px;
    .detail {
      font-family: 'Anuphan-Regular';
      font-size: 12px;
      line-height: 15px;
    }
    .period {
      padding-left: 20px;
    }
  }
  .insurer-header {
    padding-bottom: 26px;
    font-family: 'Anuphan-Bold';
    font-size: 12px;
    color: #2f2e41;
    line-height: 13px;
    letter-spacing: 0.12px;
  }
  .btnEdit {
    background-color: transparent !important;
    margin: 0;
    padding: 0;
    min-width: 20px;
  }
  .edit-col {
    max-width: 20px;
    margin-left: auto;
  }
  .titleHideDetail {
    padding-bottom: 36px;
    font-family: 'Anuphan-Bold';
    font-size: 10px;
    color: #2f2e41;
    line-height: 13px;
    letter-spacing: 0.12px;
  }
  .openDetail {
    padding-bottom: 13px;
  }
  .typeHideDetail {
    padding-bottom: 3px;
    font-family: 'Anuphan-Regular';
    font-size: 12px;
    color: #2c2f33;
    line-height: 15px;
    letter-spacing: 0.14px;
  }
  .textHideDetail {
    padding-bottom: 3px;
    font-family: 'Anuphan-Regular';
    font-size: 12px;
    color: #2c2f33;
    line-height: 15px;
    letter-spacing: 0px;
  }
  .nameInApp {
    padding-bottom: 17px;
    font-family: 'Anuphan-Regular';
    font-size: 18px;
    color: #2f2e41;
    line-height: 23px;
    letter-spacing: 0.22px;
  }
}
.hideDetail {
  padding-top: 60px;
}
</style>
