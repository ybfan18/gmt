import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const setCookie = (name, value, expiryDate) => {//参数：cookie的key、cookie的value、存储时间
  let currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + expiryDate)
  document.cookie = name + '=' + value + '; expires=' + currentDate  //注意；和expires之间有一个空格
}
export const getCookie = (name, value, expiryDate) => {
  let arr = document.cookie.split('; ')//注意分号后面有一个空格
  for (let i = 0; i < arr.length; i++) {
    let arr2 = arr[i].split('=')
    if (arr2[0] == name) {
      return arr2[1]
    }
  }
  return ''
}
export const removeCookie = (name) => {
  setCookie(name, 1, -1)
}

//正则校验密码长度8-20
export const passwordReg = /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/;

//正则校验邮箱格式
export const eamilReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

//验证码中英文提示消息
export const codeMsgCN = '验证码发送成功';
export const codeMsgEN = 'Captcha code sent successfully';

//周几汉化转换
export const weeksCN = (item) => {
  switch (item) {
    case '1':
      return '周一';
    case '2':
      return '周二';
    case '3':
      return '周三';
    case '4':
      return '周四';
    case '5':
      return '周五';
    case '6':
      return '周六';
    case '0':
      return '周日';
  }
}
//周几英语转换
export const weeksEN = (item) => {
  switch (item) {
    case '1':
      return 'Monday';
    case '2':
      return 'Tuesday';
    case '3':
      return 'Wednesday';
    case '4':
      return 'Thursday';
    case '5':
      return 'Friday';
    case '6':
      return 'Saturday';
    case '0':
      return 'Sunday';
  }
}
/**
* 获取距离当前时间的时间长度
* @param {Number} time     - 要转换的时间参数
* @returns {String}
*/
export const simplyToRelativeTime = (time) => {
  let timestamp = tiem.getTime();//将时间转换成时间戳
  let currentUnixTime = Math.round((new Date()).getTime() / 1000);       // 当前时间的秒数
  let deltaSecond = currentUnixTime - parseInt(timestamp, 10);            // 当前时间与要转换的时间差（ s ）
  let result;

  if (deltaSecond < 60) {
    result = deltaSecond + '秒前';
  } else if (deltaSecond < 3600) {
    result = Math.floor(deltaSecond / 60) + '分钟前';
  } else if (deltaSecond < 86400) {
    result = Math.floor(deltaSecond / 3600) + '小时前';
  } else {
    result = Math.floor(deltaSecond / 86400) + '天前';
  }
  return result;
}

/**
 * 转换文件大小
 * fileSize   文件大小
 */
export const fileSizeTransform = (fileSize) => {
  let result = ''
  if (fileSize >= 1073741824) {
    // B => GB
    result = fileSize % 1073741824 === 0 ? fileSize / 1073741824 + 'G' : Math.trunc(fileSize / 1073741824) + 'G'
  } else if (fileSize >= 1048576) {
    // B => MB
    result = fileSize % 1048576 === 0 ? fileSize / 1048576 + 'MB' : Math.trunc(fileSize / 1048576) + 'MB'
  } else if (fileSize >= 1024) {
    // B => KB
    result = fileSize % 1024 === 0 ? fileSize / 1024 + 'KB' : Math.trunc(fileSize / 1024) + 'KB'
  } else {
    result = fileSize + 'B'
  }
  return result;
}

/**
 * 空值校验
 */
export const isEmpty = (obj) => {
  if (obj == null || obj == 'undefined' || obj == '') {
    return true;
  } else {
    return false
  }
}

/**
 * 判断文本格式返回对应类型
 * type   文件类型
 */
export const mimeType = (type) => {
  if (type.toLowerCase() === 'pdf') {
    return 'application/pdf';
  } else if (type.toLowerCase() === 'html') {
    return 'text/html';
  } else if (type.toLowerCase() === 'doc') {
    return 'application/msword';
  } else if (type.toLowerCase() === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (type.toLowerCase() === 'xls') {
    return 'application/x-excel';
  } else if (type.toLowerCase() === 'xlsx') {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (type.toLowerCase() === 'ppt') {
    return 'application/vnd.ms-powerpoint';
  } else if (type.toLowerCase() === 'pptx') {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  } else if (type.toLowerCase() === 'png') {
    return 'image/png';
  } else if (type.toLowerCase() === 'txt') {
    return 'text/plain';
  } else if (type.toLowerCase() === 'jpe' || type.toLowerCase() === 'jpeg' || type.toLowerCase() === 'jpg') {
    return 'image/jpeg';
  } else if (type.toLowerCase() === 'bmp') {
    return 'image/bmp';
  } else if (type.toLowerCase() === 'gif') {
    return 'image/gif';
  } else if (type.toLowerCase() === 'rtf') {
    return 'application/rtf';
  }
}

// 本周
export const getCurrentWeek = (dataParams) => {
  //获取当前时间
  const currentDate = dataParams ? new Date(dataParams) : new Date()
  //返回date是一周中的某一天
  const week = currentDate.getDay()
  //一天的毫秒数
  const millisecond = 1000 * 60 * 60 * 24
  //减去的天数
  const minusDay = week != 0 ? week - 1 : 6
  //本周 周一
  const monday = new Date(currentDate.getTime() - minusDay * millisecond)
  //本周 周二
  const tuesday = new Date(monday.getTime() + 1 * millisecond)
  //本周 周三
  const wednesday = new Date(monday.getTime() + 2 * millisecond)
  //本周 周四
  const thursday = new Date(monday.getTime() + 3 * millisecond)
  //本周 周五
  const friday = new Date(monday.getTime() + 4 * millisecond)
  //本周 周六
  const saturday = new Date(monday.getTime() + 5 * millisecond)
  //本周 周日
  const sunday = new Date(monday.getTime() + 6 * millisecond)
  return [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
}
// 点击上一周
export const prevWeek = (times) => {
  const Time = times && times.length > 0 ? times[0] : new Date()
  let weekNum = Time.getDay()
  weekNum = weekNum == 0 ? 7 : weekNum
  let lastDate = new Date(Time.getTime() - weekNum * 24 * 60 * 60 * 1000)
  let fitstDate = new Date(
    Time.getTime() - (weekNum + 6) * 24 * 60 * 60 * 1000
  )
  let startDate = `${fitstDate.getFullYear()}-${fitstDate.getMonth() + 1 < 10
    ? '0' + (fitstDate.getMonth() + 1)
    : fitstDate.getMonth() + 1
    }-${fitstDate.getDate() < 10
      ? '0' + fitstDate.getDate()
      : fitstDate.getDate()
    }`
  let endDate = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1 < 10
    ? '0' + (lastDate.getMonth() + 1)
    : lastDate.getMonth() + 1
    }-${lastDate.getDate() < 10 ? '0' + lastDate.getDate() : lastDate.getDate()
    }`
  // return [startDate, endDate]
  return startDate;
}

//下一周
export const nextWeek = (times) => {
  const Time = times && times.length > 0 ? times[0] : new Date()
  let weekNum = Time.getDay()
  weekNum = weekNum == 0 ? 7 : weekNum

  let fitstDate = new Date(
    Time.getTime() + (7 - weekNum + 1) * 24 * 60 * 60 * 1000
  )
  let lastDate = new Date(
    Time.getTime() + (7 - weekNum + 7) * 24 * 60 * 60 * 1000
  )
  let startDate = `${fitstDate.getFullYear()}-${fitstDate.getMonth() + 1 < 10
    ? '0' + (fitstDate.getMonth() + 1)
    : fitstDate.getMonth() + 1
    }-${fitstDate.getDate() < 10
      ? '0' + fitstDate.getDate()
      : fitstDate.getDate()
    }`
  let endDate = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1 < 10
    ? '0' + (lastDate.getMonth() + 1)
    : lastDate.getMonth() + 1
    }-${lastDate.getDate() < 10 ? '0' + lastDate.getDate() : lastDate.getDate()
    }`
  // return [startDate, endDate]
  return startDate;
}

/**
 * 时间跨度
 * days   时间间隔天数
 */
export const timeSpan = (days) => {
  const Time = new Date()
  let currentTime = Time.getTime()
  days = days ? days : 7;
  let fitstDate = new Date(currentTime - days * 24 * 60 * 60 * 1000)
  let lastDate = new Date(currentTime)
  let times = {};
  times.startDate = fitstDate;
  times.endDate = lastDate;
  return times;
}
/**
 * 分割数组
 * @param {*} array    数组
 * @param {*} subGroupLengt    分割单位
 */
export const subGroupArray = (array, subGroupLength) => {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}
/**
 * 处理万级数据，并保留小数位
 * unit 相关单位位数
 * num 保留小数位数
 */
export const numberFixed = (item, unit, num) => {
  let divisor = Math.pow(10, unit)
  let itemStr = '';
  if (item) {
    itemStr = (item / divisor).toFixed(num);
    return itemStr;
  }
  return item;
}

/**
 * 将浮点数四舍五入，取小数点后2位   
 */
export const toDecimal = (x) => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 100) / 100;
  return f;
} 