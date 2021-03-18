<template>
<div>
    <el-button-group>
  <el-button type="primary" @click="changeDate(-30)">近30天</el-button>
  <el-button type="primary" @click="changeDate(-90)">近3月</el-button>
  <el-button type="primary" @click="changeDate(-180)">近180天</el-button>
  <el-button type="primary" @click="changeDate(-365)">近365天</el-button>
{{"自" + filter.start +"开始"}}
</el-button-group>
<el-select v-model="filter.class_type" @change="getTableData"  style="width:100px"   placeholder="类型">
    <el-option
      v-for="item in class_types"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>    

     <el-select v-model="filter.left" @change="getTableData" style="width:100px"   placeholder="阶段一">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-select v-model="filter.right" @change="getTableData" style="width:100px"   placeholder="阶段二">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
<!-- <el-row>
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
</el-row> -->
<el-card>
  <el-table
          :data="tableData"
          border
          style="width: 100%; margin-top: 20px"
        >
          

          <el-table-column prop="short_name" label="名称">      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.short_name }}</a></template>
</el-table-column>
<el-table-column prop="class_type" label="类型"> </el-table-column>

<el-table-column prop="sub_type" sortable label="子类型"> </el-table-column>
          <el-table-column prop="stage" label="阶段"> </el-table-column>
          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->
          <el-table-column align="right"  :formatter	="formatterNum" prop="netval" label="净值"> </el-table-column>
         <el-table-column  align="right"      sortable :formatter 	="formatterNum" prop="rate" label="收益率"> </el-table-column>

          <!-- <el-table-column  align="right"      sortable :formatter 	="formatterNum" prop="rate" label="收益率"> </el-table-column> -->

          <!-- <el-table-column  align="right" :formatter	="formatterNum" prop="profit" label="盈利"> </el-table-column> -->

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
  props: {pfilter:{
      type: Object,
      default:null
    },},
  data() {
    return {
      tableData: [],
      spanArr:[],
      dict:{},
      current:{},
      subtype:"",
      cur_code:"",
      dialogVisible: false,
      filter:{
              class_type:"CTA",
              left:"",
              right:"已投",
              start:""
              },
          options: [{
          value: '预选',
          label: '预选'
        }, {
          value: '二选',
          label: '二选'
        }, {
          value: '备投',
          label: '备投'
        }, {
          value: '已投',
          label: '已投'
        }],
        class_types: [{
          value: 'CTA',
          label: 'CTA'
        }, {
          value: '指增',
          label: '指增'
        }, {
          value: '中性',
          label: '中性'
        }, {
          value: '套利',
          label: '套利'
        }, {
          value: '混合',
          label: '混合'
        }]
        
    }
  },
  watch: {
     pfilter:{
    handler: function(val) {
                this.filter = JSON.parse(JSON.stringify(this.pfilter));
              }
    },
    $route: {
      handler(n) {
                console.log(n)
                this.filter = JSON.parse(JSON.stringify(this.pfilter));
      }}
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
        this.filter.start=vday
        this.getTableData()
    },
    getPieDataOuter(data){
        var ret=[]
        for(var idx in data){
            var row=data[idx]
            console.log(row)
            row["profit"]=row.amount*(row.n_sumval-row.s_sumval)
            row["rate"]=(row.n_sumval-row.s_sumval)/row.s_sumval

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
        params: this.filter,
      })
        .then((response) => {
          this.filter.start=response.data.start
          this.tableData = response.data.datas;
          this.getPieDataOuter(this.tableData)


        //   console.log(this.tableData)
            //子组件$on中的名字
        //   this.getSpanArr(this.tableData)

        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.filter = JSON.parse(JSON.stringify(this.pfilter));

    this.getTableData();
    // this.$on('pieClick',(arg)=> {
    //       console.log('on监听参数====',arg)  //['string',false,{name:'vue'}]
    //     this.subtype=arg.name
    //     // console.log(this.getPieDataOuter(this.tableData))
    //     this.subData.series[0].data=this.getPieDataOuter(this.tableData)
    //     this.subData.legend.data=this.getLegend(this.subData.series.data)

    //       this.$refs.subPie.initChart() 

    //   })

    this.code = "FOF,000300.SH,000905.SH";
  },
};
</script>
