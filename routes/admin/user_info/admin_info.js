var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs") // 加密工具
const User_administrators = require("../../../public/models/user_administrators");

/* 2.4.1. 获取管理员信息 */
router.get('/', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 查询数据库
    User_administrators.findAll().then(administrators => {
        info.data = []
        for(let i = 0; i < administrators.length; i++) {
            let temp = {
                aid: administrators[i].aid,
                name: administrators[i].name,
                sex: administrators[i].sex,
                phone: administrators[i].phone,
                state: administrators[i].state,
                limits: administrators[i].limits,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.4.2. 获取管理员详细信息 */
router.get('/:aid', function(req, res, next) {
    let aid = req.params.aid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 查询数据库
    User_administrators.findOne({
        where: {
            aid: aid
        }
    }).then(administrator => {
        if (administrator) { // 用户存在
            info.data = {
                name: administrator.name,
                sex: administrator.sex,
                phone: administrator.phone,
                idcard: administrator.idcard === null ? '无' : administrator.idcard,
                state: administrator.state,
                limits: administrator.limits,
            }
            info.meta.status = 200
            info.meta.success = true
            res.status(200).json(info)
        } else { // 该用户不存在
            info.meta.status = 400
            res.status(400).json(info)
        }
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.4.3. 修改管理员信息 */
router.put("/update", async (req, res) => {
    const aid = req.body.aid
    let userData = {
        name: req.body.name,
        sex: req.body.sex,
        phone: req.body.phone,
        idcard: req.body.idcard,
        state: req.body.state,
        limits: req.body.limits
    }
    let password = userData.idcard
    if(password.length >= 6)
        password = password.substr(-6)
    // 对新密码进行加密
    userData["password"] = await bcrypt.hash(password, 10)
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 首先查询是否存在该用户
    User_administrators.findOne({
        where:{
            aid: aid
        }
    }).then(administrator => {
        if (administrator) { // 该用户存在
            // 更新数据库中的数据
            User_administrators.update(userData, {
                where:{
                    aid:aid
                }
            }).then(user2 => {
                info.meta.success = true
                info.meta.status = 200
                res.json(info)
            }).catch( err => res.status(500).json(info))
        } else { // 该用户不存在
            info.meta.status = 400
            res.status(400).json(info)
        }
    }).catch( err => {console.log(err); res.status(500).json(info)})
    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
})

/* 2.4.4. 添加管理员信息 */
router.post('/add', async (req, res) => {
    let userData = req.body
    for(let i = 0; i < userData.length; i++) {
        let password = userData[i].idcard
        if(password.length >= 6)
            password = password.substr(-6)
        // 对新密码进行加密
        userData[i]["password"] = await bcrypt.hash(password, 10)
    }
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 插入数据
    User_administrators.bulkCreate(userData).then(() => {
        info.meta.success = true
        info.meta.status = 200
        res.json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
});


module.exports = router;