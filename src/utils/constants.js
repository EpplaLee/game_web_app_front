const api = '192.168.0.2:5000';

function getQueryString(key){
  var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}
//用法：
//getQueryString('arg')
//getQueryString('test')

export { api, getQueryString }
