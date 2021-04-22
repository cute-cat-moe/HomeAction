const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'user_administrators',
    {
        aid:{ // 管理员id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,    //  主键
            autoIncrement:true, //  自增
        },
        name:{  // 管理员姓名
            type:Sequelize.STRING(10),  //  字符串
            allowNull: false  // 非空
        },
        sex:{ // 管理员性别
            type:Sequelize.STRING(2),  //  字符串
            allowNull: false  // 非空
        },
        phone:{ // 管理员电话
            type:Sequelize.STRING(40),  //  字符串
            allowNull: false  // 非空
        },
        idcard:{ // 管理员身份证号
            type:Sequelize.STRING(20)  //  字符串
        },
        state:{ // 管理员状态（在线、不在线）
            type:Sequelize.BOOLEAN,  //  bool值
            allowNull: false,  // 非空
            defaultValue: false   // 默认不在线
        },
        limits:{ // 管理员权限
            type:Sequelize.STRING(4),  //  字符串
            allowNull: false  // 非空
        },
        password:{ // 登录密码
            type:Sequelize.TEXT,  //  字符串
            allowNull: false  // 非空
        }
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)