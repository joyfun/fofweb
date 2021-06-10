<template>

  <div>

 <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">      <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
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
      v-for="item in foflist"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
       <el-button type="primary"   size="small" @click="addCart">添加</el-button>
          </div>
 </div>
 
  
    <!-- --><el-table
    ref="multipleTable"
    :data="foflist"
    tooltip-effect="dark"
    max-height="480"
    style="width: 100%;margin-top:20px;">
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
            <el-button  @click.native.prevent="delCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>
        </template>
    </el-table-column>
    </el-table> 
  </div>
</template>

// <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import { mapState,mapGetters } from 'vuex'
import axis from 'axios'
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
            current: state => state.tab.currentMenu
        }),
       ...mapGetters(['uproduct','uproductname']),

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
      zz500:5,
      tlist:[{"name":"名称","code":"code1"},{"name":"名称2","code":"code2"}],
      mult:[],
      tableData:[]  
    }
  },
  methods: {
    delCart(code){},
    addCart(){
        var funds=[]
        for(var code of this.mult){
            console.log(code)
            var afund=this.foflist.find((item)=>{//遍历list的数据
                    return item.code === code;//筛选出匹配数据
                })
            funds.push(afund.name)
        }
        console.log(funds)
    },
    remoteMethod(query){
                this.$axios({
        url: "/fof/foflist",
        method: "GET",
        params: {},
      })
        .then((response) => {
            this.foflist=response.data
            console.log(this.foflist)

        })
    },
  },
  created(){    this.remoteMethod();
},

  mounted() {
    window.addEventListener('resize', this.resizeChart)

  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped>

</style>
