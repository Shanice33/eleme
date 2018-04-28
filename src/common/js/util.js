/**
* 解析url参数；
* @example ?id=12345&a=b
* @return Object {id: 12345, a: b}
 */

export function urlParse (){
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg); // ['?id=12345', '&a=b'],若匹配不上返回null;
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substr(1).split('=');
      // 对于url参数都要使用decodeURIComponent()方法；
      let key = decodeURIComponent(tempArr[0]);
      let value = decodeURIComponent(tempArr[1]);
      obj[key] = value;
    });
  }
  return obj;
}
