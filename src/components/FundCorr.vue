<template>

  <div>

 <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">      <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
  <el-button  @click="downCorr">下载</el-button>
        </div>
 </div>
    <el-table
    ref="multipleTable"
    :data="corrdata"
    tooltip-effect="dark"
    max-height="600"
    :cell-style="cellStyle"
    style="width: 100%;margin-top:20px;">
    <el-table-column 
      prop="idx"
      label="名称"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ funds[scope.row['idx']] }}</template>
    </el-table-column>
    <el-table-column :key="fund" v-for="(name,fund)  in funds"
      :prop="fund"
      :label="name"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ showResult(scope.row[fund]) }}</template>
    </el-table-column>

    </el-table>
  </div>
</template>

// <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import axis from 'axios'
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
        console.log(val)
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
      corrdata:[],
      funds:{},
      startidx:0,
      max_date:'',
    //   width: this.initWidth(),
      echart: null,
      tableData:[]  
    }
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
            console.log(row)
            if (row.column.label == "事件告警信息" || row.column.label == "性能告警信息"  ) {
                return "color:#FF747B";
            }
            if(row.column.label == "系统状态" && row.row.equStatus == "正常" ){
                 return "color:#08AD2B";
            }
            if(row.column.label == "均衡状态" && row.row.equStatus == "正常" ){
                 return "color:#08AD2B";
            }
        },
    showResult(number,rate=1){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,3)
    },
    downCorr(){
    var url="/fof/down_corr"
        const options = {"code":this.code}
        this.$tools.exportExcel(url,options)
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
              axis.get('/fof/corr',{params:param})//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                console.log(response.data)
                                this.funds=response.data.funds
                                this.ocorr=response.data.corrs
                                var ret=[]
                                for (var key in this.ocorr) {
                                    this.ocorr[key]["idx"]=key
                                    ret.push(this.ocorr[key])
                                }
                                this.corrdata=ret
                                console.log(this.corrdata)

                                // $this.tableData=response.data.datas
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
          }

      },
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.getTable(this.code)
  },
//   destroyed() {
//     window.removeEventListener('resize', this.resizeChart)
//   }
}
</script>

<style lang="scss" scoped></style>
