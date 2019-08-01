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
    plList: [],//说说列表
    imgList: [],//图片列表
    plCount:1,//页码
    fabList:[],//获赞列表
    fabNumList:[],//获赞数
    replyList:[]//回复
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init:function(){
      this.setData({
        plList: [],//说说列表
        imgList: [],//图片列表
        plCount:1,//页码
        fabList:[],//获赞列表
        replyList:[]//回复
      })
    },
   /*获取评论*/
    getRef:function(){
      this.init();
      this.getPlList(); 
    },
    getPlList:function(){
       //显示加载动画
      wx.showLoading({
       title:"正在努力加载数据..."
      });
      wx.request({
        url:app.globalData.serveUrl+"/plList",
        data:{pno:this.data.plCount},
        success:(res)=>{
            let plList=this.data.plList; 
            let lists=res.data.data;
            if(lists.length!==0){
              this.setData({
                plCount:this.data.plCount+1
              });
            }
            for(let li of lists){
              li.ptime=utils.getTimeUntilNow(new Date().getTime()-li.ptime);
              li.caudioUrl!==null?li.caudioUrl=app.globalData.serveUrl+li.caudioUrl:"";
              this.getImg(li);
              plList.push(li);
            }
            this.setData({
              plList:plList
            }); 
            //卸载动画
          setTimeout(function(){
            wx.hideLoading();
          },500);
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
          //console.log(pid, imgs);
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
    },
    /*下拉加载 */
    loadMore:function(e){
      this.getPlList();
    },
    loadPullMore:function(e){
      this.getRef();
    }
  },
  attached:function(){
       this.init();
       this.getPlList();
  }
})
