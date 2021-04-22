var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const Task_volunteers = require("../../public/models/task_volunteers");
const Task_teams = require("../../public/models/task_teams");
const Task_notices = require("../../public/models/task_notices");
const Task_areas = require("../../public/models/task_areas");
const Task_clues = require("../../public/models/task_clues");
const User_olds = require("../../public/models/user_olds");
const User_volunteers = require("../../public/models/user_volunteers");

/* 3.5.1. 获取当前任务的信息 */
router.get('/:vid/:tid', function(req, res, next) {
    let vid = req.params.vid
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            quit: true,
            success: false,
            status: 500
        }
    }
    // 关联任务表
    Task_volunteers.belongsTo(Tasks, {
        foreignKey: "tid",
        targetKey:'tid'
    })
    // 关联老人表
    Task_volunteers.belongsTo(User_olds, {
        foreignKey: "oid",
        targetKey:'oid'
    })
    // 多表查询
    Task_volunteers.findOne({
        include: [{
            model:Tasks
        },{
            model:User_olds
        }],
        where: {
            tid: tid,
            vid: vid
        }
    }).then(task => {
        if(task.quit === false){
            info.data = {
                start_time: task.task.start_time,
                t_level: task.task.t_level,
                old_name: task.user_old.name,
                old_sex: task.user_old.sex,
                old_age: task.user_old.age,
                old_photo: task.task.photo,
                old_native: task.user_old.native,
                old_ill: task.user_old.ill,
                physical_feature: task.user_old.physical_feature,
                clothing_feature: task.user_old.clothing_feature,
                other_feature: task.user_old.other_feature,
                lost_position: [task.task.lost_position_lng, task.task.lost_position_lat]
            }
            info.meta.quit = false
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.5.2. 获取所在小组的信息 */
router.get('/team/:vid/:tid', async (req, res) => {
    let vid = req.params.vid
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }

    let task_team = await Task_teams.findOne({
        where: {
            tid: tid,
            vid: vid
        }
    }).catch( err => {console.log(err);res.status(500).json(info)})
    if(task_team != null) {
        Task_teams.belongsTo(User_volunteers, {
            foreignKey: "vid",
            targetKey:'vid'
        })
        let task_teams = await Task_teams.findAll({
            include: {
                model: User_volunteers
            },
            where: {
                tid: tid,
                team_id: task_team.team_id
            }
        }).catch( err => {console.log(err); res.status(500).json(info)})
        if(task_teams != null) {
            info.data = []
            for(let i = 0; i < task_teams.length; i++) {
                let temp = {
                    team_id: task_team.team_id,
                    vid: task_teams[i].user_volunteer.vid,
                    v_name: task_teams[i].user_volunteer.name,
                    v_phone: task_teams[i].user_volunteer.phone,
                    identity: task_teams[i].identity,
                    v_photo: task_teams[i].user_volunteer.photo,
                }
                info.data.push(temp)
            }
            info.meta.status = 200
            info.meta.success = true
            res.status(200).json(info)
        }
    }
    info.meta.status = 400
    info.meta.success = false
    res.status(400).json(info)

});

/* 3.5.3. 获取搜救公告信息 */
router.get('/notice/:tid', async (req, res) => {
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Task_notices.findAll({
        where: {
            tid: tid
        }
    }).then(notices => {
        info.data = []
        for(let i = 0; i < notices.length; i++) {
            let temp = {
                nid: notices[i].nid,
                n_type: notices[i].n_type,
                n_time: notices[i].n_time,
                n_content: notices[i].n_content
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.5.4. 获取搜救公告信息 */
router.post('/feedback', async (req, res) => {
    let vid = req.body.vid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    if(req.body.finish) { // 该区域搜索完毕
        // 更新任务区域信息
        await Task_areas.update({
            finish: true,
            end_time: req.body.end
        },{
            where: {
                tid: req.body.tid,
                team_id: req.body.team_id
            }
        }).catch( err => {console.log(err); res.status(500).json(info)})
    }
    if(req.body.clue != null) {
        let task_area = await Task_areas.findOne({
            where: {
                tid: req.body.tid,
                team_id: req.body.team_id
            }
        }).catch( err => {console.log(err); res.status(500).json(info)})
        let clueData = {
            area_id: task_area.area_id,
            tid: req.body.tid,
            vid: vid,
            time: Date.now(),
            clue_content: req.body.clue
        }
        await Task_clues.create(clueData).catch( err => {console.log(err); res.status(500).json(info)})
    }
    info.meta.status = 200
    info.meta.success = true
    res.status(200).json(info)
});

/* 3.5.5. 离队申请 */
router.post('/quit_application', function (req, res, next) {
    let vid = req.body.vid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Task_volunteers.update({
        quit: true,
        quit_time: req.body.quit_time,
        quit_reason: req.body.reason,
        back: req.body.back,
        back_time: req.body.back_time
    },{
        where: {
            tid: req.body.tid,
            vid: req.body.vid
        }
    }).then( result => {
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})

});

module.exports = router;
