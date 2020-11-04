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
    @selection-change="handleSelectionChange"      >
<!--    @row-click = "Selection"-->

    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
<!--      测试ID-->
    <el-table-column
      prop="id"
      label="测试用例ID"
      width="120">
      <template slot-scope="scope">{{ scope.row.id }}</template>
    </el-table-column>
<!--      用例编号-->
     <el-table-column
      prop="test_id"
      label="用例编号"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.test_id }}</template>
    </el-table-column>
<!--      测试项目-->
    <el-table-column
      prop="test_pro"
      label="测试项目"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.test_pro }}</template>
    </el-table-column>
<!--      测试用例是否关联-->
    <el-table-column
      prop="is_connect"
      label="测试用例是否关联"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.is_connect }}</template>
    </el-table-column>
<!--      测试输入-->
    <el-table-column
      prop="test_input"
      label="测试输入"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.test_input }}</template>
    </el-table-column>
<!--      测试等级-->
    <el-table-column
      prop="test_level"
      label="测试等级"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.test_level }}</template>
    </el-table-column>
<!--      测试模块-->
    <el-table-column
      prop="test_module"
      label="测试模块"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.test_module }}</template>
    </el-table-column>
<!--      测试输出-->
    <el-table-column
      prop="test_output"
      label="测试输出"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.test_output }}</template>
    </el-table-column>
<!--      测试步骤-->
    <el-table-column
      prop="test_step"
      label="测试步骤"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.test_step }}</template>
    </el-table-column>
<!--      测试目标-->
    <el-table-column
      prop="test_target"
      label="测试目标"
      show-overflow-tooltip>
    <template slot-scope="scope">{{ scope.row.test_target }}</template>
    </el-table-column>
    <!--      测试-->
    <el-table-column
      prop=""
      label="测试"
      show-overflow-tooltip>
    <template slot-scope="scope">
        <el-button @click="clickSelection(scope.$index, scope.row)"  size="mini">运行</el-button>
    </template>
    </el-table-column>

  </el-table>
      <div style="display: flex;justify-content: space-between">
      <div style="margin-top: 20px; width: 250px; height: 120px;">
        <el-button  size="small" @click="delSelection()">删除</el-button>
        <el-button  size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button  size="small" @click="allrun()">全部运行</el-button>
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
    import axis from 'axios'
  export default {
    data() {
      return {
        rowdata: '',
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
       clickSelection(index, row){
            // console.log(index, row);
           console.log(row.test_id)
           this.request_excute(row.test_id)
        },
      // 分页方法
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.PageSize = val;
        console.log(this.PageSize)
        console.log(this.currentPage)
      },
      // 跳转
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
      },
      //时间选择器方法
      handeldateChange(){
        console.log(this.value2[0]);
        console.log(this.value2[1]);
      },
      //
        async getList(){
            await axis.get('/api/testcase/')//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                console.log(response);
                                this.totaltableData = response.data['result'];
                                this.tableData = this.totaltableData.slice(0 ,9);
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
            },
              //
        request_excute(test_id){
            let url = '/api/testcase/case/?testid=' + test_id
            // console.log(url)
            axis.get(url)//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                console.log(response);
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
            },
        },

      async created() {
            this.getList();
      }
  }
</script>