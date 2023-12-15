<template>
  <div ref="tableContainer" style="height: 100%">
    <div class="block" style="display: flex; justify-content: space-between">
      <div style="width: 480px">
        <el-button size="small" @click="toggleSelection()">取消选择</el-button>
        <el-button size="small" @click="compare()">对比</el-button>
        <el-button size="small" @click="downFile()">下载业绩对比</el-button>
        <el-button size="small" @click="doFresh()">刷新报表</el-button>
        <el-button size="small" @click="downNetFile()">下载净值</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :max-height="tmaxh"
      tooltip-effect="dark"
      @filter-change="filterChange"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-top: 20px"
    >
      <!--    @row-click = "Selection"       :default-sort="{prop:'类型',order:'ascending','当月收益':'descending'}"-->

      <el-table-column type="selection" width="55"> </el-table-column>
      <!--      测试ID-->
      <!--  <el-table-column
      prop="基金代码"
      label="基金代码"
      width="100">
      <template slot-scope="scope">{{ scope.row["基金代码"]}}</a></template>
    </el-table-column>
      用例编号-->
      <el-table-column
        prop="基金名称"
        width="120"
        label="基金名称"
        show-overflow-tooltip
      >
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          <!-- <el-button size="small" @click="showHelp()">?说明</el-button> -->
        </template>
        <template slot-scope="scope"
          ><a href="javascript:;" @click="showHis(scope.row)">{{
            scope.row['基金名称']
          }}</a></template
        >
      </el-table-column>
      <el-table-column
        prop="code"
        width="30"
        label="信息"
        show-overflow-tooltip
      >
        <template slot="header" slot-scope="scope">
          <a target="_blank" @click="showHelp()">?</a>
        </template>
        <template slot-scope="scope">
          <!-- <el-button
            @click.native.prevent="showFundHis(scope.row)"
            type="text"
            size="small"
            ><i class="el-icon-s-marketing"></i
          ></el-button>
          <el-button
            @click.native.prevent="showBaseHis(scope.row)"
            type="text"
            size="small"
            ><i class="el-icon-s-order"></i
          ></el-button>
          <el-button
            @click.native.prevent="showStatHis(scope.row)"
            type="text"
            size="small"
            ><i class="el-icon-s-data"></i
          ></el-button> -->
          <el-button
            @click.native.prevent="showBaseInfo(scope.row)"
            type="text"
            size="small"
            ><i class="el-icon-info"></i
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column
        column-key="class_type"
        prop="类型"
        width="60"
        label="类型"
        sortable
        show-overflow-tooltip
        :filters="cls_filter"
        :filter-method="filterClassType"
      >
        <template slot-scope="scope">{{ scope.row['类型'] }}</template>
      </el-table-column>
      <el-table-column
        prop="子类型"
        width="100"
        label="子"
        sortable
        :filters="subfilters"
        :filter-method="filterHandler"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row['子类型'] }}</template>
      </el-table-column>
      <el-table-column
        prop="buy_date"
        width="90"
        label="购买时间"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row['buy_date'] }}</template>
      </el-table-column>
      <!-- <el-table-column
        prop="份额"
        width="60"
        label="额"
        sortable
        show-overflow-tooltip
      >
             <template slot-scope="scope">{{ scope.row['份额'] }}</template>
      </el-table-column> -->
      <!--      测试项目-->
      <!--      测试用例是否关联-->
      <!--      测试输入-->
      <el-table-column
        align="right"
        prop="净值日期"
        width="100"
        sortable
        label="净值日期"
        show-overflow-tooltip
      >
        <template slot-scope="scope"> {{ scope.row['净值日期'] }}</template>
      </el-table-column>
      <el-table-column
        prop="本周收益"
        label="本周收益"
        align="right"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['本周收益'] >= 0 ? 'red' : 'green')
            "
          >
            {{ showResult(scope.row['本周收益']) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="当月收益"
        label="当月收益"
        sortable
        align="right"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['当月收益'] >= 0 ? 'red' : 'green')
            "
          >
            {{ showResult(scope.row['当月收益']) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="当年收益"
        label="当年收益"
        align="right"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['当年收益'] >= 0 ? 'red' : 'green')
            "
          >
            {{ showResult(scope.row['当年收益']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        sortable
        align="right"
        prop="近6月收益"
        label="近6月收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['近6月收益'] >= 0 ? 'red' : 'green')
            "
          >
            {{ showResult(scope.row['近6月收益']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        sortable
        align="right"
        prop="近12月收益"
        label="近12月收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope"
          ><span
            :style="
              'text-align:right;color:' +
              (scope.row['近12月收益'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['近12月收益']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="2022"
        label="2022"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['2022'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['2022']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="2021"
        label="2021"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['2021'] >= 0 ? 'red' : 'green')
            "
          >
            {{ showResult(scope.row['2021']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="2020"
        label="2020"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['2020'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['2020']) }}</span
          ></template
        >
      </el-table-column>

      <!--过去3年年均收益	夏普比率	卡玛比率	最大回撤-->
      <el-table-column
        sortable
        align="right"
        prop="过去3年年均收益"
        label="过去3年年均收益"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['过去3年年均收益'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['过去3年年均收益']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="夏普比率"
        label="夏普比率"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['夏普比率'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['夏普比率'], 1) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="波动率"
        label="波动率"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['波动率'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['波动率'], 1) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="卡玛比率"
        label="卡玛比率"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['卡玛比率'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['卡玛比率'], 1) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="最大回撤"
        label="最大回撤"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :style="
              'text-align:right;color:' +
              (scope.row['最大回撤'] >= 0 ? 'red' : 'green')
            "
            >{{ showResult(scope.row['最大回撤']) }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        align="right"
        prop="当前净值"
        label="当前净值"
        show-overflow-tooltip
      >
        <template slot-scope="scope"> {{ scope.row['当前净值'] }}</template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: space-between">
      <div class="block" style="margin-top: 25px; height: 40px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 25, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totaltableData.length"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
    >
      <fund-echart
        @close="editClose"
        ref="hischart"
        :titles="current.name"
        style="height: 600px"
        :code="cur_code"
        :wk="'0'"
        :visable="dialogVisible"
      ></fund-echart>
    </el-dialog>
  </div>
</template>

<!--1、用例编号;-->
<!--2、测试项目;-->
<!--3、测试标题;-->
<!--4、重要级别;-->
<!--5、预置条件;-->
<!--6、测试输入;-->
<!--7、操作步骤;-->
<!--8、预期输出-->
<script>
import axis from 'axios'
import FundEchart from '../../components/FundEchart.vue'
import { mapGetters } from 'vuex'
import Bus from '@/store/bus.js'

export default {
  components: {
    FundEchart
  },
  computed: {
    ...mapGetters(['class_order', 'sysparam']),
    cls_filter: {
      get() {
        let filters = this.sysparam.class_type
          .filter((r) => r.value != '股票主观' && r.value != '灵活对冲')
          .map((r) => {
            return { text: r.code, value: r.value }
          })
        filters.splice(2, 0, { text: '超额', value: '超额' })
        return filters
      }
    }
  },
  props: {
    url: {
      type: String,
      default: '/fof/jreport'
    }
  },
  data() {
    return {
      current: {},
      subfilters: [],
      nocache: '',
      cur_code: '',
      search: '',
      range: 'quarter',
      dialogVisible: false,
      rowdata: '',
      value2: '',
      tmaxh: 500,
      chartData: {
        xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      },
      input: '',
      tableData: [],
      rawData: [],
      totaltableData: [],
      currentPage: 1,
      PageSize: 10,
      multipleSelection: []
    }
  },
  watch: {
    $route: {
      handler(n) {
        console.log(n)
        if (n.params['url']) {
          this.curl = '/fof/' + n.params['url']
        }
        //   this.getList()
        // 初始化操作
      },
      immediate: true,
      deep: true
    },
    url: {
      handler(n) {
        this.getList()
      }
    },
    search: {
      handler(n) {
        if (this.search) {
          this.tableData = this.rawData.filter(
            (r) => r['基金名称'].indexOf(this.search) > -1
          )
        } else {
          this.tableData = this.rawData
        }
      }
    }
  },
  methods: {
    showHelp() {
      Bus.$emit('showChart', {
        cur_code:
          'http://192.168.0.21:4999/web/#/p/8f5ce9a1813e060d275b1fb454c227cd',
        diagName: 'iframe'
      })
      // window.open(
      //   'http://192.168.0.21:4999/web/#/p/8f5ce9a1813e060d275b1fb454c227cd'
      // )
    },
    showFundHis(row) {
      let acode = row.code
      if (acode.endsWith('_E')) {
        acode = acode.substring(0, 6)
      }
      Bus.$emit('showChart', {
        cur_code: acode,
        diagName: 'hisChart',
        wk: '1'
      })
    },
    showBaseHis(row) {
      let acode = row.code
      if (acode.endsWith('_E')) {
        acode = acode.substring(0, 6)
      }
      Bus.$emit('showChart', {
        cur_code: acode,
        rg: this.range,
        diagName: 'baseChart'
      })
    },
    showStatHis(row) {
      let acode = row.code
      if (acode.endsWith('_E')) {
        acode = acode.substring(0, 6)
      }
      Bus.$emit('showChart', {
        cur_code: acode,
        rg: this.range,
        diagName: 'statChart'
      })
    },
    showBaseInfo(row) {
      let acode = row.code
      if (acode.endsWith('_E')) {
        acode = acode.substring(0, 6)
      }
      Bus.$emit('showInfo', { cur_code: acode })
    },
    filterChange(kdict) {
      console.log(kdict['class_type'])
      if (kdict['class_type']) {
        this.subfilters = []
        let filterdata = this.tableData.filter(
          (row) => kdict['class_type'].indexOf(row['类型']) > -1
        )
        console.log(filterdata)
        for (let r of filterdata) {
          if (
            this.subfilters.filter((s) => s['value'] == r['子类型']).length < 1
          )
            this.subfilters.push({
              'text': r['子类型'],
              'value': r['子类型']
            })
        }
      }
    },
    filterClassType(value, row) {
      return row['类型'] === value
    },
    resizeChart() {
      this.tmaxh = this.$refs.tableContainer.clientHeight - 120
    },
    editClose() {
      this.dialogVisible = false
    },
    showResult(number, rate = 100) {
      if (null == number) return ''
      var color = number >= 0 ? 'red' : 'green'
      //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
      let aret = this.$tools.formatMoney(number * rate, 2)
      // console.log(`${number}__${aret}`)
      return aret
    },

    showHis(row) {
      this.cur_code = ''
      this.current = row
      this.dialogVisible = true
      this.cur_code = row.code
      //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
    },
    handleClose(done) {
      done()
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    //表格方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    //
    compare() {
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length < 1) {
        return
      }
      var selcode = ''
      console.log(this.multipleSelection)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selcode += ',' + this.multipleSelection[i].code
      }
      this.cur_code = ''
      this.current = this.multipleSelection[0]
      // this.dialogVisible = true
      this.cur_code = selcode

      Bus.$emit('showChart', {
        cur_code: this.cur_code,
        wk: '0',
        diagName: 'fullDialog'
      })
      //   this.$refs.hischart.$emit("getChart",selcode)
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    downFile() {
      const options = { 'cache': 1 }
      this.$tools.exportExcel(this.url + '_down', options)
    },
    downNetFile(durl) {
      var url = '/fof/report'
      if (durl) {
        url = durl
      }
      if (this.multipleSelection.length < 1) {
        return
      }
      var selcode = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selcode += ',' + this.multipleSelection[i].code
      }
      console.log(url)
      const options = { code: selcode }
      this.$tools.exportExcel(url, options)
    },
    delSelection() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        console.log(this.multipleSelection[i].id)
        for (let j = 0; j < this.tableData.length; j++) {
          if (this.multipleSelection[i].id === this.tableData[j].id) {
            this.tableData.splice(j, 1)
            break
          }
        }
      }
    },
    clickSelection(index, row) {
      // console.log(index, row);
      console.log(row.test_id)
      this.request_excute(row.test_id)
    },
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.PageSize = val
      console.log(this.PageSize)
      console.log(this.currentPage)
    },
    // 跳转
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      //页面每页大小
      console.log(this.PageSize)
      //当前页
      console.log(this.currentPage)
      let startindex = (this.currentPage - 1) * this.PageSize
      if (startindex <= 0) {
        startindex = 0
      }
      let endindex
      if (this.PageSize * this.currentPage > this.totaltableData.length) {
        endindex = this.totaltableData.length - 1
      } else {
        endindex = this.PageSize * this.currentPage - 1
      }
      console.log(startindex, endindex)
      this.tableData = this.totaltableData.slice(startindex, endindex)
    },
    //时间选择器方法
    handeldateChange() {
      console.log(this.value2[0])
      console.log(this.value2[1])
    },

    //
    doFresh() {
      this.nocache = '1'
      this.getList()
    },
    getList() {
      axis
        .get(this.url, { params: { 'nocache': this.nocache } }) //axis后面的.get可以省略；
        .then((response) => {
          if (this.url.indexOf('jcompare') > 0) {
            this.rawData = this.$tools
              .pandasToJson(response.data)
              .filter((row) => row['类型'] != '指增')
          } else {
            this.rawData = this.$tools
              .pandasToJson(response.data)
              .sort((a, b) => {
                var r =
                  this.class_order.indexOf(a['类型']) -
                  this.class_order.indexOf(b['类型'])
                if (r == 0) {
                  //   return b['当月收益'] - a['当月收益']
                  return b['基金名称'].localeCompare(a['基金名称'])
                }
                return r
              })
          }
          this.tableData = this.rawData
          this.subfilters = []
          // this.cls_filter = []
          for (let r of this.tableData) {
            // if (
            //   this.cls_filter.filter((ar) => ar['value'] == row['类型'])
            //     .length < 1
            // ) {
            //   this.cls_filter.push({
            //     'value': row['类型'],
            //     'text': row['类型']
            //   })
            // }
            if (
              this.subfilters.filter((s) => s['value'] == r['子类型']).length <
              1
            )
              this.subfilters.push({
                'text': r['子类型'],
                'value': r['子类型']
              })
          }
          this.resizeChart()
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error)
        })
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    }
    //
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
  },
  async created() {
    this.getList()
  }
}
</script>