const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'user_volunteers',
    {
        vid:{ // 志愿者id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,    //  主键
            autoIncrement:true, //  自增
        },
        name:{  // 志愿者姓名
            type:Sequelize.STRING(10),  //  字符串
            allowNull: false  // 非空
        },
        sex:{ // 志愿者性别
            type:Sequelize.STRING(2),  //  字符串
            allowNull: false  // 非空
        },
        age:{ // 志愿者年龄
            type:Sequelize.INTEGER, //  int类型
            allowNull: false  // 非空
        },
        identity:{ // 志愿者身份（0-普通志愿者、1-任务负责人）
            type:Sequelize.BOOLEAN,  //  bool值
            allowNull: false  // 非空
        },
        state:{ // 志愿者状态（0-备勤中、1-忙碌中、2-任务中）
            type:Sequelize.INTEGER,  //  bool值
            allowNull: false,  // 非空
            defaultValue: 0   // 默认备勤中
        },
        phone:{ // 志愿者电话
            type:Sequelize.STRING(40),  //  字符串
            allowNull: false  // 非空
        },
        idcard:{ // 志愿者身份证号
            type:Sequelize.STRING(20),  //  字符串
        },
        photo:{ // 志愿者照片名
            type:Sequelize.STRING  //  字符串
        },
        position_lng:{ // 志愿者位置的经度
            type:Sequelize.FLOAT  //  浮点数
        },
        position_lat:{ // 志愿者位置的纬度
            type:Sequelize.FLOAT  //  浮点数
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