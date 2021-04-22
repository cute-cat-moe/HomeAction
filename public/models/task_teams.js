const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'task_teams', // 任务小组表
    {
        team_id:{ // 小组id
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },

        tid:{ // 任务id                    外键
            type:Sequelize.INTEGER,    //  int类型
            allowNull: false          // 非空
        },
        vid:{ // 志愿者id                    外键
            type:Sequelize.INTEGER,    //  int类型
            allowNull: false          // 非空
        },
        identity:{ // 组员身份
            type:Sequelize.STRING(2),    //  bool类型
            allowNull: false          // 非空
        }
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)