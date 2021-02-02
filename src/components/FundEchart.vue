<template>


  <div style="height:420px" ref="echart">
      <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->
    基金净值历史
  </div>
</template>

// <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import axis from 'axios'
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
    compares:{
      type: String,
      default: ""
    },
    filter:{
      type: Object,
      default:null
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
  computed: {
    isVisible: {
      get() {
        return this.visable
      },
      set() {
        this.close()
      }
  },
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  watch: {
    code:{
    handler: function(val) {
        if(!this.compares)
                this.getChart(val)
              }
    },
    filter:{
    handler: function(val) {
                console.log("watch filter by")
                this.getChart()
              }
    },
    compares:{
    handler: function(val) {
                this.getChart(val)
              }
    },
    isVisible: {
      handler: function(val) {
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
      max_date:'',
    //   width: this.initWidth(),
      echart: null,
      chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      }
    },
      axisOption: {
        // title: {
        // text: "基金净值对比图"},
        legend: {
          textStyle: {
            color: '#333'
          }
        },
        toolbox: {
        left:'left',
        feature: {
            myTool1: {
                show: true,
                title: '原始值',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },
            myday7: {
                show: true,
                title: '周对比',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },myday30: {
                show: true,
                title: '月对比',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },myday90: {
                show: true,
                title: '90天',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },myday180: {
                show: true,
                title: '半年',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },
            mydayyear: {
                show: true,
                title: '近一年',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },
            mythisyear: {
                show: true,
                title: '本年',
                icon: 'path://M958.976 27.136h-893.44c-36.352 0-65.536 29.696-65.536 65.536V793.6c0 36.352 29.696 65.536 65.536 65.536h893.44c36.352 0 65.536-29.696 65.536-65.536V92.16c0-35.84-29.696-65.024-65.536-65.024z m0 742.4h-0.512c0 12.288-10.24 22.528-22.528 22.528h-845.824c-12.288 0-22.528-10.24-22.528-23.04V116.224c0-12.288 10.24-22.528 22.528-22.528h846.336c12.288 0 22.528 10.24 22.528 22.528v653.312zM880.128 963.584c0 18.432-14.848 33.28-33.28 33.28h-669.184c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h669.184c18.432 0.512 33.28 15.36 33.28 33.28z',
                // onclick: function (){
                //     this.rawData()
                // }
            },
               magicType: {
        type: ["line", "bar"]
      },
        }
    },
        tooltip: {
          trigger: 'axis',
        //   formatter: function (datas, ticket, callback) {
        //            var res = datas[0].name + '<br/>'
        //            console.log(datas)
        //     for (var i = 0, length = datas.length; i < length; i++) {
        //         res += datas[i].seriesName + '：'  + datas[i].value.toFixed(4) + '<br/>'
        //         }
        //     return res
        // }

        },
        dataZoom: [
//             {            type:"inside",
//     disabled: true
// },
        {   zoomOnMouseWheel:false,
            type:"slider",
            rangeMode: ['value', 'percent'],
            throttle :200,
            show: true,
            realtime: true,
            end: 100
        }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        legend: {
        type: 'scroll',
        orient: 'vertical',
        top:'middle',
        right: 0,
           },
        yAxis: [
          {
            type: 'value',
            min: 0.9
          }
        ],
         color: [
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
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
//   //series: [{
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//         type: 'line',
//         smooth: true
//     }]
  methods: {
    //   close() {
    //   this.$emit('close')
    // },
       initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    //   getChart(code){
    //       console.log("emit method getChart")
    //       console.log(code)
    //       if(code){
    //           console.log("refresh chart:"+code)
    //           var chartData=this.chartData
    //           axis.get('/fof/his',{params:{"code":code}})//axis后面的.get可以省略；
    //                     .then(
    //                         (response) => {
    //                             chartData.xData=[]
    //                             chartData.series=[{data:[],type:"line",name: '累计净值',},{name: '当前净值',data:[],type:"line"}]
    //                             for(var idx in response.data.datas){
    //                                 var row=response.data.datas[idx]
    //                                 chartData.xData.push(row[0])
    //                                 chartData.series[0].data.push(row[3])
    //                                 chartData.series[1].data.push(row[2])

    //                             }
    //                             this.initChart()
    //                         })
    //                     .catch(
    //                         (error) => {
    //                             console.log(error);
    //                 });
    //       }

    //   },
    getLastIndex(data){
        for(var idx in data){
            if(data[idx])
            return idx;
        }
        return 0
    },
         getChart(code){
             var charturl=""
             var $this=this
             var data=this.filter
             if(data){
                 charturl='/fof/hiscompare'
                 console.log("get compare url:")
                 if(this.code){
                     data["code"]=this.code
                 }
             }else if(code&&code.length>2){
                    charturl='/fof/hisdata'
                    data={"code":code}
              
          }
          axis.get(charturl,{params:data})//axis后面的.get可以省略；
                        .then(
                            (response) => {
                                $this.raw_data=response.data
                                $this.chartData.xData=[]
                                $this.chartData.series=[]
                                $this.chartData.xData=response.data['date']
                                var len=$this.chartData.xData.length
                                if(len){
                                $this.max_date=$this.chartData.xData[len-1]
                                }
                                for(var idx in response.data["columns"]){
                                    var cname=response.data["columns"][idx]
                                    $this.chartData.series.push({data:response.data[cname].concat(),type:"line",selectedMode:'single',name: cname}) 
                                }
                                this.initChart()
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });

      },

    divideBy(oneindex,params){
        console.log("re draw chart by 1 at idx:"+oneindex)
        this.startidx=oneindex
        this.chartData.xData=[]
        this.chartData.series=[]
        this.chartData.xData=this.raw_data['date']
        var min=0
        for(var idx in this.raw_data["columns"]){
        var cname=this.raw_data["columns"][idx]
        var sdata=[...this.raw_data[cname]]
        var oneval=this.raw_data[cname][oneindex]
        var idx=oneindex
        while(!oneval&&idx<this.raw_data[cname].length){
            oneval=this.raw_data[cname][idx];
            idx++
        }

        for(var i=0;i<this.raw_data[cname].length;i++){
            sdata[i]=(this.raw_data[cname][i]/oneval).toFixed(4)
            min=sdata[i]>min?min:sdata[i]
        }

        // console.log(cname)
        // console.log(sdata.slice(oneindex))
        this.chartData.series.push({data:sdata,type:"line",name: cname})
        this.axisOption.yAxis.min=min
        }
        this.axisOption.dataZoom[0].startValue=oneindex

       // this.refreshData(params) 
    },
    initChart() {
         var lastIdx=0;
        for (var sidx in this.chartData.series){
            // console.log(this.chartData.series[sidx])
            var max=parseInt(this.getLastIndex(this.chartData.series[sidx].data))
            if(max>lastIdx)
            lastIdx=max
        }
        // console.log(typeof(lastIdx))
        lastIdx=lastIdx
        // var rate=(lastIdx*100)/this.chartData.series[0].data.length
        this.divideBy(lastIdx,{end:100,startValue:lastIdx})
      this.initChartData()
      console.log(this.options)
      var $this=this
      if (this.echart) {
        this.echart.setOption(this.options,true)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.axisOption.toolbox.feature.myTool1.onclick = () => {
            console.log("rawData click")
            $this.divideBy(0,{startValue:0,end:100})   
            $this.refreshData({startValue:0,end:100}) 
        }
        this.axisOption.toolbox.feature.myday7.onclick = () => {
            var arr=$this.echart.getModel().option.xAxis[0].data
            var vday=$this.$moment($this.max_date).add(-7,"d").format("YYYYMMDD")
            var sidx=$this.getstart(vday)
            var datasize=arr.length

            $this.divideBy(sidx,{start:arr[sidx],end:100})   
            $this.refreshData({startValue:sidx,end:100}) 
    
        }
        this.axisOption.toolbox.feature.myday30.onclick = () => {
              var vday=$this.$moment($this.max_date).add(-30,"d").format("YYYYMMDD")
            var sidx=$this.getstart(vday)
            var datasize=$this.echart.getModel().option.xAxis[0].data.length

            $this.divideBy(sidx,{start:sidx*100/datasize,end:100})   
            $this.refreshData({startValue:sidx,end:100}) 
    
        }
        this.axisOption.toolbox.feature.myday90.onclick = () => {
             var vday=$this.$moment($this.max_date).add(-90,"d").format("YYYYMMDD")
            var sidx=$this.getstart(vday)
            var datasize=$this.echart.getModel().option.xAxis[0].data.length
            $this.divideBy(sidx,{start:sidx*100/datasize,end:100})   
            $this.refreshData({startValue:sidx,end:100}) 
    
        }
        this.axisOption.toolbox.feature.myday180.onclick = () => {
             var vday=$this.$moment($this.max_date).add(-180,"d").format("YYYYMMDD")
            var sidx=$this.getstart(vday)
            var datasize=$this.echart.getModel().option.xAxis[0].data.length
            $this.divideBy(sidx,{start:sidx*100/datasize,end:100})   
            $this.refreshData({startValue:sidx,end:100}) 
    
        }
        this.axisOption.toolbox.feature.mydayyear.onclick = () => {
              var vday=$this.$moment($this.max_date).add(-1,"y").format("YYYYMMDD")
            var sidx=$this.getstart(vday)
            var datasize=$this.echart.getModel().option.xAxis[0].data.length
            $this.divideBy(sidx,{start:sidx*100/datasize,end:100})   
            $this.refreshData({startValue:sidx,end:100}) 
        }
        this.axisOption.toolbox.feature.mythisyear.onclick = () => {
            console.log($this.max_date)
            var vday=$this.$moment($this.max_date).dayOfYear(1).format("YYYYMMDD")
            var sidx=$this.getstart(vday)
            var datasize=$this.echart.getModel().option.xAxis[0].data.length
            $this.divideBy(sidx,{start:sidx*100/datasize,end:100})   
            $this.refreshData({startValue:sidx,end:100}) 
        }
        this.echart.setOption(this.options)
        this.echart.on('datazoom',function(params){
            console.log(params)
        var datasize=$this.echart.getModel().option.xAxis[0].data.length
        var startidx=Math.round(datasize*params.start/100)
        $this.divideBy(startidx,params)   
        $this.refreshData(params) 
 
})
        this.echart.on('datazoom',function(params){
        })
      }
     
       // this.divideBy(lastIdx,params) 
        
    },
    refreshData(params){
        var option = this.echart.getOption();
         option.dataZoom[0].startValue=params.startValue;
         option.dataZoom[0].end=params.end;
         option.series= this.chartData.series;
        this.echart.setOption(option,true)

    },
     getstart(vady){
         console.log(vady)
            var arr=this.echart.getModel().option.xAxis[0].data
            for (var i=0;i<arr.length;i++){
                if(arr[i]>vady&&i>0)
                return i
            }

        },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
      }
    },
    resizeChart() {
      this.echart ? this.echart.resize() : ''
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.getChart(this.code)
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
