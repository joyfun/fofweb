<template>
    <div>
        <div class="block" style="display: flex;justify-content: space-between">
            <div>
                <!--           <span class="demonstration">选择日期</span>-->
                <el-date-picker
                        v-model="time_value"
                        type="datetimerange"
                        align="right"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00', '08:00:00']"
                        @change="handeldateChange"
                >
                </el-date-picker>
            </div>

            <div style="display: flex;justify-content: space-between">
                <el-input v-model="input" placeholder="请输入内容"></el-input>
                <el-button type="primary" @click="" style="margin-left: 10px;">搜索</el-button>
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
            <!--测试模块ID-->
            <el-table-column
                    prop="id"
                    label="任务ID"
                    width="120">
            </el-table-column>
            <!--测试模块ID-->
            <el-table-column
                    prop="taskname"
                    label="任务名"
                    width="120">
            </el-table-column>
            <!--模块ID-->
            <el-table-column
                    prop="moudle_id"
                    label="模块ID"
                    show-overflow-tooltip>
            </el-table-column>
            <!--模块名字-->
            <el-table-column
                    prop="moudle_name"
                    label="模块名字"
                    show-overflow-tooltip>
            </el-table-column>
            <!--模块文件名-->
            <el-table-column
                    prop="task_id"
                    label="任务celery_ID"
                    show-overflow-tooltip>
            </el-table-column>
            <!--测试类-->
            <el-table-column
                    prop="task_type"
                    label="任务类型"
                    show-overflow-tooltip>
            </el-table-column>
            <!--      测试-->
            <el-table-column
              prop=""
              label="测试"
              show-overflow-tooltip>
                <el-button @click="clickSelection()"  size="mini">运行</el-button>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: space-between">
            <div style="margin-top: 20px; width: 400px; height: 120px;">
                <el-button @click="delSelection()">删除</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
                <el-button v-popover:popover @click="initfromdata()">新增</el-button>
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
        <el-popover
                ref="popover"
                placement="top"
                width="300"
                v-model="visible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="任务名称">
                    <el-input v-model="form.taskname"></el-input>
                </el-form-item>
                <el-form-item label="模块名">
                    <el-select v-model="form.moudle_id" placeholder="请选择测试模块">
                        <el-option  v-for="item in from_initdata.moudle_list" :label="item.moudle_name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-select v-model="form.task_type" placeholder="请选择任务类型">
                        <el-option  v-for="item in from_initdata.task_type_list" :label="item.type_task" :value="item.taskid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                                        style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2"
                                        style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
            </el-form>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="cancel()">取消</el-button>
                <el-button type="primary" size="mini" @click="confirm()">确定</el-button>
            </div>
        </el-popover>
    </div>
</template>

<script>
    import axis from "axios";
    export default {
        data() {
            return {
                time_value: '',
                visible: false,
                from_initdata: {
                    moudle_list : [],
                    task_type_list : [{ 'type_task': '定时任务','taskid':1 },{ 'type_task': '周期性任务' ,'taskid':2 }],
                },
                form: {
                    taskname: '',
                    moudle_id: '',
                    task_type: '',
                    date1: '',
                    date2: '',
                },
                input: '',
                tableData: [],
                totaltableData: [],
                currentPage: 1,
                PageSize: 10,
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
                if (startindex <= 0) {
                    startindex = 0;
                }
                let endindex;
                if (this.PageSize * this.currentPage > this.totaltableData.length) {
                    endindex = this.totaltableData.length - 1;
                } else {
                    endindex = this.PageSize * this.currentPage - 1;
                }
                console.log(startindex, endindex)
                this.tableData = this.totaltableData.slice(startindex, endindex);
                console.log(this.tableData)
            },
            //时间选择器方法
            handeldateChange() {
                console.log(this.time_value[0])
                console.log(this.time_value[1])
            },
            //
            getList() {
                axis.get('/api/tetask/')//axis后面的.get可以省略；
                    .then(
                        (response) => {
                            console.log(response);
                            this.totaltableData = response.data['result'];
                            //初始第一页数据
                            this.tableData = this.totaltableData.slice(0, 9);
                        })
                    .catch(
                        (error) => {
                            console.log(error);
                        });
            },

            //表单初始化
            initfromdata(){
                axis.get('/api/temoudle/')//axis后面的.get可以省略；
                    .then(
                        (response) => {
                            // console.log(response.data['result']);
                            this.from_initdata.moudle_list = response.data['result']
                        })
                    .catch(
                        (error) => {
                            console.log(error);
                        });
            },
            //表单确认
            confirm(){
                this.visible = false;
                console.log(this.form)

            },
            cancel(){
                 this.visible = false;
                console.log(this.form)
            },

        },
        //
        created() {
            //获取全部数据
            this.getList();
        }
    }
</script>