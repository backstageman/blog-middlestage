const Image = require('../model/Image')
const db = require('../db')

function insertImage(image) {
  return new Promise(async (resolve, reject) => {
    try {
      if (image instanceof Image) {
        await db.insert(image,'image')
        resolve()
      } else {
        reject(new Error('添加的图片不合法'))
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  insertImage
}