<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        
        <div style="display: flex;justify-content: space-between">
            <el-button  size="small" @click="toggleSelection()">取消选择</el-button>
            <el-button  size="small" @click="addCompany()">添加</el-button>
        <el-input v-model="input" placeholder="请输入名称"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button>
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
<!--公司名称	状态	产品名称	投资规模（万元）	公司负责人	商务经理	联系方法	管理费	carry	业绩报酬计提方式	止损	预警	其它关键条款-->
    <el-table-column
      prop="name"
      min-width	="240"
      label="名称"
      >
      <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
<!--      用例编号-->
     <el-table-column
      prop="status"
      min-width="60"
      label="状态"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.status }}</template>
    </el-table-column>
<!--      测试项目-->
    <el-table-column
      prop="scope"
      min-width="60"
      label="规模(亿)"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.scope }}</template>
    </el-table-column>
    <el-table-column
      prop="channel"
      min-width="80"
      label="渠道"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.channel }}</template>
    </el-table-column>
    <el-table-column
      prop="manager"
      label="负责人"
      min-width="80"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.manager }}</template>
    </el-table-column>
    <el-table-column
      prop="business_man"
      min-width="80"
      label="商务经理"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.business_man }}</template>
    </el-table-column>
<!--      测试用例是否关联-->
    
<!--      测试输入-->
    <!-- <el-table-column
      prop="perf_comp"
      label="计提方式"
      min-width	="240"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.perf_comp }}</template>
    </el-table-column> -->
    <el-table-column
      prop="product"
      label="产品名称"
      min-width	="160"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.product }}</template>
    </el-table-column>
<el-table-column
      label="操作"
      sortable
            min-width="80"
            fixed="right"
      show-overflow-tooltip>
        <template slot-scope="scope">
            <el-button @click.native.prevent="editStatus(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="编辑" placement="left-start"><i class="el-icon-edit"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="searchProd(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="查询" placement="left-start"><i class="el-icon-search"></i></el-tooltip></el-button>
            <el-button v-if="usermenu.indexOf('info-edit')>-1" @click.native.prevent="delCompany0(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

        </template>
    </el-table-column>
  </el-table>
      <div style="display: flex;justify-content: space-between">
      
      <div class="block" style=" margin-top: 25px; height: 120px; ">
        <!-- --><el-pagination
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
    <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
<el-form :model="curCompany" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
    <template v-for="(row,index)  in cForm" >

     <el-row  :key="index"   v-show="index%2==0">
      <el-col :span="12">          
      <el-form-item v-if="index<=cForm.length-1"  :prop="row.dataIndex"      :label=" row.tilte"><el-input :type="row.type" v-model="curCompany[row.dataIndex]"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="12">              
      <el-form-item v-if="index+1<=cForm.length-1"  :prop="cForm[index+1].dataIndex"      :label=" cForm[index+1].tilte"><el-input :type="cForm[index+1].type" v-model="curCompany[cForm[index+1].dataIndex]"></el-input>
      </el-form-item>
      </el-col>
    </el-row >
    </template>
<el-form-item>
    <el-button v-if="usermenu.indexOf('info-edit')>-1" type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button v-if="usermenu.indexOf('info-edit')>-1" @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>
    </el-dialog>
<el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
     :visible.sync="dialogCompVisible"
     >
      <prod-table       @close="editClose" ref="simtable"  :foflist="foflist" :full="true"    v-if="diagName=='prodDiag'"></prod-table>

    </el-dialog>


    <el-dialog
  title="提示"
  :visible.sync="confirmVisible"
  width="30%"
  :before-close="handleClose">
  <span>确认删除{{curCompany.name}}?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="confirmVisible = false">取 消</el-button>
    <el-button type="primary" @click="delCompany()">确 定</el-button>
  </span>
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
    import axis from 'axios'
    import {mapGetters} from 'vuex'

    import FundEchart from '../../components/FundEchart.vue';
    import ProdTable from '../../components/ProdTable.vue';

  const cForm=[
 {"tilte":"名称","dataIndex":"name"},
 {"tilte":"状态","dataIndex":"status"},
 {"tilte":"简称","dataIndex":"short_name"}, 
 {"tilte":"负责人","dataIndex":"manager"},
 {"tilte":"管理规模(亿)","dataIndex":"scope"},
 {"tilte":"商务经理","dataIndex":"business_man"},
 {"tilte":"联系方式","dataIndex":"contact"},
 {"tilte":"渠道","dataIndex":"channel"},
 {"tilte":"渠道联系人","dataIndex":"channel_man"},
 {"tilte":"渠道联系方式","dataIndex":"channel_contact"},
  {"tilte":"产品","dataIndex":"product"},
 {"tilte":"备注","dataIndex":"remark","type":"textarea"} 

]
  export default {
      components: {
            FundEchart,
            ProdTable
        },
            computed:{...mapGetters(['sysparam','class_order','token','usermenu'])},
    data() {
      return {
        cForm,
        multipleSelection: [],
        foflist:[],
        dialogCompVisible:false,
        diagName:"",
        curCompany:{},
        confirmVisible:false,
        cur_id:0,
        dialogVisible: false,
        rowdata: '',
        value2: '',
        PageSize:30,
        chartData: {
                        xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
    }]
                    },
        input: '',
          tableData:[],
          totaltableData: [],
          currentPage: 1,
          multipleSelection: []
      }
    },
    watch: {
    $route:{
      handler(n){
          this.getList(n.params.type)
		// 初始化操作
      },
      immediate: true,
      deep: true,
    }
  },
    methods: {
        searchProd(row){
            axis( {
                url: '/fof/list',
                method: 'GET',
                params: {company:row.short_name}
                }).then((response) => {
                    this.foflist=response.data
                    this.dialogCompVisible=true
                    this.diagName="prodDiag"
                })
        },
         editClose() {
        this.dialogVisible = false
        this.resetForm('dynamicValidateForm')
        },
      submitForm(formName) {
          console.log(this.$refs[formName].model)
          axis({
      method: 'post',
      url: "/fof/savecompany", // 请求地址
      data: this.curCompany, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
            this.dialogVisible = false
             this.getList()
          }

      },
      err => {
        reject(err)
      }
    )
      },
      delCompany0(row){
          this.curCompany=row
          this.confirmVisible=true

      },
      delCompany(row) {
          if(!row){
              row=this.curCompany
          }
          axis({
      method: 'post',
      url: "/fof/delcompany", // 请求地址
      data: {"id":row.id}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          console.log(response)
          if(response.data["status"]=="success"){
              this.confirmVisible=false
            this.getList()
          }

      },
      err => {
        reject(err)
      }
    )
      },
      resetForm(formName) {
          console.log(formName)
        this.$refs[formName].resetFields();
      },

       editStatus(row){
          this.cur_id=row.id
          this.current=JSON.parse(JSON.stringify(row))  
          this.curCompany=row
          this.dialogVisible=true
      },
      addCompany(){
          this.curCompany={}
          this.dialogVisible=true
      },
      handleClose(done) {
          done()
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      //表格方法
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        this.multipleSelection=[]
      },
      //
      allrun() {
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
          console.log(val)
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
            endindex =  this.totaltableData.length ;
        }else{
            endindex =  this.PageSize * this.currentPage ;
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
     getList(type){
            console.log(type)
             var $this=this
             var data={}
             if(type){
                 data.type=type
             }
             if(this.input)
             data={"name":this.input}
            //   axis.get('/fof/list')//axis后面的.get可以省略；
            axis( {
                url: '/fof/company',
                method: 'GET',
                params: data
                }).then((response) => {
                                console.log(response);
                                
                                this.totaltableData = response.data;
                                if(this.token=='demo'){
                                    for (var row in this.totaltableData){
                                        this.totaltableData[row]["name"]="名称"+row
                                        this.totaltableData[row]["short_name"]="名称"+row

                                    }
                                }
                                this.tableData = this.totaltableData.slice(0 ,$this.PageSize);
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
            },
        
        },

    //   async mounted() {
    //         console.log(this.$route.params)
    //         this.getList(this.$route.params.type);
    //   }
  
}
</script>