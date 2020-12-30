import Vue from 'vue'
import liff from '@line/liff'

Vue.use(liff)

export default (context, inject) => {
  const env = process.env.NODE_ENV
  const liffId =
    env === 'production' ? '1654474751-g2Vmnrk3' : '1654474751-g2Vmnrk3'
  liff.init({ liffId })
  context.$liff = liff
  inject('liff', liff)
}
