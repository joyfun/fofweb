<template>
  <div ref="tableContainer" style="	height : 100%;">
   <el-row>
  <!-- <el-col :span="8">
    <el-card>
      <vxe-table
          :data="indexdata.daily">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="code" title="指数代码"></vxe-column>
          <vxe-column field="date" title="最近日期"></vxe-column>
        </vxe-table>
        <vxe-table
          :data="indexdata.weekly">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="code" title="指数代码"></vxe-column>
          <vxe-column field="date" title="最近周度日期"></vxe-column>
        </vxe-table>
    </el-card>
  </el-col> -->
  <el-col :span="24">
    <el-card>
      <vxe-table
          :data="summaryData">
           <vxe-column field="type" width="80" title="类型"></vxe-column>
          <vxe-column  field="source"    title="来源" width="90">                     <template #default="{ row }">
                             {{getSouce(row['source'])
                             }}
            </template></vxe-column>
          <vxe-column field="cnt"  width="60" title="总个数" align="right"></vxe-column>
          <!-- <vxe-column :key="col" v-for=" col in header_cols" :field="col" :title="col"></vxe-column> -->
          <vxe-column field="ncnt" width="120" title="本期"  align="right">
            <template #default="{ row }">
              <span v-if="row.type=='基金净值'">
                            <a href="#" @click="searchProd(row.source,row.ndate,row.type)" >{{row.ncnt}}</a>
   

            <el-button  @click.native.prevent="searchProd(row.source,row.ndate,row.type,'not')" type="text" size="small"><el-tooltip class="item" effect="dark" content="缺失" placement="left-start"><i class="el-icon-s-unfold"></i></el-tooltip></el-button>
              </span>
              <span v-else>
                {{row.ncnt}}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="pcnt" width="120" title="上期"  align="right">
            <template #default="{ row }">
              <span v-if="row.type=='基金净值'">
                            <a href="#" @click="searchProd(row.source,row.pdate,row.type)" >{{row.pcnt}}</a>
   

            <el-button  @click.native.prevent="searchProd(row.source,row.pdate,row.type,'not')" type="text" size="small"><el-tooltip class="item" effect="dark" content="缺失" placement="left-start"><i class="el-icon-s-unfold"></i></el-tooltip></el-button>
              </span>
              <span v-else>
                {{row.pcnt}}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="target" title="目标"  align="right">   <template #default="{ row }">
                             {{getTarget(row['source'])
                             }}
            </template></vxe-column>
          <vxe-column field="remark" title="说明">
             <template #default="{ row }">
                             {{getRemark(row['source'])
                             }}
            </template>
          </vxe-column>

        </vxe-table>
    </el-card>
  </el-col>
   <!-- <el-col :span="8">
    <el-card> 
  <el-descriptions  :column="1"  border>
          <el-descriptions-item label="最新交易日">{{summaryAll.header['tdate']}}</el-descriptions-item>
          
          <el-descriptions-item  :key="row.source" v-for="row in summaryAll.jq" :label="row.source">{{row.cnt}}</el-descriptions-item>

          <el-descriptions-item label="最新排名日">{{summaryAll.header['ndate']}}</el-descriptions-item>

  </el-descriptions>
      </el-card>
  </el-col> -->
  <!-- <el-col :span="16">
    <el-card>

        <vxe-table
                  show-overflow
                  height="480px"
          :data="alarms">
          <vxe-column field="code" width="80px" title="备案号"></vxe-column>
          <vxe-column field="detail" min-width="100px" title="错误信息"></vxe-column>
          <vxe-column field="update_time" title="更新时间"><template #default="{ row }">
                             {{ row.update_time|formatTime}}
            </template></vxe-column>

        </vxe-table>
    </el-card>
  </el-col> -->
   </el-row>
   <el-row>
        <el-button type="primary" @click="down_realfile('净值波动异常数据.xlsx')">下载净值异常</el-button>
        <el-button type="primary" @click="down_realfile('已投产品净值波动差异.xlsx')">下载复权异常</el-button>
        <el-button type="primary" @click="down_realfile('收益数据'+summaryAll.header.ndate+'.xlsx')">下载投后分析数据</el-button>

   </el-row>
   
      <el-row>
  <el-col :span="24">
              <vxe-toolbar>
          <template #buttons>
            <el-date-picker style="width:130px"
      v-model="checkdate"
      value-format="yyyyMMdd"
      format="yyyyMMdd"
      align="right"
      type="date"
      >
    </el-date-picker>
          </template>
              </vxe-toolbar>
          <vxe-table
          size="mini"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'latest_date', order: 'desc'}, orders: ['desc', 'asc', null]}"
          :data="checkdata">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="产品"> 
                    <template #default="{ row }">
                             <a href="javascript:;" @click="showFundHis(row)">{{ showFundName(row.code)}}</a>
            </template>
          </vxe-column>
          <vxe-column field="code" sortable title="备案号"></vxe-column>
          <vxe-column field="class_type" title="类型"  :filters="sysparam.class_type.map(r=> {return {'label' : r.code,'value':r.value}})"></vxe-column>
          <vxe-column field="type" title="来源" :filters="sysparam.data_type.map(r=> {return {'label' : r.value,'value':r.value}})"></vxe-column>
          <vxe-column field="latest_date" sortable title="最新日期"></vxe-column>
          <vxe-column field="miss" sortable title="缺失数据"></vxe-column>
        </vxe-table>
  </el-col>
    </el-row>
  </div>
</template>

<script>
import axis from "axios";
import {mapGetters} from 'vuex'
import Bus from '@/store/bus.js';

export default {
   computed: {
     ...mapGetters(['class_order','sysparam','showFundName'])
   },
    props: {
      url:{
      type: String,
      default: "/fof/jreport"
    },
    },

  data() {
    return {
      checkdate:"",
      rawdata:{},
      indexdata:{},
      alarms:[],
      summaryData:[],
      summaryAll:{"header":{}},
      header_cols:['上周','上上周'],
      checkdata:[]
    };
  },
  watch: {
    $route:{
      handler(n){
          console.log(n)
          if(n.params['url']){
              this.curl="/fof/"+n.params['url']
          }
        //   this.getList()
		// 初始化操作
      },
      immediate: true,
      deep: true,
    },
    checkdate:{
              handler(n){
                  this.getCheckData()
              }
    }
  },
  methods: {
          down_realfile(fname){
          window.location.href="/fof/downrfile?fname="+fname+"&r="+Math.random()
      },
   searchProd(source,date,tbl,nt=""){
            axis( {
                url: '/fof/missprod',
                method: 'GET',
                params: {"source":source,"date":date,"tbl":tbl,"nt":nt}
                }).then((response) => {
                    Bus.$emit("showChart",{"prodlist":response.data,"diagName":"prodDiag"})
                })
  },
    getRemark(source){
      let tmap={"股票":"当前交易日行情数据条数","指数":"当前交易日行情数据条数","期权":"当前交易日行情数据条数","2":"对应周度数据条数","1":"对应交易日数据条数","GeShang":"对应周度数据条数","SiMuWang":"对应周度数据条数","ZhaoYang":"对应周度数据条数"}
      return tmap[source]
    },
    getTarget(source){
      let tmap={"股票":"jq.ASHAREEODPRICES","指数":"jq.AINDEXEODPRICES","期权":"jq.OPT_DAILY_PRICE","2":"fund_daily","1":"fund_daily","GeShang":"fund_val","SiMuWang":"fund_val","ZhaoYang":"fund_val"}
      return tmap[source]
    },
    getSouce(type){
      if(type=='1'){
        return '邮件(日)'
      }
      else if(type=='2'){
        return '邮件(周)'
      }
      return type
    },
    getIndex() {
      axis
        .get('fof/dateindex',{}) //axis后面的.get可以省略；
        .then((response) => {
             this.indexdata=response.data

        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAlarms() {
      axis
        .get('fof/alarms',{}) //axis后面的.get可以省略；
        .then((response) => {
             this.alarms=response.data

        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSummary() {
      axis
        .get('fof/data_summary',{}) //axis后面的.get可以省略；
        .then((response) => {
             this.rawdata=response.data
             this.summaryData=[{"ncnt":this.rawdata.header['tradedate'],"pcnt":this.rawdata.header['ptradedate']},...response.data.jq,{"ncnt":this.rawdata.header['ndate'],"pcnt":this.rawdata.header['pdate']},...response.data.data,{"ncnt":this.rawdata.header['mday'],"pcnt":this.rawdata.header['pmday']},...this.rawdata.daymail,{"ncnt":this.rawdata.header['ndate'],"pcnt":this.rawdata.header['pdate']},...this.rawdata.wb]
             this.header_cols=[response.data.header['ndate'],response.data.header['pdate']]
             this.summaryAll=response.data
             console.log(this.summaryData)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCheckData() {
      axis
        .get('fof/datacheck',{ params: {date:this.checkdate}}) //axis后面的.get可以省略；
        .then((response) => {
          this.rawdata=response.data
             this.checkdata=response.data.map(row=>{
              if(row["type"]&&row["type"].length>2){
              }else{
              row["type"]="渠道"
              }
              return row
             })

        })
        .catch((error) => {
          console.log(error);
        });
    },
    showFundHis(row){
          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"hisChart"})

      },
    //
  },
 mounted() {
          //  this.resizeChart();
            window.addEventListener("resize", this.resizeChart);
    },
 created() {
    // this.getIndex()
    // this.getAlarms()
    this.getCheckData()
    this.getSummary()
  },
};
</script>