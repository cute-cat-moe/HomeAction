var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var multer = require('multer'); // 处理图片

var db = require('./public/database/db');
var generalRouter = require('./routes/general');
var adminRouter = require('./routes/admin');
var volunteerRouter = require('./routes/volunteer');
var relationRouter = require('./routes/relation');

var app = express();

app.use(cors());  // 不加上这句代码跨域访问时会出现错误，加上就不会出现跨域错误情况

var tokenjs = require('./public/javascripts/token.js');
var expressJwt = require('express-jwt');

// 建立数据库和数据表
db.sequelize.sync({force: false}).then(function() {
  console.log("数据库建立成功");
}).catch(function(err){
  console.log("数据库建立失败: %s", err);
});

// // 解析token获取用户信息
// app.use(function(req, res, next) {
//   var token = req.headers['authorization'];
//   if(token === undefined){
//     console.log('token-111')
//     return next();
//   }else{
//     console.log('token-222')
//     console.log(token)
//     tokenjs.verifyToken(token).then((data)=> {
//       console.log('token-333')
//       req.data = data;
//       return next();
//     }).catch((error)=>{
//       console.log('验证失败')
//       return next();
//     })
//   }
// });
//
// // 验证token是否过期并规定哪些路由不用验证
// app.use(expressJwt({
//   secret: 'mes_qdhd_mobile_xhykjyxgs', // 密匙
//   algorithms:['HS256']
// }).unless({
//   path: [
//     '/admin/user/login',
//     '/relation/user/login',
//     '/relation/upload/test',
//     '/volunteer/user/login',
//     '/general/get_photo',
//     '/general/get_404',
//     /^\/general\/get_photo.*/,
//     /^\/images\/old_photos\/.*/
//   ]//除了这些地址，其他的URL都需要验证
// }));

//将表单接收到的图片先暂存在指定目录下，然后在usersRouter对文件名进行修改
// app.use(multer({dest: 'public/images/'}).array('photo'));
app.use(multer({dest: 'public/images/'}).fields([{ name: 'photo' }, { name: 'additionalPhoto' }]));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/general', generalRouter);
app.use('/admin', adminRouter);
app.use('/volunteer', volunteerRouter);
app.use('/relation', relationRouter);

// //当token失效返回提示信息
// app.use(function(err, req, res, next) {
//   if (err.status === 401) {
//     res.status(401);
//     let info = {
//       data: null,
//       meta: {
//         success: false,
//         status: 401
//       }
//     }
//     res.json(info);
//   }
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
