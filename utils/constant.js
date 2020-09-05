// 上传路径
const UPLOAD_PATH = process.env.NODE_ENV === 'dev' ? 'D:/upload/img' : '/root/nginx/upload/img'
// 上传之后的资源地址(可以通过这个地址访问到资源)
const UPLOAD_URL = process.env.NODE_ENV === 'dev' ? 'http://localhost:8089/img' : 'http://www.masksuperman.top/img'
// 调试命令是否打开
const debug = process.env.NODE_ENV === 'dev' ? true : false;

// 线上数据库环境配置信息
let dbConfig = {}

if (process.env.NODE_ENV === 'dev') {
  //本地环境
  dbConfig.host = '恭喜发财'
  dbConfig.user = '恭喜发财'
  dbConfig.password = '恭喜发财'
  dbConfig.database = '恭喜发财'

} else if (process.env.NODE_ENV === 'production') {
  //线上环境
  dbConfig.host = '恭喜发财'
  dbConfig.user = '恭喜发财'
  dbConfig.password = '恭喜发财'
  dbConfig.database = '恭喜发财'
}

module.exports = {
  SUCCESS_CODE: 0,
  ERROR_CODE: -1,
  JWT_ERROR_CODE: -2,
  debug,
  SECRETKEY: '^&^LXYG5qf,QSGCT1s`!`',
  SECRET_KEY_jwt: '^&^LXYG5qf,QSGCT1s`!`',
  JWT_EXPIRED: 60 * 60 * 24, //jwt过期时间，以秒为单位,
  UPLOAD_PATH,
  UPLOAD_URL,
  MIME_TYPE: ['image/png', 'image/jpeg', 'image/gif'],
  dbConfig
}