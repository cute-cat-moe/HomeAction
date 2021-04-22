var express = require('express');
var router = express.Router();
const User_volunteers = require("../../public/models/user_volunteers");
const Tasks = require("../../public/models/tasks");
const Task_volunteers = require("../../public/models/task_volunteers");
const User_olds = require("../../public/models/user_olds");
const bcrypt = require("bcryptjs") // 加密工具
const settoken = require('../../public/javascripts/token'); // token工具
var path = require("path")
var fs = require('fs')

/* 3.1.1. 志愿者登录接口 */
router.post('/login', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 在数据库中查询
    User_volunteers.findOne({
        where:{
            phone:req.body.phone
        }
    }).then(user => {
        if (user) { // 查询到该用户
            // 判断密码是否匹配
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // 生成token
                let cont = {
                    vid: user.vid,
                    state: user.state
                } // token所包含的信息
                settoken.createToken(cont).then(token_data => {
                    info.data = {
                        aid: user.aid,
                        state: user.state,
                        token: token_data
                    }
                    info.meta.success = true
                    info.meta.status = 200
                    res.status(200).json(info)
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

/* 3.1.2. 志愿者获取个人信息 */
router.post('/info/:vid', function(req, res, next) {
    let vid = req.params.vid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 在数据库中查询
    User_volunteers.findOne({
        where:{
            vid: vid
        }
    }).then(user => {
        info.data = {
            vid: user.vid,
            name: user.name,
            v_time: user.v_time,
            task_num: user.task_num,
            state: user.state,
            identity: user.identity,
            photo: user.photo
        }
        info.meta.success = true
        info.meta.status = 200
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})

    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
});

/* 3.1.3. 管理志愿者个人信息 */
router.put("/manage_info", function (req, res, next) {
    const vid = req.body.vid
    const userData = {
        name: req.body.name,
        password: req.body.password,
        idcard: req.body.idcard,
        phone: req.body.phone
    }
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 对新密码进行加密
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        // hash加密之后的内容
        userData.password = hash
        // 更新数据库中的数据
        User_volunteers.update(userData, {
            where:{
                vid: vid
            }
        }).then(user2 => {
            info.meta.success = true
            info.meta.status = 200
            res.json(info)
        }).catch( err => {console.log(err); res.status(500).json(info)})
    }).catch( err => {console.log(err); res.status(500).json(info)})
    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
})

/* 3.1.4. 修改志愿者状态 */
router.put("/state", function (req, res, next) {
    const vid = req.body.vid
    const userData = {
        state: req.body.state
    }
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    User_volunteers.update(userData, {
        where:{
            vid: vid
        }
    }).then(user2 => {
        info.data = {
            state: userData.state
        }
        info.meta.success = true
        info.meta.status = 200
        res.json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
})

/* 3.1.5. 设置志愿者头像 */
router.put("/set_portrait/:vid", function (req, res, next) {
    const vid = req.params.vid
    let files = req.files
    let nameArray = files[0].originalname.split('.')
    // 长度是从1开始的 索引是从0开始的。[1,2,3,4]长度4 -1 [nameArray.length - 1]索引
    let type = nameArray[nameArray.length - 1]
    let oldName = files[0].destination + files[0].filename;
    let newName = './public/images/portraits/volunteer/v_' + vid + "." + type;

    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }

    fs.rename(oldName, newName, function (err) {
        if (err) {
            throw err;
        }
        else { // 成功保存图片
            const userData = {
                photo: '/volunteer/v_' + vid + "." + type
            }
            User_volunteers.update(userData, {
                where:{
                    vid: vid
                }
            }).then(user => {
                info.meta.success = true
                info.meta.status = 200
                res.json(info)
            }).catch( err => {console.log(err); res.status(500).json(info)})
        }
    });

    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
})

/* 3.1.6. 获取志愿者参与的任务列表 */
router.get('/task_list/:vid', function(req, res, next) {
    let vid = req.params.vid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 关联任务表
    Task_volunteers.belongsTo(Tasks, {
        foreignKey: "tid",
        targetKey:'tid'
    })
    // 在数据库中查询
    Task_volunteers.findAll({
        include: [{
            model:Tasks
        }],
        where:{
            vid: vid
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].task.tid,
                t_level: tasks[i].task.t_level,
                start_time: tasks[i].task.start_time,
                end_time: tasks[i].task.end_time,
                task_area: tasks[i].task.lost_area
            }
            info.data.push(temp)
        }
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