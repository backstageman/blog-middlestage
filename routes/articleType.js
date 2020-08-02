var express = require('express');
var router = express.Router();
const Result = require('../model/Result')
const { decoded } = require('../utils/encrypt')
const { findAllArticleTypes } = require('../services/articleType')

// 获取所有的文章类型数据
router.get('/article-type', function (req, res, next) {
  findAllArticleTypes().then(results => {
    if (!results || results.length === 0) {
      new Result('查询用户文章类别失败').fail(res)
    } else {
      // console.log(results, 'data');
      new Result(results, '查询用户文章类别成功').success(res)
    }
  })
})

module.exports = router;
