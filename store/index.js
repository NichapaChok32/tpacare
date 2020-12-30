/* eslint-disable prettier/prettier */
import Vuex from 'vuex'

const state = {
  token: '',
  register: {
    token: '',
    ref_no: '',
    phone: '',
    ttl_minute: 0,
    is_old_user: false,
  },
  condition: {
    id: 0,
    isForce: false,
    isAgree: false,
  },
  privacy: {
    id: 0,
    isForce: false,
    isAgree: false,
  },
  backPath: '',
  username: '',
  insurance: {},
  isActivate: false,
  companyName: '',
  coverages: [],
  card: '',
  claim: {
    email: '',
    claim_type: null,
    admited_type: null,
    admited_date: '',
    accident_date: '',
    symptom: '',
    medical_expense: '',
    provider_code: '',
    provider_name: '',
    insurer_name_th: '',
    insurer_name_en: '',
    card_type: '',
  },
  sympton: '',
  hospital: '',
  receipt: [],
  medical: [],
  mobileList: [],
  lineIsReady: false,
  lineUserId: '',
  lineIsClient: false,
  isAddCard: false,
  isEditCard: false,
}

const mutations = {
  setToken(state, token) {
    state.token = token
  },
  resetToken(state) {
    state.token = ''
  },
  setRegister(state, data) {
    state.register = {
      token: data.token,
      ref_no: data.ref,
      phone: data.phone,
      ttl_minute: data.ttl_minute,
      is_old_user: data.is_old_user,
    }
  },
  resetRegister(state) {
    state.register = {
      token: '',
      ref_no: '',
      phone: '',
      ttl_minute: 0,
      is_old_user: false,
    }
  },
  setCondition(state, condition) {
    state.condition = condition
  },
  setPrivacy(state, privacy) {
    state.privacy = privacy
  },
  setPath(state, path) {
    state.backPath = path
  },
  setUsername(state, username) {
    state.username = username
  },
  resetUsername(state) {
    state.username = ''
  },
  resetCondition(state) {
    state.condition = {
      id: 0,
      isForce: false,
      isAgree: false,
    }
  },
  resetPrivacy(state) {
    state.privacy = {
      id: 0,
      isForce: false,
      isAgree: false,
    }
  },
  setInsurance(state, insurance) {
    state.insurance = insurance
  },
  setActivate(state, act) {
    state.isActivate = act
  },
  setCompanyName(state, name) {
    state.companyName = name
  },
  resetCompanyName(state) {
    state.companyName = ''
  },
  setCoverage(state, coverage) {
    state.coverages = coverage
  },
  resetCoverage(state) {
    state.coverages = []
  },
  setCard(state, card) {
    state.card = card
  },
  resetCard(state) {
    state.card = ''
  },
  setClaim(state, claim) {
    state.claim = {
      email: claim.email,
      claim_type: claim.claim_type,
      admited_type: claim.admited_type,
      admited_date: claim.admited_date,
      accident_date: claim.accident_date,
      symptom: claim.symptom,
      medical_expense: claim.medical_expense,
      provider_code: claim.provider_code,
      provider_name: claim.provider_name,
      insurer_name_th: claim.insurer_name_th,
      insurer_name_en: claim.insurer_name_en,
      card_type: claim.card_type,
    }
  },
  resetClaim(state) {
    state.claim = {
      email: '',
      claim_type: null,
      admited_type: null,
      admited_date: '',
      accident_date: '',
      symptom: '',
      medical_expense: '',
      provider_code: '',
      provider_name: '',
      insurer_name_th: '',
      insurer_name_en: '',
      card_type: '',
    }
  },
  setSympton(state, sympton) {
    state.sympton = sympton
  },
  resetSympton(state) {
    state.sympton = ''
  },
  setHospital(state, hospital) {
    state.hospital = hospital
  },
  resetHospital(state) {
    state.hospital = ''
  },
  setReceipt(state, receipt) {
    state.receipt.push(receipt)
  },
  resetReceipt(state) {
    state.receipt = []
  },
  setMedical(state, medical) {
    state.medical.push(medical)
  },
  resetMedical(state) {
    state.medical = []
  },
  setMobileList(state, list) {
    state.mobileList = list
  },
  resetMobileList(state) {
    state.mobileList = []
  },
  setLineIsReady(state, status) {
    state.lineIsReady = status
  },
  setLineUserId(state, token) {
    state.lineIdToken = token
  },
  setLineIsClient(state, status) {
    state.lineIsClient = status
  },
  setIsAddCard(state, status) {
    state.isAddCard = status
  },
  resetIsAddCard(state) {
    state.isAddCard = false
  },
  setIsEditCard(state, status) {
    state.isEditCard = status
  },
  resetIsEditCard(state) {
    state.isEditCard = false
  },
}

const getters = {
  getToken(state) {
    return state.token
  },
  getRegister(state) {
    return state.register
  },
  getCondition(state) {
    return state.condition
  },
  getPrivacy(state) {
    return state.privacy
  },
  getPath(state) {
    return state.backPath
  },
  getUsername(state) {
    return state.username
  },
  getInsurance(state) {
    return state.insurance
  },
  getActivate(state) {
    return state.isActivate
  },
  getCompanyName(state) {
    return state.companyName
  },
  getCoverage(state) {
    return state.coverages
  },
  getCard(state) {
    return state.card
  },
  getClaim(state) {
    return state.claim
  },
  getSympton(state) {
    return state.sympton
  },
  getHospital(state) {
    return state.hospital
  },
  getReceipt(state) {
    return state.receipt
  },
  getMedical(state) {
    return state.medical
  },
  getMobileList(state) {
    return state.mobileList
  },
  getLineIsReady(state) {
    return state.lineIsReady
  },
  getLineUserId(state) {
    return state.lineIdToken
  },
  getLineIsClient(state) {
    return state.lineIsClient
  },
  getIsAddCard(state) {
    return state.isAddCard
  },
  getIsEditCard(state) {
    return state.isEditCard
  },
}

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    state,
    mutations,
    getters,
  })
}

export default createStore
