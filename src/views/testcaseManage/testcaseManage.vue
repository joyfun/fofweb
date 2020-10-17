<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        <div >
<!--           <span class="demonstration">选择日期</span>-->
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              @change = "handeldateChange"
              >
            </el-date-picker>
        </div>

        <div>
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px;"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
<!--      用例编号-->
    <el-table-column
      prop="id"
      label="用例编号"
      width="120">
    </el-table-column>
<!--      日期-->
    <el-table-column
      prop="date"
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column>
<!--      测试项目-->
    <el-table-column
      prop="testpro"
      label="测试项目"
      show-overflow-tooltip>
    </el-table-column>
<!--      测试标题-->
     <el-table-column
      prop="testname"
      label="测试标题"
      show-overflow-tooltip>
    </el-table-column>
<!--      重要级别-->
    <el-table-column
      prop="level"
      label="重要级别"
      show-overflow-tooltip>
    </el-table-column>
<!--      预置条件-->
    <el-table-column
      prop="conditions"
      label="预置条件"
      show-overflow-tooltip>
    </el-table-column>
<!--      测试输入-->
    <el-table-column
      prop="input"
      label="测试输入"
      show-overflow-tooltip>
    </el-table-column>
<!--      操作步骤-->
    <el-table-column
      prop="step"
      label="操作步骤"
      show-overflow-tooltip>
    </el-table-column>
<!--      预期输出-->
    <el-table-column
      prop="hopeoutput"
      label="预期输出"
      show-overflow-tooltip>
    </el-table-column>
  </el-table>
      <div style="display: flex;justify-content: space-between">
      <div style="margin-top: 20px; width: 180px; height: 120px;">
        <el-button @click="delSelection()">删除</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
      <div class="block" style=" margin-top: 25px; height: 120px; ">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 25, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totaldata">
        </el-pagination>
      </div>
    </div>
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
  export default {
    data() {
      return {
        currentPage: 5,
        totaldata : 100,
        PageSize:10,
        value2: '',
        input: '',
        tableData: [{
          id: '1',
          date: '2016-05-03',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }, {
          id: '2',
          date: '2016-05-02',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }, {
          id: '3',
          date: '2016-05-04',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }, {
          id: '4',
          date: '2016-05-01',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }, {
          id: '5',
          date: '2016-05-08',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }, {
          id: '6',
          date: '2016-05-06',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }, {
          id: '7',
          date: '2016-05-07',
          testpro:"项目1",
          testname: '上海市普陀区金沙江路 1518 弄',
          level:'一级',
          conditions:"21212",
          input:"aw",
          step:"23232",
          hopeoutput:"43434"
        }],
        multipleSelection: []
      }
    },

    methods: {
      //表格方法
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      delSelection(){
        for (let i = 0; i < this.multipleSelection.length; i++) {
            console.log(this.multipleSelection[i].id);
            for (let j = 0; j < this.tableData.length; j++) {
                if(this.multipleSelection[i].id === this.tableData[j].id){
                   this.tableData.splice(j, 1);
                   break;
                }
            }
         }
      },
      //分页方法
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.PageSize = val;
        console.log(this.PageSize)
        console.log(this.currentPage)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        console.log(this.PageSize)
        console.log(this.currentPage)
      },
      //时间选择器方法
      handeldateChange(){
        console.log(this.value2[0])
        console.log(this.value2[1])
      }
    }
  }
</script>