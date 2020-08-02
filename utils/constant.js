const UPLOAD_PATH = process.env.NODE_ENV === 'dev' ? 'D:/upload/img' : '/root/nginx/upload/img'
const UPLOAD_URL = process.env.NODE_ENV === 'dev' ? 'http://localhost:8089/img' : 'http://masksuperman.top/img'
// 线上环境待定
let dbConfig = {}
if (process.env.NODE_ENV === 'dev') {
  dbConfig.host = 'localhost'
  dbConfig.user = 'root'
  dbConfig.password = 'root'
  dbConfig.database = 'blog_react'
} else if (process.env.NODE_ENV === 'production') {
  dbConfig.host = '35.241.80.249'
  dbConfig.user = 'root'
  dbConfig.password = 'HZm9HQqQ%Wz3BJCe'
  dbConfig.database = 'blog_react'
}

module.exports = {
  SUCCESS_CODE: 0,
  ERROR_CODE: -1,
  JWT_ERROR_CODE: -2,
  debug: true,
  SECRETKEY: '^&^LXYG5qf,QSGCT1s`!`',
  SECRET_KEY_jwt: '^&^LXYG5qf,QSGCT1s`!`',
  JWT_EXPIRED: 60 * 60 * 24, //jwt过期时间，以秒为单位,
  UPLOAD_PATH,
  UPLOAD_URL,
  MIME_TYPE: ['image/png', 'image/jpeg', 'image/gif'],
  dbConfig
}