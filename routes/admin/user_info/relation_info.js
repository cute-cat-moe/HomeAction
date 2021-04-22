var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs") // 加密工具
const User_relations = require("../../../public/models/user_relations");
const User_olds = require("../../../public/models/user_olds");
const Tasks = require("../../../public/models/tasks");

/* 2.4.9. 获取老人家属信息 */
router.get('/', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 家属表关联老人表
    User_olds.belongsTo(User_relations, {
        foreignKey: "rid",
        targetKey:'rid'
    })
    // 多表查询数据库
    User_olds.findAll({
        include: {
                model:User_relations
        }
    }).then(olds => {
        info.data = []
        for(let i = 0; i < olds.length; i++) {
            let temp = {
                oid: olds[i].oid,
                o_name: olds[i].name,
                r_name: olds[i].user_relation.name,
                phone: olds[i].user_relation.phone,
                state: olds[i].state
            }
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 2.4.10. 获取老人家属详细信息 */
router.get('/:oid', function(req, res, next) {
    let oid = req.params.oid
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 老人表关联家属表
    User_olds.belongsTo(User_relations, {
        foreignKey: "rid",
        targetKey:'rid'
    })
    // 多表查询数据库
    User_olds.findOne({
        include: [{
            model:User_relations
        }],
        where: {
            oid: oid
        }
    }).then(old => {
        if (old) { // 用户存在
            info.data = {
                relation: {
                    rid: old.user_relation.rid,
                    name: old.user_relation.name,
                    sex: old.user_relation.sex === null ? '无' : old.user_relation.sex,
                    age: old.user_relation.age === null ? 0 : old.user_relation.age,
                    idcard: old.user_relation.idcard === null ? '无' : old.user_relation.idcard,
                    phone: old.user_relation.phone,
                    relationship: old.relationship === null ? '无' : old.relationship
                },
                old: {
                }
            }
            Tasks.max('tid' ,{
                where: {
                    oid: old.oid
                }
            }).then(tid => {
                Tasks.findOne({
                    where: {
                        tid: tid
                    }
                }).then(task => {
                    info.data.old = {
                        oid: old.oid,
                        name: old.name,
                        sex: old.sex,
                        age: old.age,
                        ill: old.ill === null ? '无' : old.ill,
                        idcard: old.idcard === null ? '无' : old.idcard,
                        state: old.state,
                        lost_date: task.lost_time,
                        find_date: task.find_time === null ? 0 : task.find_time,
                        photo: task.photo,
                        lost_position: [task.lost_position_lng, task.lost_position_lat],
                        find_position: task.find_time === null ? [] : [task.find_position_lng, task.find_position_lat]
                    }
                    info.meta.status = 200
                    info.meta.success = true
                    res.status(200).json(info)
                }).catch( err => {console.log(err); res.status(500).json(info)})
            }).catch( err => {console.log(err); res.status(500).json(info)})
        } else { // 该用户不存在
            info.meta.status = 400
            res.status(400).json(info)
        }
    }).catch( err => res.status(500).json(info))
});

/* 2.4.11. 修改老人家属信息 */
router.put("/update_relation", function (req, res, next) {
    const rid = req.body.rid
    let userData = {
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        idcard: req.body.idcard,
        phone: req.body.phone,
    }
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 首先查询是否存在该用户
    User_relations.findOne({
        where:{
            rid: rid
        }
    }).then(relation => {
        if (relation) { // 该用户存在
            // 更新数据库中的数据
            User_relations.update(userData, {
                where:{
                    rid:rid
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

/* 2.4.12. 修改老人信息 */
router.put("/update_old", function (req, res, next) {
    const oid = req.body.oid
    let userData = {
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        ill: req.body.ill,
        idcard: req.body.idcard,
        state: req.body.state,
        relationship: req.body.relationship
    }
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    // 首先查询是否存在该用户
    User_olds.findOne({
        where:{
            oid: oid
        }
    }).then(old => {
        if (old) { // 该用户存在
            // 更新数据库中的数据
            User_olds.update(userData, {
                where:{
                    oid: oid
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

module.exports = router;