<template>

  <div>

 <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">      <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
            <vxe-button icon="fa fa-plus" @click="insertEvent()">新增</vxe-button>
  <vxe-button v-show="temp==1" @click="confirmData">确认数据</vxe-button>
    <vxe-button @click="downloadData" size="small" >下载数据</vxe-button>
    <vxe-button @click="uploadFile({ multiple : false,types:	['csv', 'xlsx',] })">导入净值</vxe-button>

    <!-- <el-upload
              class="upload-demo"
              accept=".xlsx,.xls"
              action="#"
              :data="{code:code}"
              :before-upload="(file)=>loadModel(file)"
              auto-upload
            >
              <vxe-button id="uploadButton" size="small" >导入净值</vxe-button>
    </el-upload> -->
    <vxe-button @click="saveHis">保存净值</vxe-button>
  <span>&nbsp;&nbsp;&nbsp;&nbsp;注意:净值日期格式为YYYYmmDD格式 即 20210304格式 </span>

        </div>
 </div>
        <vxe-table
          ref="hisTable"
          border
          align="right"
          size="mini"
          max-height="480"
          :mouse-config="{selected: true}"
          show-overflow
          :data="tableData"
          :edit-config="{trigger: 'dblclick', mode: 'cell'}"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}">
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column width="140" field="date" title="日期" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.date" class="myinput"></vxe-input>
            </template>
          </vxe-column>
           <vxe-column width="140" field="netval" title="当前净值" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.netval" class="myinput"></vxe-input>
            </template>
          </vxe-column>
            <vxe-column width="140" field="sumval" title="累计净值" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.sumval" class="myinput"></vxe-input>
            </template>
          </vxe-column>
            <vxe-column width="140" field="reval" title="复权净值" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.reval" class="myinput"></vxe-input>
            </template>
          </vxe-column>
        </vxe-table> 
        <div v-show="loaded">
            <!-- <vxe-select v-model="keymap[key]" placeholder="选择列">
              <vxe-option v-for="col of cols" :key="col" :value="col" :label="col"></vxe-option>
              </vxe-select> -->
              <vxe-select v-model="keymap[idx]" :placeholder="fcol"  style="width:140px" v-for="(fcol,idx) in cols" clearable :key="fcol" >
              <vxe-option v-for="(v,col) in frecord" :key="col" :value="col" :label="col"></vxe-option>
              </vxe-select> 
              <vxe-button @click="importData">确认</vxe-button>
        </div>

  </div>
</template>

<script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import axis from 'axios'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
// import DB from '@/store/localapi.js';
var echarts = require('echarts');
// 引入柱状图
// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
  props: {
    visable:{
      type: Boolean,
      default: false
    },
     code:{
      type: String,
      default: ""
    },
    temp:{
      type: Number,
      default: 0
    },
     title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '80%'
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    code:{
    handler: function(val) {
                this.loaded=false
                this.getTable(val)
              }
    },
    temp:{
    handler: function(temp) {
                this.getTable(this.code)
              }
    },
    isVisible: {
      handler: function(val) {
          console.log(val)
          console.log(this)
          if(val){
        this.getChart(this.code)
          }
      }
    },
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },
  data() {
    return {
      raw_data:{},
      startidx:0,
      loaded:false,
      cols:["日期","当前净值","累计净值","复权净值"],
      max_date:'',
    //   width: this.initWidth(),
      echart: null,
      impcols:[],
      records:[],
      frecord:{},
      keymap:["","","",""],
      tableData:[]  
    }
  },
  methods: {
     importData(){
       console.log(this.frecord)
      //  console.log(this.$moment("19000101").add(44620-2,"d").format("YYYYMMDD"))
       if(this.keymap[0]&&this.keymap[2]){
       this.tableData=this.records.map(rc=>{ 
         let ret={"code":this.code,"date":rc[this.keymap[0]].replaceAll("-",""),"netval":null,"sumval":rc[this.keymap[2]],"reval":null}
        if(this.keymap[1]){
          ret["netval"]=rc[this.keymap[1]]
        }
        if(this.keymap[3]){
          ret["reval"]=rc[this.keymap[3]]
        }
         return ret
         
       })
       }else{
      VXETable.modal.alert(`日期和累计净值列不能为空`)

       }
       
     },
     uploadFile (opts) {
       let that=this
              const $table = this.$refs.hisTable
              $table.readFile(opts).then(params => {
                const { file } = params
                       var reader = new FileReader();
          reader.onload = function(e) {
          var workbook = XLSX.read(e.target.result,{type:'binary',cellText:false,cellDates:true});
          that.records=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]],{raw:false,dateNF:'yyyymmdd'})
          that.impcols=[]
          if(that.records.length>0){
            that.frecord=that.records[0]
          }
          that.loaded=true
          // that.$refs.impTable.recalculate()
          // let rst=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).map((row)=>{return [that.code,row["date"].replaceAll("-",""),row["累计净值"]]})
          // console.log(rst)
        //   that.$message({
        //         message: '成功导入'+rst.length+"条数据",
        //         type: 'success',
        //         center: true
        // });
    /* DO SOMETHING WITH workbook HERE */

         };
          reader.readAsArrayBuffer(file);
                // $table.insert(records)
              })
            },
     async insertEvent (row) {
              const $table = this.$refs.hisTable
              const record = {
                date:""
              }
              const { row: newRow } = await $table.insertAt(record, row)
              await $table.setActiveCell(newRow, 'name')
            },
    saveHis(){
       const $table = this.$refs.hisTable
       let { insertRecords, removeRecords, updateRecords } = $table.getRecordset()
       let tosave=insertRecords.concat(updateRecords)
       if(this.loaded){
         tosave=this.tableData
       }
       console.log(tosave)
      // axis.post('/fof/savehis',{params:{code:this.code}})//axis后面的.get可以省略；
      //                   .then((response) => {
      //                       if(response.data.status=="success")
      //                       $this.getTable(this.code)
      //                   })
                   axis({
      method: 'post',
      url: "/fof/savehis", // 请求地址
      data: {code:this.code,data:tosave}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          this.loaded=false
          console.log(response.data)

      },
      err => {
        reject(err)
      }
    )
    },
    confirmData(){
         var $this=this
         axis.get('/fof/confirm',{params:{code:this.code}})//axis后面的.get可以省略；
                        .then((response) => {
                            if(response.data.status=="success")
                            $this.getTable(this.code)
                        })
    },
    loadModel(file){
      var that=this
      console.log(file)
        const insert = DB.prepare('replace into fund_val(code,date ,sumval ) VALUES (? ,? ,?)');
        const insertMany = DB.transaction((data) => {
          data.forEach((ele,index)=>{
              insert.run(ele);
            })
          })
        var reader = new FileReader();
          reader.onload = function(e) {
          var workbook = XLSX.read(e.target.result);
          console.log(workbook)
          let rst=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).map((row)=>{return [that.code,row["date"].replaceAll("-",""),row["累计净值"]]})
          insertMany(rst)
          that.$message({
                message: '成功导入'+rst.length+"条数据",
                type: 'success',
                center: true
        });
        that.getTable(that.code)
    /* DO SOMETHING WITH workbook HERE */
         };
  reader.readAsArrayBuffer(file);
  return false
    },
     uploadData(){

     },
    downloadData(){
      // if(this.$isElectron){
          var nwb= XLSX.utils.book_new();
          var nst=XLSX.utils.json_to_sheet(this.tableData.map((row)=>{return {date:row["date"],"累计净值":row['sumval']}}),{header:["date","累计净值"],skipHeader:false})
          XLSX.utils.book_append_sheet(nwb, nst, "Sheet1");
          var wbout = XLSX.write(nwb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        var title='净值历史'+new Date().getTime()
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), title+'.xlsx')
      // }else{
      //       const options = {code:this.code}
      //       this.$tools.exportExcel("/fof/report",options)
      // }

    },
    getTable(code){
              if(code&&code.length>2){
              console.log("refresh chart:"+code)
              var param={"code":code}
              console.log(this.temp)
              if(this.temp){
                  param["temp"]=this.temp
              }
              var $this=this
              if(this.$isElectron){
                  //  $this.tableData=[]
                  // const stmt = DB.prepare('SELECT * FROM fund_val where code=?');
                  // var hisData = stmt.all(code);
                  //  var len=hisData.length
                  //               console.log(len)
                  //               for (var i =len ;i>0;i--){
                  //               this.tableData.push(
                  //                  hisData[i-1]
                  //               )
                  //               }
                  }
              else{

              
              axis.get('/fof/his',{params:param})//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                $this.tableData=[]
                                var len=response.data.datas.length
                                console.log(len)
                                for (var i =len ;i>0;i--){
                                $this.tableData.push({
                                    date:response.data.datas[i-1][0],
                                    code:response.data.datas[i-1][1],
                                    netval:response.data.datas[i-1][2],
                                    sumval:response.data.datas[i-1][3],
                                    reval:response.data.datas[i-1][4]

                                })
                                }
                                console.log($this.tableData.length)

                                // $this.tableData=response.data.datas
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });}
          }

      },
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.getTable(this.code)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
