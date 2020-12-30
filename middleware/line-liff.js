export default function ({ store, route, redirect }) {
  if (route.path === '/not-found') return
  if (store.getters.getLineIsReady && !store.getters.getLineIsClient) {
    redirect('/not-found')
  }
}
