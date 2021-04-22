const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'news', // 新闻表
    {
        new_id:{ // 新闻id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,        //  主键
            autoIncrement:true,     //  自增
        },
        title:{ // 新闻标题               // 外键
            type:Sequelize.STRING(100), //  int类型
            allowNull: false          // 非空
        },
        content:{ // 新闻内容      // 外键
            type:Sequelize.TEXT,  //  int类型
            allowNull: false          // 非空
        },
        time:{ // 发布时间
            type:Sequelize.BIGINT,    //  bool值
            allowNull: false,         // 非空
        },
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)