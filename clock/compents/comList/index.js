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
    fabNameList:[],//获赞列表名称
    fabNumList:[],//获赞数
    replyList:[],//回复
    myReplyEnable:false//显示评论框
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
        fabNameList:[],//获赞列表名称
        replyList:[]//回复
      })
      let init=this.data.plList;
      console.log("init",init);
    },
    getEnable:function(){
      this.setData({
        myReplyEnable:true
      });
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
      let init=this.data.plList;
      console.log("init1",init);
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
              this.getFab(li);
              plList.push(li);
            }
            this.setData({
              plList:plList
            }); 
            //卸载动画
          setTimeout(function(){
            wx.hideLoading();
          },500);
          console.log(this.data.fabList);
        }
      });
    },
    /*获取图片 */
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
    //点赞列表
    getFabName:function(pid,id){
      wx.request({
        url:app.globalData.serveUrl+"/fabNameList",
        data:{pid},
        success:(res)=>{
            let list=this.data.fabNameList;
            let name="";
            if(res.data.code==1){
              for(let m of res.data.data){
                name=name+m.pname+",";
              }
              name=name.slice(0,name.length-1);
            }
            if(id==-1)
              list.push(name);
            else
             list[id]=name;
            this.setData({
              fabNameList:list
            });
            //console.log("name",this.data.fabNameList);
        }
      });
    },
    //赞
    getFab:function(li){
      let pid=li.pid;
      let uid=wx.getStorageSync("logInfo").userInfo.data.uid;
      wx.request({
        url:app.globalData.serveUrl+"/fabList",
        data:{pid,uid},
        success:(res)=>{
            let list=this.data.fabList;
            if(res.data.code==1)
              list.push(1);
            else
              list.push(0);
            this.setData({
              fabList:list
            });
        }
      });
      this.getFabName(pid,-1);
    },
    //点赞
    setFab:function(e){
      let id=e.currentTarget.dataset.id;
      let pid=e.currentTarget.dataset.pid;
      let uid=wx.getStorageSync("logInfo").userInfo.data.uid;
      let fabList=this.data.fabList;
      let url="/addFab";
      if(fabList[id]==1)
        url="/delFab";
      wx.request({
        url:app.globalData.serveUrl+url,
        data:{pid,uid},
        success:(res)=>{
          wx.showToast({
            title:res.data.msg,
            icon: 'none'
          });
          fabList[id]=res.data.code;
          this.setData({
            fabList:fabList
          });  
          this.getFabName(pid,id);
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
      console.log("下拉");
      this.getPlList();
    },
    loadPullMore:function(e){
      console.log("上啦");
      this.getRef();
    }
  },
  created:function(){
    console.log("刷新");
       this.getRef();
  }
})
