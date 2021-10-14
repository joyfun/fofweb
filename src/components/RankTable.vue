<template>
  <div>
<el-radio-group v-model="range">
  <el-radio-button type="primary" :key="i"  :label="i" icon="el-icon-edit" v-for="(item,i) in tags">{{item}}</el-radio-button>
</el-radio-group>
   <el-table
      ref="multipleTable"
      :data="tableData"
      :max-height="tmaxh"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
    >  

      <el-table-column
        prop="基金名称"
        width="120"
        sortable
        label="基金名称"
        show-overflow-tooltip
      >

        <template slot-scope="scope">
          <!-- <a href="javascript:;" @click="showHis(scope.row)"> -->
                       <el-button  @click.native.prevent="addCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>

              {{ scope.row["name"] }}
            <!-- </a> -->
            </template>
      </el-table-column>
                <el-table-column 
        prop="class_type"
        sortable
        label="类型"
        show-overflow-tooltip
      >
      </el-table-column>
 
      <el-table-column :key="col + wts[idx]" v-for="(col,idx) in cols">
        <template slot="header"><el-input   v-model="wts[idx]" :placeholder="col" clearable  ></el-input></template>
            <el-table-column 
        :prop="col"
        width="80"
        sortable
        :label="names[idx]"
        show-overflow-tooltip
      >      <template slot-scope="scope">{{ scope.row[col] }}</template>
      </el-table-column>
      </el-table-column>

 <el-table-column>
              <template slot="header"><el-button size="mini" @click="calc_score">打分</el-button></template>
                 <el-table-column 
        prop="score"
        sortable
        label="score"
        show-overflow-tooltip
      >
            <template slot-scope="scope">
          <!-- <a href="javascript:;" @click="showHis(scope.row)"> -->
            {{showResult(scope.row["score"],1)}}
            <!-- </a> -->
            </template>
      </el-table-column>
      </el-table-column>
      <el-table-column 
        prop="length"
        sortable
        label="数据长度"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>
 <script>
// import echarts from 'echarts'
import Vue from 'vue'
import Bus from '../store/bus.js';

export default {
  props: {
     code:{
      type: String,
      default: ""
    },
     title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '80%'
    },

  },
  watch: {
    code:{
    handler: function(val) {
                this.getTable()
              }
    },
    // wts:{
    // handler: function(val) {
    //             console.log(val)
    //             this.forceUpdate()
    //           }
    // }, 
    range:{
    handler: function(val) {
                this.getTable()
              }
    },
  },
  data() {
    return {
      range:3,
      tmaxh:720,
      limit_dic:{'sharpe': 3, 'calmar': 5, 'sortino': 5, 'yeaily_return': 0.7},
      wts: [0, 2, 1, 0.5, -1, 0, 1, 0],
      wtsdict:{'yeaily_return':1, 'sharpe':2, 'calmar':1, 'sortino':3, 'dd':1, 'dd_week':2, 'win_ratio':2, 'volatility':1},
      tableData:[],
      tags: ["近一月","近季度","近半年","近一年","近2年","近3年","全部","今年","去年","前年"],
      cols: ['yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility'],
      names: ['年化收益', 'sharpe', 'calmar', 'sortino', '最大回撤', '回撤(周)', '胜率', '波动率']
    }
  },
  methods: {
    addCart(row){
      if(row['fundname']){
        row['code']=row['fundname']
        Bus.$emit("addcart",row)
      }
    },
    showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        return this.$tools.formatMoney(number*rate,3)
    },
    calc_score(){
      var rawdata = JSON.parse(JSON.stringify(this.tableData));
      for(var ret_df of rawdata){
      //去极值
      for(var item in this.limit_dic){
          ret_df[item] = (ret_df[item] >= this.limit_dic[item]) * this.limit_dic[item] + (ret_df[item] < this.limit_dic[item]) * ret_df[item]

        }
      }
    //求最大值
    var maxmin={}
    for (var item of this.cols){
      maxmin[item+"_max"]=-99
      maxmin[item+"_min"]=99
            for(var row of rawdata){
              if(row[item]>maxmin[item+"_max"]){
                   maxmin[item+"_max"]=row[item]
              }
              if(row[item]<maxmin[item+"_min"]){
                   maxmin[item+"_min"]=row[item]
              }
            }
    }
    for (var item of this.cols){
     maxmin[item+"_diff"]=maxmin[item+"_max"]-maxmin[item+"_min"]
    }
    for(var ridx in rawdata){ 
      var row=rawdata[ridx]
      var ascore=0
       for (var idx in this.cols){
         var item=this.cols[idx]
         var diff=maxmin[item+"_diff"]
         if(diff==0){
           diff=1
         }
        row[item]=(row[item]-maxmin[item+"_min"])/diff
        ascore+=row[item]*this.wts[idx]
       }
       this.tableData[ridx]['score']=ascore
    }
    // console.log(rawdata)
    // console.log(this.wts)
    // console.log(this.tableData)
      this.$refs.multipleTable.clearSort()
      this.$refs.multipleTable.sort('score', 'descending')

    },
    wtsUpdate(event,idx){
      console.log(event)
      Vue.set(this.wts,idx,parseFloat(event))
      this.$forceUpdate();
      return parseFloat(event)
        },
    getTable(){
        var $this=this
        var param={code:this.code,range:this.range}
        this.$axios.get('/fof/fundrank',{params:{code:this.code,range:this.range}})//axis后面的.get可以省略；
            .then(
                (response) => {
                    $this.tableData=this.$tools.pandasToJson(response.data)
                    this.calc_score()
                })
            .catch(
                (error) => {
                    console.log(error);
        });
    }
  },
  created(){
    
    this.getTable()
  },
  mounted() {

    window.addEventListener('resize', this.resizeChart)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
