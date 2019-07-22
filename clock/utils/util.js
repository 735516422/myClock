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
module.exports = {
  formatTime: formatTime,
  getTimeUntilNow:getTimeUntilNow
}
