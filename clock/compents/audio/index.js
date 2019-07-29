// compents/audio/index.js
const util=require("../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    audioFile:{//录音文件
      type:"Object",
      value:null,
      observer:function(newVal, oldVal){
        console.log(1,newVal);
        if(newVal===null)
          return;
        this.setData({
          duration:util.formatSeconds(newVal.duration/1000.0),
        });
      }
    },
    crossEnable:{
      type:"Boolean",
      value:true
    }   
  },

  /**
   * 组件的初始数据
   */
  data: {
    rmStop:true,//暂停
    secondes:0,//时长
    rmTimes:"00.00",//现在时长
    duration:"00.00",//总时长
    audioPlay:null//录音实例化
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //音频播放
    audioPlay:function(){
      console.log(this.data.audioPlay);
      if(this.data.audioPlay===null){
        let innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = this.data.audioFile.tempFilePath;
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
          util.Countdown(that);
        })
        innerAudioContext.onError((res) => {
          //console.log(res.errMsg)
          //console.log(res.errCode)
        })
        innerAudioContext.onEnded((res) => {
          console.log('播放结束!',res);
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
      console.log("a");
      if(this.data.audioPlay!==null)
        this.data.audioPlay.destroy();
      this.setData({
        rmStop:true,
        rmTimes:"00.00",
        audioPlay:null,
        secondes:0,
        audioFile:null
      });
      this.triggerEvent('audioCross', { audioFile:this.data.audioFile});
    },
    //音频进度条拖动
    changeSlide:function(e){
      if(this.data.rmStop===false){
        let value=e.detail.value;
        this.setData({
          secondes:value
        });
        this.data.audioPlay.seek(value);
      }
    },
  }
})
