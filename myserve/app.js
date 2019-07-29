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
//上传中间件
const multer = require("multer");
const upload = multer({
    dest:"public/upload"//上传文件存放路径
});
//创建文件 删除文件 修改文件 *移动*文件 ..
const fs = require("fs");
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
    //console.log(openId);
    let sql="SELECT * FROM userList WHERE openId=?";
    pool.query(sql,[openId],(err,result)=>{
        if(err)throw err;
        //console.log(result[0]);
        if(result.length>0)
            res.send({code:1,msg:"登录成功",data:result[0]});
        else{
            res.send({code:-1,msg:"用户不存在"});
        }
    });
});
//注册用户
app.post("/postInfo",(req,res)=>{
    let openId=req.body.openId;
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
const singleMidle = upload.single("singleFile");//一次处理一张
//上传单个文件
app.post("/upload",singleMidle,(req,res)=>{
    //console.log(req.file);
    var src = req.file.originalname;
    var i3 = src.lastIndexOf(".");
    var suff = src.substring(i3);  //源文件名后缀 .jpg
    //9.2:创建时间毫秒数
    var ftime = new Date().getTime();
    //9.3:创建随机数
    var fran = Math.floor(Math.random()*9999);
    //9.4:创建新文件名 upload/毫秒数+随机数+后缀名
    var des = "./public/upload/"+ftime+fran+suff;
    //9.5:将临时文件修改名称移动 新文件名
    //修改名称并且移动文件 (原先文件,目标新文件名)
    fs.renameSync(req.file.path,des);
    var desPath="./upload/"+ftime+fran+suff;
    //10:将临时文件移动upload目录下  15:58
    res.send({code:1,msg:"上传文件成功",path:desPath});
});

//添加图片
app.get("/addImg",(req,res)=>{
    let pid=req.query.pid;
    let cimgUrl=req.query.cimgUrl;
    //console.log(pid,cimgUrl);
    let sql="INSERT INTO clockImg VALUES(null,?,?)";
    pool.query(sql,[pid,cimgUrl],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0)
            res.send({code:1,msg:"添加成功"});
        else{
            res.send({code:-1,msg:"添加失败"});
        }
    });
});
//添加视频
app.get("/addVideo",(req,res)=>{
    let pid=req.query.pid;
    let cvideoUrl=req.query.cvideoUrl;
    let sql="INSERT INTO clockVideo VALUES(null,?,?)";
    pool.query(sql,[pid,cvideoUrl],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0)
            res.send({code:1,msg:"添加成功"});
        else{
            res.send({code:-1,msg:"添加失败"});
        }
    });
});
//添加音频
app.get("/addAudio",(req,res)=>{
    let pid=req.query.pid;
    let caudioUrl=req.query.caudioUrl;
    let sql="INSERT INTO clockAudio VALUES(null,?,?)";
    pool.query(sql,[pid,caudioUrl],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0)
            res.send({code:1,msg:"添加成功"});
        else{
            res.send({code:-1,msg:"添加失败"});
        }
    });
});
//添加评论
app.get("/addComment",(req,res)=>{
    let uid=req.query.uid;
    let ptext=req.query.ptext;
    let place=req.query.place;
    let state=req.query.state;
    let time=new Date().getTime();
    console.log(time,new Date());
    let warp=[uid,time,ptext,place,state];
    let pid=0;
    let sql="INSERT INTO plList VALUES(null,?,?,?,?,?)";
    pool.query(sql,warp,(err,result)=>{
        if(err)throw err;
        console.log(result);
        if(result.affectedRows>0)
            res.send({code:1,msg:"发布成功",pid:result.insertId});
        else{
            res.send({code:-1,msg:"发布失败"});
        }
    });
});
//评论列表
app.get("/plList",(req,res)=>{
    let sql="SELECT p.pid,p.ptime,p.ptext,p.place,p.state,v.cvideoUrl,a.caudioUrl,u.pname,u.purl FROM plList p LEFT JOIN  clockVideo v ON p.pid=v.pid  LEFT JOIN clockAudio a ON p.pid=a.pid LEFT JOIN userList u ON p.uid=u.uid";
    pool.query(sql,(err,result)=>{
        if(err)throw err;
        //console.log(result);
        res.send({code:1,msg:"查询成功",data:result});
    });
});
//评论图片
app.get("/findImg",(req,res)=>{
    let pid=req.query.pid;
    let sql="SELECT cid,cimgUrl FROM clockImg WHERE pid=?";
    pool.query(sql,[pid],(err,result)=>{
        if(err)throw err;
        console.log(result,pid);
        res.send({code:1,msg:"查询成功",data:result});
    });
});
//评论视频
app.get("/findVideo",(req,res)=>{
    let pid=req.query.pid;
    let sql="SELECT cid,cvideoUrl FROM clockVideo WHERE pid=?";
    pool.query(sql,[pid],(err,result)=>{
        if(err)throw err;
        //console.log(result);
        res.send({code:1,msg:"查询成功",data:result});
    });
});
//评论音频
app.get("/findAudio",(req,res)=>{
    let pid=req.query.pid;
    let sql="SELECT cid,caudioUrl FROM clockAudio WHERE pid=?";
    pool.query(sql,[pid],(err,result)=>{
        if(err)throw err;
        //console.log(result);
        res.send({code:1,msg:"查询成功",data:result});
    });
});
