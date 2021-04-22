var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const User_volunteers = require("../../public/models/user_volunteers");
const User_relations = require("../../public/models/user_relations");
const User_olds = require("../../public/models/user_olds");
const Sequelize = require("sequelize");
const Op = Sequelize.Op

/* 2.3.1. 走失老人性别比列 */
router.post('/old_sex', function(req, res, next) {
    const begin = req.body.begin
    const end = req.body.end
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    Tasks.findAll({
        include: {
            model:User_olds,
            as: 'user_old',
        }
    }).then(task => {
        info.data = {
            male: 0,
            female: 0
        }
        for(let i = 0; i < task.length; i++) {
            if(task[i].lost_time >= begin && task[i].lost_time <= end){
                if(task[i].user_old.sex === '女') {
                    info.data.female++
                } else {
                    info.data.male++
                }
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.3.2. 走失老人年龄分布 */
router.post('/old_age', function(req, res, next) {
    const begin = req.body.begin
    const end = req.body.end
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    Tasks.findAll({
        include: {
            model:User_olds,
            as: 'user_old',
        }
    }).then(task => {
        info.data = {
            age_0_70: 0,
            age_70_80: 0,
            age_80_90: 0,
            age_90_: 0
        }
        // console.log(olds_data[0].tasks.length)
        for(let i = 0; i < task.length; i++) {
            if(task[i].lost_time >= begin && task[i].lost_time <= end){
                if(task[i].user_old.age <= 70)
                    info.data.age_0_70++
                else if(task[i].user_old.age > 70 && task[i].user_old.age <= 80)
                    info.data.age_70_80++
                else if(task[i].user_old.age > 80 && task[i].user_old.age <= 90)
                    info.data.age_80_90++
                else if(task[i].user_old.age > 90)
                    info.data.age_90_++
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});


/* 2.3.2. 任务成功结束比例 */
router.post('/success', function(req, res, next) {
    const begin = req.body.begin
    const end = req.body.end
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Tasks.count({
        where: {
            state: [3, 4],
        },
        attributes: ['state'],
        group: 'state',
    }).then(task => {
        console.log(task)
        info.data = {
            success: 0,
            fail: 0
        }
        if (task.length === 1) {
            if (task[0].state === 3)
                info.data.success = task[0].count
            else
                info.data.fail = task[0].count
        }
        else if (task.length === 2) {
            if (task[0].state === 3) {
                info.data.success = task[0].count
                info.data.fail = task[1].count
            }
            else {
                info.data.success = task[1].count
                info.data.fail = task[2].count
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.3.3. 任务等级比例 */
router.post('/task_level', function(req, res, next) {
    const begin = req.body.begin
    const end = req.body.end
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Tasks.findAll({}).then(task => {
        info.data = {
            level_n: 3,
            level_1: 0,
            level_2: 0,
            level_3: 0,
            // level_4: 0
        }
        for(let i = 0; i < task.length; i++) {
            if(task[i].lost_time >= begin && task[i].lost_time <= end){
                let str = "level_" + task[i].t_level
                info.data[str]++
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.3.4. 搜寻时间分布  */
router.post('/task_time', function(req, res, next) {
    const begin = req.body.begin
    const end = req.body.end
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 老人表关联任务表
    User_olds.hasOne(Tasks, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    Tasks.findAll({
        where: {
            state: [3, 4]
        }
    }).then(task => {
        info.data = {
            time_0_24: 0,
            time_24_48: 0,
            time_48_72: 0,
            time_72_: 0
        }
        for(let i = 0; i < task.length; i++) {
            if(task[i].lost_time >= begin && task[i].lost_time <= end){
                let time = Math.floor(Math.abs(task[i].end_time - task[i].start_time) / 3600000)
                if(time <= 24)
                    info.data.time_0_24++
                else if(time > 24 && time <= 48)
                    info.data.time_24_48++
                else if(time > 48 && time <= 72)
                    info.data.time_48_72++
                else if(time > 72)
                    info.data.time_72_++
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.3.5. 走失地点分布  */
router.post('/lost_position', function(req, res, next) {
    const begin = req.body.begin
    const end = req.body.end
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 老人表关联任务表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    Tasks.findAll({
        include: {
            model:User_olds,
            as: 'user_old',
        }
    }).then(task => {
        info.data = []
        for(let i = 0; i < task.length; i++) {
            if(task[i].lost_time >= begin && task[i].lost_time <= end){
                let temp = {
                    tid: task[i].tid,
                    lost_position: [task[i].lost_position_lng, task[i].lost_position_lat],
                    find_position: [task[i].find_position_lng, task[i].find_position_lat]
                }
                info.data.push(temp)
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.3.6. 志愿者位置分布  */
router.post('/v_position', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    User_volunteers.findAll({
        where: {
            state: 1
        }
    }).then(volunteers_data => {
        info.data = []
        for(let i = 0; i < volunteers_data.length; i++) {
            let temp = {
                vid: volunteers_data[i].vid,
                v_name: volunteers_data[i].name,
                v_position: [volunteers_data[i].position_lng, volunteers_data[i].position_lat]
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

module.exports = router;