var express = require('express');
var router = express.Router();

/* 二级路由 */
let user = require('./relation/user.js');
let upload = require('./relation/upload.js');
let task_center = require('./relation/task_center.js');
let news = require('./relation/news.js');

/* 配置二级路由 */
router.use('/user', user);
router.use('/upload', upload);
router.use('/task_center', task_center);
router.use('/news', news);

module.exports = router;
