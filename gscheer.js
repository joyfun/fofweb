const axios = require('axios');
const cheerio = require('cheerio');
// const puppeteer = require('puppeteer');
const vm = require('vm');
const  CryptoJS  = require('crypto-js')
const N0 = ["ac68!3#1", "55%g7z!@", "(^g&vd+1", "FpV94n&3", "5*cKem&2", "&35%383@", "c@di*4#!", "(&j1k9Bv", "{[d8j*c6", "O~i2&8)8"];

function Y0(e, t) {
    const a = CryptoJS.enc.Utf8.parse(t)
      , i = CryptoJS.enc.Utf8.parse(t);
    return CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(e)
    }, a, {
        iv: i,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)
}

// 目标网页的 URL
const url0 = 'https://www.licai.com/simu/product/';

const globalObj = {
  window: {},
  console: {
    log: console.log.bind(console)
  }
};
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
 
const app = express();
 
// 使用body-parser中间件来解析JSON数据
app.use(bodyParser.json()); 
// 定义一个处理POST请求的路由
app.post('/crawl/GeShang',  (req, res) => {
    // req.body  包含了POST请求的正文内容
    const now = new Date();
    console.log(now);
    console.log(req.body);

    // console.log(req.body[0]);
    // const blen=req.body.length
    // for(let i=0;i<blen;i++){
        crawlporod(req.body.pcode,req.body.code)
    // }
    // req.body.each((item) => {
    //     console.log(item['pcode']);
    // })
    // 响应客户端
    res.send(req.body.code);
});

app.post('/crawl/HuoFuNiu',  (req, res) => {
  const now = new Date();
  console.log(now);
  console.log(req.body);

  try{
  crawlHuofuNiu(req.body.id,req.body.code,req.body.token)
}catch(err){console.log(err)}
  res.send(req.body.code);

});

app.post('/crawl/cms',  (req, res) => {
  const now = new Date();
  console.log(now);
  console.log(req.body);

  try{
    crawlCms(req.body.code,req.body.token)
}catch(err){console.log(err)}
  res.send(req.body.code);

});

app.post('/crawl/amac', async  (req, res,next) => {
  const now = new Date();
  console.log(now);
  console.log(req.body);

  try{
    crawlAmac(req.body.code)
}catch(err){console.log(err)}
next(err);  

});

app.post('/crawl/evarToken',  (req, res) => {
  // req.body  包含了POST请求的正文内容
  const now = new Date();
  console.log(now);
  console.log(req.body);

  // console.log(req.body[0]);
  // const blen=req.body.length
  // for(let i=0;i<blen;i++){
  // crawlporod(req.body.pcode,req.body.code)
  // }
  // req.body.each((item) => {
  //     console.log(item['pcode']);
  // })
  // 响应客户端
  res.send(req.body.code);
});
// 启动服务器

// (async () => {
//   // 启动浏览器
//   const browser = await puppeteer.launch();
//   // 创建一个新页面
//   const page = await browser.newPage();
//   // 导航到目标 URL
//   await page.goto(url);

//   // 等待页面加载，可能需要根据实际情况调整等待条件
//   await page.waitForSelector('body');

//   // 使用 page.evaluate 访问 __NUXT__ 对象
//   const nuxtData = await page.evaluate(() => {
//     return window.__NUXT__;
//   });

//   // 打印 __NUXT__ 对象的数据
//   console.log('Nuxt Data:', nuxtData);

//   // 关闭浏览器
//   await browser.close();
// })();

function crawlAmac(code){
  purl='https://gs.amac.org.cn/amac-infodisc/api/pof/fund?&page=0&size=20'
  payload={"keywordCode":code}
  axios({
    method: 'post',
    url: purl,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
       'Content-Type': 'application/json',
    },
    data: JSON.stringify(payload)
}).then(response => {
  if (response.data['content'][0]['fundNo']==code){
    console.log(response.data['content'][0])
    curl='https://gs.amac.org.cn/amac-infodisc/api'+response.data['content'][0].substring[2]
    console.log(curl)
  }
})
}


function crawlHuofuNiu(id,code,token){
  let requrl=`https://pyapi.huofuniu.com/pyapi/fund/view?token=${token}&fid=${id}&pt=1&shareToken=`
  axios.get(requrl,{headers:{
    'Access-Token': token,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0'

  }})
  .then(response => {
let e = response.data.data;
// console.log(e)
if (e && e.fund && e.fund.prices){
let navData = e.fund.prices ? JSON.parse(Y0(e.fund.prices, N0[0])) : []
let indexData = e.index.prices ? JSON.parse(Y0(e.index.prices, N0[0])) : []
let excessData = e.fund.excess_prices ? JSON.parse(Y0(e.fund.excess_prices, N0[0])) : []
let rets=[]
const rlen=navData.length
for (let i = 0; i < rlen; i++) {
  let arow={"date":navData[i].pd.replaceAll('-',''),"netval":navData[i].nav,"sumval":navData[i].cnw,"reval":navData[i].cn,"rate":navData[i].pc}
  if (arow.rate=='-'){
    arow.rate = null;
  }
  rets.push(arow)
}
const payload={"code":code,"data":rets,"source":"HuoFuNiu"} 
// console.log(payload)
axios.post('http://192.168.0.22:3002/fof/saveorig',payload).then(res => {
  console.log(res.data)
})}
  })
}

function crawlCms(code,token){
  let requrl=`https://ifof.cmschina.com/nfof/api/report/v1.0/data/sql/a8a4bc38-d172-4760-b95b-823b3cdf983a`
  payload={"indexCode":"a8a4bc38-d172-4760-b95b-823b3cdf983a","startDate":"2010-01-01","endDate":"2024-08-12","fundCode":code,"kpiCode":"000300","contrasCode":"000300,000905","_pageSize":9999,"_pageNum":1,"_pageFlag":true}
  axios({
    method: 'post',
    url: requrl,
    headers: {
      'Access-Token': token,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
       'Content-Type': 'application/json',
      'Cookie': `JSESSIONID=${token}; sidebarStatus=1`,
      'Authorization': token
    },
    data: JSON.stringify(payload)
}).then(response => {
let e = response.data.data;
// console.log(e)
if (e && e.rows){
rets=e.rows.map(row => ({'date':row['XDATA'],'netval':row['YDATA1'],'sumval':row['YDATA2'],'reval':row['YDATA3']}))
const payload={"code":code,"data":rets,"source":"CMS"} 
console.log(payload)
// axios.post('http://192.168.0.22:3002/fof/saveorig',payload).then(res => {
//   console.log(res.data)
// })
}
  })
}

function crawlporod(pcode,code){
// 使用 axios 获取网页内容
axios.get(`${url0}${pcode}`)
  .then(response => {
    // 将获取到的 HTML 内容加载到 cheerio
    const $ = cheerio.load(response.data);
    const scriptTags = $('script');
    // console.log(scriptTags.length)
    scriptTags.each((index, element) => {
        if (element.children && element.children[0] && element.children[0].data) {
          const scriptContent = element.children[0].data;
          if (scriptContent.includes('__NUXT__')) {
            // 尝试解析 __NUXT__ 相关的数据
            // 注意：这里只是一个示例，实际情况可能需要更复杂的解析逻辑
            // console.log(`找到 __NUXT__ 相关的 script 标签:${index}`, scriptContent);
            const result = vm.runInNewContext(scriptContent,globalObj); 
            rets=result.state.productDetail.netValue.map(r=>{
              return {"date":r.trading_date.replaceAll('-',''),"netval":r.unit_nv,'reval':r.rehabilitation_nv,'sumval':r.accumulated_nv,'rate':r.nv_growth_rate}
            })
            const payload={"code":code,"data":rets,"source":"GeShang"} 
            axios.post('http://192.168.0.22:3002/fof/saveorig',payload).then(res => {
              console.log(res.data)
            })
            // console.log(payload) 
          }
        }
      });
  })
  .catch(error => {
    console.error('请求错误:', error);
  })};



  const port = 3000;
app.listen(port,  () => {
    console.log(`Server  is running on http://localhost:${port}`);
});