<template> 
<div>

  <el-row>
    <el-col :span="24">
      <el-button  @click="doSimulate">开始模拟</el-button>
          <el-date-picker
      v-model="startdate"
      value-format="yyyyMMdd"
      format="yyyyMMdd"
      align="right"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
          <el-button  @click="addRangeDate">+调仓日</el-button>

          <el-button  @click="doRefresh">刷新产品</el-button>

      <el-button  @click="saveSimulate">保存模拟</el-button>
    </el-col>
  </el-row>
   <el-row>
    <el-col  :key="item" v-for="(item,i) in cols" :span="3">
      {{item}}:<el-input   style="width:80px"   size="mini" v-model="wts[i]" :placeholder="item" clearable  ></el-input>
    </el-col>
   </el-row>
         <el-collapse :value="collapseItem" >
  <el-collapse-item title="配置产品" name="prodcollapse">
      <el-row class="home" :gutter="1">

    <el-col :span="4" v-for="(data,rg) in tableData" :key="rg">
       <span>{{rg}}                       <el-button  @click.native.prevent="deleteRange(rg)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button></span>
 <!--   <el-card shadow="hover" >
         <span>{{rg}}</span> -->
<el-table
      :ref="'table'+rg"
      id="out-table"
      :data="tableData[rg]"
      :row-key="(row)=>{ return row.fundname}"
      tooltip-effect="dark"
      max-height="400"
      style="width: 100%; margin-top: 20px"
    >      <el-table-column
      type="selection"
      :reserve-selection="true"
      width="42">
    </el-table-column>
 <!-- <el-table-column
      type="index"
      :index="indexMethod"></el-table-column> -->
            <!--<el-table-column
        prop="score"
        min-width="70"
        sortable
        label="score"
        show-overflow-tooltip
      ></el-table-column> --> 
      <el-table-column
        prop="name"
        min-width="120"
        sortable
        label="基金名称"
        show-overflow-tooltip
      ></el-table-column>
</el-table>
      <!-- </el-card> -->
    </el-col>
      </el-row>
        </el-collapse-item>
   </el-collapse>
      <el-row v-if="showchart">
            <el-col :span="24" height="600">
                   <fund-echart    ref="vchart"  titles="虚拟FOF"  style="height: 600px" code="V_Temp" :visable="showchart" ></fund-echart>
            </el-col>
      </el-row>
</div>
</template>



// <script>
// import Echart from "../../components/Echart.vue";
import DB from '@/store/localapi.js';
import Vue from 'vue'
import { mapState } from 'vuex'
import FundEchart from "@/components/FundEchart.vue";
export default {
  components: {
            FundEchart
        },
     props: {
     code:{
      type: String,
      default: ""
    },
     title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '80%'
    },

  },
  watch: {
    code:{
    handler: function(val) {
                this.getTable()
              }
    },
    // wts:{
    // handler: function(val) {
    //             console.log(val)
    //             this.forceUpdate()
    //           }
    // }, 
    range:{
    handler: function(val) {
                this.getTable()
              }
    },
  },
      data() {
              return {
      startdate:"",
      wts: [],
      limit_dic:{'sharpe': 3, 'calmar': 5, 'sortino': 5, 'yeaily_return': 0.7},
      buy_amts:null,
      collapseItem:"prodcollapse",
      showchart:false,
      tableData:[]}
      },
        computed: mapState([
  'syswts','cols'
]),
      methods: {
        doRefresh(){
          let rgs=Object.keys(this.tableData)
          this.getTable(rgs)
        },
        addRangeDate(){
          if(this.startdate){
            let rgs=Object.keys(this.tableData)
            rgs.push(this.startdate)
            rgs.sort()
            this.getTable(rgs)
          }
        },
        deleteRange(rg){
          if(this.tableData[rg]){
            console.log(rg)
            delete this.tableData[rg]
          }
          Vue.set(this,"tableData",this.tableData)
          this.$forceUpdate()
          //  this.$nextTick(() => { 
          //         console.log(this.tableData)})
          
        },
               indexMethod(index) {
        return index +1
      },
      doSimulate(){

        var ret={}
        for (var rg in this.tableData){
          var codes=""
          //           console.log( this.$refs['table'+rg][0])
          // console.log( this.$refs['table'+rg][0].selection)
          var seled=this.$refs['table'+rg][0].selection
              for (var  row of seled){
                codes=codes+row['fundname']+","
              }
          ret[rg]=codes
        }
        this.showchart=false
        if(this.$isElectron){
          // DB.calc_simval(ret,this.wts)
          this.buy_amts=DB.calc_simval(ret)
          this.collapseItem=""
          this.showchart=true
        }
        else{
        this.$axios({
        url: "/fof/calcsimu",
        data:{"name":"temp","splits":ret}, //          
        method: "POST"
      }).then((response) => {
                this.collapseItem=""
                this.buy_amts=response.data.date
        this.showchart=true
        });
        }
      },
      saveSimulate(){
        var that=this
         this.$prompt('保存名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '名称格式不正确'
        }).then(({ value }) => {
        console.log(this.buy_amts)
        if(this.$isElectron){
          DB.save_fund_info(value,this.buy_amts)
        }
        else{
        this.$axios({
        url: "/fof/savesimu",
        data:{"name":value,"buy_info":JSON.stringify(that.buy_amts)}, //          
        method: "POST"
      }).then((response) => {
            this.$message({
            type: 'success',
            message: '保存名称: ' + value
          });
        });}

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      getDateArray(){
      var nday=this.$moment().format("YYYYMMDD");
      var emon=0
      if(this.$moment().month()>6){
        emon=6
      }
      
      var sdate=this.$moment().month(emon).date(1)
      let rst=[sdate.format("YYYYMMDD")]
      for (var i=1;i<6;i++){
        rst.push(sdate.add(-6, "M").format("YYYYMMDD"))
      }
      return rst.sort()
      },
          getTable(rgs=null){
            console.log("rpc call started")
            if(this.code&&this.code.length>10){
              
             var $this=this
             if(this.$isElectron){

               //let ret=DB.getSocres(this.code,['20000101','20210101'])

              let dts=[]
              if(rgs){
                dts=rgs
              }else{
                dts=this.getDateArray()
              }
               this.tableData={}
              for (var day of dts){
                const rg=[this.$moment(day).add(-2,'y').format("YYYYMMDD"),day]
                let scores=DB.getSocres(this.code,rg)
                DB.do_calc(scores,this.cols,this.limit_dic,this.wts)
                this.tableData[day]=scores.sort((a,b)=>{return b['score']-a['score']})
              }
             }else{

                let param={code:this.code,wts:this.wts.join(",")}
                if(rgs){
                  param['range']=rgs.join(",")
                }
                this.$axios.get('/fof/fundsimu',{params:param})//axis后面的.get可以省略；
            .then(
                (response) => {
                    console.log(response.data)
                    $this.tableData=response.data

                    for(var a in $this.tableData){
                    console.log(a)
                    DB.do_calc($this.tableData[a],this.cols,this.limit_dic,this.wts)
                    $this.tableData[a].sort((x,y)=>{return y["score"]-x["score"]})
                    }
                    // this.calc_score(1)
                    // this.calc_score(2)

                })
            .catch(
                (error) => {
                    console.log(error);
        });}}
        // console.log(this.tableData)
                    this.$forceUpdate()
          }
      },
      mounted(){
        //   this.getRankGap()
      },
        created(){
          this.wts=this.syswts
          this.getTable()

  },
}

</script>