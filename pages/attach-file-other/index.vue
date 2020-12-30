<template v-click-outside="onClickOutside">
  <div id="AttachForm">
    <Header :title="lang.title" :backPath="backPath" />
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!isloading" class="attach-card">
      <div class="attach-detail">
        <div
          class="attach-group"
          :class="{
            groupList: receipt.length !== 0,
          }"
        >
          <input
            v-if="/android/i.test(userAgent)"
            id="receiptUpload"
            ref="receiptUpload"
            hidden
            contain
            type="file"
            accept=".jpg, .png, .pdf"
            size="5000000"
            capture="camera"
            @change="getReceiptFile"
          />
          <input
            v-if="!/android/i.test(userAgent)"
            id="receiptUpload"
            ref="receiptUpload"
            hidden
            contain
            type="file"
            accept=".jpg, .png, .pdf"
            size="5000000"
            @change="getReceiptFile"
          />
          <v-btn class="btnAttachFile" @click="chooseReceiptFiles">
            <img src="../../assets/images/add-file.png" class="add-icon" />
            <span class="lbAttach">{{ lang.receipt }}</span>
          </v-btn>
        </div>
        <div v-if="receipt.length !== 0" class="attach-group">
          <div v-for="(item, index) in receipt" :key="index" class="attach-row">
            <div class="attach-col">
              <img
                v-if="item.type === 'image/jpeg'"
                src="../../assets/images/file-jpg.png"
                class="file-icon"
              />
              <img
                v-if="item.type === 'application/pdf'"
                src="../../assets/images/file-pdf.png"
                class="file-icon"
              />
              <img
                v-if="item.type === 'image/png'"
                src="../../assets/images/file-png.png"
                class="file-icon"
              />
            </div>
            <div class="attach-col">
              <div class="detail-col">
                <label class="lbFileName">{{ item.name }}</label>
              </div>
              <div class="detail-col">
                <label class="lbFileSize">{{ item.size / 1000 + 'KB' }}</label>
              </div>
            </div>
            <v-btn class="delete-col" @click="deleteFile(index, 'receipt')">
              <img
                src="../../assets/images/delete-file.png"
                class="delete-icon"
              />
            </v-btn>
          </div>
        </div>
        <div
          class="attach-group medical-group"
          :class="{
            groupList: medical.length !== 0,
          }"
        >
          <input
            v-if="/android/i.test(userAgent)"
            id="medicalUpload"
            ref="medicalUpload"
            type="file"
            accept=".jpg, .png, .pdf"
            hidden
            contain
            size="5000000"
            capture="camera"
            @change="getMedicalFile"
          />
          <input
            v-if="!/android/i.test(userAgent)"
            id="medicalUpload"
            ref="medicalUpload"
            type="file"
            accept=".jpg, .png, .pdf"
            hidden
            contain
            size="5000000"
            @change="getMedicalFile"
          />
          <v-btn class="btnAttachFile" @click="chooseMedicalFiles">
            <img src="../../assets/images/add-file.png" class="add-icon" />
            <span class="lbAttach">{{ lang.medical }}</span>
          </v-btn>
        </div>
        <div v-if="medical.length !== 0" class="attach-group">
          <div v-for="(item, index) in medical" :key="index" class="attach-row">
            <div class="attach-col">
              <img
                v-if="item.type === 'image/jpeg'"
                src="../../assets/images/file-jpg.png"
                class="file-icon"
              />
              <img
                v-if="item.type === 'application/pdf'"
                src="../../assets/images/file-pdf.png"
                class="file-icon"
              />
              <img
                v-if="item.type === 'image/png'"
                src="../../assets/images/file-png.png"
                class="file-icon"
              />
            </div>
            <div class="attach-col">
              <div class="detail-col">
                <label class="lbFileName">{{ item.name }}</label>
              </div>
              <div class="detail-col">
                <label class="lbFileSize">{{ item.size / 1000 + 'KB' }}</label>
              </div>
            </div>
            <v-btn class="delete-col" @click="deleteFile(index, 'medical')">
              <img
                src="../../assets/images/delete-file.png"
                class="delete-icon"
              />
            </v-btn>
          </div>
        </div>
        <div
          class="attach-group other-group"
          :class="{
            groupList: other.length !== 0,
          }"
        >
          <input
            v-if="/android/i.test(userAgent)"
            id="otherUpload"
            ref="otherUpload"
            type="file"
            accept=".jpg, .png, .pdf"
            hidden
            contain
            size="5000000"
            capture="camera"
            @change="getOtherFile"
          />
          <input
            v-if="!/android/i.test(userAgent)"
            id="otherUpload"
            ref="otherUpload"
            type="file"
            accept=".jpg, .png, .pdf"
            hidden
            contain
            size="5000000"
            @change="getOtherFile"
          />
          <v-btn class="btnAttachFile" @click="chooseOtherFiles">
            <img src="../../assets/images/add-file.png" class="add-icon" />
            <span class="lbAttach">{{ lang.other }}</span>
          </v-btn>
        </div>
        <div v-if="other.length !== 0" class="attach-group">
          <div v-for="(item, index) in other" :key="index" class="attach-row">
            <div class="attach-col">
              <img
                v-if="item.type === 'image/jpeg'"
                src="../../assets/images/file-jpg.png"
                class="file-icon"
              />
              <img
                v-if="item.type === 'application/pdf'"
                src="../../assets/images/file-pdf.png"
                class="file-icon"
              />
              <img
                v-if="item.type === 'image/png'"
                src="../../assets/images/file-png.png"
                class="file-icon"
              />
            </div>
            <div class="attach-col">
              <div class="detail-col">
                <label class="lbFileName">{{ item.name }}</label>
              </div>
              <div class="detail-col">
                <label class="lbFileSize">{{ item.size / 1000 + 'KB' }}</label>
              </div>
            </div>
            <v-btn class="delete-col" @click="deleteFile(index, 'other')">
              <img
                src="../../assets/images/delete-file.png"
                class="delete-icon"
              />
            </v-btn>
          </div>
        </div>
        <div class="attach-footer">
          <label class="lbAttachFooter">{{ lang.desc }}</label>
          <b-btn
            type="submit"
            variant="primary"
            class="btnAttach"
            @click="checkValidate()"
          >
            {{ lang.btnAgree }}
          </b-btn>
        </div>
      </div>
    </div>
    <v-row v-if="isShow && !isloading" justify="center">
      <v-dialog
        v-model="isShow"
        persistent
        max-width="319"
        class="popup-dialog"
      >
        <v-card id="PopUpDelete">
          <v-card-title class="popup-header">
            <img
              v-if="isDelete"
              class="icon-header"
              center
              src="../../assets/images/delete-image.png"
              alt="Center image"
            />
            <img
              v-if="isValidate"
              class="icon-header"
              center
              src="../../assets/images/warning.png"
              alt="Center image"
            />
          </v-card-title>
          <v-card-text class="popup-body">
            {{ content }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <slot v-if="isDelete" name="footer">
              <v-btn class="modal-default-button" @click="cancel()">
                {{ lang.no }}
              </v-btn>
              <v-btn class="modal-default-button" @click="checkDeleteType">
                {{ lang.yes }}
              </v-btn>
            </slot>
            <slot v-if="isValidate" name="footer">
              <b-btn class="modal-default-button" @click="cancel()">
                {{ lang.agree }}
              </b-btn>
            </slot>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <Footer :path="path" :backPath="backPath" />
    <v-row v-if="isShowPopup && !isloading" justify="center">
      <v-dialog
        v-model="isShowPopup"
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
              src="../../assets/images/send-data.png"
              alt="Center image"
            />
            <img
              v-if="!isSuccess"
              class="icon-header"
              center
              src="../../assets/images/warning.svg"
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
import Dexie from 'dexie'
import { mapGetters } from 'vuex'
import Header from '../../components/header'
import Footer from '../../components/footer'
export default {
  name: 'AttachForm',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      claim: {},
      receipt: [],
      medical: [],
      other: [],
      isDelete: false,
      deleteIndex: 0,
      isShow: false,
      type: '',
      content: '',
      isValidate: false,
      token: '',
      isShowPopup: false,
      isloading: true,
      path: 'claim',
      backPath: '',
      lang: this.$t('attachOtherFile'),
      locale: this.$i18n.locale,
      isSuccess: false,
      oldReceipt: [],
      oldMedical: [],
      oldOther: [],
      db: new Dexie('s3'),
      userAgent: navigator.userAgent || navigator.vendor || window.opera,
    }
  },
  mounted() {
    const vm = this
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    vm.backPath = vm.getPath()
    if (vm.$auth.$storage.getLocalStorage('e-claim') !== null) {
      vm.claim = vm.$auth.$storage.getLocalStorage('e-claim')
      vm.db.version(1).stores({
        receipts: '++id, file, name, type, size',
        medicals: '++id, file, name, type, size',
        others: '++id, file, name, type, size',
      })
    }
    vm.isloading = false
  },
  methods: {
    ...mapGetters({
      getPath: 'getPath',
    }),
    chooseReceiptFiles() {
      document.getElementById('receiptUpload').click()
    },
    chooseMedicalFiles() {
      document.getElementById('medicalUpload').click()
    },
    chooseOtherFiles() {
      document.getElementById('otherUpload').click()
    },
    async setUpData() {
      const vm = this
      const receipts = await vm.db.receipts.toArray()
      const medicals = await vm.db.medicals.toArray()
      const others = await vm.db.others.toArray()
      if (receipts.length !== 0 && receipts.length !== null) {
        vm.receipt = receipts
      }
      if (medicals.length !== 0 && medicals.length !== null) {
        vm.medical = medicals
      }
      if (others.length !== 0 && others.length !== null) {
        vm.other = others
      }
      Dexie.delete('s3')
      vm.db = new Dexie('s3')
      vm.db.version(1).stores({
        receipts: '++id, file, name, type, size',
        medicals: '++id, file, name, type, size',
        others: '++id, file, name, type, size',
      })
    },
    getReceiptFile(e) {
      const vm = this
      const file = e.target.files[0]
      if (!file) {
        event.preventDefault()
        alert('No file chosen')
        return
      }
      if (file.size > 10000000) {
        event.preventDefault()
        vm.isValidate = true
        vm.isShow = true
        vm.content = vm.lang.sizeFileValidate
        return
      }
      const fl = {
        name: file.name,
        type: file.type,
        size: file.size,
      }
      const maxWidth = 500
      if (vm.oldReceipt.length === 0) {
        let sameMedicalFile = ''
        let sameOtherFile = ''
        if (vm.oldMedical.length !== 0) {
          for (let i = 0; i < vm.oldMedical.length; i++) {
            if (
              vm.oldMedical[i].name === fl.name &&
              vm.oldMedical[i].type === fl.type
            ) {
              sameMedicalFile = vm.oldReceipt[i]
            }
          }
        }
        if (vm.oldOther.length !== 0) {
          for (let i = 0; i < vm.oldOther.length; i++) {
            if (
              vm.oldOther[i].name === fl.name &&
              vm.oldOther[i].type === fl.type
            ) {
              sameOtherFile = vm.oldOther[i]
            }
          }
        }
        if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
          return
        }
        if (sameOtherFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
          return
        }
        const obj = {
          file: '',
          name: '',
          type: file.type,
          size: '',
        }
        if (/iPad|iPhone|iPod/.test(vm.userAgent)) {
          const name = file.name.split('.')[0]
          if (name === 'image') {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
            }
            fl.name = obj.name
            vm.oldReceipt.push(fl)
          } else {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
              case 'application/pdf':
                obj.name =
                  'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                break
            }
            vm.oldReceipt.push(fl)
          }
        } else {
          switch (file.type) {
            case 'image/jpeg':
              obj.name =
                'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
              break
            case 'image/png':
              obj.name =
                'img_' + new Date().toISOString().substr(0, 19) + '.png'
              break
            case 'application/pdf':
              obj.name =
                'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
              break
          }
          vm.oldReceipt.push(fl)
        }
        const selectedFile = file
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = (e) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            const img = new Image()
            img.src = e.target.result
            img.name = e.target.name
            img.size = e.target.size
            img.onload = (event) => {
              const canvas = document.createElement('canvas')
              const scaleFactor = maxWidth / event.target.width
              canvas.width = maxWidth
              canvas.height = event.target.height * scaleFactor
              const ctx = canvas.getContext('2d')
              ctx.drawImage(event.target, 0, 0, canvas.width, canvas.height)
              const srcEncoded = ctx.canvas.toDataURL(
                event.target,
                file.type,
                0
              )
              const test = srcEncoded.split(',')[1]
              const str = test.split('...')[0]
              obj.file = str
              let low = 0.0
              let middle = 0.5
              let high = 1.0
              if (file.size / 1000 < 500 - 1) {
                low = middle
              } else if (file.size / 1000 > 500) {
                high = middle
              }
              middle = (low + high) / 2
              obj.size = canvas.width * canvas.height
            }
          } else {
            const test = e.target.result.split(',')[1]
            const str = test.split('...')[0]
            obj.file = str
            obj.size = file.size
          }
        }
        vm.receipt.push(obj)
      } else {
        let sameReceiptFile = ''
        let sameMedicalFile = ''
        let sameOtherFile = ''
        for (let i = 0; i < vm.oldReceipt.length; i++) {
          if (
            vm.oldReceipt[i].name === fl.name &&
            vm.oldReceipt[i].type === fl.type
          ) {
            sameReceiptFile = vm.oldReceipt[i]
          }
        }
        if (vm.oldMedical.length !== 0) {
          for (let i = 0; i < vm.oldMedical.length; i++) {
            if (
              vm.oldMedical[i].name === fl.name &&
              vm.oldMedical[i].type === fl.type
            ) {
              sameMedicalFile = vm.oldReceipt[i]
            }
          }
        }
        if (vm.oldOther.length !== 0) {
          for (let i = 0; i < vm.oldOther.length; i++) {
            if (
              vm.oldOther[i].name === fl.name &&
              vm.oldOther[i].type === fl.type
            ) {
              sameOtherFile = vm.oldOther[i]
            }
          }
        }
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (sameOtherFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (
          sameReceiptFile !== '' ||
          sameMedicalFile !== '' ||
          sameOtherFile !== ''
        ) {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else {
          const obj = {
            file: '',
            name: '',
            type: file.type,
            size: '',
          }
          if (/iPad|iPhone|iPod/.test(vm.userAgent)) {
            const name = file.name.split('.')[0]
            if (name === 'image') {
              switch (file.type) {
                case 'image/jpeg':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                  break
                case 'image/png':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.png'
                  break
              }
              fl.name = obj.name
              vm.oldReceipt.push(fl)
            } else {
              switch (file.type) {
                case 'image/jpeg':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                  break
                case 'image/png':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.png'
                  break
                case 'application/pdf':
                  obj.name =
                    'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                  break
              }
              vm.oldReceipt.push(fl)
            }
          } else {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
              case 'application/pdf':
                obj.name =
                  'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                break
            }
            vm.oldReceipt.push(fl)
          }
          const selectedFile = file
          const reader = new FileReader()
          reader.readAsDataURL(selectedFile)
          reader.onload = (e) => {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
              const img = new Image()
              img.src = e.target.result
              img.name = e.target.name
              img.size = e.target.size
              img.onload = (event) => {
                const canvas = document.createElement('canvas')
                const scaleFactor = maxWidth / event.target.width
                canvas.width = maxWidth
                canvas.height = event.target.height * scaleFactor
                const ctx = canvas.getContext('2d')
                ctx.drawImage(event.target, 0, 0, canvas.width, canvas.height)
                const srcEncoded = ctx.canvas.toDataURL(
                  event.target,
                  file.type,
                  0
                )
                const test = srcEncoded.split(',')[1]
                const str = test.split('...')[0]
                obj.file = str
                let low = 0.0
                let middle = 0.5
                let high = 1.0
                if (file.size / 1000 < 500 - 1) {
                  low = middle
                } else if (file.size / 1000 > 500) {
                  high = middle
                }
                middle = (low + high) / 2
                obj.size = canvas.width * canvas.height
              }
            } else {
              const test = e.target.result.split(',')[1]
              const str = test.split('...')[0]
              obj.file = str
              obj.size = file.size
            }
          }
          vm.receipt.push(obj)
        }
      }
    },
    cancel() {
      const vm = this
      vm.isShow = false
    },
    deleteFile(index, type) {
      const vm = this
      event.preventDefault()
      vm.type = type
      vm.deleteIndex = index
      vm.isDelete = true
      vm.isShow = true
      vm.content = vm.lang.deleteConfirm
    },
    checkDeleteType(e) {
      const vm = this
      vm.isShow = false
      switch (vm.type) {
        case 'receipt':
          vm.receipt.splice(vm.deleteIndex, 1)
          break
        case 'medical':
          vm.medical.splice(vm.deleteIndex, 1)
          break
        case 'other':
          vm.other.splice(vm.deleteIndex, 1)
          break
      }
    },
    getMedicalFile(e) {
      const vm = this
      const file = e.target.files[0]
      if (!file) {
        event.preventDefault()
        alert('No file chosen')
        return
      }
      if (file.size > 10000000) {
        event.preventDefault()
        vm.isValidate = true
        vm.isShow = true
        vm.content = vm.lang.sizeFileValidate
        return
      }
      const fl = {
        name: file.name,
        type: file.type,
        size: file.size,
      }
      if (vm.oldMedical.length === 0) {
        let sameReceiptFile = ''
        let sameOtherFile = ''
        if (vm.oldReceipt.length !== 0) {
          for (let i = 0; i < vm.oldReceipt.length; i++) {
            if (
              vm.oldReceipt[i].name === fl.name &&
              vm.oldReceipt[i].type === fl.type
            ) {
              sameReceiptFile = vm.oldReceipt[i]
            }
          }
        }
        if (vm.oldOther.length !== 0) {
          for (let i = 0; i < vm.oldOther.length; i++) {
            if (
              vm.oldOther[i].name === fl.name &&
              vm.oldOther[i].type === fl.type
            ) {
              sameOtherFile = vm.oldOther[i]
            }
          }
        }
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
          return
        }
        if (sameOtherFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
          return
        }
        const obj = {
          file: '',
          name: '',
          type: file.type,
          size: '',
        }
        const maxWidth = 500
        if (/iPad|iPhone|iPod/.test(vm.userAgent)) {
          const name = file.name.split('.')[0]
          if (name === 'image') {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
            }
            fl.name = obj.name
            vm.oldMedical.push(fl)
          } else {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
              case 'application/pdf':
                obj.name =
                  'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                break
            }
            vm.oldMedical.push(fl)
          }
        } else {
          switch (file.type) {
            case 'image/jpeg':
              obj.name =
                'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
              break
            case 'image/png':
              obj.name =
                'img_' + new Date().toISOString().substr(0, 19) + '.png'
              break
            case 'application/pdf':
              obj.name =
                'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
              break
          }
          vm.oldMedical.push(fl)
        }
        const selectedFile = file
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = (e) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            const img = new Image()
            img.src = e.target.result
            img.name = e.target.name
            img.size = e.target.size
            img.onload = (event) => {
              const canvas = document.createElement('canvas')
              const scaleFactor = maxWidth / event.target.width
              canvas.width = maxWidth
              canvas.height = event.target.height * scaleFactor
              const ctx = canvas.getContext('2d')
              ctx.drawImage(event.target, 0, 0, canvas.width, canvas.height)
              const srcEncoded = ctx.canvas.toDataURL(
                event.target,
                file.type,
                0
              )
              const test = srcEncoded.split(',')[1]
              const str = test.split('...')[0]
              obj.file = str
              let low = 0.0
              let middle = 0.5
              let high = 1.0
              if (file.size / 1000 < 500 - 1) {
                low = middle
              } else if (file.size / 1000 > 500) {
                high = middle
              }
              middle = (low + high) / 2
              obj.size = canvas.width * canvas.height
            }
          } else {
            const test = e.target.result.split(',')[1]
            const str = test.split('...')[0]
            obj.file = str
            obj.size = file.size
          }
        }
        vm.medical.push(obj)
      } else {
        let sameReceiptFile = ''
        let sameMedicalFile = ''
        let sameOtherFile = ''
        for (let i = 0; i < vm.oldReceipt.length; i++) {
          if (
            vm.oldReceipt[i].name === fl.name &&
            vm.oldReceipt[i].type === fl.type
          ) {
            sameReceiptFile = vm.oldReceipt[i]
          }
        }
        if (vm.oldMedical.length !== 0) {
          for (let i = 0; i < vm.oldMedical.length; i++) {
            if (
              vm.oldMedical[i].name === fl.name &&
              vm.oldMedical[i].type === fl.type
            ) {
              sameMedicalFile = vm.oldReceipt[i]
            }
          }
        }
        if (vm.oldOther.length !== 0) {
          for (let i = 0; i < vm.oldOther.length; i++) {
            if (
              vm.oldOther[i].name === fl.name &&
              vm.oldOther[i].type === fl.type
            ) {
              sameOtherFile = vm.oldOther[i]
            }
          }
        }
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (sameOtherFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (
          sameReceiptFile !== '' ||
          sameMedicalFile !== '' ||
          sameOtherFile !== ''
        ) {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else {
          const obj = {
            file: '',
            name: '',
            type: file.type,
            size: '',
          }
          const maxWidth = 50
          if (/iPad|iPhone|iPod/.test(vm.userAgent)) {
            const name = file.name.split('.')[0]
            if (name === 'image') {
              switch (file.type) {
                case 'image/jpeg':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                  break
                case 'image/png':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.png'
                  break
              }
              fl.name = obj.name
              vm.oldMedical.push(fl)
            } else {
              switch (file.type) {
                case 'image/jpeg':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                  break
                case 'image/png':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.png'
                  break
                case 'application/pdf':
                  obj.name =
                    'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                  break
              }
              vm.oldMedical.push(fl)
            }
          } else {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
              case 'application/pdf':
                obj.name =
                  'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                break
            }
            vm.oldMedical.push(fl)
          }
          const selectedFile = file
          const reader = new FileReader()
          reader.readAsDataURL(selectedFile)
          reader.onload = (e) => {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
              const img = new Image()
              img.src = e.target.result
              img.name = e.target.name
              img.size = e.target.size
              img.onload = (event) => {
                const canvas = document.createElement('canvas')
                const scaleFactor = maxWidth / event.target.width
                canvas.width = maxWidth
                canvas.height = event.target.height * scaleFactor
                const ctx = canvas.getContext('2d')
                ctx.drawImage(event.target, 0, 0, canvas.width, canvas.height)
                const srcEncoded = ctx.canvas.toDataURL(
                  event.target,
                  file.type,
                  0
                )
                const test = srcEncoded.split(',')[1]
                const str = test.split('...')[0]
                obj.file = str
                let low = 0.0
                let middle = 0.5
                let high = 1.0
                if (file.size / 1000 < 500 - 1) {
                  low = middle
                } else if (file.size / 1000 > 500) {
                  high = middle
                }
                middle = (low + high) / 2
                obj.size = canvas.width * canvas.height
              }
            } else {
              const test = e.target.result.split(',')[1]
              const str = test.split('...')[0]
              obj.file = str
              obj.size = file.size
            }
          }
          vm.medical.push(obj)
        }
      }
    },
    getOtherFile(e) {
      const vm = this
      const file = e.target.files[0]
      if (!file) {
        event.preventDefault()
        alert('No file chosen')
        return
      }
      if (file.size > 10000000) {
        event.preventDefault()
        vm.isValidate = true
        vm.isShow = true
        vm.content = vm.lang.sizeFileValidate
        return
      }
      const fl = {
        name: file.name,
        type: file.type,
        size: file.size,
      }
      if (vm.oldOther.length === 0) {
        let sameReceiptFile = ''
        let sameMedicalFile = ''
        if (vm.oldReceipt.length !== 0) {
          for (let i = 0; i < vm.oldReceipt.length; i++) {
            if (
              vm.oldReceipt[i].name === fl.name &&
              vm.oldReceipt[i].type === fl.type
            ) {
              sameReceiptFile = vm.oldReceipt[i]
            }
          }
        }
        if (vm.oldMedical.length !== 0) {
          for (let i = 0; i < vm.oldMedical.length; i++) {
            if (
              vm.oldMedical[i].name === fl.name &&
              vm.oldMedical[i].type === fl.type
            ) {
              sameMedicalFile = vm.oldMedical[i]
            }
          }
        }
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
          return
        }
        if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
          return
        }
        const obj = {
          file: '',
          name: '',
          type: file.type,
          size: '',
        }
        const maxWidth = 500
        if (/iPad|iPhone|iPod/.test(vm.userAgent)) {
          const name = file.name.split('.')[0]
          if (name === 'image') {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
            }
            fl.name = obj.name
            vm.oldOther.push(fl)
          } else {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
              case 'application/pdf':
                obj.name =
                  'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                break
            }
            vm.oldOther.push(fl)
          }
        } else {
          switch (file.type) {
            case 'image/jpeg':
              obj.name =
                'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
              break
            case 'image/png':
              obj.name =
                'img_' + new Date().toISOString().substr(0, 19) + '.png'
              break
            case 'application/pdf':
              obj.name =
                'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
              break
          }
          vm.oldOther.push(fl)
        }
        const selectedFile = file
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = (e) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            const img = new Image()
            img.src = e.target.result
            img.name = e.target.name
            img.size = e.target.size
            img.onload = (event) => {
              const canvas = document.createElement('canvas')
              const scaleFactor = maxWidth / event.target.width
              canvas.width = maxWidth
              canvas.height = event.target.height * scaleFactor
              const ctx = canvas.getContext('2d')
              ctx.drawImage(event.target, 0, 0, canvas.width, canvas.height)
              const srcEncoded = ctx.canvas.toDataURL(
                event.target,
                file.type,
                0
              )
              const test = srcEncoded.split(',')[1]
              const str = test.split('...')[0]
              obj.file = str
              let low = 0.0
              let middle = 0.5
              let high = 1.0
              if (file.size / 1000 < 500 - 1) {
                low = middle
              } else if (file.size / 1000 > 500) {
                high = middle
              }
              middle = (low + high) / 2
              obj.size = canvas.width * canvas.height
            }
          } else {
            const test = e.target.result.split(',')[1]
            const str = test.split('...')[0]
            obj.file = str
            obj.size = file.size
          }
        }
        vm.other.push(obj)
      } else {
        let sameReceiptFile = ''
        let sameMedicalFile = ''
        let sameOtherFile = ''
        for (let i = 0; i < vm.oldReceipt.length; i++) {
          if (
            vm.oldReceipt[i].name === fl.name &&
            vm.oldReceipt[i].type === fl.type
          ) {
            sameReceiptFile = vm.oldReceipt[i]
          }
        }
        if (vm.oldMedical.length !== 0) {
          for (let i = 0; i < vm.oldMedical.length; i++) {
            if (
              vm.oldMedical[i].name === fl.name &&
              vm.oldMedical[i].type === fl.type
            ) {
              sameMedicalFile = vm.oldReceipt[i]
            }
          }
        }
        if (vm.oldOther.length !== 0) {
          for (let i = 0; i < vm.oldOther.length; i++) {
            if (
              vm.oldOther[i].name === fl.name &&
              vm.oldOther[i].type === fl.type
            ) {
              sameOtherFile = vm.oldOther[i]
            }
          }
        }
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (sameOtherFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else if (
          sameReceiptFile !== '' ||
          sameMedicalFile !== '' ||
          sameOtherFile !== ''
        ) {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.sameFileValidate
        } else {
          const obj = {
            file: '',
            name: '',
            type: file.type,
            size: '',
          }
          const maxWidth = 500
          if (/iPad|iPhone|iPod/.test(vm.userAgent)) {
            const name = file.name.split('.')[0]
            if (name === 'image') {
              switch (file.type) {
                case 'image/jpeg':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                  break
                case 'image/png':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.png'
                  break
              }
              fl.name = obj.name
              vm.oldOther.push(fl)
            } else {
              switch (file.type) {
                case 'image/jpeg':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                  break
                case 'image/png':
                  obj.name =
                    'img_' + new Date().toISOString().substr(0, 19) + '.png'
                  break
                case 'application/pdf':
                  obj.name =
                    'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                  break
              }
              vm.oldOther.push(fl)
            }
          } else {
            switch (file.type) {
              case 'image/jpeg':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.jpg'
                break
              case 'image/png':
                obj.name =
                  'img_' + new Date().toISOString().substr(0, 19) + '.png'
                break
              case 'application/pdf':
                obj.name =
                  'file_' + new Date().toISOString().substr(0, 19) + '.pdf'
                break
            }
            vm.oldOther.push(fl)
          }
          const selectedFile = file
          const reader = new FileReader()
          reader.readAsDataURL(selectedFile)
          reader.onload = (e) => {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
              const img = new Image()
              img.src = e.target.result
              img.name = e.target.name
              img.size = e.target.size
              img.onload = (event) => {
                const canvas = document.createElement('canvas')
                const scaleFactor = maxWidth / event.target.width
                canvas.width = maxWidth
                canvas.height = event.target.height * scaleFactor
                const ctx = canvas.getContext('2d')
                ctx.drawImage(event.target, 0, 0, canvas.width, canvas.height)
                const srcEncoded = ctx.canvas.toDataURL(
                  event.target,
                  file.type,
                  0
                )
                const test = srcEncoded.split(',')[1]
                const str = test.split('...')[0]
                obj.file = str
                let low = 0.0
                let middle = 0.5
                let high = 1.0
                if (file.size / 1000 < 500 - 1) {
                  low = middle
                } else if (file.size / 1000 > 500) {
                  high = middle
                }
                middle = (low + high) / 2
                obj.size = canvas.width * canvas.height
              }
            } else {
              const test = e.target.result.split(',')[1]
              const str = test.split('...')[0]
              obj.file = str
              obj.size = file.size
            }
          }
          vm.other.push(obj)
        }
      }
    },
    checkValidate() {
      const vm = this
      vm.isloading = true
      if (
        vm.receipt.length === 0 &&
        vm.medical.length === 0 &&
        vm.other.length === 0
      ) {
        event.preventDefault()
        vm.isloading = false
        vm.isValidate = true
        vm.isShow = true
        vm.content = vm.lang.notFileValidate
      } else {
        vm.saveAttachFile()
      }
    },
    saveAttachFile() {
      const vm = this
      vm.$auth.$storage.removeLocalStorage('e-claim')
      const body = {
        policy_no: vm.claim.policy_no,
        claim_no: vm.claim.claim_no,
        status_no: vm.claim.status_no,
        lang: vm.locale,
        receipt_attachment: vm.receipt,
        medical_certificate_attachment: vm.medical,
        other_attachment: vm.other,
      }
      vm.setOtherFile(body)
    },
    async setOtherFile(body) {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.post('claim/more', body).then((response) => {
          const res = response.data
          if (res.status === 'ok') {
            Dexie.delete('s3')
            vm.$auth.$storage.removeLocalStorage('e-claim')
            vm.isloading = false
            vm.isShowPopup = true
            vm.isSuccess = true
            vm.content = vm.lang.successEClaim
          }
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        vm.isloading = false
        vm.isShowPopup = true
        vm.isSuccess = false
        vm.content = error.message
      }
    },
    summitPopup() {
      const vm = this
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.$router.push(vm.backPath)
        } else if (vm.locale === 'en') {
          vm.$router.push(vm.backPath)
        }
      } else {
        vm.isShowPopup = false
      }
    },
    onClickOutside(e) {
      const vm = this
      vm.isShowPopup = false
      if (vm.isSuccess) {
        if (vm.locale === 'th') {
          vm.$router.push(vm.backPath)
        } else if (vm.locale === 'en') {
          vm.$router.push(vm.backPath)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#AttachForm {
  height: 100%;
  position: relative;
  .attach-card {
    position: relative;
    .attach-detail {
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 69px 28px 34px;
      .attach-group {
        padding-bottom: 25px;
        .btnAttachFile {
          width: 100%;
          height: 50px;
          padding: 0;
          background-color: #fff;
          border: 1.5px dashed #3ba9fe;
          border-radius: 6px;
          gap: 4px;
          text-align: left;
          justify-content: left;
          letter-spacing: 0;
          .add-icon {
            width: 10px;
            height: 10px;
            margin: 0 10px 0 17px;
          }
          .lbAttach {
            padding: 15px 0;
            font-family: 'Anuphan-Regular';
            font-size: 16px;
            line-height: 24px;
            color: #004899;
          }
        }
        .attach-row {
          width: 100%;
          padding: 16px 0;
          display: inline-flex;
          border-bottom: 0.5px solid #e7ecee;
          .attach-col {
            width: auto;
            vertical-align: top;
            .detail-col {
              display: block;
              .lbFileName {
                padding-bottom: 5px !important;
                font-family: 'Anuphan-Regular';
                font-size: 14px;
                line-height: 18px;
                color: #617d8c;
                text-align: left;
              }
              .lbFileSize {
                font-family: 'Anuphan-Regular';
                font-size: 10px;
                line-height: 13px;
                color: #617d8c;
                text-align: left;
              }
            }
            .file-icon {
              width: 32px;
              height: 41px;
              margin-right: 18px;
            }
          }
          .delete-col {
            margin-left: auto;
            text-align: right;
            background-color: transparent;
            border: none;
            padding: 0;
            .delete-icon {
              width: 17px;
              height: 19px;
            }
          }
        }
      }
      .medical-group {
        padding-bottom: 25px;
      }
      .other-group {
        padding-bottom: 70px;
      }
      .groupList {
        padding-bottom: 0;
      }
      .attach-footer {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0 auto 34px;
        text-align: center;
        .lbAttachFooter {
          padding-bottom: 18px;
          font-family: 'Anuphan-Regular';
          font-size: 10px;
          color: #617d8c;
          line-height: 26px;
        }
        .btnAttach {
          width: 100%;
          height: 45px;
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
        .disabled {
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/attach-more-file.css');
</style>
