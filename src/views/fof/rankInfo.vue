<template>
  <div ref="tableContainer" style="	height : 100%;">
          <vxe-toolbar>
          <template #buttons>
            <vxe-button @click="showRankHis">排名对比</vxe-button>
            <vxe-button @click="compareData">业绩对比</vxe-button>
            <vxe-button @click="compareInvest">已投对比</vxe-button>
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
            <vxe-radio-button label="套利" content="套利"></vxe-radio-button>
            <vxe-radio-button label="高费率" content="高费率"></vxe-radio-button>

          </vxe-radio-group>

          <vxe-radio-group v-model="range" :strict="false">
            <vxe-radio label="hyr" content="半年"></vxe-radio>
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio label="2yr" content="2年"></vxe-radio>
          </vxe-radio-group>
                              <vxe-button @click="exportDataEvent">导出</vxe-button>

                              <!-- <vxe-button @click="jumptodash">排名信息</vxe-button> -->

          </template>
        </vxe-toolbar>  
       <vxe-table
          class="mytable-style"
          border
          ref="rankTable"
          height="auto"
          :align="allAlign"
          :cell-style="cellClassBg"
          size="mini"
          :row-config="{keyField:'code',isCurrent: true, isHover: true}"
          show-overflow
          :sort-config="{trigger: 'cell', defaultSort: {field: 'rankF_1yr_r', order: 'asc'}, orders: ['desc', 'asc', null]}"
          :data="tableList"
        >
                  <vxe-column  type="checkbox" width="30" fixed="left"></vxe-column>
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column  width="200" field="code" align="left" :title="prodTitle" fixed="left" :title-help="{message: '默认显示排名前30%和历史平均排名进入前30%次数超过70%的产品'}">
              <template #header>
                {{prodTitle}}
                <br>{{tableList.length}}
                  <vxe-switch v-model="showList" open-label="List" :open-value="true" close-label="所有" :close-value="false"></vxe-switch>
              </template>
        <template #default="{ row }">
                   <el-button  @click.native.prevent="addCart(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>
       <a href="javascript:;" @click="showHis(row)">{{ showFundName(row.code)}}</a>
                           <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="历史" placement="left-start"><i class="el-icon-s-marketing" ></i></el-tooltip></el-button>

            </template>
          </vxe-column>
            <vxe-column  sortable  title="级别"  field="level" sort-by="lscore"  :filters="[{label: '甲', value: '甲'}, {label: '乙', value: '乙'}, {label: '丙', value: '丙'}, {label: '丁', value: '丁'}]" :title-help="{message: '根据产品波动率和最大回撤对产品进行分级'}" >
            <!-- <template #default="{ row }">
              <span>{{ nclassify(row) }}</span>
            </template> -->
          </vxe-column> 
            <vxe-column field=" " width="2" sortable :title="' '"  >
            </vxe-column>
            <template  v-for=" type of ['hyr','1yr','2yr']">
           <vxe-colgroup  :key="type" :title="yrdict[type]+'排名信息('+rgdict[type]+')平均'+avgcnt[type]+'个'" align="center" >
               <vxe-column   :field="'rankF_'+type+'_r'" width="60" sortable :title="'rank'" >
                               <!-- <span>{{ row['rankF_'+type+'_r'].toFixed(3) }}</span> -->

            </vxe-column>

             <vxe-column :field="'mean_'+type" width="60" sortable :title="'mean(%)'"  >
            </vxe-column>
              <vxe-column :field="'listrate_'+type" width="60" sortable :title="'listrate'" >
            </vxe-column>
            <vxe-column :key="dkey" :field="dkey+'_'+type" width="60" sortable :title="dkey"  v-for="dkey in ['std']">
                             <!-- <template #default="{ row }">
              <span>{{ row[dkey+'_'+type].toFixed(3) }}</span>
            </template> -->
            </vxe-column>
            <vxe-column  :field="'meand_'+type" width="60" sortable :title="'Δrank'" >
                             <!-- <template #default="{ row }">
              <span>{{ row[dkey+'_'+type].toFixed(3) }}</span>
            </template> -->
            </vxe-column>
                </vxe-colgroup>
          <vxe-column  :key="'blank_'+type" field=" " width="2" sortable :title="' '"  >
            </vxe-column>
            </template>
          <vxe-colgroup :title="yrdict[range]+'指标数据'" align="center">
                <template #header>
          <vxe-radio-group v-model="range" :strict="false">
            <vxe-radio label="hyr" content="半年"></vxe-radio>
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio label="2yr" content="2年 指标数据"></vxe-radio>
          </vxe-radio-group>
                        </template>   
         <vxe-column :key="af" width="54" sortable v-for="af of ['length','sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility']"  :title="af" :field="af"  >
            <template #default="{ row }">
              <span>{{ row[af]}}</span>
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
const class_dict = {'cta0': ['CTA'], 'cta1': ['CTA'], '中性': ['中性'],
                 '指增': ['指增'], '套利': ['期权', '套利'],
                 'aas': ['中性', 'CTA', '期权', '套利', '混合']}
function isNumber(val) {
  if (parseFloat(val).toString() == "NaN") {
    return false;
  } else {
    return true;
}
}

import { mapGetters, mapMutations, mapState } from "vuex";
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
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
    showList:{
            handler(n){
                  this.filterList()
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
    // tableList: {
    //   get(){
    //     if(this.showList){
    //       console.log('############')
    //       console.log(this.showList)

    //       let ret= this.tableData.filter(row=>{
    //         for(let key in this.yrdict){
        
    //           if(isNumber(row["mean_"+key])&&row["mean_"+key]<=0.3){
    //             return true
    //           }
    //           if(isNumber(row["listrate_"+key])&&row["listrate_"+key>=0.7]){
    //             return true
    //           }
    //           if(isNumber(row['rankF_'+key+"_r"])&&(row['rankF_'+key+"_r"]/this.rgdict[key])<=0.3){
    //             return true
    //           }
    //         }
    //       return false
    //       })
    //       console.log(ret)
    //       return ret
    //     }
    //    return this.tableData
    //   }
    // },
    prodTitle: {
      get() {
        return '产品名称/'+this.calcdate;
      }
    },
    ...mapState(["foflist","holding"]),
    ...mapGetters(["sysparam","token","showFundName"]),
  },
  data() {
    return {  
        statdict:{},
        allAlign:"right",
        tableData:[],
        tableList:[],
        showList:true,
        range:"2yr",
        calcdate:"",
        baseData:{},
        rgdict:{},
        date: '',
        type: 'aas',
        yrdict: {"hyr":"半年","1yr":"一年","2yr":"两年"},
        avgcnt:{},
        cls_gap:{"aas":{"limit":{"dd":[-0.1,0],"volatility":[0,0.15]},"level":{"dd":[-0.07,-0.05,-0.03]}},
                "cta0":{"limit":{"dd":[-0.2,0],"dd_week":[0,60]},"level":{"dd":[-0.15,-0.07,-0.03]}},
               "cta1":{"limit":{"dd":[-0.2,0],"dd_week":[0,60]},"level":{"dd":[-0.15,-0.07,-0.03]}}}
    };
  },
  methods: {
    filterList(){
       if(this.showList){
          this.tableList= this.tableData.filter(row=>{
            for(let key in this.yrdict){
        
              if(isNumber(row["mean_"+key])&&row["mean_"+key]<=0.3){
                return true
              }
              if(isNumber(row["listrate_"+key])&&row["listrate_"+key>=0.7]){
                return true
              }
              if(isNumber(row['rankF_'+key+"_r"])&&(row['rankF_'+key+"_r"]/this.rgdict[key])<=0.3){
                return true
              }
            }
          return false
          })
        }else{
       this.tableList=this.tableData
        }
    },
    cellClass1 ({ row, rowIndex, column, columnIndex }) {
     if(row[column['field']]<0.3){
        return 'col-green'
      }
     if(row[column['field']]<0.5){
        return ''
      }
      if(row[column['field']]<0.7){
        return 'col-orange'
      }
     if(row[column['field']]>=0.7){
        return 'col-red'
      }
return ''
            },
    cellClass2 ({ row, rowIndex, column, columnIndex }) {
     if(row[column['field']]<0.3){
        return 'col-red'
      }
     if(row[column['field']]<0.5){
        return 'col-orange'
      }
      if(row[column['field']]<0.7){
        return ''
      }
     if(row[column['field']]>=0.7){
        return 'col-green'
      }
return ''
            },
    cellClassBg ({ row, rowIndex, column, columnIndex }) {
      if(column['field']&&column['field'].startsWith("std")){
        let rg=(this.statdict[column['field']]["max"]-row[column['field']])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      let clr=this.genColor(rg)
            return {
                    color: clr
                  }}
      else if(column['field']&&column['field'].startsWith("mean_")){
        let rg=(this.statdict[column['field']]["max"]-row[column['field']])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      let clr=this.genColor(rg)
            return {
                    color: clr
                  }}
        else if(column['field']&&column['field'].startsWith("listrate_")){
        let rg=(row[column['field']]-this.statdict[column['field']]["min"])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      let clr=this.genColor(rg)
            return {
                    color: clr
                  }}
            },
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
      row['level']=lvs[score-1]
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
      jumptodash(){
            this.$router.push({name:'rankinfo'})  
            this.$store.commit('selectMenu','rankinfo');
      },
    showHis(row){
        console.log(row)
       Bus.$emit("showChart",{"cur_code":row.code,"diagName":"rankChart"})

    },
     showRankHis(){
          let sels=this.$refs.rankTable.getCheckboxRecords()
          Bus.$emit("showChart",{"cur_code":sels.map(r=>r["code"]).join(','),"diagName":"rankChart"})

      },
    compareData(){
          let sels=this.$refs.rankTable.getCheckboxRecords()
          Bus.$emit("showChart",{"cur_code":sels.map(r=>r["code"]).join(','),"diagName":"compareTable"})

      },
    compareInvest(){
          let clss=class_dict[this.type]
          let sels=this.$refs.rankTable.getCheckboxRecords()
          if(sels.length==0){
            sels=this.tableList
          }
          let holds=this.foflist.filter(row=>this.holding.filter(hd=>hd['b_code']==row['code']).length>0).filter(row=>clss.indexOf( row['class_type'])>-1)
          sels=sels.concat(holds)
          Bus.$emit("showChart",{"cur_code":sels.map(r=>r["code"]).join(','),"diagName":"compareTable"})


    },
    exportDataEvent () {
      var title='排名信息'+this.type+'_'+this.date
      console.log(this.$refs.rankTable)
      var workbook = XLSX.utils.book_new();
      var st = XLSX.utils.table_to_sheet(this.$refs.rankTable.$el)
      XLSX.utils.book_append_sheet(workbook, st, "评分");
      var wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'array' })
         try {
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), title+'.xlsx')
   }    catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
              // this.$refs.rankTable.exportData({
              //   filename: '排名信息'+this.type+'_'+this.date,
              //   sheetName: 'Sheet1',
              //   type: 'xlsx'
              // })
            },
    getBaseInfo(){
     let that=this
     this.$axios
        .get("/fof/baseinfo", { params: { date: this.date,type:this.type ,range:this.range,code:this.tableData.map(row=>row.code).join()} })
        .then((response) => {
          this.baseData =response.data
          this.tableData.map(row=>{
            if(this.baseData[row.code]){
            for (let af of ['sharpe', 'calmar', 'sortino', 'dd', 'win_ratio','yeaily_return', 'volatility']){
              row[af]=this.baseData[row.code][af].toFixed(2)
            }
             row['dd_week']=this.baseData[row.code]['dd_week']
             row['length']=this.baseData[row.code]['tlength']

            that.nclassify(row)
            }
            return row
          })
          this.filterList()
          this.$refs.rankTable.reloadData(this.tableList)
          this.$refs.rankTable.sort({field: 'rankF_1yr_r', order: 'asc'})
        })
        .catch((error) => {
          console.log(error);
        }); 
    },
    rgbaToHex(color) {
	        var values = color
	          .replace(/rgba?\(/, '')
	          .replace(/\)/, '')
	          .replace(/[\s+]/g, '')
	          .split(',');
	        var a = parseFloat(values[3] || 1),
	          r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
	          g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
	          b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

	        return "#" +
	          ("0" + r.toString(16)).slice(-2) +
	          ("0" + g.toString(16)).slice(-2) +
	          ("0" + b.toString(16)).slice(-2);
	    },
    genColor(n) {

	    	let halfMax = 0.5  //最大数值的二分之一
	        //var 百分之一 = (单色值范围) / halfMax;  单颜色的变化范围只在50%之内
	        var one = 255 / halfMax; 
	        var r = 0;
	        var g = 0;
	        var b = 0;


	        if (n < halfMax) {
	          // 比例小于halfMax的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.
	          r = one * n;  
	          g = 255;
	        }

	        if (n >= halfMax) {
	          // 比例大于halfMax的时候绿色是越来越少的,直到0 变为纯红
	          g = (255 - ((n - halfMax) * one)) < 0 ? 0 : (255 - ((n - halfMax) * one))
	          r = 255;

	        }
	        r = parseInt(r);// 取整
	        g = parseInt(g);// 取整
	        b = parseInt(b);// 取整

	        // console.log(r,g,b)
	        return this.rgbaToHex("rgb(" + r + "," + g + "," + b + ")");
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
                row['meand_'+rg]=row['meanr_'+rg]-row['rankF_'+rg+'_r']

                this.rgdict[rg]=row['rankF_'+rg].split("-")[1]
              }

            }
            for(let key in row){
                if(key.indexOf('yr')>0&&key.indexOf('rank')<0&&key.indexOf('meand')<0){
                  if(isNumber(row[key])){
                    let tmp=this.statdict[key]
                    if(tmp){

                    }else{
                      tmp={"max":row[key],"min":row[key]}
                      this.statdict[key]=tmp
                    }
                    if(row[key]>tmp["max"]){
                      tmp["max"]=row[key]
                    }
                    if(row[key]<tmp["min"]){
                      tmp["min"]=row[key]
                    }
                    row[key]=parseFloat(row[key]).toFixed(2)
                  }
                }
              }
           return row

          })
          if(this.tableData&&this.tableData.length>0){
            this.calcdate=this.tableData[0]['date']
          }
          
      this.$axios
        .get("/fof/rankstat", { params: { date: this.date,type:this.type} })
        .then((response) => {
        this.avgcnt=response.data
        for (let k in this.avgcnt){
          this.avgcnt[k]=parseInt(this.avgcnt[k])
        }
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
<style lang="scss"  >
        .mytable-style .col--group {
          border:2px ;
        }
        .mytable-style .vxe-body--row.row-green {
          background-color: #187;
          color: #fff;
        }
        .mytable-style .vxe-header--column.col-blue {
          background-color: #2db7f5;
          color: rgb(170, 8, 8);
        }
        .mytable-style .vxe-body--column.col-red {
         color: red;
          // color: #fff;
        }
        .mytable-style .vxe-body--column.col-yellow {
          color: yellow;
          // color: #000;
        }
        .mytable-style .vxe-body--column.col-green {
          color: darkgreen;
          //color: #000;
        }
        .mytable-style .vxe-body--column.col-yellowgreen {
          color: yellowgreen;
          //color: #fff;
        }
</style>
