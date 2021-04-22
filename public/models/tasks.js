const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'tasks',
    {
        tid:{ // 任务id
            type:Sequelize.INTEGER, //  int类型
            primaryKey:true,        //  主键
            autoIncrement:true,     //  自增
        },
        state:{  // 任务状态 （-1-审核未通过，0-待审核，1-召集中，2-进行中，3-成功结束，4-失败结束）
            type:Sequelize.INTEGER,  //  字符串
            allowNull: false          // 非空
        },
        rid:{ // 老人家属id               外键
            type:Sequelize.INTEGER,     //  int类型
            allowNull: false          // 非空
        },
        oid:{ // 老人id               外键
            type:Sequelize.INTEGER,     //  int类型
            allowNull: false          // 非空
        },
        lost_time:{ // 老人走失时间
            type:Sequelize.BIGINT,  //  长整型
            allowNull: false       // 非空
        },
        find_time:{ // 老人找到时间
            type:Sequelize.BIGINT  //  长整型
        },
        lost_area:{ // 走失区域
            type:Sequelize.STRING,  //  字符串
            allowNull: false         // 非空
        },
        lost_position_lng:{ // 走失位置的经度
            type:Sequelize.DOUBLE,  //  浮点数
            allowNull: false         // 非空
        },
        lost_position_lat:{ // 走失位置的纬度
            type:Sequelize.DOUBLE,  //  浮点数
            allowNull: false         // 非空
        },
        photo:{ // 老人正脸照片路径名
            type:Sequelize.STRING,  //  字符串
            allowNull: false,        // 非空
            defaultValue: true   // 默认走失中
        },
        photo_num:{ // 老人近期照片数量
            type:Sequelize.INTEGER,  //  字符串
            allowNull: false         // 非空
        },
        find_area:{ // 找到区域
            type:Sequelize.STRING  //  字符串
        },
        find_position_lng:{ // 找到位置的经度
            type:Sequelize.DOUBLE  //  浮点数
        },
        find_position_lat:{ // 找到位置的纬度
            type:Sequelize.DOUBLE   //  浮点数
        },

        upload_time:{ // 任务上传时间
            type:Sequelize.BIGINT,      //  长整型
            allowNull: false          // 非空
        },
        t_level:{ // 任务等级
            type:Sequelize.INTEGER,     //  int类型
        },
        need:{ // 需要志愿者数
            type:Sequelize.INTEGER,     //  int类型
        },
        called:{ // 已召集志愿者数
            type:Sequelize.INTEGER,     //  int类型
        },

        vid:{ // 负责人id                    外键
            type:Sequelize.INTEGER     //  int类型
        },
        check_time:{ // 任务审核通过时间，且找到负责人，并开始召集普通志愿者
            type:Sequelize.BIGINT          //  长整型
        },
        aid:{ // 审核的管理员id               外键
            type:Sequelize.INTEGER     //  int类型
        },

        start_time:{ // 任务开始时间，默认是check_time+call_time，可能会提前结束
            type:Sequelize.BIGINT      //  长整型
        },
        end_time:{ // 任务结束时间，默认是start_time+find_time，可能会提前结束
            type:Sequelize.BIGINT      //  长整型
        }
    },{
        timestamps:false,   //  不自动加上createdAt和updatedAt
        charset: 'utf8',     // 设置编码格式
        collate: 'utf8_general_ci',
        freezeTableName: true   // 使模型名与数据库的表名相同
    }
)