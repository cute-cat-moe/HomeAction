const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'task_clues', // 任务线索表
    {
        area_id:{ // 任务区域id     // 外键
            type:Sequelize.INTEGER,  //  int类型
            allowNull: false          // 非空
        },
        tid:{ // 任务id               // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        vid:{ // 志愿者id               // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        time:{ // 线索上报时间
            type:Sequelize.BIGINT,    //  长整型
            allowNull: false          // 非空
        },
        clue_content:{ // 线索内容
            type:Sequelize.TEXT,    //  文本
            allowNull: false          // 非空
        },
        remark:{ // 备注
            type:Sequelize.TEXT,    //  文本
            defaultValue: '无'
        },
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)