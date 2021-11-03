<template>

  <div ref="tableContainer" style="	height : 100%;">

 <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">      <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
  <el-select v-model="filter.class_type" @change="changeSub"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
<el-select
    v-model="mult"
    style="width:180px;"   
    multiple
    popper-class="pop-div-my"
    :popper-append-to-body="true"
    clearable
    filterable
    placeholder="名称"
    >
    <el-option
      v-for="item in alllist"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
      

          </div>

 </div>
 
   <div class="block" style="display: flex;justify-content: space-between">
            <el-button type="primary"   size="small" @click="addCart">添加</el-button>
           <el-button type="primary"   size="small" @click="showCart">对比</el-button>
            <el-button type="primary"   size="small" @click="showRank">排名</el-button>
            <!-- <el-button type="primary"   size="small" @click="showSimu">仿真</el-button> -->

  </div>
   <div class="block" style="display: flex;flex-wrap: wrap;">
      <el-tag
  @click="changeCart('default')"
  :effect="'default'==nowcart?'dark':'light'"
  type='warning'
  :disable-transitions="false">
  默认
</el-tag>
 <el-tag
  :key="tag"
  v-for="(item,tag) in allCart"
  v-show="tag!='default'"
  @click="changeCart(tag)"
  @close="delCartTag(tag)"
  :effect="tag==nowcart?'dark':'light'"
  type='warning'
  :closable="tag==nowcart"
  :disable-transitions="false">
  {{tag}}
</el-tag>
 <el-input id="tInput1"
 style="width:80px"
  v-show="inputVisible"
  v-model="nTagName"
  width="10"
  ref="saveTagInput"
  size="mini"
  @keyup.enter.native="handleInputConfirm"
>
</el-input>
<el-button id="tBtn1" v-show="!inputVisible" class="button-new-tag" size="small" @click="showInput">+添加</el-button>

   </div>
  <el-table
    ref="multipleTable"
    :data="foflist"
    tooltip-effect="dark"
    :row-key="(row)=>{ return row.code}"
    :max-height="tmaxh"
    @selection-change="handleSelectionChange"
    style="width: 100%;margin-top:20px;">
        <el-table-column
      type="selection"
      :reserve-selection="true"
      width="55">
    </el-table-column>
    <el-table-column
      label="名称"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column
    width="40"
            fixed="right"
      >
        <template slot-scope="scope">
            <el-button  @click.native.prevent="delCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete rightCell" style="color:red;"></i></el-tooltip></el-button>
        </template>
    </el-table-column>
    </el-table> 
  </div>
</template>

// <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import { mapState,mapGetters,mapMutations } from 'vuex'
import Bus from '../store/bus.js';
import Vue from 'vue'
// 引入柱状图

// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
  props: {
    visable:{
      type: Boolean,
      default: false
    },
     code:{
      type: String,
      default: ""
    },
    temp:{
      type: Number,
      default: 0
    },
     title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '80%'
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
   computed: {
        ...mapState({
            current: state => state.tab.currentMenu,
            nowcart: state =>state.nowcart,
        }),
       ...mapGetters(['uproduct','allCart','token','uproductname',"allparam","sysparam"])

    },
  watch: {
    code:{
    handler: function(val) {
                this.getTable(val)
              }
    },
    temp:{
    handler: function(temp) {
                this.getTable(this.code)
              }
    },
    isVisible: {
      handler: function(val) {
          console.log(val)
          console.log(this)
          if(val){
        this.getChart(this.code)
          }
      }
    },
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },
  data() {
    return {
      foflist:[],
      filter:{},
      inputVisible: false,
      nTagName: '',
      zz500:5,
      tmaxh:600,
      tlist:[{"name":"名称","code":"code1"},{"name":"名称2","code":"code2"}],
      rawlist:[],
      mult:[],
      sel:[],
      alllist:[],
      tableData:[]  
    }
  },
  methods: {
    handleInputConfirm(){
      console.log(this.nTagName)
      var message=""
      if(this.allCart[this.nTagName]){
        message="标签已存在"
      }else{
        // this.allCart[this.nTagName]='[]'
      this.$store.dispatch('addCartTag',this.nTagName).then(()=>{
      Vue.set(this,'foflist',[])
        this.nTagName=''
        this.inputVisible = false;
        console.log(this.allCart)})
      }
        this.$message({
            showClose: true,
            message: "添加标签成功",
            type: "info"
          })
    },
     delCartTag(tag) {
             this.$axios({
        url: "/sys/delcart",
        data:{"user":this.token,"name":tag}, //          
        method: "POST"
      }).then((response) => {
        this.$store.dispatch('delCartTag',tag).then(()=>Vue.set(this,'foflist',this.allCart[this.nowcart]))
        console.log(response.data)
        });
        // this.allCart.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
      },
    changeCart(row){
      this.$store.dispatch('changeCart',row)
      Vue.set(this,'foflist',this.allCart[row])
      console.log(this.foflist)
    },
    delCart(row){
      for (var key in this.foflist) {
        if (this.foflist[key].code === row.code) {
         this.foflist.splice(key, 1)
        }
  }
      this.$store.dispatch('setCart',this.foflist)
      this.updateCart()
    },
    showCart(rows){
      var codes=""
      this.sel.forEach((row)=>{
        codes=codes+row['code']+","
      })
      console.log(codes)
      Bus.$emit('cartchart',codes)

    },
    showRank(rows){
      var codes=""
      this.sel.forEach((row)=>{
        codes=codes+row['code']+","
      })
      console.log(codes)
      Bus.$emit('cartrank',codes)

    },
    showSimu(rows){
      var codes=""
      this.sel.forEach((row)=>{
        codes=codes+row['code']+","
      })
      console.log(codes)
      Bus.$emit('calcsimu',codes)
    },
    addCart(){

        // var funds=[]
        for(var code of this.mult){
            console.log(code)
            var afund=this.alllist.find((item)=>{//遍历list的数据
                    return item.code === code;//筛选出匹配数据
                })
            var old=this.foflist.find((item)=>{//遍历list的数据
                    return item.code === code;//筛选出匹配数据
                })
              console.log(old)
              if(old){
                return
              }
            this.foflist.push({code:afund["code"],name:afund["name"]})
        }
            this.$store.dispatch('setCart',this.foflist)
            this.foflist.splice(1,0)
      this.updateCart()

        // console.log(funds)
    },
    cartAction(afund){
              var old=this.foflist.find((item)=>{//遍历list的数据
                    return item.code === afund['code'];//筛选出匹配数据
                })
              console.log(old)
              if(old){
                return
              }
            this.foflist.push({code:afund["code"],name:afund["name"]})
            this.$store.dispatch('setCart',this.foflist)
            this.updateCart()
            this.foflist.splice(1,0)

    },
    updateCart(){
      this.$axios({
        url: "/sys/updatecart1",
        data:{"user":this.token,"name":this.nowcart,"codes":JSON.stringify(this.foflist)}, //          
        method: "POST"
      }).then((response) => {
            console.log(response.data)
        });
    },
      changeSub(row){
              console.log(row)
              if(row){
              var a=[]
              for (var ar of this.rawlist){
                if(ar.class_type==row)
                a.push(ar)
              }
              if(a.length>0)
              this.alllist=a
              }else{
                this.alllist=this.rawlist
              }
            },
    remoteMethod(query){
      this.$axios({
        url: "/fof/foflist",
        method: "GET",
      })
        .then((response) => {
            this.rawlist=response.data
            this.changeSub(this.filter.class_type)
            console.log("####init####")
          this.tmaxh=this.$refs.tableContainer.clientHeight-120

        })
    },
    handleSelectionChange(val) {
        this.sel = val;
      }
  },
  created(){   
    //this.changeCart(this.nowcart)
    this.remoteMethod();
},

  mounted() {
    window.addEventListener('resize', this.resizeChart)
    Bus.$on('addcart',(arg)=> {
          console.log("========add========")
          this.cartAction(arg)
  })
    Bus.$on('switchcart',(arg)=> {
          console.log(arg)
          this.changeCart(arg)
  })
  
  }
  ,
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped>
// .el-input--mini .el-input__inner {
//     width: 20%;
//   }
</style>
