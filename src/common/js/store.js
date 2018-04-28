// 实现本地存储和读取（localStorage只在浏览器环境有效，需要用window.localStorage指明）

export function saveToLocal (id, key, value) {
  // 将所有与本项目相关的数据存放在__seller__中；LocalStorage存储的是JSON字符串，在对其操作时要转换为对象操作,存储时换位JSON字符串；
  // 其数据结构为将所有商家存在一个对象中，而每个商家是一个以id为键的对象，该商家的数据以键值存放；
  let seller = window.localStorage.__seller__;
  if(!seller){
    seller = {};
    seller[id] = {};
  }else{
    seller = JSON.parse(seller);
    if(!seller[id]){
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};
// 获取数据时，先看有没有这个数据集seller，再看有没有这个商家，最后看有没有这个key;
// def是默认值;
export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__;
  if(!seller){
    return def;
  }
  seller = JSON.parse(seller)[id];
  if(!seller){
    return def;
  }
  let ret = seller[key];
  return ret || def;
}
