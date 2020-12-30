import Vue from 'vue'
import liff from '@line/liff'

Vue.use(liff)

export default (context, inject) => {
  const env = process.env.NODE_ENV
  const liffId =
    env === 'production' ? '1655531529-Lv4XjPGY' : '1655531529-Lv4XjPGY'
  liff.init({ liffId })
  context.$liff = liff
  inject('liff', liff)
}
