import axis from 'axios'
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'
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
tools.isNumber=(val)=>{
  if (parseFloat(val).toString() == "NaN") {
    return false;
  } else {
    return true;
}
}
tools.sleep=(time)=>{
  return new Promise((resolve) => setTimeout(resolve, time));
}

tools.isNull=(value)=>{
    if (!value && typeof value != "undefined" && value != 0) {
        return true;
    } else {
        return false;
    }
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
          console.log(response)
          resolve(response.data)
          let blob = new Blob([response.data], {
            type: response.data.type
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
  tools.downloadPdf= (target,name)=> {
    //let target = this.$refs[exportdiv]
    
    html2canvas(target, {
        useCORS: true, // 当图片是链接地址时，需加该属性，否组无法显示图片
        "imageTimeout": 0,
        'scale': 1,
        "width": target.clientWidth,
        "height": target.clientHeight,
      })
        .then(canvas => {
          console.log(canvas)
          let contentWidth = canvas.width; // 592px
          let contentHeight = canvas.height; // 841px
          //一页pdf显示html页面生成的canvas高度;
          let pageHeight = contentWidth / 592 * 841;
          //未生成pdf的html页面高度
          let leftHeight = contentHeight;
          //页面偏移
          // let offsetX = 100;
          // let offsetY = 100;
          let offsetX = 0;
          let offsetY = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          let imgWidth = 592;
          //let imgWidth = 592 - 2 * offsetX;//边框留白
          let imgHeight = imgWidth / contentWidth * contentHeight;
          let pageData = canvas.toDataURL('image/jpeg', 1.0);

          // 第一个方向,第二个单位,第三个尺寸格式
          // landscape横向
          // let pdf = new jspdf('landscape', 'pt', 'a4');
          let pdf = new jspdf('', 'pt', 'a4');

          //有两个高度需区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if(leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while(leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', offsetX, offsetY, imgWidth, imgHeight)
              leftHeight -= pageHeight;
              offsetX -= 592;
              offsetY -= 841;
              //避免添加空白页
              if(leftHeight > 0) {
                pdf.addPage();
              }
            }
          }
          // let name = '业绩对标.pdf'; // 定义生成的pdf的文件名字
          if(!name)
          name="对比结果。pdf"
          pdf.save(name);
        });
  }
tools.install = function (Vue, options) {
  Vue.prototype.$tools = tools
  Vue.tools = tools
}

tools.getToday = function(){
 const myDate=new Date();
var year=myDate.getFullYear()
var Day=myDate.getDate()>9?myDate.getDate().toString():'0'+myDate.getDate();
var Month=myDate.getMonth()+1>9?(myDate.getMonth()+1).toString():'0'+(myDate.getMonth()+1);
return ''+year+Month+Day;
}

tools.showName=function(code,sysparam){
  for (var item of sysparam.FOF){
      if (code==item['code']){
        return item['value']
      }
  }
  return ""
},
tools.JsonSort=(jsonData)=> {
  try {
    let tempJsonObj = {};
    let sdic = Object.keys(jsonData).sort();
    sdic.map((item, index)=>{
      tempJsonObj[item] = jsonData[sdic[index]]
    })
    console.log('将返回的数据进行输出',tempJsonObj);
    return tempJsonObj;
  } catch(e) {
    return jsonData;
  }
}

tools.isElectron = ()=>{
  return window && window.process && window.process.versions && window.process.versions['electron'];
}
export default tools