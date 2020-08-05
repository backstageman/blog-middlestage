// 上传路径
const UPLOAD_PATH = process.env.NODE_ENV === 'dev' ? 'D:/upload/img' : '/root/nginx/upload/img'
// 上传之后的资源地址(可以通过这个地址访问到资源)
const UPLOAD_URL = process.env.NODE_ENV === 'dev' ? 'http://localhost:8089/img' : 'http://www.masksuperman.top/img'
// 线上环境待定
let dbConfig = {}
if (process.env.NODE_ENV === 'dev') {
  dbConfig.host = '你猜啊'
  dbConfig.user = '你猜啊'
  dbConfig.password = '你猜啊'
  dbConfig.database = '你猜啊'
} else if (process.env.NODE_ENV === 'production') {
  dbConfig.host = '你猜啊'
  dbConfig.user = '你猜啊'
  dbConfig.password = '你猜啊'
  dbConfig.database = '你猜啊'
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