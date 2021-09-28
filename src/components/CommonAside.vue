<template>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item  :index="item.path" v-for="item in  noChildren " :key="item.path" @click="clickMenu(item)">
        <i :class="'el-icon-'+ item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>

      <el-submenu index="index" v-for="(item,index) in  hasChildren " :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex" @click="clickMenu(subItem)">{{ subItem.label }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>



</template>


<script>
import Bus from '../store/bus.js';
import {mapGetters} from 'vuex'

export default {
    computed:{
        ...mapGetters(['allmenu','usermenu']),
        noChildren(){
            return this.asideMenu.filter(item => !item.children)
        },
        hasChildren(){
            return this.asideMenu.filter(item => item.children)
        }
    },
    mounted(){
        console.log(this.usermenu)
        if (this.usermenu instanceof Array) {

        for(var mn of this.usermenu){
            this.menus.push(mn)
        }}else if(this.usermenu){
           for(var mn of this.usermenu.split(",")){
            this.menus.push(mn)
        } 

        }
        

//         ["fund-comp","fund-info","fund-info1","fund-info2","fund-info3","fund-info4","fund-info5","fund-info6","fund-compare","fund-info","fund-info4","fund-calc","fund-comb","fund-pressure","fund-compare","fund-report","fund-analysis","fund-jcomp","fund-reason","fund-rank1","fund-rank2","fund-info","sys-param","sys-cfg","fund-concat","fund-alarm","fof-action","fof-crawl","fof-dash","fund-return","user-manage"
// ]
        // for(var key in this.allMenu){
        //     this.allMenu[key]=this.allMenu[key]
        // }
        console.log(this.allMenu["company"])
        this.asideMenu=this.asideMenu.concat(this.allMenu["company"].filter(this.checkMenu))
        console.log(this.asideMenu)

    },
    created(){
        
        Bus.$on('changeMenu',(arg)=> {
            this.asideMenu=[{
                    path: '/',
                    label: '首页',
                    name:'home',
                    icon: 's-home'
                }]
        this.asideMenu=this.asideMenu.concat(this.allMenu[arg].filter(this.checkMenu))
          console.log('on监听参数====',arg)  //['string',false,{name:'vue'}]
      })
    },
    data(){
        return{
            isCollapse:false,
            menus:[],
            allMenu:{
                "datamag":[{
                            path: '/fundconcat',
                            label: '基金拼接',
                            name:'fund-concat',
                            icon:'setting'
                        },{
                            path: '/action',
                            label: '下载报告',
                            name:'fof-action',
                            icon:'setting'
                        },{
                            path: '/crawl',
                            label: '三方数据',
                            name:'fof-crawl',
                            icon:'setting'
                        },{
                            path: '/funddash',
                            label: '数据时效',
                            name:'fof-dash',
                            icon:'setting'
                        } ],
                "company":[{
                            path: '/fundcomp',
                            label: '投资公司管理',
                            name:'fund-comp',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        },
                        {
                            path: '/fundinfo',
                            label: '初选基金管理',
                            name:'fund-info',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }],
                         "invest":[
                        {
                            path: '/fundinfo1',
                            label: 'CTA',
                            name:'fund-info1',
                            icon:'setting'
                        },
                        {
                            path: '/fundinfo2',
                            label: '指数增强',
                            name:'fund-info2',
                            icon:'setting'
                        }, {
                            path: '/fundinfo3',
                            label: '套利',
                            name:'fund-info3',
                            icon:'setting'
                        }
                        , {
                            path: '/fundinfo4',
                            label: '中性',
                            name:'fund-info4',
                            icon:'setting'
                        }, {
                            path: '/fundinfo5',
                            label: '期权',
                            name:'fund-info5',
                            icon:'setting'
                        },{
                            path: '/fundinfo6',
                            label: '混合',
                            name:'fund-info6',
                            icon:'setting'
                        },{
                            path: '/fundextra',
                            label: '高级查询',
                            name:'fund-extra',
                            icon:'setting'
                        },
                         {
                            path: '/fundcompare1',
                            label: '分类基金对比',
                            name:'fund-compare',
                            children:[{
                            path: '/fundcompare1',
                            label: '已投对比',
                            name:'fund-compare1',
                            params:{
                                left:'已投',
                                right:'预选'
                            },
                            icon:'setting'
                        },
                        {
                            path: '/fundcompare3',
                            label: '尽调对比',
                            name:'fund-compare3',
                            params:{
                                left:'尽调',
                                right:'预选'
                            },
                            icon:'setting'
                        },{
                            path: '/fundcompare2',
                            label: '侯选对比',
                            name:'fund-compare2',
                            icon:'setting'
                        }]}],
                         "decision":[
                        {
                            path: '/fundinfo',
                            label: '备投列表',
                            name:'fund-info',
                            params:{
                                stage:'备投',
                            },
                            icon:'setting'
                        }
                        , {
                            path: '/fundinfo6',
                            label: '相关性分析',
                            name:'fund-info4',
                            params:{
                                class_type:'中性',
                            },
                            icon:'setting'
                        }, {
                            path: '/fundcalc',
                            label: '组合配置',
                            name:'fund-calc',
                            icon:'setting'
                        },
                         {
                            path: '/fundvirtual',
                            label: '组合模拟',
                            name:'fund-virtual',
                            icon:'setting'
                        },
                        {
                            path: '/fundcomb',
                            label: '虚拟配置',
                            name:'fund-comb',
                            icon:'setting'
                        }, {
                            path: '/fundpressure',
                            label: '压力测试',
                            name:'fund-pressure',
                            icon:'setting'
                        }, {
                            path: '/fundcompare1',
                            label: '分类基金对比',
                            name:'fund-compare',
                            children:[{
                            path: '/fundcompare1',
                            label: '已投对比',
                            name:'fund-compare1',
                            params:{
                                left:'已投',
                                right:'预选'
                            },
                            icon:'setting'
                        },{
                            path: '/fundcompare3',
                            label: '尽调对比',
                            name:'fund-compare3',
                            params:{
                                left:'尽调',
                                right:'预选'
                            },
                            icon:'setting'
                        },{
                            path: '/fundcompare2',
                            label: '侯选对比',
                            name:'fund-compare2',
                            icon:'setting'
                        }]}
                        ],
                        "after":[
                        {
                            path: '/fund-report',
                            label: '业绩对标',
                            name:'fund-report',
                            params:{
                                class_type:'1',
                            },
                            icon:'setting'
                        },
                                         {
                            path: '/fund-analysis',
                            label: '基金分析',
                            name:'fund-analysis',
                            params:{
                                class_type:'1',
                            },
                            icon:'setting'
                        },
                        {
                            path: '/fund-jcomp',
                            label: '对标差',
                            name:'fund-jcomp',
                            params:{
                                url:'jcompare',
                            },
                            icon:'setting'
                        },
                        {
                            path: '/fundrank1',
                            label: '已投尽调排名',
                            name:'fund-rank1',
                            icon:'setting'
                        },
                        {
                            path: '/fundrank2',
                            label: '已投备投排名',
                            name:'fund-rank2',
                            icon:'setting'
                        },
                        {
                            path: '/fundreason',
                            label: '收益归因',
                            name:'fund-reason',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        },
                        {
                            path: '/fundreturn',
                            label: '风险归因',
                            name:'fund-return',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        },
                         {
                            path: '/fundalarm',
                            label: '业绩预警',
                            name:'fund-alarm',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }
                        ],
                        "sys":[
                        {
                            path: '/sysparam',
                            label: '系统字典',
                            name:'sys-param',
                            params:{
                                parent:0,
                            },
                            icon:'setting'
                        },
                        {
                            path: '/syscfg',
                            label: '系统参数',
                            name:'sys-cfg',
                            params:{
                                cfg:1,
                            },
                            icon:'setting'
                        },
                        
                        {
                            path: '/action',
                            label: '刷新参数',
                            name:'fof-action',
                            icon:'setting'
                        }, 
                        {
                            path: '/usermanage',
                            label: '用户管理',
                            name:'user-manage',
                            icon:'setting'
                        } 
                        ]
                        
            },

            asideMenu:[
                 {
                    path: '/',
                    label: '首页',
                    name:'home',
                    icon: 's-home'
                }]
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
       checkMenu(menu){
           return this.menus.indexOf(menu.name)>-1
        },
    clickMenu(item) {
      this.$router.push({name:item.name,params:item.params})
      this.$store.commit('selectMenu',item);
    }
  },
}
</script>

<style lang="scss" scoped>
.el-menu{
    height: 100%;
}
</style>
