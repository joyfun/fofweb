<template>
  <div ref="tableContainer" style="	height : 100%;">
          <vxe-toolbar>
          <template #buttons>
            <vxe-button @click="clearSelect">取消选择</vxe-button>
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
          @checkbox-change="selectChangeEvent1"
          @checkbox-all="checkAll"
          class="mytable-style"
          border
          ref="rankTable"
          :height="height"
          :align="allAlign"
          :cell-style="cellClassBg"
          size="mini"
          :row-config="{keyField:'code',isCurrent: true, isHover: true}"
          show-overflow
          :sort-config="{trigger: 'cell', defaultSort: {field: 'rank', order: 'asc'}, orders: ['desc', 'asc', null]}"
          :data="tableList"
        >
                  <vxe-column  type="checkbox" width="30" fixed="left"></vxe-column>
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column  width="200" field="code" align="left" :title="prodTitle" fixed="left" :title-help="{message: '默认显示排名前30%和历史平均排名进入前30%次数超过70%的产品'}">
              <template #header>
                {{prodTitle}}
                <br>{{tableList.length}}
                  <vxe-switch v-model="showList" open-label="List" :open-value="true" close-label="所有" :close-value="false"></vxe-switch>
                  <vxe-input v-model="filter"  @keyup="filterNames" ></vxe-input>

              </template>
        <template #default="{ row }">
                                      <!-- <vxe-button  @click.native.prevent="addCart(row)" type="text" status="primary" size="small" ><i class="iconfont icon-mairu" ></i></vxe-button> -->
                            <!-- <vxe-button  @click.native.prevent="addCart(row)" type="text" status="primary" size="small" ><i class="iconfont icon-mairu" ></i></vxe-button> -->
                            &nbsp;<vxe-button  @click.native.prevent="oneKeyBuy(row)" type="text" status="primary" size="small"><i class="iconfont icon-yijiangoumai" ></i></vxe-button>
       <a href="javascript:;" @click="showHis(row)">{{ showFundName(row.code)}}</a>
                           <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><i class="el-icon-s-marketing" ></i></el-button>

            </template>
          </vxe-column>
          <!-- -->
          <vxe-column  sortable  title="级别"  width="36" align="center" field="level" sort-by="lscore"  :filters="[{label: '甲', value: '甲'}, {label: '乙', value: '乙'}, {label: '丙', value: '丙'}, {label: '丁', value: '丁'}]" :title-help="{message: '根据产品波动率和最大回撤对产品进行分级'}" >
          </vxe-column> 
           <vxe-column   field="rank" width="40" sortable :title="'rank'" >
            </vxe-column>
          <template  v-if="type=='高费率'">
              <vxe-column field="fee" width="60"  title="fee"  ></vxe-column>
              <vxe-column align="left" field="carry" width="160"  title="carry"  ></vxe-column>
              <!-- <vxe-column field="perf_comp" width="80"  title="业绩提计方式"  ></vxe-column> -->
              <vxe-column align="left" field="remark" width="240"  title="备注"  ></vxe-column>
          </template>
          <template  v-else>

            <vxe-column field=" " width="2" sortable :title="' '"  >
            </vxe-column>
            <template  v-for=" tp of ['hyr','1yr','2yr']">
           <vxe-colgroup  :key="tp" :title="yrdict[tp]+'排名信息('+tableData.length+')平均'+avgcnt[range]+'个'" align="center" >


             <vxe-column :field="'mean'+winlength[tp]" width="48" sortable :title="'mean(%)'"  >
            </vxe-column>
              <vxe-column :field="'listrate'+winlength[tp]" width="48" sortable :title="'listrate'" >
            </vxe-column>
            <vxe-column :key="dkey" :field="dkey+winlength[tp]" width="48" sortable :title="dkey"  v-for="dkey in ['std']">
            </vxe-column>
            <vxe-column  :field="'meand'+winlength[tp]" width="48" sortable :title="'Δrank'" >
            </vxe-column>
                </vxe-colgroup>
          <vxe-column  :key="'blank_'+tp" field=" " width="2" sortable :title="' '"  >
            </vxe-column>
            </template>
          </template> 
          <vxe-colgroup :title="yrdict[range]+'指标数据'" align="center">
                <template #header>
          <vxe-radio-group v-model="brange" :strict="false">
            <vxe-radio label="hyr" content="半年"></vxe-radio>
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio label="2yr" content="2年 指标数据"></vxe-radio>
          </vxe-radio-group>
                        </template>   
         <vxe-column :key="af" :width="48" sortable v-for="af of ['length','yeaily_return','sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility']"  :title="af" :field="af"  >
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
    height: {
      type: String,
      default: 'auto',
    },
  },
  watch: {
    type :{
              handler(n){
                if(this.type=='高费率'){
                  this.showList=false
                }
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
                  this.getProducts()
            },
    
    },
    brange :{
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
        filter:"",
        multipleSelection:[],
        basedict:{},
        allAlign:"right",
        tableData:[],
        tableList:[],
        winlength:{'hyr':26,'1yr':52,'2yr':104},
        showList:true,
        range:"2yr",
        brange:"hyr",
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
    setSelect(){
      let selrow=this.tableData.filter(row=>this.multipleSelection.indexOf(row['code'])>-1)
      this.$refs.rankTable.setCheckboxRow(selrow, true)

    },
    clearSelect(){
      this.$refs.rankTable.clearCheckboxRow()
      this.multipleSelection=[]
    },
    checkAll({ checked, $event }){
      if(checked){
        this.multipleSelection=this.tableList.map(r=>r['code'])
      }else{
        this.multipleSelection=[]
      }
      console.log(this.multipleSelection)
    },
    selectChangeEvent1({ checked, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }){
      if(checked&&this.multipleSelection.indexOf(row['code']<0)){
        this.multipleSelection.push(row["code"])
      }else{
        this.multipleSelection=this.multipleSelection.filter(r=>r!=row['code'])
      }
    },
    oneKeyBuy(row){
            if(row['code']){
        Bus.$emit("oneKeyBuy",{b_code:row['code'],stage:"待投资"})
      }

    },
    filterNames(){
      if(this.filter){
        this.tableList=this.tableData.filter(row=>{
          return row["name"].indexOf(this.filter)>-1
        })
      }else{
      this.filterList()
      }
    },
    filterList(){
       if(this.showList){
          this.tableList= this.tableData.filter(row=>{
            return row['list']=='1'
          //   for(let key in this.yrdict){
        
          //     if(isNumber(row["mean"+this.winlength[key]])&&row["mean"+this.winlength[key]]<=0.3){
          //       return true
          //     }
          //     if(isNumber(row["listrate"+this.winlength[key]])&&row["listrate"+this.winlength[key]]>=0.7){
          //       return true
          //     }
          //     if(isNumber(row['rankF_'+key+"_r"])&&(row['rankF_'+key+"_r"]/this.rgdict[key])<=0.3){
          //       return true
          //     }
          //   }
          // return false
          })
        }else{
       this.tableList=this.tableData
        }
       this.setSelect()

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
      if(['yeaily_return','sharpe', 'calmar', 'sortino', 'dd', 'win_ratio'].indexOf(column['field'])>-1){
        // console.log(this.statdict[column['field']])
        if(this.statdict[column['field']]){
        let rg=(row[column['field']]-this.statdict[column['field']]["min"])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      let clr=this.genColor(rg)
            return {
                    color: clr
                  }
                  }
      }
      else if(column['field']&&column['field'].startsWith("std")){
        let rg=(this.statdict[column['field']]["max"]-row[column['field']])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      let clr=this.genColor(rg)
            return {
                    color: clr
                  }}
      else if(column['field']&&column['field'].startsWith("mean")&&this.statdict[column['field']]){
        let rg=(this.statdict[column['field']]["max"]-row[column['field']])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      let clr=this.genColor(rg)
            return {
                    color: clr
                  }}
        else if(column['field']&&column['field'].startsWith("listrate")){
    
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
       Bus.$emit("showChart",{"cur_code":row.code,"rg":this.range,"diagName":"rankChart"})

    },
     showRankHis(){
          // let sels=this.$refs.rankTable.getCheckboxRecords()
          if(this.multipleSelection.length>0)
          Bus.$emit("showChart",{"cur_code":this.multipleSelection.join(','),"rg":this.range,"diagName":"rankChart"})

      },
    compareData(){
          if(this.multipleSelection.length>0)
          Bus.$emit("showChart",{"cur_code":this.multipleSelection.join(','),"diagName":"compareTable"})

      },
    compareInvest(){
          let clss=class_dict[this.type]
          // let sels=this.$refs.rankTable.getCheckboxRecords()
          // if(sels.length==0){
          //   sels=this.tableList
          // }
          let holds=this.foflist.filter(row=>this.holding.filter(hd=>hd['b_code']==row['code']).length>0).filter(row=>clss.indexOf( row['class_type'])>-1).map(row=>row['code'])
          let sels=this.multipleSelection.concat(holds)
          Bus.$emit("showChart",{"cur_code":sels.join(','),"diagName":"compareTable"})


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
        .get("/fof/baseinfo", { params: { date: this.date,type:this.type ,range:this.brange,code:this.tableData.map(row=>row.code).join()} })
        .then((response) => {
          this.baseData =response.data
          this.tableData.map(row=>{
            if(this.baseData[row.code]){
            for (let af of ['sharpe', 'calmar', 'sortino', 'dd', 'win_ratio','yeaily_return', 'volatility']){   
             let digi=2
              if(this.baseData[row.code][af]>=10){
                  digi=1
              }
              row[af]=this.$tools.formatMoney(this.baseData[row.code][af],digi)
               if(isNumber(row[af])){
                    let tmp=this.statdict[af]
                    if(tmp){

                    }else{
                      tmp={"max":row[af],"min":row[af]}
                      this.statdict[af]=tmp
                    }
                    if(row[af]>tmp["max"]){
                      tmp["max"]=row[af]
                    }
                    if(row[af]<tmp["min"]){
                      tmp["min"]=row[af]
                    }
                  }
            }
             row['dd_week']=this.baseData[row.code]['dd_week']
             row['length']=this.baseData[row.code]['tlength']
            }
            return row
          })
          this.filterList()

          // this.$nextTick(()=>{
          this.$refs.rankTable.reloadData(this.tableList)
          this.setSelect()
          this.$refs.rankTable.sort({field: 'rank', order: 'asc'})
          // })
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
            //       黄色（深黄）#FFB90F
            // 黄色（中黄）#EEC900
            // 绿色（深绿）#0ce91f69
            // 绿色（中绿）#88b924d3
      let color='#0B5345'
      if(n>=0.7){
        color='#ff0000'
      }
      else if(n>=0.5){
        color='#FFB90F'
      }
      else if(n>=0.3){
        color='#229954'
      }
      return color

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
        .get("/fof/rank3", { params: { date: this.date,type:this.type ,range:this.range} })
        .then((response) => {
          this.rgdict={}
          this.tableData =response.data.map(row=>{
            row['name']=this.showFundName(row['code'])
            for(let rg of ['hyr','1yr','2yr']){
            //   if(row['rankF_'+rg]){
            //     row['rankF_'+rg+'_r']=row['rankF_'+rg].split("-")[0]
            //     row['meand_'+rg]=row['meanr_'+rg]-row['rankF_'+rg+'_r']

            //     this.rgdict[rg]=row['rankF_'+rg].split("-")[1]
            //   }
            row['meand'+this.winlength[rg]]=row['meanr'+this.winlength[rg]]-row['rank']
            }
            for(let key in row){
                if(['mean26','mean52','mean104','listrate26','listrate52','listrate104','std26','std52','std104'].indexOf(key)>-1){
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
                // if(['sharpe', 'calmar', 'sortino', 'dd', 'win_ratio','yeaily_return', 'volatility'].indexOf(key)>-1){
                //                       let fcnt=2
                //                       let rval=parseFloat(row[key])
                //                       if(rval>=10){
                //                         fcnt=1
                //                       }
                //                       row[key]=rval.toFixed(fcnt)
                // }
              }
           return row

          })
          console.log(this.statdict)
          if(this.tableData&&this.tableData.length>0){
            this.calcdate=this.tableData[0]['date']
          }
          this.getBaseInfo()

          
      this.$axios
        .get("/fof/rankstat", { params: { date: this.date,type:this.type} })
        .then((response) => {
        this.avgcnt=response.data
        for (let k in this.avgcnt){
          this.avgcnt[k]=parseInt(this.avgcnt[k])
        }
        })
          if(this.type=='高费率'){
                 this.$axios
        .get("/fof/list", { params: { scale:this.type} })
        .then((response) => {
          let scalelist=response.data
        this.tableData.map(row=>{
          let infos=scalelist.filter(info=>info['code']==row['code'])
          if(infos.length==1){
            let finfo=infos[0]
            row['fee']=finfo['fee']
            row['carry']=finfo['carry']
            row['perf_comp']=finfo['perf_comp']
            row['remark']=finfo['remark']

          }
          return row
        })
        
        }) 
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.date=this.$moment().format("YYYYMMDD");
    //this.getProducts();
  },
  created() {
    // this.getMisc("fof_action")

  },
};
</script>
<style lang="scss"  >
.vxe-button+.vxe-button{
  margin-left: 0px;
  padding-right: 0px;
  padding-left: 0px;
    margin-right: 0px;

}

        .mytable-style .col--group {
          border:2px ;
        }
        .mytable-style .vxe-cell {
           padding-right: 2px;
           padding-left: 2px;
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
         color: #ff0000;
          // color: #fff;
        }
        .mytable-style .vxe-body--column.col-yellow {
          color: yellow;
          // color: #000;
        }
        .mytable-style .vxe-body--column.col-green {
          color: #006400;
          //color: #000;
        }
        .mytable-style .vxe-body--column.col-yellowgreen {
          color: yellowgreen;
          //color: #fff;
        }
        
</style>
