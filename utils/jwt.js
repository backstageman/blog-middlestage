const jwt = require('express-jwt');
const { SECRET_KEY_jwt } = require('./constant')

const jwtAuth = jwt({
  secret: SECRET_KEY_jwt,
  credentialsRequired: true
}).unless({
  path: [
    '/',
    '/user/login'
  ]
})

module.exports = jwtAuth