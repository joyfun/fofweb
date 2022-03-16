<template>
  <div id="tableContainer" style="height: 100%">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 资金状况</span>
<!-- 
        <vxe-table
          :align="allAlign"
          :data="tableData1">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="Name"></vxe-column>
          <vxe-column field="sex" title="Sex"></vxe-column>
          <vxe-column field="age" title="Age"></vxe-column>
        </vxe-table> -->

<el-row>
  <el-col :span="14">
    <el-card>
        <vxe-table
          border
          :align="allAlign"
          size="mini"
          :mouse-config="{selected: true}"
          show-overflow
          :data="compData1"
          :edit-config="{trigger: 'dblclick', mode: 'cell', activeMethod: activeCellMethod}"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}">
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column width="140" field="name" title="募集层一" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.name" class="myinput"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column :key="af" v-for="af of ['SSN818','SSN369','STE599','多策略FOF直投','SY9620']"  :field="af" :title="showFundName(af)" :edit-render="{}"  :class-name="cellClass1">
            <template #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" @change="changeIncome1" v-model="row[af]" class="myinput"></vxe-input>
            </template>
          </vxe-column>
        </vxe-table> 
    </el-card>
    <el-card>

       <vxe-table
          border
          :align="allAlign"
          size="mini"
          :mouse-config="{selected: true}"
          show-overflow
          :data="compData2"
          :edit-config="{trigger: 'dblclick', mode: 'cell', activeMethod: activeCellMethod}"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}">
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column width="160" field="name" title="募集层二" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.name" class="myinput"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column :key="af" v-for="af of ['SSN818','SSN369','STE599','SSS105']"  :field="af" :title="showFundName(af)" :edit-render="{}"  :class-name="cellClass1">
            <template #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" @change="changeIncome2" v-model="row[af]" class="myinput"></vxe-input>
            </template>
          </vxe-column>
        </vxe-table> 
      </el-card>
    <el-card>
        <vxe-table
          border
          :align="allAlign"
          size="mini"
          :mouse-config="{selected: true}"
          show-overflow
          :data="compData3"
          :edit-config="{trigger: 'dblclick', mode: 'cell', activeMethod: activeCellMethod}"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}">
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column width="160" field="name" title="交易层" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.name" class="myinput"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column :key="af" v-for="af of ['SSN818','SSN369','STE599']"  :field="af" :title="showFundName(af)" :edit-render="{}"  :class-name="cellClass">
            <template #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" @change="changeIncome3" v-model="row[af]" class="myinput"></vxe-input>
            </template>
          </vxe-column>
        </vxe-table> 
        </el-card>
        </el-col><el-col :span="10">
    <vxe-table
          align="right"
          show-footer
          :footer-method="footerMethod1"
          size="mini"
          :data="finalData">
          <vxe-column field="name" title="基金名称" width="160"> </vxe-column>
          <vxe-column field="marketval" title="市值" width="80">
            <template #default="{ row }">
              {{ showMoney(row.marketval) }}
            </template>
            </vxe-column>
         <!-- --><vxe-column field="cash" title="可用资金"> <template #default="{ row }">
              {{ showMoney(row.cash) }}
            </template>
            </vxe-column>
          <vxe-column field="income" title="预入款"> <template #default="{ row }">
              {{ showMoney(row.income) }}
            </template>
            </vxe-column>
          <vxe-column field="redeem" title="预赎回"> <template #default="{ row }">
              {{ showMoney(row.redeem) }}
            </template>
            </vxe-column>
          <vxe-column field="buy" title="待投资"> <template #default="{ row }">
              {{ showMoney(row.buy) }}
            </template>
            </vxe-column>
          <vxe-column field="process" title="其它"> <template #default="{ row }">
              {{ showMoney(row.process) }}
            </template>
            </vxe-column> 

        </vxe-table>
                    <sankey-chart    ref="vchart"  titles="虚拟FOF"  style="height: 600px" :finalData="detailData" :total="compData1.length" ></sankey-chart>

        </el-col>
      </el-row>
      </el-tab-pane>
      <el-tab-pane label="资金预操作"
        >
        <div style="display: flex; justify-content: space-between">
          <el-button size="small" @click="addAction()">添加操作</el-button>
        </div>
        <vxe-table
          ref="actionTable"
          :data="actionData"
          tooltip-effect="dark"
          :max-height="tmaxh"
          style="width: 100%; margin-top: 20px"
        >
          <vxe-column
            title="基金名称"
            sortable
            field="code"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{
              showFundName(scope.row.code)
            }}</template>
          </vxe-column>
          <vxe-column
            title="操作"
            sortable
            field="stage"
            show-overflow-tooltip
          >
          </vxe-column>
          <vxe-column
            title="产品"
            sortable
            field="b_code"
            show-overflow-tooltip
          ><template slot-scope="scope">{{
              showFundName(scope.row.b_code)
            }}</template>
          </vxe-column>
          <vxe-column
            title="金额(万)"
            sortable
            align="right"
            field="marketval"
            show-overflow-tooltip
          >
          </vxe-column>
          <vxe-column
            title=""
            show-overflow-tooltip
          ><template slot-scope="scope">
            <el-button  @click.native.prevent="delAction(scope.row,scope.rowIndex)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

                  </template>
          </vxe-column>
          <vxe-column
            label="操作时间"
            sortable
            prop="add_time"
            show-overflow-tooltip
          >
          <template slot-scope="scope">{{
              $moment(scope.row.add_time).format("YYYY-MM-DD")
            }}</template>
          </vxe-column> 
           </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="资金明细">
        <!-- <el-button @click="addAction">添加</el-button> -->

          <vxe-toolbar>
          <template #buttons>
            <vxe-button @click="showRankHis">排名对比</vxe-button>
            <vxe-button @click="addAction">添加</vxe-button>
          </template>
        </vxe-toolbar>
        <vxe-table
          ref="detailTable"
          align="right"
          height="auto"
          size="small"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'name', order: 'asc'}, orders: ['desc', 'asc', null]}"
          :data="detailData">
          <vxe-column type="checkbox" width="30"></vxe-column>
          <vxe-column field="name" title="产品"  sortable width="160"> </vxe-column>
          <vxe-column field="b_name" align="left" title="基金名称" width="200">  
            <template #default="{ row }">
                   <el-button  @click.native.prevent="addCart(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>
       <a href="javascript:;" @click="showHis(row)">{{ row.b_name }}</a>
                    <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="历史" placement="left-start"><i class="el-icon-s-marketing" ></i></el-tooltip></el-button>

            </template>

             </vxe-column>
          <vxe-column field="marketval" title="市值" width="80">
            <template #default="{ row }">
              {{ showMoney(row.marketval) }}
            </template>
            </vxe-column>
                    <vxe-colgroup title="排名信息" align="center">
          <vxe-column :key="type" :field="type+'_r'" width="80" sortable :title="type+'('+rlen[type]+')'" :filters="[{label: '减退', value: 0.5},{label: '正常', value: 0}]" :filter-method="filterStatusMethod"   v-for=" type of this.types">
            </vxe-column>
                    </vxe-colgroup>
          <vxe-column field="stage" title="状态" width="60"></vxe-column>
          <vxe-column field="mstatus" title="减退" width="60" sortable>
          </vxe-column>

          <vxe-column field="act_amount" title="操作金额(万)" width="80">
            <!-- <template #default="{ row }">
              {{ showMoney(row.act_amount) }}
            </template> -->
            </vxe-column>
          <vxe-column
            title="操作"
             width="120"
            show-overflow-tooltip
          ><template slot-scope="scope">
               <el-button
                v-if="scope.row['b_code'].length == 6"
                @click="fundAction(scope.row)"
                >操作</el-button>
              <el-button v-if="scope.row['id']" @click="delAction(scope.row)"
                >删除</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
     
        </el-tab-pane>
      <!-- <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
    </el-tabs>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="actionDiagShow"
    >
      <el-form
        :rules="rules"
        :model="curAction"
        ref="actionForm"
        label-width="120px"
      >
        <el-form-item label="基金名称" prop="code">
          <!-- <el-input placeholder="基金名称" v-model="curAction.name" ></el-input> -->
          <el-select
            v-model="curAction.code"
            style="width: 160px"
            @change="changeFOF"
            clearable
            placeholder="基金选择"
          >
            <el-option
              v-for="item in sysparam.FOF"
              :key="item.value"
              :label="item.value"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作类型">
          <!-- <el-input placeholder="操作类型" v-model="curAction.stage" ></el-input> -->
          <el-select
            v-model="curAction.stage"
            style="width: 160px"
            clearable
            @change="changeStage"
            placeholder="操作类型"
          >
            <el-option
              v-for="item in stages"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标的">
                    <el-select
            v-model="curAction.b_code"
            filterable
            :disabled="prodDisabled"
            @change="changeTarget"
            style="width: 160px"
            clearable
            placeholder="标的选择"
          >
          <!-- <el-option   :key="'CASH'"
              :label="'现金'"
              :value="'CASH'">
          </el-option> -->
            <el-option
              v-for="item in foflist"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作金额(万)" prop="marketval">
          <el-input
            placeholder="操作金额"
            v-model="curAction.marketval"
          ></el-input>
        </el-form-item>
        <!-- -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('actionForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('actionForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
 <script>
import { mapGetters, mapMutations, mapState } from "vuex";
import SankeyChart from "@/components/SankeyChart.vue";
import Bus from '@/store/bus.js';

export default {
          components: {
            SankeyChart,
        },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  computed: {
    gridOptions1(){
      
    },
    combineDate() {
      return this.detailData.concat(this.actionData);
    },
    ...mapState(["foflist"]),
    ...mapGetters(["sysparam","token","showFundName"]),
  },
  data() {
    return {  allAlign: 'right',
              compData1: [],
              compData2: [],
              compData3: [],
              sexList: [
                { label: '', value: '' },
                { label: '男', value: '1' },
                { label: '女', value: '0' }
              ],
      rules: {
        code: [{ required: true, message: "请选择基金", trigger: "blur" }],
        name: [{ required: true, message: "请选择基金", trigger: "blur" }],
        marketval: [{ required: true, message: "请输入金额", trigger: "blur" }],
      },
      stages: ["预赎回", "待投资", "预入款"],
      actionDiagShow: false,
      curAction: {},
      prodDisabled:false,
      finalData: [],
      footerData:[],
      detailData: [],
      tableData: [],
      actionData: [],
      rlen:{},
      types: ['aas','cta0','cta1','指增','中性'],
      tmaxh: 600,
    };
  },
  methods: {
    delAction(row,idx){
      this.actionData.splice(idx,1)
      this.saveAction()

    },
    addCart(row){
      if(row['b_code']){
        Bus.$emit("addcart",{code:row['b_code'],name:row['b_name']})
      }
    },
     showFundHis(row){
          Bus.$emit("showChart",{"cur_code":row.b_code,"diagName":"hisChart"})

      },
      showHis(row){
          Bus.$emit("showChart",{"cur_code":row.b_code,"diagName":"rankChart"})

      },
     showRankHis(){
          let sels=this.$refs.detailTable.getCheckboxRecords()
          Bus.$emit("showChart",{"cur_code":sels.map(r=>r["b_code"]).join(','),"diagName":"rankChart"})

      },
    cellClass1(row){
      let colsize=row.$table.getColumns().length
      if(row.row['name']=='待分配合计' &&row.columnIndex==colsize-1){
        return 'background-yellow'
      }
      return ''
    },
    cellClass(row){
      if(row.row['name']=='待分配合计'){
        return 'background-yellow'
      }
return ''
    },
            activeCellMethod ({ row, rowIndex }) {
              if (rowIndex === 0) {
                return true
              }
              return false
            },
            editDisabledEvent ({ row, column }) {
              //if(row['name']==)
              // this.$XModal.message({ content: '禁止编辑', status: 'error' })
            },

    updateCash(code,row){
            if(row['value']&&row['value'].length>1){

        let old=this.actionData.filter(row=>row["code"]==code&&row["stage"]=="预入款")
        if(old.length==1){
          old[0]["marketval"]=row['value']
        }else{
          this.actionData.push({"code":code,"stage":"预入款","b_code":"CASH","marketval":row['value']})
        }}
    },
    filterStatusMethod({value, row, column} ) {
             console.log(row)
             console.log(column.field)

              //  for (let tp of this.types){
              //    let lower= row[tp+'_r']>value
              //    if(lower){
              //     console.log(row)
              //      return  lower
              //    }
              //  }
              let fld=column.field.split("_")[0]
              if(this.rlen[fld]){
              return row[column.field]/this.rlen[fld] >= value
              }
              return false
            },

    updateInvest(code,b_code,row){
      if(row['value']&&row['value'].length>1){
        let old=this.actionData.filter(row=>row["code"]==code&&row["b_code"]==b_code&&row["stage"]=="待投资")
        if(old.length==1){
          old[0]["marketval"]=row['value']
        }else if(old.length==0){
          this.actionData.push({"code":code,"stage":"待投资","b_code":b_code,"marketval":row['value']})
        }}
    },

    getCash(code){
      return this.actionData.reduce((prev,row)=> {
              if(row["code"]==code&&row["stage"]=="预入款"){
                prev=prev+parseFloat(row['marketval'])
              }
              return prev
      },0)
    },
    changeIncome1(row,cell){
        this.genNoUsed1()
        this.genNoUsed3()
    },
    changeIncome2(row,cell){
        this.genNoUsed2()
        this.genNoUsed3()
        // this.updateCash("SSS105",row)
    },
    changeIncome3(row,cell){
        this.genNoUsed2()

    },
    genNoUsed1(){
      let toinvest=0
      let toredeem=0
      for(var key of ["SSN818","SSN369","STE599","多策略FOF直投"]){
      this.compData1[4][key]=this.compData1[0][key]
      if(this.compData1[0][key]){
          toinvest+=parseFloat(this.compData1[0][key])
      }
      if(this.compData1[1][key]){
          toredeem+=parseFloat(this.compData1[1][key])
      }
      this.updateInvest("SY9620",key,{"value":this.compData1[0][key]})
      }
      this.updateCash("SY9620",{"value":this.compData1[0]["SY9620"]})
      this.compData1[1]['SY9620']=toredeem
      this.compData1[3]["SY9620"]=Math.round(this.detailData.reduce((prev,next)=>{if(next['code']=='SY9620'){
        return prev+next['marketval']
      }return prev},0)/10000)
      this.compData1[2]["SY9620"]=Math.round(this.finalData.filter(row=>row["code"]=='SY9620')[0]['cash']/10000)
      this.compData1[2]["多策略FOF直投"]='-'
      this.compData1[4]["多策略FOF直投"]=0
      for (let i=0;i<2;i++){
                if(this.compData1[i]["多策略FOF直投"])
      this.compData1[4]["多策略FOF直投"]+=parseFloat(this.compData1[i]["多策略FOF直投"])
      }
      this.compData1[4]["SY9620"]=-toinvest
      for (let i=0;i<3;i++){
        if(this.compData1[i]["SY9620"])
        this.compData1[4]["SY9620"]+=parseFloat(this.compData1[i]["SY9620"])
      }
      // this.genNoUsed3()
    },
    genNoUsed2(){
      let toinvest=0
      let toredeem=0
      for(var key of ["SSN818","SSN369","STE599"]){
      this.updateInvest("SSS105",key,{"value":this.compData2[0][key]})
      this.compData2[4][key]=this.compData2[0][key]
      if(this.compData2[0][key]){
          toinvest+=parseFloat(this.compData2[0][key])
      }
      if(this.compData2[1][key]){
          toredeem+=parseFloat(this.compData2[1][key])
      }
      }
      this.updateCash("SSS105",{"value":this.compData2[0]["SSS105"]})
      this.compData2[1]['SSS105']=toredeem
      this.compData2[3]["SSS105"]=Math.round(this.detailData.reduce((prev,next)=>{if(next['code']=='SSS105'){
        return prev+next['marketval']
      }return prev},0)/10000)
      this.compData2[2]["SSS105"]=Math.round(this.finalData.filter(row=>row["code"]=='SSS105')[0]['cash']/10000)
      this.compData2[4]["SSS105"]=-toinvest
      for (let i=0;i<3;i++){
        if(this.compData2[i]["SSS105"])
        this.compData2[4]["SSS105"]+=parseFloat(this.compData2[i]["SSS105"])
      }

    },

      genNoUsed3(){
      let toinvest=0
      let toredeem=0
      for(var key of ["SSN818","SSN369","STE599"]){
      this.compData3[5][key]=parseFloat(this.compData1[4][key])+parseFloat(this.compData2[4][key])-parseFloat(this.compData3[4][key])
      }
      let fofs=["SY9620","SSS105","SSN818","SSN369","STE599"]
      this.finalData.sort((a,b)=>{return fofs.indexOf(a.code)-fofs.indexOf(b.code)})

      // this.compData2[1]['SSS105']=toredeem
      // this.compData2[3]["SSS105"]=Math.round(this.detailData.reduce((prev,next)=>{if(next['code']=='SSS105'){
      //   return prev+next['marketval']
      // }return prev},0)/10000)
      // this.compData2[2]["SSS105"]=Math.round(this.finalData.filter(row=>row["code"]=='SSS105')[0]['cash']/10000)

      // this.compData2[4]["SSS105"]=-toinvest
      // for (let i=0;i<3;i++){
      //   if(this.compData2[i]["SSS105"])
      //   this.compData2[4]["SSS105"]+=parseFloat(this.compData2[i]["SSS105"])
      // }

    },
    footerMethod1(columns,data){
     let cols=columns.columns
     let ret=["总投资规模"]
let selffund=this.finalData.filter(row=>["SY9620","SSS105"].indexOf(row.code)>-1 )
     for (let cidx=1;cidx<cols.length;cidx++){
      let cf=cols[cidx].field
      let csum=selffund.reduce((prev,row)=>prev+row[cf],0)
       ret.push(this.showMoney(Math.round(csum)))
     }
      return [ret]

    },
    genTitleData1(){
      const cols=["预入款","预赎回","现金","在投","待分配合计"]
      const keys=["income","redeem","cash","marketval","unused"]
      const fofs=["SSN818","SSN369","STE599"] //["SY9620"]

      let rets=[]
      for(var col in cols){
        var ret={"name":cols[col]}
        for (var af of fofs ){
          var doact=this.detailData.filter((row)=>row['b_code']&&row['b_code']==af&&row['code']=='SY9620')
          if(doact&&doact.length>0){
            if(doact[0]['stage']==ret["name"]){
                ret[af]=doact[0]["act_amount"]
            }else if(ret["name"]=="在投"){
                ret[af]=Math.round(doact[0]["marketval"]/10000)
            } else{
              ret[af]=0
            }           
          }else{
              ret[af]=0
            }
          if(col==2){
              ret[af]='-'
            }   
      }
      let holds=this.detailData.filter((row)=>(fofs.indexOf(row['b_code'])<0) &&row['code']=='SY9620')
      if(ret["name"]=='在投'){
          ret["多策略FOF直投"]=Math.round(holds.reduce(function (prev, next) {
          return prev + next['marketval']}, 0)/10000)
      }
      if(ret["name"]=='预赎回'){
          ret["多策略FOF直投"]=holds.filter((row)=>row['stage']=="预赎回").reduce(function (prev, next) {
          return prev + next['act_amount']}, 0)
      }
      
      rets.push(ret)
      }
      rets[0]["SY9620"]=this.getCash("SY9620")
      for (let key of fofs){
                rets[0][key]=this.actionData.reduce((prev,row)=> {
              if(row["code"]=="SY9620"&&row["stage"]=="待投资"&&row["b_code"]==key){
                prev=prev+parseFloat(row['marketval'])
              }
              return prev
      },0)

      }
      this.compData1=rets
      this.genNoUsed1()
    },
    genTitleData2(){
           const cols=["预入款","预赎回","现金","在投","待分配合计"]
      const keys=["income","redeem","cash","marketval","unused"]
      const fofs=["SSN818","SSN369","STE599"] //["SY9620"]
      let rets=[]
      for(var col in cols){
        var ret={"name":cols[col]}
        for (var af of fofs ){
          var doact=this.detailData.filter((row)=>row['b_code']&&row['b_code']==af&&row['code']=='SSS105')
          if(doact&&doact.length>0){
            if(doact[0]['stage']==ret["name"]){
              console.log(doact)
                ret[af]=doact[0]["act_amount"]
            }else if(ret["name"]=="在投"){
                ret[af]=Math.round(doact[0]["marketval"]/10000)
            } else{
              ret[af]=0
            }                      
          }else{
              ret[af]=0
            }
          if(col==2){
              ret[af]='-'
            }   
      }
      let holds=this.detailData.filter((row)=>(row['code']=='SSS105'))
        if(ret["name"]=='在投'){
          ret["SSS105"]=Math.round(holds.reduce(function (prev, next) {
          return prev + next['marketval']}, 0)/10000)
      }
      rets.push(ret)
      }
      rets[0]["SSS105"]=this.getCash("SSS105")
      for (let key of fofs){
                rets[0][key]=this.actionData.reduce((prev,row)=> {
              if(row["code"]=="SSS105"&&row["stage"]=="待投资"&&row["b_code"]==key){
                prev=prev+parseFloat(row['marketval'])
              }
              return prev
      },0)}
      this.compData2=rets
      this.genNoUsed2()
    },
    genTitleData3(){
      const cols=["预入款","预赎回","现金","在投","预投","待分配合计","总管理规模","核对"]
      const keys=["income","redeem","cash","marketval","buy","unused","managed","check"]
      const fofs=["SSN818","SSN369","STE599"]
      let rets=[]
      for(var col in cols){
        var ret={"name":cols[col]}
        for (let af of fofs ){
        ret[af]=Math.floor(this.finalData.filter((row)=>row['code']==af)[0][keys[col]]/10000)
      }
      
      rets.push(ret)
      }
      for (let af of fofs ){
        let afin=this.finalData.filter(a=>a['code']==af)[0]
        rets[6][af]=Math.floor((afin['marketval']+afin['cash']+afin['process'])/10000)   //总管理规模=基金在投+现金+ETF
        rets[3][af]=rets[6][af]-rets[2][af]    //在投=总管理规模-现金
        rets[7][af]=Math.floor((rets[3][af]+rets[2][af]-this.compData2[3][af]-this.compData1[3][af])) //check市值差
      }
      this.compData3=rets
      this.genNoUsed3()
    },
    changeFOF(val){
          console.log(this.showFundName(val))
      this.curAction.name=this.showFundName(val)
    },
    changeStage(val){
      if(val=='预入款'){
        this.prodDisabled=true
        this.curAction.b_code='CASH'
      }else{
        this.prodDisabled=false

      }
    },
    changeTarget(val){
      console.log(this.showFundName(val))
      this.curAction.b_name=this.showFundName(val)
    },
    showMoney(money) {
      // if (money > 20000) {
        return Math.round(money / 10000);
      // }
      // return money;
    },
    findAction(code,b_code){
      for(let row of this.actionData){
        if(row['code']==code && row['b_code']==b_code)
        {
          return row
        }
      }
      return null
    },
    saveAction(){
      this.calcFinal();
          this.$axios({
      method: 'post',
      url: "/sys/misc", // 请求地址
      data: {"code":"fof_action","info":JSON.stringify(this.actionData),"user":this.token}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then((response)=>console.log(response.data))
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curAction.stage == "预入款") {
            this.curAction["b_code"] = "CASH";
            this.curAction["b_name"] = "现金";
            if(this.curAction["code"]=="SY9620"||this.curAction["code"]=="SSS105"){
              this.updateCash(this.curAction["code"],{"value":this.curAction["marketval"]})
              this.saveAction()
            }else{
               this.$message({
            showClose: true,
            message: "只有多策略和进取预入资金",
            type: "error"
          })
                        return false;

            }
          }
          // if (this.curAction.id) {
          //   for (let i in this.actionData) {
          //     if (this.actionData[i]["id"] == curAction.id) {
          //       this.actionData[i] = JSON.parse(JSON.stringify(this.curAction));
          //       return;
          //     }
          //   }
          // } else {
          this.curAction.add_time=new Date().getTime()
          this.actionData.push(JSON.parse(JSON.stringify(this.curAction)));
          // }
          this.actionDiagShow = !this.actionDiagShow;
          this.saveAction()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    },
    addAction() {
      this.prodDisabled=false
      this.actionDiagShow = !this.actionDiagShow;
      this.curAction = {};
    },
    fundAction(row) {
      this.prodDisabled=false
      this.actionDiagShow = !this.actionDiagShow;
      this.curAction = JSON.parse(JSON.stringify(row));
      this.curAction.stage="预赎回"
      this.curAction.marketval=this.showMoney(this.curAction.marketval)
      console.log(this.curAction);
    },
    getRowKeys(row) {
      return row.code + row.stage + row.b_code;
    },
    calcFinal() {
      let rdict = {};
      this.detailData = [];
      for (var row of this.tableData) {
        row['act_amount']=''
        let pdict = rdict[row["code"]];
        if (!pdict) {
          pdict = {
            code: row["code"],
            name: this.showFundName(row.code),
            marketval: 0,
            buy: 0,
            income: 0,
            redeem: 0,
            cash: 0,
            debet:0,
            process:0,
            unused:0,
            children: [],
          };
          rdict[row["code"]] = pdict;
        }
        if ((row["b_code"].startsWith("SUBJECT10")&&row["b_code"]!='SUBJECT1021')||row["b_code"]=='SUBJECT3003') {
          pdict["cash"] += row["marketval"];
        } else if (row["b_code"].startsWith("SUBJECT11")) {
          pdict["marketval"] += row["marketval"];
        }else if (row["b_code"].startsWith("SUBJECT3")||row["b_code"]=='SUBJECT1021') {//ETF资产和备付金 清算款计入其它资产
          pdict["process"] += row["marketval"];
        }
        else if (row["b_code"].startsWith("SUBJECT22")) {
          pdict["debet"] += row["marketval"];
        } else if (row["b_code"].length == 6) {
          row["name"] = this.showFundName(row.code);
          row["stage"] = "已投";
          let acts=this.actionData.filter(a=>a['code']==row['code']&&a['b_code']==row['b_code'])
          if(acts.length>0){
            row['act_amount']=0
          for (let act of acts){
            row['stage']=act['stage']
            row['act_amount']=row['act_amount']+parseFloat(act['marketval'])
          } }
          this.detailData.push(row);
          // row['name']=row['b_name']
          // pdict.children.push(row)
        }
         this.detailData.map(r=>{
           for(let k of this.types){
             if(r['mstatus']){
               break
             }
             if(r[k]){
               let sps=r[k].split('-')
               r[k+"_r"]=sps[0]
               this.rlen[k]=sps[1]
               r['mstatus']=sps[0]/sps[1]>0.5?"减退":""
             }
           }
         })
      }
      for (var row of this.actionData) {
        let pdict = rdict[row["code"]];
        if (!pdict) {
          pdict = {
            code: row["code"],
            name: this.showFundName(row.code),
            marketval: 0,
            buy: 0,
            income: 0,
            redeem: 0,
            managed:0,
            check:0,
            cash: 0,
          };
          rdict[row["code"]] = pdict;
        }
        if (row["stage"] == "预赎回") {
          pdict["redeem"] += row["marketval"] * 10000;
        } else if (row["stage"] == "待投资") {
          pdict["buy"] += row["marketval"] * 10000;
        } else if (row["stage"] == "预入款") {
          pdict["income"] += row["marketval"] * 10000;
        }
      }
      this.finalData = [];
      for (var key in rdict) {
        this.finalData.push(rdict[key]);
      }
      this.genTitleData1()
      this.genTitleData2()
      this.genTitleData3()

    },
    showholding(row) {
      if (row["b_code"].startsWith("SUBJECT110")) {
        return "持仓基金市值";
      }
      return row["b_name"];
    },
    getMisc(code){
      this.$axios
        .get("/sys/misc", { params: { "code": code } }) //axis后面的.get可以省略；
        .then((response) => {
          this.actionData =response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showRank(row,key){
      if(row[key]){
        return row[key].split("-")[0]
      }
      return ''

    },
    getProducts() {
      this.$axios
        .get("/fof/holding", { params: { code: "",extra:"1yr" } }) //axis后面的.get可以省略；
        .then((response) => {
          this.tableData = this.$tools
            .pandasToJson(response.data)
            .filter((item) => !item.b_code.startsWith("SUBJECT2")).map(row=>{row["b_name"]=row['b_name'].replace(/(指数增强|证券|私募).+基金/,"")
            return row});
          this.calcFinal();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
  created() {
    this.getMisc("fof_action")
    this.types.map(t=>{this.rlen[t]=0})

  },
};
</script>
<style lang="scss" >
.background-yellow {
            background-color: yellow;
            color: red

}
.vxe-body--column.col--ellipsis .vxe-body--column {
  height:32px;
}
tr td {
  vertical-align: middle
}
//  .reverse-table .vxe-body--row .vxe-body--column:first-child {
//           background-color: #222279;
//         }
</style>