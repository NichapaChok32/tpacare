<template v-click-outside="onClickOutside">
  <div id="EditProfile">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <v-form
      v-if="!isLoading"
      class="edit-profile-detail"
      @submit.prevent="validate"
    >
      <div class="display-form">
        <b-form-file
          id="displayUpload"
          ref="displayUpload"
          type="file"
          accept=".jpg, .png"
          hidden
          @change="onDisplayChange"
        />
        <v-btn class="btnDropzone" @click="chooseDisplay">
          <b-avatar
            v-if="avartar !== ''"
            :src="avartar"
            badge
            badge-offset="-0.3em"
          ></b-avatar>
          <b-avatar
            v-else-if="photo !== ''"
            :src="photo"
            badge
            badge-offset="-0.3em"
          ></b-avatar>
          <b-avatar
            v-else
            src="../../assets/images/avatar.png"
            badge
            badge-offset="-0.3em"
          ></b-avatar>
        </v-btn>
      </div>
      <div class="form-group">
        <label class="lbFrom">{{ lang.nameLabel }}</label>
        <v-text-field
          v-model="profile.name"
          class="txtForm"
          :class="{ txtValidate: vFirstName }"
          :rules="[rules.required]"
        />
        <label v-if="vFirstName" for="txtFirstName" class="validate">
          {{ lang.validateName }}
        </label>
      </div>
      <div class="form-group">
        <label class="lbFrom">{{ lang.surnameLabel }}</label>
        <v-text-field
          v-model="profile.surname"
          class="txtForm"
          :class="{ txtValidate: vLastName }"
          :rules="[rules.required]"
        />
        <label v-if="vLastName" for="txtLastName" class="validate">
          {{ lang.validateSurname }}
        </label>
      </div>
      <div class="form-group">
        <label class="lbFrom">{{ lang.phoneLabel }}</label>
        <v-text-field
          v-model="mobile"
          class="txtForm"
          type="tel"
          pattern="[0-9]*"
          :class="{ txtValidate: vMobile }"
          maxlength="10"
          :rules="[rules.required]"
        />
        <label v-if="vMobile" for="txtMobile" class="validate">
          {{ lang.validatePhone }}
        </label>
      </div>
      <div class="form-group">
        <label class="lbFrom">{{ lang.birthLabel }}</label>
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
              v-model="birthDate"
              append-icon="icon-calendar"
              readonly
              outlined
              single-line
              class="txtDatePicker"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="birthDate"
            :first-day-of-week="1"
            :allowed-dates="allowedDates"
            class="pickerBirthdate"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
      </div>
      <v-row class="select-group">
        <v-col cols="3" class="select-header">
          <label class="lbFrom">{{ lang.sexLabel }}</label>
        </v-col>
        <v-col cols="9" class="select-group-detail">
          <v-radio-group
            v-model="profile.sex"
            hide-details
            class="sex-radio-group"
          >
            <v-radio
              v-for="item in sex"
              :key="item.id"
              :value="item.id"
              :label="item.name"
              class="sex-radio"
              :class="{ lastRadio: item.id === sex.length }"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <div class="form-group">
        <b-btn type="submit" variant="primary" class="btnSummit">
          {{ lang.btnSubmit }}
        </b-btn>
      </div>
    </v-form>
    <v-row v-if="isShow && !isLoading" justify="center">
      <v-dialog
        v-model="isShow"
        persistent
        max-width="319"
        class="popup-dialog"
      >
        <v-card id="PopUp">
          <v-card-title class="popup-header">
            <img
              v-if="isSuccess"
              class="icon-header"
              center
              src="../../assets/images/correct.svg"
              alt="Center image"
            />
            <img
              v-if="!isSuccess"
              class="icon-header"
              center
              src="../../assets/images/worst.svg"
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
import { mapMutations, mapGetters } from 'vuex'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import Header from '../../components/header'
export default {
  name: 'EditProfile',
  components: {
    Header,
  },
  data() {
    return {
      isSuccess: false,
      mobile: '',
      vFirstName: false,
      vLastName: false,
      vMobile: false,
      isShow: false,
      backPath: '',
      path: '/edit-profile',
      goPath: '/otp',
      content: '',
      token: '',
      profile: {},
      sex: [
        { id: 1, name: this.$t('edit-profile').sexChoice.male },
        { id: 2, name: this.$t('edit-profile').sexChoice.female },
        { id: 3, name: this.$t('edit-profile').sexChoice.nonDetect },
      ],
      isEditPhone: false,
      photo: '',
      birthDate: null,
      menu: false,
      modal: false,
      isLoading: true,
      rules: {
        required: (value) => !!value || 'Required.',
      },
      lang: this.$t('edit-profile'),
      locale: this.$i18n.locale,
      avartar: '',
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    vm.getProfile()
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
      setRegister: 'setRegister',
    }),
    ...mapGetters({
      getPath: 'getPath',
    }),
    setBirthDate() {
      const vm = this
      if (vm.profile.birthdate !== null) {
        vm.birthDate = vm.profile.birthdate
      } else {
        vm.birthDate = new Date().toISOString().substr(0, 10)
      }
    },
    clearValidate() {
      const vm = this
      vm.vFirstName = false
      vm.vLastName = false
      vm.vMobile = false
    },
    setValidate() {
      const vm = this
      vm.vFirstName = vm.profile.name === ''
      vm.vLastName = vm.profile.surname === ''
      vm.vMobile = vm.mobile === '' || vm.mobile.length !== 10
    },
    validate() {
      const vm = this
      vm.isLoading = true
      if (vm.checkValidate()) {
        event.preventDefault()
        vm.isLoading = false
        vm.isShow = true
        vm.isSuccess = false
        if (vm.profile.name === '') {
          vm.content = vm.lang.validateName
        } else if (vm.profile.surname === '') {
          vm.content = vm.lang.validateSurname
        } else if (vm.mobile === '' || vm.mobile.length !== 10) {
          vm.content = vm.lang.validatePhone
        }
      } else {
        vm.updateProfile()
      }
    },
    checkValidate() {
      const vm = this
      return (
        vm.profile.name === '' ||
        vm.profile.surname === '' ||
        vm.mobile === '' ||
        vm.mobile.length !== 10
      )
    },
    chooseDisplay() {
      document.getElementById('displayUpload').click()
    },
    onDisplayChange(e) {
      const vm = this
      const selectedImage = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      reader.onload = (e) => {
        vm.avartar = e.target.result
        const test = e.target.result.split(',')[1]
        const str = test.split('...')[0]
        vm.photo = str
      }
    },
    async updateProfile() {
      const vm = this
      firebase.analytics().logEvent('edit-profile-button')
      try {
        event.preventDefault()
        let data = {}
        if (vm.mobile !== vm.profile.mobile) {
          data = {
            name: vm.profile.name,
            surname: vm.profile.surname,
            mobile: vm.mobile,
            sex: vm.profile.sex,
            birthdate: vm.birthDate,
            photo:
              vm.photo !== '' ? vm.photo : vm.avartar !== '' ? vm.avartar : '',
            lang: vm.locale,
          }
          vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
          await vm.$axios.post('/profile/sendotp', data).then((response) => {
            const res = response.data
            const params = {
              token: 'EditProfile',
              ref: res.ref_no,
              phone: vm.mobile,
              ttl_minute: res.ttl_minute,
            }
            vm.setRegister(params)
            vm.profile.mobile = vm.mobile
            vm.profile.birthDate = vm.birthDate
            vm.profile.photo =
              vm.photo !== '' ? vm.photo : vm.avartar !== '' ? vm.avartar : ''
            vm.$auth.$storage.setLocalStorage('profile', vm.profile)
            vm.isLoading = false
            vm.isShow = true
            if (res.status === 'ok') {
              vm.isSuccess = true
              vm.isEditPhone = true
              vm.content = vm.lang.successPhone
            } else {
              vm.isSuccess = false
              vm.content = res.message
            }
          })
        } else {
          data = {
            name: vm.profile.name,
            surname: vm.profile.surname,
            mobile: vm.profile.mobile,
            sex: vm.profile.sex,
            birthdate: vm.birthDate,
            photo:
              vm.photo !== '' ? vm.photo : vm.avartar !== '' ? vm.avartar : '',
            lang: vm.locale,
          }
          vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
          await vm.$axios.put('/profile', data).then((response) => {
            const res = response.data
            vm.isLoading = false
            vm.isShow = true
            if (res.status === 'ok') {
              vm.isSuccess = true
              vm.content = vm.lang.success
            } else {
              vm.isSuccess = false
              vm.content = res.message
            }
          })
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isLoading = false
        vm.isShow = true
        vm.isSuccess = false
        vm.content = e.response.data.message
      }
    },
    async getProfile() {
      const vm = this
      firebase.analytics().logEvent('edit-profile-page')
      vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
      await vm.$axios.get(`/profile?lang=${vm.locale}`).then((response) => {
        const res = response.data
        vm.profile = res.data
        vm.mobile = vm.profile.mobile
        vm.profile.sex = parseInt(vm.profile.sex)
        vm.birthDate = vm.profile.birthdate
        if (res.data.photo !== '') {
          vm.avartar = res.data.photo
        }
        vm.isLoading = false
        vm.$nextTick(() => {
          vm.setBirthDate()
          vm.$auth.$storage.setLocalStorage('profile', vm.profile)
        })
      })
    },
    onClickOutside(e) {
      const vm = this
      vm.isShow = false
      if (vm.isSuccess & vm.isEditPhone) {
        if (vm.locale === 'th') {
          vm.setPath('/edit-profile')
          vm.$router.push('/otp-card')
        } else if (vm.locale === 'th') {
          vm.setPath('/en/edit-profile')
          vm.$router.push('/en/otp-card')
        }
      } else if (vm.isSuccess & !vm.isEditPhone) {
        vm.isLoading = true
        vm.getProfile()
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.isEditPhone) {
          if (vm.locale === 'th') {
            vm.setPath('/edit-profile')
            vm.$router.push('/otp-card')
          } else if (vm.locale === 'th') {
            vm.setPath('/en/edit-profile')
            vm.$router.push('/en/otp-card')
          }
        } else if (!vm.isEditPhone) {
          vm.isLoading = true
          vm.isShow = false
          vm.getProfile()
        } else {
          vm.isShow = false
        }
      } else {
        vm.isShow = false
      }
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
#EditProfile {
  height: 100%;
  position: relative;
  background-color: #f1f8ff;
  .edit-profile-detail {
    height: 100%;
    padding: 91px 28px 2px;
    .display-form {
      width: 100%;
      margin: 0 auto 30px;
      text-align: center;
    }
    .form-group {
      width: 100%;
      margin-bottom: 28px;
      display: block;
      .lbFrom {
        width: 100%;
        margin-bottom: 8px !important;
        padding-right: 5px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #004899;
        line-height: 24px;
      }
      .txtForm {
        margin: 0;
        padding: 0;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .txtDatePicker {
        margin: 0;
        padding: 0;
        border: solid 0.5px #2f2e41;
        border-radius: 6px;
      }
      .txtValidate {
        border: 0.5px solid #ff0000;
      }
      .btnSummit {
        width: 100%;
        height: 45px;
        background-color: #3ba9fe;
        border: none;
        border-radius: 6px;
        font-family: 'Anuphan-Medium';
        font-size: 18px;
        color: #fff;
        line-height: 31px;
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
    .select-group {
      width: 100%;
      display: inline-flex;
      margin: 0 auto 40px;
      .select-header {
        float: left;
        vertical-align: middle;
        .lbFrom {
          width: 100%;
          font-family: 'Anuphan-Regular';
          font-size: 16px;
          color: #004899;
          line-height: 24px;
        }
      }
      .select-group-detail {
        float: right;
        margin-left: auto;
        display: inline-flex;
        .sex-radio-group {
          width: 100%;
          padding-top: 0;
          margin-top: 0;
          display: inline-flex;
          .sex-radio {
            display: inline-flex;
            font-family: 'Anuphan-Regular';
            font-size: 16px;
            color: #004899;
            line-height: 24px;
            margin-bottom: 0;
            margin-right: 20px;
          }
          .lastRadio {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/edit-profile.css');
</style>
<style lang="scss">
@media screen and (min-width: 320px) and (max-width: 359px) {
  #EditProfile {
    .register-nav {
      .nav {
        .lbnav {
          padding-left: 85px !important;
        }
      }
    }
  }
}
</style>
