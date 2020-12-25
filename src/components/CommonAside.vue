<template>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

      <el-menu-item :index="item.path" v-for="item in  noChildren " :key="item.path" @click="clickMenu(item)">
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
export default {
    computed:{
        noChildren(){
            return this.asideMenu.filter(item => !item.children)
        },
        hasChildren(){
            return this.asideMenu.filter(item => item.children)
        }
    },
    data(){
        return{
            asideMenu:[
                {
                    path: '/',
                    label: '首页',
                    name:'home',
                    icon: 's-home'
                },
               {
                    label: '投资渠道',
                    icon: 'other',
                    name:'fof',
                    children:[
                        {
                            path: '/fundinfo',
                            label: '投资公司管理',
                            name:'fund-info',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }, {
                            path: '/fundinfo',
                            label: '基金产品维护',
                            name:'fund-info',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }]},
                                       {
                    label: '尽职调查',
                    icon: 'other',
                    name:'fof',
                    children:[
                        {
                            path: '/fundinfo',
                            label: '分类基金对比',
                            name:'fund-info',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }, {
                            path: '/fundinfo',
                            label: '已投对比',
                            name:'fund-info',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }
                        , {
                            path: '/fundinfo',
                            label: '二选对比',
                            name:'fund-info',
                            params:{
                                type:'1',
                            },
                            icon:'setting'
                        }]},
                        // {
                        //     path: '/fundinfo',
                        //     label: 'FOF子基金库',
                        //     name:'fund-info',
                        //     icon:'setting'
                        // },
                        //  {
                        //     path: '/fundreprot',
                        //     label: 'FOF产品一览表',
                        //     name:'fund-info',
                        //     icon:'setting'
                        // },
                        //  {
                        //     path: '/fundreprot',
                        //     label: '压力测试',
                        //     name:'fund-info',
                        //     icon:'setting'
                        // },
                        // ,
                        //  {
                        //     path: '/fundreprot',
                        //     label: '组合优化',
                        //     name:'fund-info',
                        //     icon:'setting'
                        // },
                        {
                            path: '/fundreprot',
                            label: '基金报告',
                            name:'fund-report',
                            icon:'setting'
                        },
                         
                //     ]
                // },
                {
                            path: '/fundouter',
                            label: '外部基金',
                            name:'fund-outer',
                            params:{
                                type:'2',
                            },
                            icon:'setting'
                },
                {
                            path: '/fundpool',
                            label: '基金备选池',
                            name:'fund-pool',
                            params:{
                                tag:'备选池1',
                            },
                            icon:'setting'
                }
            ]
        }
    },
  methods: {
    clickMenu(item) {
      console.log(item)
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
