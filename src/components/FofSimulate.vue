<template> 
<div>
  <el-row>
    <el-col :span="24">
      <el-button  @click="doSimulate">开始模拟</el-button>
      <el-button  @click="saveSimulate">保存模拟</el-button>
    </el-col>
  </el-row>
      <el-row class="home" :gutter="20">

    <el-col :span="4" v-for="(data,rg) in tableData" :key="rg">
    <el-card shadow="hover" >
        <span>{{rg}}</span>
<el-table
      :ref="'table'+rg"
      id="out-table"
      :data="tableData[rg]"
      tooltip-effect="dark"
      max-height="480"
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
      </el-card>
    </el-col>
      </el-row>
</div>
</template>



// <script>
// import Echart from "../../components/Echart.vue";
// import FundEchart from "../../components/FundEchart.vue";
export default {
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
                    console.log( this.$refs['table'+rg][0])
          console.log( this.$refs['table'+rg].selection)
              for (var  row in this.$refs['table'+rg].selection){
                codes=codes+row['fundname']+","
              }
          ret[rg]=codes
        }
        console.log(ret)
      },
      saveSimulate(){},
          getRankGap(){
            console.log("rpc call started")
             var $this=this
                this.$axios.get('/fof/fundsimu',{params:{code:'SNU962,SNY147,SNU704,SQF364,SY0256,SGX062,SQT501,SCF687,SJF673,SGU727,SW6575,SGK735,SEX689,SGQ114,SX9421,SLK390,SLN238,SGQ885,S60039,SGU158,NB2007,SEQ819,SLW659,SGM019,ST8876,SGU492,SLR925,SJU767,SQC452,SQE179,SNJ749,SER942,SW5349'}})//axis后面的.get可以省略；
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
        });
          }
      },
      mounted(){
        //   this.getRankGap()
      },
        created(){
          this.getRankGap()

  },
}

</script>