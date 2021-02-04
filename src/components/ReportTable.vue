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
      style="width: 100%; margin-top: 20px"
    >
      <!--    @row-click = "Selection"-->

      <el-table-column type="selection" width="55"> </el-table-column>
      <!--      测试ID-->
     <!--  <el-table-column
      prop="基金代码"
      label="基金代码"
      width="100">
      <template slot-scope="scope">{{ scope.row["基金代码"]}}</a></template>
    </el-table-column>
      用例编号-->
      <el-table-column
        prop="基金名称"
        width="160"
        label="基金名称"
        show-overflow-tooltip
      >
        <template slot-scope="scope"
          ><a href="javascript:;" @click="showHis(scope.row)">{{
            scope.row["基金名称"]
          }}</a></template
        >
      </el-table-column>
       <el-table-column
        prop="类型"
        width="80"
        label="类型"
        sortable
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['类型'] }}</template>

      </el-table-column>
      <!--      测试项目-->
      <!--      测试用例是否关联-->
      <!--      测试输入-->
      <el-table-column
        prop="本周收益"
        label="本周收益"
        align="right" 
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
              <span :style="'text-align:right;color:'+(scope.row['本周收益']>=0?'red':'green') " >
                    {{showResult(scope.row["本周收益"])}}</span>

        </template>
      </el-table-column>
      <el-table-column
        prop="当月收益"
        label="当月收益"
        align="right" 
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
              <span :style="'text-align:right;color:'+(scope.row['当月收益']>=0?'red':'green') " >
                    {{showResult(scope.row["当月收益"])}}</span>

        </template>
      </el-table-column>
      <el-table-column prop="当年收益" label="当年收益" align="right"  show-overflow-tooltip>
        <template slot-scope="scope">
                          <span :style="'text-align:right;color:'+(scope.row['当年收益']>=0?'red':'green') " >
{{
          showResult(scope.row["当年收益"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="近6月收益" label="近6月收益" show-overflow-tooltip>
        <template slot-scope="scope">
                         <span :style="'text-align:right;color:'+(scope.row['近6月收益']>=0?'red':'green') " >
{{
          showResult(scope.row["近6月收益"])
        }}</span></template>
      </el-table-column>
      <el-table-column
      align="right" 
        prop="近12月收益"
        label="近12月收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope"><span :style="'text-align:right;color:'+(scope.row['近12月收益']>=0?'red':'green') " >{{
          showResult(scope.row["近12月收益"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2020" label="2020" show-overflow-tooltip>
        <template slot-scope="scope">
                <span :style="'text-align:right;color:'+(scope.row['2020']>=0?'red':'green') " >
{{
          showResult(scope.row["2020"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2019" label="2019" show-overflow-tooltip>
        <template slot-scope="scope">
            <span :style="'text-align:right;color:'+(scope.row['2019']>=0?'red':'green') " >{{
          showResult(scope.row["2019"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2018" label="2018" show-overflow-tooltip>
        <template slot-scope="scope">
            <span :style="'text-align:right;color:'+(scope.row['2018']>=0?'red':'green') " >{{
          showResult(scope.row["2018"])
        }}</span></template>
      </el-table-column>
      <!--过去3年年均收益	夏普比率	卡玛比率	最大回撤-->
      <el-table-column
      align="right" 
        prop="过去3年年均收益"
        label="过去3年年均收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
                    <span :style="'text-align:right;color:'+(scope.row['过去3年年均收益']>=0?'red':'green') " >{{
          showResult(scope.row["过去3年年均收益"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="夏普比率" label="夏普比率" show-overflow-tooltip>
        <template slot-scope="scope">
                                <span :style="'text-align:right;color:'+(scope.row['夏普比率']>=0?'red':'green') " >{{

          showResult(scope.row["夏普比率"],1)
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="波动率" label="波动率" show-overflow-tooltip>
        <template slot-scope="scope">
                                <span :style="'text-align:right;color:'+(scope.row['波动率']>=0?'red':'green') " >{{

          showResult(scope.row["波动率"],1)
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="卡玛比率" label="卡玛比率" show-overflow-tooltip>
        <template slot-scope="scope">
                 <span :style="'text-align:right;color:'+(scope.row['卡玛比率']>=0?'red':'green') " >{{

          showResult(scope.row["卡玛比率"],1)
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="最大回撤" label="最大回撤" show-overflow-tooltip>
        <template slot-scope="scope">
                 <span :style="'text-align:right;color:'+(scope.row['最大回撤']>=0?'red':'green') " >{{

          showResult(scope.row["最大回撤"])
        }}</span></template>
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
    tableData: {
      type: Array,
      default: true
    }
  },
  watch: {

  },
  data() {
    return {
    
    }
  },
  methods: {
    showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,3)
    }
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
