<template>
  <div v-if="open" id="TpaPopUp">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <label class="lbHeader">
                {{ header }}
              </label>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <TPACard :profile="insurance" />
              <label v-if="!isUseCard" class="lbBody">
                {{ content }}
                <br />
                {{ hospital.name }}
              </label>
              <label v-if="isUseCard" class="lbBody">
                {{ content }}
                <span>
                  <span>{{ '(' + minutes }}</span>
                  <span>:</span>
                  <span>{{ seconds + ')' }}</span>
                </span>
              </label>
            </slot>
          </div>
          <div class="modal-footer">
            <slot v-if="!isUseCard" name="footer">
              <v-btn
                class="btnModal btnCancel"
                variant="outline-primary"
                @click="cancel()"
              >
                {{ lang.btnCancel }}
              </v-btn>
              <v-btn
                class="btnModal btnSummit"
                variant="primary"
                @click="agreeUsed()"
              >
                {{ lang.btnConfirm }}
              </v-btn>
            </slot>
            <slot v-if="isUseCard" name="footer">
              <v-btn
                class="btnModal btnCancel"
                variant="outline-primary"
                @click="cancelCard()"
              >
                {{ lang.btnCancel }}
              </v-btn>
              <v-btn
                class="btnModal btnSummit btnUseCard"
                variant="primary"
                @click="unUsedCard()"
              >
                {{ lang.btnClose }}
              </v-btn>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TPACard from '../../components/card/tpa-card'
export default {
  name: 'TpaPopUp',
  components: {
    TPACard,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: String,
    // eslint-disable-next-line vue/require-default-prop
    path: String,
    open: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    insurance: Object,
    // eslint-disable-next-line vue/require-default-prop
    header: String,
    // eslint-disable-next-line vue/require-default-prop
    hospital: Object,
  },
  data() {
    return {
      minutes: '--',
      seconds: '--',
      interval: 0,
      time: 300,
      total: 0,
      params: {},
      isUseCard: false,
      lang: this.$t('useCardPopup'),
      locale: this.$i18n.locale,
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
  },
  methods: {
    str_pad_left(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length)
    },
    tick() {
      const vm = this
      const min = Math.floor(vm.total / 60)
      const sec = vm.total - min * 60
      vm.minutes = vm.str_pad_left(min, '0', 2)
      vm.seconds = vm.str_pad_left(sec, '0', 2)

      if (vm.total <= 0) {
        clearInterval(vm.interval)
        vm.isTimeOut = true
      }

      vm.total -= 1
    },
    agreeUsed() {
      const vm = this
      vm.open = true
      vm.useCard()
    },
    cancel() {
      const vm = this
      vm.open = false
    },
    cancelCard() {
      const vm = this
      vm.open = false
      vm.$nextTick(() => {
        vm.$emit('isUsed', false)
      })
    },
    async useCard() {
      const vm = this
      const data = {
        provider_code: vm.hospital.code,
        insurer_code: vm.insurance.code,
        name: vm.insurance.firstName,
        surname: vm.insurance.lastName,
        lang: vm.locale,
      }
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .post(`policy/used/${vm.insurance.polNo}`, data)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok' && res.data !== []) {
              vm.isUseCard = true
              vm.params = res.data
              vm.header = vm.lang.useCardTitle
              vm.content = vm.lang.countdownContent
              vm.total = parseInt(vm.time, 10)
              vm.interval = setInterval(() => {
                vm.tick()
              }, 1000)
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    unUsedCard() {
      const vm = this
      vm.open = false
      vm.$nextTick(() => {
        vm.$emit('isUsed', true, vm.params.record_id)
      })
    },
  },
}
</script>

<style lang="scss" scpoed>
label {
  margin-bottom: 0 !important;
}
#TpaPopUp {
  z-index: 9999999;
  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
    .modal-wrapper {
      display: table-cell;
      vertical-align: middle;
      .modal-container {
        width: 330px;
        margin: 0 auto;
        padding: 30px 20px 20px;
        background-color: #fff;
        border-radius: 6px;
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
        .modal-header {
          padding: 0;
          margin: 0 auto 11px;
          text-align: center;
          border: none;
          .lbHeader {
            width: 100%;
            text-align: center;
            font-family: 'Anuphan-Medium';
            font-size: 18px;
            color: #004899;
            line-height: 24px;
          }
        }
        .modal-body {
          margin: 0 auto 20px;
          padding: 0;
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          color: #000;
          line-height: 24px;
          .lbBody {
            width: 100%;
            margin-top: 20px;
            text-align: center;
          }
        }
        .modal-footer {
          width: 100%;
          margin: 0 auto;
          padding: 0;
          border: none;
          text-align: center;
          .btnModal {
            width: 136px;
            height: 45px;
            margin: 0;
            padding: 11px 37px;
            font-family: 'Anuphan-Medium';
            font-size: 16px;
            color: #3ba9fe;
            line-height: 21px;
            text-align: center;
            border-color: #3ba9fe;
            border-radius: 6px;
          }
          .btnSummit {
            margin-left: 8px;
            color: #fffbfb;
            background-color: #3ba9fe;
          }
          .btnCancel {
            margin-right: 8px;
            background-color: #fff;
          }
          .btnUseCard {
            padding: 11px 28px;
          }
        }
      }
    }
  }

  /*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }
}
</style>
<style lang="scss">
@media screen and (min-width: 320px) and (max-width: 359px) {
  #PopUp {
    .modal-mask {
      .modal-wrapper {
        .modal-container {
          width: 290px !important;
          padding: 20px 0 10px !important;
          .modal-header {
            .icon-header {
              width: 35px !important;
              height: 35px !important;
            }
          }
          .modal-body {
            font-size: 14px !important;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 360px) and (max-width: 377px) {
  #PopUp {
    .modal-mask {
      .modal-wrapper {
        .modal-container {
          width: 305px !important;
        }
      }
    }
  }
}
@media screen and (min-width: 378px) and (max-width: 480px) {
  #PopUp {
    .modal-mask {
      .modal-wrapper {
        .modal-container {
          width: 325px !important;
        }
      }
    }
  }
}
</style>
