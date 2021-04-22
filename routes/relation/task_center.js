var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const User_volunteers = require("../../public/models/user_volunteers");
const User_relations = require("../../public/models/user_relations");
const User_olds = require("../../public/models/user_olds");
const Task_notices = require("../../public/models/task_notices");
const Task_clues = require("../../public/models/task_clues");
const Task_teams = require("../../public/models/task_teams");
const Task_uncertain_olds = require("../../public/models/task_uncertain_olds");
var path = require("path")
var fs = require('fs')
// 帮助处理时间的函数
function pad(str) {
    return +str >= 10 ? str : '0' + str
}

/* 获取任务详细数据 */
router.get('/:tid', function(req, res, next) {
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
            missionDetail: {
                // 任务等级
                level: task.t_level === null ? 0 : task.t_level,
                // 任务开始时间
                startTime: task.start_time === null ? 0 : task.start_time,
                // 任务结束时间
                endTime: task.end_time === null ? 0 : task.end_time,
                // 任务状态，0表示审核未通过，1表示待审核，2表示召集中，3表示进行中，4表示成功结束，5表示失败结束
                status: task.state+1,
                // 已召集志愿者人数
                called: task.called === null ? 0 : task.called,
                // 需要召集的志愿者人数
                need: task.need === null ? 0 : task.need,
                // 任务负责人信息和联系方式
                principal: {
                    id: 0, // 任务负责人id
                    name: '无',
                    telephone: '无',
                },
            },
            lostOldId: task.user_old.oid,
            lostOldDetail: {
                relative: {
                    id: task.user_relation.rid,
                    name: task.user_relation.name,
                    telephone: task.user_relation.phone,
                },
                mainPhoto: {
                    id: 0,
                    path: task.photo,
                },
                additionalPhoto: [],
                name: task.user_old.name,
                gender: task.user_old.sex,
                age: task.user_old.age,
                lastKnownLocation: {
                    name: task.lost_area,
                    lnglat: [task.lost_position_lng, task.lost_position_lat],
                },
                starLocation: [],
                lostDate: '',
                lostTime: '',
                lost_time: task.lost_time,
                nativePlace: task.user_old.native === null ? '无' : task.user_old.native,
                diseaseHistory: task.user_old.ill === null ? '无' : task.user_old.ill,
                posture: task.user_old.physical_feature === null ? '无' : task.user_old.physical_feature,
                clothing: task.user_old.clothing_feature === null ? '无' : task.user_old.clothing_feature,
                otherChara: task.user_old.other_feature === null ? '无' : task.user_old.other_feature,
                otherInfo: '无',
            },
        }
        // 处理时间数据：lostData和lostTime
        const dateObj = new Date(info.data.lostOldDetail.lost_time) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
        const year = dateObj.getFullYear() // 获取年，
        const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
        const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
        const hours = pad(dateObj.getHours())  // 获取时, pad函数用来补0
        const minutes =  pad(dateObj.getMinutes()) // 获取分
        info.data.lostOldDetail.lostDate = year + '-' + month + '-' + date
        info.data.lostOldDetail.lostTime = hours + ':' + minutes
        // 处理近期照片数据：additionalPhoto
        let type = ['.jpg', '.png', '.jpeg', '.bmp']
        for (let i = 0; i < task.photo_num; i++) {
            for (let j = 0; j < type.length; j++) {
                let photo = '/images/old_photos/additionalPhoto/old_'+tid+'_'+i+type[j]
                let pName = './public' + photo
                //首先判断文件系统中是否存在该文件，若存在则删除
                if(fs.existsSync(pName)) {
                    console.log('文件存在：'+pName)
                    let p = {
                        id: i+1,
                        path: photo,
                    }
                    info.data.lostOldDetail.additionalPhoto.push(p)
                    break
                } else {
                    console.log('文件不存在：'+pName)
                }
            }
        }
        // 处理任务负责人数据
        if (task.vid !== null) {
            User_volunteers.findOne({
                where: {
                    vid: task.vid
                }
            }).then(principal => {
                info.data.missionDetail.principal.id = principal.vid
                info.data.missionDetail.principal.name = principal.name
                info.data.missionDetail.principal.telephone = principal.phone
                info.meta.status = 200
                info.meta.success = true
                res.status(200).json(info)
            }).catch( err => {console.log(err); res.status(500).json(info)})
        } else {
            info.meta.status = 200
            info.meta.success = true
            res.status(200).json(info)
        }
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 获取任务公告数据 */
router.get('/task_notices/:tid', function(req, res, next) {
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
        for (let i = notices.length-1; i >= 0; i--) {
            let tmp = {
                id: notices[i].nid,
                type: notices[i].n_type,
                time: notices[i].n_time,
                content: notices[i].n_content,
                member: {
                    uid: notices[i].sender_id,
                    name: notices[i].sender_name,
                    avatar: notices[i].sender_avatar === null ? '' : notices[i].sender_avatar === null,
                    identity: notices[i].sender_identity,
                }
            }
            info.data.push(tmp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 获取任务反馈数据 */
router.get('/task_clues/:tid', async (req, res) => {
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Task_clues.belongsTo(User_volunteers, {
        foreignKey: "vid",
        targetKey: "vid"
    })
    let clues = await Task_clues.findAll({
        include: [
            {
                model:User_volunteers
            }
        ],
        where: {
            tid: tid
        }
    }).catch( err => {console.log(err); res.status(500).json(info)})
    info.data = []
    for (let i = clues.length-1; i >= 0; i--) {
        let team = await Task_teams.findOne({
            where: {
                tid: tid,
                vid: clues[i].user_volunteer.vid
            }
        }).catch( err => {console.log(err); res.status(500).json(info)})
        let tmp = {
            id: clues[i].id,
            date: clues[i].time,
            uid: clues[i].user_volunteer.vid,
            team_id: team.team_id,
            team_identity: team.identity,
            name: clues[i].user_volunteer.name,
            feedback: clues[i].clue_content,
            comment: clues[i].remark === null ? '无' : clues[i].remark,
        }
        info.data.push(tmp)
    }
    info.meta.status = 200
    info.meta.success = true
    res.status(200).json(info)
});

/* 获取疑似老人数据 */
router.get('/uncertain_old/:tid', function(req, res, next) {
    let tid = req.params.tid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    Task_uncertain_olds.findAll({
        where: {
            tid: tid
        }
    }).then(olds => {
        info.data = []
        let type = ['.jpg', '.png', '.jpeg', '.bmp']
        for (let i = olds.length-1; i >= 0; i--) {
            let tmp = {
                id: olds[i].id,
                time: olds[i].find_time,
                findLocation: {
                    name: olds[i].find_area,
                    lnglat: [olds[i].find_position_lng, olds[i].find_position_lat]
                },
                photos: []
            }
            for (let j = 0; j < olds[i].photo_num; j++) {
                for (let m = 0; m < type.length; m++) {
                    let photo = '/images/old_photos/uncertainPhoto/old_'+olds[i].id+'_'+j+type[m]
                    let pName = './public' + photo
                    //首先判断文件系统中是否存在该文件，若存在则删除
                    if(fs.existsSync(pName)) {
                        console.log('文件存在：'+pName)
                        let p = {
                            id: j,
                            path: photo,
                        }
                        tmp.photos.push(p)
                        break
                    }
                }
            }
            info.data.push(tmp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

module.exports = router;
