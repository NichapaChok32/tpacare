<template>
  <div id="ClaimReview">
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="claim-detail">
      <div class="claim-card">
        <div v-if="insurance.type === 'Self-Insured'" class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.detailHeader.empID }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ insurance.staffNo }}</label>
          </div>
        </div>
        <div v-else class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.detailHeader.polNo }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ insurance.polNo }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.detailHeader.InsurerName }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{
              insurance.firstName + ' ' + insurance.lastName
            }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.detailHeader.mobile }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ insurance.telNo }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.email }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ claim.email }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.incidentType }}</label>
          </div>
          <div v-if="claim.claim_type === 'accident'" class="claim-data">
            <label class="lbClaim">{{ lang.claimType.accident }}</label>
          </div>
          <div v-if="claim.claim_type === 'illness'" class="claim-data">
            <label class="lbClaim">{{ lang.claimType.sick }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.benefitType }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ claim.admited_type }}</label>
          </div>
        </div>
        <div v-if="claim.claim_type === 'accident'" class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.incidentDate }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ accident_date }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.admitDate }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ admited_date }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.sympton }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ claim.symptom }}</label>
          </div>
        </div>
        <div class="claim-row">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.treatmentPlace }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ claim.provider_name }}</label>
          </div>
        </div>
        <div class="claim-row claim-row-last">
          <div class="claim-header">
            <label class="lbClaim">{{ lang.claimForm.amount }}</label>
          </div>
          <div class="claim-data">
            <label class="lbClaim">{{ expense }}</label>
          </div>
        </div>
      </div>
      <div class="claim-image">
        <label class="lbImageHeader">{{ lang.reviewForm.previewImage }}</label>
        <div id="ImageCard">
          <div
            v-for="(item, index) in imgList"
            :key="index"
            class="image-card"
            @click="
              item.type !== 'application/pdf' ? selectImageShow(item) : ''
            "
          >
            <div class="card-claim-image">
              <div v-if="item.type !== 'application/pdf'" class="image-claim">
                <v-img
                  class="claim-pic"
                  :src="`data:${item.type};base64,${item.file}`"
                />
              </div>
              <div v-if="item.type === 'application/pdf'" class="image-claim">
                <div class="claim-pic-pdf">
                  <img
                    class="icon-pdf"
                    src="../../assets/images/image-pdf.png"
                  />
                </div>
              </div>
              <div class="card-claim-detail">
                <div v-if="item.type === 'image/jpeg'" class="card-col">
                  <div class="file-icon">JPEG</div>
                </div>
                <div v-if="item.type === 'image/png'" class="card-col">
                  <div class="file-icon">PNG</div>
                </div>
                <div v-if="item.type === 'application/pdf'" class="card-col">
                  <div class="file-icon">PDF</div>
                </div>
                <div class="card-col-detail">
                  <span class="lbImageName">{{ item.name }}</span>
                  <span class="lbSizeImage">{{ item.size / 1000 + 'KB' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="claim-action">
        <v-row class="claim-edit">
          <v-col class="edit-col">
            <v-btn
              class="btnEditDetail"
              :class="{ btnEnImage: locale === 'en' }"
              @click="goToDetail"
            >
              {{ lang.reviewForm.btnEditData }}
            </v-btn>
          </v-col>
          <v-col class="edit-col edit-col-last">
            <v-btn
              class="btnEditDetail"
              :class="{ btnEnImage: locale === 'en' }"
              @click="goToAttachFile"
            >
              {{ lang.reviewForm.btnEditImage }}
            </v-btn>
          </v-col>
        </v-row>
        <v-btn
          type="submit"
          variant="primary"
          class="btnEClaim"
          @click="checkValidate()"
        >
          {{ lang.reviewForm.btnReportEClaim }}
        </v-btn>
      </div>
    </div>
    <div v-if="isShowPictures" class="show-pictures">
      <v-icon
        class="btn-close-icon"
        right
        color="#ffffff"
        @click="isShowPictures = false"
        >fa-times-circle</v-icon
      >
      <div class="show-eclaim">
        <img
          v-if="selectImg.type === 'image/png'"
          class="imgEClaim"
          :src="`data:image/png;base64,${selectImg.file}`"
          width="250px"
        />
        <img
          v-if="selectImg.type === 'image/jpeg'"
          class="imgEClaim"
          :src="`data:image/jpeg;base64,${selectImg.file}`"
          width="250px"
        />
      </div>
    </div>
    <v-row v-if="isShow" justify="center">
      <v-dialog
        v-model="isShow"
        persistent
        max-width="319"
        class="popup-dialog"
      >
        <v-card id="PopUpDelete">
          <v-card-title class="popup-header">
            <img
              v-if="isValidate"
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
            <slot v-if="isValidate" name="footer">
              <v-btn class="modal-default-button" @click="summitPopup()">
                <label class="lbBtnPopUp">
                  {{ lang.attachForm.agree }}
                </label>
              </v-btn>
            </slot>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import Dexie from 'dexie'
import { mapGetters } from 'vuex'
export default {
  name: 'ClaimReview',
  data() {
    return {
      lang: this.$t('eclaimReport'),
      locale: this.$i18n.locale,
      isloading: false,
      insurance: {},
      claim: {},
      token: '',
      hospital: {},
      admited_date: '',
      accident_date: '',
      claimIndex: 0,
      imgList: [],
      isShowPictures: false,
      imgIndex: 0,
      expense: '',
      isShow: false,
      eclaim: {},
      db: new Dexie('s3'),
      receipt: [],
      medical: [],
      selectImg: {},
      isValidate: false,
    }
  },
  mounted() {
    const vm = this
    vm.db.version(1).stores({
      receipts: '++id, file, name, type, size',
      medicals: '++id, file, name, type, size',
    })
    vm.setClaimData()
  },
  methods: {
    ...mapGetters({
      getInsurance: 'getInsurance',
      getHospital: 'getHospital',
    }),
    selectImageShow(img) {
      const vm = this
      vm.selectImg = img
      vm.isShowPictures = true
    },
    async getImageDatas() {
      const vm = this
      const receipts = await vm.db.receipts.toArray()
      const medicals = await vm.db.medicals.toArray()
      if (receipts.length !== 0 && receipts.length !== null) {
        vm.receipt = receipts
      }
      if (medicals.length !== 0 && medicals.length !== null) {
        vm.medical = medicals
      }
      for (let i = 0; i < vm.receipt.length; i++) {
        vm.imgList.push(vm.receipt[i])
      }
      for (let j = 0; j < vm.medical.length; j++) {
        vm.imgList.push(vm.medical[j])
      }
      const receipt = []
      const med = []
      for (let i = 0; i < vm.receipt.length; i++) {
        receipt.push(vm.receipt[i].file)
      }
      for (let j = 0; j < vm.medical.length; j++) {
        med.push(vm.medical[j].file)
      }
      if (vm.claim.claim_type === 'accident') {
        vm.eclaim = {
          name: vm.insurance.firstName,
          surname: vm.insurance.lastName,
          mobile: vm.insurance.telNo,
          staff_no: vm.insurance.staffNo,
          policy_no: vm.insurance.polNo,
          insurer_code: vm.insurance.code,
          card_type: vm.insurance.type,
          insurer_name_th: vm.insurance.eclaimInsurerName,
          insurer_name_en: vm.insurance.eclaimInsurerNameEN,
          email: vm.claim.email,
          claim_type: vm.claim.claim_type,
          admited_type: vm.claim.admited_type,
          admited_date: vm.claim.admited_date,
          accidented_date: vm.claim.accident_date,
          symptom: vm.claim.symptom,
          medical_expense: parseInt(vm.claim.medical_expense),
          provider_code: vm.claim.provider_code,
          lang: vm.locale,
          receipt_attachment: receipt,
          medical_certificate_attachment: med,
        }
      } else {
        vm.eclaim = {
          name: vm.insurance.firstName,
          surname: vm.insurance.lastName,
          mobile: vm.insurance.telNo,
          staff_no: vm.insurance.staffNo,
          policy_no: vm.insurance.polNo,
          insurer_code: vm.insurance.code,
          card_type: vm.insurance.type,
          insurer_name_th: vm.insurance.eclaimInsurerName,
          insurer_name_en: vm.insurance.eclaimInsurerNameEN,
          email: vm.claim.email,
          claim_type: vm.claim.claim_type,
          admited_type: vm.claim.admited_type,
          admited_date: vm.claim.admited_date,
          symptom: vm.claim.symptom,
          medical_expense: parseInt(vm.claim.medical_expense),
          provider_code: vm.claim.provider_code,
          lang: vm.locale,
          receipt_attachment: receipt,
          medical_certificate_attachment: med,
        }
      }
    },
    setClaimData() {
      const vm = this
      vm.token = vm.$auth.$storage.getLocalStorage('token')
      vm.claim = vm.$auth.$storage.getLocalStorage('e-claim')
      if (vm.claim.medical_expense !== null) {
        vm.expense = vm.numberWithCommas(vm.claim.medical_expense)
      }
      const [year, month, day] = vm.claim.admited_date.split('-')
      vm.admited_date = day + '/' + month + '/' + year
      if (vm.claim.claim_type === 'accident') {
        const [y, m, d] = vm.claim.accident_date.split('-')
        vm.accident_date = d + '/' + m + '/' + y
      }
      vm.insurance = vm.$auth.$storage.getLocalStorage('insurance')
      vm.hospital = vm.getHospital()
      vm.getImageDatas()
    },
    validate() {
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
          vm.claim.accident_date === undefined ||
          vm.eclaim.receipt_attachment.length === 0 ||
          vm.eclaim.medical_certificate_attachment.length === 0
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
          vm.claim.medical_expense === '' ||
          vm.eclaim.receipt_attachment.length === 0 ||
          vm.eclaim.medical_certificate_attachment.length === 0
        )
      }
    },
    checkValidate() {
      const vm = this
      vm.isloading = true
      if (vm.validate()) {
        event.preventDefault()
        vm.isloading = false
        vm.isValidate = true
        vm.isShow = true
        vm.content = vm.lang.reviewForm.eclaimValidate
      } else {
        vm.addEClaim()
      }
    },
    goToDetail() {
      const vm = this
      vm.$emit('setSetpper', 1)
    },
    goToAttachFile() {
      const vm = this
      vm.$emit('setSetpper', 2)
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    async addEClaim() {
      const vm = this
      vm.isloading = true
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.post('/claim', vm.eclaim).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            Dexie.delete('s3')
            vm.$auth.$storage.removeLocalStorage('e-claim')
            vm.$emit('setSetpper', 4)
            vm.isloading = false
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    summitPopup() {
      const vm = this
      vm.isShow = false
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#ClaimReview {
  width: 100%;
  height: 100%;
  position: relative;
  .show-pictures {
    width: 100%;
    height: 100%;
    background-color: rgba(26, 25, 25, 0.5);
    z-index: 9999;
    position: absolute;
    top: 0;
    .btn-close-icon {
      font-size: 30px;
      text-align: right;
      margin: 0 0 0 90%;
    }
    .show-eclaim {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25%;
      .imgEclaim {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .show-eclaim-carousel {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 25% 5%;
      .imgElcaim {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
  }
  .claim-detail {
    width: 100%;
    height: 100%;
    position: relative;
    .img-eclaim {
      width: 100%;
      height: 100%;
    }
    .eclaim-images {
      width: 402px;
      height: fit-content !important;
    }
    .claim-card {
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: #fff;
      .lbClaim {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #2f2e41;
        line-height: 18px;
        vertical-align: middle;
        word-break: break-all;
      }
      .claim-row {
        width: 100%;
        padding: 10px 28px;
        display: inline-flex;
        border-bottom: 0.5px solid #e7ecee;
        .claim-header {
          width: 60%;
          text-align: left;
        }
        .claim-data {
          width: 40%;
          text-align: right;
        }
      }
      .claim-row-last {
        border-bottom: none;
      }
    }
    .claim-image {
      width: 100%;
      height: 100%;
      padding: 21px 28px 0;
      background-color: #f1f8ff;
      position: relative;
      .lbImageHeader {
        padding-bottom: 20px;
        font-family: 'Anuphan-Regular';
        font-size: 16px;
        color: #004899;
        line-height: 24px;
      }
      #ImageCard {
        height: 100%;
        overflow-x: scroll;
        white-space: nowrap;
        margin-bottom: 29px;
        .image-card {
          width: auto;
          height: 100%;
          margin-right: 14px;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: #00000029 0 3px 6px;
          display: inline-flex;
          vertical-align: top;
          .card-claim-image {
            width: 100%;
            height: 100%;
            .image-claim {
              width: auto;
              height: auto;
              .claim-pic {
                width: 100%;
                height: 100%;
                border-radius: 5px 5px 0 0;
                position: relative;
                max-width: 224px;
                max-height: 155px;
                min-height: 155px;
                margin: 0;
              }
              .claim-pic-pdf {
                max-width: 224px;
                max-height: 155px;
                min-height: 155px;
                padding: 37px 74px;
                background-color: #3ba9fe;
                border-radius: 5px 5px 0 0;
                .icon-pdf {
                  width: 67px;
                  height: 82px;
                  margin: 0 auto;
                }
              }
            }
            .card-claim-detail {
              width: 100%;
              padding: 7px 16px;
              position: relative;
              display: inline-flex;
              .card-col {
                width: fit-content;
                .file-icon {
                  width: fit-content;
                  height: 18px;
                  padding: 5px;
                  margin: 8px 0 5px;
                  font-family: 'Anuphan-Bold';
                  font-size: 6px;
                  color: #fff;
                  line-height: 8px;
                  background-color: #617d8c;
                  border-radius: 2px;
                }
              }
              .card-col-detail {
                line-height: 1;
                padding-left: 14px;
                .lbImageName {
                  padding-bottom: 6px;
                  font-family: 'Anuphan-Medium';
                  font-size: 10px;
                  color: #617d8c;
                  line-height: 13px;
                  vertical-align: top;
                  word-break: break-word;
                }
                .lbSizeImage {
                  font-family: 'Anuphan-Regular';
                  font-size: 8px;
                  color: #617d8c;
                  line-height: 10px;
                }
              }
            }
          }
        }
      }
    }
    .claim-action {
      width: 100%;
      height: 100%;
      padding: 10px 28px 34px;
      background-color: #f1f8ff;
      .claim-edit {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        display: inline-flex;
        .edit-col {
          margin-right: 15px;
          .btnEditDetail {
            width: 144px;
            height: 45px;
            padding: 11px 22px;
            border: 1px solid #3ba9fe;
            border-radius: 6px;
            background-color: #fff;
            font-family: 'Anuphan-Regular';
            font-size: 18px;
            color: #3ba9fe;
            line-height: 24px;
            text-transform: none;
          }
          .btnEnImage {
            width: 140px;
            padding: 11px;
            font-size: 14px;
            line-height: 20px;
          }
        }
        .edit-col-last {
          margin-right: 0;
        }
      }
      .btnEClaim {
        width: 100%;
        height: 45px;
        margin-top: 18px;
        border-radius: 6px;
        border-color: #3ba9fe;
        background-color: #3ba9fe;
        padding: 10px 106px;
        text-align: center;
        font-family: 'Anuphan-Medium';
        font-size: 18px;
        color: #fffbfb;
        line-height: 24px;
        text-transform: none;
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/claim-review.css');
@import url('../../assets/css/image-card.css');
</style>
