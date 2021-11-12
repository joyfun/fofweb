<template>
  <div>
<el-radio-group v-model="range">
  <el-radio-button type="primary" :key="i"  :label="i" icon="el-icon-edit" v-for="(item,i) in tags">{{item}}</el-radio-button>
</el-radio-group>
    <!-- <el-button type="info" @click="downFile('/fof/jscore_down')">下载数据</el-button> -->
    <el-button type="info" @click="exportExcel">导出评分</el-button>
    <el-button v-if="!$isElectron" type="info" @click="exportExcelAll()">下载数据</el-button> 

   <el-table
      ref="multipleTable"
      id="out-table"
      :data="tableData"
      :max-height="tmaxh"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
    >  
 <el-table-column
      type="index"
      :index="indexMethod"></el-table-column>
      <el-table-column
        prop="基金名称"
        min-width="120"
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
        min-width="70"
        sortable
        :label="names[idx]"
        show-overflow-tooltip
            > <template slot-scope="scope" >{{ showResult(scope.row[col],1,col) }}</template>
      
      </el-table-column>
      </el-table-column>

 <el-table-column>
              <template slot="header"><el-button size="mini" @click="calc_score(1)">打分1</el-button></template>
              <template slot="header"><el-button size="mini" @click="calc_score(2)">打分2</el-button></template>

                 <el-table-column 
        prop="score"
        min-width="70"
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
              <el-table-column 
        prop="score2"
        min-width="70"
        sortable
        label="score2"
        show-overflow-tooltip
      >
            <template slot-scope="scope">
          <!-- <a href="javascript:;" @click="showHis(scope.row)"> -->
            {{showResult(scope.row["score2"],1)}}
            <!-- </a> -->
            </template>
      </el-table-column>
      </el-table-column>
      <el-table-column 
        prop="length"
        min-width="40"
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
      range:3,
      zz500idx:[],
      tmaxh:720,
      limit_dic:{'sharpe': 3, 'calmar': 5, 'sortino': 5, 'yeaily_return': 0.7},
      wts: [6, 0, 2, 1, 2, -1, 0, 0],
      wtsdict:{'yeaily_return':1, 'sharpe':2, 'calmar':1, 'sortino':3, 'dd':1, 'dd_week':2, 'win_ratio':2, 'volatility':1},
      tableData:[],
      tags: ["近一月","近季度","近半年","近一年","近2年","近3年","全部","今年","去年","前年"],
      cols: ['yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility'],
      samplerow:{"rank":"",'fundname':'','name':'','class_type':'','sub_type':'','yeaily_return':1, 'sharpe':2, 'calmar':1, 'sortino':3, 'dd':1, 'dd_week':2, 'win_ratio':2, 'volatility':1},
      names: ['年化收益', 'sharpe', 'calmar', 'sortino', '最大回撤', '回撤(周)', '胜率', '波动率']
    }
  },
  methods: {
     indexMethod(index) {
        return index +1
      },
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
    exportExcelAll(){
        const options = {"code":this.code}
        this.$axios({
        method: 'post',
        url: '/fof/jscore_down', // 请求地址
        data: options, // 参数
        responseType:'arraybuffer',
      }).then(response => {
          var data = new Uint8Array(response.data);
          var workbook = XLSX.read(data, {type:"array"});
          console.log(workbook)
          var nwb= XLSX.utils.book_new();
          for (var sn of workbook.SheetNames){
              let tdata=XLSX.utils.sheet_to_json(workbook.Sheets[sn])
              if(tdata.length>2)
              DB.do_calc(tdata,this.cols,this.limit_dic,this.wts)
              tdata.sort((a,b)=>{b['socre']-a['score']})
              for(var i in this.cols){
                this.samplerow[this.cols[i]]=this.wts[i]
              }
              const headers=['rank','fundname','name','class_type','sub_type','yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility','score']
              tdata.map(t=>{t['rank']=t['__EMPTY']+1
              delete t['__EMPTY']})
              var nst=XLSX.utils.json_to_sheet([this.samplerow],{header:headers, skipHeader:true})
               XLSX.utils.sheet_add_json(nst,tdata,{header:headers,  skipHeader: false, origin: -1})
              XLSX.utils.book_append_sheet(nwb, nst, sn);

              
          }
            var wbout = XLSX.write(nwb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        var title='评分下载'+new Date().getTime()
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), title+'.xlsx')
        //   console.log(workbook.SheetNames)
      })
        

    },
    exportExcel(){
      var title='评分'+new Date().getTime()
      let wbout=this.genSheet()
         try {
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), title+'.xlsx')
   }    catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }

    },
        genSheet() {
  var workbook = XLSX.utils.book_new();
  var st = XLSX.utils.table_to_sheet(document.querySelector('#out-table'))
  st.D1={t: 'n', v:this.wts[0]}
  st.E1={t: 'n', v:this.wts[1]}
  st.F1={t: 'n', v:this.wts[2]}
  st.G1={t: 'n', v:this.wts[3]}
  st.H1={t: 'n', v:this.wts[4]}
  st.I1={t: 'n', v:this.wts[5]}
  st.J1={t: 'n', v:this.wts[6]}
  st.K1={t: 'n', v:this.wts[7]}
  XLSX.utils.book_append_sheet(workbook, st, "评分");
  var wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'array' })
   return wbout
    },
      downFile(durl){

        const options = {"code":this.code}
            this.$tools.exportExcel(durl,options)
        },

    do_calc2(tableData){
      var rawdata = JSON.parse(JSON.stringify(tableData));
      // console.log(rawdata)
      //console.log(rawdata.sort((a,b)=>{return b['yeaily_return']-a['yeaily_return']}))

      var rlen=rawdata.length
      if(rlen<2){
        return
      }
    for (var col of this.cols){
          console.log(col)
          rawdata.sort((a,b)=>{return b[col]-a[col]})
          // for (var i =0;i<rlen;i++){
          //   rawdata[i][col+"_"]=1-i/(rlen-1)
          //   rawdata[i][col+"_i"]=i+1 
          // }
          rawdata.forEach((item,i)=>{
            item[col]=1-i/(rlen-1)
            item[col+"_i"]=i+1

        })
        // console.log(rawdata)
    }
    for(var ridx in rawdata){ 
      var row=rawdata[ridx]
      var ascore=0
       for (var idx in this.cols){
         var item=this.cols[idx]
        ascore+=row[item]*this.wts[idx]
       }
      tableData.forEach((item,idx)=>{
        if(item['fundname']==row['fundname']){
          item['score2']=ascore
        }
      })
       
      //  this.tableData[ridx]['score2']=ascore
    }
    // Vue.set(this,"tableData",this.tableData)
    },
    calc_score(type=1){
        var sortcol="score"
        if(type==1){
        DB.do_calc(this.tableData,this.cols,this.limit_dic,this.wts)
        }else{
            sortcol="score2"
        this.do_calc2(this.tableData)    
        }
        this.$nextTick(() => {      this.$refs.multipleTable.clearSort()
        this.$refs.multipleTable.sort(sortcol, 'descending')}) 
    },
  
    wtsUpdate(event,idx){
      console.log(event)
      Vue.set(this.wts,idx,parseFloat(event))
      this.$forceUpdate();
      return parseFloat(event)
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
          // this.zz500idx =this.getFundVal('000905.SHW')
          // let ret=[]
          // this.code.split(",").forEach((acode,idx)=>{
          //   if(acode){
          //     const istmt =DB.prepare('SELECT * FROM fund_info where code=? ')
          //     var info=istmt.get(acode)
          //     console.log(info)
          //     let rst=this.calc_values(this.getFundVal(acode),info['class_type']=="指增")
          //     if(rst){
          //     rst['fundname']=info['code']
          //     rst['name']=info['short_name']
          //     rst['class_type']=info['class_type']
          //     ret.push(rst)
          //     }

          //   }
          // })
          const rg=this.dateranges[this.range]
          this.tableData=DB.getSocres(this.code,rg)
          this.calc_score()
          return
        }
        var param={code:this.code,range:this.range}
        this.$axios.get('/fof/fundrank',{params:{code:this.code,range:this.range}})//axis后面的.get可以省略；
            .then(
                (response) => {
                    $this.tableData=this.$tools.pandasToJson(response.data)
                    this.calc_score(1)
                    this.calc_score(2)

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
