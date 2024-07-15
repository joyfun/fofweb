<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.path"
      @click="clickMenu(item)"
    >
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>

    <el-submenu index="index" v-for="(item, index) in hasChildren" :key="index">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="subItem.path"
          v-for="(subItem, subIndex) in item.children"
          :key="subIndex"
          @click="clickMenu(subItem)"
          >{{ subItem.label }}</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>


<script>
import Bus from '../store/bus.js'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['allmenu', 'usermenu']),
    noChildren() {
      return this.asideMenu.filter((item) => !item.children)
    },
    hasChildren() {
      return this.asideMenu.filter((item) => item.children)
    }
  },
  mounted() {
    console.log(this.usermenu)
    if (this.usermenu instanceof Array) {
      for (var mn of this.usermenu) {
        this.menus.push(mn)
      }
    } else if (this.usermenu) {
      for (var mn of this.usermenu.split(',')) {
        this.menus.push(mn)
      }
    }

    //         ["fund-comp","fund-info","fund-info1","fund-info2","fund-info3","fund-info4","fund-info5","fund-info6","fund-compare","fund-info","fund-info4","fund-calc","fund-comb","fund-pressure","fund-compare","fund-report","fund-analysis","fund-jcomp","fund-reason","fund-rank1","fund-rank2","fund-info","sys-param","sys-cfg","fund-concat","fund-alarm","fof-action","fof-crawl","fof-dash","fund-return","user-manage",""
    // ]
    // for(var key in this.allMenu){
    //     this.allMenu[key]=this.allMenu[key]
    // }
    console.log(this.allMenu['company'])
    this.asideMenu = this.asideMenu.concat(
      this.allMenu['company'].filter(this.checkMenu)
    )
    console.log(this.asideMenu)
  },
  created() {
    Bus.$on('changeMenu', (arg) => {
      this.asideMenu = [
        {
          path: '/',
          label: '首页',
          name: 'home',
          icon: 's-home'
        }
      ]
      // if(this.$isElectron){
      //    this.asideMenu.push({
      //     path: '/',
      //     label: '模拟交易',
      //     name:'trade',
      //     icon: 's-home'
      // })
      // }else{
      this.asideMenu = this.asideMenu.concat(
        this.allMenu[arg].filter(this.checkMenu)
      )
      if (this.asideMenu) {
        let pmenu = this.asideMenu.filter((r) => r.primary)
        if (pmenu.length > 0) {
          this.clickMenu(pmenu[0])
        } else {
          this.clickMenu(this.asideMenu[1])
        }
      }

      // }
      console.log('on监听参数====', arg) //['string',false,{name:'vue'}]
    })
  },
  data() {
    return {
      isCollapse: false,
      menus: [],
      allMenu: {
        'datamag': [
          {
            path: '/fundconcat',
            label: '基金拼接',
            name: 'fund-concat',
            icon: 'setting'
          },
          {
            path: '/action',
            label: '下载报告',
            name: 'fof-action',
            icon: 'setting'
          },
          {
            path: '/dataMonitor',
            label: '数据监控',
            primary: true,
            name: 'data-monitor',
            icon: 'setting'
          },
          {
            path: '/crawl',
            label: '三方数据',
            name: 'fof-crawl',
            icon: 'setting'
          },
          // {
          //   path: '/funddash',
          //   label: '数据时效',
          //   name: 'fund-dash',
          //   icon: 'setting'
          // },
          {
            label: '管理统计',
            icon: 'other',
            name: 'fund-dash',
            children: [
              {
                path: '/addstat',
                label: '添加统计',
                name: 'add-stat',
                icon: 'setting'
              },
              {
                path: '/investstat',
                label: '尽调统计',
                name: 'invest-stat',
                icon: 'setting'
              },
              {
                path: '/norankprod',
                label: '未排名统计',
                name: 'norank-prod',
                icon: 'setting'
              },
              {
                path: '/fofremark',
                label: '备注信息',
                name: 'fof-remark',
                icon: 'setting'
              },
              {
                path: '/volatilityhigh',
                label: '净值异常',
                name: 'volatility-high',
                icon: 'setting'
              }
            ]
          }
        ],
        'company': [
          {
            path: '/fundcomp',
            label: '投资公司管理',
            name: 'fund-comp',
            params: {
              type: '1'
            },
            icon: 'setting'
          },
          {
            path: '/fundinfo',
            label: '初选基金管理',
            primary: true,
            name: 'fund-info',
            icon: 'setting'
          },
          {
            path: '/fundinvest',
            label: '已投基金管理',
            primary: true,
            name: 'holding-info',
            icon: 'setting'
          },
          {
            path: '/fundredeem',
            label: '已赎基金管理',
            primary: true,
            name: 'redeem-info',
            icon: 'setting'
          }
          // {
          //   path: '/investtask',
          //   label: '尽调任务',
          //   name: 'invest-task',
          //   icon: 'setting'
          // },
        ],
        'invest': [
          {
            path: '/rankinfo',
            label: '投资排名',
            primary: true,
            name: 'rank-info',
            icon: 'setting'
          },
          {
            path: '/statinfo',
            label: '周剑指数',
            name: 'stat-info',
            icon: 'setting'
          },
          {
            path: '/trendinfo',
            label: '统计指标',
            name: 'trend-info',
            icon: 'setting'
          },
          {
            path: '/trendinfo2',
            label: '统计指标2',
            name: 'trend-info2',
            icon: 'setting'
          },
          {
            path: '/trendinfo3',
            label: '统计指标3',
            name: 'trend-info3',
            icon: 'setting'
          },
          {
            path: '/investdash',
            label: '运营尽调列表',
            name: 'invest-dash',
            icon: 'setting'
          }
          // {
          //     path: '/listrank',
          //     label: '清单分析',
          //     name:'list-rank',
          //     icon:'setting'
          // },{
          //     path: '/fundextra',
          //     label: '高级查询',
          //     name:'fund-extra',
          //     icon:'setting'
          // },
          //  {
          //     path: '/fundcompare1',
          //     label: '分类基金对比',
          //     name:'fund-compare',
          //     children:[{
          //     path: '/fundcompare1',
          //     label: '已投对比',
          //     name:'fund-compare1',
          //     params:{
          //         left:'已投',
          //         right:'预选'
          //     },
          //     icon:'setting'
          // },
          // {
          //     path: '/fundcompare3',
          //     label: '尽调对比',
          //     name:'fund-compare3',
          //     params:{
          //         left:'尽调',
          //         right:'预选'
          //     },
          //     icon:'setting'
          // },{
          //     path: '/fundcompare2',
          //     label: '侯选对比',
          //     name:'fund-compare2',
          //     icon:'setting'
          // }]}
        ],
        'decision': [
          {
            path: '/fundinfo',
            label: '备投列表',
            primary: true,
            name: 'fund-info',
            params: {
              stage: '备投'
            },
            icon: 'setting'
          },
          {
            path: '/fundcalc',
            label: '组合配置',
            name: 'fund-calc',
            icon: 'setting'
          },
          {
            path: '/fundvirtual',
            label: '组合模拟',
            name: 'fund-virtual',
            icon: 'setting'
          },
          {
            path: '/fundcomb',
            label: '虚拟配置',
            name: 'fund-comb',
            icon: 'setting'
          },
          {
            path: '/fundpressure',
            label: '压力测试',
            name: 'fund-pressure',
            icon: 'setting'
          }
          // {
          //     path: '/fundcompare1',
          //     label: '分类基金对比',
          //     name:'fund-compare',
          //     children:[{
          //     path: '/fundcompare1',
          //     label: '已投对比',
          //     name:'fund-compare1',
          //     params:{
          //         left:'已投',
          //         right:'预选'
          //     },
          //     icon:'setting'
          // },{
          //     path: '/fundcompare3',
          //     label: '尽调对比',
          //     name:'fund-compare3',
          //     params:{
          //         left:'尽调',
          //         right:'预选'
          //     },
          //     icon:'setting'
          // },{
          //     path: '/fundcompare2',
          //     label: '侯选对比',
          //     name:'fund-compare2',
          //     icon:'setting'
          // }
          // ]}
        ],
        'after': [
          {
            path: '/fund-report',
            label: '业绩对标',
            primary: true,
            name: 'fund-report',
            params: {
              class_type: '1'
            },
            icon: 'setting'
          },
          {
            path: '/fofdash',
            label: '资金情况',
            name: 'fof-dash',
            params: {
              class_type: '1'
            },
            icon: 'setting'
          },
          {
            path: '/afterrankinfo',
            label: '投后排名',
            name: 'rank-infoa',
            icon: 'setting'
          },
          {
            path: '/afterrankinfo1',
            label: '投后分析',
            name: 'rank-infoa1',
            icon: 'setting'
          },
          //                  {
          //     path: '/fund-analysis',
          //     label: '基金分析',
          //     name:'fund-analysis',
          //     params:{
          //         class_type:'1',
          //     },
          //     icon:'setting'
          // },
          {
            path: '/fund-jcomp',
            label: '对标差',
            name: 'fund-jcomp',
            params: {
              url: 'jcompare'
            },
            icon: 'setting'
          },
          // {
          //     path: '/fundrank1',
          //     label: '已投尽调排名',
          //     name:'fund-rank1',
          //     icon:'setting'
          // },
          // {
          //     path: '/fundrank2',
          //     label: '已投备投排名',
          //     name:'fund-rank2',
          //     icon:'setting'
          // },
          {
            path: '/fundreason',
            label: '收益归因',
            name: 'fund-reason',
            params: {
              type: '1'
            },
            icon: 'setting'
          },
          {
            path: '/fundreturn',
            label: '风险归因',
            name: 'fund-return',
            params: {
              type: '1'
            },
            icon: 'setting'
          },
          {
            path: '/fundalarm',
            label: '业绩预警',
            name: 'fund-alarm',
            params: {
              type: '1'
            },
            icon: 'setting'
          }
        ],
        'sys': [
          {
            path: '/sys/mycart',
            label: '我的购物车',
            name: 'my-cart',
            params: {
              parent: 0
            },
            icon: 'setting'
          },
          {
            path: '/sysparam',
            label: '系统字典',
            name: 'sys-param',
            params: {
              parent: 0
            },
            icon: 'setting'
          },
          {
            path: '/syscfg',
            label: '系统参数',
            name: 'sys-cfg',
            params: {
              cfg: 1
            },
            icon: 'setting'
          },

          {
            path: '/action',
            label: '刷新参数',
            name: 'fof-action',
            icon: 'setting'
          },
          {
            path: '/usermanage',
            label: '用户管理',
            name: 'user-manage',
            icon: 'setting'
          }
        ]
      },

      asideMenu: [
        {
          path: '/',
          label: '首页',
          name: 'home',
          icon: 's-home'
        }
      ]
      //     asideMenu:[
      //         {
      //             path: '/',
      //             label: '首页',
      //             name:'home',
      //             icon: 's-home'
      //         },
      //        {
      //             label: '投资渠道',
      //             icon: 'other',
      //             name:'fof',
      //             children:[
      //                 {
      //                     path: '/fundcomp',
      //                     label: '投资公司管理',
      //                     name:'fund-comp',
      //                     params:{
      //                         type:'1',
      //                     },
      //                     icon:'setting'
      //                 }, {
      //                     path: '/fundinfo',
      //                     label: '基金产品维护',
      //                     name:'fund-info',
      //                     params:{
      //                         type:'1',
      //                     },
      //                     icon:'setting'
      //                 }]},
      //                                {
      //             label: '尽职调查',
      //             icon: 'other',
      //             name:'fof',
      //             children:[
      //                 {
      //                     path: '/fundinfo',
      //                     label: '分类基金对比',
      //                     name:'fund-info',
      //                     params:{
      //                         type:'1',
      //                     },
      //                     icon:'setting'
      //                 },
      //                 {
      //                     path: '/fundext',
      //                     label: '外部基金',
      //                     name:'fund-ext',
      //                     params:{
      //                         type:'1',
      //                     },
      //                     icon:'setting'
      //                 }, {
      //                     path: '/fundinfo',
      //                     label: '已投对比',
      //                     name:'fund-info',
      //                     params:{
      //                         type:'1',
      //                     },
      //                     icon:'setting'
      //                 }
      //                 , {
      //                     path: '/fundinfo',
      //                     label: '二选对比',
      //                     name:'fund-info',
      //                     params:{
      //                         type:'1',
      //                     },
      //                     icon:'setting'
      //                 }]},
      //                 // {
      //                 //     path: '/fundinfo',
      //                 //     label: 'FOF子基金库',
      //                 //     name:'fund-info',
      //                 //     icon:'setting'
      //                 // },
      //                 //  {
      //                 //     path: '/fundreprot',
      //                 //     label: 'FOF产品一览表',
      //                 //     name:'fund-info',
      //                 //     icon:'setting'
      //                 // },
      //                 //  {
      //                 //     path: '/fundreprot',
      //                 //     label: '压力测试',
      //                 //     name:'fund-info',
      //                 //     icon:'setting'
      //                 // },
      //                 // ,
      //                 //  {
      //                 //     path: '/fundreprot',
      //                 //     label: '组合优化',
      //                 //     name:'fund-info',
      //                 //     icon:'setting'
      //                 // },
      //                 {
      //                     path: '/fundreprot',
      //                     label: '基金报告',
      //                     name:'fund-report',
      //                     icon:'setting'
      //                 },

      //         //     ]
      //         // },
      //         {
      //                     path: '/fundouter',
      //                     label: '外部基金',
      //                     name:'fund-outer',
      //                     params:{
      //                         type:'2',
      //                     },
      //                     icon:'setting'
      //         },
      //         {
      //                     path: '/fundpool',
      //                     label: '基金备选池',
      //                     name:'fund-pool',
      //                     params:{
      //                         tag:'备选池1',
      //                     },
      //                     icon:'setting'
      //         }
      //     ]
    }
  },
  methods: {
    checkMenu(menu) {
      return this.menus.indexOf(menu.name) > -1
    },
    clickMenu(item) {
      this.$router.push({ name: item.name, params: item.params })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
}
</style>
