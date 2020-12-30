/* eslint-disable prettier/prettier */
const baseUrl = require('../middleware/env/index')

export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    headers: {
      common: {
        'Content-Type': 'application/json',
        'x-api-key': 'ykRNP0wziQLCoC64NLpl',
      },
    },
  })

  // Set baseURL to something different
  api.setBaseURL(baseUrl)

  // Inject to context as $api
  inject('api', api)
}
