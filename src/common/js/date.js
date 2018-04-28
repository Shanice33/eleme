export function formatDate (date, fmt) {
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for(let i in o){
    let reg = new RegExp(`(${i})`);
    if(reg.test(fmt)){
      let str = o[i] + '';
      // 根据传入的fmt格式决定表现表现形式，若RegExp.$1.length为2，则需要对小于10的数前面补零；
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : paddingZero(str));
    }
  }
  return fmt;
}
function paddingZero (str) {
  return ('00' + str).substr(str.length);
}
