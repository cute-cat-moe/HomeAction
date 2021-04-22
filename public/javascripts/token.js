const jwt = require("jsonwebtoken");
const signkey = 'mes_qdhd_mobile_xhykjyxgs'; // 密匙

var tokenObj = {
    createToken: function(cont){
        let eTime = 60*60*24*7*1000 // token过期时间设置为7天
        let content = cont; //token要存储的内容。自定义
        return new Promise((resolve,reject)=>{
            const token = jwt.sign(content,signkey,{ expiresIn:eTime});
            resolve(token);
        })
    },
    verifyToken: function(token){
        return new Promise((resolve,reject)=>{
            var info = jwt.verify(token.split(' ')[1],signkey);
            resolve(info);
        })
    }
}
module.exports = tokenObj;
