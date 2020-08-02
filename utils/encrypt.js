const CryptoJS = require("crypto-js")
const { SECRETKEY, SECRET_KEY_jwt } = require('./constant')
const jwt = require('jsonwebtoken')

// 加密
function encrypt(message) {
  return CryptoJS.MD5(`${message}${SECRETKEY}`).toString()
}

// 获取token,解析用户信息
function decoded(req) {
  let token = req.get('Authorization')
  // console.log(token)
  if (token.indexOf('Bearer') === 0) {
    token = token.replace('Bearer ', '')
  }
  return jwt.verify(token, SECRET_KEY_jwt)
}

module.exports = {
  encrypt,
  decoded
}
