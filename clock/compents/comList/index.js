// compents/comList/index.js
const app=getApp();
const utils=require("../../utils/util");
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
    plList:[],//评论列表
    imgList:[]
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
    },
    getPlList:function(){
      wx.request({
        url:app.globalData.serveUrl+"/plList",
        success:(res)=>{
            let lists=res.data.data;
            for(let li of lists){
                li.ptime=utils.getTimeUntilNow(li.ptime);
                this.getImg(li);
            }
           this.setData({
              plList:lists
            });     
        }
      });
    },
    getImg:function(li){
      let pid=li.pid;
      wx.request({
        url:app.globalData.serveUrl+"/findImg",
        data:{pid},
        success:(res)=>{
            let list=this.data.imgList;
            for(let m of res.data.data){
                m.cimgUrl=app.globalData.serveUrl+m.cimgUrl;
            }
            list.push(res.data.data);
            this.setData({
              imgList:res.data.data
            });
            console.log(res.data.data,this.data.imgList);
        }
      });
    }
  },
  attached:function(){
       this.getPlList(this);
  }
})
