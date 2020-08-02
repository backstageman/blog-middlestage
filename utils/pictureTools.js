const { MIME_TYPE } = require('./constant')
function getSuffix(file) {
  let suffix = ''
  if (!file) return suffix
  for (let i = 0; i < MIME_TYPE.length; i++) {
    if (file.mimetype === MIME_TYPE[i]) {
      suffix = MIME_TYPE[i].split('/')[1]
      break;
    }
  }
  return `.${suffix}`
}

module.exports = {
  getSuffix
}