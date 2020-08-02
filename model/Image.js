const { getSuffix } = require('../utils/pictureTools')
const { UPLOAD_URL } = require('../utils/constant')
const fs = require('fs')

class Image {
  constructor(file, data) {
    if (file) {
      this.createImageFromFile(file)
    } else {
      this.createImageFromData(data)
    }
  }

  // 通过文件上传创建图片对象
  createImageFromFile(file) {
    // console.log('createImageFromFile', file);
    const {
      destination,
      filename,
      mimetype,
      path,
      originalname,
      isCover,
      createUser
    } = file
    //获取文件后缀名
    const suffix = getSuffix(file)
    //path 是原有的文件路径，不包含后缀
    const oldImagePath = path
    //图片文件的真实路径，带后缀的
    const imagePath = `${destination}/${filename}${suffix}`
    //图片文件下载路径
    const url = `${UPLOAD_URL}/${filename}${suffix}`
    // 对文件重命名
    fs.renameSync(oldImagePath, imagePath)
    this.fileName = filename //文件名
    // this.path = `${filename}${suffix}` //文件相对路径
    // this.filePath = this.path //文件真实路径
    this.url = url //图片文件下载路径
    this.isCover = isCover // 是否是封面图 
    this.originalName = originalname //文件原名
    this.id = filename  //插入数据库的id
    this.mimeType = mimetype //文件类型
    this.fullName = `${filename}${suffix}` //文件名,也是文件的相对路径(包含后缀)
    this.createUser = createUser // 文件创建者
    this.createDt = Date.now() //文件的创建时间
    this.updateDt = Date.now() // 文件的创建时间
  }

  // 通过数据修改表单创建图片对象
  createImageFromData(data) {

  }


}

module.exports = Image