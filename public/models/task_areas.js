const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'task_areas', // 任务区域表
    {
        area_id:{ // 区域id
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        tid:{ // 任务id               // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false          // 非空
        },
        area:{ // 搜索区域
            type:Sequelize.STRING,  //  字符串
            allowNull: false         // 非空
        },
        lng:{ // 位置的经度
            type:Sequelize.DOUBLE,  //  浮点数
            allowNull: false         // 非空
        },
        lat:{ // 位置的纬度
            type:Sequelize.DOUBLE,  //  浮点数
            allowNull: false         // 非空
        },
        radius:{ // 搜索半径
            type:Sequelize.INTEGER,  //
            allowNull: false         // 非空
        },
        team_id:{ // 负责搜寻的志愿者小组id      // 外键
            type:Sequelize.INTEGER   //  int类型
        },
        finish:{ // 是否搜寻完毕，0-未结束，1-结束
            type:Sequelize.BOOLEAN,    //  bool值
            allowNull: false,         // 非空
            defaultValue: false   // 默认未结束
        },
        start_time:{ // 开始搜寻时间
            type:Sequelize.BIGINT,    //  长整型
            allowNull: false          // 非空
        },
        end_time:{ // 结束搜寻时间
            type:Sequelize.BIGINT,    //  长整型
        },
        weight:{ // 表示该区域的重要程度
            type:Sequelize.INTEGER,    //  文本
            allowNull: false,         // 非空
            defaultValue: 0       // 默认为0
        }
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)