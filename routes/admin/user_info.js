var express = require('express');
var router = express.Router();

/* 三级路由 */
let admin_info = require('./user_info/admin_info');
let volunteer_info = require('./user_info/volunteer_info');
let relation_info = require('./user_info/relation_info');

/* 配置二级路由 */
router.use('/admin', admin_info);
router.use('/volunteer', volunteer_info);
router.use('/relation', relation_info);

module.exports = router;