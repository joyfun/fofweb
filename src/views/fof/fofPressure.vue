<template>
  <div>
    <div class="block" style="display: flex; justify-content: space-between">
      <div style=" width: 800px;">
        <!-- <el-button size="small" @click="delSelection()">删除</el-button>
        <el-button size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button size="small" @click="compare()">对比</el-button>
        <el-button size="small" @click="downFile()">下载业绩对比</el-button> -->
    预测中证500<el-input-number style="width:200px" @change="changeNum"
    placeholder="中证500"
    v-model="zz500"></el-input-number>
    预测中证回撤<el-input-number style="width:200px"
    placeholder="中证500回撤"
    v-model="zz500back"></el-input-number>

      </div>
    </div>
    <el-table
      :data="pressdata"
      show-summary
          :summary-method="getSummaries"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange" 
      style="width: 100%; margin-top: 20px">
       <el-table-column
        width="120"
        label="类型"
        show-overflow-tooltip
      >
        <template slot-scope="scope"
          >{{
            scope.row["类型"]
          }}</template
        >
      </el-table-column>
      <el-table-column
        width="120"
        label="预期收益"
        show-overflow-tooltip
      >
              <template slot-scope="scope">

        <span :style="'text-align:right;color:'+(scope.row['过去3年年均收益']>=0?'red':'green') " >
                    {{showResult(scope.row["过去3年年均收益"]/scope.row["count"],100)}}</span>
              </template>
      </el-table-column>
    <el-table-column
        width="120"
        label="预期回撤"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

        <span :style="'text-align:right;color:'+(scope.row['预期回撤']>=0?'red':'green') " >
                    {{showResult(scope.row["预期回撤"]/scope.row["count"])}}</span>
              </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="悲观收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

        <span :style="'text-align:right;color:'+(scope.row['悲观收益']>=0?'red':'green') " >
                    {{showResult(scope.row["悲观收益"]/scope.row["count"])}}</span>
              </template>
      </el-table-column>
     <el-table-column
        width="160"
        label="当前额度"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

        <span :style="'text-align:right;color:'+(scope.row['当前额度']>=0?'red':'green') " >
                    {{showResult(scope.row["当前额度"]+scope.row.change*10000)}}</span>
              </template>
      </el-table-column> 
                <!-- <el-table-column align="right"  :formatter	="formatterNum" prop="当前额度" label="当前额度"> </el-table-column> -->

      <el-table-column
        width="80"
        label="权重%"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
                    {{showResult((scope.row["当前额度"]+scope.row.change*10000)/all,100)}}
              </template>
      </el-table-column>
      
      <el-table-column
        width="180"
        label="调整额度(万)"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
    <el-input-number style="width:150px" @input="changeNum"
    placeholder="调整额度(万)"
    v-model="scope.row.change"></el-input-number>
       
              </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="预期收益贡献"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

        <!-- <span :style="'text-align:right;color:'+(scope.row['当前额度']>=0?'red':'green') " > -->
                    {{showResult((scope.row["当前额度"]+scope.row.change*10000)/all*(scope.row["过去3年年均收益"]/scope.row.count+(scope.row["类型"]=="超额")*zz500))}}
                    <!-- </span> -->
              </template>
      </el-table-column>
 <el-table-column
        width="100"
        label="悲观收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

                    {{showResult((scope.row["当前额度"]+scope.row.change*10000)/all*(scope.row["悲观收益"]+(scope.row["类型"]=="超额")*zz500))}}
              </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="预期回撤"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

                    {{showResult((scope.row["当前额度"]+scope.row.change*10000)/all*(scope.row["预期回撤"]/scope.row.count+(scope.row["类型"]=="超额")*zz500back))}}
              </template>
      </el-table-column>
    </el-table>
     <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange" 
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
    <div style="display: flex; justify-content: space-between">
     
      <div class="block" style="margin-top: 25px; height: 120px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 25, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totaltableData.length"
        >
        </el-pagination>
      </div>
    </div>

     <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
    <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"  :visable="dialogVisible"></fund-echart>
    </el-dialog>
  </div>
</template>

<!--1、用例编号;-->
<!--2、测试项目;-->
<!--3、测试标题;-->
<!--4、重要级别;-->
<!--5、预置条件;-->
<!--6、测试输入;-->
<!--7、操作步骤;-->
<!--8、预期输出-->
<script>
import axis from "axios";
import FundEchart from "../../components/FundEchart.vue";
export default {
  components: {
    FundEchart,
  },
    props: {
      url:{
      type: String,
      default: "/fof/jreport"
    },
    },
  data() {
    return {
      current: {},
      all:0,
      sum:0,
      pressdata:[],
      expectret:0,
      zz500:0,
      zz500back:-0.1,
      cur_code: "",
      dialogVisible: false,
      rowdata: "",
      value2: "",
      chartData: {
        xData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
      },
      input: "",
      tableData: [],
      totaltableData: [],
      currentPage: 1,
      PageSize: 10,
      multipleSelection: [],
    };
  },
  watch: {
    $route:{
      handler(n){
          console.log(n)
          if(n.params['url']){
              this.curl="/fof/"+n.params['url']
          }
          console.log(this.curl)
        //   this.getList()
		// 初始化操作
      },
      immediate: true,
      deep: true,
    },
    url:{
              handler(n){
                  this.getList()
              }
    }
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
          sums[4]=this.all
          sums[7]=this.$tools.formatMoney(this.expectret*100,2)
        //   console.log(this.expectret)
        //   const values = data.map(item => Number(item[column.property]));
        //   if (!values.every(value => isNaN(value))) {
        //     sums[index] = values.reduce((prev, curr) => {
        //       const value = Number(curr);
        //       if (!isNaN(value)) {
        //         return prev + curr;
        //       } else {
        //         return prev;
        //       }
        //     }, 0);
        //     sums[index] += ' 元';
        //   } else {
        //     sums[index] = 'N/A';
        //   }
        });

        return sums;
      },
        formatterNum(row, column, value) {
      if (!value) return "0.00";
      return this.$tools.formatMoney(value,2)
    },
      changeNum(nval){
          this.all=this.sum
        for(var i in this.pressdata){
            this.all+=this.pressdata[i].change*10000
            //         {{showResult((scope.row["当前额度"]+scope.row.change*10000)/all*(scope.row["过去3年年均收益"]/scope.row.count+(scope.row["类型"]=="超额")*zz500))}}

            //*(this.pressdata[i]["过去3年年均收益"]/this.pressdata[i].count+(this.pressdata[i]["类型"]=="超额")*this.zz500)
        }
        this.expectret=0
        for(var i in this.pressdata){
            this.expectret=this.expectret+(this.pressdata[i]["当前额度"]+this.pressdata[i]["change"]*10000)/this.all*(this.pressdata[i]["过去3年年均收益"]/this.pressdata[i].count+(this.pressdata[i]["类型"]=="超额")*this.zz500)
        }
        console.log(this.all)
      },
    editClose() {
      this.dialogVisible = false;
    },
    showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,2)
    },
    

    showHis(row){
          this.cur_code=""
          this.current=row
          this.dialogVisible=true
          this.cur_code=row.code
        //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
      },
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    //表格方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //
    compare() {
        // console.log(this.multipleSelection)
        if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        console.log(this.multipleSelection)
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=","+this.multipleSelection[i].code;
        }
          this.cur_code=""
          this.current=this.multipleSelection[0]
          this.dialogVisible=true
          this.cur_code=selcode
        //   this.$refs.hischart.$emit("getChart",selcode)  
      },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downFile(){      
        const options = {"cache":1}
        this.$tools.exportExcel(this.url+"_down",options)
        },
    delSelection() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        console.log(this.multipleSelection[i].id);
        for (let j = 0; j < this.tableData.length; j++) {
          if (this.multipleSelection[i].id === this.tableData[j].id) {
            this.tableData.splice(j, 1);
            break;
          }
        }
      }
    },
    clickSelection(index, row) {
      // console.log(index, row);
      console.log(row.test_id);
      this.request_excute(row.test_id);
    },
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.PageSize = val;
      console.log(this.PageSize);
      console.log(this.currentPage);
    },
    // 跳转
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //页面每页大小
      console.log(this.PageSize);
      //当前页
      console.log(this.currentPage);
      let startindex = (this.currentPage - 1) * this.PageSize;
      if (startindex <= 0) {
        startindex = 0;
      }
      let endindex;
      if (this.PageSize * this.currentPage > this.totaltableData.length) {
        endindex = this.totaltableData.length - 1;
      } else {
        endindex = this.PageSize * this.currentPage - 1;
      }
      console.log(startindex, endindex);
      this.tableData = this.totaltableData.slice(startindex, endindex);
    },
    //时间选择器方法
    handeldateChange() {
      console.log(this.value2[0]);
      console.log(this.value2[1]);
    },
    
    //
    getList() {
      axis
        .get(this.url) //axis后面的.get可以省略；
        .then((response) => {
          console.log(response);
          this.tableData = this.$tools.pandasToJson(response.data);
          console.log(this.tableData)
          var that=this
          var dict={};
          var minReduce = function (a, b) { return (that.$tools.isNull(b) || b > a) ? a : b }
         // var smallest = arrayOfNumbers.reduce(minReduce, Number.MAX_VALUE)
        for(var idx in this.tableData){
            var row=this.tableData[idx]
            var class_type=row["类型"]
            this.sum+=row["份额"]*row["当前净值"]
            row["low"]=[row["2020"],row["2019"],row["2018"]].reduce(minReduce, Number.MAX_VALUE)
            if(dict[class_type]){
                var aclas=dict[class_type]
                aclas={change:0,"类型":class_type,"count":aclas["count"]+1,"悲观收益":[aclas["悲观收益"],row["low"]].reduce(minReduce, Number.MAX_VALUE),"当前额度":aclas["当前额度"]+row["份额"]*row["当前净值"],"预期回撤":aclas["预期回撤"]+row["最大回撤"],"过去3年年均收益":aclas["过去3年年均收益"]+row["过去3年年均收益"]}
                dict[class_type]=aclas
            }else{
                dict[class_type]={"类型":class_type,"count":1,"悲观收益":row["low"],"当前额度":row["份额"]*row["当前净值"],"过去3年年均收益":row["过去3年年均收益"],"预期回撤":row["最大回撤"],"change":1}
            }
            this.all=this.sum
        }
         var ret=[]
         dict["超额"]["当前额度"]=dict["指增"]["当前额度"]
        for(var cls in dict){
            if(dict[cls]["类型"]!="指增")
            ret.push(dict[cls])
        }
        this.pressdata=ret
        console.log(this.pressdata)
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //
  },

  async created() {
    this.getList();
  },
};
</script>