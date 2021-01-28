<template>
<div>
    <el-button-group>
  <el-button type="primary" @click="changeDate(-7)" >近7天</el-button>
  <el-button type="primary" @click="changeDate(-30)">近30天</el-button>
  <el-button type="primary" @click="changeDate(-180)">近180天</el-button>
  <el-button type="primary" @click="changeDate(-365)">近365天</el-button>
{{"自" + startDate +"开始"}}
</el-button-group>
<el-row>
    <el-col :span="12">
  <echart
    ref="piechart"
    :chartData="pieData"
    style="height: 480px"
    :isAxisChart="false"
  ></echart>
    </el-col>
     <el-col :span="12">
  <echart
    ref="subPie"
    :chartData="subData"
    style="height: 480px"
    :isAxisChart="false"
  ></echart>
    </el-col>
</el-row>
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
          <el-table-column align="right"  :formatter	="formatterNum" prop="netval" label="净值"> </el-table-column>
          <el-table-column  align="right" :formatter	="formatterNum" prop="profit" label="盈利"> </el-table-column>

        </el-table>
</el-card>
 <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
    <fund-echart        ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"  :visable="dialogVisible"></fund-echart>
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
      dict:{},
      current:{},
      subtype:"",
      cur_code:"",
      dialogVisible: false,
      pieData: {
        legend: { type: "scroll", top: 2, data: [] },
        action:{},
        series: [{
          name: "资金占比",
          type: "pie",
        //   radius: ["0%", "100%"],
          avoidLabelOverlap: false,

          label: {
            formatter:(params) => {  //格式化数据的函数
            return params.name+":\n"+(params.value/10000).toFixed(1)+"万 "+params.percent+"%" 
              },
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          data: [],
        }]
      },
      subData: {
        legend: { type: "scroll", top: 2, data: [] },
        series: [{
          name: "资金占比",
          type: "pie",
        //   radius: ["0%", "60%"],
          avoidLabelOverlap: false,

          label: {
            formatter:(params) => {  //格式化数据的函数
            return params.name+":\n"+(params.value/10000).toFixed(1)+"万 "+params.percent+"%" 
              }          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          data: [],
        }]
      }
    };
  },
  watch: {
    // subtype:{
    // handler: function(subtype) {
    //             this.getTable(val)
    //           }
    // }
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
             

        this.dict={};
        for(var idx in data){
            var row=data[idx]
            if(this.dict[row.class_type]){
                this.dict[row.class_type]+=row["profit"]
            }else{
                this.dict[row.class_type]=row["profit"]
            }
        }
        var ret=[]
        for(var cls in this.dict){
            ret.push({name:cls,value:this.dict[cls]})
        }
        return ret;
    },getPieDataOuter(data){
        var ret=[]
        for(var idx in data){
            var row=data[idx]
            if(this.subtype){
                if(row.class_type!=this.subtype)
                {
                    continue;
                }
            }
            row["profit"]=row.amount*(row.n_sumval-row.s_sumval)
            ret.push({name:row.name,value:row["profit"]})
        }
        return ret;
    },
     getLegend(data,class_type){
        var ret=[]

        for (var idx in data){
            // if(!class_type||data[idx]['class_type']==class_type)
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
          this.subData.series[0].data=this.getPieDataOuter(this.tableData)
          this.subData.legend.data=this.getLegend(this.subData.series.data)
          this.pieData.series[0].data=this.getPieData(this.tableData)

          this.pieData.legend.data=this.getLegend(this.pieData.series.data)
        //   console.log(this.pieData.legend)
          console.log(this.pieData.action)
          this.$refs.piechart.initChart() 
          this.$refs.subPie.initChart() 
        //   console.log(this.tableData)
            //子组件$on中的名字
          this.getSpanArr(this.tableData)

        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
      this.pieData.action["click"]=(params)=>{
            this.$emit("pieClick",params)
        }
    this.getTableData();
    this.$on('pieClick',(arg)=> {
          console.log('on监听参数====',arg)  //['string',false,{name:'vue'}]
        this.subtype=arg.name
        // console.log(this.getPieDataOuter(this.tableData))
        this.subData.series[0].data=this.getPieDataOuter(this.tableData)
        this.subData.legend.data=this.getLegend(this.subData.series.data)

          this.$refs.subPie.initChart() 

      })

    this.code = "FOF,000300.SH,000905.SH";
  },
};
</script>
