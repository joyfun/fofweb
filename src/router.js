import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/login/index"
import axios from 'axios'
import store from './store'
import tools from '@/store/tools.js'



Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const compare1 =()=> import('@/views/fof/fofCompare.vue')
const compare2 =()=> import('@/views/fof/fofCompare.vue')
const compare3 =()=> import('@/views/fof/fofCompare.vue')
        //component:() => import('@/views/fof/fofSimple.vue')
var home = () => import('@/views/Home/FundHome.vue')
// var home = () => import('@/views/fof/rankInfo.vue')
if(tools.isElectron()){
  home = () => import('@/views/fof/fofSimple.vue')
}
const routes = [
  {
    path: '/',
    component:() => import('@/views/Main.vue'),
    children:[
      {
        path: '/',
        name: 'home',
        component:home
      },
      {
        path: '/trade',
        name: 'trade',
        component:() => import('@/views/fof/fofTrade.vue'),
      },
      {
        path: '/fundinfo',
        name: 'fund-info',
        component:() => import('@/views/fof/fofManage.vue'),
        
      },
      {
        path: '/fundext',
        name: 'fund-ext',
        component:() => import('@/views/fof/fofExternal.vue'),
        
      },
      {
        path: '/fundcomp',
        name: 'fund-comp',
        component:() => import('@/views/fof/fofCompany.vue'),
        
      },
      {
        path: '/fundouter',
        name: 'fund-outer',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            type:'0',
       }
  
      },
      {
        path: '/fundinfo1',
        name: 'fund-info1',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            filters:{class_type:'CTA'}
       }
      },
      {
        path: '/fundinfo2',
        name: 'fund-info2',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            filters:{class_type:'指增'}
       }
      },
      {
        path: '/fundinfo3',
        name: 'fund-info3',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            filters:{class_type:'套利'}
       }
      },
      {
        path: '/fundinfo4',
        name: 'fund-info4',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            filters:{class_type:'中性'}
       }
      },
      {
        path: '/fundinfo5',
        name: 'fund-info5',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            filters:{class_type:'期权'}
       }
      },
      {
        path: '/fundinfo6',
        name: 'fund-info6',
        component:() => import('@/views/fof/fofManage.vue'),
        props:{
            filters:{class_type:'混合'}
       }
      },{
        path: '/rankinfo',
        name: 'rank-info',
        component:() => import('@/views/fof/rankInfoA.vue'),
        props:{
          ftype:''
     }
      },
      ,{
        path: '/statinfo',
        name: 'stat-info',
        component:() => import('@/views/fof/StatInfo.vue')
      }
      ,{
        path: '/trendinfo',
        name: 'trend-info',
        component:() => import('@/views/fof/TrendInfo.vue')
      },{
        path: '/trendinfo2',
        name: 'trend-info2',
        component:() => import('@/views/fof/TrendInfo2.vue')
      }
      ,{
        path: '/rankinfoa',
        name: 'rank-infoa',
        component:() => import('@/views/fof/rankInfoA.vue'),
        props:{
          ftype:'投后',
          filters:{weight_type:'after_weight'}
     }
     
      },{
        path: '/rankinfoa1',
        name: 'rank-infoa1',
        component:() => import('@/views/fof/rankInfoA.vue'),
        props:{
          filters:{weight_type:'after_weight1'}
     }
     
      },
      {
        path: '/listrank',
        name: 'list-rank',
        component:() => import('@/views/fof/listRank.vue')
      },
      {
        path: '/fundcalc',
        name: 'fund-calc',
        component:() => import('@/views/fof/fofCalc.vue'),
      
      },
      {
        path: '/fundvirtual',
        name: 'fund-virtual',
        component:() => import('@/views/fof/fofVirtual.vue')      
      }        
        ,
      {
        path: '/fundcompare1',
        name: 'fund-compare1',
        component: compare1,
        props:
        {
            filters:{left:'已投',
            right:'预选'}
        }
      }
      ,
      {
        path: '/fundcompare2',
        name: 'fund-compare2',
        component:compare2,
        props:{
            filters:{left:'预选'
            }
        },
      }
      ,
      {
        path: '/fundcompare3',
        name: 'fund-compare3',
        component:compare3,
        props:{
            filters:{left:'尽调',
            right:'预选',
            other:'已投'}
        },
      }
      ,
      {
        path: '/fundcompare4',
        name: 'fund-compare4',
        component:() => import('@/views/fof/fofCompare.vue')
      }
      ,
      {
        path: '/fundreport',
        name: 'fund-report',
        component:() => import('@/views/fof/fofReport.vue')
      },
      ,
      {
        path: '/fundanalysis',
        name: 'fund-analysis',
        component:() => import('@/views/fof/fofAnalysis.vue')
      },
      {
        path: '/fundjcomp',
        name: 'fund-jcomp',
        component:() => import('@/views/fof/fofReport.vue'),
        props:{
            url:"/fof/jcompare"
        },
      },
      {
        path: '/fofdash',
        name: 'fof-dash',
        component:() => import('@/views/fof/fofDash.vue')
      },
      {
        path: '/fundextra',
        name: 'fund-extra',
        component:() => import('@/views/fof/fofExtra.vue'),
        props:{
            url:"/fof/fofextra"
        },
      },
      {
        path: '/fundcomb',
        name: 'fund-comb',
        component:() => import('@/views/fof/fofCombine.vue'),
        props:{
            url:"/fof/jcompare"
        },
      },
      {
        path: '/fundconcat',
        name: 'fund-concat',
        component:() => import('@/views/fof/fofConcat.vue'),
        props:{
            url:"/fof/jcompare"
        },
      },
      {
        path: '/fundreason',
        name: 'fund-reason',
        component:() => import('@/views/fof/fofReason.vue')
      },
      {
        path: '/fundreturn',
        name: 'fund-return',
        component:() => import('@/views/fof/fofReturn.vue')
      },
      {
        path: '/fundalarm',
        name: 'fund-alarm',
        component:() => import('@/views/fof/fofAlarm.vue')
      },
      {
        path: '/fundpressure',
        name: 'fund-pressure',
        component:() => import('@/views/fof/fofCast.vue')
      },
      {
        path: '/fundrank1',
        name: 'fund-rank1',
        component:() => import('@/views/fof/fofRank.vue'),
        props:{
            pfilter:{
            left:"已投",
            right:"尽调",
            class_type:"CTA"
            }
        },
      },{
        path: '/fundrank2',
        name: 'fund-rank2',
        component:() => import('@/views/fof/fofRank.vue'),
        props:{
            pfilter:{
            left:"已投",
            right:"备投",
            class_type:"CTA"}
        },
      },{
        path: '/holdingReprot',
        name: 'holding-report',
        component:() => import('@/views/fof/HoldingReport.vue')
      }
      ,
  {
    path: '/sys/mycart',
    name: 'my-cart',
    component:() => import('@/views/sys/userCart.vue'),
    children:[
    ]
  }
      ,
      {
        path: '/sysparam',
        name: 'sys-param',
        params:{
            parent:0,
        },
        component:() => import('@/views/sys/sysParam.vue')
      },
      // {
      //   path: '/sysconfig',
      //   name: 'sys-config',
      //   component:() => import('@/views/sys/sysConfig.vue')
      // },
      ,
      {
        path: '/syscfg',
        name: 'sys-cfg',
        params:{
            cfg:1,
        },
        component:() => import('@/views/sys/sysConfig.vue')
      }
      ,
      {
        path: '/action',
        name: 'fof-action',
        component:() => import('@/views/fof/fofAction.vue')
      }, {
        path: '/dataMonitor',
        name: 'data-monitor',
        component:() => import('@/views/fof/dataMonitor.vue')
      }
      ,
      {
        path: '/crawl',
        name: 'fof-crawl',
        component:() => import('@/views/fof/crawlDash.vue')
      }
      ,
      {
        path: '/funddash',
        name: 'fof-dash',
        component:() => import('@/views/fof/fundDash.vue')
      }
      ,
      {
        path: '/usermanage',
        name: 'user-manage',
        component:() => import('@/views/sys/userManage.vue')
      }
      ,

      // {
      //   path: '/testresult',
      //   name: 'test-result',
      //   component:() => import('@/views/testresult/testresult.vue')
      // },
      {
        path: '/page1',
        name: 'page1',
        component:() => import('@/views/Other/PageOne.vue')
      },
      {
        path: '/page2',
        name: 'page2',
        component:() => import('@/views/Other/PageTwo.vue')
      },
        {
        path: '/page3',
        name: 'page3',
        component:() => import('@/views/Other/PageThree.vue')
      },
      {
        path: '/page4',
        name: 'page4',
        component:() => import('@/views/Other/PageFour.vue')
      },
    ]
  },  {
    path: "/login",
    component: Login,
    name: "login",
    hidden: true,
    children: []
  }
]
var that=this
var updateparam=async ()=>{
  let starttime=new Date().getTime()
// await axios.get('/sys/param').then((response) => {
//         console.log(response)
//         let params={}
//         for (var key in response.data){
//             console.log(key)
//             var row=response.data[key]
//             params[row.code]=row['child']
//         }
//         console.log(params)
//         store.commit('setSysParam',params)
//     })
// await axios({
//       url: "/fof/foflist",
//       method: "GET",
//     })
//       .then((response) => {
//           store.commit("setFoflist",response.data)
//           console.log("####init####")

//       })
// await   axios
// .get("/sys/misc", { params: { "code": 'fof_action' } }) //axis后面的.get可以省略；
// .then((response) => {
//   store.commit('addAction',response)
// })
// .catch((error) => {
//   console.log(error);
// });
// await axios.get('/sys/allparam').then((response) => {
//         var ret={}
//         for (var row in response.data){
//             ret["param_"+row]=response.data[row]
//         }
//         store.commit('setAllParam',ret)
//     })
// await axios
//     .get("/fof/holding", { params: { code: "",extra:"1yr" } }) //axis后面的.get可以省略；
//     .then((response) => {
//       let holdingData = tools
//         .pandasToJson(response.data)
//         .filter((item) => !item.b_code.startsWith("SUBJECT2")).map(row=>{row["b_name"]=row['b_name'].replace(/(指数增强|证券|私募).+基金/,"")
//         return row});
//       store.commit('setHolding',holdingData)

//     })
//     .catch((error) => {
//       console.log(error);
//     });


await Promise.race([
 axios({
  url: "/fof/foflist",
  method: "GET",
})
  .then((response) => {
      store.commit("setFoflist",response.data)
      console.log("####init####")

  }),
     axios
.get("/sys/misc", { params: { "code": 'fof_action' } }) //axis后面的.get可以省略；
.then((response) => {
store.commit('addAction',response.data)
})
.catch((error) => {
console.log(error);
}), axios.get('/sys/allparam').then((response) => {
    var ret={}
    for (var row in response.data){
        ret["param_"+row]=response.data[row]
    }
    store.commit('setAllParam',ret)
}),
axios.get('/sys/param').then((response) => {
  console.log(response)
  let params={}
  for (var key in response.data){
      console.log(key)
      var row=response.data[key]
      params[row.code]=row['child']
  }
  console.log(params)
  store.commit('setSysParam',params)
}),
axios
.get("/fof/holding", { params: { code: "",extra:"1yr" } }) //axis后面的.get可以省略；
.then((response) => {
  let holdingData = tools
    .pandasToJson(response.data)
    // .filter((item) => !item.b_code.startsWith("SUBJECT2"))
    .map(row=>{row["b_name"]=row['b_name'].replace(/(指数增强|证券|私募).*基金/,"")
    return row});
  store.commit('setHolding',holdingData)

})
.catch((error) => {
  console.log(error);
})
]).then(function(values){
  return values
}).catch(function(err){
  console.log(err);
})
let endtime=new Date().getTime()
console.log(`######ajax totaltime ${endtime-starttime}`)
}
if(tools.isElectron()){
  const cparam=[{"child":[{"code":"低","id":39,"idx":1,"parent":25,"value":"低"},{"code":"中","id":40,"idx":2,"parent":25,"value":"中"},{"code":"高","id":41,"idx":3,"parent":25,"value":"高"}],"code":"risk_level","id":25,"idx":null,"parent":0,"value":"风险等级"},{"child":[],"code":"risk_target","id":26,"idx":null,"parent":0,"value":"风险目标"},{"child":[{"code":"GeShang","id":33,"idx":null,"parent":32,"value":"GeShang"},{"code":"SiMuWang","id":34,"idx":null,"parent":32,"value":"SiMuWang"},{"code":"1","id":35,"idx":null,"parent":32,"value":"渠道"}],"code":"data_type","id":32,"idx":null,"parent":0,"value":"来源"},{"child":[{"code":"试投","id":63,"idx":null,"parent":62,"value":"试投"},{"code":"专户","id":64,"idx":null,"parent":62,"value":"专户"},{"code":"规模投资","id":65,"idx":null,"parent":62,"value":"规模投资"}],"code":"scale","id":62,"idx":null,"parent":0,"value":"投资规模"},{"child":[],"code":"fofmail","id":68,"idx":null,"parent":0,"value":"zhaoshun@waddc.com"},{"child":[],"code":"retmail","id":69,"idx":null,"parent":0,"value":"zhaoshun@waddc.com"},{"child":[{"code":"FOF","id":55,"idx":null,"parent":11,"value":"FOF"},{"code":"CTA","id":12,"idx":1,"parent":11,"value":"CTA"},{"code":"指增","id":13,"idx":1,"parent":11,"value":"指增"},{"code":"中性","id":14,"idx":1,"parent":11,"value":"中性"},{"code":"套利","id":15,"idx":1,"parent":11,"value":"套利"},{"code":"混合","id":16,"idx":1,"parent":11,"value":"混合"},{"code":"期权","id":24,"idx":1,"parent":11,"value":"期权"},{"code":"虚拟","id":124,"idx":1,"parent":11,"value":"虚拟"}],"code":"class_type","id":11,"idx":1,"parent":0,"value":"产品类别"},{"child":[{"code":"入库","id":67,"idx":0,"parent":19,"value":"入库"},{"code":"预选","id":20,"idx":1,"parent":19,"value":"预选"},{"code":"尽调","id":21,"idx":3,"parent":19,"value":"尽调"},{"code":"候选","id":66,"idx":5,"parent":19,"value":"候选"},{"code":"备投","id":22,"idx":7,"parent":19,"value":"备投"},{"code":"已投","id":23,"idx":9,"parent":19,"value":"已投"},{"code":"对标","id":31,"idx":11,"parent":19,"value":"对标"},{"code":"已赎","id":38,"idx":13,"parent":19,"value":"已赎"}],"code":"stage","id":19,"idx":1,"parent":0,"value":"阶段"}]  
  let params={}
        for (var key in cparam){
            var row=cparam[key]
            params[row.code]=row['child']
        }
  store.commit('setSysParam',params)
  const allparam={"-1":[{"code":"月度收益预警","id":17,"idx":1,"parent":-1,"value":"1"},{"code":"年度收益预警","id":18,"idx":1,"parent":-1,"value":"8"}],"0":[{"code":"risk_target","id":26,"idx":null,"parent":0,"value":"风险目标"},{"code":"data_type","id":32,"idx":null,"parent":0,"value":"来源"},{"code":"risk_level","id":25,"idx":null,"parent":0,"value":"风险等级"},{"code":"scale","id":62,"idx":null,"parent":0,"value":"投资规模"},{"code":"fofmail","id":68,"idx":null,"parent":0,"value":"zhaoshun@waddc.com"},{"code":"retmail","id":69,"idx":null,"parent":0,"value":"zhaoshun@waddc.com"},{"code":"class_type","id":11,"idx":1,"parent":0,"value":"产品类别"},{"code":"stage","id":19,"idx":1,"parent":0,"value":"阶段"}],"11":[{"code":"FOF","id":55,"idx":null,"parent":11,"value":"FOF"},{"code":"CTA","id":12,"idx":1,"parent":11,"value":"CTA"},{"code":"指增","id":13,"idx":1,"parent":11,"value":"指增"},{"code":"中性","id":14,"idx":1,"parent":11,"value":"中性"},{"code":"期权","id":24,"idx":1,"parent":11,"value":"期权"},{"code":"虚拟","id":124,"idx":1,"parent":11,"value":"虚拟"},{"code":"套利","id":15,"idx":1,"parent":11,"value":"套利"},{"code":"混合","id":16,"idx":1,"parent":11,"value":"混合"}],"12":[{"code":"CTA中高频","id":43,"idx":null,"parent":12,"value":"CTA中高频"},{"code":"CTA中低频","id":42,"idx":null,"parent":12,"value":"CTA中低频"}],"13":[{"code":"HS300","id":70,"idx":null,"parent":13,"value":"HS300"},{"code":"ZZ500","id":71,"idx":null,"parent":13,"value":"ZZ500"},{"code":"ZZ1000","id":72,"idx":null,"parent":13,"value":"ZZ1000"}],"14":[{"code":"程序化T0","id":50,"idx":null,"parent":14,"value":"程序化T0"},{"code":"高频alpha","id":49,"idx":null,"parent":14,"value":"高频alpha"},{"code":"低频alpha","id":48,"idx":null,"parent":14,"value":"低频alpha"},{"code":"手工T0","id":51,"idx":null,"parent":14,"value":"手工T0"}],"15":[{"code":"套利","id":53,"idx":null,"parent":15,"value":"套利"}],"16":[{"code":"中性+CTA","id":52,"idx":null,"parent":16,"value":"中性+CTA"}],"19":[{"code":"入库","id":67,"idx":0,"parent":19,"value":"入库"},{"code":"预选","id":20,"idx":1,"parent":19,"value":"预选"},{"code":"尽调","id":21,"idx":3,"parent":19,"value":"尽调"},{"code":"候选","id":66,"idx":5,"parent":19,"value":"候选"},{"code":"备投","id":22,"idx":7,"parent":19,"value":"备投"},{"code":"已投","id":23,"idx":9,"parent":19,"value":"已投"},{"code":"对标","id":31,"idx":11,"parent":19,"value":"对标"},{"code":"已赎","id":38,"idx":13,"parent":19,"value":"已赎"}],"24":[{"code":"期权","id":54,"idx":null,"parent":24,"value":"期权"}],"25":[{"code":"低","id":39,"idx":1,"parent":25,"value":"低"},{"code":"中","id":40,"idx":2,"parent":25,"value":"中"},{"code":"高","id":41,"idx":3,"parent":25,"value":"高"}],"32":[{"code":"1","id":35,"idx":null,"parent":32,"value":"渠道"},{"code":"SiMuWang","id":34,"idx":null,"parent":32,"value":"SiMuWang"},{"code":"GeShang","id":33,"idx":null,"parent":32,"value":"GeShang"}],"58":[{"code":"试投","id":59,"idx":null,"parent":58,"value":"试投"},{"code":"专户","id":60,"idx":null,"parent":58,"value":"专户"},{"code":"规模投资","id":61,"idx":null,"parent":58,"value":"规模投资"}],"62":[{"code":"试投","id":63,"idx":null,"parent":62,"value":"试投"},{"code":"专户","id":64,"idx":null,"parent":62,"value":"专户"},{"code":"规模投资","id":65,"idx":null,"parent":62,"value":"规模投资"}]}
  var ret={}
  for (var row in allparam){
      ret["param_"+row]=allparam[row]
  }
  store.commit('setAllParam',ret)
}
else{
  let starttime=new Date().getTime()
  updateparam()
  let endtime=new Date().getTime()
console.log(`######ajax totaltime ${endtime-starttime}`)
}
const menus=["fund-rank1","fund-rank2","fund-rank3","fund-report"]
var filtermenu=(menu,umenu)=>{
    var uroute=[]
    console.log(menu.name)
    for(var aidx in menu){
        var amenu=menu[aidx]
        if(amenu.children ){
            amenu.children=filtermenu(amenu.children,menus)
            uroute.push(amenu)
        }
        console.log(amenu)
        if(menus.indexOf(amenu.name)>0){
            uroute.push(amenu)
        }
    }
    return uroute
}
const router = new VueRouter({
  routes
})

export default router