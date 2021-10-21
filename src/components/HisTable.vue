<template>

  <div>

 <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">      <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
  <el-button v-show="temp==1" @click="confirmData">确认数据</el-button>
        </div>
 </div>
    <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    max-height="480"
    style="width: 100%;margin-top:20px;">
    <el-table-column
      prop="date"
      label="日期"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column
      prop="net_val"
      label="当前净值"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.net_val }}</template>
    </el-table-column>
    <el-table-column
      prop="sumval"
      label="累计净值"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.sumval }}</template>
    </el-table-column>
    </el-table>
  </div>
</template>

// <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import axis from 'axios'
import DB from '@/store/localapi.js';
var echarts = require('echarts');
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
      raw_data:{},
      startidx:0,
      max_date:'',
    //   width: this.initWidth(),
      echart: null,
      tableData:[]  
    }
  },
  methods: {
    confirmData(){
         var $this=this
         axis.get('/fof/confirm',{params:{code:this.code}})//axis后面的.get可以省略；
                        .then((response) => {
                            if(response.data.status=="success")
                            $this.getTable(this.code)
                        })
    },
    getTable(code){
              if(code&&code.length>2){
              console.log("refresh chart:"+code)
              var param={"code":code}
              console.log(this.temp)
              if(this.temp){
                  param["temp"]=this.temp
              }
              var $this=this
              if(this.$isElectron){
                   $this.tableData=[]
                  const stmt = DB.prepare('SELECT * FROM fund_val where code=?');
                  var hisData = stmt.all(code);
                   var len=hisData.length
                                console.log(len)
                                for (var i =len ;i>0;i--){
                                this.tableData.push(
                                   hisData[i-1]
                                )
                                }
                  }
              else{

              
              axis.get('/fof/his',{params:param})//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                $this.tableData=[]
                                var len=response.data.datas.length
                                console.log(len)
                                for (var i =len ;i>0;i--){
                                $this.tableData.push({
                                    date:response.data.datas[i-1][0],
                                    code:response.data.datas[i-1][1],
                                    net_val:response.data.datas[i-1][2],
                                    sumval:response.data.datas[i-1][3]
                                })
                                }
                                console.log($this.tableData.length)

                                // $this.tableData=response.data.datas
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });}
          }

      },
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.getTable(this.code)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
