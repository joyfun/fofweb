<template>
    <el-container style="height: 100%">
      <el-aside v-if="!$isElectron" width="180px" ><v-CommonAside></v-CommonAside></el-aside>
      <el-container>
        <el-header><v-CommonHeader></v-CommonHeader></el-header>
        <v--common-tab></v--common-tab>
        <el-main ref="maincontainer">
            <router-view :key="$route.fullPath"></router-view>
        </el-main>
      </el-container>
      <right-panel >
        <fund-table/>
      </right-panel>
    </el-container>
    
</template>


<script>
    import CommonAside from '../components/CommonAside.vue';   //引入左侧栏
    import CommonHeader from '../components/CommonHeader.vue';   //引入header
    import CommonTab from '../components/CommonTab.vue';   //引入header
    import RightPanel from '../components/RightPanel.vue'
    import FundTable from "../components/FundTable.vue"

    export default {
       components:{  /* 前面的组件名称不能和HTML标签一样*/
           'v-CommonAside':CommonAside,
           RightPanel,FundTable,
           'v-CommonHeader':CommonHeader,
           'v-CommonTab':CommonTab,
        },
    }
</script>


<style lang="scss" scoped>
.el-header {
    background-color: black;
}
.el-main{
    padding: 5px 20px 5px 20px;
}
</style>