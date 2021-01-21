<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">
           <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
        <el-button  size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button  size="small" @click="allrun()">对比</el-button>
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
      sortable
            fixed="right"
      show-overflow-tooltip>
        <template slot-scope="scope">
            <el-button @click.native.prevent="viewHis(scope.row)" type="text" size="small">    <el-tooltip class="item" effect="dark" content="查看净值历史" placement="left-start">
<i class="el-icon-info"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="viewHisTemp(scope.row)" type="text" size="small"> <el-tooltip class="item" effect="dark" content="核对数据" placement="left-start"><i class="el-icon-success"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="editStatus(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="更新状态" placement="left-start"><i class="el-icon-s-tools"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="uploadFile(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="上传报告" placement="left-start"><i class="el-icon-upload"></i></el-tooltip></el-button>
            <el-button v-show="scope.row.filename"  type="text" size="small"><el-tooltip class="item" effect="dark" content="下载报告" placement="left-start"><a :href=" '/fof/downfile?code='+scope.row.code "><i class="el-icon-download"></i></a></el-tooltip></el-button>

            <el-button v-show="scope.row.compare" @click.native.prevent="vcompare(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="业绩对标" placement="left-start"><i class="el-icon-sort"></i></el-tooltip></el-button>

        </template>
    </el-table-column>

  </el-table>
  <el-upload
              class="upload-demo"
              style="display:none"
              accept=".doc,.dot,.DOC,.DOT.pdf,.PDF"
              action="/fof/upload"
              :data="{code:cur_code}"

              :before-upload="(file)=>loadModel(file)"
              auto-upload
            >
              <el-button id="uploadButton" size="small" type="primary">点击上传</el-button>
            </el-upload>
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
    <fund-echart       @close="editClose" ref="hischart"  :titles="current.name"  style="height: 600px" :code="cur_code"  :visable="dialogVisible"></fund-echart>
    </el-dialog>
    <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="tableVisible"
  >
    <el-button  @click="downFile">下载数据</el-button>

<el-table
      ref="compTable"
      :data="compData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange" 
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
       <el-table-column
        prop="类型"
        width="80"
        label="类型"
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['类型'] }}</template>

      </el-table-column>
       <el-table-column
        prop="子类型"
        width="120"
        label="子类型"
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['子类型'] }}</template>

      </el-table-column>
      <!--      测试项目-->
      <!--      测试用例是否关联-->
      <!--      测试输入-->
      <el-table-column
        prop="本周收益"
        label="本周收益"
        align="right" 
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
              <span :style="'text-align:right;color:'+(scope.row['本周收益']>=0?'red':'green') " >
                    {{showResult(scope.row["本周收益"])}}</span>

        </template>
      </el-table-column>
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
      <el-table-column align="right" prop="2020" label="2020" show-overflow-tooltip>
        <template slot-scope="scope">
                <span :style="'text-align:right;color:'+(scope.row['2020']>=0?'red':'green') " >
{{
          showResult(scope.row["2020"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2019" label="2019" show-overflow-tooltip>
        <template slot-scope="scope">
            <span :style="'text-align:right;color:'+(scope.row['2019']>=0?'red':'green') " >{{
          showResult(scope.row["2019"])
        }}</span></template>
      </el-table-column>
      <el-table-column align="right" prop="2018" label="2018" show-overflow-tooltip>
        <template slot-scope="scope">
            <span :style="'text-align:right;color:'+(scope.row['2018']>=0?'red':'green') " >{{
          showResult(scope.row["2018"])
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
    <el-radio label="预选"></el-radio>
    <el-radio label="二选"></el-radio>
    <el-radio label="备投"></el-radio>
    <el-radio label="已投"></el-radio>
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

  export default {
      components: {
            FundEchart,
            HisTable
        },
    data() {
      return {
          temp:-1,
          origin:{},
          filter:{},
          options: [{
          value: '预选',
          label: '预选'
        }, {
          value: '二选',
          label: '二选'
        }, {
          value: '备投',
          label: '备投'
        }, {
          value: '已投',
          label: '已投'
        }],
        class_types: [{
          value: 'CTA',
          label: 'CTA'
        }, {
          value: '指增',
          label: '指增'
        }, {
          value: '套利',
          label: '套利'
        }, {
          value: '混合',
          label: '混合'
        }, {
          value: '期权',
          label: '期权'
        }],
        multipleSelection: [],
        current:{},
        cur_code:"",
        dialogVisible: false,
        tableVisible: false,
        hisVisible:false,
        editVisible:false,
        compData:[],
        rowdata: '',
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
          this.getList(n.params)
		// 初始化操作
      },
      immediate: true,
      deep: true,
    }
  },
    methods: {
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
        
        downFile(){
        var url="/fof/report"
        if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=","+this.multipleSelection[i].code;
        }
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
       downFile(){
            if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        console.log(this.multipleSelection)
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=this.multipleSelection[i].code+",";
        }
        var url="/fof/down_jreport"
      
        const options = {"code":selcode}
        this.$tools.exportExcel(url,options)
        },
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
        console.log(this.$moment().day(-7))
        console.log(this.$moment().date(-7))
        
    }
    //   async mounted() {
    //         console.log(this.$route.params)
    //         this.getList(this.$route.params.type);
    //   }
  }
  
</script>