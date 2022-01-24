<template>
  <div id="tableContainer" style="	height : 100%;">
  <div class="demo-input-suffix">
             <el-row>
                              <el-col :span="4">
 <el-form ref="form" >
          <el-row>    
            <el-row>
              <el-select
@change="changePlan" 
    v-model="pcode"
    style="width:180px;"   
    popper-class="pop-div-my"
    :popper-append-to-body="true"
    clearable
    filterable
    placeholder="名称"
    >
    <el-option
      v-for="item in fofplans"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
  </el-row>                 
  <el-form-item label="现金余额" ><el-input style="width: 180px" v-model="cash0" ><i
    class="el-icon-edit el-input__icon"
    slot="suffix"
    @click="changeMoney">
  </i></el-input> 万</el-form-item>

  </el-row>
  <el-row>  <el-radio-group v-model="direction" size="medium">
      <el-radio-button label="买" ></el-radio-button>
      <el-radio-button label="卖"></el-radio-button>
    </el-radio-group>
  </el-row>
  <el-row>
              <el-col :span="24">
  <el-select v-model="filter.class_type" @change="changeSub"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
<el-select
@change="changeFund" 
    v-model="code"
    style="width:180px;"   
    popper-class="pop-div-my"
    :popper-append-to-body="true"
    clearable
    filterable
    placeholder="名称"
    >
    <el-option
      v-for="item in fofoptions"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
              </el-col>
  </el-row>


    <el-row>
                         <el-form-item label="净值日期"> <el-input style="width: 180px"  v-model="latest_date"  readonly></el-input></el-form-item>
       </el-row>
     <el-row>                     
         <el-form-item label="最新净值" ><el-input label="购买金额" style="width: 180px" v-model="latest_val"  readonly></el-input> </el-form-item>

  </el-row>
       <el-row>                     
         <el-form-item label="最新市值" ><el-input  style="width: 180px" v-model="total_val"  readonly></el-input> </el-form-item>

  </el-row>
       <el-row>
           <el-form-item label="交易金额(万)">
(输入0 卖出买入所有)
           </el-form-item>
  </el-row>
     <el-row>

             <el-input   style="width: 120px" type="number" v-model="buy_amt"  ></el-input> <el-button  size="small" type="primary" @click="tradeAmt">✔</el-button>

         </el-row>
                <el-row v-if="!hname">
                    <el-button  size="small" type="primary" @click="savePlan">保存方案</el-button>
                </el-row>

  </el-form>
            </el-col>
            <el-col :span="6">
   <el-table
      ref="holdingTable"
      id="holdingTable"
      :data="holdoingList"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
    >         <el-table-column
        prop="name"
        min-width="120"
        sortable
        label="基金名称"
        show-overflow-tooltip
      ></el-table-column>  
       <el-table-column
        prop="total_val"
        width="80"
        sortable
        label="市值"
        show-overflow-tooltip
      ></el-table-column>  
    </el-table>
    <span>待交易</span>
     <el-table
      ref="orderTable"
      id="orderTable"
      :data="orders"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
    >         <el-table-column
        prop="tname"
        min-width="100"
        sortable
        label="名称"
        show-overflow-tooltip
      ></el-table-column>  
      <el-table-column
        prop="date"
        width="90"
        sortable
        label=""
        show-overflow-tooltip
      ></el-table-column>  
             <el-table-column
        prop="direction"
        width="40"
        sortable
        label=""
        show-overflow-tooltip
      ></el-table-column>  
       <el-table-column
        prop="amount"
        width="80"
        sortable
        label="金额"
        show-overflow-tooltip
      ></el-table-column>  
      <el-table-column
        prop="direction"
        width="40"
        sortable
        label=""
        show-overflow-tooltip
      ><template slot-scope="scope">
                  <el-button  @click.native.prevent="delOrder(scope)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

        </template>
    </el-table-column>

    </el-table>
    </el-col>
              <el-col :span="14">
    <fund-echart       ref="hischart"  :titles="'行情信息'"  style="height: 480px" :code="code"   ></fund-echart>


              </el-col>
  </el-row>
  <!-- <el-row>{{plan}}</el-row> -->
  </div>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import DB from '@/store/localapi.js'
import {mapGetters} from 'vuex'
    import FundEchart from '../../components/FundEchart.vue';

// import the styles
export default {
  components: {
FundEchart
  },
  computed: {
    holdoingList(){
      var date= new Date();
      let today = this.$tools.getToday()

      let list=[{"code":"cash","name":"现金","total_val":this.get10th(this.holding["cash"])}]
      for (var key in this.holding){
        if(key !="cash"){
          let info =this.getRowByCode(key)
          let amt={}
          amt[key]=this.holding[key]
          list.push({"code":key,"name":info["name"],"total_val":this.get10th(DB.sell_fund(today,amt))})
        }

      }
      return list
    },
      total_val(){
          let ret=0
          if(this.holding[this.code]){
              ret= this.latest_val*this.holding[this.code]/10000
          }else{
              if(!this.code){
      var date= new Date();
      let today = this.$tools.getToday()
                   ret= DB.sell_fund(today,this.holding)}
          }
          return this.get10th(ret)
      },
      cash0(){
            return this.holding.cash/10000
        },
     ...mapGetters(['sysparam']),
    compares: {
      get() {
        return this.comb1 + "," + this.comb2;
      },
    },
  },
  props: {
    filters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      direction:"买",
      orders:[],
      plan:{},
      hname:"",
      current:{},
      holding:{cash:10000000},
      foflist:[],
      fofplans:[],
      code:"",
      pcode:"",
      fund_name:"",
      buy_amt:0,
      latest_val:0,
      latest_date:"",
      filter:{},
      fofoptions:[],
      normalizer: (node) => {
        return {
          id: node.code,
          label: node.name,
        };
      },
    };
  },

   watch: {
    direction:{
    handler: function(val) {
            console.log(val)
                let opts=[]
                let hlds=Object.keys(this.holding)
                if(val=="卖"){
                   for (var row of this.alllist){
                       if(hlds.indexOf(row['code'])>-1){
                           opts.push(row)
                       }
                   }
                   this.fofoptions=opts     
                }else{
                    this.fofoptions=this.alllist
                }
                
              }
    },
  },
  created() {
      this.getAllFund()
    //this.remoteMethod();
  },
  methods: {
      delOrder(row){
         this.orders.splice(row["$index"],1)
      },
      getRowByCode(code){
        for (var row of this.alllist){
          if(row["code"]==code)
          return row
        }
      },
      saveOrder(){
        for (var ord of this.orders){
          ord['pcode']=this.pcode
        }
        DB.prepare("delete from  fund_order  where status='0' and pcode=?").run(this.pcode);
      const insert = DB.prepare('insert into fund_order(pcode ,date ,tcode ,tname  ,amount,direction ,status ) VALUES (@pcode ,@date,@tcode,@tname ,@amount ,@direction  ,@status)');
        const insertMany = DB.transaction((data) => {
          for (const row of data) {
              insert.run(row);
          }
        })
      console.log(this.orders)
        insertMany(this.orders)
      },
      savePlan(){
          if(this.pcode)
          {
            // usql="update fund_info set remark=? where code=?"
            // DB.prepare(usql).run([JSON.stringify(plan),this.current['code']])
          this.saveOrder()
          }
          else{

            this.$prompt('保存名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '名称格式不正确'
        }).then(({ value }) => {
            let today = this.$tools.getToday()
            let cashs=this.holding.cash
            for (var ord of this.orders){
              cashs=cashs+ord['amount']*10000
            }
            var ret={}
            ret[today]={'cash':cashs}
            let vname=DB.save_fund_info(value,ret)
            this.getAllFund()
            this.pcode=vname
            this.saveOrder()
        })
          }
      },
      changeMoney(){
         this.$prompt('修改初始资金(万)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
         inputPattern: /[0-9]+/,
          inputErrorMessage: '数字格式不正确'
        }).then(({ value }) => {
            this.holding.cash=10000*value
        })
      },
      get10th(val){
        return (val/10000).toFixed(0)
      },
      tradeAmt(){
      let today = this.$tools.getToday()
                let hold=this.holding[this.code]
          if(!hold){
              hold=0
          }
          let ord={}
          ord["direction"]=this.direction
          ord["amount"]=this.buy_amt
          ord["date"]=today
          ord["tcode"]=this.code
          ord["tname"]=this.getRowByCode(this.code)["name"]
          ord["status"]="0"
          this.orders.push(ord)
          if(this.direction=="卖"){
          if(this.buy_amt==0||this.buy_amt>this.total_val){
            this.holding.cash=this.holding.cash+this.total_val*10000
          }else{
            hold=hold-this.buy_amt*10000 / this.latest_val
            this.holding.cash=this.holding.cash+this.buy_amt*10000

          }}else{
                if(this.buy_amt==0||this.buy_amt*10000>this.cash){
                this.holding.cash=0
                hold=hold+this.cash / this.latest_val

          }else{
                    this.holding.cash=this.holding.cash-this.buy_amt*10000
                    hold=hold+this.buy_amt*10000 / this.latest_val
          }
        }
          // if(hold){
          //    this.holding[this.code] =hold
          // }else{
          //   delete this.holding[this.code]
          // }

          this.plan[today]=this.holding
      },
      getHolding(){
        const dts=Object.keys(this.plan).sort()
        var dl=dts.length
        Vue.set(this,"holding",JSON.parse(JSON.stringify(this.plan[dts[dl-1]])))
      
      },
      changeFund(row){
         for (var fd of this.fofoptions){
             if(row==fd.code){
                this.fund_name=fd.name
                this.getLatestVal(row)
                break
             }
         }
      },
      changePlan(code){
        let holding={"cash":10000000}
        this.pcode=code
        if(code){
          for (var fd of this.fofplans){
             if(code==fd.code){
                console.log(fd.remark)
                this.current=fd
                this.plan=JSON.parse(fd.remark)
                this.fund_name=fd.name
                break
             }
         }
        const dts=Object.keys(this.plan).sort()
        var dl=dts.length
         holding=JSON.parse(JSON.stringify(this.plan[dts[dl-1]]))
        if(holding['cash']){
        }else{
          holding['cash']=0
        }}else{
          this.current={}
          this.plan={}
          this.code=""
        }
        this.orders=DB.prepare("select * from fund_order where pcode=? and status='0' ").all(code)
        Vue.set(this,"holding",holding)
      },
      getLatestVal(code){
      var qsql="SELECT date,sumval FROM fund_val where code =? order by date desc limit 1"
                  let  ret = DB.prepare(qsql).get(code);
                  console.log(ret)
                  if(ret){
                      this.latest_val=ret.sumval
                      this.latest_date=ret.date
                  }
      },
      getAllFund(){
            var qsql="SELECT * FROM fund_info where code !='V_Temp'"
            const stmt = DB.prepare(qsql);
            this.alllist = stmt.all();
            this.fofoptions=this.alllist
            let plans=[]
            for (var row of this.alllist){
                if(row['class_type']=="虚拟"&&row['code'].startsWith("V_")){
                    plans.push(row)
                }
            }
            this.fofplans=plans
      },
    changeSub(row){
              console.log(row)
              if(row){
              var a=[]
              for (var ar of this.alllist){
                if(ar.class_type==row)
                a.push(ar)
              }
              console.log(a)
              if(a.length>0)
              this.fofoptions=a
              }

            },
      filterMethod(query){
      if(query){
        this.fofoptions=[]
      let qrys=query.split(" ")

      let result=[]
      let codes=[]
      for (var qry of qrys)
      this.alllist.forEach(val=>{
                      if(val.name.indexOf(qry)!=-1){
                            result.push(val)
                            if(val.name==qry)
                            codes.push(val.code)
                            } 
                        }) 

      }
      // }
      else{
        this.fofoptions=this.alllist 
      }

    },
    }
};
</script>