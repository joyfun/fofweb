<template>
  <div>
    <div class="block" style="display: flex; justify-content: space-between">
      <div style=" width: 1200px;">

        <el-select v-model="comb1" filterable placeholder="名称">
          <el-option
            v-for="item in foflist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
           <el-select v-model="comb2" filterable placeholder="名称">
          <el-option
            v-for="item in foflist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
         目标波动性
        <el-input-number  v-model="expect" :precision="3" :step="0.1" :min="0" :max="10" placeholder="预期波动性"></el-input-number>

        <el-button type="primary" @click="docalc">计算</el-button>

        <table class="ctable" cellspacing="0" cellpadding="0" width="300">
            <tr><td></td><td>收益</td><td>波动率</td></tr>
            <tr><td>历史</td><td>{{$tools.formatMoney(cret,4)}}</td><td>{{$tools.formatMoney(cvola,4)}}</td></tr>
            <tr><td>预期</td><td>{{$tools.formatMoney(eret,4)}}</td><td>{{$tools.formatMoney(evola,4)}}</td></tr>

            <!-- <tr><td class="ctd">相关性</td><td>{{$tools.formatMoney(corr,4)}}</td><td>组合收益</td><td>{{$tools.formatMoney(cret,4)}}</td><td>组合预期收益</td><td>{{$tools.formatMoney(eret,4)}}</td><td>{{goal0}}</td></tr> -->
        </table>
      </div>
    </div>
  <el-row>
              <el-col :span="24">

 <el-table
          :data="compData"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="基金名称" label="名称"> </el-table-column>
          <el-table-column prop="过去3年年均收益" :formatter	="formatterNum"  label="过去3年年均收益" width="100"> </el-table-column>
          <el-table-column prop="波动率" :formatter	="formatterNum" label="波动率" width="80"> </el-table-column>

          <el-table-column prop="vola"  width="180" label="预期波动性"><el-input-number></el-input-number>
          <template slot-scope="scope">
            <el-input-number  v-model="scope.row.vola" @change="docalc" :precision="2" :step="0.1" :min="0" :max="10" placeholder="预期波动性"></el-input-number>
            <span></span>
          </template>
           </el-table-column>
          <el-table-column prop="percent" :formatter	="formatterNum" label="比例" width="80"> </el-table-column>
          <el-table-column prop="epercent" :formatter	="formatterNum" label="预期比例" width="80"> </el-table-column>
          <el-table-column prop="mpercent"  width="180" label="调整比例"><el-input-number></el-input-number>
          <template slot-scope="scope">
            <el-input-number  v-model="scope.row.mpercent" @change="changePercent" :precision="2" :step="0.1" :min="0" :max="10" placeholder="调整比例"></el-input-number>
            <span></span>
          </template>
           </el-table-column>
          <el-table-column prop="预期收益率" width="180"  label="预期收益率">
          <template slot-scope="scope">
              <el-input-number  v-model="scope.row.eret" @change="docalc" :precision="2" :step="0.1" :min="0" :max="10" placeholder="预期收益率"></el-input-number>
            <span></span>
          </template>
           </el-table-column>

          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->

        </el-table>
              </el-col>
  </el-row>
        <!-- <el-button  size="small" @click="downFile()">下载</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button> -->


    <fund-echart
      ref="hischart"
      :titles="current.name"
      style="height: 600px"
      :combine="combine"
      :code="compares"
      :compares="compares"
      :visable="dialogVisible"
    ></fund-echart>
  </div>
</template>
<script>
import axis from "axios";
import FundEchart from "../../components/FundEchart.vue"
import HisTable from "../../components/HisTable.vue"
import Vue from 'vue'

// import the styles
export default {
  components: {
    FundEchart,
    HisTable,
  },
  computed: {
    compares: {
      get() {
        //   console.log(this.filter.class_type)
        //   console.log(this.addition)
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
      temp: -1,
      comb1: "",
      comb2: "",
      combine:null,
      corr:0,
      goal0:0,
      expect:0.2,
      cret:0,
      eret:0,
      cvola:0,
      evola:0,
      compData:[],
      dialogVisible: true,
      origin: {},
      current: {},
      foflist: [],
      filter: {
        class_type: "CTA",
        left: "",
        right: "",
      },
      options: [
        {
          value: "预选",
          label: "预选",
        },
        {
          value: "二选",
          label: "二选",
        },
        {
          value: "备投",
          label: "备投",
        },
        {
          value: "已投",
          label: "已投",
        },
      ],
      class_types: [
        {
          value: "CTA",
          label: "CTA",
        },
        {
          value: "指增",
          label: "指增",
        },
        {
          value: "中性",
          label: "中性",
        },
        {
          value: "套利",
          label: "套利",
        },
        {
          value: "混合",
          label: "混合",
        },
      ],
      normalizer: (node) => {
        return {
          id: node.code,
          label: node.name,
        };
      },
    };
  },

  watch: {
    compares:{      handler(n) {
        var len=n.length
        if(len>1&&n.indexOf(",")<len-1){
        this.doload()
        }
    }},
    $route: {
      handler(n) {
        if (this.filters) {
          console.log("route init ");
          console.log(this.filter);
          var jobj = JSON.parse(JSON.stringify(this.filters));
          for (var key in jobj) {
            this.filter[key] = jobj[key];
          }

          //   this.filter=JSON.parse(JSON.stringify(this.filters));
          //   this.filter["class_type"]="CTA"
        } else {
          this.filter = n.params;
        }
        // 初始化操作
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.remoteMethod();
  },
  methods: {
    dochange(row){
      //calcvola(row[""],v1,w2,v2,corr)

    },
    formatterNum(row, column, value) {
      if (!value) return "0";
      return this.$tools.formatMoney(value,4)
    },
    calc_amount(fund1,fund2,param,idx="vola"){
    var max=1
    var a=fund1[idx]**2+fund2[idx]**2-2*param['corr']*fund1[idx]*fund2[idx]
    var maxv=fund1[idx]
    if (fund2[idx]>fund1[idx]){
        maxv=fund2[idx]
        max=2
    }
    var b=2*param['corr']*fund1[idx]*fund2[idx]-2*(maxv**2)
    var c=maxv**2-param['goal']**2
    var d=b**2-4*a*c
    var result=(-b-Math.sqrt(d))/(2*a)
    if(max==2){
        result=1-result
    }
    if(idx=="vola"){
    fund1["epercent"]=1-result
    fund2["epercent"]=result
    }else{
    fund1["percent"]=1-result
    fund2["percent"]=result
    }
    console.log(fund1)
    console.log(fund2)
    },
      calcvola(w1,v1,w2,v2,corr){
          var ret= Math.sqrt(w1**2*v1**2+w2**2*v2**2+2*corr*w1*v1*w2*v2)
          return ret
      },
      docalc(){

          var ret=[]
          for (var i in this.compData){
              var row=this.compData[i]
              if(row["vola"])
              ret.push({"name":row["基金名称"],"code":row["code"].replace("_extra",""),"vola":row["vola"],"波动率":row["波动率"]})
          }
          if(ret.length==2){
              var param={"corr":this.corr,"goal":this.expect}
               var fund1=ret[0],fund2=ret[1]
     
        this.calc_amount(fund1,fund2,param,"波动率")

        this.calc_amount(fund1,fund2,param,"vola")
           
            for(var i in this.compData){
                var row=this.compData[i]
                if(row.code==fund1.code)
                {
                    Vue.set(this.compData[i], 'epercent', fund1.epercent)
                    if(this.compData[i]['mpercent']){}
                    else{
                    Vue.set(this.compData[i], 'mpercent', fund1.epercent)

                    }
                    Vue.set(this.compData[i], 'percent', fund1.percent)

                    this.cret+=row['过去3年年均收益']*fund1.percent
                    this.eret+=row['eret']*fund1.epercent

                }
                if(row.code==fund2.code)
                {
                    Vue.set(this.compData[i], 'epercent', fund2.epercent)
                    if(this.compData[i]['mpercent']){}
                    else{
                    Vue.set(this.compData[i], 'mpercent', fund2.epercent)  
                    }
                    Vue.set(this.compData[i], 'percent', fund2.percent)
                  

                }
            }
            this.changePercent()
            this.goal0=this.calcvola(fund1["percent"],fund1["波动率"],fund2["percent"],fund2["波动率"],this.corr)
          }

      },
      changePercent(){
           this.cret=0
            this.eret=0
          var ret={}
          var funds=[]
          for(var i in this.compData){
              
                var row=this.compData[i]
                if(row['code'].endsWith("_extra")){
                    continue
                }
                console.log(row)
            ret[row["基金名称"]]=row["mpercent"]
             this.cret+=row['过去3年年均收益']*row["mpercent"]
             this.eret+=row['eret']*row["mpercent"]
             funds.push(row)
          }
          this.cvola=this.calcvola(funds[0]["mpercent"],funds[0]["波动率"],funds[1]["mpercent"],funds[1]["波动率"],this.corr)
          this.evola=this.calcvola(funds[0]["mpercent"],funds[0]["vola"],funds[1]["mpercent"],funds[1]["vola"],this.corr)

            Vue.set(this,"combine",{"组合":ret})
      },
    doload() {
       this.$axios({
        url: "/fof/corr", //          
        method: "GET",
        params: { code: this.compares },
      }).then((response) => {
            var corrdata=response.data.corrs
            for(var key in corrdata){
                for (var skey in corrdata[key]){
                    if(skey!=key){
                        this.corr=corrdata[key][skey]
                        return 
                    }
                }
            }
        }); 
      this.$axios({
        url: "/fof/jreport", //          

        method: "GET",
        params: { code: this.compares },
      }).then((response) => {
            this.compData = this.$tools.pandasToJson(response.data);
            console.log(this.compData)
        });
    },
    remoteMethod(query) {
      this.$axios({
        url: "/fof/foflist",
        method: "GET",
        params: {},
      }).then((response) => {
        this.foflist = response.data;
      });
    },
    getList() {
      console.log(this.filter);
    },
  },
};
</script>
<style scoped>
.ctable{
  position:relative;
  border:1px solid #000;
  overflow-X:scroll;
}
td{
    border:solid #000;
    width:120px;
     border-width:0px 1px 1px 0px;
}

</style>