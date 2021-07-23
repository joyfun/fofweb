<template>
  <div ref="tableContainer" style="	height : 100%;">
    <div class="block" style="display: flex; justify-content: space-between">
      <div style=" width: 480px;">
        <el-button size="small" @click="delSelection()">删除</el-button>
        <el-button size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button size="small" @click="compare()">对比</el-button>
        <el-button size="small" @click="downFile()">下载业绩对比</el-button>
        <el-button  size="small" @click="downNetFile()">下载净值</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :max-height="tmaxh"
      tooltip-effect="dark"
      :default-sort="{prop:'ncnt',order:'descending','cnt':'descending'}"
      @selection-change="handleSelectionChange" 
      style="width: 100%; margin-top: 20px"
    >
      <!--    @row-click = "Selection"       :default-sort="{prop:'类型',order:'ascending','当月收益':'descending'}"-->

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
        prop="type"
        width="100"
        label="来源"
        sortable
        show-overflow-tooltip
      >  <template slot-scope="scope">{{ scope.row['type'] }}</template>

      </el-table-column>
      <el-table-column
        prop="name"
        width="200"
        label="基金名称"
        show-overflow-tooltip
      >
        <template slot-scope="scope"
          ><a href="javascript:;" @click="showHis(scope.row)">{{
            scope.row["name"]
          }}</a></template
        >
      </el-table-column>

      <el-table-column
        prop="lastval_date"
        width="100"
        label="最后更新日期"
        sortable
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['lastval_date'] }}</template>

      </el-table-column>
            <el-table-column
        prop="cnt"
        width="100"
        label="未确认"
        sortable
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['cnt'] }}</template>

      </el-table-column>
                  <el-table-column
        prop="cnt"
        width="100"
        label="新数据"
        sortable
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['ncnt'] }}</template>

      </el-table-column>
      <el-table-column
        prop="code"
        width="80"
        label="原始值"
        sortable
        show-overflow-tooltip
      >
             <template slot-scope="scope">
                 <el-button @click.native.prevent="viewHisTemp(scope.row)" type="text" size="medium"> <el-tooltip class="item" effect="dark" content="核对数据" placement="left-start"><i class="el-icon-success"></i></el-tooltip></el-button>
                 <el-button @click.native.prevent="jumpToSource(scope.row)" type="text" size="medium"> <el-tooltip class="item" effect="dark" content="原始值" placement="left-start"><i class="el-icon-info"></i></el-tooltip></el-button>
             </template>
      </el-table-column>
      <!--      测试项目-->
      <!--      测试用例是否关联-->
      <!--      测试输入-->


    </el-table>
    <div style="display: flex; justify-content: space-between">
     
      <div class="block" style="margin-top: 25px; height: 40px">
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
    :visible.sync="hisVisible">
    <his-table       @close="editClose" ref="histable"  :titles="current.name"  style="height: 600px" :temp="temp" :code="cur_code"  :visable="dialogVisible"></his-table>
    </el-dialog>
     <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
    <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  :code="cur_code"  :visable="dialogVisible"></fund-echart>
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
import HisTable from '../../components/HisTable.vue';

import {mapGetters} from 'vuex'

export default {
  components: {
    FundEchart,HisTable
  },
   computed: {
     ...mapGetters(['class_order','sysparam'])
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
      cur_code: "",
      dialogVisible: false,
      hisVisible:false,
      temp:0,
      rowdata: "",
      value2: "",
      tmaxh:500,
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
      resizeChart(){
                this.tmaxh=this.$refs.tableContainer.clientHeight-120

      },
            viewHisTemp(row){
          this.temp=1
          this.cur_code=""
          this.current=row
          this.hisVisible=true
          this.cur_code=row.code

      },
    editClose() {
      this.hisVisible=false;
      this.dialogVisible = false;
    },
    showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,3)
    },
    jumpToSource(row){
        var url=""
        if(row.type=="GeShang"){
            url='https://www.licai.com/simu/product/'+row.code
        }else if(row.type=="SiMuWang"){
            url = 'https://dc.simuwang.com/product/' + row.code + '.html'
        }url
        if(url){
            window.open(url)
        }
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
    downNetFile(durl){
        var url="/fof/report"
        if(durl){
            url=durl
        }
        if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=","+this.multipleSelection[i].code;
        }
        console.log(url)
        const options = {code:selcode}
            this.$tools.exportExcel(url,options)
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
        .get('/fof/crawl?type=GeShang,SiMuWang') //axis后面的.get可以省略；
        .then((response) => {
             this.tableData=response.data
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //
  },
 mounted() {
           this.resizeChart();
            window.addEventListener("resize", this.resizeChart);
    },
  async created() {
    this.getList();
  },
};
</script>