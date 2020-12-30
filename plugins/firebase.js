import { firebase } from '@firebase/app'
import '@firebase/firestore'
import '@firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDmuKdHKz9bobA9kjH5TN1uK1NaPCKhpg0',
  authDomain: 'tpa-web-60fb2.firebaseapp.com',
  databaseURL: 'https://tpa-web-60fb2.firebaseio.com',
  projectId: 'tpa-web-60fb2',
  storageBucket: 'tpa-web-60fb2.appspot.com',
  messagingSenderId: '522430643272',
  appId: '1:522430643272:web:f0c44616a5b615e9feec7d',
  measurementId: 'G-TJQ65819F4',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()
