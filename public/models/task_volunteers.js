const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'task_volunteers', // 志愿者与任务的关联表
    {
        tid:{ // 任务id
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        vid:{ // 志愿者id                    外键
            type:Sequelize.INTEGER,    //  int类型
            allowNull: false          // 非空
        },
        quit:{ // 志愿者是否离队
            type:Sequelize.BOOLEAN,    //  bool类型
            allowNull: false,         // 非空
            defaultValue: false   // 默认不离队
        },
        quit_time:{ // 离队时间
            type:Sequelize.BOOLEAN,    //  长整型
        },
        quit_reason:{ // 离队理由
            type:Sequelize.TEXT,    //  长整型
        },
        back:{ // 志愿者是否归队
            type:Sequelize.BOOLEAN,    //  bool类型
            defaultValue: false   // 默认不归队
        },
        back_time:{ // 归队时间
            type:Sequelize.BOOLEAN,    //  长整型
        },
        pid:{ // 负责人id                    外键
            type:Sequelize.INTEGER,    //  int类型
        },
        rid:{ // 家属id                    外键
            type:Sequelize.INTEGER,    //  int类型
        },
        oid:{ // 老人id                    外键
            type:Sequelize.INTEGER,    //  int类型
        }
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)