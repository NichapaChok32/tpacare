<template>
  <div>
    <v-progress-circular
      v-if="isloading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-else-if="!lineIsClient"></div>
    <v-container v-else-if="!isloading && log === ''" id="Home" fluid>
      <v-row fixed class="home-nav">
        <v-col class="float-left avartar-col" sm="1">
          <v-avatar v-if="profile.photo !== null" height="40" width="40">
            <v-img :src="profile.photo" max-height="40" max-width="40" />
          </v-avatar>
          <v-avatar v-if="profile.photo === null" height="40" width="40">
            <img src="../assets/images/avatar.png" />
          </v-avatar>
        </v-col>
        <v-col sm="9" class="float-left welcome-col">
          <label class="lbHeader">{{ lang.welcome }}</label>
          <label class="lbHeader"
            >{{ lang.mr + ' ' + profile.name + ' ' + profile.surname }}
          </label>
        </v-col>
        <v-col sm="2" class="float-right d-flex setting-col">
          <v-row v-if="!isloading" class="setting-row">
            <v-col cols="7">
              <v-badge
                v-if="notificationCount !== 0"
                :content="notificationCount >= 9 ? '9+' : notificationCount"
                class="noti-badge"
              >
                <v-btn
                  max-width="40"
                  max-height="25"
                  class="btnNav"
                  :to="locale === 'en' ? '/en/notification' : '/notification'"
                >
                  <img
                    class="setting"
                    src="../assets/images/notification.svg"
                  />
                </v-btn>
              </v-badge>
              <v-btn
                v-else
                max-width="40"
                max-height="25"
                class="btnNav"
                :to="locale === 'en' ? '/en/notification' : '/notification'"
              >
                <img
                  class="setting-notNotification"
                  src="../assets/images/notification.svg"
                />
              </v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn
                max-width="26"
                max-height="26"
                class="btnNav"
                :to="locale === 'en' ? '/en/setting' : '/setting'"
              >
                <img class="notification" src="../assets/images/setting.svg" />
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-container class="home-container">
        <div class="home-menu">
          <v-row justify="center" class="home-detail">
            <v-col cols="4" class="menu-col">
              <v-card class="home-menu">
                <v-btn
                  max-width="108"
                  max-height="108"
                  class="btnMenu fill-height"
                  @click="
                    !isloading ? checkConditionBeforeLink('coverage') : ''
                  "
                >
                  <img src="../assets/images/coverage.svg" class="icon" />
                  <span class="lbMenu text-wrap">{{ lang.coverage }}</span>
                </v-btn>
              </v-card>
            </v-col>
            <v-col cols="4" class="menu-col">
              <v-card class="home-menu">
                <v-btn
                  max-width="108"
                  max-height="108"
                  class="btnMenu"
                  @click="!isloading ? checkConditionBeforeLink('family') : ''"
                >
                  <img src="../assets/images/family.svg" class="icon" />
                  <span class="lbMenu text-wrap">{{ lang.family }}</span>
                </v-btn>
              </v-card>
            </v-col>
            <v-col cols="4" class="menu-col">
              <v-card class="home-menu">
                <v-btn
                  max-width="108"
                  max-height="108"
                  class="btnMenu"
                  @click="goNext('/claim-status')"
                >
                  <img src="../assets/images/claim.svg" class="icon" />
                  <span class="lbMenu text-wrap">{{ lang.status }}</span>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="center" class="home-detail">
            <v-col cols="4" class="menu-col">
              <v-card class="home-menu">
                <v-btn
                  max-width="108"
                  max-height="108"
                  class="btnMenu fill-height"
                  @click="goNext('/search-hospital')"
                >
                  <img src="../assets/images/hospital.svg" class="icon" />
                  <span class="lbMenu text-wrap">{{ lang.hospital }}</span>
                </v-btn>
              </v-card>
            </v-col>
            <v-col cols="4" class="menu-col">
              <v-card class="home-menu">
                <v-btn
                  max-width="108"
                  max-height="108"
                  class="btnMenu"
                  href="http://line.me/ti/p/~@tpacare"
                >
                  <img src="../assets/images/lineapp.svg" class="icon" />
                  <span class="lbMenu text-wrap">{{ lang.line }}</span>
                </v-btn>
              </v-card>
            </v-col>
            <v-col cols="4" class="menu-col">
              <v-card class="home-menu">
                <v-btn
                  max-width="108"
                  max-height="108"
                  class="btnMenu"
                  @click="checkConditionBeforeLink('e-claim')"
                >
                  <img src="../assets/images/e-claim.svg" class="icon" />
                  <span class="lbMenu text-wrap">e-Claim</span>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div class="home-article">
          <v-row
            v-if="home.length !== 0"
            justify="center"
            class="home-pro-article"
            dense
          >
            <v-col
              v-if="Object.keys(promotion).length !== 0"
              cols="6"
              class="promo-col"
            >
              <v-card class="home-card">
                <v-btn class="home-promo" @click="goNext('/promotion')">
                  <v-img class="pic" :src="promotion.picture"></v-img>
                  <v-card-title class="promoTitle">
                    <span class="lbpromo" v-text="promotion.title"></span>
                  </v-card-title>
                </v-btn>
              </v-card>
            </v-col>
            <v-col
              v-if="Object.keys(article).length !== 0"
              cols="6"
              class="article-col"
            >
              <v-card class="home-card">
                <v-btn class="home-promo" @click="goNext('/article')">
                  <v-img class="pic" :src="article.picture"></v-img>
                  <v-card-title class="promoTitle">
                    <span class="lbpromo" v-text="article.title"></span>
                  </v-card-title>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row
            v-if="home.length > 1"
            justify="center"
            class="home-pro-article"
            dense
          >
            <v-col
              v-for="(content, index) in home"
              :key="index"
              class="other-col"
            >
              <v-card class="home-card">
                <v-btn class="home-promo" :href="content.link" target="_blank">
                  <v-img class="pic" :src="content.picture"></v-img>
                  <v-card-title class="promoTitle">
                    <span class="lbpromo" v-text="content.title"></span>
                  </v-card-title>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row
            v-if="home.length === 1"
            justify="center"
            class="home-pro-article"
            dense
          >
            <v-col
              v-for="(content, index) in home"
              :key="index"
              class="other-last-col"
              cols="12"
            >
              <v-card class="home-card">
                <v-btn class="home-promo" :href="content.link" target="_blank">
                  <v-img class="pic large-pic" :src="content.picture"></v-img>
                  <v-card-title class="promoTitle">
                    <span class="lbpromo" v-text="content.title"></span>
                  </v-card-title>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row
            v-if="home.length === 0"
            justify="center"
            class="home-pro-article"
            dense
          >
            <v-col
              v-if="Object.keys(promotion).length !== 0"
              cols="12"
              class="full-col"
            >
              <v-card class="home-card">
                <v-btn
                  class="home-promo last-promo"
                  @click="goNext('/promotion')"
                >
                  <v-img class="pic large-pic" :src="promotion.picture"></v-img>
                  <v-card-title class="promoTitle">
                    <span class="lbpromo" v-text="promotion.title"></span>
                  </v-card-title>
                </v-btn>
              </v-card>
            </v-col>
            <v-col
              v-if="Object.keys(article).length !== 0"
              cols="12"
              class="full-col"
            >
              <v-card class="home-card">
                <v-btn class="home-promo" @click="goNext('/article')">
                  <v-img class="pic large-pic" :src="article.picture"></v-img>
                  <v-card-title class="promoTitle">
                    <span class="lbpromo" v-text="article.title"></span>
                  </v-card-title>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
      <Footer :path="path" :backPath="locale === 'th' ? '/' : '/en/'" />
    </v-container>
    <div v-else-if="!isloading && log !== ''">
      {{ log }}
    </div>
  </div>
</template>

<script>
import Dexie from 'dexie'
import { firebase } from '@firebase/app'
import '@firebase/analytics'
import { mapGetters, mapMutations } from 'vuex'
import Footer from '../components/footer'
export default {
  name: 'Index',
  components: {
    Footer,
  },
  data() {
    return {
      baseUrl: '',
      token: '',
      profile: {},
      home: [],
      path: 'home',
      isActivate: false,
      isloading: true,
      lang: this.$t('home'),
      locale: this.$i18n.locale,
      notificationCount: 0,
      promotion: {},
      article: {},
      log: '',
    }
  },
  computed: {
    ...mapGetters({
      lineIsClient: 'getLineIsClient',
    }),
  },
  mounted() {
    const vm = this
    Dexie.delete('s3')
    firebase.analytics().logEvent('home-page')
    vm.$auth.$storage.removeLocalStorage('ViewCardAuthenication')
    vm.$auth.$storage.removeLocalStorage('e-claim')
    vm.$auth.$storage.removeLocalStorage('position')
    vm.$auth.$storage.removeLocalStorage('insurance')
    vm.$auth.$storage.removeLocalStorage('idcard')
    vm.$auth.$storage.removeLocalStorage('claim-status')
    vm.$auth.$storage.removeLocalStorage('currentType')
    vm.resetHospital()
    vm.token = vm.$auth.$storage.getLocalStorage('token')
    if (vm.token !== '' && vm.token !== null && vm.token !== undefined) {
      vm.checkToken()
      vm.$nextTick(() => {
        vm.getNavigator()
      })
    } else {
      vm.$auth.$storage.removeLocalStorage('isActivate')
      vm.$auth.$storage.removeLocalStorage('idcard')
      vm.$auth.$storage.removeLocalStorage('profile')
      vm.$auth.$storage.removeLocalStorage('token')
      vm.$auth.$storage.removeLocalStorage('position')
      vm.$auth.$storage.removeLocalStorage('insurance')
      vm.$auth.$storage.removeLocalStorage('claim-status')
      vm.$auth.$storage.removeLocalStorage('ViewCardAuthenication')
      vm.$auth.$storage.removeLocalStorage('e-claim')
      vm.$auth.$storage.removeLocalStorage('currentType')
      let redirect = this.$auth.$storage.options.redirect
      if (vm.locale === 'th') {
        redirect = {
          login: '/login',
          logout: '/',
          callback: '/login',
          home: '/',
        }
      }
      this.$auth.$storage.options.redirect = redirect
      this.$auth.logout()
    }
  },
  methods: {
    ...mapMutations({
      setPath: 'setPath',
      setActivate: 'setActivate',
      resetHospital: 'resetHospital',
    }),
    ...mapGetters({
      getToken: 'getToken',
    }),
    getNavigator() {
      const vm = this
      if (navigator.geolocation) {
        try {
          vm.$nextTick(() => {
            navigator.geolocation.getCurrentPosition((position) => {
              vm.$nextTick(() => {
                const location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
                vm.$auth.$storage.setLocalStorage('position', location)
              })
            })
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    goBack() {
      const vm = this
      if (vm.locale === 'th') {
        vm.$router.push('/login')
      } else {
        this.$router.push('/en/login')
      }
    },
    async checkToken() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/check-token?lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.getHome()
              vm.$nextTick(() => {
                vm.getProfile()
              })
            } else {
              vm.isloading = false
              vm.$auth.$storage.removeLocalStorage('profile')
              vm.$auth.$storage.removeLocalStorage('token')
              let redirect = this.$auth.$storage.options.redirect
              if (vm.locale === 'th') {
                redirect = {
                  login: '/login',
                  logout: '/',
                  callback: '/login',
                  home: '/',
                }
              }
              this.$auth.$storage.options.redirect = redirect
              this.$auth.logout()
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
        vm.$auth.$storage.removeLocalStorage('profile')
        vm.$auth.$storage.removeLocalStorage('token')
        let redirect = this.$auth.$storage.options.redirect
        if (vm.locale === 'th') {
          redirect = {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/',
          }
        }
        this.$auth.$storage.options.redirect = redirect
        await this.$auth.logout()
      }
    },
    async checkActivate() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios
          .get(`/policy/list/?insured_type=member&lang=${vm.locale}`)
          .then((response) => {
            const res = response.data
            if (res.status === 'ok') {
              vm.isActivate = true
              vm.$auth.$storage.setLocalStorage('isActivate', vm.isActivate)
              vm.isloading = false
            }
          })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.$auth.$storage.setLocalStorage('isActivate', vm.isActivate)
        vm.isloading = false
      }
    },
    async getProfile() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/profile?lang=${vm.locale}`).then((response) => {
          const res = response.data
          vm.profile = res.data
          vm.$auth.$storage.setLocalStorage('profile', vm.profile)
          vm.$nextTick(() => {
            vm.getNotifications()
            vm.checkActivate()
          })
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
        vm.log = e.response.data.message
      }
    },
    async getHome() {
      const vm = this
      try {
        vm.$axios.setHeader('Authorization', 'Bearer ' + vm.token)
        await vm.$axios.get(`/home?lang=${vm.locale}`).then((response) => {
          const res = response.data
          const banner = res.data
          for (let i = 0; i < banner.length; i++) {
            switch (banner[i].type) {
              case 'promotion':
                vm.promotion = banner[i]
                break
              case 'article':
                vm.article = banner[i]
                break
              case 'other':
                vm.home.push(banner[i])
                break
            }
          }
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        vm.isloading = false
      }
    },
    async getNotifications() {
      const vm = this
      const response = await vm.$http.get(
        `https://push-gears-mk2.appspot.com/push_message/?user=tpa_dev_${vm.profile.username}`
      )
      const data = await response.json()
      const notificationList = data.results
      for (let i = 0; i < notificationList.length; i++) {
        if (!notificationList[i].readed) {
          vm.notificationCount = vm.notificationCount + 1
        }
      }
    },
    goNext(path) {
      const vm = this
      firebase.analytics().logEvent(path)
      if (vm.locale === 'th') {
        vm.setPath('/')
        vm.$router.push(path)
      } else if (vm.locale === 'en') {
        vm.setPath('/en')
        vm.$router.push('/en' + path)
      }
    },
    checkConditionBeforeLink(type) {
      const vm = this
      vm.setPath('/')
      firebase.analytics().logEvent(type)
      switch (type) {
        case 'coverage':
          if (vm.isActivate) {
            vm.goNext('/coverages')
          } else {
            vm.goNext('/search-idcard')
          }
          break
        case 'family':
          if (vm.isActivate) {
            vm.goNext('/family-coverages')
          } else {
            vm.goNext('/search-idcard-family')
          }
          break
        case 'e-claim':
          if (vm.isActivate) {
            vm.goNext('/coverages/eclaim')
          } else {
            vm.goNext('/search-idcard')
          }
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) and (max-width: 330px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 86px !important;
            .home-menu {
              .btnMenu {
                padding: 3px !important;
              }
            }
          }
        }
      }
      .home-article {
        .home-pro-article {
          .promo-col {
            max-width: 48% !important;
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 295px !important;
                }
              }
            }
          }
          .article-col {
            max-width: 48% !important;
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 295px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 295px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 330px) and (max-width: 340px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 93px !important;
          }
        }
      }
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 305px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 305px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 305px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 340px) and (max-width: 350px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 96px !important;
          }
        }
      }
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 312px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 312px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 312px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 350px) and (max-width: 360px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 99px !important;
          }
        }
      }
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 325px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 325px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 325px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 360px) and (max-width: 370px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 100px !important;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 370px) and (max-width: 380px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 105px !important;
          }
        }
      }
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 345px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 345px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 345px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 380px) and (max-width: 390px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 350px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 350px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 350px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 390px) and (max-width: 400px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 360px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 360px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 360px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 400px) and (max-width: 410px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 370px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 370px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 370px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 410px) and (max-width: 420px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 380px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 380px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 380px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 420px) and (max-width: 430px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 390px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 390px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 390px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 430px) and (max-width: 440px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 407px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 407px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 407px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 440px) and (max-width: 450px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 410px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 410px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 410px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 450px) and (max-width: 460px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 420px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 420px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 420px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 460px) and (max-width: 470px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 430px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 430px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 430px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 470px) and (max-width: 480px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 440px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 440px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 440px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 480px) and (max-width: 490px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 450px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 450px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 450px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 490px) and (max-width: 500px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 460px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 460px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 460px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 500px) and (max-width: 510px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 470px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 470px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 470px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 510px) and (max-width: 520px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 480px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 480px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 480px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 520px) and (max-width: 530px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 490px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 490px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 490px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 530px) and (max-width: 540px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 500px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 500px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 500px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 540px) and (max-width: 550px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 510px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 510px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 510px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 550px) and (max-width: 560px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 520px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 520px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 520px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 560px) {
  #Home {
    .home-container {
      .home-article {
        .home-pro-article {
          .promo-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 508px !important;
                }
              }
            }
          }
          .article-col {
            .home-card {
              .home-promo {
                .large-pic {
                  max-width: 508px !important;
                }
              }
            }
          }
          .home-card {
            .home-promo {
              .large-pic {
                max-width: 508px !important;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 392px) {
  #Home {
    .home-container {
      .home-menu {
        .home-detail {
          .menu-col {
            max-width: 30% !important;
            margin: 0 auto 18px !important;
          }
        }
      }
    }
  }
}
#Home {
  height: 100%;
  padding: 0;
  position: relative;
  .home-nav {
    width: 100% !important;
    height: 60px !important;
    margin: 0 auto;
    padding: 10px 28px 9px 21px;
    background-color: #3ba9fc;
    position: fixed;
    top: 0;
    z-index: 99;
    .avartar-col {
      width: fit-content;
      max-width: fit-content;
      height: fit-content;
      margin-right: 18px;
    }
    .welcome-col {
      width: fit-content;
      height: fit-content;
      line-height: 18px;
      .lbHeader {
        font-family: 'Anuphan-Regular';
        font-size: 14px;
        color: #fff;
        line-height: 18px;
        margin-bottom: 0;
        display: block;
      }
    }
    .setting-col {
      width: fit-content;
      max-width: fit-content;
      height: 100%;
      .setting-row {
        width: 100%;
        margin: auto;
        line-height: 18px;
        .btnNav {
          position: relative;
          width: fit-content;
          margin: auto 0;
          padding: 0;
          .setting {
            max-height: 25px;
            max-width: 20px;
            margin-right: 25px;
          }
          .setting-notNotification {
            max-height: 25px;
            max-width: 20px;
            margin-right: 18px;
          }
          .notification {
            max-height: 26px;
            max-width: 26px;
            margin-left: auto;
          }
        }
      }
    }
  }
  .home-container {
    width: 100%;
    height: 100%;
    padding: 26px 16px 70px;
    margin: 60px auto 0;
    background-color: #f1f8ff;
    overflow: auto;
    text-align: center;
    .home-menu {
      width: 100%;
      height: 100%;
      margin: 0 auto 12px;
      box-shadow: none;
      .home-detail {
        width: 100%;
        margin: 0 auto;
        .menu-col {
          max-width: 108px;
          margin: 0 5px 18px;
          .home-menu {
            width: 100%;
            margin: 0;
            background-color: #fff;
            border: 1px solid #d4c8c8;
            border-radius: 6px;
            .btnMenu {
              width: 100%;
              height: 108px;
              margin: 0 auto;
              padding: 6px;
              box-shadow: none;
              .icon {
                width: 100%;
                max-height: 45px;
                max-width: 45px;
                margin: 0 auto 12px;
              }
              .lbMenu {
                margin-bottom: 0 !important;
                font-family: 'Anuphan-Medium';
                font-size: 14px;
                color: #4f5358;
                line-height: 16px;
                text-align: center;
                text-transform: none;
                display: block;
              }
            }
          }
        }
        .menu-col:first-child {
          margin: 0 5px 18px 0;
        }
        .menu-col:last-child {
          margin: 0 0 18px 5px;
        }
      }
    }
    .home-article {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      .home-pro-article {
        width: 100%;
        margin: 0 auto 23px;
        .promo-col {
          max-width: 48.5%;
          margin-right: 4px;
          height: 100%;
        }
        .article-col {
          max-width: 48.5%;
          margin-left: 5px;
          height: 100%;
        }
        .other-col {
          max-width: 48.5%;
          height: 100%;
        }
        .full-col {
          margin-bottom: 23px;
        }
        .other-col:first-child {
          margin-right: 4px;
        }
        .other-col:last-child {
          margin-left: 5px;
        }
        .other-last-col {
          margin: 0;
        }
        .home-card {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          background-color: transparent;
          box-shadow: none;
          border: none;
          .home-promo {
            width: 100%;
            height: 100%;
            margin: 0 auto;
            position: relative;
            .pic {
              width: 145px;
              height: 100%;
              border-radius: 6px;
              position: relative;
              max-width: 300px;
              max-height: 145px;
              min-height: 145px;
            }
            .large-pic {
              width: 100%;
              max-width: 340px;
            }
            .promoTitle {
              width: 100%;
              height: auto;
              padding: 8px 10px;
              position: absolute;
              bottom: 0;
              background-color: #3ba9fe80;
              border-bottom-left-radius: 6px;
              border-bottom-right-radius: 6px;
              background-color: #3ba9fe80;
              margin-bottom: 0 !important;
              .lbpromo {
                font-family: 'Anuphan-Medium';
                font-size: 16px;
                color: #fffbfb;
                line-height: 24px;
                text-align: left;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                text-transform: none;
              }
            }
          }
        }
        .promoArticle {
          display: inline-flex;
          width: 100%;
          max-width: 167px;
          margin-right: 9px;
          .home-promo {
            min-height: 145px;
            width: 100%;
            margin: 0 auto;
            position: relative;
            .pic {
              width: 100%;
              height: 100%;
              border-radius: 6px;
              position: relative;
              max-width: 185px;
              max-height: 105px;
              min-height: 105px;
            }
            .txt-promo {
              width: 100%;
              padding: 8px 12px;
              position: absolute;
              bottom: 0;
              background-color: #3ba9fe80;
              border-bottom-left-radius: 6px;
              border-bottom-right-radius: 6px;
              .lbpromo {
                margin-bottom: 0 !important;
                font-family: 'Anuphan-Medium';
                font-size: 16px;
                color: #fffbfb;
                line-height: 23px;
                text-align: left;
                text-transform: none;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
            }
          }
        }
        .promoArticle:nth-child(even) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
<style>
@import url('../assets/css/index.css');
</style>
