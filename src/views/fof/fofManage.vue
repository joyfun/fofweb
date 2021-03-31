<template>
  <div ref="tableContainer" style="	height : 100%;">
      <div  class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">
           <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
        <el-button  size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button  size="small" @click="addInfo()">添加</el-button>
        <el-button  size="small" @click="allrun()">对比</el-button>
        <el-button  size="small" @click="showcorr()">相关性</el-button>
        <el-button  size="small" @click="compare()">业绩对标</el-button>

        <el-select v-model="filter.stage" @change="getList" style="width:80px"  clearable placeholder="阶段">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select v-model="filter.class_type" @change="getList"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in class_types"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        <el-button  size="small" @click="downFile()">下载</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button>
        </div>
      </div>
       
      <el-table
    ref="multipleTable"
    :data="tableData"
    :max-height="tmaxh"
    :row-key="(row)=>{ return row.code}"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px;"
    @selection-change="handleSelectionChange"      >
<!--    @row-click = "Selection"-->

    <el-table-column
      type="selection"
      :reserve-selection="true"
      width="55">
    </el-table-column>
<!--      测试ID-->
    <!-- <el-table-column
      prop="code"
      label="基金编号"
      width="120">
      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.code }}</a></template>
    </el-table-column> -->
<!--      用例编号-->
    
<!--      测试项目-->
    <el-table-column
      fixed
      prop="short_name"
      label="基金"
      show-overflow-tooltip>
     <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.short_name }}</a></template>
    </el-table-column>
<!--      测试用例是否关联-->
   <el-table-column
      prop="class_type"
      label="类型"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.class_type }}</template>
    </el-table-column>
    <el-table-column
      prop="buy_date"
      label="建仓日期"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.buy_date }}</template>
    </el-table-column>
     <el-table-column
      prop="stage"
      label="状态"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.stage }}</template>
    </el-table-column>
<!--      测试输入-->
    
 <el-table-column
      prop="name"
      label="基金名称"
      show-overflow-tooltip>
      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.name }}</a></template>
    </el-table-column>
<el-table-column
      prop="company"
      label="公司"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.company }}</template>
    </el-table-column>
<el-table-column
      label="操作"
            fixed="right"
      width="160">
        <template slot-scope="scope">
            <el-button @click.native.prevent="viewHis(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="查看净值历史" placement="left-start">
<i class="el-icon-info"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="viewHisTemp(scope.row)" type="text" size="small"> <el-tooltip class="item" effect="dark" content="核对数据" placement="left-start"><i class="el-icon-success"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="editStatus(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="更新状态" placement="left-start"><i class="el-icon-s-tools"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="editInfo(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="编辑" placement="left-start"><i class="el-icon-edit"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="uploadFile(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="上传报告" placement="left-start"><i class="el-icon-upload"></i></el-tooltip></el-button>
            <el-button v-show="scope.row.filename"  type="text" size="small"><el-tooltip class="item" effect="dark" content="下载报告" placement="left-start"><a :href=" '/fof/downfile?code='+scope.row.code "><i class="el-icon-download"></i></a></el-tooltip></el-button>

            <el-button v-show="scope.row.compare" @click.native.prevent="vcompare(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="业绩对标" placement="left-start"><i class="el-icon-sort"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="delFund0(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

        </template>
    </el-table-column>

  </el-table>
  <el-upload
              class="upload-demo"
              style="display:none"
              accept=".doc,.dot,.DOC,.DOT,DOCX,docx,.pdf,.PDF"
              action="/fof/upload"
              :data="{code:cur_code}"

              :before-upload="(file)=>loadModel(file)"
              auto-upload
            >
              <el-button id="uploadButton" size="small" type="primary">点击上传</el-button>
            </el-upload>
      <div style="display: flex;justify-content: space-between">
      
      <div class="block" style=" margin-top: 25px; height: 40px; ">
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
    <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"  :visable="dialogVisible"></fund-echart>
    </el-dialog>
    <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="tableVisible"
  >
    <el-button  @click="downFile('/fof/jreport_down')">下载数据</el-button>

    <report-table    ref="compdata"  :titles="current.name"   :tableData="compData"  ></report-table>

     <fund-echart    ref="hischart1"  :titles="current.name"  style="height: 600px" :code="selcode"  ></fund-echart>

        </el-dialog>

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
    :visible.sync="corrVisible">
    <fund-corr       @close="editClose" ref="corrtable"  :titles="current.name"  style="height: 600px" :temp="temp" :code="selcode"  ></fund-corr >
    </el-dialog>
    <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="editVisible">
    <el-form ref="form" :model="current" label-width="80px">
  <el-form-item label="基金名称">
    <label >{{current.name}}</label>
  </el-form-item>
  <!-- <el-form-item label="即时配送">
    <el-switch v-model="current.delivery"></el-switch>
  </el-form-item> -->
  <el-form-item label="决策阶段">
     <el-radio-group v-model="current.stage">    
    <el-radio :key="idx" v-for="(item,idx) in options" :label="item.label"></el-radio>
  </el-radio-group>
  </el-form-item>
  <el-form-item label="投资份额">
    <el-input-number style="width:200px"
    placeholder="份额"
    v-model="current.amount">
  </el-input-number>
  </el-form-item>
  <el-form-item label="评审意见">
    <el-input type="textarea" v-model="current.remark"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">确认提交</el-button>
  </el-form-item>
</el-form>
    </el-dialog>
 <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="formVisible"
  >
<el-form :model="current" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
    <template v-for="(row,index)  in cForm" >

     <el-row  :key="index"   v-show="index%2==0">
      <el-col :span="12">              
      <el-form-item v-if="index<cForm.length-1"  :prop="row.dataIndex"      :label=" row.tilte"><el-input v-model="current[row.dataIndex]"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="12">              
      <el-form-item v-if="index+1<cForm.length-1"  :prop="cForm[index+1].dataIndex"      :label=" cForm[index+1].tilte"><el-input v-model="current[cForm[index+1].dataIndex]"></el-input>
      </el-form-item>
      </el-col>
    </el-row >
    </template>
<el-form-item>
    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>
    </el-dialog>

    <el-dialog
  title="提示"
  :visible.sync="confirmVisible"
  width="30%"
  :before-close="handleClose">
  <span>确认删除{{current.name}}?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="confirmVisible = false">取 消</el-button>
    <el-button type="primary" @click="delFund()">确 定</el-button>
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
    import FundEchart from '../../components/FundEchart.vue';
    import HisTable from '../../components/HisTable.vue';
    import ReportTable from '../../components/ReportTable.vue';
    import {mapGetters} from 'vuex'

    import FundCorr from '../../components/FundCorr.vue';
   const cForm=[
    {"tilte":"编号","dataIndex":"code"},
    {"tilte":"名称","dataIndex":"name"},
    {"tilte":"简称","dataIndex":"short_name"},
    {"tilte":"基金类型","dataIndex":"class_type"},
    {"tilte":"文件匹配条件","dataIndex":"regex"},
    {"tilte":"购买时净值","dataIndex":"buy_price"},
    {"tilte":"子类型","dataIndex":"sub_type"},
    {"tilte":"购买时间","dataIndex":"buy_date"},
    {"tilte":"份额","dataIndex":"amount"},
    {"tilte":"所属公司","dataIndex":"company"},
    {"tilte":"类型","dataIndex":"type"},
    {"tilte":"基金成立时间","dataIndex":"founded"},
    {"tilte":"状态","dataIndex":"stage"},
    {"tilte":"预选时间","dataIndex":"stage1_time"},
    {"tilte":"二选时间","dataIndex":"stage2_time"},
    {"tilte":"备投时间","dataIndex":"stage3_time"},
    {"tilte":"已投时间","dataIndex":"stage4_time"},
    {"tilte":"子基金对标","dataIndex":"compare"},
    {"tilte":"市值","dataIndex":"cost"},
    {"tilte":"管理费","dataIndex":"fee"},
 {"tilte":"carry","dataIndex":"carry"},
 {"tilte":"业绩报酬计提方式","dataIndex":"perf_comp"},
 {"tilte":"止损","dataIndex":"lost"},
 {"tilte":"预警","dataIndex":"alarm"},
 {"tilte":"其他关键条款","dataIndex":"other"},
 {"tilte":"渠道","dataIndex":"channel"},
 {"tilte":"渠道联系人","dataIndex":"channel_man"},
 {"tilte":"渠道联系方式","dataIndex":"channel_contact"} 
]
  export default {
      components: {
            FundEchart,
            HisTable,
            ReportTable,
            FundCorr
        },
        props: {filters:{
      type: Object,
      default:null
    },},
    computed:{...mapGetters(['options','class_types'])},
    data() {
      return {
          cForm,
          selcode:"",
          filter:{},
          temp:-1,
          origin:{},
          
        multipleSelection: [],
        current:{},
        cur_code:"",
        dialogVisible: false,
        confirmVisible:false,
        corrVisible:false,
        formVisible:false,
        tableVisible: false,
        hisVisible:false,
        editVisible:false,
        compData:[],
        rowdata: '',
        tmaxh:500,
        value2: '',
        PageSize:30,
        chartData: {
                        xData: [],
                        series: [{
        data: [],
        type: 'line',
        smooth: true
    }]
                    },
        input: '',
          tableData:[],
          totaltableData: [],
          currentPage: 1,
      }
    },
    watch: {
    $route:{
      handler(n){
          console.log(n)
          let params=n.params
          if(this.filters){
              params=this.filters
          }
          this.getList(params)
		// 初始化操作
      },
      immediate: true,
      deep: true,
    }
  },
    methods: {
          editInfo(row){
        //   this.cur_id=row.id
        //   this.current=JSON.parse(JSON.stringify(row))  
          this.current=row
          this.formVisible=true
      },
      submitForm(formName) {
          console.log(this.$refs[formName].model)
          axis({
      method: 'post',
      url: "/fof/saveinfo", // 请求地址
      data: this.current, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
              this.getList(this.filter)
            this.formVisible = false
          }

      },
      err => {
        reject(err)
      }
    )
      },
      delFund0(row){
          this.confirmVisible=true
          this.current=row
      },
      delFund(row) {
          if(!row){
              row=this.current
          }
          console.log(row)
          axis({
      method: 'post',
      url: "/fof/delfund", // 请求地址
      data: {code:row.code}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
              this.confirmVisible=false
              this.getList(this.filter)
          }

      },
      err => {
        reject(err)
      }
    )
      },
      addInfo(){
          this.current={}
          this.formVisible=true
      },
        loadModel(file){
            console.log(file.name)
        },
        uploadFile(row){
            this.cur_code=row.code
            document.getElementById('uploadButton').click()
        },
         editClose() {
        this.dialogVisible = false
        },
        
        downFile(durl){
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
showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,3)
    },
      showHis(row){
          this.cur_code=""
          this.current=row
          this.dialogVisible=true
          this.cur_code=row.code
        //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
      },
      onSubmit(){
          
          var ret=this.$tools.checkModi(this.current,this.origin)
          var $this=this
          ret['code']=this.origin.code
          axis({
        method: 'post',
        url: "/fof/updateinfo", // 请求地址
        data: ret, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      }).then(
        response => {
            if(response.data.status=="success"){
                $this.getList()
                this.editVisible=false
                this.$message({
                message: '保存成功',
                type: 'success',
                center: true
        });
                                        }

        })

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
      viewHis(row){
          this.temp=-1
          this.cur_code=""
          this.current=row
          this.hisVisible=true
          this.cur_code=row.code

      },
      
      viewHisTemp(row){
          this.temp=1
          this.cur_code=""
          this.current=row
          this.hisVisible=true
          this.cur_code=row.code

      },
       editStatus(row){
          this.cur_code=""
          this.current=JSON.parse(JSON.stringify(row))  
          this.origin=row
          this.editVisible=true
          this.cur_code=row.code

      },
      downInvest(row){
        var url="/fof/downfile"
        const options = {"code":row.code}
        this.$tools.exportExcel(url,options)

      },
    //    downFile(){
    //         if(this.multipleSelection.length<1){
    //         return
    //     }
    //     var selcode=""
    //     console.log(this.multipleSelection)
    //     for (let i = 0; i < this.multipleSelection.length; i++) {
    //           selcode+=this.multipleSelection[i].code+",";
    //     }
    //     var url="/fof/down_jreport"
      
    //     const options = {"code":selcode}
    //     this.$tools.exportExcel(url,options)
    //     },
      vcompare(row){
          this.showcomapre(row.code,'/fof/jcompare')
      },
      showcomapre(selcode,vcomp){
        let curl='/fof/jreport'
        if(vcomp)
            curl=vcomp
        this.tableVisible=true
        this.selcode=selcode
        // console.log(this.multipleSelection)
          axis( {
                url: curl,
                method: 'GET',
                params: {code:selcode}
                })//axis后面的.get可以省略；
        .then((response) => {
          this.compData = this.$tools.pandasToJson(response.data);
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error);
        });
      },
      compare() {
        // console.log(this.multipleSelection)
        if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        console.log(this.multipleSelection)
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=this.multipleSelection[i].code+",";
        }
        this.showcomapre(selcode)
        //   this.$refs.hischart.$emit("getChart",selcode)  
      },
      showcorr() {
        // console.log(this.multipleSelection)
        if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        console.log(this.multipleSelection)
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=this.multipleSelection[i].code+",";
        }
        this.selcode=selcode
        this.corrVisible=true
        //   this.$refs.hischart.$emit("getChart",selcode)  
      },
      // 选中
      handleSelectionChange(val) {
          console.log(val)
          console.log(this.multipleSelection)

        this.multipleSelection = val;
    //         if (this.multipleSelection.length > 0) {
    //     this.multipleSelection.forEach((item, index) => {
    //         if (item.code == row.code) {
    //             this.multipleSelection.splice(index,1)
    //         } else {
    //             this.multipleSelection.push(row)
    //         }
    //     })
    // } else {
    //     this.multipleSelection.push(row)
    // }

      },
      resizeChart(){
                console.log(this.$refs.tableContainer.clientHeight)
                this.tmaxh=this.$refs.tableContainer.clientHeight-120

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
        console.log(this.multipleSelection)
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
     getList(param){
             var $this=this
             if(param && typeof(param)=='object' && "click"!=param.type){
                 this.filter=param
             }
             var data=this.filter
             console.log(data)
            //  if(this.input)
            //  data["name"]=this.input
            //  console.log(this)
            //  if(this.stage)
            //  data["stage"]=this.stage
            //   axis.get('/fof/list')//axis后面的.get可以省略；
            axis( {
                url: '/fof/list',
                method: 'GET',
                params: data
                }).then((response) => {
                                console.log(response);
                                this.totaltableData = response.data;
                                this.tableData = this.totaltableData.slice(0 ,$this.PageSize);
                                this.resizeChart()
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
    created(){
        console.log(this.$moment().date(-7))
        
    },
    mounted() {
            window.addEventListener("resize", this.resizeChart);
    },
    //   async mounted() {
    //         console.log(this.$route.params)
    //         this.getList(this.$route.params.type);
    //   }
  }
  
</script>