// compents/comList/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    time: "",
    imgList: ["/pages/tabs/contact-active.png", "/pages/tabs/contact-active.png"]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /*获取用户信息*/
    isUserInfo: function (userInfo) {
      this.setData({
        userInfo:userInfo
      })
    },
    isTime:function(DATE){
      this.setData({
        time:DATE
      });
    }
  }
})
