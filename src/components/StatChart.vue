<template>
<div ref="echartdiv">
      <!-- <rank-table       ref="ranktable"  :titles="compare"  style="height: 800px"  :code="code"  ></rank-table> -->
          <vxe-radio-group v-model="range" :strict="false">
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio label="2yr" content="2年"></vxe-radio>
            <vxe-radio label="3yr" content="3年"></vxe-radio>

          </vxe-radio-group>

           <vxe-radio-group v-model="showkey" :strict="false">
            <vxe-radio-button :key="vkey.name" v-for="vkey of keygrps" :label="vkey.name" :content="vkey.name"></vxe-radio-button>
            </vxe-radio-group>

            <vxe-radio-group v-model="tag" :strict="false">
            <vxe-radio-button :key="vkey" v-for="(vkey,i) in tags" :label="i" :content="vkey"></vxe-radio-button>
                     </vxe-radio-group>
  <div style="height: 100%" ref="echart">
    <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
  </div>
</div>
</template>
 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import Bus from '@/store/bus.js';
import {mapGetters} from 'vuex'
import { indexOf } from 'xe-utils';
// import '@/utils/infographic.js'

var echarts = require("echarts");
// 引入柱状图
// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
  props: {
    visable: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
    rg: {
      type: String,
      default: "",
    },
  },
  computed: {
      ...mapGetters(['sysparam','token','showFundName','showFundClassType']),

      collen:{get() {
          return this.rawdata["columns"].length
      }},
    isVisible: {
      get() {
        return this.visable;
      },
      set() {
        this.close();
      },
    },
    columns:{get() {
      return []
    }},
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
  },
  watch: {
    range:{
      handler: function (val) {
        if (val) {
          this.getChartData()
        }
      },
    },
    tag: {
      handler: function (rg) {
        var vday='20000101'
        if(this.rawdata["index"]){
      
        switch (rg) {
            // case 0:
            //   vday= this.aligndate;
            //   break
            case 0:
              vday = this.$moment(this.max_date).add(-30, "d").format("YYYYMMDD");
              break
            case 1:
              vday = this.$moment(this.max_date).add(-90, "d").format("YYYYMMDD");
              break
            case 2:
              vday = this.$moment(this.max_date).add(-180, "d").format("YYYYMMDD");
              break
            case 3:
              vday = this.$moment(this.max_date).add(-1, "y").format("YYYYMMDD");
              break
            case 4:
              vday = this.$moment(this.max_date).add(-2, "y").format("YYYYMMDD");
              break
            case 5:
              vday = this.$moment(this.max_date).add(-3, "y").format("YYYYMMDD");
              break
            case 6:
              vday = this.$moment(this.max_date).dayOfYear(1).format("YYYYMMDD")
              break
            case 7:
              vday= this.rawdata["index"][0];
              break
            default:
              vday="20000101"
              break
        }}
        this.changeDate(vday)
        console.log(vday)
      },
    },
    showkey:{
      handler: function (val) {
        // if (val&&val.endsWith('_R')) {
        //   this.drawChart(this.rawdata_R,true)
        // }else{
          console.log(val)
          this.showcols=this.keygrps.filter(r=>r.name==val)[0].cols
          console.log(this.showcols)
          this.drawChart(this.rawdata)

        // }
      },
    },
    visable:{
      handler: function (val) {
        console.log(val)
        if (val) {
        this.resizeChart();
        }
      },
    },
    code: {
      handler: function (val) {
        if (val) {
          // if(this.rg){
          //   this.range=this.rg
          // }
          this.getChartData()
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
      tag:"",
      
      colitems:{'yeaily_return':'中位收益',
  'yr':'移动年均收益',
  'profit':'年化收益',
  'vola':'移动年化波动率',
  'risk':'年化波动率',
  'nowdrop':'回撤',
  'max_dd':'最大回撤',
  'adj_risk':'理论回撤',
  'calm':'calmar',
  'adj_calmar':'理论calmar'},
      tags:["月","90天","半年","近1年","近2年","近3年","本年","全部"],
      areas:null,
      lv1:["SY9620","SSS105"],
      lowest:0.9,
      // keygrps:[{name:"收益",cols:['yr','yeaily_return','yeaily_return']},{name:"波动",cols:["vola","risk"]},{name:"风险",cols:["nowdrop","adj_risk"]},{name:"收益风险比",cols=["calm","adj_calmar"]}, {name:"收益波动",cols=["yr","std"]}],
      keygrps:[{name:"收益",cols:['yr','yeaily_return','yeaily_return']},{name:"波动",cols:["vola","risk"]},{name:"风险",cols:["nowdrop","adj_risk"]},{name:"收益风险比",cols:["calm","adj_calmar"]}, {name:"收益波动",cols:["yr","vola"]}],
      showkey:"收益",
      showcols:['yr','yeaily_return','profit'],
      startdate:'',
      range:'1yr',
      showdrop:false,
      startidx: 0,
      max_date: "",
      //   width: this.initWidth(),
      echart: null,
      chartData: {
        type: Object,
        default() {
          return {
            xData: [],
            series:  [],
          };
        },
      },
      axisOption:  {
          legend: [{
          //option.legend[0].selected[basename+"_超额"] = params.selected[basename];
          selected:{},
          type: "scroll",
          align :"left",
          orient: "horizontal",
          top: 0,
        }],
      //         brush: {
      //   xAxisIndex: 'all',
      //   brushLink: 'all',
      //   outOfBrush: {
      //     colorAlpha: 0.1
      //   }
      // },
      // title: {
      //   text: '基金排名图'
      // },
       tooltip: {
          trigger: "axis",
          valueFormatter: (value) => {if(value!=null){return value.toFixed(2)}else{ return ""}}

        //     formatter: function (datas, ticket, callback) {
        //              var res = datas[0].name + '<br/>'
        //              console.log(datas)
        //       for (var i = 0, length = datas.length; i < length; i++) {
        //           res += datas[i].seriesName + '：'  + datas[i].value.toFixed(4) + '<br/>'
        //           }
        //       return res
        //   }
        },
      xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  dataZoom: [{type:"inside"}],

         yAxis: [
          {
            type: "value",
            min: "-0.2",
          },
          {
            type: "value",
          },
        ],
      series: [
        {
          type: 'line',
          data: [],
        }
      ]
    },
    };
  },
  //   //series: [{
  //         data: [820, 932, 901, 934, 1290, 1330, 1320],
  //         type: 'line',
  //         smooth: true
  //     }]
  methods: {
        // chgRange(vday){
        //   // var vday = this
        //   //   .$moment(this.max_date)
        //   //   .add(-30, "d")
        //   //   .format("YYYYMMDD");
        //   var sidx = this.getstart(vday);
        //   var datasize = this.echart.getModel().option.xAxis[0].data.length;
        //   this.divideBy(sidx, { start: (sidx * 100) / datasize, end: 100 });
        //   this.refreshData({ startValue: sidx, end: 100 });
        // },
    //   close() {
    //   this.$emit('close')
    // },
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

    },
    initChart() {
      // if (this.raw_data.columns.indexOf("沪深300指数") > 0) {
      //   this.axisOption.yAxis[0]["min"] = 0.7;
      // }
      var $this = this;
        console.log(this.axisOption)
      if (this.echart) {
        this.echart.setOption(this.axisOption, true);
      } else {
        this.echart = echarts.init(this.$refs.echart,'infographic');
        this.echart.setOption(this.axisOption,true);
        // this.echart.on("brushSelected",(params)=>{
        //   this.areas=params.batch[0].areas
        // })
      }
    },
    refreshData(params) {
      var option = this.echart.getOption();
      option.dataZoom[0].startValue = params.startValue;
      option.dataZoom[0].end = params.end;
      this.echart.setOption(option, true);
    },
    
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData;
        this.axisOption.series = this.chartData.series;
      } else {
        this.normalOption.series = this.chartData.series;
      }
    },
    drawChart(rawdata,rank=false){
            let markLine={
             symbol:"none",           //去掉警戒线最后面的箭头
          silent: true,
          lineStyle: {
            color:'#000',
            type:'solid',
            width:2

          },
          data: [
            {
              yAxis: 30
            },
           
          ]
        }
          let option = this.echart.getOption();
          let rate=1
          // if(this.showkey.endsWith("_R")){
          // option.yAxis[1]={
          // type: 'value',
          // inverse: true,
          // axisLabel: {
          //   formatter: '{value} %'
          //   },
          // max:100,
          // min:0
          // }                
          // }else{
             option.yAxis[1]=
          {
            type: "value",
          }
          // }
          option.xAxis[0].data=rawdata.index
          // option.markLine=markLine
          option.series=[]
          for (let col in rawdata.columns){
            let cnames=rawdata.columns[col].split('#')
            console.log(cnames)
            let sname=""
            if(cnames.length==2){
              sname=this.showFundName(cnames[0])+"_"+this.colitems[cnames[1]]
            
              if(this.showcols.indexOf(cnames[1])>-1){
              // if(this.showkey=='dd_week_R'){
              //   rate=-100
              // }else 
             
            }else{
              continue
            }
            }
    
            let yidx=0
            console.log(col)
            let rval=rawdata.data.map(row=>{if(row[col]==null){return null} return row[col]*rate})
            console.log(rval)
            let asery={
          yAxisIndex:yidx,
          type: 'line',
          name: sname,
          data: rval,
          markLine:markLine
        }

        
            option.series.push(asery)
 
            
          }
          console.log(option)
          this.echart.setOption(option, true);
    //       if (this.areas){
    //         console.log(this.areas)
    //       }else{
    //       let dlen=option.xAxis[0].data.length
    //       let yrago=this.$moment(option.xAxis[0].data[dlen-1]).add(-7,"d").format("YYYYMMDD")

    //       let sidx=0;

    //       for (let ad in option.xAxis[0].data){
    //        if(option.xAxis[0].data[ad]>=yrago && sidx==0){
    //           sidx=ad-1
    //           break
    //         }
    //       }
    //       this.areas= [
    //   {
    //     brushType: 'lineX',
    //     coordRange: [option.xAxis[0].data[sidx], option.xAxis[0].data[dlen-1]],
    //     xAxisIndex: 0
    //   }
    // ]
    //       }
  //    this.echart.dispatchAction({
  //   type: 'brush',
  //   areas: this.areas
  // })
    },
    changeDate(vday){
          var arr = this.echart.getModel().option.xAxis[0].data;
          var sidx = this.getstart(vday);
    this.echart.dispatchAction({
    type: 'dataZoom',
    // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
    dataZoomIndex: 0,
    // 开始位置的百分比，0 - 100
    // 结束位置的百分比，0 - 100
    end: 100,
    // 开始位置的数值
    startValue: sidx,
    // 结束位置的数值
})


    },
        getstart(vady) {
      var arr = this.rawdata.index;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] >= vady && i > 0) return i;
      }
    },
    getChartData(){

      this.$axios
        .get("/fof/hisstat", { params: { "code": this.code ,"range":this.range} }).then((response) => {
          this.rawdata=response.data
          this.max_date=this.rawdata.index.at(-1)
          this.drawChart(response.data)

        })
// Promise.all([
//       this.$axios
//         .get("/fof/hisbase", { params: { "code": this.code ,"range":this.range} }),
//         this.$axios
//         .get("/fof/hisbaseRank", { params: { "code": this.code ,"range":this.range} }) //axis后面的.get可以省略；
//         ]).then(r=>{
//           let response=r[0]
//           this.rawdata=response.data
//           this.rawdata_R=r[1].data
//           this.drawChart(response.data)}
//         )
    },
    resizeChart() {
            if(this.$refs.echartdiv.clientHeight){

      this.echart ? this.echart.resize() : "";
            }
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
    this.initChart()
     this.$nextTick(() => { 
          //  if(this.rg){
          //    this.range=this.rg
          //  }
           this.getChartData()
     })
  
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>

<style lang="scss" scoped>

</style>
