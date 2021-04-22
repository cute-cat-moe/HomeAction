const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'user_relations',
    {
        rid:{ // 家属id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,         //  主键
            autoIncrement:true,      //  自增
        },
        name:{  // 家属姓名
            type:Sequelize.STRING(10),  //  字符串
            allowNull: false        // 非空
        },
        sex:{ // 家属性别
            type:Sequelize.STRING(2)  //  字符串
        },
        age:{ // 家属年龄
            type:Sequelize.INTEGER //  int类型
        },
        phone:{ // 家属电话
            type:Sequelize.STRING(40),  //  字符串
            allowNull: false        // 非空
        },
        password:{ // 家属密码
            type:Sequelize.TEXT,  //
            allowNull: false        // 非空
        },
        idcard:{ // 家属身份证号
            type:Sequelize.STRING(20)  //  字符串
        },
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)