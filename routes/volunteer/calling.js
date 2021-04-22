var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const Task_volunteers = require("../../public/models/task_volunteers");
const User_olds = require("../../public/models/user_olds");

// 根据经纬度计算距离，单位为m，p[经度lng，纬度lat]
function getFlatternDistance(p1, p2){
    var f = ((p1[1] + p2[1])/2) * Math.PI / 180.0;
    var g = ((p1[1] - p2[1])/2) * Math.PI / 180.0;
    var l = ((p1[0] - p2[0])/2) * Math.PI / 180.0;
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = 6378137.0;
    var fl = 1/298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg ) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}

/* 3.4.1. 获取召集任务列表（该用户被召集参与的任务） */
router.post('/calling_task', function(req, res, next){
    let position = req.body.position
    console.log(position)
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
        targetKey: 'oid'
    })
    // 多表查询
    Tasks.findAll({
        include: {
            model: User_olds
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let pt = [tasks[i].user_old.lost_position_lng, tasks[i].user_old.lost_position_lat]
            if(getFlatternDistance(position, pt) <= 10000){
                let temp = {
                    tid: tasks[i].tid,
                    old_name: tasks[i].user_old.name,
                    t_level: tasks[i].t_level,
                    call_time: tasks[i].check_time,
                    start_time: tasks[i].start_time,
                    task_area: tasks[i].user_old.lost_area,
                }
                info.data.push(temp)
            }
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 3.4.3. 接收任务召集 */
router.get('/accept_call/:vid/:tid', function(req, res, next){
    let tid = req.params.tid
    let vid = req.params.vid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 多表查询
    Tasks.findOne({
        where: {
            tid: tid
        }
    }).then(task => {
        let insertData = {
            tid: tid,
            vid: vid,
            quit: false,
            pid: task.vid,
            rid: task.rid,
            oid: task.oid
        }
        Task_volunteers.create(insertData).then( tv => {
            info.meta.status = 200
            info.meta.success = true
            res.status(200).json(info)
        }).catch( err => {console.log(err); res.status(500).json(info)})
    }).catch( err => {console.log(err); res.status(500).json(info)})
});


module.exports = router;
