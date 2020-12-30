import pushGears from '../plugins/pushgears-axios'

const notificationService = {
  getNotifications(username) {
    return pushGears.get(`push_message/?user=tpa_dev_${username}`)
  },
}

export default notificationService
