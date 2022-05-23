<template>
<div ref="echartdiv">
      <!-- <rank-table       ref="ranktable"  :titles="compare"  style="height: 800px"  :code="code"  ></rank-table> -->
            <vxe-radio-group v-model="range" :strict="false">
            <vxe-radio label="hyr" content="半年"></vxe-radio>
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio label="2yr" content="2年"></vxe-radio>
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
    rg: {
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
    range:{
      handler: function (val) {
        if (val) {
          this.getChartData()
        }
      },
    },
    code: {
      handler: function (val) {
        if (val) {
          if(this.rg){
            this.range=this.rg
          }
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
          align :"right",
          orient: "vertical",
          top: "middle",
          right: 0,
        }],
              brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          colorAlpha: 0.1
        }
      },
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
  yAxis: {
    type: 'value',
    inverse: true,
    axisLabel: {
      formatter: '{value} %'
    },
    max:100
  },
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
      let that=this
      this.$axios
        .get("/fof/hisrank", { params: { "code": this.code ,"range":this.range} }) //axis后面的.get可以省略；
        .then((response) => {
          let option = that.echart.getOption();
          option.xAxis[0].data=response.data.index
          option.markLine=markLine
          option.series=[]
          for (let col in response.data.columns){
            let cnames=response.data.columns[col].split('_')
            let sname=""
            if(cnames.length==2){
              sname=this.showFundName(cnames[0])+"_"+cnames[1]
            }
            let rval=response.data.data.map(row=>{if(row[col]==null){return null} return row[col]*100})
            let asery={
          yAxisIndex:0,
          type: 'line',
          name: sname,
          data: rval,
          markLine:markLine
        }
        // if(col==0){
        //   asery['markLine']=markLine
        // }
        
            option.series.push(asery)
 
            
          }

          console.log(option)
          that.echart.setOption(option, true);
          let dlen=option.xAxis[0].data.length
          let yrago=this.$moment(option.xAxis[0].data[dlen-1]).add(-1,"y").format("YYYYMMDD")
          let yrago2=this.$moment(option.xAxis[0].data[dlen-1]).add(-2,"y").format("YYYYMMDD")

          let sidx=0;
          let sidx2=0;

          for (let ad in option.xAxis[0].data){
            if(option.xAxis[0].data[ad]>=yrago2 && sidx2==0 ){
              sidx2=ad-1
            }
           if(option.xAxis[0].data[ad]>=yrago && sidx==0){
              sidx=ad-1
              break
            }
          }
     that.echart.dispatchAction({
    type: 'brush',
    areas: [
      {
        brushType: 'lineX',
        coordRange: [option.xAxis[0].data[sidx], option.xAxis[0].data[dlen-1]],
        xAxisIndex: 0
      },
      {
        brushType: 'lineX',
        coordRange: [option.xAxis[0].data[sidx2], option.xAxis[0].data[dlen-1]],
        xAxisIndex: 0
      },
    ]
  });

        })
        .catch((error) => {
          console.log(error);
        });
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
           if(this.rg){
             this.range=this.rg
           }
           this.getChartData()
     })
  
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>

<style lang="scss" scoped></style>
