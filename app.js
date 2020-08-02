var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const boom = require('@hapi/boom')
var cors = require('cors')
const { ERROR_CODE } = require('./utils/constant.js')
const jwtAuth = require('./utils/jwt')
const Result = require('./model/Result')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const articleRouter = require('./routes/article');
const articleTypeRouter = require('./routes/articleType')

var app = express();
app.use(cors())

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
// 解析请求参数
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// 开启jwt认证
app.use(jwtAuth)
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/public',articleRouter)
app.use(articleRouter)
app.use(articleTypeRouter)

/* 
  集中处理404请求的中间件
*/
app.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})

/* 
  自定义异常处理中间件
*/
app.use((err, req, res, next) => {
  // console.log(err)
  // 没有验证token的情况
  if (err.name && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err
    new Result(null, 'Token验证失败', {
      error: status,
      errorMsg: message
    }).jwtError(res.status(status))
  } else {
    const msg = (err && err.message) || '服务端出错'
    const statusCode = (err.output && err.output.statusCode) || 500;
    const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode))
    // res.status(statusCode).json({
    //   statusCode: ERROR_CODE,
    //   msg,
    //   error: statusCode,
    //   errorMsg
    // })
  }
})

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app
