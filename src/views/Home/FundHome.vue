<template>
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
          style="height: 500px"
          :code="code"
        ></fund-echart>
      </el-card>
      <el-card shadow="hover">
        <echart           ref="piechart"
:chartData="pieData"  style="height: 260px" :isAxisChart="false"></echart>
      </el-card>
      <el-card shadow="hover">
        <el-table
          :data="tableData"
          :span-method="cellMerge"
          show-summary
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="class_type" label="类型"> </el-table-column>
          <el-table-column prop="short_name" label="名称"> </el-table-column>
          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->
          <el-table-column align="right"  :formatter	="formatterNum" prop="netval" label="净值"> </el-table-column>
          <el-table-column  align="right" :formatter	="formatterNum" prop="val" label="市值"> </el-table-column>

        </el-table>
      </el-card>
      <!-- <div class="graph">
                <el-card shadow="hover">
                    <echart :chartData="echartData.user" style="height: 260px"></echart>
                </el-card>
               
            </div> -->
    </el-col>
  </el-row>
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
      code: "",
      tableData: [],
      pieData:{
           legend: {type: 'scroll',
        top: 2,
        data: []},
          series:{     name:"资金占比",       type: 'pie',
                  radius: ['50%', '70%'],
            avoidLabelOverlap: false,

            label: {
                formatter: '{b} : {c} ({d}%)',
            },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
                    data:[
            
            ]}},
      spanArr:[],
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
  methods: {
      formatterNum(row, column, value) {
      if (!value) return "0.00";
      return this.formatMoney(value,2)
    },
   formatMoney(number, decimals = 0, decPoint = '.', thousandsSep = ',') {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  const dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  let s = ''
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
},
    getSpanArr(data) {
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
    getPieData(data){
        var dict={};
        for(var idx in data){
            var row=data[idx]
            if(dict[row.class_type]){
                dict[row.class_type]+=row.val
            }else{
                dict[row.class_type]=row.val
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
        url: "/fof/summary",
        method: "GET",
        params: {},
      })
        .then((response) => {
          this.tableData = response.data.datas;
          this.pieData.series.data=this.getPieData(this.tableData)
          this.pieData.legend.data=this.getLegend(this.pieData.series.data)
          console.log(this.pieData.legend)
          this.$refs.piechart.initChart()   //子组件$on中的名字

          this.getSpanArr(this.tableData)
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getTableData();
    this.code = "FOF";
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/home";

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
