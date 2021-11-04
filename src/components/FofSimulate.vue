<template> 
<div>

  <el-row>
    <el-col :span="24">
      <el-button  @click="doSimulate">开始模拟</el-button>
      <el-button  @click="saveSimulate">保存模拟</el-button>
    </el-col>
  </el-row>
         <el-collapse :value="collapseItem" >
  <el-collapse-item title="配置产品" name="prodcollapse">
      <el-row class="home" :gutter="1">

    <el-col :span="4" v-for="(data,rg) in tableData" :key="rg">
       <span>{{rg}}</span>
 <!--   <el-card shadow="hover" >
         <span>{{rg}}</span> -->
<el-table
      :ref="'table'+rg"
      id="out-table"
      :data="tableData[rg]"
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
      buy_amts:null,
      collapseItem:"prodcollapse",
      showchart:false,
      tableData:[]}
      },
      methods: {
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
          DB.calc_simval(ret)
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
        this.$axios({
        url: "/fof/savesimu",
        data:{"name":value,"buy_info":JSON.stringify(that.buy_amts)}, //          
        method: "POST"
      }).then((response) => {
            this.$message({
            type: 'success',
            message: '保存名称: ' + value
          });
        });

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
          getTable(){
            console.log("rpc call started")
            if(this.code&&this.code.length>10){
              
             var $this=this
             if(this.$isElectron){

               //let ret=DB.getSocres(this.code,['20000101','20210101'])
              let dts=this.getDateArray()
               this.tableData={}
              for (var day of dts){
                const rg=[this.$moment(day).add(-2,'y').format("YYYYMMDD"),day]
                console.log(rg)
                  this.tableData[day]=DB.getSocres(this.code,rg)
              }
                console.log(dts)
             }else{


                this.$axios.get('/fof/fundsimu',{params:{code:this.code}})//axis后面的.get可以省略；
            .then(
                (response) => {
                    console.log(response.data)
                    $this.tableData=response.data
                    // this.calc_score(1)
                    // this.calc_score(2)

                })
            .catch(
                (error) => {
                    console.log(error);
        });}}
          }
      },
      mounted(){
        //   this.getRankGap()
      },
        created(){
          this.getTable()

  },
}

</script>