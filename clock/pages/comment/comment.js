// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    imgSrc:[],
    videoSrc:[],
    locationName:""
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
        console.log(paths)
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
  //获取视频
  videoShow:function(){
    var _this = this
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        let paths=_this.data.videoSrc;
        paths.push.apply(paths,res.tempFilePaths);
        console.log(paths)
        _this.setData({
          videoSrc:paths
        })
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