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
        <el-button  size="small" @click="showRank()">排名</el-button>
        <el-button  size="small" @click="showSimulate()">仿真</el-button>

        <el-select v-model="filter.stage" @change="getList" style="width:80px"  clearable placeholder="阶段">
    <el-option
      v-for="item in sysparam.stage"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
  <el-select v-model="filter.class_type" @change="changeSub"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
  <el-select v-model="filter.sub_type" @change="getList"  style="width:100px"  clearable placeholder="子">
    <el-option
      v-for="item in sub_type"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>  
        <el-button  size="small" @click="downFile()">下载</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px" ></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button>
        </div>
      </div>
   <!-- <el-collapse  @change="handlecollapse">
  <el-collapse-item title="高级搜索" name="1">
    <div>
      <el-row>
        <el-col :span="4">年化收益<el-input @input="forceUpdate" v-model="filter['yavg']" clearable placeholder="年化收益" style="width:80px"></el-input></el-col>
        <el-col :span="6">近三年平均收益<el-input @input="forceUpdate" v-model="filter['y3avg']" clearable placeholder="近3年均收益" style="width:80px"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="4">年份</el-col>
        <el-col :span="4">收益</el-col>
        <el-col :span="4">波动率</el-col>
        <el-col :span="4">夏普</el-col>
        <el-col :span="4">卡玛</el-col>
        <el-col :span="4">最大回撤</el-col>
      </el-row>
        <el-row  :key="year" v-for=" year in  ['2021','2020','2019','2018']"  >
    <el-col :span="1">{{year}}</el-col>
    <el-col :span="4"><el-input @input="forceUpdate" v-model="filter['e_y'+year]" clearable :placeholder="year+'收益'" style="width:180px"></el-input></el-col>
    <el-col :span="4"><el-input @input="forceUpdate" v-model="filter['e_vola'+year]" clearable :placeholder="year+'波动率'" style="width:180px"></el-input></el-col>
    <el-col :span="4"><el-input @input="forceUpdate" v-model="filter['e_sharp'+year]" clearable :placeholder="year+'夏普'" style="width:180px"></el-input></el-col>
    <el-col :span="4"><el-input @input="forceUpdate" v-model="filter['e_calmar'+year]" clearable :placeholder="year+'卡玛'" style="width:180px"></el-input></el-col>
    <el-col :span="4"><el-input @input="forceUpdate" v-model="filter['e_dd'+year]" clearable :placeholder="year+'最大回撤'" style="width:180px"></el-input></el-col>
           </el-row>

    </div>
  </el-collapse-item>
   </el-collapse> -->
      <el-table
    ref="multipleTable"
    :data="tableData"
    :max-height="tmaxh"
    :row-key="(row)=>{ return row.code}"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px;"
    @select-all="onselectAll"
    @select="handleSelectionChange"      >
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
     <template slot-scope="scope">
       <el-button  @click.native.prevent="addCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>
       <a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.short_name }}</a></template>
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
      label="入库"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.create_time|formatDate }}</template>
    </el-table-column>
    <el-table-column
      prop="sub_type"
      label="子类型"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.sub_type }}</template>
    </el-table-column>
    <!-- <el-table-column
      prop="buy_date"
      label="建仓日期"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.buy_date }}</template>
    </el-table-column> -->
     <el-table-column
      prop="stage"
      label="状态"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.stage }}</template>
    </el-table-column>
     <el-table-column
      prop="fee"
      label="管理费"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.fee }}</template>
    </el-table-column>
     <el-table-column
      prop="carry"
      label="carry"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.carry }}</template>
     </el-table-column>>
    
<!--      测试输入-->
    
 <!-- <el-table-column
      prop="name"
      label="基金名称"
      show-overflow-tooltip>
      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.name }}</a></template>
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
            <el-button @click.native.prevent="viewHis(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="查看净值历史" placement="left-start">
<i class="el-icon-info"></i></el-tooltip></el-button>
<el-button @click.native.prevent="viewAudit(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="查看审核历史" placement="left-start">
<i class="el-icon-s-order"></i></el-tooltip></el-button>
            <!-- <el-button @click.native.prevent="viewHisTemp(scope.row)" type="text" size="small"> <el-tooltip class="item" effect="dark" content="核对数据" placement="left-start"><i class="el-icon-success"></i></el-tooltip></el-button> -->
            <el-button v-if="usermenu.indexOf('info-audit')>-1" @click.native.prevent="editStatus(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="更新状态" placement="left-start"><i class="el-icon-s-tools"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="editInfo(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="编辑" placement="left-start"><i class="el-icon-edit"></i></el-tooltip></el-button>
            <el-button v-if="usermenu.indexOf('info-edit')>-1"  @click.native.prevent="uploadFile(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="上传报告" placement="left-start"><i class="el-icon-upload"></i></el-tooltip></el-button>
            <el-button v-show="scope.row.filename"  type="text" size="small"><el-tooltip class="item" effect="dark" content="下载报告" placement="left-start"><a :href=" '/fof/downfile?code='+scope.row.code "><i class="el-icon-download"></i></a></el-tooltip></el-button>
            <el-button v-show="scope.row.combine" @click.native.prevent="viewConcat(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="拼接历史" placement="left-start"><i class="el-icon-link"></i></el-tooltip></el-button>
            <el-button v-show="scope.row.compare" @click.native.prevent="vcompare(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="业绩对标" placement="left-start"><i class="el-icon-sort"></i></el-tooltip></el-button>
            <el-button v-if="usermenu.indexOf('info-edit')>-1" @click.native.prevent="delFund0(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

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
     :visible.sync="dialogVisible"
     >
    <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"   v-if="diagName=='hisChart'"></fund-echart>
    <his-table       @close="editClose" ref="histable"  :titles="current.name"  style="height: 600px" :temp="temp" :code="cur_code"  v-if="diagName=='hisTable'"></his-table>
    <rank-table       @close="editClose" ref="ranktable"  :titles="current.name"  style="height: 800px"  :code="cur_code"  v-if="diagName=='rankDialog'"></rank-table>
    <fof-simulate       @close="editClose" ref="simtable"  :titles="current.name"  style="height: 900px"  :code="cur_code"  v-if="diagName=='simuDialog'"></fof-simulate>

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
    <el-button v-if="usermenu.indexOf('info-edit')>-1" type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button v-if="usermenu.indexOf('info-edit')>-1" @click="resetForm('dynamicValidateForm')">重置</el-button>
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
    import HisTable from '../../components/HisTable.vue';
    import RankTable from '../../components/RankTable.vue';
    import FofSimulate from '../../components/FofSimulate';

    import ReportTable from '../../components/ReportTable';
    import {mapGetters} from 'vuex'

    import FundCorr from '../../components/FundCorr.vue';
   const cForm=[
    {"tilte":"备案号","dataIndex":"code"},
    {"tilte":"名称","dataIndex":"name"},
    {"tilte":"简称","dataIndex":"short_name"},
    {"tilte":"基金类型","dataIndex":"class_type","param":"class_type"},
    {"tilte":"投资类型","dataIndex":"scale","param":"scale"},
    {"tilte":"购买时净值","dataIndex":"buy_price"},
    {"tilte":"子类型","dataIndex":"sub_type"},
    {"tilte":"购买时间","dataIndex":"buy_date"},
    {"tilte":"份额","dataIndex":"amount"},
    {"tilte":"所属公司","dataIndex":"company"},
    {"tilte":"渠道","dataIndex":"type","param":"data_type"},
    {"tilte":"网站代码","dataIndex":"scode"},
    {"tilte":"基金成立时间","dataIndex":"founded"},
    {"tilte":"状态","dataIndex":"stage","param":"stage"},
    {"tilte":"子基金对标","dataIndex":"compare"},
    {"tilte":"管理费","dataIndex":"fee"},
    {"tilte":"carry","dataIndex":"carry"},
    {"tilte":"业绩报酬计提方式","dataIndex":"perf_comp"},
    {"tilte":"止损","dataIndex":"lost"},
    {"tilte":"预警","dataIndex":"alarm"},
    {"tilte":"风险等级","dataIndex":"risk_level","param":"risk_"},
    {"tilte":"预期收益(年)","dataIndex":"rate"},
    {"tilte":"预期最大回撤","dataIndex":"max_return"},
    {"tilte":"预期夏普","dataIndex":"sharp"},
    {"tilte":"预期卡玛","dataIndex":"calmar"},
    {"tilte":"其他关键条款","dataIndex":"other"},
    {"tilte":"渠道","dataIndex":"channel"},
    {"tilte":"渠道联系人","dataIndex":"channel_man"},
    {"tilte":"渠道联系方式","dataIndex":"channel_contact"},
    {"tilte":"备注","dataIndex":"remark","type":"textarea"} ,

    

]
  export default {
      components: {
            FundEchart,
            HisTable,
            RankTable,
            AuditLog,
            ConcatLog,
            FofSimulate,
            ReportTable,
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
          selcode:"",
          allSelect:false,
          filter:{year:"2022"},
          temp:-1,
          origin:{},
          pdf: null,
        multipleSelection: [],
        sub_type:[],
        current:{},
        cur_code:"",
        diagName:"",
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
      onselectAll(row){

        this.allSelect=!this.allSelect
        console.log(row)
        var flag=row.length>0
        //console.log(flag)
        this.toggleSelection(this.totaltableData)

      },
          addCart(row){
        Bus.$emit("addcart",row)
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
          if(this.current.type && this.current.class_type){
            
          
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
    )}else{
        this.$message({
            showClose: true,
            message: "类型和来源为必填项",
            type: "error"
          })
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
      //   downloadPdf (exportdiv) {
      //   this.pdf = this.$refs[exportdiv]
      //   let target = this.pdf
        
      //   html2canvas(target, {
      //       useCORS: true, // 当图片是链接地址时，需加该属性，否组无法显示图片
      //       "imageTimeout": 0,
      //       'scale': 1,
      //       "width": target.clientWidth,
      //       "height": target.clientHeight,
      //     })
      //       .then(canvas => {
      //         console.log(canvas)
      //         let contentWidth = canvas.width; // 592px
      //         let contentHeight = canvas.height; // 841px
      //         //一页pdf显示html页面生成的canvas高度;
      //         let pageHeight = contentWidth / 592 * 841;
      //         //未生成pdf的html页面高度
      //         let leftHeight = contentHeight;
      //         //页面偏移
      //         // let offsetX = 100;
      //         // let offsetY = 100;
      //         let offsetX = 0;
      //         let offsetY = 0;
      //         //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      //         let imgWidth = 592;
      //         //let imgWidth = 592 - 2 * offsetX;//边框留白
      //         let imgHeight = imgWidth / contentWidth * contentHeight;
      //         let pageData = canvas.toDataURL('image/jpeg', 1.0);
 
      //         // 第一个方向,第二个单位,第三个尺寸格式
      //         // landscape横向
      //         // let pdf = new jspdf('landscape', 'pt', 'a4');
      //         let pdf = new jspdf('', 'pt', 'a4');
 
      //         //有两个高度需区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //         //当内容未超过pdf一页显示的范围，无需分页
      //         if(leftHeight < pageHeight) {
      //           pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      //         } else {
      //           while(leftHeight > 0) {
      //             pdf.addImage(pageData, 'JPEG', offsetX, offsetY, imgWidth, imgHeight)
      //             leftHeight -= pageHeight;
      //             offsetX -= 592;
      //             offsetY -= 841;
      //             //避免添加空白页
      //             if(leftHeight > 0) {
      //               pdf.addPage();
      //             }
      //           }
      //         }
      //         let name = '业绩对标.pdf'; // 定义生成的pdf的文件名字
      //         pdf.save(name);
      //       });
      // },
showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,3)
    },
      showHis(row){
          console.log(this.diagName)
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
      onSubmit(){
          
          var ret=this.$tools.checkModi(this.current,this.origin)
          var $this=this
          ret['code']=this.origin.code
          ret['stage']=this.current.stage
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
          this.diagName="hisChart"
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
          this.dia=true
          this.cur_code=row.code
          this.dialogVisible=true
          this.diagName="hisTable"


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
          this.dialogVisible=true
          this.diagName="hisTable"
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
        //   console.log(this.multipleSelection)

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
       handlecollapse(val) {
        // if(val.length>1){
          this.filter.extra=val.length
        // }
        // console.log(val);
      },
      resizeChart(){
                console.log(this.$refs['tableContainer'].clientHeight)
                this.tmaxh=this.$refs['tableContainer'].clientHeight-120

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
      seachChange(param){
        console.log(param)
        this.getList()
      },
     getList(param){
          // console.log(this.filter)
          // return
             var $this=this
             console.log(param)
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
                                console.log(this.sysparam);
                                console.log(response);
                                this.totaltableData = response.data.sort((a,b)=>{return   b['create_time'].localeCompare(a['create_time'])
});
                                if(this.token=='demo'){
                                    for (var row in this.totaltableData){
                                        this.totaltableData[row]["name"]=this.totaltableData[row]["mcode"]
                                        this.totaltableData[row]["short_name"]=this.totaltableData[row]["mcode"]

                                    }
                                }
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
         Bus.$on('cartchart',(arg)=> {
          console.log("========cartchart========")
          var selcode=""
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=this.multipleSelection[i].code+",";
        }
        this.showcomapre(selcode+arg)
          // this.showChartByCodes(arg)
         })

        Bus.$on('cartrank',(arg)=> {
          console.log("========cartrank========")
          this.cur_code=""

          var selcode=""
          for (let i = 0; i < this.multipleSelection.length; i++) {
              if(this.multipleSelection[i].stage!='非卖'){
              selcode+=this.multipleSelection[i].code+",";
              }
          }
          this.cur_code=selcode+arg
          this.diagName="rankDialog"
          this.dialogVisible=true
          // this.showChartByCodes(arg)
         })

        Bus.$on('calcsimu',(arg)=> {
          console.log("========cartrank========")
          this.cur_code=""

          var selcode=""
          for (let i = 0; i < this.multipleSelection.length; i++) {
              if(this.multipleSelection[i].stage!='非卖'){
              selcode+=this.multipleSelection[i].code+",";
              }
          }
          this.cur_code=selcode+arg
          this.diagName="simuDialog"
          this.dialogVisible=true
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
            window.addEventListener("resize", this.resizeChart);
    },
  }
  
</script>
<style lang="scss" scoped>
.el-dialog__body{
    padding: 10px 10px;
}
</style>