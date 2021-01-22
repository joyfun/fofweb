import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
        params:{
            type:'0',
       }
  
      },
      {
        path: '/fundinfo1',
        name: 'fund-info1',
        component:() => import('@/views/fof/fofManage.vue'),
        params:{
            class_type:'CTA',
       }
      },
      {
        path: '/fundinfo2',
        name: 'fund-info2',
        component:() => import('@/views/fof/fofManage.vue'),
        params:{
            class_type:'指增',
       }
      },
      {
        path: '/fundinfo3',
        name: 'fund-info3',
        component:() => import('@/views/fof/fofManage.vue'),
        params:{
            class_type:'套利',
       }
      },
      {
        path: '/fundinfo4',
        name: 'fund-info4',
        component:() => import('@/views/fof/fofManage.vue'),
        params:{
            class_type:'中性',
       }
      },
      {
        path: '/fundinfo5',
        name: 'fund-info5',
        component:() => import('@/views/fof/fofManage.vue'),
        params:{
            class_type:'期权',
       }
      },
      {
        path: '/fundcompare1',
        name: 'fund-compare1',
        component:() => import('@/views/fof/fofCompare.vue')
      }
      ,
      {
        path: '/fundcompare2',
        name: 'fund-compare2',
        component:() => import('@/views/fof/fofCompare.vue')
      }
      ,
      {
        path: '/fundcompare3',
        name: 'fund-compare3',
        component:() => import('@/views/fof/fofCompare.vue')
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
        component:() => import('@/views/fof/fofReport.vue')
      },
      {
        path: '/fundreason',
        name: 'fund-reason',
        component:() => import('@/views/fof/fofReason.vue')
      },
      {
        path: '/fundrank',
        name: 'fund-rank',
        component:() => import('@/views/fof/fofRank.vue')
      }
      ,
      {
        path: '/sysparam',
        name: 'sys-param',
        component:() => import('@/views/sys/sysParam.vue')
      }
      ,
      {
        path: '/syscfg',
        name: 'sys-cfg',
        component:() => import('@/views/sys/sysParam.vue')
      }
      ,
        {
        path: '/testexecute',
        name: 'test-execute',
        component:() => import('@/views/testexecute/testexecute.vue')
      },
      {
        path: '/testresult',
        name: 'test-result',
        component:() => import('@/views/testresult/testresult.vue')
      },
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
    path: '/login',
    component:() => import('@/views/User/login.vue'),
    children:[
    ]
  },
  {
    path: '/register',
    component:() => import('@/views/User/register.vue'),
    children:[
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router