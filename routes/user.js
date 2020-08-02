var express = require('express');
var router = express.Router();
const Result = require('../model/Result')
const { login, findUser } = require('../services/user')
const { encrypt, decoded } = require('../utils/encrypt')
const { body, validationResult } = require('express-validator');
const boom = require('@hapi/boom')
var jwt = require('jsonwebtoken');
const { SECRET_KEY_jwt, JWT_EXPIRED } = require('../utils/constant')


router.post('/login', [
  body('username').isLength({ min: 5, max: 25 }).withMessage('用户名长度不能小于5位'),
  body('password').isLength({ min: 5, max: 25 }).withMessage('密码长度不能小于5位')
], function (req, res, next) {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  } else {
    let { username, password } = req.body
    // 对密码进行加密
    password = encrypt(password)
    // console.log('加密后的密码：',password)
    login(username, password).then(results => {
      if (!results || results.length === 0) {
        return new Result('登录失败，用户不存在！').fail(res)
      } else {
        if (username === results[0].username && password === results[0].password) {
          const token = jwt.sign(
            { username },
            SECRET_KEY_jwt,
            { expiresIn: JWT_EXPIRED }
          )
          new Result({ token }, '登录成功').success(res)
        } else {
          new Result('登录失败，用户名或密码错误！').fail(res)
        }
      }
    })
    /*  .catch(err => {
       console.log(err)
     }) */
  }
})

router.get('/', function (req, res, next) {
  res.send('角色管理api');
});

router.get('/info', function (req, res, next) {
  const decode = decoded(req)
  if (decode && decode.username) {
    findUser(decode.username).then(user => {
      if (!user) {
        new Result('用户信息查询失败').fail(res)
      } else {
        // console.log(user);
        new Result(user, '用户信息查询成功').success(res)
      }
    })
  } else {
    new Result('用户信息查询失败').fail(res)
  }

});
module.exports = router;
