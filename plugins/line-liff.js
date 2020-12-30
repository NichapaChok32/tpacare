import Vue from 'vue'
import liff from '@line/liff'

Vue.use(liff)

export default (context, inject) => {
  const env = process.env.NODE_ENV
  const liffId =
    env === 'production' ? '1654878951-DRO02K3M' : '1654878951-DRO02K3M'
  liff.init({ liffId })
  context.$liff = liff
  inject('liff', liff)
}
