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

        <div style="display: flex;justify-content: space-between">
          <el-input v-model="input" placeholder="请输入内容"></el-input>
          <el-button type="primary"  @click="" style="margin-left: 10px;">搜索</el-button>
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
      prop="test_caseid"
      label="用例编号"
      show-overflow-tooltip>
    </el-table-column>
<!--      日期-->
    <el-table-column
      prop="test_pro"
      label="测试项目"
      show-overflow-tooltip>
    </el-table-column>
<!--      测试项目-->
    <el-table-column
      prop="test_condition"
      label="预置条件"
      show-overflow-tooltip>
    </el-table-column>
<!--      日期-->
    <el-table-column
      prop="test_time"
      label="测试时间"
      show-overflow-tooltip>
    </el-table-column>
<!--      重要级别-->
    <el-table-column
      prop="test_level"
      label="重要级别"
      show-overflow-tooltip>
    </el-table-column>
<!--      测试输入-->
    <el-table-column
      prop="test_input"
      label="测试输入"
      show-overflow-tooltip>
    </el-table-column>
<!--      操作步骤-->
    <el-table-column
      prop="test_step"
      label="操作步骤"
      show-overflow-tooltip>
    </el-table-column>
<!--      预期输出-->
    <el-table-column
      prop="test_output"
      label="预期输出"
      show-overflow-tooltip>
    </el-table-column>

  </el-table>
      <div style="display: flex;justify-content: space-between">
      <div style="margin-top: 20px; width: 400px; height: 120px;">
        <el-button @click="delSelection()">删除</el-button>
          <el-button @click="">立即执行</el-button>
        <el-button @click="">定时执行</el-button>
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
          :total="totaltableData.length">
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
  import axis from "axios";

  export default {
    data() {
      return {
        value2: '',
        input: '',
          tableData:[],
          totaltableData: [],
          currentPage: 1,
          PageSize:10,
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
        //页面每页大小
        console.log(this.PageSize)
        //当前页
        console.log(this.currentPage)
        let startindex = (this.currentPage - 1) * this.PageSize;
        if(startindex <= 0){
                  startindex = 0;
        }
        let endindex;
        if (this.PageSize * this.currentPage > this.totaltableData.length){
            endindex =  this.totaltableData.length -1;
        }else{
            endindex =  this.PageSize * this.currentPage -1;
        }
        console.log(startindex,endindex)
          this.tableData =  this.totaltableData.slice(startindex ,endindex);
        console.log(this.tableData)
      },
      //时间选择器方法
      handeldateChange(){
        console.log(this.value2[0])
        console.log(this.value2[1])
      },
        //
        async getList(){
            await axis.get('/api/testresult/')//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                console.log(response);
                                this.totaltableData = response.data['result'];
                                //初始第一页数据
                                this.tableData = this.totaltableData.slice(0 ,9);
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
        }
    },
      created() {
        //获取全部数据
        this.getList();
      }
  }
</script>