var express = require('express');
var router = express.Router();
const User_administrators = require("../../public/models/user_administrators");
const bcrypt = require("bcryptjs") // 加密工具
const settoken = require('../../public/javascripts/token'); // token工具

/* 2.1.1. 管理员登录接口 */
router.post('/login', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 在数据库中查询
    User_administrators.findOne({
        where:{
            phone:req.body.phone
        }
    }).then(user => {
        if (user) { // 查询到该用户
            // 判断密码是否匹配
            if (bcrypt.compareSync(req.body.password, user.password)) {
            // if (req.body.password === user.password) {
                // res.send("登录成功")
                User_administrators.update({
                    state: true
                }, {
                    where:{
                        aid:user.aid
                    }
                }).then(user2 => {
                    // 生成token
                    let cont = {
                        aid: user.aid,
                        name: user.name,
                        sex: user.sex,
                        phone: user.phone,
                        state: true,
                        limits: user.limits
                    } // token所包含的信息
                    settoken.createToken(cont).then(token_data => {
                        info.data = {
                            aid: user.aid,
                            name: user.name,
                            sex: user.sex,
                            phone: user.phone,
                            state: true,
                            limits: user.limits,
                            token: token_data
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
        } else { // 该用户不存在，手机号错误
            info.meta.status = 400
            res.status(400).json(info)
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