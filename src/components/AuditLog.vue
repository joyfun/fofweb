<template>
  <div class="block">
    <vxe-radio-group v-model="vkey">
      <vxe-radio-button label="" content="全部"></vxe-radio-button>
      <vxe-radio-button
        :key="vkey"
        v-for="vkey of keygrps"
        :label="vkey"
        :content="vkey"
      ></vxe-radio-button>
    </vxe-radio-group>
    <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
      <el-timeline>
        <el-timeline-item
          :key="tag.time"
          v-for="tag in tableData"
          :timestamp="tag.time"
          placement="top"
        >
          <el-card>
            <h4>{{ tag.stage }}</h4>
            <p>{{ tag.remark }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
  </div>
</template>

 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import Vue from 'vue'
import axis from 'axios'
var echarts = require('echarts')
// 引入柱状图
// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    },
    temp: {
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
    code: {
      handler: function (val) {
        this.getTable(val)
      }
    },
    vkey: {
      handler: function (val) {
        this.filterKey(val)
      }
    },
    temp: {
      handler: function (temp) {
        this.getTable(this.code)
      }
    },
    visable: {
      handler: function (val) {
        console.log(val)
        console.log(this)
        if (val) {
          this.getTable(this.code)
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
      vkey: '',
      raw_data: {},
      keygrps: new Set(),
      startidx: 0,
      max_date: '',
      //   width: this.initWidth(),
      echart: null,
      raw_data: [],
      tableData: []
    }
  },
  methods: {
    filterKey(key) {
      if (key) {
        this.tableData = this.raw_data.filter((r) => r['stage'] == key)
      } else {
        this.tableData = this.raw_data
      }
    },
    getTable(code) {
      if (code && code.length > 2) {
        console.log('refresh chart:' + code)
        var param = { 'code': code }
        console.log(this.temp)
        if (this.temp) {
          param['temp'] = this.temp
        }
        var $this = this
        axis
          .get('/fof/auditlog', { params: param }) //axis后面的.get可以省略；
          .then((response) => {
            $this.raw_data = response.data.datas
            $this.raw_data.sort((b, a) => {
              if (a['time'] > b['time']) return 1
              else return -1
            })
            console.log($this.raw_data)
            Vue.set(
              this,
              'keygrps',
              new Set($this.raw_data.map((r) => r['stage']))
            )
            console.log(this.keygrps)
            this.filterKey(this.vkey)
            // var len=response.data.datas.length
            // console.log(len)
            // for (var i =len ;i>0;i--){
            // $this.tableData.push({
            //     date:response.data.datas[i-1][0],
            //     code:response.data.datas[i-1][1],
            //     net_val:response.data.datas[i-1][2],
            //     sum_val:response.data.datas[i-1][3]
            // })
            // }
            // console.log($this.tableData.length)

            // $this.tableData=response.data.datas
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
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
