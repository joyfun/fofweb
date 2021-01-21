<template>
<div>
    <el-button-group>
  <el-button type="primary" @click="changeDate(-7)" >近7天</el-button>
  <el-button type="primary" @click="changeDate(-30)">近30天</el-button>
  <el-button type="primary" @click="changeDate(-180)">近180天</el-button>
  <el-button type="primary" @click="changeDate(-365)">近365天</el-button>
{{"自" + startDate +"开始"}}
</el-button-group>
  <!-- <echart
    ref="barchart"
    :chartData="barData"
    style="height: 480px"
    :isAxisChart="false"
  ></echart> -->
<el-card>
  <el-table
          :data="tableData"
          :span-method="cellMerge"
          show-summary
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="class_type" label="类型"> </el-table-column>
          <el-table-column prop="short_name" label="名称">      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.short_name }}</a></template>
</el-table-column>
          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->
          <el-table-column align="right"  :formatter	="formatterNum" prop="netval" label="当前净值"> </el-table-column>
          <el-table-column  align="right" :formatter	="formatterNum" prop="rate" label="增长%"> </el-table-column>

        </el-table>
</el-card>
 <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
    <fund-echart       ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"  :visable="dialogVisible"></fund-echart>
    </el-dialog>
</div>
</template>

  <script>
import Echart from "../../components/Echart.vue";
import FundEchart from "../../components/FundEchart.vue";
import axis from "axios";

export default {
  components: {
    Echart,
    FundEchart,
  },
  data() {
    return {
      tableData: [],
      startDate:"",
      spanArr:[],
      current:{},
      cur_code:"",
      dialogVisible: false,
      barData:  {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
},
    };
  },
    methods: {
         showHis(row){
          this.current=row
          this.dialogVisible=true
          this.cur_code=row.code
        //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
      },
         formatterNum(row, column, value) {
      if (!value) return "0.00";
      return this.$tools.formatMoney(value,2)
    },
    changeDate(num){

        var vday=this.$moment().add(num,"d").format("YYYYMMDD")
        this.startDate=vday
        this.getTableData({"start":vday})
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
         getPieData(data){
        var dict={};
        for(var idx in data){
            var row=data[idx]
            if(dict[row.class_type]){
                dict[row.class_type]+=row["profit"]
            }else{
                dict[row.class_type]=row["profit"]
            }
        }
        var ret=[]
        for(var cls in dict){
            ret.push({name:cls,value:dict[cls]})
        }
        return ret;
    },getPieDataOuter(data){
        var ret=[]
        for(var idx in data){
            var row=data[idx]
            row["profit"]=row.amount*(row.n_sumval-row.s_sumval)
            row["rate"]=(row.n_sumval/row.s_sumval-1)*100

            ret.push({name:row.name,value:row["profit"]})
        }
        return ret;
    },
     getLegend(data){
        var ret=[]
        for (var idx in data){
            ret.push(data[idx].name)
        }
    },
    getSpanArr(data) {
        this.spanArr=[]
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].class_type === data[i - 1].class_type) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
      console.log(this.spanArr)
    },
getTableData(param) {
        
      axis({
        url: "/fof/summary",
        method: "GET",
        params: param,
      })
        .then((response) => {
          this.startDate=response.data.start
          this.tableData = response.data.datas;
          this.getPieDataOuter(this.tableData)
          this.tableData=this.tableData.sort((a,b)=>{
                if(a.class_type>b.class_type )
              return 1
              else if(a.class_type==b.class_type)
              return b.rate-a.rate
              else return -1
            //   if(a.class_type>b.class_type )
            //   return true
            //   else if(a.class_type==b.class_type &&a.rate>b.rate)
            //   return true
            //   return false
          })
          console.log(this.tableData)
        //   this.pieData.series[1].data=this.getPieDataOuter(this.tableData)
        //   this.pieData.series[0].data=this.getPieData(this.tableData)

        //   this.pieData.legend.data=this.getLegend(this.pieData.series.data)
        //   console.log(this.pieData.legend)
        //   this.$refs.barchart.initChart() 
        //   console.log(this.tableData)
        //     //子组件$on中的名字
          this.getSpanArr(this.tableData)

        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getTableData();
    this.code = "FOF,000300.SH,000905.SH";
  },
};
</script>
