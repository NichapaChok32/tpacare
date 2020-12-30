/* eslint-disable prettier/prettier */
const dev = require('./dev')
const prod = require('./prod')

const env = process.env.NODE_ENV

function baseUrl() {
  switch(env) {
    case 'development':
      return dev.base_url
    case 'production':
      return prod.base_url
    default:
      return dev.base_url
  }
}

export default baseUrl()
