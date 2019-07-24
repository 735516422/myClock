//index.js
//获取应用实例
var util=require("../../utils/util");
const app = getApp()

Page({
  data: {
    userInfo: {},
    serveUrl:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getCompont:function(){   
    if(this.data.hasUserInfo){
      wx.showLoading({
        title:"正在努力加载数据..."
      });
      this.myComlist=this.selectComponent("#myComlist");
      this.myComlist.isUserInfo(this.data.userInfo);
      let i=new Date().getTime()-new Date("2019/7/20").getTime();
      let DATE = util.getTimeUntilNow(i);
      this.myComlist.isTime(DATE);
      this.findInfo();
    }
  },
  findInfo:function(){
    if(wx.getStorageSync("logInfo").code==1)
    {
      console.log(wx.getStorageSync("logInfo"));
      wx.request({
      url:this.data.serveUrl+"/userList",
      data:{openId:wx.getStorageSync("user").openid},
      success:(res)=>{
          if(res.data.code==-1){
              this.postInfo();
          }else{
            var obj={};
            obj.userInfo=res.data;
            obj.code=1;
            wx.setStorageSync("logInfo",obj);
            //卸载动画
          setTimeout(function(){
            wx.hideLoading();
          },500);
          }
        }
     });
    }
  },
  postInfo:function(){
    let warp=[];
    warp[0]=wx.getStorageSync("user").openid;
    warp[1]=this.data.userInfo.nickName;
    warp[2]=this.data.userInfo.avatarUrl;
    warp[3]=this.data.userInfo.gender;
    warp[4]=this.data.userInfo.province;
    wx.request({
      url:this.data.serveUrl+"/postInfo",
      data:{openId:warp[0],pname:warp[1],purl:warp[2],age:warp[3],uadress:warp[4]},
      method:"POST",
      success:(res)=>{
          if(res.data.code==1){
            var obj={};
            obj.userInfo=res.data;
            obj.code=1;
            wx.setStorageSync("logInfo",obj);
            //卸载动画
          setTimeout(function(){
            wx.hideLoading();
          },500);
          }
      }
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.getCompont();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.getCompont();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.getCompont();
        }
      })
    }
    this.setData({
      serveUrl:app.globalData.serveUrl
    })
    this.getCompont();  
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
