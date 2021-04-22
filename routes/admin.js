var express = require('express');
var router = express.Router();

/* 二级路由 */
let user = require('./admin/user.js');
let task_center = require('./admin/task_center.js');
let data_show = require('./admin/data_show.js');
let user_info = require('./admin/user_info.js');

/* 配置二级路由 */
router.use('/user', user);
router.use('/task_center', task_center);
router.use('/data_show', data_show);
router.use('/user_info', user_info);

module.exports = router;
