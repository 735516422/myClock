// compents/comInfo/index.js
// compents/audio/index.js
const util=require("../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    plInfo:{//评论内容
      type:Object,
      value:null,
      observer: function (newVal, oldVal) {
        console.log("newVal",newVal);
      }
    },
    imgList: {//录音文件
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})