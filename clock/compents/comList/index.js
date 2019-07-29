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
    plList:[],//评论列表
    imgList:[]
  },
  /**
   * 组件的方法列表
   */
  methods: {
   /*获取评论*/
    getPlList:function(){
      wx.request({
        url:app.globalData.serveUrl+"/plList",
        success:(res)=>{
            let lists=res.data.data;
            for(let li of lists){
              li.ptime=utils.getTimeUntilNow(new Date().getTime()-li.ptime);
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
            let imgs=[];
            for(let m of res.data.data){
              imgs.push(app.globalData.serveUrl+m.cimgUrl);
            }
            list.push(imgs);
            this.setData({
              imgList:list
            });
            console.log(this.data.imgList,imgs);
        }
      });
    },
    /*图片全屏*/
    imgFull:function(e){
      let url=e.target.dataset.imgUrl;
      let pid=e.target.dataset.id;
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: this.data.imgList[pid] // 需要预览的图片http链接列表
      })
    }      
  },
  attached:function(){
       this.getPlList(this);
  }
})
