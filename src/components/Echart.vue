<template>
  <div style="height: 100%" ref="echart">
    echart
  </div>
</template>

<script>
var echarts = require('echarts');
export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  watch: {
    // chartData: {
    //   handler: function() {
    //     this.initChart()
    //   },
    //   deep: true
    // },
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },
  data() {
    return {
      echart: null,
      axisOption: {
        legend: {
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '20%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3'
              }
            }
          }
        ],
        color: [
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#c14089'
        ],
        series: []
      },
      normalOption: {
        tooltip: {
          trigger: 'item'
        },
        series: []
      }
    }
  },
  methods: {
    initChart() {
      this.initChartData()
      console.log("emitchart")
      console.log(this.options)
      if (this.echart) {
        this.echart.setOption(this.options,true)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        if(this.chartData.action){
            for(var aname in this.chartData.action){
                console.log(aname)
                this.echart.on(aname,this.chartData.action[aname])
            }
        }
         
        this.echart.setOption(this.options,true)
      }
    },
    initChartData() {
      if (this.isAxisChart) {
          console.log(this.chartData)
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
        if(this.chartData.legend){
        this.normalOption.legend = this.chartData.legend
        }
        this.normalOption.title = this.chartData.title
      }
    },
    resizeChart() {
      this.echart ? this.echart.resize() : ''
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
