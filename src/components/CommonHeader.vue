<template>
    <header>

        <div class="l-content">
             <el-button type="primary" icon="el-icon-menu" size="mini"></el-button>
             
        <el-breadcrumb separator="/">
                  <el-breadcrumb-item >首页</el-breadcrumb-item>
                  <!-- <el-breadcrumb-item>{{current.label}}
                  </el-breadcrumb-item> -->
        </el-breadcrumb>
<el-row :gutter="20">
  <el-col :span="3"><div @click="changeMenu('company')" class="grid-content bg-purple-light">投资渠道</div></el-col>
  <el-col :span="3"><div @click="changeMenu('invest')" class="grid-content bg-purple-light">尽职调查</div></el-col>
  <el-col :span="3"><div @click="changeMenu('decision')" class="grid-content bg-purple-light">投资决策</div></el-col>
  <el-col :span="3"><div @click="changeMenu('after')" class="grid-content bg-purple-light">投后管理</div></el-col>
  <el-col :span="3"><div @click="changeMenu('sys')" class="grid-content bg-purple-light">系统设置</div></el-col>

</el-row>
        </div>

        <div class="r-content">
            <el-dropdown trigger="click" size="mini">
              <span class="el-dropdown-link"><img :src="userImg" alt="" class="user"></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >个人中心</el-dropdown-item>
                <el-dropdown-item @click="clickPerson(item)">退出</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
        </div>
    </header>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '../store/bus.js';


export default {
    computed: {
        ...mapState({
            current: state => state.tab.currentMenu
        })
    },
      methods: {
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
           userImg:require('../assets/images/user.png')
        }
    }
}
</script>
<style lang="scss" scoped>
.el-row {
    width:800px;
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