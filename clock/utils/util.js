//转换时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//离现在多久
const getTimeUntilNow=diffValue=>{
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var result="";
  var month = day * 30;
  if(diffValue < 0){return;}
  var monthC =diffValue/month;
  var weekC =diffValue/(7*day);
  var dayC =diffValue/day;
  var hourC =diffValue/hour;
  var minC =diffValue/minute;
  if(monthC>=1){
      result="" + parseInt(monthC) + "月前";
  }
  else if(weekC>=1){
      result="" + parseInt(weekC) + "周前";
  }
  else if(dayC>=1){
      result=""+ parseInt(dayC) +"天前";
  }
  else if(hourC>=1){
      result=""+ parseInt(hourC) +"小时前";
  }
  else if(minC>=1){
      result=""+ parseInt(minC) +"分钟前";
  }else
      result="刚刚";
  return result;
}
// 倒计时
const Countdown=function (that) {
  setTimeout(function() {
    let secondes=that.data.secondes;
    //console.log("----secondes----" + that.formatSeconds(secondes));
    if (!that.data.rmStop){
      secondes++;
      that.setData({
        secondes:secondes
      });
      if(that.data.audioFile!==null){
        //console.log(that.data.audio);
        if(secondes>=parseInt(that.data.audioFile.duration/1000)){
          //that.audioStop();
        }
      }else{
        if(secondes>=600){
          that.recorderSuccess();
        }  
      }
      that.setData({
        rmTimes: formatSeconds(secondes)
      });
      Countdown(that, secondes);
    };
  }, 1000);
}
const formatSeconds=function (value) {
  var secondTime = parseInt(value); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result;
  //时间的展示方式为00:00
  if(secondTime<10){
      result = "0" + parseInt(secondTime);
  }else{
    result = "" + parseInt(secondTime);
  }
  if (minuteTime > 0) {
    if (minuteTime<10){
      result = "0" + parseInt(minuteTime) + ":" + result;
    }else{
      result = "" + parseInt(minuteTime) + ":" + result;
    }
  }else{
      result = "00:" + result;
  }
  //由于限制时长最多为三分钟,小时用不到
  if (hourTime > 0) {
      result = "" + parseInt(hourTime) + ":" + result;
  }
  return result;
}
module.exports = {
  formatTime: formatTime,
  getTimeUntilNow:getTimeUntilNow,
  formatSeconds:formatSeconds,
  Countdown:Countdown
}
