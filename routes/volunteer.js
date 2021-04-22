var express = require('express');
var router = express.Router();

/* 二级路由 */
let user = require('./volunteer/user');
let news = require('./volunteer/news');
let task_center = require('./volunteer/task_center.js');
let task_now = require('./volunteer/task_now.js');
let calling = require('./volunteer/calling.js');

/* 配置二级路由 */
router.use('/user', user);
router.use('/news', news);
router.use('/task_center', task_center);
router.use('/task_now', task_now);
router.use('/calling', calling);

module.exports = router;
