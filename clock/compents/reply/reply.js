// compents/reply/reply.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myEnable:{
      type:Boolean,
      value:false
    },
    replyObject:{
      type:Object,
      value:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    repValue:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isEnable:function(){
      console.log("enable");
      this.setData({
        myEnable:true
      });
    },
    getEnable:function(){
      console.log("isenable");
      /*this.setData({
        myEnable:false
      });*/
    },
    valChange:function(e){
      let value=e.detail.value;
      this.setData({
        repValue:value
      });
    },
    addReply:function(){
      let value=this.data.repValue;
      console.log(value);
      if(value===""){
        wx.showToast({
          title: '内容不能为空',
          icon: "none",
          duration: 2000
        })
      }else{
        let pid=this.data.replyObject.pid;
        let uid=wx.getStorageSync("logInfo").userInfo.data.uid;
        let repUid=this.data.replyObject.uid;
        let value=this.data.repValue;
        wx.request({
          url:app.globalData.serveUrl+"/addReply",
          data:{pid,uid,repUid,repUid,value},
          success:(res)=>{
              console.log(res);
          }
        })
      }
    }
  }
})
