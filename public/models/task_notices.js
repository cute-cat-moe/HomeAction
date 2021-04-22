const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'task_notices', // 任务公告表
    {
        nid:{ // 公告id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,    //  主键
            autoIncrement:true, //  自增
        },
        tid:{ // 任务id               // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        n_type:{ // 公告类型
            type:Sequelize.STRING,    //  字符串
            allowNull: false          // 非空
        },
        n_time:{ // 公告发布时间
            type:Sequelize.BIGINT,    //  长整型
            allowNull: false          // 非空
        },
        n_content:{ // 公告内容
            type:Sequelize.TEXT,    //  文本
            allowNull: false          // 非空
        },
        sender_id:{ // 发布者id               // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        sender_name:{ // 发布者姓名             // 外键
            type:Sequelize.STRING(10),  //  字符串
            allowNull: false          // 非空
        },
        sender_avatar:{ // 发布者头像路径名       // 外键
            type:Sequelize.STRING,  //  字符串
        },
        sender_identity:{ // 发布者身份，负责人、组长、家属             // 外键
            type:Sequelize.STRING(10),  //  字符串
            allowNull: false          // 非空
        },
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)