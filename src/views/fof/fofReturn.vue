<template>
<div>
  <el-row class="home" :gutter="20">
    <!-- <el-col :span="8">
      
    </el-col> -->
    <el-col :span="24">
      <!-- <div class="num">
                <el-card shadow="hover" v-for="item in countData" :key="item.name"
                         :body-style="{ display: 'flex', padding: 0 }">
                    <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
                    <div class="detail">
                        <p class="num">￥ {{ item.value }}</p>
                        <p class="txt">{{ item.name }}</p>
                    </div>
                </el-card>
            </div> -->

      <el-card shadow="hover">
        <fund-echart
          ref="hischart"
          dstartdate="20210101"
          cb="chgReturn"
          style="height: 500px"
          :code="code"
        ></fund-echart>
      </el-card>
      <el-card shadow="hover">
          <el-form :inline="true" class="demo-form-inline">
  <el-form-item label="名称">
    <el-input v-model="dname" placeholder="名称"></el-input>
  </el-form-item>
  <el-form-item label="回撤开始">
    <el-input v-model="start" placeholder="开始"></el-input>
  </el-form-item>
  <el-form-item label="回撤结束">
    <el-input v-model="end" placeholder="结束"></el-input>
  </el-form-item>
  <el-form-item label="最大回撤">
    <el-input v-model="lrate" placeholder="回撤"></el-input>
  </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="getTableData">查询</el-button>
  </el-form-item>

</el-form>
        <!-- <echart           ref="piechart"
:chartData="pieData"  style="height: 260px" :isAxisChart="false"></echart> -->
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
      </el-card>
      <el-card shadow="hover">
        <el-table
          :data="tableData"
          :span-method="cellMerge"
          :summary-method="getSummaries"
          show-summary
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="class_type" label="类型"> </el-table-column>
          <el-table-column prop="short_name" label="名称">     <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.short_name }}</a></template>
 </el-table-column>
           <el-table-column align="right"  prop="s_date" label="初始日期"> </el-table-column>
           <el-table-column align="right"  prop="s_sumval" label="初始净值"> </el-table-column>
          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->
           <el-table-column align="right"  prop="e_date" label="净值日期"> </el-table-column>
          <el-table-column align="right"  :formatter	="formatterNum" prop="e_sumval" label="当前净值"> </el-table-column>

          <el-table-column align="right"  :formatter	="formatterNum" prop="sumrate" label="累计收益率"> </el-table-column>
          <el-table-column  align="right" :formatter	="formatterNum" prop="profit" label="盈利"> </el-table-column>

        </el-table>
      </el-card>
      <!-- <div class="graph">
                <el-card shadow="hover">
                    <echart :chartData="echartData.user" style="height: 260px"></echart>
                </el-card>
               
            </div> -->
    </el-col>
  </el-row>
   <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >  <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  style="height: 600px"  :code="cur_code"  :visable="dialogVisible"></fund-echart>
    </el-dialog>
</div> 
</template>

<script>
import Echart from "../../components/Echart.vue";
import FundEchart from "../../components/FundEchart.vue";
import axis from "axios";
import {mapGetters} from 'vuex'
import Bus from '@/store/bus.js';

export default {
  components: {
    Echart,
    FundEchart,
  },
   computed: {
     ...mapGetters(['class_order'])
   },
  data() {
    return {
      cur_code:"",
      dname:"",
      start:"",
      end:"",
      lrate:"",
      current:{},
      dialogVisible:false,
      cur_code:"",
      code: "",
      subtype:"",
      tableData: [],
      pieData:{
          action:{},
          title:{
        text: '盈利占比',
        left: '25%',
        textAlign: 'center'
    },  
           legend: {type: 'scroll',
        top: 2,
        data: []},
          series:{     name:"盈利明细",     type: 'pie',
                //   radius: ['50%', '70%'],
            avoidLabelOverlap: false,

            label: {
                formatter:(params) => {  //格式化数据的函数
            return params.name+":\n"+(params.value/10000).toFixed(1)+"万 "+params.percent+"%" 
              },
            },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
                    data:[
            
            ]}},
    subData: {
        legend: { type: "scroll", top: 2, data: [] },
         title:{
        text: '亏损占比',
        left: '25%',
        textAlign: 'center'
    }, 
        series: [{
          name: "亏损明细",
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
      },
      spanArr:[],
      curId: 0,
    };
  },
  methods: {
      getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				 if (index === 0) {
				   sums[index] = '合计';
				   return;
				 }
				 const values = data.map(item => Number(item[column.property]));
				     if (column.property === 'profit' ) {
							sums[index] = this.$tools.formatMoney(values.reduce((prev, curr) => {
							 const value = Number(curr);
							 if (!isNaN(value)) {
							   return prev + curr;
							 } else {
							   return prev;
							 }
							}, 0),2);
							sums[index];
 
				     }
				});
				return sums
	    	},
       editClose() {
        this.dialogVisible = false
        },
         showHis(row){
          console.log(row)
          this.cur_code=""
          this.current=row
          this.dialogVisible=true
          this.cur_code=row.code
        //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
      },
      formatterNum(row, column, value) {
      if (!value) return "0.00";
      return this.$tools.formatMoney(value,2)
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
    getPieDataOuter(data){
        var lret=[]
        var rret=[]

        for(var row of data){
            row["profit"]=row.amount*(row["e_sumval"]-row["s_sumval"])
            row["sumrate"]=row["e_sumval"]/row["s_sumval"]-1
            if(row["profit"]>0){
            lret.push({name:row.short_name,value:row["profit"]})

            }else if(row["profit"]<0){
            rret.push({name:row.short_name,value:-row["profit"]})

            }
        }
        return {left:lret,right:rret};
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
    },
    getLegend(data){
        var ret=[]
        for (var idx in data){
            ret.push(data[idx].name)
        }
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
    getTableData() {
      axis({
        url: "/fof/return",
        method: "GET",
        params: {"start":this.start,"end":this.end},
      })
        .then((response) => {
          this.tableData = response.data.sort((a,b)=>{
              return this.class_order.indexOf(a['class_type'])-this.class_order.indexOf(b['class_type'])
          });
          var cash=this.tableData.splice(0,1);
          var pieResult=this.getPieDataOuter(this.tableData)
          console.log(pieResult)
          this.subData.series[0].data=pieResult.right
          this.pieData.series.data=pieResult.left
          this.pieData.legend.data=this.getLegend(pieResult.left)
          this.$refs.piechart.initChart()   //子组件$on中的名字

          this.subData.legend.data=this.getLegend(pieResult.right)
          this.$refs.subPie.initChart()   //子组件$on中的名字

          this.getSpanArr(this.tableData)
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
this.pieData.action["click"]=(params)=>{
            this.$emit("mainpieClick",params)
        }
    //this.getTableData();
    Bus.$on('chgReturn',(arg)=> {
        console.log(arg)
        this.start=arg.start
        this.end=arg.end
        this.dname=arg.name
        this.lrate=arg.lrate
        this.getTableData()
      })
    this.code = "FOF,000300.SH,000905.SH,000852.SH";
  },
};
</script>

<style lang="scss" scoped>

.tab-tit {
  font-size: 0;
  width: 345px;
}

.tab-tit a {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  width: 25%;
  text-align: center;
  background: #ccc;
  color: #333;
  text-decoration: none;
}

.tab-tit .cur {
  background: #09f;
  color: #fff;
}

.tab-con div {
  border: 1px solid #ccc;
  height: 450px;
  width: 345px;
  padding-top: 20px;
}
</style>
