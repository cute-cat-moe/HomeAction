var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const User_volunteers = require("../../public/models/user_volunteers");
const User_relations = require("../../public/models/user_relations");
const User_olds = require("../../public/models/user_olds");

/* 2.2.1. 获取未完成任务 */
router.get('/task_unfinish', function(req, res, next){
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 任务表关联志愿者表
    Tasks.belongsTo(User_volunteers, {
        foreignKey: "vid",
        targetKey:'vid'
    })
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    // 多表查询
    Tasks.findAll({
        include: [
            {
                model:User_volunteers
            },{
                model:User_olds
            }
        ],
        where: {
            state: [1, 2]
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].tid,
                t_principalc: tasks[i].user_volunteer.name,
                start_time: tasks[i].start_time === null ? tasks[i].check_time : tasks[i].start_time,
                t_state: tasks[i].state,
                t_level: tasks[i].t_level,
                old_name: tasks[i].user_old.name,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.2.2. 获取未完成任务的详细信息 */
router.get('/task_unfinish/:tid', function(req, res, next){
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
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
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
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
            old: {
                name: task.user_old.name,
                sex: task.user_old.sex,
                age: task.user_old.age,
                ill: task.user_old.ill === null ? '无' : task.user_old.ill,
                relation_name: task.user_relation.name,
                relation_phone: task.user_relation.phone,
                photo: task.photo,
                lost_time: task.lost_time,
                lost_area: task.lost_area,
                lost_position: [task.lost_position_lng, task.lost_position_lat]
            },
            principal: {
                name: task.user_volunteer.name,
                sex: task.user_volunteer.sex,
                age: task.user_volunteer.age,
                phone: task.user_volunteer.phone
            },
            task: {
                tid: task.tid,
                t_state: task.state,
                t_level: task.t_level,
                start_time: task.start_time === null ? task.check_time : task.start_time,
                predict_time: (4-task.t_level)*24,
                need: task.need,
                called: task.called,
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.2.3. 获取已完成任务 */
router.get('/task_finish', function(req, res, next){
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 任务表关联志愿者表
    Tasks.belongsTo(User_volunteers, {
        foreignKey: "vid",
        targetKey:'vid'
    })
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    // 多表查询
    Tasks.findAll({
        include: [
            {
                model:User_volunteers
            }, {
                model:User_olds
            }
        ],
        where: {
            state: [3, 4]
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].tid,
                t_principalc: tasks[i].user_volunteer.name,
                start_time: tasks[i].start_time,
                end_time: tasks[i].end_time,
                finded: Boolean(4-tasks[i].state),
                t_level: tasks[i].t_level,
                old_name: tasks[i].user_old.name,
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.2.4. 获取已完成任务的详细信息 */
router.get('/task_finish/:tid', function(req, res, next){
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
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
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
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
        console.log(111)
        info.data = {
            old: {
                name: task.user_old.name,
                sex: task.user_old.sex,
                age: task.user_old.age,
                ill: task.user_old.ill === null ? '无' : task.user_old.ill,
                relation_name: task.user_relation.name,
                relation_phone: task.user_relation.phone,
                photo: task.photo,
                lost_area: task.lost_area,
                lost_position: [task.lost_position_lng, task.lost_position_lat]
            },
            principal: {
                name: task.user_volunteer.name,
                sex: task.user_volunteer.sex,
                age: task.user_volunteer.age,
                phone: task.user_volunteer.phone
            },
            task: {
                tid: task.tid,
                t_level: task.t_level,
                start_time: task.start_time,
                end_time: task.end_time,
                v_num: task.called,
                finded: Boolean(4-task.state),
                find_area: task.find_area,
                find_position: task.find_position_lng === null ? [] : [task.find_position_lng, task.user_old.find_position_lat]
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.2.5. 获取待审核任务 */
router.get('/task_audit', function(req, res, next){
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 任务表关联家属表
    Tasks.belongsTo(User_relations, {
        foreignKey: "rid",
        targetKey:'rid'
    })
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    // 多表查询
    Tasks.findAll({
        include: [
            {
                model:User_relations
            },{
                model:User_olds
            }
        ],
        where: {
            state: 0
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                tid: tasks[i].tid,
                upload_time: tasks[i].upload_time,
                old_name: tasks[i].user_old.name,
                relation_name: tasks[i].user_relation.name,
                relation_phone: tasks[i].user_relation.phone
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.2.6. 获取待审核任务的详细信息 */
router.get('/task_audit/:tid', function(req, res, next){
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 任务表关联家属表
    Tasks.belongsTo(User_relations, {
        foreignKey: "rid",
        targetKey:'rid'
    })
    // 任务表关联老人表
    Tasks.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    // 多表查询
    Tasks.findOne({
        include: [
            {
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
            old_age: task.user_old.age,
            old_ill: task.user_old.ill === null ? '无' : task.user_old.ill,
            old_idcard: task.user_old.idcard === null ? '无' : task.user_old.old_idcard,
            relation_name: task.user_relation.name,
            relation_phone: task.user_relation.phone,
            relation_idcard: task.user_relation.idcard === null ? '无' : task.user_relation.idcard,
            photo: task.photo,
            lost_area: task.lost_area,
            lost_position: [task.lost_position_lng, task.lost_position_lat]

        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.2.7. 上传审核结果 */
router.post('/task_audit', function(req, res, next){
    let tid = req.body.tid
    let pass = req.body.pass
    const updateData = {
        state:-1,
        check_time:Date.now(),
        aid:req.body.aid
    }
    if(pass)
        updateData.state = 1
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 数据更新
    Tasks.update(updateData, {
        where: {
            tid: tid
        }
    }).then(date => {
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

module.exports = router;