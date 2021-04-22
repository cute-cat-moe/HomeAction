var express = require('express');
var router = express.Router();
const Tasks = require("../../public/models/tasks");
const User_olds = require("../../public/models/user_olds");
var path = require("path")
var fs = require('fs')

// 存储正脸照片
let setPhoto = function(id, file) {
    let nameArray = file.originalname.split('.')
    // 长度是从1开始的 索引是从0开始的。[1,2,3,4]长度4 -1 [nameArray.length - 1]索引
    let type = nameArray[nameArray.length - 1]
    let photo = '/images/old_photos/mainPhoto/old_' + id + "." + type
    let oldName = file.destination + file.filename
    let newName = './public' + photo
    //首先判断文件系统中是否存在该文件，若存在则删除
    if(fs.existsSync(newName)) {
        fs.unlinkSync(newName)
        console.log("顺利删除"+newName)
    }
    fs.renameSync(oldName, newName)
    return photo
}
// 存储额外照片
let setAdditionalPhoto = function(id, i, file) {
    let nameArray = file.originalname.split('.')
    // 长度是从1开始的 索引是从0开始的。[1,2,3,4]长度4 -1 [nameArray.length - 1]索引
    let type = nameArray[nameArray.length - 1]
    let photo = '/images/old_photos/additionalPhoto/old_' + id + "_" + i + "." + type
    let oldName = file.destination + file.filename
    let newName = './public' + photo
    //首先判断文件系统中是否存在该文件，若存在则删除
    if(fs.existsSync(newName)) {
        fs.unlinkSync(newName)
        console.log("顺利删除"+newName)
    }
    fs.renameSync(oldName, newName)
    return photo
}

/* 老人家属提交救援申请接口 */
router.post('/test', function(req, res, next) {
    let test = 2
    let info = {
        data: {
            test: test === null ? '' : test,
            missionID: 9,
            oid: 9
        },
        meta: {
            success: true,
            status: 200
        }
    }
    console.log(111)
    console.log(req.body)
    res.status(200).json(info)
});

/* 老人家属提交救援申请接口 */
router.post('/', function(req, res, next) {
    let info = {
        data: null,
        meta: {
            success: false,
            status: 500
        }
    }
    console.log(req.body)
    let oldData = {
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age
    }
    var files = req.files
    User_olds.findOne({
        where:oldData
    }).then(old => {
        if (old) { // 该老人已存在，创建任务
            const oid = old.oid
            let photo = setPhoto(oid, files['photo'][0])
            const taskData = {
                state: 0,
                rid: req.body.rid,
                oid: old.oid,
                lost_time: req.body.lost_time,
                lost_area: req.body.lost_area,
                lost_position_lng: 0,
                lost_position_lat: 0,
                photo: photo,
                photo_num: req.body.additionalPhotoNum,
                upload_time: Date.now()
            }
            Tasks.create(taskData).then(task => {
                const tid = task.tid
                for (let i = 0; i < req.body.additionalPhotoNum; i++) {
                    setAdditionalPhoto(tid, i, files['additionalPhoto'][i])
                }
                info.data = {
                    missionID: tid,
                    oid: oid
                }
                info.meta.status = 200
                info.meta.success = true
                res.status(200).json(info)
            }).catch( err => {console.log(err); res.status(500).json(info)})
        } else { // 老人信息不存在，先创建老人信息
            oldData["state"] = false
            oldData["rid"] = req.body.rid
            User_olds.create(oldData).then(new_old => {
                let photo = setPhoto(new_old.oid, files['photo'][0])
                const taskData = {
                    state: 0,
                    rid: req.body.rid,
                    oid: new_old.oid,
                    lost_time: req.body.lost_time,
                    lost_area: req.body.lost_area,
                    lost_position_lng: 0,
                    lost_position_lat: 0,
                    photo: photo,
                    photo_num: req.body.additionalPhotoNum,
                    upload_time: Date.now()
                }
                Tasks.create(taskData).then(task => {
                    const tid = task.tid
                    for (let i = 0; i < req.body.additionalPhotoNum; i++) {
                        setAdditionalPhoto(tid, i, files['additionalPhoto'][i])
                    }
                    info.data = {
                        missionID: tid,
                        oid: new_old.oid
                    }
                    info.meta.status = 200
                    info.meta.success = true
                    res.status(200).json(info)
                }).catch( err => {console.log(err); res.status(500).json(info)})
            })
        }
    }).catch( err => {console.log(err); res.status(500).json(info)})

    // 服务器内部错误
    process.on('uncaughtException', (err) => {
        res.status(500).json(info)
        console.log(err);
    })
});


module.exports = router;
