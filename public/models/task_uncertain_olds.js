const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'task_uncertain_olds',
    {
        id:{ // 疑似老人id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,         //  主键
            autoIncrement:true,      //  自增
        },
        tid:{ // 任务id            // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false,        // 非空
        },
        vid:{ // 发现的志愿id            // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false,        // 非空
        },
        photo_num:{ // 疑似老人照片数量
            type:Sequelize.INTEGER,  //  字符串
            allowNull: false,         // 非空
        },
        similarity:{ // 比对相似度
            type:Sequelize.FLOAT,  //
            allowNull: false,         // 非空
        },
        find_time:{ // 老人找到时间
            type:Sequelize.BIGINT,  //  长整型
            allowNull: false,         // 非空
        },
        find_area:{ // 找到区域
            type:Sequelize.STRING,  //  字符串
            allowNull: false,         // 非空
        },
        find_position_lng:{ // 找到位置的经度
            type:Sequelize.DOUBLE,  //  浮点数
            allowNull: false,         // 非空
        },
        find_position_lat:{ // 找到位置的纬度
            type:Sequelize.DOUBLE,   //  浮点数
            allowNull: false,        // 非空
        },
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)