<template>
  <div id="EClaimForm">
    <div class="eclaim-card">
      <div class="eclaim-detail">
        <div class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.email }}</label>
          <input
            v-model="claim.email"
            class="txtEClaim"
            type="email"
            regex="[A-Za-z][A-Za-z0-9]+@[A-Za-z][A-Za-z0-9]+\.[A-Za-z]"
            :placeholder="lang.claimForm.email"
          />
        </div>
        <div class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.incidentType }}*</label>
          <b-form-select
            v-model="claim.claim_type"
            :options="types"
            class="txtEClaim"
            :class="{ txtValidate: vType }"
            @change="vType = false"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>{{
                lang.claimForm.incidentValidate
              }}</b-form-select-option>
            </template>
          </b-form-select>
          <label v-if="vType" class="validate">
            {{ lang.claimForm.incidentValidate }}
          </label>
        </div>
        <div class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.benefitType }}*</label>
          <b-form-select
            v-model="claim.admited_type"
            :options="
              claim.claim_type === 'illness'
                ? insurance.evenMBIllness
                : insurance.evenMBAccident
            "
            class="txtEClaim"
            :class="{ txtValidate: vAdmited }"
            @change="vAdmited = false"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>{{
                lang.claimForm.benefitValidate
              }}</b-form-select-option>
            </template>
          </b-form-select>
          <label v-if="vAdmited" class="validate">
            {{ lang.claimForm.benefitValidate }}
          </label>
        </div>
        <div v-if="claim.claim_type === 'accident'" class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.incidentDate }}*</label>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="319px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="claim.accident_date"
                :label="lang.claimForm.incidentDate"
                append-icon="icon-calendar"
                readonly
                outlined
                single-line
                class="txtDateEClaim"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="claim.accident_date"
              :first-day-of-week="1"
              :allowed-dates="allowedDates"
              :max="nowDate"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
          <label v-if="vAccidentTime" class="validate">
            {{ lang.claimForm.accidentValidate }}
          </label>
        </div>
        <div v-if="claim.claim_type === 'accident'" class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.admitDate }}*</label>
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="319px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="claim.admited_date"
                :label="lang.claimForm.admitDate"
                append-icon="icon-calendar"
                readonly
                outlined
                single-line
                class="txtDateEClaim"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="claim.admited_date"
              :first-day-of-week="1"
              :allowed-dates="allowedDates"
              :min="claim.accident_date"
              :max="nowDate"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
          <label v-if="vTime" class="validate">
            {{ lang.claimForm.admitValidate }}
          </label>
        </div>
        <div v-if="claim.claim_type !== 'accident'" class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.admitDate }}*</label>
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="319px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="claim.admited_date"
                :label="lang.claimForm.admitDate"
                append-icon="icon-calendar"
                readonly
                outlined
                single-line
                class="txtDateEClaim"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="claim.admited_date"
              :first-day-of-week="1"
              :allowed-dates="allowedDates"
              :max="nowDate"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
          <label v-if="vTime" class="validate">
            {{ lang.claimForm.admitValidate }}
          </label>
        </div>
        <div class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.sympton }}*</label>
          <input
            v-model="claim.symptom"
            class="txtEClaim"
            :placeholder="lang.claimForm.sympton"
            :class="{ txtValidate: vSymptom }"
            @click="goToSymptom()"
            @change="vSymptom = false"
          />
          <label v-if="vSymptom" class="validate">
            {{ lang.claimForm.symptonValidate }}
          </label>
        </div>
        <div class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.treatmentPlace }}*</label>
          <input
            v-model="provider.name"
            class="txtEClaim"
            :placeholder="lang.claimForm.treatmentPlace"
            :class="{ txtValidate: vProvider }"
            @click="goToProvider()"
            @change="vProvider = false"
          />
          <label v-if="vProvider" class="validate">
            {{ lang.claimForm.treatPlaceValidate }}
          </label>
        </div>
        <div class="eclaim-group">
          <label class="lbEClaim">{{ lang.claimForm.amount }}*</label>
          <input
            v-model="claim.medical_expense"
            type="number"
            pattern="[0-9]*"
            class="txtEClaim"
            :placeholder="lang.claimForm.amount"
            :class="{ txtValidate: vExpend }"
            @change="vExpend = false"
          />
          <label v-if="vExpend" class="validate">
            {{ lang.claimForm.amountValidate }}
          </label>
        </div>
        <v-btn
          type="submit"
          variant="primary"
          class="btnEClaim"
          @click="validate()"
        >
          {{ lang.btnSending }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'EClaimForm',
  data() {
    return {
      lang: this.$t('eclaimReport'),
      locale: this.$i18n.locale,
      insurance: {},
      claim: {
        email: '',
        claim_type: null,
        admited_type: null,
        admited_date: '',
        accident_date: '',
        symptom: '',
        medical_expense: '',
        provider_code: '',
      },
      vType: false,
      vAdmited: false,
      vTime: false,
      vAccidentTime: false,
      vSymptom: false,
      vProvider: false,
      vExpend: false,
      admited_illness: [],
      admited_accident: [],
      types: [
        { value: 'illness', text: this.$t('eclaimReport').claimType.sick },
        { value: 'accident', text: this.$t('eclaimReport').claimType.accident },
      ],
      provider: {},
      menu: false,
      modal: false,
      menu2: false,
      nowDate: '',
      eclaim: '',
    }
  },
  mounted() {
    const vm = this
    vm.insurance = vm.$auth.$storage.getLocalStorage('insurance')
    const claim = vm.$auth.$storage.getLocalStorage('e-claim')
    if (claim !== null && claim !== undefined) {
      vm.claim = claim
      if (vm.getSympton() !== '' && vm.getSympton() !== vm.claim.symptom) {
        vm.claim.symptom = vm.getSympton()
      }
      if (vm.getHospital() !== '' && vm.getHospital() !== vm.provider) {
        vm.provider = vm.getHospital()
      } else {
        vm.provider = {
          code: claim.provider_code,
          name: claim.provider_name,
        }
      }
    } else if (vm.getClaim() !== {}) {
      vm.claim = vm.getClaim()
      if (vm.getSympton() !== '' && vm.getSympton() !== vm.claim.symptom) {
        vm.claim.symptom = vm.getSympton()
      }
      if (vm.getHospital() !== '' && vm.getHospital() !== vm.provider) {
        vm.provider = vm.getHospital()
      }
    } else {
      vm.$nextTick(() => {
        vm.setClaimDate()
      })
    }
  },
  methods: {
    ...mapGetters({
      getInsurance: 'getInsurance',
      getSympton: 'getSympton',
      getClaim: 'getClaim',
      getHospital: 'getHospital',
    }),
    ...mapMutations({
      setClaim: 'setClaim',
    }),
    setClaimDate() {
      const vm = this
      vm.nowDate = new Date().toISOString().substr(0, 10)
      vm.claim.admited_date = new Date().toISOString().substr(0, 10)
      vm.claim.accident_date = new Date().toISOString().substr(0, 10)
    },
    goToSymptom() {
      const vm = this
      vm.setDataEClaim()
      vm.setClaim(vm.eclaim)
      if (vm.locale === 'th') {
        vm.$router.push('/symptom')
      } else {
        vm.$router.push('/en/symptom')
      }
    },
    goToProvider() {
      const vm = this
      vm.setDataEClaim()
      vm.setClaim(vm.eclaim)
      if (vm.locale === 'th') {
        vm.$router.push('/provider-list')
      } else {
        vm.$router.push('/en/provider-list')
      }
    },
    setDataEClaim() {
      const vm = this
      if (vm.claim.claim_type === 'accident') {
        vm.eclaim = {
          policy_no: vm.insurance.polNo,
          insurer_code: vm.insurance.code,
          card_type: vm.insurance.cardType,
          insurer_name_th: vm.insurance.eclaimInsurerName,
          insurer_name_en: vm.insurance.eclaimInsurerNameEN,
          email: vm.claim.email,
          claim_type: vm.claim.claim_type,
          admited_type: vm.claim.admited_type,
          admited_date: vm.claim.admited_date,
          accident_date: vm.claim.accident_date,
          symptom: vm.claim.symptom,
          medical_expense: parseInt(vm.claim.medical_expense),
          provider_code: vm.provider.code,
          provider_name: vm.provider.name,
          lang: vm.locale,
        }
      } else if (vm.claim.claim_type === 'illness') {
        vm.eclaim = {
          policy_no: vm.insurance.polNo,
          insurer_code: vm.insurance.code,
          card_type: vm.insurance.cardType,
          insurer_name_th: vm.insurance.eclaimInsurerName,
          insurer_name_en: vm.insurance.eclaimInsurerNameEN,
          email: vm.claim.email,
          claim_type: vm.claim.claim_type,
          admited_type: vm.claim.admited_type,
          admited_date: vm.claim.admited_date,
          accident_date: '',
          symptom: vm.claim.symptom,
          medical_expense: parseInt(vm.claim.medical_expense),
          provider_code: vm.provider.code,
          provider_name: vm.provider.name,
          lang: vm.locale,
        }
      }
    },
    clearValidate() {
      const vm = this
      vm.vType = false
      vm.vAdmited = false
      vm.vTime = false
      vm.vAccidentTime = false
      vm.vSymptom = false
      vm.vProvider = false
      vm.vExpend = false
    },
    setValidate() {
      const vm = this
      vm.vType =
        vm.claim.claim_type === null || vm.claim.claim_type === undefined
      vm.vAdmited =
        vm.claim.admited_type === null || vm.claim.admited_type === undefined
      vm.vTime =
        vm.claim.admited_date === null || vm.claim.admited_date === undefined
      vm.vAccidentTime =
        vm.claim.claim_type === 'accident' &&
        (vm.claim.accident_date === null ||
          vm.claim.accident_date === undefined)
      vm.vSymptom = vm.claim.symptom === ''
      vm.vProvider = vm.claim.provider_code === ''
      vm.vExpend =
        vm.claim.medical_expense === null ||
        vm.claim.medical_expense === undefined ||
        isNaN(vm.claim.medical_expense) ||
        vm.claim.medical_expense === ''
    },
    validate() {
      const vm = this
      vm.clearValidate()
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.setValidate()
      } else {
        vm.addClaimDetail()
      }
    },
    checkValidate() {
      const vm = this
      if (vm.claim.claim_type === 'accident') {
        return (
          vm.claim.claim_type === null ||
          vm.claim.claim_type === undefined ||
          vm.claim.admited_type === null ||
          vm.claim.admited_type === undefined ||
          vm.claim.admited_date === null ||
          vm.claim.admited_date === undefined ||
          vm.claim.symptom === '' ||
          vm.claim.provider_code === '' ||
          vm.claim.medical_expense === null ||
          vm.claim.medical_expense === undefined ||
          isNaN(vm.claim.medical_expense) ||
          vm.claim.medical_expense === '' ||
          vm.claim.accident_date === null ||
          vm.claim.accident_date === undefined
        )
      } else {
        return (
          vm.claim.claim_type === null ||
          vm.claim.claim_type === undefined ||
          vm.claim.admited_type === null ||
          vm.claim.admited_type === undefined ||
          vm.claim.admited_date === null ||
          vm.claim.admited_date === undefined ||
          vm.claim.symptom === '' ||
          vm.claim.provider_code === '' ||
          vm.claim.medical_expense === null ||
          vm.claim.medical_expense === undefined ||
          isNaN(vm.claim.medical_expense) ||
          vm.claim.medical_expense === ''
        )
      }
    },
    setDataClaim() {
      const vm = this
      const claim = vm.$auth.$storage.getLocalStorage('e-claim')
      let body = ''
      if (claim !== null && claim !== undefined) {
        vm.$auth.$storage.removeLocalStorage('e-claim')
        body = {
          policy_no: vm.claim.policy_no,
          insurer_code: vm.claim.insurer_code,
          card_type: vm.claim.card_type,
          insurer_name_th: vm.claim.insurer_name_th,
          insurer_name_en: vm.claim.insurer_name_en,
          email: vm.claim.email,
          claim_type: vm.claim.claim_type,
          admited_type: vm.claim.admited_type,
          admited_date: vm.claim.admited_date,
          accident_date:
            vm.claim.claim_type === 'accident' ? vm.claim.accident_date : '',
          symptom: vm.claim.symptom,
          medical_expense: parseInt(vm.claim.medical_expense),
          provider_code:
            vm.claim.provider_code !== vm.provider.code
              ? vm.provider.code
              : vm.claim.provider_code,
          provider_name:
            vm.claim.provider_name !== vm.provider.name
              ? vm.provider.name
              : vm.claim.provider_name,
          lang: vm.locale,
        }
      } else {
        body = {
          policy_no: vm.insurance.polNo,
          insurer_code: vm.insurance.code,
          card_type: vm.insurance.cardType,
          insurer_name_th: vm.insurance.eclaimInsurerName,
          insurer_name_en: vm.insurance.eclaimInsurerNameEN,
          email: vm.claim.email,
          claim_type: vm.claim.claim_type,
          admited_type: vm.claim.admited_type,
          admited_date: vm.claim.admited_date,
          accident_date:
            vm.claim.claim_type === 'accident' ? vm.claim.accident_date : '',
          symptom: vm.claim.symptom,
          medical_expense: parseInt(vm.claim.medical_expense),
          provider_code: vm.provider.code,
          provider_name: vm.provider.name,
          lang: vm.locale,
        }
      }
      return body
    },
    addClaimDetail() {
      const vm = this
      const body = vm.setDataClaim()
      vm.$auth.$storage.setLocalStorage('e-claim', body)
      vm.$emit('setSetpper', 2)
    },
    allowedDates(value) {
      const date = new Date().toISOString().substr(0, 10)
      if (
        parseInt(value.split('-')[0], 10) >= parseInt(date.split('-')[0], 10) &&
        parseInt(value.split('-')[1], 10) >= parseInt(date.split('-')[1], 10)
      ) {
        return (
          parseInt(value.split('-')[2], 10) <=
            parseInt(date.split('-')[2], 10) &&
          parseInt(value.split('-')[1], 10) <=
            parseInt(date.split('-')[1], 10) &&
          parseInt(value.split('-')[0], 10) <= parseInt(date.split('-')[0], 10)
        )
      } else {
        return (
          parseInt(value.split('-')[0], 10) <= parseInt(date.split('-')[0], 10)
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#EClaimForm {
  .eclaim-card {
    position: relative;
    .eclaim-detail {
      .eclaim-group {
        padding-bottom: 28px;
        .lbEClaim {
          padding-bottom: 8px;
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          text-align: left;
          line-height: 24px;
          color: #004899;
        }
        .txtEClaim,
        .txtDateEClaim {
          width: 100%;
          height: 45px;
          padding: 13px 24px;
          border: 0.5px solid #2f2e41;
          border-radius: 6px;
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          text-align: left;
          line-height: 18px;
          color: #617d8c;
          background-color: #fff;
        }
        .txtSearch {
          width: 100%;
          height: 45px;
          border: 0.5px solid #2f2e41;
          border-radius: 6px;
          font-family: 'Anuphan-Regular';
          font-size: 14px;
          text-align: left;
          line-height: 18px;
          color: #617d8c;
          background-color: #fff;
        }
        .txtValidate {
          border: 0.5px solid #ff0000;
        }
        .validate {
          margin: 0;
          padding-top: 8px;
          font-family: 'Sarabun-Regular';
          font-size: 10px;
          color: #ff0000;
          line-height: 24px;
        }
      }
    }
    .btnEClaim {
      width: 100%;
      height: 45px;
      margin-top: 5px;
      border-radius: 6px;
      border-color: #3ba9fe;
      background-color: #3ba9fe;
      padding: 10px 106px;
      text-align: center;
      font-family: 'Anuphan-Medium';
      font-size: 18px;
      color: #fffbfb;
      line-height: 24px;
    }
  }
}
</style>
<style>
@import url('../../assets/css/claim-form.css');
</style>
