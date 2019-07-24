const pool =require("./pool");
const express = require("express");
const bodyParser = require("body-parser");        //处理post请求
//const cookieParser = require("cookie-parser");    //session
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
    origin:["http://127.0.0.1:8080",
        "http://localhost:8080"],
    credentials:true
}));
//4.2:post  req.body.uname
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 //4.3:cookie/session
//app.use(cookieParser());
app.use(expressSession({
   resave:false,           //每次请求是否重新设置session
   saveUninitialized:true,//每次请求是否设置cookie
   secret:"teducn",       //https加密码传输，密钥
}));
//查询用户
app.get("/userList",(req,res)=>{
    let openId=req.query.openId;
    console.log(openId);
    let sql="SELECT * FROM userList WHERE openId=?";
    pool.query(sql,[openId],(err,result)=>{
        if(err)throw err;
        if(result.length>0)
            res.send({code:1,msg:"登录成功",data:result.data});
        else{
            res.send({code:-1,msg:"用户不存在"});
        }
    });
});
//注册用户
app.post("/postInfo",(req,res)=>{
    let openId=req.body.openId;
    console.log(1,req.body,req.query);
    let pname=req.body.pname;
    let purl=req.body.purl;
    let age=parseInt(req.body.age);
    let uadress=req.body.uadress;
    let warp=[openId,pname,purl,age,uadress];
    let sql="INSERT INTO userList VALUES(null,?,?,?,?,?)";
    pool.query(sql,warp,(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0)
            res.send({code:1,msg:"登记成功"});
        else{
            res.send({code:-1,msg:"登记失败"});
        }
    });
});
