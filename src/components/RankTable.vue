<template>
  <div>
<el-radio-group v-model="range">
  <el-radio-button type="primary" :key="i"  :label="i" icon="el-icon-edit" v-for="(item,i) in tags">{{item}}</el-radio-button>
</el-radio-group>
    <!-- <el-button type="info" @click="downFile('/fof/jscore_down')">下载数据</el-button> -->
    <el-button type="info" @click="exportExcel">导出评分</el-button>
   <el-table
      ref="multipleTable"
      id="out-table"
      :data="tableData"
      :max-height="tmaxh"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
    >  

      <el-table-column
        prop="基金名称"
        min-width="160"
        max-width="260"
        sortable
        label="基金名称"
        show-overflow-tooltip
      >

        <template slot-scope="scope">
          <!-- <a href="javascript:;" @click="showHis(scope.row)"> -->
                       <el-button  @click.native.prevent="addCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>

              {{ scope.row["name"] }}
            <!-- </a> -->
            </template>
      </el-table-column>
                <el-table-column 
        prop="class_type"
        width="60"
        sortable
        label="类型"
        show-overflow-tooltip
      >
      </el-table-column>
 
      <el-table-column :key="col + wts[idx]" v-for="(col,idx) in cols">
        <template slot="header"><el-input   class="rankcell" v-model="wts[idx]" :placeholder="col" clearable  ></el-input></template>
            <el-table-column 
        :prop="col"
        width="80"
        sortable
        :label="names[idx]"
        show-overflow-tooltip
             <template slot-scope="scope" >{{ showResult(scope.row[col],1,col) }}</template>
      
      </el-table-column>
      </el-table-column>

 <el-table-column>
              <template slot="header"><el-button size="mini" @click="calc_score">打分</el-button></template>
                 <el-table-column 
        prop="score"
        width="60"
        sortable
        label="score"
        show-overflow-tooltip
      >
            <template slot-scope="scope">
          <!-- <a href="javascript:;" @click="showHis(scope.row)"> -->
            {{showResult(scope.row["score"],1)}}
            <!-- </a> -->
            </template>
      </el-table-column>
      </el-table-column>
      <el-table-column 
        prop="length"
        width="80"
        sortable
        label="数据长度"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>
 <script>
// import echarts from 'echarts'
import Vue from 'vue'
import Bus from '../store/bus.js';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import DB from '@/store/localapi.js';
import * as df from "danfojs/dist/index";
import nj from 'numjs'
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
      dateranges:[],
      range:6,
      zz500idx:[],
      tmaxh:720,
      limit_dic:{'sharpe': 3, 'calmar': 5, 'sortino': 5, 'yeaily_return': 0.7},
      wts: [6, 0, 2, 1, 2, -1, 0, 0],
      wtsdict:{'yeaily_return':1, 'sharpe':2, 'calmar':1, 'sortino':3, 'dd':1, 'dd_week':2, 'win_ratio':2, 'volatility':1},
      tableData:[],
      tags: ["近一月","近季度","近半年","近一年","近2年","近3年","全部","今年","去年","前年"],
      cols: ['yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility'],
      names: ['年化收益', 'sharpe', 'calmar', 'sortino', '最大回撤', '回撤(周)', '胜率', '波动率']
    }
  },
  methods: {
    addCart(row){
      if(row['fundname']){
        row['code']=row['fundname']
        Bus.$emit("addcart",row)
      }
    },
    showResult(number,rate=100,col=""){
      if(col=='dd_week'){
        return number
      }
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        return this.$tools.formatMoney(number*rate,3)
    },
        exportExcel() {
          var title='评分'+new Date().getTime()
  /* generate workbook object from table */
  var workbook = XLSX.utils.book_new();

  var st = XLSX.utils.table_to_sheet(document.querySelector('#out-table'))
  st.C1={t: 'n', v:this.wts[0]}
  st.D1={t: 'n', v:this.wts[1]}
  st.E1={t: 'n', v:this.wts[2]}
  st.F1={t: 'n', v:this.wts[3]}
  st.G1={t: 'n', v:this.wts[4]}
  st.H1={t: 'n', v:this.wts[5]}
  st.I1={t: 'n', v:this.wts[6]}
  st.J1={t: 'n', v:this.wts[7]}
  // console.log(st['!ref'])
  var reg = new RegExp("(\d+$)")
  var rows=st['!ref'].match(/\d+$/)[0]
  // console.log(rows)
  st["M2"]={t:"s",v:"排名"}
  for(var i=3;i<=rows;i++){
    st["M"+i]={t: 'n', v:i-2}
  }
  XLSX.utils.book_append_sheet(workbook, st, "评分");
  /* get binary string as output */
  var wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'array' })


   try {
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), title+'.xlsx')
   } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
   return wbout

    },
      downFile(durl){

        const options = {"code":this.code}
            this.$tools.exportExcel(durl,options)
        },
    calc_score(){
      var rawdata = JSON.parse(JSON.stringify(this.tableData));
      for(var ret_df of rawdata){
      //去极值
      for(var item in this.limit_dic){
          ret_df[item] = (ret_df[item] >= this.limit_dic[item]) * this.limit_dic[item] + (ret_df[item] < this.limit_dic[item]) * ret_df[item]

        }
      }
    //求最大值
    var maxmin={}
    for (var item of this.cols){
      maxmin[item+"_max"]=-99
      maxmin[item+"_min"]=99
            for(var row of rawdata){
              if(row[item]>maxmin[item+"_max"]){
                   maxmin[item+"_max"]=row[item]
              }
              if(row[item]<maxmin[item+"_min"]){
                   maxmin[item+"_min"]=row[item]
              }
            }
    }
    for (var item of this.cols){
     maxmin[item+"_diff"]=maxmin[item+"_max"]-maxmin[item+"_min"]
    }
    for(var ridx in rawdata){ 
      var row=rawdata[ridx]
      var ascore=0
       for (var idx in this.cols){
         var item=this.cols[idx]
         var diff=maxmin[item+"_diff"]
         if(diff==0){
           diff=1
         }
        row[item]=(row[item]-maxmin[item+"_min"])/diff
        ascore+=row[item]*this.wts[idx]
       }
       this.tableData[ridx]['score']=ascore
    }
    console.log(this.tableData)
    // console.log(rawdata)
    // console.log(this.wts)
    // console.log(this.tableData)
    this.$nextTick(() => {      this.$refs.multipleTable.clearSort()
      this.$refs.multipleTable.sort('score', 'descending')}) 


    },
    wtsUpdate(event,idx){
      console.log(event)
      Vue.set(this.wts,idx,parseFloat(event))
      this.$forceUpdate();
      return parseFloat(event)
        },
    getFundVal(code){
              const stmt = DB.prepare('SELECT * FROM fund_val where code=? order by date');
              return stmt.all(code)
    },
    get_pctchange(data){
      var prev=0
      var ret=[NaN]
      data.forEach((val,idx)=>{
        if(prev!=0){
            ret.push(val/prev-1)
        }
        prev=val
      })
      return ret 
    },
    cutByDate(data,rg){
      var ndata=[]
      data.forEach((dt,idx)=>{
        if(dt['date']>=rg[0] &&dt['date']<=rg[1])
        ndata.push(dt)
      })
      if(ndata.length<2){
        return null
      }
      return ndata
    },
    calc_values(data,isExtra=false){

      const rg=this.dateranges[this.range]
      const ndata=this.cutByDate(data,rg)
      if(!ndata){
        return null
      }
      let datadf=new df.DataFrame(ndata)
      if(isExtra){
      let idxdata=this.cutByDate(this.zz500idx,rg)
      let idxdf=new df.DataFrame(idxdata)
      datadf=df.merge({ left: datadf, right: idxdf, 
                            on: ["date"], how: "left"})
      const fval = datadf.head(1)['sumval'].values[0]
      const fidx = datadf.head(1)['sumval_1'].values[0]      
      let retsr = datadf['sumval'].div(fval).sub(datadf['sumval_1'].div(fidx)) 
      datadf.addColumn({ "column": "return", "values":retsr, inplace: true })

      }else{
      let ret=this.get_pctchange(datadf['sumval'].values)
      datadf.addColumn({ "column": "return", "values":ret, inplace: true })

      }
      datadf.print()
      let stdval=datadf['return'].std()
      let mean=datadf['return'].mean()

      let win =datadf.iloc({rows:datadf['return'].gt(0)})
      let loss =datadf.iloc({rows:datadf['return'].lt(0)})
      var nhigh=0,hidx=0,drop=1,didx=0,sdidx=0
      var key ='sumval'
      if(isExtra){
        key='return'
      }
      datadf['sumval'].values.forEach((mval,idx)=>{
            if(mval>nhigh){
              nhigh=mval
              hidx=idx
            }else{
              let ndrop=mval/nhigh
              if(ndrop<drop){
                drop=ndrop
                sdidx=hidx
              }
              if(sdidx==hidx)
              didx=idx
            }
      })
      
      let [sharpe, calmar, sortino, max_dd, dd_week, win_ratio, y_r, volatility] = [4, 10, 10, 0, 0, 1, 1, 0]
      let shp=datadf.shape
      const sqrt52=Math.sqrt(52)
      if(shp[0]>0){
        sharpe=mean/stdval*sqrt52
        if(isExtra){
        y_r=datadf.tail(1)['return'].values[0]*52/shp[0]
        volatility=new df.Series(this.get_pctchange(datadf['return'].values)).std()*sqrt52
        }else{
        y_r=(datadf.tail(1)['sumval'].values[0]/datadf.head(1)['sumval'].values[0]-1)*52/shp[0]
        volatility=datadf['return'].std()*sqrt52
        }
        if(loss.shape[0]>0){
        sortino=mean/Math.sqrt((loss['return'].mul(loss['return']).sum())/(shp[0]-1))*sqrt52
        }
        max_dd=drop-1
        win_ratio=win.shape[0]/shp[0]
        dd_week=didx-sdidx
        calmar =-(y_r / max_dd)
      }
    
    let rst= {"sharpe":sharpe, "calmar":calmar, "sortino":sortino, "dd":max_dd, "dd_week":dd_week, "win_ratio":win_ratio, "yeaily_return":y_r, "volatility":volatility,"std":stdval,'mean':mean,'drops':nhigh+"_"+sdidx+"_"+drop+"_"+didx,"length":shp[0]}
    console.log(rst)
    return rst
    },
    getDateRanges(){
      //      tags: ["近一月","近季度","近半年","近一年","近2年","近3年","全部","今年","去年","前年"],

      var nday=this.$moment().format("YYYYMMDD");
      var vday1 = this.$moment().add(-1, "M").format("YYYYMMDD");
      var vday2 = this.$moment().add(-3, "M").format("YYYYMMDD");
      var vday3 = this.$moment().add(-6, "M").format("YYYYMMDD");
      var vday4 = this.$moment().add(-1, "Y").format("YYYYMMDD");
      var vday5 = this.$moment().add(-2, "Y").format("YYYYMMDD");
      var vday6 = this.$moment().add(-3, "Y").format("YYYYMMDD");
      var all  = '20000101'
      var vday7  = this.$moment().dayOfYear(1).format("YYYYMMDD");
      var vday8  = this.$moment().add(-1, "Y").dayOfYear(1).format("YYYYMMDD")
      var vday9  = this.$moment().add(-2, "Y").dayOfYear(1).format("YYYYMMDD")
      var vday10  = this.$moment().add(-3, "Y").dayOfYear(1).format("YYYYMMDD")
      this.dateranges= [
        [vday1,nday],
        [vday2,nday],
        [vday3,nday],
        [vday4,nday],
        [vday5,nday],
        [vday6,nday],
        [all,nday],
        [vday7,nday],
        [vday8,vday7],
        [vday9,vday8],
        [vday10,vday9],
        ]
    },
    getTable(){
        var $this=this
        if(this.$isElectron){
          this.zz500idx =this.getFundVal('000905.SHW')
          let ret=[]
          this.code.split(",").forEach((acode,idx)=>{
            if(acode){
              const istmt =DB.prepare('SELECT * FROM fund_info where code=? ')
              var info=istmt.get(acode)
              console.log(info)
              let rst=this.calc_values(this.getFundVal(acode),info['class_type']=="指增")
              if(rst){
              rst['fundname']=info['code']
              rst['name']=info['short_name']
              rst['class_type']=info['class_type']
              ret.push(rst)
              }

            }
          })
          this.tableData=ret
          this.calc_score()
          return
        }
        var param={code:this.code,range:this.range}
        this.$axios.get('/fof/fundrank',{params:{code:this.code,range:this.range}})//axis后面的.get可以省略；
            .then(
                (response) => {
                    $this.tableData=this.$tools.pandasToJson(response.data)
                    this.calc_score()
                })
            .catch(
                (error) => {
                    console.log(error);
        });
    }
  },
  created(){
    this.getDateRanges()
    this.getTable()
  },
  mounted() {
    //window.addEventListener('resize', this.resizeChart)
  },
  destroyed() {
    //window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped>
.el-input__inner {
padding:0 3px;
  }
</style>
