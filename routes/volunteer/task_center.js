var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const User_volunteers = require("../../public/models/user_volunteers");
const User_relations = require("../../public/models/user_relations");
const User_olds = require("../../public/models/user_olds");

/* 3.3.1. 获取召集中的任务列表 */
router.get('/task_list/calling', function(req, res, next){
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
    // 多表查询
    Tasks.findAll({
        include: {
            model:User_olds
        },
        where: {
            state: 1
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].tid,
                old_name: tasks[i].user_old.name,
                t_level: tasks[i].t_level,
                need: tasks[i].need,
                called: tasks[i].called,
                start_time: tasks[i].start_time,
                task_area: tasks[i].lost_area,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.3.2. 获取已完成的任务列表 */
router.get('/task_list/finish', function(req, res, next){
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
    // 多表查询
    Tasks.findAll({
        include: {
            model:User_olds
        },
        where: {
            state: [3, 4]
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].tid,
                old_name: tasks[i].user_old.name,
                finded: Boolean(4-tasks[i].state),
                t_level: tasks[i].t_level,
                called: tasks[i].called,
                start_time: tasks[i].start_time,
                end_time: tasks[i].end_time,
                task_area: tasks[i].lost_area,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.3.3. 获取未完成的任务列表 */
router.get('/task_list/unfinish', function(req, res, next){
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
    // 多表查询
    Tasks.findAll({
        include: {
            model:User_olds
        },
        where: {
            state: 2
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].tid,
                old_name: tasks[i].user_old.name,
                t_level: tasks[i].t_level,
                called: tasks[i].called,
                start_time: tasks[i].start_time,
                task_area: tasks[i].lost_area,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.3.4. 获取单个任务的详细文字信息 */
router.get('/task_info/:tid', function(req, res, next){
    const tid = req.params.tid
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
    // 任务表关联志愿者表
    Tasks.belongsTo(User_volunteers, {
        foreignKey: "vid",
        targetKey:'vid'
    })
    // 任务表关联家属表
    Tasks.belongsTo(User_relations, {
        foreignKey: "rid",
        targetKey:'rid'
    })
    // 多表查询
    Tasks.findOne({
        include: [
            {
                model:User_volunteers
            },{
                model:User_relations
            },{
                model:User_olds
            }
        ],
        where: {
            tid: tid
        }
    }).then(task => {
        info.data = {
            old_name: task.user_old.name,
            old_sex: task.user_old.sex,
            old_photo: task.photo,
            relation_name: task.user_relation.name,
            relation_phone: task.user_relation.phone,
            call_time: task.check_time,
            start_time: task.start_time,
            end_time: task.end_time,
            need: task.need,
            called: task.called,
            lost_p: [task.lost_position_lng, task.lost_position_lat],
            gather_p: [task.lost_position_lng, task.lost_position_lat],
            principal_name: task.user_volunteer.name,
            principal_phone: task.user_volunteer.phone,
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

module.exports = router;
