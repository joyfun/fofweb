<template>
  <div id="tableContainer" style="	height : 100%;">
      <div  class="block" style="display: flex;justify-content: space-between">
        <div style="display: flex;justify-content: space-between">
           <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
        <el-button  size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button  size="small" @click="addInfo()">添加</el-button>
  <el-select v-model="filter.class_type"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
        <el-button  size="small" @click="showRank()">排名</el-button>
         <el-button  size="small" @click="showSimulate()">仿真</el-button>
        <el-button  size="small" @click="downData()">同步数据</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button>
        </div>
      </div>
      <el-table
    ref="multipleTable"
    :data="tableData"
    :max-height="tmaxh"
    :row-key="(row)=>{ return row.scode}"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px;"
    @select-all="onselectAll"
    @select="handleSelectionChange"       >
<!--    @row-click = "Selection"-->

    <el-table-column
      type="selection"
      :reserve-selection="true"
      width="55">
    </el-table-column>
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
      prop="create_time"
      label="添加时间"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.create_time|formatDate }}</template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="来源"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.type }}</template>
    </el-table-column>
    <el-table-column
      prop="code"
      label="网站代码"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.code }}</template>
    </el-table-column>
    <el-table-column
      prop="scode"
      label="备案号"
      sortable
      show-overflow-tooltip>
    </el-table-column>
    <!-- <el-table-column
      prop="buy_date"
      label="建仓日期"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.buy_date }}</template>
    </el-table-column> -->
<el-table-column
      prop="company"
      label="公司"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.company }}</template>
    </el-table-column>
<el-table-column
      prop="remark"
      label="备注"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.remark }}</template>
    </el-table-column>
<el-table-column
      label="操作"
            fixed="right"
      width="160">
        <template slot-scope="scope">
            <el-button @click.native.prevent="viewHis(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="查看净值历史" placement="left-start"><i class="el-icon-info"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="savefundval(scope.row)" type="text" size="small"> <el-tooltip class="item" effect="dark" content="同步数据" placement="left-start"><i class="el-icon-download"></i></el-tooltip></el-button>

<!-- <el-button @click.native.prevent="viewAudit(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="查看审核历史" placement="left-start"><i class="el-icon-s-order"></i></el-tooltip></el-button> 
            <el-button @click.native.prevent="viewHisTemp(scope.row)" type="text" size="small"> <el-tooltip class="item" effect="dark" content="核对数据" placement="left-start"><i class="el-icon-success"></i></el-tooltip></el-button>
            <el-button v-if="usermenu.indexOf('info-audit')>-1" @click.native.prevent="editStatus(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="更新状态" placement="left-start"><i class="el-icon-s-tools"></i></el-tooltip></el-button>
            --><el-button @click.native.prevent="editInfo(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="编辑" placement="left-start"><i class="el-icon-edit"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="editInfo(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="信息维护" placement="left-start"><i class="el-icon-s-tools"></i></el-tooltip></el-button>
            <!--<el-button v-if="usermenu.indexOf('info-edit')>-1"  @click.native.prevent="uploadFile(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="上传报告" placement="left-start"><i class="el-icon-upload"></i></el-tooltip></el-button>
            <el-button v-show="scope.row.filename"  type="text" size="small"><el-tooltip class="item" effect="dark" content="下载报告" placement="left-start"><a :href=" '/fof/downfile?code='+scope.row.code "><i class="el-icon-download"></i></a></el-tooltip></el-button>
           <el-button v-show="scope.row.combine" @click.native.prevent="viewConcat(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="拼接历史" placement="left-start"><i class="el-icon-link"></i></el-tooltip></el-button>
            <el-button v-show="scope.row.compare" @click.native.prevent="vcompare(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="业绩对标" placement="left-start"><i class="el-icon-sort"></i></el-tooltip></el-button>
            --><el-button @click.native.prevent="delFund0(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

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
    <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"   v-if="diagName=='hisChart'"></fund-echart>
    <his-table       @close="editClose" ref="histable"  :titles="current.name"  style="height: 600px" :temp="temp" :code="cur_code"  v-if="diagName=='hisTable'"></his-table>
    <rank-table       @close="editClose" ref="ranktable"  :titles="current.name"  style="height: 800px"  :code="cur_code"  v-if="diagName=='rankDialog'"></rank-table>
    <fof-simulate       @close="editClose" ref="simtable"  :titles="current.name"  style="height: 800px"  :code="cur_code"  v-if="diagName=='simuDialog'"></fof-simulate>

    </el-dialog>
    <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="tableVisible"
  >
    <el-button  @click="downFile('/fof/jreport_down')">下载数据</el-button>
    <el-button  @click="downPDF('comparediv')">导出PDF</el-button>
<div ref="comparediv">
    <report-table    ref="compdata"  :titles="current.name"   :tableData="compData"  ></report-table>

     <fund-echart    ref="hischart1"  :titles="current.name"  style="height: 600px" :code="selcode"  ></fund-echart>
</div>
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
    width="50%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="auditVisible">
    <audit-log       @close="editClose" ref="auditlog"  :titles="current.name"  style="height: 600px" :temp="temp" :code="cur_code"  :visable="auditVisible"></audit-log>
    </el-dialog>
    <el-dialog
    width="50%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="concatVisible">
    <concat-log       @close="editClose" ref="concatlog"  :titles="current.name"  style="height: 600px" :temp="temp" :code="cur_code"  :visable="concatVisible"></concat-log>
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
    <el-radio :key="idx" v-for="(item,idx) in sysparam.stage" :label="item.value"></el-radio>
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
      <el-form-item v-if="index<=cForm.length-1"  :prop="row.dataIndex"      :label=" row.tilte">
          <el-select v-if="row.param" v-model="current[row.dataIndex]"  style="width:120px"  clearable :placeholder="row.tilte">
    <el-option
      v-for="item in sysparam[row.param]"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
          <el-input v-else v-model="current[row.dataIndex]"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="12">              
      <el-form-item v-if="index+1<cForm.length"  :prop="cForm[index+1].dataIndex"      :label=" cForm[index+1].tilte">
          <el-select v-if="cForm[index+1].param" v-model="current[cForm[index+1].dataIndex]"  style="width:120px"  clearable :placeholder="cForm[index+1].tilte">
    <el-option
      v-for="item in sysparam[cForm[index+1].param]"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
          <el-input v-else v-model="current[cForm[index+1].dataIndex]"></el-input>
      </el-form-item>
      </el-col>
    </el-row >
    </template>
<el-form-item>
    <el-button  type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button  @click="resetForm('dynamicValidateForm')">重置</el-button>
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
    import AuditLog from '../../components/AuditLog.vue';
    import ConcatLog from '../../components/ConcatLog.vue';
    import Bus from '@/store/bus.js';
    import DB from '@/store/localapi.js';

    import HisTable from '../../components/HisTable';
    import RankTable from '../../components/RankTable';

    import ReportTable from '../../components/ReportTable';
    import FofSimulate from '../../components/FofSimulate';

    import {mapGetters} from 'vuex'

    import FundCorr from '../../components/FundCorr';
   const cForm=[
    {"tilte":"备案号","dataIndex":"code"},
    {"tilte":"名称","dataIndex":"name"},
    {"tilte":"简称","dataIndex":"short_name"},
    {"tilte":"基金类型","dataIndex":"class_type","param":"class_type"},
    {"tilte":"渠道","dataIndex":"type","param":"data_type"},
    {"tilte":"网站代码","dataIndex":"scode"},
    {"tilte":"备注","dataIndex":"remark","type":"textarea"} 

]
  export default {
      components: {
            FundEchart,
            HisTable,
            AuditLog,
            RankTable,
            ConcatLog,
            ReportTable,
            FofSimulate,
            FundCorr
        },
        props: {filters:{
      type: Object,
      default:null
    },},
    computed:{...mapGetters(['sysparam','token','usermenu',"allparam"])},
    data() {
      return {
          cForm,
          allSelect:false,
          selcode:"",
          diagName:"",
          filter:{year:"2022"},
          temp:-1,
          origin:{},
          pdf: null,
        multipleSelection: [],
        sub_type:[],
        current:{},
        cur_code:"",
        dialogVisible: false,
        confirmVisible:false,
        corrVisible:false,
        formVisible:false,
        tableVisible: false,
        hisVisible:false,
        auditVisible:false,
        concatVisible:false,
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
            showSimulate(){
          this.cur_code=""
          this.dialogVisible=true
          this.diagName="simuDialog"
          var selcode=""
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if(this.multipleSelection[i].stage!='非卖'){
              selcode+=this.multipleSelection[i].code+",";
              }
          }
          this.cur_code=selcode
          console.log(this.cur_code)
      },
                  changeSub(row){
                var id=-1
                for (var ap of this.sysparam.class_type)
                {
                    if(ap.code==row){
                        id=ap.id
                        break;
                    }
                    
                }

                this.sub_type=this.allparam['param_'+id]

            },
          editInfo(row){
        //   this.cur_id=row.id
        //   this.current=JSON.parse(JSON.stringify(row))  
          this.current=row
          this.formVisible=true
      },
      submitForm(formName) {
        this.savesqlite([this.current])
                  this.formVisible=false
                  this.getList()

      },
      downData(){
        this.savefundval({"code":"000905.SHW"})
        for (var row of this.totaltableData){
          this.savefundval(row)
        }
      },
      delFund0(row){
          this.confirmVisible=true
          this.current=row
      },
      delFund(row) {
        if(!row){
          row=this.current
        }
    var now= (new Date()).getTime()
        const stmt = DB.prepare('delete from  fund_info where scode =?');
        const info =stmt.run(row['scode'])
        console.log(info)
        this.confirmVisible=false
        this.getList()
   
      },
      addInfo(){
          this.current={stage:"入库"}
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
        downPDF(exportRef){
          this.$tools.downloadPdf(this.$refs[exportRef],"业绩对标.pdf")
        },
        forceUpdate(){
          this.$forceUpdate()
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
          this.diagName="hisChart"
          this.cur_code=row.code
          console.log(this.diagName)
      },
      showRank(){
          this.cur_code=""
          this.dialogVisible=true
          this.diagName="rankDialog"
          var selcode=""
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if(this.multipleSelection[i].stage!='非卖'){
              selcode+=this.multipleSelection[i].code+",";
              }
          }
          this.cur_code=selcode
          console.log(this.cur_code)
      },
      onSubmit(){
          
          var ret=this.$tools.checkModi(this.current,this.origin)
          var $this=this
          ret['code']=this.origin.code
          ret['stage']=this.current.stage
      },
      handleClose(done) {
          done()
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },

      onselectAll(row){

        this.allSelect=!this.allSelect
        var flag=row.length>0
        //console.log(flag)
        this.toggleSelection(this.totaltableData)

      },

      //表格方法
      toggleSelection(rows,) {
        console.log(rows)
        console.log(this.multipleSelection)
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,this.allSelect);
              var insert=true
               for (let i = 0; i < this.multipleSelection.length; i++) {
                  if(this.multipleSelection[i].code==row.code){
                    if(this.allSelect){
                    }else{
                      var a=this.multipleSelection.splice(i,1)
                      console.log('diselc:'+a.name)

                    }
                    insert=false
                    break                    
                  }}
              if(this.allSelect&&insert){
                  this.multipleSelection.push(row)
                }
          });
        } else {
          this.$refs.multipleTable.clearSelection();
          this.multipleSelection=[]
        }
        console.log(this.multipleSelection)
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
      showChartByCodes(codes){
          this.cur_code=""
          this.current={}
          this.dialogVisible=true
          this.cur_code=codes
      },
      viewHis(row){
          this.temp=-1
          this.cur_code=""
          this.current=row
          this.hisVisible=true
          this.cur_code=row.code

      },
      viewAudit(row){
          this.temp=-1
          this.cur_code=""
          this.current=row
          this.auditVisible=true
          this.cur_code=row.code

      },
       viewConcat(row){
          this.temp=-1
          this.cur_code=""
          this.current=row
          this.concatVisible=true
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
        this.multipleSelection = val;

      },
       handlecollapse(val) {
        // if(val.length>1){
          this.filter.extra=val.length
        // }
        // console.log(val);
      },
      resizeChart(){
                this.tmaxh=document.getElementById('tableContainer').clientHeight-120

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
      savesqlite(data){
        var now= (new Date()).getTime()
        const insert = DB.prepare('insert into fund_info(code ,name ,short_name ,create_time  ,type ,scode ,remark ,class_type ) VALUES (@code ,@name ,@short_name ,@create_time  ,@type ,@scode ,@remark ,@class_type)');
        const insertMany = DB.transaction((data) => {
          for (const row of data) {
              row['create_time']=now
              insert.run(row);
          }
        });
        insertMany(data)
      },
      savefundval(row){
        const insert = DB.prepare('insert into fund_val(date,code ,sumval ) VALUES (@date ,@code ,@sumval)');
        const insertMany = DB.transaction((data) => {
          data.index.forEach((ele,index)=>{
              insert.run({"date":ele,"code":data.columns[0],"sumval":data.data[index][0]});
            })
          })
            axis.get('/fof/whis',{params:{"code":row["code"]}})//axis后面的.get可以省略；
                        .then(
                          (response) => {
                            insertMany(response.data)
                            this.$message({
                message: '成功同步'+response.data.index.length+"条数据",
                type: 'success',
                center: true
        });
                          }
                        )
        

        //insertMany(data)
      },
     getList(param){
          // console.log(this.filter)
          // return
             var $this=this
             if(param && typeof(param)=='object' && "click"!=param.type){
                 this.filter=param
             }
             var data=this.filter
             var qsql='SELECT * FROM fund_info where 1=1 '
             if(data&&data.class_type){
               qsql=qsql+ " and class_type='"+data.class_type+"'"
             }
             if(data&&data.name){
               qsql=qsql+ " and ( name like'%"+data.name+"%' or short_name like '%"+data.name+"')"
             }
             console.log(qsql)
                  const stmt = DB.prepare(qsql);
                  this.totaltableData = stmt.all();
                  // this.savefundval(this.totaltableData)
                  this.tableData = this.totaltableData.slice(0 ,this.PageSize);
                  this.$nextTick(() => { 
                  this.resizeChart()})
            // axis( {
            //     url: '/fof/list',
            //     method: 'GET',
            //     params: data
            //     }).then((response) => {
            //                     console.log(this.sysparam);
            //                     console.log(response);
            //                     this.totaltableData = response.data.sort((a,b)=>{return   b['create_time'].localeCompare(a['create_time'])});
            //                     this.savesqlite(this.totaltableData)
            //                     if(this.token=='demo'){
            //                         for (var row in this.totaltableData){
            //                             this.totaltableData[row]["name"]=this.totaltableData[row]["mcode"]
            //                             this.totaltableData[row]["short_name"]=this.totaltableData[row]["mcode"]

            //                         }
            //                     }
            //                     this.tableData = this.totaltableData.slice(0 ,$this.PageSize);
            //                     this.resizeChart()

            //                 })
            //             .catch(
            //                 (error) => {
            //                     console.log(error);
            //         });
            // if(this.$isElectron){

            //  }

            },
              //
        },
    created(){
        console.log(this.$moment().date(-7))
         Bus.$on('cartchart',(arg)=> {
          console.log("========cartchart========")
          var selcode=""
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=this.multipleSelection[i].code+",";
        }
        this.showcomapre(selcode+arg)
          // this.showChartByCodes(arg)
         })
        
    },
     filters: {
   formatDate: function(time) {
        if(time&&time.length>10)
        {
          var date = new Date(time);
          return time.substring(0,10).replaceAll("-","")
        }else{
          return "";
        }
      }},
    mounted() {
            // window.addEventListener("resize", this.resizeChart);
    },
    //   async mounted() {
    //         console.log(this.$route.params)
    //         this.getList(this.$route.params.type);
    //   }
  }
  
</script>