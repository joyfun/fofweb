<template>
<div>
  <el-row class="home" :gutter="20">
    <!-- <el-col :span="8">
      
    </el-col> -->
    <el-col :span="24">
              <el-select v-model="cur_fof" @change="changeFOF" style="width:160px"  clearable placeholder="基金选择">
    <el-option
      v-for="item in sysparam.FOF"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
    <!-- <el-option
      key="全部"
      label="全部"
      value="SY9620,SSN818,SSN369,SSS105,STE599">
    </el-option> -->
  </el-select>
      <vxe-button v-if="usermenu.indexOf('fof-dash')>-1" @click="jumptodash">资金明细</vxe-button>
      <vxe-button v-if="usermenu.indexOf('fof-dash')>-1" @click="jumptorank">排名信息</vxe-button>
      <vxe-button v-if="usermenu.indexOf('fof-dash')>-1" @click="jumptopressure">压力测试</vxe-button>

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
          style="height: 500px"
          :code="code"
        ></fund-echart>
      </el-card>
      <el-card shadow="hover">
        <el-table
    ref="profiltTable"
    :data="profitlist"
    :span-method="cellMergep"
    tooltip-effect="dark"
    max-height="480"
    :default-sort="{prop:'year',order:'descending'}"
    style="width: 100%;margin-top:20px;">
    <el-table-column
      :label="mcols[0]"
      sortable
      prop="year"
      show-overflow-tooltip>
    </el-table-column>
        <el-table-column
      label="产品"
      sortable
      min-width="100"
      show-overflow-tooltip>
            <template slot-scope="scope">
                   {{ $tools.showName(scope.row['code'],sysparam) }}
        </template>
    </el-table-column>
    <el-table-column
    v-for=" n in 13" :key="'col'+n"
      prop="name"
      :label="mcols[n]"
      show-overflow-tooltip>
      <template slot-scope="scope">
              <span :style="'text-align:right;color:'+((scope.row[mindx[n]]&&scope.row[mindx[n]].startsWith('-'))?'green':'red') " >
                    {{ scope.row[mindx[n]] }}</span>

        </template>
     <!-- <template slot-scope="scope">{{ scope.row[mindx[n]] }}</template> -->
    </el-table-column>
    </el-table> 
      </el-card>
      <el-card shadow="hover">
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
           <el-table-column align="right"  prop="s_date" label="建仓时间"> </el-table-column>
           <el-table-column align="right"  prop="latest_date" label="净值日期"> </el-table-column>
          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->
          <el-table-column align="right"  :formatter	="formatterNum" prop="netval" label="当前净值"> </el-table-column>

          <el-table-column align="right"  :formatter	="formatterNum" prop="sumrate" label="累计收益率"> </el-table-column>
          <el-table-column  align="right" :formatter	="formatterNum" prop="profit" label="市值"> </el-table-column>

        </el-table>
      </el-card>
      <!-- <div class="graph">
                <el-card shadow="hover">
                    <echart :chartData="echartData.user" style="height: 260px"></echart>
                </el-card>
               
            </div> -->
    </el-col>
  </el-row>
</div> 
</template>

<script>
import Echart from "../../components/Echart.vue";
import FundEchart from "../../components/FundEchart.vue";
import Bus from '@/store/bus.js';
import Vue from 'vue';
import axis from "axios";
import {mapGetters} from 'vuex'

export default {
  components: {
    Echart,
    FundEchart,
  },
   computed: {
     ...mapGetters(['class_order','token','sysparam','usermenu','showFundName'])

   },
  data() {
    return {
      subsum:{},
      subresult:{},
      holdings:[],
      rawData:[],
      cur_code:"",
      cur_fof:"SY9620",
      current:{},
      mcols:["年份","一月","二月","三月", "四月","五月", "六月","七月","八月","九月", "十月", "十一月","十二月","年收益"],
      mindx:["year","m01","m02","m03","m04","m05","m06","m07","m08","m09","m10","m11","m12","vyear"],
      dialogVisible:false,
      code: "",
      subtype:"",
      tableData: [],
      profitlist:[],
      pieData:{
          action:{},
           legend: {type: 'scroll',
        top: 2,
        data: []},
          series:{     name:"资金占比",       type: 'pie',
                //   radius: ['50%', '70%'],
            avoidLabelOverlap: true,

            label: {
                formatter:(params) => {  //格式化数据的函数
            return params.name+":\n"+(params.value/10000).toFixed(1)+"万 "+params.percent+"%" 
              },
            },
    tooltip: {
        trigger: 'item',
        valueFormatter: (value) =>   (value/10000).toFixed(1)+"万"
    },
                    data:[
            
            ]}},
    subData: {
        legend: { type: "scroll", top: 2, data: [] },
        series: [{
          name: "资金占比",
          type: "pie",
          avoidLabelOverlap: true ,

        //   radius: ["0%", "60%"],
          label: {
            formatter:(params) => {  //格式化数据的函数
            return params.name+":\n"+(params.value/10000).toFixed(1)+"万 "+params.percent+"%" 
              }          },
          tooltip: {
                   trigger: 'item',
                  valueFormatter: (value) =>   (value/10000).toFixed(1)+"万"
          },
          data: [],
        }]
      },
      spanArr:[],
      pspanArr:[],
      curId: 0,

      userImg: require("../../assets/images/user.png"),

      tableLabel: {
        name: "课程",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
    };
  },
    watch: {
    cur_fof: {
      handler: function (val) {
        this.code=this.cur_fof+",000300.SH,000905.SH,000852.SH";
        this.getTableData();
      },
    }},
  methods: {
      jumptodash(){
            this.$router.push({name:'fof-dash'})  
            this.$store.commit('selectMenu',{
		"path": "/fofdash",
		"label": "资金明细",
		"name": "fof-dash",
	})},
     jumptorank(){
            this.$router.push({name:'rank-info'})  
            this.$store.commit('selectMenu',{
		"path": "/rankinfo",
		"label": "排名信息",
		"name": "rank-info",
		"icon": "setting"
	});
      },
    jumptopressure(){
            this.$router.push({name:'fund-pressure'})  
            this.$store.commit('selectMenu',{
		"path": "/fundpressure",
		"label": "压力测试",
		"name": "fund-pressure",
		"icon": "setting"
	});
      },

     arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },
      changeFOF(fofcode){},
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
          this.cur_code=""
          this.current=row
          this.cur_code=row.code
          Bus.$emit("showChart",{"cur_code":this.cur_code,"diagName":"hisChart"})
        //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
      },
            showChartByCodes(codes){
          this.cur_code=""
          this.current={}
          this.dialogVisible=true
          this.cur_code=codes
      },
      formatterNum(row, column, value) {
      if (!value) return "0.00";
      if(row.class_type=='指增' && column.label=='累计收益率')
      return this.$tools.formatMoney(value,3)+'\n(α:'+this.$tools.formatMoney(value-row['irate'],3)+'  β:'+this.$tools.formatMoney(row['irate'],3)+')'
      return this.$tools.formatMoney(value,3)
    },
    getSpanArr(data,rname) {
      var sar=[]

      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          sar.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i][rname] === data[i - 1][rname]) {
            sar[this.pos] += 1;
            sar.push(0);
          } else {
            sar.push(1);
            this.pos = i;
          }
        }
      }
      if(rname=='class_type'){
        Vue.set(this,"spanArr",sar)
      }else if(rname=='year'){
        Vue.set(this,"pspanArr",sar)
      }
    },
    getPieDataOuter(data){
        var ret=[]
        for(var idx in data){
            var row=data[idx]
            if(this.subtype){
                if(row.class_type!=this.subtype)
                {
                    continue;
                }
            }
            if(this.token=='demo'){
                row["short_name"]=row["mcode"]
                row["name"]=row["mcode"]

            }
            row["profit"]=row.amount*(row["n_netval"])
            row["sumrate"]=row["n_sumval"]/row["s_sumval"]-1

            ret.push({name:row.short_name,value:row["profit"]})
        }
        return ret;
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
    cellMergep({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.pspanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    getTableData() {
       //const acode=["SY9620","SSN818","SSN369","SSS105","STE599"]
       const acode=this.cur_fof.split(",")

        axis({
        url: "/fof/profits",
        method: "GET",
        params: {codes:this.cur_fof},
      })
        .then((response) => {
            //this.profitlist=response.data[this.cur_fof]
            let profitlist=[]
              for(var code of acode){
                if(response.data[code])
                profitlist=profitlist.concat(response.data[code])
              }
            this.profitlist=profitlist.sort((a,b)=>b['year']-a['year'])
            this.getSpanArr(this.profitlist,"year")
        }),
      axis({
        url: "/fof/summary",
        method: "GET",
        params: {fof:this.cur_fof},
      })
        .then((response) => {
          this.tableData = response.data.datas.sort((a,b)=>{
              return this.class_order.indexOf(a['class_type'])-this.class_order.indexOf(b['class_type'])
          });
          // this.subData.series[0].data=this.getPieDataOuter(this.tableData)
          // this.pieData.series.data=this.getPieData(this.tableData)
          // this.pieData.legend.data=this.getLegend(this.pieData.series.data)
          // this.$refs.piechart.initChart()   //子组件$on中的名字
          // this.subData.legend.data=this.getLegend(this.subData.series.data)
          // this.$refs.subPie.initChart()   //子组件$on中的名字
          this.getSpanArr(this.tableData,"class_type")
          
        })
        .catch((error) => {
          console.log(error);
        });

        this.changePie()
    },
    changePie(){
          if(this.subresult[this.cur_fof]){
          this.holdings= JSON.parse(JSON.stringify(this.subresult[this.cur_fof]))
          this.holdings.filter(row=> !row["type"]).forEach((srow,idx)=>{
              if(srow["code"]){
              let rt=srow["marketval"]/this.subsum[srow["code"]]
              this.subresult[srow["code"]].map(prow=>{
                  let nrow=JSON.parse(JSON.stringify(prow))
                  nrow["omarketval"]=nrow["marketval"]
                  nrow["rt"]=rt
                  nrow["marketval"]=nrow["marketval"]*rt
                  this.holdings.push(nrow)
              })
              }

          })
          
          let cdata={}
          this.holdings.map(row=>{
            row["name"]=this.showFundName(row["code"]).substring(2)
            if(row["type"]){
              let ov=cdata[row["class_type"]]
              if(!ov){
                ov=0
              }
              ov+=row["marketval"]
              cdata[row["class_type"]]=ov
            }
          })
          let chartdata=[]
          for (let key in cdata){
            chartdata.push({"name":key,"value":cdata[key]})

          }
          this.pieData.series.data=chartdata
          this.$refs.piechart.initChart()   //子组件$on中的名字
          this.subData.series[0].data=this.holdings.filter(row=>!row["rt"]).map(row=>{return {"name":row["name"],"value":row["marketval"]}})
          this.$refs.subPie.initChart() 
    }}
  },
  created() {
    axis({
        url: "/fof/holdingType",
        method: "GET"
      })
        .then((response) => {
         this.rawData=response.data
        this.subsum={}
         for(let fof of this.sysparam.FOF){
             this.subresult[fof['code']]=this.rawData.filter(row=>row['mcode']==fof['code'])
             this.subsum[fof['code']]=this.rawData.filter(row=>row['mcode']==fof['code']).reduce((preVal, row) => { return preVal + row["marketval"];}, 0)
         }
         this.changePie() 
        })
        .catch((error) => {
          console.log(error);
        });

this.pieData.action["click"]=(params)=>{
            this.$emit("mainpieClick",params)
        }
    this.getTableData();
    this.$on('mainpieClick',(arg)=> {
        this.subtype=arg.name
        this.subData.series[0].data=this.holdings.filter(row=>row["class_type"]==this.subtype).map(row=>{return {"name":row["name"],"value":row["marketval"]}})
        this.$refs.subPie.initChart() 

      })
    this.code = this.cur_fof+",000300.SH,000905.SH,000852.SH";
      Bus.$on('cartchart',(arg)=> {
          console.log("========cartchart========")
          this.showChartByCodes(arg)
         })
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
.el-table /deep/ .cell {
  white-space: pre-line;
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
