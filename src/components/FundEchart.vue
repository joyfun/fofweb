<template>
<div ref="echartdiv">
      <!-- <rank-table       ref="ranktable"  :titles="compare"  style="height: 800px"  :code="code"  ></rank-table> -->

<div class="block">
    <span class="demonstration">起始日期</span>
    <el-date-picker
      v-model="startdate"
      value-format="yyyyMMdd"
      format="yyyyMMdd"
      align="right"
      @change="changeDate"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions">
    </el-date-picker>
    <span class="demonstration">截止日期</span>
    <el-date-picker
      v-model="enddate"
      value-format="yyyyMMdd"
      format="yyyyMMdd"
      align="right"
      @change="changeEndDate"
      type="date"
      placeholder="截止日期"
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-button  @click="downPDF('echartdiv')">保存图表</el-button>

  </div>
  <div style="height: 420px" ref="echart">
    <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
    基金净值历史
  </div>
</div>
</template>

// <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import axis from "axios";
import Bus from '@/store/bus.js';
import {mapGetters} from 'vuex'
import DB from '@/store/localapi.js';
import * as df from "danfojs/dist/index";
import RankTable from '@/components/RankTable';
var echarts = require("echarts");
// 引入柱状图
// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
        components: {
            RankTable,
        },
  props: {
    visable: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
    wts: {
      type: String,
      default: "",
    },
    cb: {
      type: String,
      default: "",
    },
    dstartdate: {
      type: String,
      default: "",
    },
    compares: {
      type: String,
      default: "",
    },
    filter: {
      type: Object,
      default: null,
    },
    combine: {
      type: Object,
      default: null,
    },
    titles: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "80%",
    },
    isAxisChart: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
      ...mapGetters(['sysparam','token']),

      collen:{get() {
          return this.raw_data["columns"].length
      }},
    isVisible: {
      get() {
        return this.visable;
      },
      set() {
        this.close();
      },
    },
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption;
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
  },
  watch: {
    code: {
      handler: function (val) {
        if (!this.compares) this.getChart(val);
      },
    },
    combine: {
      handler: function (val) {
        if (val) {
          for (var key in val) {
            if (this.raw_data.columns.indexOf(key) < 0)
              this.raw_data.columns.push(key);
            this.raw_data[key] = [];
            for (var i = 0; i < this.raw_data.date.length; i++) {
              var ret = 0;

              for (var skey in val[key]) {
                if (!this.raw_data[skey][i]) {
                  ret = null;
                  break;
                }
                ret += this.raw_data[skey][i] * val[key][skey];
              }
              this.raw_data[key].push(ret);
            }
          }
          this.chartData.xData = [];
          this.chartData.series = [];
          this.chartData.xData = this.raw_data["date"];
          var len = this.chartData.xData.length;
          if (len) {
            this.max_date = this.chartData.xData[len - 1];
          }
          var cols=this.raw_data["columns"].length
          for (var idx in this.raw_data["columns"]) {
            var cname = this.raw_data["columns"][idx];
            var asery={
              data: this.raw_data[cname].concat(),
              type: "line",
              selectedMode: "single",
              name: cname,
            }
            if(this.token=="demo"){
                asery.name=this.raw_data["mcodes"][idx]
            }
            this.chartData.series.push(asery);
          }
          this.initChart();
        }
      },
    },
    filter: {
      handler: function (val) {
        console.log("watch filter by");
        this.getChart(this.code);
      },
    },
    compares: {
      handler: function (val) {
        this.getChart(val);
      },
    },
    isVisible: {
      handler: function (val) {
        if (val) {
          this.getChart(this.code);
        }
      },
    },
    isCollapse() {
      setTimeout(() => {
        this.resizeChart();
      }, 300);
    },
  },
  data() {
    return {
      raw_data: {},
      startdate:'',
      tur:0,
      enddate:'',
      pickerOptions:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [ 
            {
            text: '7日',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
                }
            },
            {
            text: '30日',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
                }
            },
            {
            text: '90日',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', date);
                }
            }
            ,
            {
            text: '180日',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', date);
                }
            },
            {
            text: '一年',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', date);
                }
            }
          ]
      },
      startidx: 0,
      max_date: "",
      //   width: this.initWidth(),
      echart: null,
      chartData: {
        type: Object,
        default() {
          return {
            xData: [],
            series: [],
          };
        },
      },
      axisOption: {
        // title: {
        // text: "基金净值对比图"},
        animation:false,
        legend: [{
          //option.legend[0].selected[basename+"_超额"] = params.selected[basename];
          selected:{},
          type: "scroll",
          align :"right",
          orient: "vertical",
          top: "middle",
          right: 0,
        }],
        grid: {
            left:"2%",
        right: '10%',
        containLabel: true
    },
        toolbox: {
          left: "left",
          feature: {
            myTool1: {
              show: true,
              title: "原始值",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            myday7: {
              show: true,
              title: "周对比",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            myday30: {
              show: true,
              title: "月对比",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            myday90: {
              show: true,
              title: "90天",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            myday180: {
              show: true,
              title: "半年",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            mydayyear: {
              show: true,
              title: "近一年",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            mythisyear: {
              show: true,
              title: "本年",
              icon:
                "path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            mycombine: {
              show: true,
              title: "合并",
              icon:
                "path://M958.860775 371.564637l-163.624795 93.499883-29.705692-17.04425V311.666275a36.523392 36.523392 0 0 0-18.018206-31.166627L633.072121 213.783586v-30.679649l163.137816-93.986861 163.137816 93.986861z m-243.489278 48.697856l-82.299376-48.697856v-97.395711l80.83844 48.697856z m0 125.640467l-25.809863 14.609357-150.963352-87.65614a36.523392 36.523392 0 0 0-36.036413 0l-149.502417 85.708225-25.809863-14.609356v-31.166628l146.093566-83.273333a36.523392 36.523392 0 0 0 18.018207-31.166627V227.418985l29.705692-17.044249 29.705692 17.044249v170.929473a36.523392 36.523392 0 0 0 18.018206 31.166627l146.093567 83.273333z m-277.577776 61.846276l84.734268-48.697855 84.734269 48.697855-84.734269 48.697856z m247.872084 45.289006v188.460701l-163.137816 93.986861-165.08573-95.934775v-188.460701l25.809864-14.609357 119.309746 68.663976a36.523392 36.523392 0 0 0 36.036413 0l119.309746-68.663976zM408.575008 274.655905v97.395711l-80.838441 48.697855v-97.395711zM243.489277 465.06452L82.299376 371.564637V183.103937L243.489277 89.117076l165.085731 93.986861v31.166627L292.187133 280.499648a36.523392 36.523392 0 0 0-18.018207 31.166627v136.353995z m779.165688-340.884989L813.254187 4.869786a36.523392 36.523392 0 0 0-34.088499 0l-209.400779 120.283703a36.036413 36.036413 0 0 0-18.018206 31.166627v10.22655l-11.687486-6.8177a36.523392 36.523392 0 0 0-36.036413 0l-11.687485 6.8177v-10.22655a36.523392 36.523392 0 0 0-18.018207-31.166627L263.455398 4.869786a36.523392 36.523392 0 0 0-36.036413 0L18.018207 125.153489a36.036413 36.036413 0 0 0-18.018207 31.166627v243.489278a36.036413 36.036413 0 0 0 18.018207 31.166627l209.400778 120.283703a36.523392 36.523392 0 0 0 36.036413 0l11.687486-6.8177v10.22655A36.523392 36.523392 0 0 0 292.187133 584.374266l7.304678 4.382807-7.304678 4.382807a36.523392 36.523392 0 0 0-18.018207 31.166627v243.489278a36.523392 36.523392 0 0 0 18.018207 31.166627l209.400779 120.283703a36.523392 36.523392 0 0 0 36.036413 0l209.400778-120.283703a36.523392 36.523392 0 0 0 18.018207-31.166627v-243.489278a36.523392 36.523392 0 0 0-18.018207-31.166627l-7.304678-4.382807 7.304678-4.382807a36.523392 36.523392 0 0 0 18.018207-31.166628v-10.226549l11.687485 6.817699a36.523392 36.523392 0 0 0 36.036413 0L1022.654965 429.515085a36.523392 36.523392 0 0 0 18.505185-31.166627v-243.489278a36.036413 36.036413 0 0 0-18.505185-29.705691z",
              // onclick: function (){
              //     this.rawData()
              // }
            },
            magicType: {
              type: ["line", "bar"],
            },
          },
        },
        tooltip: {
          trigger: "axis",
        //     formatter: function (datas, ticket, callback) {
        //              var res = datas[0].name + '<br/>'
        //              console.log(datas)
        //       for (var i = 0, length = datas.length; i < length; i++) {
        //           res += datas[i].seriesName + '：'  + datas[i].value.toFixed(4) + '<br/>'
        //           }
        //       return res
        //   }
        },
        dataZoom: [
          //             {            type:"inside",
          //     disabled: true
          // },
          {
            zoomOnMouseWheel: false,
            type: "slider",
            rangeMode: ["value", "percent"],
            throttle: 300,
            show: true,
            realtime: true,
            end: 100,
          },
        ],
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: [
          {
            type: "value",
            min: 0.5,
          },
          {
            type: "value",
          },
        ],
        color: [
          "#588dd5",
          "#f5994e",
          "#c05050",
          "#59678c",
          "#97b552",
          "#95706d",
          "#dc69aa",
          "#07a2a4",
          "#9a7fd1",
          "#c9ab00",
          "#7eb00a",
          "#6f5553",
          "#2ec7c9",
          "#b6a2de",
          "#5ab1ef",
          "#ffb980",
          "#d87a80",
          "#8d98b3",
          "#e5cf0d",
          "#c14089",
        ],
        series: [],
      },
      normalOption: {
        tooltip: {
          trigger: "item",
        },
        series: [],
      },
    };
  },
  //   //series: [{
  //         data: [820, 932, 901, 934, 1290, 1330, 1320],
  //         type: 'line',
  //         smooth: true
  //     }]
  methods: {
    //   close() {
    //   this.$emit('close')
    // },
        downPDF(exportRef){
          this.$tools.downloadPdf(this.$refs[exportRef],"业绩走势.pdf")
        },
    changeDate(vday){
         var arr = this.echart.getModel().option.xAxis[0].data;
          var sidx = this.getstart(vday);
          var datasize = arr.length;
          this.divideBy(sidx, { start: arr[sidx], end: 100 });
          this.refreshData({ startValue: sidx, end: 100 });

    },
    changeEndDate(vday){
        this.enddate=vday
      if(this.raw_data.date.indexOf(vday)>0){
      }else{
          for(var day of this.raw_data.date){
              if(day>vday){
                  this.enddate=day
                  break
              }
          }
      }
      var option = this.echart.getOption();
      delete option.dataZoom[0].end ;
      option.dataZoom[0].endValue = this.enddate;
      option.series = this.chartData.series;
      this.echart.setOption(option, true);
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth;
      if (this.screenWidth < 991) {
        return "90%";
      } else if (this.screenWidth < 1400) {
        return "45%";
      } else {
        return "800px";
      }
    },
    getLastIndex(data) {
      for (var idx in data) {
        if (data[idx]) return idx;
      }
      return 0;
    },
    getChart(code) {
        console.log("############")
        console.log(code)
        if(!code){
            return
        }
        if(this.$isElectron){
                 var codes=code.split(",")
                 console.log(codes)
        var rst={"combine_date":[null],"buy_date":["19000101"]}
        let datadf=new df.DataFrame()
        for (var acode of codes ){
               if(acode.length<2){
          continue
        }
        const istmt =DB.prepare('SELECT * FROM fund_info where code=?')
        var info=istmt.get(acode)
        // rst.columns=[info['name']]
        const stmt = DB.prepare('SELECT * FROM fund_val where code=?');
        const dbval=stmt.all(acode)
        if(dbval.length<2){
          continue
        }
         let ndf=new df.DataFrame(dbval)
        //  ndf.set_index({column: "date", drop: true, inplace: true})
         ndf.rename({ mapper: {"sumval": info["short_name"]},inplace: true })
         ndf.drop({ columns: ["code"], inplace: true })
        //  console.log(info)
        //  ndf.print()
        //  datadf.print()
        //  console.log(datadf.axis.columns)
        // console.log(ndf['date'].values)
         if(datadf.axis.columns.length>0){
         datadf = df.merge({ left:datadf, right:ndf, on: ["date"] ,how:"outer"})
         }
         else{
           datadf=ndf
         }
        }
        // datadf.print()
        datadf.set_index({column: "date", drop: true, inplace: true})
        datadf.sort_index()
        rst['date']=datadf.index
        rst.columns=datadf.axis.columns
        for(var col of datadf.axis.columns){
          // console.log(col)
          // datadf.print()
          // console.log(datadf[col])
          rst[col]=datadf.column(col).values
        }
        console.log(rst)
          this.raw_data=rst
          this.chartData.xData = [];
          this.chartData.series = [];
          this.chartData.xData = rst["date"];
          var len = this.chartData.xData.length;
          this.max_date = this.chartData.xData[len - 1];
          this.initChart();
        }
        else{

      
      var charturl = "";
      var $this = this;
      var data = this.filter;
      if (data) {
        charturl = "/fof/hiscompare";
        console.log("get compare url:");
        if (this.code) {
          data["code"] = this.code;
        }
      } else if (code && code.length > 2) {
        charturl = "/fof/hisdata";
        data = { code: code ,w:this.wts};
      }
      axis
        .get(charturl, { params: data }) //axis后面的.get可以省略；
        .then((response) => {
            console.log(response)
          $this.raw_data=response.data
          $this.chartData.xData = [];
          $this.chartData.series = [];
          $this.chartData.xData = response.data["date"];
          var len = $this.chartData.xData.length;
          if (len) {
            $this.max_date = $this.chartData.xData[len - 1];
          }
          this.initChart();
        })
        .catch((error) => {
          console.log(error);
        });  }
    },
    getDividedData(cname,oneindex){
        var oneval = this.raw_data[cname][oneindex];
        var startindx = oneindex;
        var min = 0;

        while (!oneval && startindx < this.raw_data[cname].length) {
          oneval = this.raw_data[cname][startindx];
          startindx++
        }
var sdata = [...this.raw_data[cname]];


        for (var i = 0; i < this.raw_data[cname].length; i++) {
          if(this.raw_data[cname][i]==null){
            sdata[i]=null
            continue
          }
          sdata[i] = (this.raw_data[cname][i] / oneval).toFixed(4);

          min = sdata[i] > min ? min : sdata[i];
        }

        // console.log(cname)
        // console.log(sdata.slice(oneindex))
        return sdata
    },
    divideBy(oneindex, params) {
      console.log("re draw chart by 1 at idx:" + oneindex);
      this.startidx = oneindex;
      this.chartData.xData = [];
      this.chartData.series = [];
      this.chartData.xData = this.raw_data["date"];
      this.startdate=this.chartData.xData[oneindex]

      var zz500data=[]
      if(this.raw_data['中证500指数'])
      zz500data=this.getDividedData('中证500指数',oneindex)
      for (var idx in this.raw_data["columns"]) {
        var cname = this.raw_data["columns"][idx];
       
        if(cname.endsWith("_超额")){
        // this.chartData.series.push({
        //   data: this.raw_data[cname],
        //   type: "line",
        //   areaStyle: {},
        //   name: cname,
        //   smooth: true,
        //   yAxisIndex:1
        // });
        }else{
        var sdata=this.getDividedData(cname,oneindex)
        var sidx= this.raw_data.date.indexOf(this.startdate);
        var eidx= this.raw_data.date.indexOf(this.enddate)
        var high=1
        var hidx=sidx
        var midx=sidx
        var mhidx=sidx
        var maxdrop=0
        for(var s=sidx;s<eidx;s++){
            if(sdata[s]>high){
                high=sdata[s]
                hidx=s
            }
            var ndrop=sdata[s]/high-1
            if(ndrop<maxdrop){
                maxdrop=ndrop
                midx=s
                mhidx=hidx
            }
        }
        if(this.raw_data[cname+'_超额']){
            var result=[]
            var lastval=null
            for (var i in sdata){
                if(sdata[i]>0){
                    lastval=(sdata[i]-zz500data[i]).toFixed(4)
                }
                result.push(lastval)
            }
          this.chartData.series.push({
          data: result,
          type: "line",
          connectNulls:true,
        //   areaStyle:{},
          name: cname+'_超额',
        //   smooth: true,
          yAxisIndex:1
        })
        this.axisOption.legend[0].selected[cname] = false;
        this.axisOption.legend[0].selected["中证500指数"] = false;
        this.axisOption.legend[0].selected["沪深300指数"] = false;
        this.axisOption.legend[0].selected["中证1000指数"] = false;


        }
        var   mp = {
              symbol: "circle",
              symbolSize: 20,
              label: {
                formatter: function (param) {
                  return param.data.name;
                },
              },
              data: [],
            }
        if(this.collen<5){
            if(cname=="华道多策略FOF"  && this.cb){
                var param={"name":cname,"lrate":maxdrop,"start":this.raw_data.date[mhidx],"end":this.raw_data.date[midx]}
                clearTimeout(this.tur)
                console.log("撤销事件"+this.tur)
                this.tur=setTimeout((x)=>{
                Bus.$emit(this.cb,x)
                console.log("emit"+this.cb+" end")
                console.log("执行 tur:"+this.tur)
                },1200,param);
            }
            mp.data.push({
                  name: "回",
                  coord: [this.raw_data.date[mhidx], sdata[mhidx]],
                }
                )
            mp.data.push({
                  name: "低",
                  coord: [this.raw_data.date[midx], sdata[midx]],
                })
        }

        var cdate = this.raw_data.combine_date[idx];

        var bdate = this.raw_data.buy_date[idx];
         var cidx=0
        if (bdate) {
           cidx = this.raw_data.date.indexOf(bdate);
           mp.data.push({
                  name: "购",
                  coord: [bdate, sdata[cidx]],
                })
        }else if (cdate) {
          var didx = this.raw_data.date.indexOf(cdate);
          if (didx > 0 && didx !=cidx)
           mp.data.push({
                  name: "拼",
                  coord: [cdate, sdata[didx]],
                })
        }
        var asery={
          data: sdata,
          type: "line",
          name: cname,
          connectNulls: true,
          yAxisIndex:0,
          markLine: {
             symbol:"none",           //去掉警戒线最后面的箭头
          silent: true,
          lineStyle: {
            color: '#333'
          },
          data: [
            {
              yAxis: 1
            },
           
          ]
        },
          markPoint: mp,
        }
        if(this.token=="demo"){
                asery.name=this.raw_data["mcodes"][idx]
        }
        if(cname=='虚拟组合'){
            asery.itemStyle={
                normal:{
                    lineStyle:{
                        width:2,
                        type:'dotted'  //'dotted'虚线 'solid'实线
                    }
                }
            }
        }
        this.chartData.series.push(asery);
        // this.axisOption.yAxis.min = min;
      }}
      this.axisOption.dataZoom[0].startValue = oneindex;

      // this.refreshData(params)
    },
    start_init() {
      var lastIdx = 0;
      for (var sidx in this.chartData.series) {
        // console.log(this.chartData.series[sidx])
        var max = parseInt(this.getLastIndex(this.chartData.series[sidx].data));
        if (max > lastIdx) lastIdx = max;
      }
      // console.log(typeof(lastIdx))
      lastIdx = lastIdx;
      // var rate=(lastIdx*100)/this.chartData.series[0].data.length
      var dlen=this.raw_data.date.length
      this.enddate=this.raw_data.date[dlen-1]
      if(this.dstartdate){
          lastIdx=this.getstart(this.dstartdate)
      this.divideBy(lastIdx, { endValue: this.enddate, startValue: lastIdx });
      }
      else
      {
      this.divideBy(lastIdx, { endValue: this.enddate, startValue: lastIdx });
      }
      this.initChartData();
      console.log(this.options);
    },

    initChart() {
      // if (this.raw_data.columns.indexOf("沪深300指数") > 0) {
      //   this.axisOption.yAxis[0]["min"] = 0.7;
      // }
      console.log(this.raw_data);
      this.start_init();
      var $this = this;
      if (this.echart) {
        this.echart.setOption(this.options, true);
      } else {
        this.echart = echarts.init(this.$refs.echart);
        this.axisOption.toolbox.feature.myTool1.onclick = () => {
          console.log("rawData click");
          $this.divideBy(0, { startValue: 0, end: 100 });
          $this.refreshData({ startValue: 0, end: 100 });
        };
        this.axisOption.toolbox.feature.myday7.onclick = () => {
          var arr = $this.echart.getModel().option.xAxis[0].data;
          var vday = $this
            .$moment($this.max_date)
            .add(-7, "d")
            .format("YYYYMMDD");
          var sidx = $this.getstart(vday);
          var datasize = arr.length;

          $this.divideBy(sidx, { start: arr[sidx], end: 100 });
          $this.refreshData({ startValue: sidx, end: 100 });
        };
        this.axisOption.toolbox.feature.myday30.onclick = () => {
          var vday = $this
            .$moment($this.max_date)
            .add(-30, "d")
            .format("YYYYMMDD");
          var sidx = $this.getstart(vday);
          var datasize = $this.echart.getModel().option.xAxis[0].data.length;

          $this.divideBy(sidx, { start: (sidx * 100) / datasize, end: 100 });
          $this.refreshData({ startValue: sidx, end: 100 });
        };
        this.axisOption.toolbox.feature.myday90.onclick = () => {
          var vday = $this
            .$moment($this.max_date)
            .add(-90, "d")
            .format("YYYYMMDD");
          var sidx = $this.getstart(vday);
          var datasize = $this.echart.getModel().option.xAxis[0].data.length;
          $this.divideBy(sidx, { start: (sidx * 100) / datasize, end: 100 });
          $this.refreshData({ startValue: sidx, end: 100 });
        };
        this.axisOption.toolbox.feature.myday180.onclick = () => {
          var vday = $this
            .$moment($this.max_date)
            .add(-180, "d")
            .format("YYYYMMDD");
          var sidx = $this.getstart(vday);
          var datasize = $this.echart.getModel().option.xAxis[0].data.length;
          $this.divideBy(sidx, { start: (sidx * 100) / datasize, end: 100 });
          $this.refreshData({ startValue: sidx, end: 100 });
        };
        this.axisOption.toolbox.feature.mydayyear.onclick = () => {
          var vday = $this
            .$moment($this.max_date)
            .add(-1, "y")
            .format("YYYYMMDD");
          var sidx = $this.getstart(vday);
          var datasize = $this.echart.getModel().option.xAxis[0].data.length;
          $this.divideBy(sidx, { start: (sidx * 100) / datasize, end: 100 });
          $this.refreshData({ startValue: sidx, end: 100 });
        };
        this.axisOption.toolbox.feature.mythisyear.onclick = () => {
          console.log($this.max_date);
          var vday = $this
            .$moment($this.max_date)
            .dayOfYear(1)
            .format("YYYYMMDD");
          var sidx = $this.getstart(vday);
          var datasize = $this.echart.getModel().option.xAxis[0].data.length;
          $this.divideBy(sidx, { start: (sidx * 100) / datasize, end: 100 });
          $this.refreshData({ startValue: sidx, end: 100 });
        };
        this.axisOption.toolbox.feature.mycombine.onclick = () => {
          console.log($this.echart.getModel().option)
          var validx=[]
          var seled=$this.echart.getModel().option.legend[0].selected
          console.log(seled)
          for (var sr of $this.echart.getModel().option.series){
            if(sr.name=="虚拟组合"){
              continue
            }
              if ( seled[sr.name]==false){
              }else{
                validx.push(sr.name)
              }
          }
          this.combineGroup(validx)
          
        };
        this.echart.setOption(this.options,true);
        var tur=-1

        var send=(x,y)=>{
            $this.divideBy(x, y);
            $this.refreshData(y);
            tur = -1; 
          }
        this.echart.on("datazoom", function (params) {
          var datasize = $this.echart.getModel().option.xAxis[0].data.length;
          var startidx = Math.round((datasize * params.start) / 100);
          $this.divideBy(startidx, params);
          $this.refreshData(params);
        });
      }
      this.echart.on("click", function (params) {
        var option = $this.echart.getOption();
        option.legend[0].selected[params.seriesName] = false;
        console.log(params)
        $this.echart.setOption(option);
        // this.$emit("lineClick",params)
      });
    //  this.echart.on("legendselectchanged", function (params) {
    //     var option = $this.echart.getOption();
    //     let basename=params.name
    //     if(params.name.endsWith("_超额")){
    //         basename=params.name.split("_超额")[0]
    //         option.legend[0].selected[basename] = params.selected[params.name];
    //     }else if($this.raw_data[basename+"_超额"]){
    //         option.legend[0].selected[basename+"_超额"] = params.selected[basename];
    //     }
    //     $this.echart.setOption(option);
     //   });
    //   if(this.dstartdate){
    //   this.changeDate(this.dstartdate)
    //   }
    if(this.raw_data['wts']){
        var cols=this.raw_data["columns"].filter(cn=>!(cn.endsWith('指数')||cn.endsWith('_超额')))
        this.combineGroup(cols,this.raw_data['wts'])
    }
    },
    combineGroup(validx,wts){
        var cnt=validx.length
          var dlen=this.raw_data["date"].length
          if(cnt<1){
          return
          }
          var indx=0 
          for(var vn of validx){
               for(var i=indx;i<dlen;i++){
                if(this.raw_data[vn][i]){
                  indx=i>indx?i:indx
                  break
                }
              }
            }
          if(indx==dlen){
            return
          }
          this.raw_data['虚拟组合']=Array.apply(null, Array(dlen)).map(function (x, i) { return null; })
          var cols=['虚拟组合']
          this.raw_data["columns"].forEach(element => {
            if(element!='虚拟组合'){
              cols.push(element)
            }
          });
          this.raw_data["columns"]=cols
          if(!wts){
              wts=Array.apply(null, Array(len(validx))).map(function (x, i) { return 1; })
          }
          var wsum=0
          for (var i in wts){
              wsum=wsum+wts[i]
          }
          var wdict={}
          var lval={}
          for(var ivn in validx){
            var  cval=-1
             for(var j=indx;j<dlen;j++){
                 cval=this.raw_data[validx[ivn]][j]
                 if(cval)
                 break
             }
            wdict[validx[ivn]]=wts[ivn]/wsum/cval
          }
         console.log(wts)
         console.log(wsum)
          console.log(wdict)
          for(var j=indx;j<dlen;j++){
            var sval=0
            for(var vn of validx){
                var  cval=this.raw_data[vn][j]
                if(cval){
                  lval[vn]=cval
                }
                else{
                  cval=lval[vn]
                }
                sval+=cval*wdict[vn]
            }
            this.raw_data['虚拟组合'][j]=sval
          }
          this.changeDate(this.raw_data["date"][indx])
    },
    refreshData(params) {
      var option = this.echart.getOption();
      option.dataZoom[0].startValue = params.startValue;
      option.dataZoom[0].end = params.end;
      option.series = this.chartData.series;
      this.echart.setOption(option, true);
    },
    getstart(vady) {
      var arr = this.raw_data.date;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] >= vady && i > 0) return i;
      }
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData;
        this.axisOption.series = this.chartData.series;
      } else {
        this.normalOption.series = this.chartData.series;
      }
    },
    resizeChart() {
      this.echart ? this.echart.resize() : "";
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
    this.getChart(this.code);
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>

<style lang="scss" scoped></style>
