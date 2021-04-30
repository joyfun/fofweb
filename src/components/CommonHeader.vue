<template>
<div>
    <header>

        <div class="l-content">
             <el-button type="primary" icon="el-icon-menu" size="mini"></el-button>
         <!-- <el-tabs v-model="activeName" @tab-click="handleTabClick" type="border-card">
    <el-tab-pane label="投资渠道" name="company">投资渠道</el-tab-pane>
    <el-tab-pane label="尽职调查" name="invest">尽职调查</el-tab-pane>
    <el-tab-pane label="投资决策" name="decision">投资决策</el-tab-pane>
    <el-tab-pane label="投后管理" name="after">投后管理</el-tab-pane>
    <el-tab-pane label="系统设置" name="sys">系统设置</el-tab-pane>
  </el-tabs> -->    
        <!-- <el-breadcrumb separator="/">
                  <el-breadcrumb-item >首页</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('company')">投资渠道</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('invest')">尽职调查</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('decision')">投资决策</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('after')">投后管理</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('sys')">系统设置</el-breadcrumb-item> 

                 
        </el-breadcrumb> -->
<el-row :gutter="5">
    <el-button-group>

    <el-button @click="changeMenu('company')" >投资渠道</el-button>
    <el-button @click="changeMenu('invest')" >尽职调查</el-button>
    <el-button @click="changeMenu('decision')">投资决策</el-button>
    <el-button @click="changeMenu('after')">投后管理</el-button>
    <el-button @click="changeMenu('datamag')">数据管理</el-button>
    <el-button @click="changeMenu('sys')">系统设置</el-button>
    </el-button-group>

  <!-- <el-col :span="3"><div @click="changeMenu('company')" class="grid-content bg-purple-light">投资渠道</div></el-col>
  <el-col :span="3"><div @click="changeMenu('invest')" class="grid-content bg-purple-light">尽职调查</div></el-col>
  <el-col :span="3"><div @click="changeMenu('decision')" class="grid-content bg-purple-light">投资决策</div></el-col>
  <el-col :span="3"><div @click="changeMenu('after')" class="grid-content bg-purple-light">投后管理</div></el-col>
  <el-col :span="3"><div @click="changeMenu('sys')" class="grid-content bg-purple-light">系统设置</div></el-col> -->
</el-row>
  
        </div>

        <div class="r-content">
            <el-dropdown trigger="click" size="mini" @command="handleCommand">
              <span class="el-dropdown-link"><img :src="userImg" alt="" class="user"></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="changepassword" >修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
        </div>
    </header>
     <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="resetVisible"
  >
<el-form :model="current" ref="resetPassForm" label-width="120px" class="demo-dynamic">
    <el-form-item label="密码"> 
        <el-input placeholder="请输入密码" v-model="current.password" show-password></el-input>
    </el-form-item>
<el-form-item>
    <el-button type="primary" @click="submitPass('resetPassForm')">提交</el-button>
    <el-button @click="resetForm('resetPassForm')">重置</el-button>
  </el-form-item>
</el-form>

    </el-dialog>
</div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
import Bus from '../store/bus.js';
import axis from 'axios'


export default {
    computed: {
        ...mapState({
            current: state => state.tab.currentMenu
        }),
       ...mapGetters(['token']),

    },
      methods: {
          handleTabClick(item){
              console.log(item)
              this.changeMenu(item.name)
          },
        handleCommand(item){
            if(item=="logout"){
            this.$router.push({name:'login'})  
            this.$store.commit('selectMenu',item);
            }else if(item=="changepassword"){
                this.resetVisible=true
                this.current.user=this.token
            }
            

        },
        submitPass(formName){
            if(this.current&&this.current.user){
                axis({
      method: 'post',
      url: "/sys/updatepass", // 请求地址
      data: {"user":this.current.user,"password":this.current.password}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
            this.resetVisible = false
          }

      },
      err => {
        reject(err)
      }
    )
            }
        },
        clickPerson(item) {
          this.$router.push({name:item.name})
          this.$store.commit('selectMenu',item);
        },
        changeMenu(type) {
           Bus.$emit('changeMenu',type)

        }

      },
    data(){
        return{
            activeName:"首页",
            resetVisible:false,
           userImg:require('../assets/images/user.png')
        }
    }
}
</script>
<style lang="scss" scoped>
.el-row {
    width:1000px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
  }
  .row-bg {
    padding: 10px 0;
  }

header {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
}
.r-content {
  .user {
      width: 40px;
      height: 40px;
      border-radius: 20%;
  }
}
.l-content {
    display: flex;
    align-items: center;
    .el-button {
        margin: 20px;
    }
}
</style >

<style lang="scss">

.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #666666;
      font-weight: normal;
  }
  &:last-child {
    .el-breadcrumb__inner {
      color: #ffffff;
    }
  }
}
</style>