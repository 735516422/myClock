// pages/comment/comment.js
const app=getApp();
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
        this.Countdown(that);
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
        rmStop:true,
        duration:this.formatSeconds(res.duration/1000.0),
        rmTimes:"00.00",
        RM:null,
        secondes:0
      });
    });
  },
  //音频播放
  audioPlay:function(){
    if(this.data.audioPlay===null){
      let innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.src = this.data.audio.tempFilePath;
      innerAudioContext.play();
      this.setData({
        audioPlay:innerAudioContext,
        rmStop:false
      });
      this.setData({
        secondes:0
      });
      let that=this;
      innerAudioContext.onPlay(() => {
        this.Countdown(that);
      })
      innerAudioContext.onError((res) => {
        //console.log(res.errMsg)
        //console.log(res.errCode)
      })
      innerAudioContext.onEnded((res) => {
        //console.log('播放结束!',res);
        this.data.audioPlay.destroy();
        this.setData({
          rmStop:true,
          rmTimes:"00.00",
          audioPlay:null,
          secondes:0
        });
      })
    }else{
      this.audioPause();
    }
  },
  //音频暂停
  audioPause:function(){
    this.setData({
      rmStop: !this.data.rmStop
    });
    this.data.rmStop===true?this.data.audioPlay.pause():this.data.audioPlay.play();
  },
  //音频关闭
  audioCross:function(){
    if(this.data.audioPlay!==null)
      this.data.audioPlay.destroy();
    this.setData({
      rmStop:true,
      rmTimes:"00.00",
      audioPlay:null,
      secondes:0,
      audio:null
    });
  },
  //音频进度条拖动
  changeSlide:function(e){
    let value=e.detail.value;
    this.setData({
      secondes:value
    });
    this.data.audioPlay.seek(value);
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
    wx.request({
      url:app.globalData.serveUrl+"/addAudio",
      data:{pid,caudioUrl},
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
  // 倒计时
  Countdown:function (that) {
    setTimeout(function() {
      let secondes=that.data.secondes;
      //console.log("----secondes----" + that.formatSeconds(secondes));
      if (!that.data.rmStop){
        secondes++;
        that.setData({
          secondes:secondes
        });
        if(that.data.audio!==null){
          //console.log(that.data.audio.duration/1000);
          if(secondes>=parseInt(that.data.audio.duration/1000)){
            //that.audioStop();
          }
        }else{
          if(secondes>=600){
            that.recorderSuccess();
          }  
        }
        that.setData({
          rmTimes: that.formatSeconds(secondes)
        });
        that.Countdown(that, secondes);
      };
    }, 1000);
  },
  formatSeconds:function (value) {
    var secondTime = parseInt(value); // 秒
    var minuteTime = 0; // 分
    var hourTime = 0; // 小时
    if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    var result;
    //时间的展示方式为00:00
    if(secondTime<10){
        result = "0" + parseInt(secondTime);
    }else{
      result = "" + parseInt(secondTime);
    }
    if (minuteTime > 0) {
      if (minuteTime<10){
        result = "0" + parseInt(minuteTime) + ":" + result;
      }else{
        result = "" + parseInt(minuteTime) + ":" + result;
      }
    }else{
        result = "00:" + result;
    }
    //由于限制时长最多为三分钟,小时用不到
    if (hourTime > 0) {
        result = "" + parseInt(hourTime) + ":" + result;
    }
    return result;
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