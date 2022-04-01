<template>
<div ref="echartdiv">
      <!-- <rank-table       ref="ranktable"  :titles="compare"  style="height: 800px"  :code="code"  ></rank-table> -->
  <div style="height: 100%" ref="echart">
    <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
    基金构成图
  </div>
</div>
</template>
 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import axis from "axios";
import Bus from '@/store/bus.js';
import {mapGetters} from 'vuex'
import '@/utils/infographic.js'

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
    total:{
      type:Number,
      default:0
    },
    finalData: {
      type: Array,
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
      ...mapGetters(['sysparam','token','showFundName','showFundClassType']),

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
    links:{get() {
      let nlinks=[]
      let ctype={}

      this.finalData.forEach(element => {
        let cls=this.showFundClassType(element['b_code'])
        if(cls!='FOF'){
            let ckey=element['code']+"_"+cls
            if(ctype[ckey]){
            ctype[ckey]+=element['marketval']
            }else{
            ctype[ckey]=element['marketval']
            }
        }else{
        nlinks.push({source: this.showFundName(element.code), target: this.showFundName(element.b_code), value: Math.floor(element['marketval']/10000)})  
        }

      })
      // for(var afof  of this.sysparam.FOF){
          for(var key in ctype){
            let cds=key.split("_")
          nlinks.push({source: this.showFundName(cds[0]), target: this.showFundName(cds[1]), value: Math.floor(ctype[key]/10000)})  

          // }
      }

      // this.finalData.forEach(element => {
      //   nlinks.push({source: element.code, target: element.b_code, value: Math.floor(element['marketval']/10000)})
      // });
      console.log(nlinks)
      return nlinks
    }},
    nodes:{get() {
      // return [...new Set(this.finalData.map(arow=>arow['b_code'])),...this.lv1,...this.sysparam.class_type.map(row=>row['name'])].map(arow=>{return {'name': arow}})
      return[...this.sysparam.FOF.map(row=>row['code']),...this.sysparam.class_type.filter(row=>row['code']!='主观'&&row['code']!='FOF').map(row=>row['code'])].map(arow=>{return {'name': this.showFundName(arow)}})
      // for(let arow of this.finalData){

      // }
    }},
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
  },
  watch: {
    isVisible: {
      handler: function (val) {
        if (val) {
          this.getChart(this.code);
        }
      },
    },
    finalData: {
      handler: function (val) {
        if (val) {
          this.initChart("")
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
      lv1:["SY9620","SSS105"],
      lowest:0.9,
      startdate:'',
      range:'',
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
      title: {
        text: '投资一览图'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          data: [],
          orient: 'vertical',
          label: {
            position: 'top'
          },
          links: [],
          emphasis: {
            focus: 'adjacency'
          },
          //           levels: [
          //   {
          //     depth: 0,
          //     itemStyle: {
          //       color: '#fbb4ae'
          //     },
          //     lineStyle: {
          //       color: 'source',
          //       opacity: 0.6
          //     }
          //   },
          //   {
          //     depth: 1,
          //     itemStyle: {
          //       color: '#b3cde3'
          //     },
          //     lineStyle: {
          //       color: 'source',
          //       opacity: 0.6
          //     }
          //   },
          //   {
          //     depth: 2,
          //     itemStyle: {
          //       color: '#ccebc5'
          //     },
          //     lineStyle: {
          //       color: 'source',
          //       opacity: 0.6
          //     }
          //   },
          //   {
          //     depth: 3,
          //     itemStyle: {
          //       color: '#decbe4'
          //     },
          //     lineStyle: {
          //       color: 'source',
          //       opacity: 0.6
          //     }
          //   }
          // ],
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          }
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
        this.axisOption.series[0].data=this.nodes
        this.axisOption.series[0].links=this.links
        console.log(this.axisOption)
      if (this.echart) {
        this.echart.setOption(this.axisOption, true);
      } else {
        this.echart = echarts.init(this.$refs.echart,'infographic');
        this.echart.setOption(this.axisOption,true);
      }
    },
    refreshData(params) {
      var option = this.echart.getOption();
      option.dataZoom[0].startValue = params.startValue;
      option.dataZoom[0].end = params.end;
      option.series = this.chartData.series;
      option.yAxis[0].min=this.lowest
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
    resizeChart() {
      this.echart ? this.echart.resize() : "";
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
     this.$nextTick(() => { 
    this.initChart("");

     })
  
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>

<style lang="scss" scoped></style>
