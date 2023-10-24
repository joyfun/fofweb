<template>
  <div>
    <vxe-table
      ref="hisTable"
      size="mini"
      max-height="480"
      :mouse-config="{ selected: true }"
      show-overflow
      :data="tableData"
    >
      <!-- <vxe-column field="code" title="name" width="90"></vxe-column> -->
      <vxe-column field="name" title="类型" width="120"></vxe-column>
      <vxe-column field="detail" title="详情"></vxe-column>
      <vxe-column field="update_time" width="120" title="更新时间"
        ><template #default="{ row }">
          {{ $moment(row['update_time']).format('YYYYMMDD') }}
        </template></vxe-column
      >
    </vxe-table>
  </div>
</template>
<script>
import axis from 'axios'
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
        this.loaded = false
        this.getTable(val)
      }
    },
    temp: {
      handler: function (temp) {
        this.getTable(this.code)
      }
    },
    isVisible: {
      handler: function (val) {
        console.log(val)
        console.log(this)
        if (val) {
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
      raw_data: {},
      startidx: 0,
      loaded: false,
      cols: ['日期', '当前净值', '累计净值', '复权净值'],
      max_date: '',
      //   width: this.initWidth(),
      echart: null,
      impcols: [],
      records: [],
      frecord: {},
      keymap: ['', '', '', ''],
      tableData: []
    }
  },
  methods: {
    getTable(code) {
      if (code && code.length > 2) {
        console.log('refresh chart:' + code)
        var param = { code: code }
        console.log(this.temp)
        if (this.temp) {
          param['temp'] = this.temp
        }
        var $this = this
        if (this.$isElectron) {
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
        } else {
          axis
            .get('/fof/alarms', { params: param }) //axis后面的.get可以省略；
            .then((response) => {
              console.log(response.data)
              $this.tableData = []
              //   var len = response.data.datas.length
              //   console.log(len)
              //   for (var i = len; i > 0; i--) {
              //     $this.tableData.push({
              //       date: response.data.datas[i - 1][0],
              //       code: response.data.datas[i - 1][1],
              //       netval: response.data.datas[i - 1][2],
              //       sumval: response.data.datas[i - 1][3],
              //       reval: response.data.datas[i - 1][4]
              //     })
              //   }
              //   console.log($this.tableData.length)

              $this.tableData = response.data
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    }
  },
  filters: {
    formatDate: function (time) {
      console.log(time)
      if (time && time.length > 10) {
        var date = new Date(time)
        return time.substring(0, 10).replaceAll('-', '')
      } else {
        return ''
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