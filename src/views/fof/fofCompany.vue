<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        
        <div style="display: flex;justify-content: space-between">
            <el-button  size="small" @click="toggleSelection()">取消选择</el-button>
            <el-button  size="small" @click="addCompany()">添加</el-button>
            <vxe-input v-model="input" type="search" placeholder="试试全表搜索" @keyup="searchEvent1"></vxe-input>

    <el-select v-model="filter.scale" @change="getList" style="width:80px"  clearable placeholder="规模">
    <el-option
      v-for="item in sysparam.mgt_scale"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
      <el-select v-model="filter.city" @change="getList" style="width:80px"  clearable placeholder="城市" >
    <el-option
      v-for="item in sysparam.city"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button>


        </div>
      </div>
       <vxe-table
          border
          ref="companyTable"
          height="600"
          :row-config="{keyField:'code',isCurrent: true, isHover: true}"
          show-overflow
          :data="totaltableData"
        >
                  <vxe-column  type="checkbox" width="30" fixed="left"></vxe-column>
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
      
          <!-- -->
          <vxe-column    min-width="200" title="名称"   field="name" type="html" >
          </vxe-column> 
          <vxe-column    title="城市"  min-width="60" field="city"  :filters="[]" >
          </vxe-column> 
          <vxe-column    title="规模"  min-width="80" field="scale"  :filters="sysparam.mgt_scale.map(r=> {return {'label' : r.code,'value':r.value}})">
          </vxe-column> 
          <vxe-column    title="接触状态"  min-width="60" field="status"  :filters="sysparam.corp_status.map(r=> {return {'label' : r.code,'value':r.value}})">
          </vxe-column> 
          <vxe-column    title="主策略"  min-width="60" field="master_strategy"  :filters="sysparam.strategy.map(r=> {return {'label' : r.code,'value':r.value}})">
          </vxe-column> 
          <vxe-column    title="代表产品"  min-width="120" field="product"  type="html" >
          </vxe-column> 
          <vxe-column    title="对接人"  min-width="60" field="maintainer"    :filters="sysparam.maintainer.map(r=> {return {'label' : r.code,'value':r.value}})">
          </vxe-column> 
      <vxe-column    title="信息"  min-width="90" align="center" field="level"  >
                 <template #default="{ row }">
             <el-button @click.native.prevent="editStatus(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="编辑" placement="left-start"><i class="el-icon-edit"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="searchProd(row,true)" type="text" size="small"><el-tooltip class="item" effect="dark" content="查询" placement="left-start"><i class="el-icon-search"></i></el-tooltip></el-button>
            <!-- <el-button v-if="usermenu.indexOf('info-edit')>-1" @click.native.prevent="delCompany0(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button> -->

            </template>
          </vxe-column> 
                      <!-- <vxe-column sortable  title="分"  field="lscore" >
          </vxe-column>  -->
        </vxe-table> 
      <div style="display: flex;justify-content: space-between">
      
      <div class="block" style=" margin-top: 25px; height: 120px; ">
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 25, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totaltableData.length">
        </el-pagination> -->

               <!-- <vxe-pager
               @page-change="handleCurrentChange"
            background
            :current-page.sync="currentPage"
            :page-size.sync="PageSize"
            :total="totaltableData.length"
            :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
          </vxe-pager> -->
      </div>
    </div>
    <el-dialog
    width="80%"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
  >
        <el-tabs type="border-card">
      <el-tab-pane ><span slot="label"><i class="el-icon-date"></i> 公司信息</span>  
<el-form :model="curCompany" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
    
      <el-row  >
      <el-col :span="12">
            <el-form-item v-if="curCompany.id"  :prop="'name'"      :label="'名称'"><el-input  v-model="curCompany.name"></el-input>
      </el-form-item>              
      <el-form-item  v-else    label="名称">
    <el-select  v-model="org_id" placeholder="请选择" filterable remote     :remote-method="remoteMethod">
        <el-option
      v-for="item in fcompanys"
      :key="item.org_id"
      :label="item.org_full_name"
      :value="item.org_id">
    </el-option>
  </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
            <el-form-item :span="12"  prop="maintainer"      :label="'对接人'">
                  <el-select filterable allow-create v-model="curCompany['maintainer']"  style="width:120px"  clearable :placeholder="'对接人'">
    <el-option
      v-for="item in sysparam['maintainer']"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
      </el-form-item> 
      </el-col>
    </el-row >
    <template v-for="(row,index)  in cForm" >
     <el-row  :key="index"   v-show="index%2==0">
      <el-col :span="12">          
      <el-form-item v-if="index<=cForm.length-1"  :prop="row.dataIndex"      :label=" row.tilte">
        
                  <el-select v-if="row.param" filterable allow-create v-model="curCompany[row.dataIndex]"  style="width:120px"  clearable :placeholder="row.tilte">
    <el-option
      v-for="item in sysparam[row.param]"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
          <el-input v-else v-model="curCompany[row.dataIndex]"></el-input>
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
</el-tab-pane >
<el-tab-pane ><span slot="label"><i class="el-icon-date"></i> 产品信息</span>  
        <prod-table       @close="editClose" ref="simtable"  :foflist="foflist" :full="true"    ></prod-table>
</el-tab-pane>
        </el-tabs>
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
    import XEUtils from 'xe-utils'
    import FundEchart from '../../components/FundEchart.vue';
    import ProdTable from '../../components/ProdTable.vue';

  const cForm=[
 
 {"tilte":"简称","dataIndex":"short_name"}, 
  {"tilte":"备案号","dataIndex":"reg_code"},
  {"tilte":"接触状态","dataIndex":"status","param":"corp_status" }, 
  {"tilte":"城市","dataIndex":"city"}, 
  {"tilte":"主策略","dataIndex":"master_strategy","param":"strategy" }, 
 {"tilte":"负责人","dataIndex":"manager"},
 {"tilte":"管理规模","dataIndex":"scale" , "param":"mgt_scale" },
  {"tilte":"渠道","dataIndex":"channel"},
 {"tilte":"渠道联系人","dataIndex":"channel_man"},
 {"tilte":"渠道联系方式","dataIndex":"channel_contact"},
  {"tilte":"市场经理","dataIndex":"business_man"},
 {"tilte":"联系方式","dataIndex":"contact"},
  {"tilte":"代表产品","dataIndex":"product"},
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
        filter:{},
        fcompanys:[],
        multipleSelection: [],
        foflist:[],
        dialogCompVisible:false,
        diagName:"",
        org_id:'',
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
    },
    org_id:{handler(n){
         
         let arow= this.fcompanys.filter(r=>r.org_id==n)
         console.log(arow)
         if(arow && arow.length==1){
          this.curCompany=JSON.parse(JSON.stringify(arow[0]))
          this.curCompany['name']=this.curCompany['org_full_name']
          this.curCompany['short_name']=this.curCompany['org_name']
          this.curCompany['manager']=this.curCompany['core_member']
          delete this.curCompany['dst']

         }
		// 初始化操作
      }}
  },
    methods: {
            remoteMethod(query) {
              if(query&&query.length>1){
                axis( {
                url: '/fof/compinfo',
                method: 'GET',
                params: {"qry":query}
                }).then((response) => {
                  this.fcompanys=response.data
                })
              }
          },
        searchProd(row,show=false){
            axis( {
                url: '/fof/list',
                method: 'GET',
                params: {"company_code":row.reg_code}
                }).then((response) => {
                    this.foflist=response.data
                    if(show){
                    this.dialogCompVisible=true
                    this.diagName="prodDiag"
                    }

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
          this.searchProd(row)
      },
      addCompany(){
          this.curCompany={}
          this.dialogVisible=true
      },
      companyProxy(){
        return  {
                seq: true, // 启用动态序号代理（分页之后索引自动计算为当前页的起始序号）
                props: {
                  // 自定义响应结果读取的字段，例如返回结果为：{result: [], page: {total: 10}}
                  result: 'result',
                  total: 'page.total'
                },
                ajax: {
                  // 接收 Promise
                  query: ({ page }) => {
                    return new Promise(resolve => {
                      setTimeout(() => {
                        const list = [
                          { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
                          { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
                          { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
                          { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'Shenzhen' },
                          { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
                          { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
                          { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'test abc' },
                          { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
                          { id: 10009, name: 'Test9', nickname: 'T9', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
                          { id: 100010, name: 'Test10', nickname: 'T10', role: 'Develop', sex: 'Man', age: 35, address: 'Guangzhou' },
                          { id: 100011, name: 'Test11', nickname: 'T11', role: 'Test', sex: 'Women', age: 26, address: 'test abc' },
                          { id: 100012, name: 'Test12', nickname: 'T12', role: 'Develop', sex: 'Man', age: 34, address: 'Guangzhou' },
                          { id: 100013, name: 'Test13', nickname: 'T13', role: 'Test', sex: 'Women', age: 22, address: 'Shenzhen' }
                        ]
                        resolve({
                          page: {
                            total: list.length
                          },
                          result: list.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)
                        })
                      }, 100)
                    })
                  }
                }
              }
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
      filterCity({ options, values, cellValue, row, column })
      {
        consolel.log(options)
        this.filterEvent('city')
        console.log(this.totaltableData)
        this.currentPage=1
        // this.$refs.companyTable.reloadData(this.totaltableData)
        this.handleCurrentChange({pageSize:this.PageSize,currentPage:1})
        this.tableData =  this.totaltableData.slice(startindex ,this.totaltableData.length>this.PageSize?this.PageSize:this.totaltableData.length);
        this.$refs.companyTable.updateData()
      },
      filterEvent (field) {
              const xTable = this.$refs.companyTable
              let column = xTable.getColumnByField(field)
              console.log(column)
              // 修改第一个选项为勾选状态
              let options=column.filters.filter(r=>r.checked).map(r=>r.value)
              console.log(options)
              this.totaltableData=this.rowdata.filter(r=>options.indexOf(r[field])>-1)
            },


        searchEvent1 () {
              const filterName = this.input
              if (filterName) {
                const filterRE = new RegExp(filterName, 'gi')
                const searchProps = ['name', 'short_name']
                const rest = this.rowdata.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))
                this.totaltableData = rest.map(row => {
                  const item = Object.assign({}, row)
                  searchProps.forEach(key => {
                    item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
                  })
                  return item
                })
              } else {
                this.totaltableData = this.rowdata
              }
              console.log(this.totaltableData)
            },
      // 跳转
      handleCurrentChange({ type, currentPage, pageSize, $event }) {
        console.log(`当前页: ${type} size:${pageSize}`);
        // this.currentPage = val;
        //页面每页大小
        console.log(pageSize)
        //当前页
        console.log(this.currentPage)
        let startindex = (this.currentPage - 1) * pageSize;
        if(startindex <= 0){
                  startindex = 0;
        }
        let endindex;
        if (pageSize * this.currentPage > this.totaltableData.length){
            endindex =  this.totaltableData.length ;
        }else{
            endindex =  pageSize * this.currentPage ;
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
                                let citycnt={}
                                let chanelcnt={}
                                this.rowdata=response.data
                                this.totaltableData = response.data;
                                this.totaltableData.map(r=>{
                                  let cnt=citycnt[r['city']]
                                  let ccnt=chanelcnt[r['channel_man']]
                                  if(cnt){
                                    cnt++
                                  }else{cnt=1}
                                  citycnt[r['city']]=cnt

                                  if(ccnt){
                                    ccnt++
                                  }else{ccnt=1}
                                  chanelcnt[r['channel_man']]=ccnt
                                }
                                
                                )
                                let citys=Object.keys(citycnt).sort((b,a)=>citycnt[a]-citycnt[b])
                                let cmans=Object.keys(chanelcnt).sort((b,a)=>chanelcnt[a]-chanelcnt[b])
                                this.$refs.companyTable.setFilter(this.$refs.companyTable.getColumnByField('channel_man'), cmans.map(st=>{return  { label: st, value: st }}))
                                this.$refs.companyTable.setFilter(this.$refs.companyTable.getColumnByField('city'), citys.map(st=>{return  { label: st, value: st }}))
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
<style lang="scss"  >
 .keyword-lighten {
          color: #000;
          background-color: #FFFF00;
        }
</style>