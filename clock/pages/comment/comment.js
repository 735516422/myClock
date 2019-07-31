// pages/comment/comment.js
const app=getApp();
const util=require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:0,//评论Id
    postCount:0,//上传数 用来上传完成
    text:"",//评论内容
    imgSrc:[],//发布图片
    videoSrc:"",//视频  
    locationName:"",//地址
    state:0,//0:所有人可见 1：自己可见
    timer:null,//定时器
    rmStop:false,//暂停
    secondes:0,//时长
    RM:null,//录音
    rmTimes:"00.00",//现在时长
    duration:"00.00",//总时长
    audio:null,//录音文件
    audioFile: "",
    audioPlay:null//录音实例化
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //初始化
  init:function(){
    this.setData({
      text:"",//评论内容
      imgSrc:[],//发布图片
      videoSrc:"",//视频  
      locationName:"",//地址
      timer:null,//定时器
      rmStop:false,//暂停
      RM:null,//录音
      rmTimes:"00.00",//现在时长
      duration:"00.00",//总时长
      audio:null,//录音文件
      audioFile:"",
      audioPlay:null//录音实例化
    });
  },
  //获取评论
  commentText:function(e){
     this.setData({
       text:e.detail.value
     });
  },
  //删除图片
  delImg:function(e){
    let index=e.target.dataset.id;
    let imgSrc=this.data.imgSrc;
    imgSrc.splice(index,1);
    this.setData({
      imgSrc:imgSrc
    });
  },
  //获取图片
  gotoShow: function(){
    var _this = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        // success
        let paths=_this.data.imgSrc;
        paths.push.apply(paths,res.tempFilePaths);
        //console.log(paths)
        _this.setData({
          imgSrc:paths
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  //删除视频
  delvideo:function(){
    this.setData({
      videoSrc:""
    });
  },
  //获取视频
  videoShow:function(){
    var _this = this
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        let paths=res.tempFilePath;
        _this.setData({
          videoSrc:paths
        })
        //console.log(1,_this.data.videoSrc);
        //console.log(2,paths);
      }
    })
  },
  //获取位置
  locationShow:function(){
    var _this = this
    wx.chooseLocation({
      success(res) {
        _this.setData({
          locationName:res.name
        })
      }
    })
  },
  //录音
  recorderShow:function(){
    this.setData({
      RM:wx.getRecorderManager(),
      rmStop:false
    })
    let option = {
      duration:60000,     //录音的时长，之前最大值好像只有1分钟，现在最长可以录音10分钟
      format:'mp3',         //录音的格式，有aac和mp3两种   
    }
    this.setData({
      secondes:0
    });
    let that=this;
    this.data.RM.start(option);//开始录音   这么写的话，之后录音得到的数据，就是你上面写得数据。
    this.data.RM.onStart(()=>{
      util.Countdown(that);
    })
    this.data.RM.onPause((res)=>{
      //console.log(res);
    });
  },
  //录音暂停
  recorderStop:function(){
    this.setData({
      rmStop: !this.data.rmStop
    });
    this.data.rmStop===true?this.data.RM.pause():this.data.RM.resume();
  },
  //录音取消
  recorderCancel:function(){
    this.data.RM.stop();
    this.setData({
      rmStop:true,
      RM:null,
      rmTimes:"00.00"
    });
  },
  //录音完成
  recorderSuccess:function(){
    this.data.RM.stop();
    this.data.RM.onStop((res)=>{
      //console.log(res);
      this.setData({
        audio:res,
        audioFile:res.tempFilePath,
        rmStop:true,
        duration:util.formatSeconds(Math.ceil(res.duration/1000.0)),
        rmTimes:"00.00",
        RM:null,
        secondes:0
      });
    });
  },
  //关闭音频事件
  onaudioCross:function(e){
      //通过事件接收
    this.setData({
      audio: null,
      audioFile:""
    })
  },
  //上传文件
  upLoadFile:function(path,type){
    wx.uploadFile({
      url:app.globalData.serveUrl+"/upload",
      filePath:path,
      name:"singleFile",
      header:{
        "Content-Type":"multipart/form-data"
      },
      success:(res)=>{
        let data=JSON.parse(res.data);
        let path=data.path.substring(1);
        switch(type){
          case 0:{
              this.addImg(path);
          }
          break;
          case 1:{
              this.addVideo(path);
          }
          break;
          case 2:{
              this.addAudio(path);
          }
          break;
        }
      }
    });
  },
  //上传图片
  loadImg:function(){
    let imgPaths=this.data.imgSrc;
    for(let path of imgPaths){
      this.upLoadFile(path,0);
    }
    let  video=this.data.videoSrc;
    if(video!==""){
      this.upLoadFile(video,1)
    }
    if(this.data.audio!==null){
      let audioSrc=this.data.audio.tempFilePath;
      this.upLoadFile(audioSrc,2)
    }
  },
  //添加图片,
  addImg:function(path){
    let pid=this.data.pid;
    let cimgUrl=path;
    wx.request({
      url:app.globalData.serveUrl+"/addImg",
      data:{pid,cimgUrl},
      success:(res)=>{
        this.setData({
          postCount:this.data.postCount+1
        });
      }
    });
  },
  //添加视频
  addVideo:function(path){
    let pid=this.data.pid;
    let cvideoUrl=path;
    wx.request({
      url:app.globalData.serveUrl+"/addVideo",
      data:{pid,cvideoUrl},
      success:(res)=>{
        this.setData({
          postCount:this.data.postCount+1
        });
      }
    });
  },
  //添加音频
  addAudio:function(path){
    let pid=this.data.pid;
    let caudioUrl=path;
    let duration = this.data.audio.duration/1000.0;
    wx.request({
      url:app.globalData.serveUrl+"/addAudio",
      data: { pid, caudioUrl, duration},
      success:(res)=>{
        this.setData({
          postCount:this.data.postCount+1
        });
      }
    });
  },
  //添加评论
  addComment:function(){
    let uid=wx.getStorageSync("logInfo").userInfo.data.uid;
    let ptext=this.data.text;
    let place=this.data.locationName;
    let state=this.data.state;
    let videoSrc=this.data.videoSrc;
    let imgCount=this.data.imgSrc.length;
    let audio=this.data.audio;
    if(ptext===""&&imgCount===0&&videoSrc===""&&audio===null){
      wx.showToast({
        title:"内容不能为空",
        icon: 'none'
      });
    }else{
      let count=0;
      let msg;
      if(imgCount!==0)count+=imgCount;      
      videoSrc!==""&&count++;
      audio!==null&&count++;
      this.setData({
        postCount:0
      });
      wx.showLoading({
        title:"发表日记中.."
      });
      wx.request({
        url:app.globalData.serveUrl+"/addComment",
        data:{uid,ptext,place,state},
        success:(res)=>{
          this.setData({
            pid:res.data.pid
          });
          this.loadImg();
          msg=res.data.msg;
        }
      });
      let timer=setInterval(() => {
        if(count===this.data.postCount)
        {
          clearInterval(timer);
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title:msg,
            icon: 'none'
          });
          this.init();
          wx.switchTab({
            url:'/pages/index/index'
          });
        }
      }, 1000);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})