var express = require('express');
var router = express.Router();
const User_relations = require("../../public/models/user_relations");
const Tasks = require("../../public/models/tasks");
const bcrypt = require("bcryptjs") // 加密工具
const settoken = require('../../public/javascripts/token'); // token工具
var path = require("path")
var fs = require('fs')

/* 2.1.1. 家属登录获取token接口 */
router.post('/login', function(req, res, next) {
    const userData = {
        rid: req.body.rid,
        phone: req.body.phone,
        password: req.body.password
    }
    console.log(userData)
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 在数据库中查询
    User_relations.findOne({
        where:{
            phone:req.body.phone
        }
    }).then(user => {
        if (user) { // 查询到该用户
            // 判断密码是否匹配
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // if (req.body.password === user.password) {
                // 生成token
                let cont = {
                    rid:user.rid,
                    phone: user.phone,
                } // token所包含的信息
                settoken.createToken(cont).then(token_data => {
                    info.data = {
                        rid:user.rid,
                        phone: user.phone,
                        token: token_data,
                        missionID: 0
                    }
                    Tasks.findOne({
                        where: {
                            rid: user.rid
                        }
                    }).then(task => {
                        if (task) { // 该用户当前有任务
                            info.data.missionID = task.tid
                        }
                        info.meta.success = true
                        info.meta.status = 200
                        res.status(200).json(info)
                    }).catch( err => {console.log(err); res.status(500).json(info)})
                }).catch( err => {console.log(err); res.status(500).json(info)})
            } else {  // 密码错误
                info.meta.status = 400
                res.status(400).json(info)
            }
        } else { // 该用户不存在，创建新用户
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                // hash加密之后的内容
                userData.password = hash
                // 更新数据库中的数据
                User_relations.create(userData).then( user => {
                    let cont = {
                        rid: user.rid,
                        phone: user.phone,
                    } // token所包含的信息
                    settoken.createToken(cont).then(token_data => {
                        info.data = {
                            rid:user.rid,
                            phone: user.phone,
                            token: token_data,
                            missionID: 0
                        }
                        info.meta.success = true
                        info.meta.status = 200
                        res.status(200).json(info)
                    }).catch( err => {console.log(err); res.status(500).json(info)})
                }).catch( err => {console.log(err); res.status(500).json(info)})
            })
        }
    }).catch( err => {console.log(err); res.status(500).json(info)})

    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
});

/* 2.1.2. 管理个人信息 */
router.put("/manage_info", function (req, res, next) {
    const aid = req.body.aid
    const userData = {
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password
    }
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
            phone: req.body.phone
        }
    }).then(user => {
        if (user) { // 该用户存在
            // 对新密码进行加密
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                // hash加密之后的内容
                userData.password = hash
                // 更新数据库中的数据
                User_administrators.update(userData, {
                    where:{
                        aid:aid
                    }
                }).then(user2 => {
                    info.meta.success = true
                    info.meta.status = 200
                    res.json(info)
                }).catch( err => {console.log(err); res.status(500).json(info)})
            }).catch( err => {console.log(err); res.status(500).json(info)})
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


module.exports = router;