<template>
  <div v-if="is_open" id="ConditionPopUp">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <img
                v-if="!is_success && !is_logout"
                class="icon-header"
                center
                src="../assets/images/warning.png"
                alt="Center image"
              />
              <img
                v-if="is_logout"
                class="icon-header"
                center
                src="../assets/images/logout.png"
                alt="Center image"
              />
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              {{ paragraph }}
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <v-btn class="modal-default-button" @click="ansNo()">
                <label class="lbBtnPopUp">
                  {{ lang.cancel }}
                </label>
              </v-btn>
              <v-btn class="modal-default-button" @click="ansYes()">
                <label class="lbBtnPopUp">
                  {{ lang.agree }}
                </label>
              </v-btn>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'ConditionPopUp',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    paragraph: String,
    // eslint-disable-next-line vue/prop-name-casing
    is_success: Boolean,
    // eslint-disable-next-line vue/prop-name-casing
    is_open: Boolean,
    // eslint-disable-next-line vue/prop-name-casing
    is_logout: Boolean,
  },
  data() {
    return {
      lang: this.$t('conditionPopup'),
      locale: this.$i18n.locale,
    }
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
    }),
    ansNo() {
      const vm = this
      vm.$emit('checkCancel', false)
    },
    ansYes() {
      const vm = this
      vm.$emit('checkCancel', true)
    },
  },
}
</script>

<style lang="scss" scpoed>
#ConditionPopUp {
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
        padding: 30px 0 10px;
        text-align: center;
        background-color: #fff;
        border-radius: 6px;
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
        .modal-header {
          padding: 0 30px;
          margin: 0 auto 11px;
          text-align: center;
          border: none;
          .icon-header {
            width: 50px;
            height: 50px;
            margin: 0 auto;
          }
        }
        .modal-body {
          margin: 0 auto 20px;
          padding: 0 30px;
          text-align: center;
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          color: #000;
          line-height: 24px;
        }
        .modal-footer {
          width: 100%;
          margin: 0 auto;
          padding: 11px 0 0;
          border-top: 0.5px solid #d4c8c8;
          text-align: center;
          .modal-default-button {
            text-align: center;
            background: none;
            border: none;
            margin: 0 auto;
            padding: 0;
            .lbBtnPopUp {
              font-family: 'Anuphan-Regular';
              font-size: 18px;
              color: #3ba9fe;
              line-height: 23px;
            }
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
