const pool =require("./pool");
const express = require("express");
const bodyParser = require("body-parser");        //处理post请求
const cookieParser = require("cookie-parser");    //session
const expressSession = require("express-session");//session
const cors = require("cors");                      //cors
let app=express();
app.listen(3000);
//指定静态目录  public
app.use(express.static("public"));

//4:配置第三方模块
//4.1:配置跨域模块
//origin 允许来自哪个域名下跨域访问
app.use(cors({
    origin:["http://127.0.0.1:8081"],
    credentials:true
}));
//4.2:post  req.body.uname
app.use(bodyParser.urlencoded({extended:false}));
 //4.3:cookie/session
app.use(cookieParser());
app.use(expressSession({
   resave:false,           //每次请求是否重新设置session
   saveUninitialized:true,//每次请求是否设置cookie
   secret:"teducn",       //https加密码传输，密钥
}));
//查询用户
app.use("/userList",(req,res)=>{
    let pid=res.query.pid;
    let sql="SELECT pid FROM userList WHERE pid=?";
    pool.query(sql,[pid],(err,result)=>{
        if(err)throw err;
        if(result.length>0)
            res.send({code:1,msg:"登录成功"});
        else{
            let sql1="INSERT INTO userList VALUES(null,?,?,?,?)"
            pool.query(sql1,[pid],(err,result)=>{
                if(err)throw err;
            });
        }
    });
});

