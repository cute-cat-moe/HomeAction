const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'user_olds',
    {
        oid:{ // 老人id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,         //  主键
            autoIncrement:true,      //  自增
        },
        rid:{ // 家属id            // 外键
            type:Sequelize.INTEGER, //  int类型
            allowNull: false        // 非空
        },
        name:{  // 老人姓名
            type:Sequelize.STRING(10),  //  字符串
            allowNull: false        // 非空
        },
        sex:{ // 老人性别
            type:Sequelize.STRING(2),  //  字符串
            allowNull: false        // 非空
        },
        age:{ // 老人年龄
            type:Sequelize.INTEGER, //  int类型
            allowNull: false        // 非空
        },
        ill:{ // 老人病症
            type:Sequelize.STRING,  //  字符串
        },
        idcard:{ // 老人身份证号
            type:Sequelize.STRING(20)  //  字符串
        },
        native:{ // 老人籍贯
            type:Sequelize.STRING  //  字符串
        },
        state:{ // 老人状态（0-已找到、1-走失中）
            type:Sequelize.BOOLEAN,  //  bool值
            allowNull: false,  // 非空
            defaultValue: true   // 默认走失中
        },
        physical_feature:{ // 老人体态特征
            type:Sequelize.TEXT  //  字符串
        },
        clothing_feature:{ // 老人衣着特征
            type:Sequelize.TEXT  //  字符串
        },
        other_feature:{ // 老人其他特征
            type:Sequelize.TEXT  //  字符串
        },
        relationship:{ // 老人与家属的关系
            type:Sequelize.STRING(20),  //  字符串
        }
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)