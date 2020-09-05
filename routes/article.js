var express = require('express');
var router = express.Router();
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../model/Result')
const Image = require('../model/Image');
const imageService = require('../services/imageService');
const { decoded } = require('../utils/encrypt')
const boom = require('@hapi/boom');
const Article = require('../model/Article');
const articleService = require('../services/article')
const { findUser } = require('../services/user');
const article = require('../services/article');
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart({ dest: `${UPLOAD_PATH}` });

/* 文件上传路由 */
router.post('/upload',
  // multipartMiddleware,
  // multer({ dest: `${UPLOAD_PATH}` }).single('photos'),
  multer({ dest: `${UPLOAD_PATH}` }).array('photos', 9),
  function (req, res, next) {
    // console.log('files', req.files);
    // console.log(UPLOAD_PATH);
    // console.log(req.body.isCover);
    if (!req.files || req.files.length === 0) {
      new Result('上传图片失败').fail(res)
    } else {
      // 获取用户的登录信息
      const decode = decoded(req)
      // console.log('decode', decode);
      // 把用户信息添加到file对象中
      req.files[0].createUser = decode.username
      // 把封面标识添加到file对象中
      req.files[0].isCover = req.body.isCover || true
      // console.log('file', req.files[0]);
      const image = new Image(req.files[0])
      // console.log('image', image);
      imageService.insertImage(image).then(() => {
        new Result(image, '上传图片成功').success(res)
      }).catch(err => {
        next(boom.badImplementation(err))
      })
    }
  });

// 添加文章
router.post('/article', (req, res, next) => {
  // 获取用户信息
  const decode = decoded(req)
  if (decode && decode.username) {
    // 把用户名添加到用户提交的对象中
    // console.log(req.body);
    req.body.username = decode.username
  }
  // console.log('req', req.body);
  // 创建文章对象
  const article = new Article(req.body)
  // const article = {}
  // console.log('article', article);
  // 存储到数据库中
  articleService.insertArticle(article).then(() => {
    new Result('文章添加成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err))
  })
})

//获取文章数据
router.get('/article', (req, res, next) => {
  // console.log('query', req.query);
  if (!req.query.id) {
    // 获取文章列表
    articleService.getArticleList(req.query).then(({ list, total, current, pageSize }) => {
      new Result({ list, total, current, pageSize }, '获取文章数据成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  } else {
    // 获取请求参数id
    const id = req.query.id
    // 获取用户信息
    const decode = decoded(req)
    // 查询单个文章
    articleService.findArticleById(id).then(article => {
      // console.log(article);
      if (article.createUser !== decode.username) {
        new Result('抱歉，只支持修改自己的文章').fail(res)
      } else {
        new Result(article, '查询成功').success(res)
      }
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }

})

// 删除文章
router.delete('/article/:id', async (req, res, next) => {
  if (!req.params.id) {
    next(boom.badRequest(new Error('参数不能为空')))
  } else {
    // console.log(req.params.id);
    // 获取文章id
    const id = req.params.id
    // 获取用户信息
    const decode = decoded(req)
    // console.log(decode);
    findUser(decode.username).then(result => {
      if (!result.username) {
        new Result('删除失败，用户没有操作权限').fail(res)
      }
      // console.log(result);
      articleService.deleteArticle(id, result).then(delObj => {
        // console.log(delObj);
        new Result('删除成功').success(res)
      })
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
})

// 更新文章
router.put('/article', async (req, res, next) => {
  // 获取用户信息
  const decode = decoded(req)
  // console.log('req', req.query);
  if (!req.query.id) {
    next(boom.badRequest(new Error('参数错误！')))
    // new Result('很抱歉，没有查询到对应文章！').fail(res)
  } else {
    // 获取文章id
    const id = req.query.id
    let oldArticle = null
    // 查询文章
    oldArticle = await articleService.findArticleById(id)
    // if (oldArticle.createUser !== decode.username) {
    //   new Result('抱歉，只支持修改自己的文章').fail(res)
    // } else {
    // 修改文章
    let newArticle = Article.updateArticle(req.body, oldArticle)
    // new Result('文章修改成功！').success(res)
    // }
    // console.log('oldArticle',oldArticle);
    // console.log('newArticle',newArticle);
    articleService.updateArticle(newArticle).then(() => {
      new Result('文章修改成功！').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
})

module.exports = router;
