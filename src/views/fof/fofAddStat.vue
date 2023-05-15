<template>
  <div ref="tableContainer" style="height: 100%">
    <vxe-toolbar>
      <template #buttons>
        <!-- <vxe-button size="mini" @click="clearSelect">取消</vxe-button> -->
        <span class="demonstration">起</span>
        <el-date-picker
          style="width: 130px"
          v-model="startdate"
          value-format="yyyyMMdd"
          format="yyyyMMdd"
          align="right"
          @change="changeDate"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <span class="demonstration">止</span>
        <el-date-picker
          style="width: 130px"
          v-model="enddate"
          value-format="yyyyMMdd"
          format="yyyyMMdd"
          align="right"
          @change="changeDate"
          type="date"
          placeholder="截止日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <vxe-button size="mini" @click="exportDataEvent">导出</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      class="mytable-style"
      show-footer
      :footer-method="footerMethod1"
      border
      @cell-click="cellClickEvent"
      ref="statTable"
      :align="allAlign"
      size="mini"
      :row-config="{ keyField: 'code', isCurrent: true, isHover: true }"
      show-overflow
      :scroll-y="{ oSize: 500 }"
      :sort-config="{
        trigger: 'cell',
        defaultSort: { field: 'rank', order: 'asc' },
        orders: ['desc', 'asc', null]
      }"
    >
      <!-- <vxe-column type="checkbox" width="30" fixed="left"></vxe-column> -->
      <!-- <vxe-column type="seq" width="30" fixed="left"></vxe-column> -->
      <vxe-column field="user" width="80" sortable title="用户"> </vxe-column>
      <vxe-colgroup title="数量" align="center">
        <vxe-column
          :key="af"
          :width="60"
          sortable
          v-for="af of tps"
          :title="af"
          :field="af"
        >
          <template #default="{ row }">
            <span>{{ row[af] }}</span>
          </template>
        </vxe-column>
      </vxe-colgroup>
      <!---->
      <vxe-column field="sum" width="48" sortable title="合计"> </vxe-column>
      <vxe-colgroup title="质量" align="center">
        <vxe-column
          :key="af"
          :width="60"
          sortable
          v-for="af of tps"
          :title="af"
          :field="af + '_lr'"
        >
          <template #default="{ row }">
            <span>{{ row[af + '_lr'] }}</span>
          </template>
        </vxe-column>
      </vxe-colgroup>
      <!-- <vxe-column sortable  title="分"  field="lscore" >
          </vxe-column>  -->
    </vxe-table>
  </div>
</template>

 <script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import XLSX from 'xlsx'
import Vue from 'vue'
import FileSaver from 'file-saver'
import Bus from '@/store/bus.js'
export default {
  //   components: {
  //     SankeyChart,
  // },
  props: {
    ftype: {
      type: String,
      default: ''
    },
    full: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: 'auto'
    }
  },
  watch: {},
  computed: {
    // tableList: {
    //   get(){
    //     if(this.showList){
    //       console.log('############')
    //       console.log(this.showList)

    //       let ret= this.tableData.filter(row=>{
    //         for(let key in this.yrdict){

    //           if(isNumber(row["mean_"+key])&&row["mean_"+key]<=0.3){
    //             return true
    //           }
    //           if(isNumber(row["listrate_"+key])&&row["listrate_"+key>=0.7]){
    //             return true
    //           }
    //           if(isNumber(row['rankF_'+key+"_r"])&&(row['rankF_'+key+"_r"]/this.rgdict[key])<=0.3){
    //             return true
    //           }
    //         }
    //       return false
    //       })
    //       console.log(ret)
    //       return ret
    //     }
    //    return this.tableData
    //   }
    // },
    // prodTitle: {
    //   get() {
    //     return '产品名称/' + this.calcdate
    //   }
    // },
    ...mapState(['foflist', 'holding']),
    ...mapGetters(['sysparam', 'token', 'showFundName'])
  },
  data() {
    return {
      statdict: {},
      tps: ['指增', '中性', 'CTA', '混合', '套利', '期权', '可转债'],
      company_ranks: [],
      startdate: '20230501',
      enddate: '',
      showCompanyRanks: false,
      rawlen: 0,
      filter: '',
      multipleSelection: [],
      basedict: {},
      allAlign: 'right',
      tableData: [],
      tableList: [],
      winlength: { hyr: 26, '1yr': 52, '2yr': 104, quarter: 13 },
      showList: false,
      range: 'quarter',
      srange: 'hyr',
      brange: '00-6',
      arange: '00-6',
      company_code: '',
      calcdate: '',
      baseData: {},
      rgdict: {},
      date: '',
      type: 'cta0',
      yrdict: {
        'hyr': '半年',
        '1yr': '一年',
        '2yr': '两年',
        'quarter': '三月'
      },
      nyrdict: {
        '00-6': '00-6',
        '0-12': '0-12',
        '1224': '1224',
        '2436': '2436'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '7日',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          },
          {
            text: '30日',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          },
          {
            text: '90日',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', date)
            }
          },
          {
            text: '180日',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一年',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      avgcnt: {},
      subtypes: [],
      trank: {},
      cls_gap: {
        aas: {
          limit: { dd: [-0.1, 0], volatility: [0, 0.15] },
          level: { dd: [-0.07, -0.05, -0.03] }
        },
        cta0: {
          limit: { dd: [-0.2, 0], dd_week: [0, 60] },
          level: { dd: [-0.15, -0.07, -0.03] }
        },
        cta1: {
          limit: { dd: [-0.2, 0], dd_week: [0, 60] },
          level: { dd: [-0.15, -0.07, -0.03] }
        }
      }
    }
  },
  methods: {
    exportDataEvent() {
      const header = XLSX.utils.table_to_sheet(
        this.$refs.statTable.$el.querySelector(
          '.body--wrapper>.vxe-table--header'
        )
      )
      const workBook = XLSX.utils.table_to_sheet(
        this.$refs.statTable.$el.querySelector(
          '.body--wrapper>.vxe-table--body'
        )
      )
      XLSX.utils.sheet_add_aoa(
        header,
        XLSX.utils.sheet_to_json(workBook, { header: 1 }),
        { origin: -1 }
      )
      var nwb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(nwb, header, 'Sheet1')
      XLSX.writeFile(nwb, '添加统计.xlsx')
    },
    cellClickEvent({ column, row }) {
      console.log(`单元格点击${column.title} ${column.field}`)
      let cls_type = column.field
      if (column.field == 'sum') {
        return
      }
      let qdata = {
        'start_date': this.startdate,
        'end_date': this.enddate,
        'user': row['user'],
        'class_type': column.field
      }
      if (column.field && column.field.endsWith('_lr')) {
        qdata['class_type'] = column.field.split('_')[0]
        qdata['list_rate'] = '0.5'
      }
      this.$axios
        .get('/fof/tasklist', {
          params: qdata
        })
        .then((res) => {
          Bus.$emit('showChart', {
            'prodlist': res.data,
            'diagName': 'prodDiag'
          })
        })
    },
    changeDate(date) {
      this.getStatInfo()
    },
    changeEndDate(date) {
      this.getStatInfo()
    },
    getDis(row, af) {
      console.log(row)
      if (row[af]) {
        if (row[af + '_lr']) {
        } else {
          row[af + '_lr'] = 0
        }
        return row[af + '_lr'] + '/' + row[af]
      }
      return ''
    },
    sumNum(list, field) {
      let count = 0
      list.forEach((item) => {
        count += Number(item[field])
      })
      if (count == count) return count
      return 0
    },
    ftmtd() {
      return [['合计', '2', '44', '67', '-']]
    },
    footerMethod1({ columns, data }) {
      console.log(data)
      const means = []
      const sums = []
      const others = []
      columns.forEach((column, columnIndex) => {
        console.log(column.property)
        if (columnIndex === 0) {
          means.push('平均')
          sums.push('合计')
          others.push('其他')
        } else {
          let meanCell = null
          let sumCell = null
          let otherCell = '-'
          // switch (column.property) {
          //   case 'age':
          //   case 'amount':
          //     meanCell = this.meanNum(data, column.property)
          sumCell = this.sumNum(data, column.property)
          //     break
          //   case 'sex':
          //     otherCell = '无'
          //     break
          // }
          means.push(meanCell)
          sums.push(sumCell)
          others.push(otherCell)
        }
      })
      // 返回一个二维数组的表尾合计
      console.log(sums)
      return [sums]
    },
    getStatInfo() {
      this.$axios
        .get('/fof/addstat', {
          params: {
            'start_date': this.startdate,
            'end_date': this.enddate
          }
        })
        .then((res) => {
          this.tableList = res.data
          this.tableList.map((r) => {
            r['sum'] = 0
            for (let k of this.tps) {
              if (r[k]) {
                r['sum'] += r[k]
              }
            }
            return r
          })
          this.$refs.statTable.loadData(this.tableList)
        })
    }
  },
  mounted() {
    // if (this.ftype == '投后') {
    //   this.range = 'quarter'
    // } else {
    // this.date = this.$moment().format('YYYYMMDD')
    // }
    //this.getProducts();
    this.getStatInfo()
  },
  created() {
    // this.getMisc("fof_action")
  }
}
</script>