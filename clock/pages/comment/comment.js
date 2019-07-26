// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",//评论内容
    imgSrc:[],//发布图片
    videoSrc:"",//视频  
    locationName:"",//地址
    timer:null,//定时器
    rmStop:false,//暂停
    RM:null,//录音
    rmTimes:"00.00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
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
        console.log(res);
        let paths=res.tempFilePath;
        _this.setData({
          videoSrc:paths
        })
        console.log(1,_this.data.videoSrc);
        console.log(2,paths);
      }
    })
  },
  //获取位置
  locationShow:function(){
    var _this = this
    wx.chooseLocation({
      success(res) {
        console.log(res);
        _this.setData({
          locationName:res.name
        })
      }
    })
  },
  //录音
  recorderShow:function(){
    this.setData({
      RM:wx.getRecorderManager()
    })
    let option = {
      duration:10000,     //录音的时长，之前最大值好像只有1分钟，现在最长可以录音10分钟
      format:'mp3',         //录音的格式，有aac和mp3两种   
    }
    let secondes=0;
    let that=this;
    this.data.RM.start(option);//开始录音   这么写的话，之后录音得到的数据，就是你上面写得数据。
    this.data.RM.onStart(()=>{
        console.log('录音开始事件');    //这个方法是录音开始事件，你可以写录音开始的时候图片或者页面的变化
        this.Countdown(that,secondes);
    })
  },
  recorderStop:function(){
    this.setData({
      rmStop: !this.data.rmStop
    });
    this.data.RM.pause();
  },
  recorderCancel:function(){
    this.data.RM.stop();
    this.setData({
      rmStop:false,
      RM:null,
      rmTimes:"00.00"
    });
  },
  // 倒计时
  Countdown:function (that,secondes) {
    let timer = setTimeout(function() {
    console.log("----secondes----" + that.formatSeconds(secondes));
    if (!that.data.rmStop){
      secondes++;
      if(secondes>=600){
        that.data.RM.stop();
      }
      that.setData({
        rmTimes: that.formatSeconds(secondes)
      });
    }
      that.data.RM !== null && that.Countdown(that, secondes);
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