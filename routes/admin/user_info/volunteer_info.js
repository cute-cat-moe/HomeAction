var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs") // 加密工具
const User_volunteers = require("../../../public/models/user_volunteers");

/* 2.4.5. 获取志愿者信息 */
router.get('/', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 查询数据库
    User_volunteers.findAll().then(volunteers => {
        info.data = []
        for(let i = 0; i < volunteers.length; i++) {
            let temp = {
                vid: volunteers[i].vid,
                name: volunteers[i].name,
                sex: volunteers[i].sex,
                phone: volunteers[i].phone,
                state: volunteers[i].state,
                identity: volunteers[i].identity,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.4.6. 获取志愿者详细信息 */
router.get('/:vid', function(req, res, next) {
    let vid = req.params.vid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 查询数据库
    User_volunteers.findOne({
        where: {
            vid: vid
        }
    }).then(volunteer => {
        if (volunteer) { // 用户存在
            info.data = {
                name: volunteer.name,
                sex: volunteer.sex,
                age: volunteer.age,
                identity: volunteer.identity,
                state: volunteer.state,
                phone: volunteer.phone,
                idcard: volunteer.idcard === null ? '无' : volunteer.idcard,
                position: volunteer.position_lng === null ? [] : [volunteer.position_lng, volunteer.position_lat]
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

/* 2.4.7. 修改志愿者信息 */
router.put("/update", async (req, res) => {
    const vid = req.body.vid
    let userData = {
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        identity: req.body.identity,
        state: req.body.state,
        phone: req.body.phone,
        idcard: req.body.idcard
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
    User_volunteers.findOne({
        where:{
            vid: vid
        }
    }).then(volunteer => {
        if (volunteer) { // 该用户存在
            // 更新数据库中的数据
            User_volunteers.update(userData, {
                where:{
                    vid:vid
                }
            }).then(user2 => {
                info.meta.success = true
                info.meta.status = 200
                res.json(info)
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

/* 2.4.8. 添加志愿者信息 */
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
    User_volunteers.bulkCreate(userData).then(() => {
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