import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/login/index"
import axios from 'axios'
import store from './store'



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

const routes = [
  {
    path: '/',
    component:() => import('@/views/Main.vue'),
    children:[
      {
        path: '/',
        name: 'home',
        component:() => import('@/views/Home/FundHome.vue')
      },
      {
        path: '/testcase',
        name: 'test-case',
        component:() => import('@/views/testcaseManage/testcaseManage.vue')
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
      },
      {
        path: '/fundcalc',
        name: 'fund-calc',
        component:() => import('@/views/fof/fofCalc.vue'),
      
      },
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
      {
        path: '/fundjcomp',
        name: 'fund-jcomp',
        component:() => import('@/views/fof/fofReport.vue'),
        props:{
            url:"/fof/jcompare"
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
        component:() => import('@/views/fof/fofPressure.vue')
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
      }
      ,
      {
        path: '/sysparam',
        name: 'sys-param',
        params:{
            parent:0,
        },
        component:() => import('@/views/sys/sysParam.vue')
      }
      ,
      {
        path: '/syscfg',
        name: 'sys-cfg',
        params:{
            cfg:1,
        },
        component:() => import('@/views/sys/sysParam.vue')
      }
      ,
      {
        path: '/action',
        name: 'fof-action',
        component:() => import('@/views/fof/fofAction.vue')
      }
      ,
      {
        path: '/crawl',
        name: 'fof-crawl',
        component:() => import('@/views/fof/crawlDash.vue')
      }
      ,
      {
        path: '/usermanage',
        name: 'user-manage',
        component:() => import('@/views/sys/userManage.vue')
      }
      ,
        {
        path: '/testexecute',
        name: 'test-execute',
        component:() => import('@/views/testexecute/testexecute.vue')
      },
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
  },
  {
    path: '/register',
    component:() => import('@/views/User/register.vue'),
    children:[
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
await axios.get('/sys/param').then((response) => {
        console.log(response)
        let params={}
        for (var key in response.data){
            console.log(key)
            var row=response.data[key]
            params[row.code]=row['child']
        }
        console.log(params)
        store.commit('setSysParam',params)
    })
    await axios.get('/sys/allparam').then((response) => {
        var ret={}
        for (var row in response.data){
            ret["param_"+row]=response.data[row]
        }
        store.commit('setAllParam',ret)
    })
}
updateparam()
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