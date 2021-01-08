import axis from 'axios'
var tools = {}
tools.formatMoney=(number, decimals = 0, decPoint = ".", thousandsSep = ",")=>{
    if (null == number)
    return '' 

number = (number + "").replace(/[^0-9+-Ee.]/g, "");
let n = !isFinite(+number) ? 0 : +number;
let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
let sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
let dec = typeof decPoint === "undefined" ? "." : decPoint;
let s = "";
let toFixedFix = function (n, prec) {
  let k = Math.pow(10, prec);
  return "" + Math.ceil(n * k) / k;
};
s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
let re = /(-?\d+)(\d{3})/;
while (re.test(s[0])) {
  s[0] = s[0].replace(re, "$1" + sep + "$2");
}
if ((s[1] || "").length < prec) {
  s[1] = s[1] || "";
  s[1] += new Array(prec - s[1].length + 1).join("0");
}
return s.join(dec);
},
tools.pandasToJson=(pd)=>{
    var result = [];
    for (var idx in pd.data) {
      var dv = pd.data[idx];
      var row = {};
      for (var ci in pd.columns) {
        row[pd.columns[ci]] = dv[ci];
      }
      result.push(row);
    }
    console.log(result);
    return result;
  },
tools.checkModi= (modi,orig)=>{
    console.log(modi)
    console.log(orig)
    var result={}
    for(var i in  modi){
        console.log(modi[i])
        if(modi[i]!=orig[i])
        {
            console.log(i)
            result[i]=modi[i]
        }
    }
    return result
}
tools.exportExcel = (url, options)=>{
    return new Promise((resolve, reject) => {
      console.log(`${url} 请求数据，参数=>`, JSON.stringify(options))
      axis.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
      axis({
        method: 'post',
        url: url, // 请求地址
        data: options, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then(
        response => {
          resolve(response.data)
          let blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          console.log(blob)
          let fileName = Date.parse(new Date()) + '.xlsx'
          if (window.navigator.msSaveOrOpenBlob) {
            // console.log(2)
            navigator.msSaveBlob(blob, fileName)
          } else {
            // console.log(3)
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          }
        },
        err => {
          reject(err)
        }
      )
    })
  }
tools.install = function (Vue, options) {
  Vue.prototype.$tools = tools
  Vue.tools = tools
}
export default tools