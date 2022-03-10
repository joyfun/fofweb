<template>
<div ref="echartdiv">
      <!-- <rank-table       ref="ranktable"  :titles="compare"  style="height: 800px"  :code="code"  ></rank-table> -->
  <div style="height: 420px" ref="echart">
    <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
    基金排名信息
  </div>
</div>
</template>
 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
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
    code: {
      type: String,
      default: "",
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
    columns:{get() {
      return []
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
    code: {
      handler: function (val) {
        if (val) {
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
          legend: [{
          //option.legend[0].selected[basename+"_超额"] = params.selected[basename];
          selected:{},
          type: "scroll",
          align :"right",
          orient: "vertical",
          top: "middle",
          right: 0,
        }],
      title: {
        text: '基金排名图'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    inverse: true,
    axisLabel: {
      formatter: '{value} %'
    }
  },
      series: [
        {
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
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
    getChartData(){
      let that=this
      this.$axios
        .get("/fof/hisrank", { params: { "code": this.code } }) //axis后面的.get可以省略；
        .then((response) => {
          let option = that.echart.getOption();
          option.xAxis[0].data=response.data.index
          option.series=[]
          for (let col in response.data.columns){
            let cnames=response.data.columns[col].split('_')
            let sname=""
            if(cnames.length==2){
              sname=this.showFundName(cnames[0])+"_"+cnames[1]
            }
            option.series.push({
          type: 'line',
          name: sname,
          data: response.data.data.map(row=>row[col]*100),
        })
          }
          console.log(option)
          that.echart.setOption(option, true);
   

        })
        .catch((error) => {
          console.log(error);
        });
    },
    resizeChart() {
      this.echart ? this.echart.resize() : "";
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
    this.initChart()
     this.$nextTick(() => { 
           this.getChartData()
     })
  
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>

<style lang="scss" scoped></style>
