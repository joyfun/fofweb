<template>
  <div ref="tableContainer" style="	height : 100%;">
          <vxe-toolbar>
          <template #buttons>
            <vxe-button @click="showRankHis">排名对比</vxe-button>
            <el-date-picker style="width:130px"
      v-model="date"
      value-format="yyyyMMdd"
      format="yyyyMMdd"
      align="right"
      type="date"
      placeholder="选择日期"
      >
    </el-date-picker>
                <vxe-radio-group v-model="type" size="mini" :strict="false">
            <vxe-radio-button label="aas" content="AAS"></vxe-radio-button>
            <vxe-radio-button label="cta0" content="CTA0"></vxe-radio-button>
            <vxe-radio-button label="cta1" content="CTA1"></vxe-radio-button>
            <vxe-radio-button label="指增" content="指增"></vxe-radio-button>
            <vxe-radio-button label="中性" content="中性"></vxe-radio-button>

          </vxe-radio-group>

          <vxe-radio-group v-model="range" :strict="false">
            <vxe-radio label="hyr" content="半年"></vxe-radio>
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio label="2yr" content="2年"></vxe-radio>
          </vxe-radio-group>
          </template>
        </vxe-toolbar>   
       <vxe-table
          border
          ref="rankTable"
          height="auto"
          :align="allAlign"
          size="mini"
          show-overflow
          :sort-config="{trigger: 'cell', defaultSort: {field: 'rankF_1yr_r', order: 'asc'}, orders: ['desc', 'asc', null]}"
          :data="tableData"
        >
                  <vxe-column  type="checkbox" width="30"></vxe-column>
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column  width="200" field="code" align="left" title="产品名称" >
        <template #default="{ row }">
                   <el-button  @click.native.prevent="addCart(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>
       <a href="javascript:;" @click="showHis(row)">{{ showFundName(row.code) }}</a>
                           <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="历史" placement="left-start"><i class="el-icon-s-marketing" ></i></el-tooltip></el-button>

            </template>
          </vxe-column>
            <vxe-column  sortable  title="级别"  field="lscore" >
            <template #default="{ row }">
              <span>{{ nclassify(row) }}</span>
            </template>
          </vxe-column> 
           <vxe-colgroup  :key="type" :title="type+'排名信息('+rgdict[type]+')'" align="center" v-for=" type of ['hyr','1yr','2yr']">
               <vxe-column   :field="'rankF_'+type+'_r'" width="60" sortable :title="'rank'" >
            </vxe-column>
               <vxe-column :key="dkey" :field="dkey+'_'+type" width="60" sortable :title="dkey"  v-for="dkey in ['std','mean','slope','listrate']">
            </vxe-column>
                </vxe-colgroup>

          <vxe-colgroup title="指标数据" align="center">
                
         <vxe-column :key="af" width="60" sortable v-for="af of ['sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility']"  :title="af" :field="af"  >
            <template #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
          </vxe-column>
          </vxe-colgroup>

                      <!-- <vxe-column sortable  title="分"  field="lscore" >
          </vxe-column>  -->
        </vxe-table> 
    </div>
</template>

 <script>
 const level_dic = {'common': [[-0.03, -0.05, -0.07, -0.1], [0.06, 0.1, 0.13, 0.15]],
           'cta1': [[-0.13, -0.15, -0.2], [0.15, 0.2, 0.25]]}
const lvs=["丁","丙","乙","甲"]
import { mapGetters, mapMutations, mapState } from "vuex";
import Bus from '@/store/bus.js';
export default {
        //   components: {
        //     SankeyChart,
        // },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    type :{
              handler(n){
                  this.getProducts()
            },
    
    },
    range :{
              handler(n){
                  this.getBaseInfo()
            },
    
    },
     date :{
              handler(n){
                  this.getProducts()
            },
    
    }
  },
  computed: {
    rankTitle: {
      get() {
        return '排名('+this.tableData.length+')';
      }
    },
    ...mapState(["foflist"]),
    ...mapGetters(["sysparam","token","showFundName"]),
  },
  data() {
    return {  
        allAlign:"right",
        tableData:[],
        range:"1yr",
        baseData:{},
        rgdict:{},
        date: '',
        type: 'aas',
       cls_gap:{"aas":{"limit":{"dd":[-0.1,0],"volatility":[0,0.15]},"level":{"dd":[-0.07,-0.05,-0.03]}},
                "cta0":{"limit":{"dd":[-0.2,0],"dd_week":[0,60]},"level":{"dd":[-0.15,-0.07,-0.03]}},
               "cta1":{"limit":{"dd":[-0.2,0],"dd_week":[0,60]},"level":{"dd":[-0.15,-0.07,-0.03]}}}
    };
  },
  methods: {
     nclassify(row){
       let lmts=level_dic['common'] 
       let lcnt=4
       if(this.type=='cta1'){
         lmts=level_dic['cta1']
         lcnt=3
       }
       let score=0
       for(let i=0;i<lcnt;i++){
         if(row['dd']>=lmts[0][i]&&row['volatility']<=lmts[1][i]){
           score++
         }
       }
      row['lscore']=score
      return lvs[score-1]
     },
     classify(row){
       let key=this.type
       row["level"]="丁"
       let conf=this.cls_gap['aas']
       if(this.cls_gap[this.type]){
         conf=this.cls_gap[this.type]
       }
        let ranks=["丙","乙","甲"]
          for(var lvk  in  conf["level"]){
            let alvs=conf["level"][lvk]
            for (var i in alvs){
              if(row[lvk]>alvs[i]){
                row["level"]=ranks[i]
              }
            }
          }
          return row['level']
        },

        addCart(row){
      if(row['code']){
        Bus.$emit("addcart",{code:row['code'],name:this.showFundName(row['code'])})
      }
    },
     showFundHis(row){
          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"hisChart"})

      },
    showHis(row){
       Bus.$emit("showChart",{"cur_code":row.code,"diagName":"rankChart"})

    },
         showHis(row){
          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"rankChart"})

      },
     showRankHis(){
          let sels=this.$refs.rankTable.getCheckboxRecords()
          Bus.$emit("showChart",{"cur_code":sels.map(r=>r["code"]).join(','),"diagName":"rankChart"})

      },
    getBaseInfo(){
     this.$axios
        .get("/fof/baseinfo", { params: { date: this.date,type:this.type ,range:this.range,code:this.tableData.map(row=>row.code).join()} })
        .then((response) => {
          this.baseData =response.data
          this.tableData.map(row=>{
            for (let af of ['sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility']){
              row[af]=this.baseData[row.code][af]
            }
          })
          this.$refs.rankTable.reloadData(this.tableData)
          this.$refs.rankTable.sort({field: 'rankF_1yr_r', order: 'asc'})
        })
        .catch((error) => {
          console.log(error);
        }); 
    },
    getProducts() {
      this.$axios
        .get("/fof/rank2", { params: { date: this.date,type:this.type ,range:this.range} })
        .then((response) => {
          this.rgdict={}
          this.tableData =response.data.map(row=>{
            for(let rg of ['hyr','1yr','2yr']){
              if(row['rankF_'+rg]){
                row['rankF_'+rg+'_r']=row['rankF_'+rg].split("-")[0]
                this.rgdict[rg]=row['rankF_'+rg].split("-")[1]
              }
            }
           return row

          })
          this.getBaseInfo()
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
      this.date=this.$moment().format("YYYYMMDD");
    // this.getMisc("fof_action")

  },
};
</script>
<style lang="scss" >
</style>
