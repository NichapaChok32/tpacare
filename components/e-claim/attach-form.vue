<template>
  <div id="AttachForm">
    <div class="attach-card">
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
            <span class="lbAttach">{{ lang.attachForm.receipt }}</span>
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
            <span class="lbAttach">{{ lang.attachForm.medicalAttach }}</span>
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
      </div>
      <div class="attach-footer">
        <label class="lbAttachFooter">{{ lang.attachForm.desc }}</label>
        <v-btn
          type="submit"
          variant="primary"
          class="btnAttach"
          @click="checkValidate()"
        >
          {{ lang.btnSending }}
        </v-btn>
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
              v-if="isDelete && !isValidate"
              class="icon-header"
              center
              src="../../assets/images/delete-image.png"
              alt="Center image"
            />
            <img
              v-if="isValidate && !isDelete"
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
                <label class="lbBtnPopUp">
                  {{ lang.attachForm.no }}
                </label>
              </v-btn>
              <v-btn class="modal-default-button" @click="checkDeleteType">
                <label class="lbBtnPopUp">
                  {{ lang.attachForm.yes }}
                </label>
              </v-btn>
            </slot>
            <slot v-if="isValidate" name="footer">
              <b-btn class="modal-default-button" @click="cancel()">
                <label class="lbBtnPopUp">
                  {{ lang.attachForm.agree }}
                </label>
              </b-btn>
            </slot>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import Dexie from 'dexie'
export default {
  name: 'AttachForm',
  data() {
    return {
      lang: this.$t('eclaimReport'),
      locale: this.$i18n.locale,
      claim: {},
      receipt: [],
      medical: [],
      isDelete: false,
      deleteIndex: 0,
      isShow: false,
      type: '',
      content: '',
      isValidate: false,
      oldReceipt: [],
      oldMedical: [],
      db: new Dexie('s3'),
      userAgent: navigator.userAgent || navigator.vendor || window.opera,
    }
  },
  mounted() {
    const vm = this
    vm.claim = vm.$auth.$storage.getLocalStorage('e-claim')
    vm.db.version(1).stores({
      receipts: '++id, file, name, type, size',
      medicals: '++id, file, name, type, size',
    })
    vm.getImageDatas()
  },
  methods: {
    chooseReceiptFiles() {
      document.getElementById('receiptUpload').click()
    },
    chooseMedicalFiles() {
      document.getElementById('medicalUpload').click()
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
      Dexie.delete('s3')
      vm.db = new Dexie('s3')
      vm.db.version(1).stores({
        receipts: '++id, file, name, type, size',
        medicals: '++id, file, name, type, size',
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
        vm.content = vm.lang.attachForm.sizeFileValidate
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
        if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
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
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
        } else if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
        } else if (sameReceiptFile !== '' || sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
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
      vm.isValidate = false
    },
    deleteFile(index, type) {
      const vm = this
      event.preventDefault()
      vm.type = type
      vm.deleteIndex = index
      vm.isDelete = true
      vm.isShow = true
      vm.content = vm.lang.attachForm.deleteConfirm
    },
    checkDeleteType(e) {
      const vm = this
      vm.isShow = false
      vm.isDelete = false
      switch (vm.type) {
        case 'receipt':
          vm.receipt.splice(vm.deleteIndex, 1)
          vm.oldReceipt.splice(vm.deleteIndex, 1)
          break
        case 'medical':
          vm.medical.splice(vm.deleteIndex, 1)
          vm.oldMedical.splice(vm.deleteIndex, 1)
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
        vm.content = vm.lang.attachForm.sizeFileValidate
        return
      }
      const fl = {
        name: file.name,
        type: file.type,
        size: file.size,
      }
      if (vm.oldMedical.length === 0) {
        let sameReceiptFile = ''
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
        // eslint-disable-next-line no-console
        console.log(sameReceiptFile)
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
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
        for (let i = 0; i < vm.oldMedical.length; i++) {
          if (
            vm.oldMedical[i].name === fl.name &&
            vm.oldMedical[i].type === fl.type
          ) {
            sameMedicalFile = vm.oldMedical[i]
          }
        }
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
        if (sameReceiptFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
        } else if (sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
        } else if (sameReceiptFile !== '' || sameMedicalFile !== '') {
          event.preventDefault()
          vm.isValidate = true
          vm.isShow = true
          vm.content = vm.lang.attachForm.sameFileValidate
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
    checkValidate() {
      const vm = this
      if (vm.receipt.length === 0 && vm.medical.length === 0) {
        event.preventDefault()
        vm.isValidate = true
        vm.isShow = true
        vm.content = vm.lang.attachForm.notFileValidate
      } else {
        vm.oldReceipt = []
        vm.oldMedical = []
        vm.saveAttachFile()
      }
    },
    async saveAttachFile() {
      const vm = this
      Dexie.delete('s3')
      vm.db = new Dexie('s3')
      vm.db.version(1).stores({
        receipts: '++id, file, name, type, size',
        medicals: '++id, file, name, type, size',
      })
      for (let i = 0; i < vm.receipt.length; i++) {
        await vm.db.receipts.add({
          file: vm.receipt[i].file,
          name: vm.receipt[i].name,
          type: vm.receipt[i].type,
          size: vm.receipt[i].size,
        })
      }
      for (let j = 0; j < vm.medical.length; j++) {
        await vm.db.medicals.add({
          file: vm.medical[j].file,
          name: vm.medical[j].name,
          type: vm.medical[j].type,
          size: vm.medical[j].size,
        })
      }
      vm.receipt = []
      vm.medical = []
      vm.$emit('setSetpper', 3)
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
  padding-top: 13px;
  .attach-card {
    position: relative;
    .attach-detail {
      width: 100%;
      height: 100%;
      max-height: 330px;
      position: relative;
      overflow: auto;
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
        padding-bottom: 0;
      }
      .groupList {
        padding-bottom: 9px;
      }
    }
    .attach-footer {
      width: 100%;
      height: 100%;
      padding: 0 28px;
      margin: 0 auto;
      position: fixed;
      top: 80%;
      left: 0%;
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
  .eclaim-popup {
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
}
</style>
<style>
@import url('../../assets/css/attach-form.css');
</style>
