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
                    path: '/testcase',
                    label: '测试用例',
                    name:'test-case',
                    icon: 's-operation'
                },
              {
                    path: '/testexecute',
                    label: '测试执行',
                    name:'test-execute',
                    icon: 's-promotion'
                },
                 {
                    path: '/testresult',
                    label: '测试结果',
                    name:'test-result',
                    icon: 's-order'
                },
                {
                    label: '其他',
                    icon: 'other',
                    name:'other',
                    children:[
                        {
                            path: '/page1',
                            label: '页面1',
                            name:'page1',
                            icon:'setting'
                        },
                         {
                            path: '/page2',
                            label: '页面2',
                            name:'page2',
                            icon:'setting'
                        }
                    ]
                },
            ]
        }
    },
  methods: {
    clickMenu(item) {
      this.$router.push({name:item.name})
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
