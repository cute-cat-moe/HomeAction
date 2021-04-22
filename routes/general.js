var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require('fs')
const Tasks = require("../public/models/tasks");
const User_volunteers = require("../public/models/user_volunteers");
const User_relations = require("../public/models/user_relations");
const User_olds = require("../public/models/user_olds");

// 帮助处理时间的函数
function pad(str) {
    return +str >= 10 ? str : '0' + str
}

/* 后端给前端发送图片 */
router.get('/get_404', function(req, res, next) {
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
            }, {
                model:User_olds
            }
        ],
        where: {
            state: 4
        }
    }).then(tasks => {
        info.data = []
        for(let i = 0; i < tasks.length; i++) {
            let temp = {
                id: i,
                old: {
                    name: tasks[i].user_old.name,
                    sex: tasks[i].user_old.sex,
                    age: tasks[i].user_old.age,
                    relation_name: tasks[i].user_relation.name,
                    relation_phone: tasks[i].user_relation.phone,
                    photo: tasks[i].photo,
                    lost_area: tasks[i].lost_area,
                    lost_position: [tasks[i].lost_position_lng, tasks[i].lost_position_lat],
                    lostDate: '',
                    lostTime: '',
                    lost_time: tasks[i].lost_time,
                    nativePlace: tasks[i].user_old.native === null ? '无' : tasks[i].user_old.native,
                    diseaseHistory: tasks[i].user_old.ill === null ? '无' : tasks[i].user_old.ill,
                    posture: tasks[i].user_old.physical_feature === null ? '无' : tasks[i].user_old.physical_feature,
                    clothing: tasks[i].user_old.clothing_feature === null ? '无' : tasks[i].user_old.clothing_feature,
                    otherChara: tasks[i].user_old.other_feature === null ? '无' : tasks[i].user_old.other_feature,
                }
            }
            // 处理时间数据：lostData和lostTime
            const dateObj = new Date(temp.old.lost_time) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
            const year = dateObj.getFullYear() // 获取年，
            const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
            const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
            const hours = pad(dateObj.getHours())  // 获取时, pad函数用来补0
            const minutes =  pad(dateObj.getMinutes()) // 获取分
            temp.old.lostDate = year + '-' + month + '-' + date
            temp.old.lostTime = hours + ':' + minutes
            info.data.push(temp)
        }
        info.meta.status = 200
        info.meta.success = true
        res.status(200).json(info)
    }).catch( err => {console.log(err); res.status(500).json(info)})
});

/* 后端给前端发送图片 */
router.get('/get_photo', function(req, res, next) {
    let pname = req.query.pname
    let pName = "../public/images/portraits/"+pname
    let pPath = path.join(__dirname,pName)
    let defaultName = "../public/images/portraits/"+"default.jpg"//默认图片名
    let defaultPath = path.join(__dirname,defaultName)
    if(fs.existsSync(pPath)) {//用户上传过图片
        res.sendFile(pPath)
    }
    else {//用户没有上传过图片
        res.sendFile(defaultPath)
    }
});

/* 图片下载接口 */
router.get('/', function(req, res, next) {
    let pname = req.query.pname
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment;filename='+pname);    // 'aaa.txt' can be customized.
    let pName = "../public/images/portraits/"+pname
    let pPath = path.join(__dirname,pName)
    var fileStream = fs.createReadStream(pPath);
    fileStream.on('data', function (data) {
        res.write(data, 'binary');
    });
    fileStream.on('end', function () {
        res.end();
        console.log('The file has been downloaded successfully!');
    });
});

module.exports = router;
