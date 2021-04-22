var express = require('express');
var router = express.Router();
const User_volunteers = require("../../public/models/user_volunteers");
const Tasks = require("../../public/models/tasks");
const Task_volunteers = require("../../public/models/task_volunteers");
const User_olds = require("../../public/models/user_olds");

/* 3.2.1. 获取注册志愿者数和救援任务数 */
router.get('/get_num', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    User_volunteers.count().then(v_num => {
        Tasks.count().then(t_num => {
            info.data = {
                v_num: v_num,
                t_num: t_num
            }
            info.meta.status = 200
            info.meta.success = true
            res.status(200).json(info)
        }).catch( err => {console.log(err); res.status(500).json(info)})
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.2.2. 获取走失老人信息列表 */
router.get('/lost_old', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    Tasks.findAll({
        where: {
            state: [2, 4]
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                oid: tasks[i].user_old.oid,
                name: tasks[i].user_old.name,
                photo: tasks[i].photo
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});



module.exports = router;
