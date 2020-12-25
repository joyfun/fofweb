<template>
  <div>
    <div class="block" style="display: flex; justify-content: space-between">
      <div style="display: flex; justify-content: space-between">
        <el-input v-model="input" placeholder="请输入名称"></el-input>
        <el-button type="primary" @click="getList" style="margin-left: 10px"
          >搜索</el-button
        >
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
      <!--      测试项目-->
      <!--      测试用例是否关联-->
      <!--      测试输入-->
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
      <el-table-column align="right" prop="2019" label="2019" show-overflow-tooltip>
        <template slot-scope="scope">
                <span :style="'text-align:right;color:'+(scope.row['2019']>=0?'red':'green') " >
{{
          showResult(scope.row["2019"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2018" label="2018" show-overflow-tooltip>
        <template slot-scope="scope">
            <span :style="'text-align:right;color:'+(scope.row['2018']>=0?'red':'green') " >{{
          showResult(scope.row["2018"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2017" label="2017" show-overflow-tooltip>
        <template slot-scope="scope">
            <span :style="'text-align:right;color:'+(scope.row['2017']>=0?'red':'green') " >{{
          showResult(scope.row["2017"])
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

          showResult(scope.row["夏普比率"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="卡玛比率" label="卡玛比率" show-overflow-tooltip>
        <template slot-scope="scope">
                 <span :style="'text-align:right;color:'+(scope.row['卡玛比率']>=0?'red':'green') " >{{

          showResult(scope.row["卡玛比率"])
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
      <div style="margin-top: 20px; width: 250px; height: 120px">
        <el-button size="small" @click="delSelection()">删除</el-button>
        <el-button size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button size="small" @click="allrun()">对比</el-button>
        <el-button size="small" @click="downFile()">下载业绩对比</el-button>
      </div>
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

    <fund-echart
      @close="editClose"
      ref="hischart"
      :titles="current.name"
      style="height: 600px"
      :code="cur_code"
      :visable="dialogVisible"
    ></fund-echart>
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
  data() {
    return {
      current: {},
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
  methods: {
    editClose() {
      this.dialogVisible = false;
    },
    downFile() {
      axis.post("/fof/report", {}, { responseType: "blob" });
    },
    showResult(number){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.formatMoney(number,4)
    },
    formatMoney(number, decimals = 0, decPoint = ".", thousandsSep = ",") {
          if (null == number)
          return '' 

      number = (number + "").replace(/[^0-9+-Ee.]/g, "");
      let n = !isFinite(+number) ? 0 : +number;
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      let sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
      let dec = typeof decPoint === "undefined" ? "." : decPoint;
      let s = "";
      let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec);
        return "" + Math.ceil(n * k) / k;
      };
      s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
      let re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }
      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      return s.join(dec);
    },

    showHis(row) {
      this.cur_code = "";
      this.current = row;
      this.dialogVisible = true;
      this.cur_code = row["基金代码"];
      this.$refs.hischart.$emit("getChart", row.code); //子组件$on中的名字
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
    allrun() {
      // console.log(this.multipleSelection)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        console.log(this.multipleSelection[i].test_id);
        this.request_excute(this.multipleSelection[i].test_id);
      }
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    pandasToJson(pd) {
      var result = [];
      for (var idx in pd.data) {
        var dv = pd.data[idx];
        var row = {};
        for (var ci in pd.columns) {
          row[pd.columns[ci]] = dv[ci];
        }
        result.push(row);
      }
      console.log(result);
      return result;
    },
    //
    getList() {
      axis
        .get("/fof/jreport") //axis后面的.get可以省略；
        .then((response) => {
          console.log(response);
          this.tableData = this.pandasToJson(response.data);
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //
    request_excute(test_id) {
      let url = "/api/testcase/case/?testid=" + test_id;
      // console.log(url)
      axis
        .get(url) //axis后面的.get可以省略；
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  async created() {
    this.getList();
  },
};
</script>