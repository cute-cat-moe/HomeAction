const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("wb_db","root","root",{
    host:"47.98.154.166",
    port:'3306',
    dialect:"mysql",
    pool:{
        max:5, // 最大连接数
        min:0,
        acquire:3000,
        idle:10000
    },
    charset: 'utf8',     // 设置编码格式
    collate: 'utf8_general_ci',
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.authenticate().then(() => {
    console.log("数据库连接成功");
    console.log(Date.now());
}).catch((err) => {
    //数据库连接失败时打印输出
    console.log("连接失败")
    console.error(err);
    throw err;
});
// // 同步到数据库
// sequelize.sync()

module.exports = db;