<template>
  <div ref="tableContainer" style="height: 100%">
    <vxe-toolbar>
      <template #buttons>
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
        <vxe-button size="small" @click="exportDataEvent">导出</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      class="mytable-style"
      show-footer
      border
      ref="statTable"
      :align="allAlign"
      size="small"
      :row-config="{ keyField: 'code', isCurrent: true, isHover: true }"
      show-overflow
      :scroll-y="{ oSize: 500 }"
      :sort-config="{
        trigger: 'cell',
        defaultSort: { field: 'latest_date', order: 'desc' },
        orders: ['desc', 'asc', null]
      }"
    >
      <!-- <vxe-column type="checkbox" width="30" fixed="left"></vxe-column> -->
      <vxe-column type="seq" width="60" fixed="left"></vxe-column>
      <!-- <vxe-column field="idx" width="80" sortable title="序号"> </vxe-column> -->

      <vxe-column field="short_name" width="120" sortable title="名称">
        <template #default="{ row }">
          <a href="javascript:;" @click="showFundHis(row.code)">{{
            row.short_name
          }}</a>
        </template>
      </vxe-column>
      <vxe-column field="code" width="80" sortable title="code"> </vxe-column>
      <vxe-column
        field="class_type"
        width="80"
        sortable
        title="类型"
        :filters="
          sysparam.class_type.map((r) => {
            return { 'label': r.code, 'value': r.value }
          })
        "
      >
      </vxe-column>
      <vxe-column field="sub_type" width="100" sortable title="子">
      </vxe-column>
      <vxe-column field="rank_type" width="80" sortable title="排名">
      </vxe-column>
      <vxe-column field="scale" width="80" sortable title="状态"> </vxe-column>
      <vxe-column field="create_time" width="80" sortable title="添加日期">
        <template #default="{ row }">
          {{ $tools.showDate(row.create_time) }}
        </template>
      </vxe-column>
      <vxe-column field="start_date" width="80" sortable title="开始日期">
      </vxe-column>
      <vxe-column field="latest_date" width="80" sortable title="结束日期">
      </vxe-column>
      <vxe-column field="skipby" width="160" sortable title="skip">
        <template #default="{ row }">
          <a href="javascript:;" @click="showFundHis(row.skipby)">{{
            showFundName(row.skipby)
          }}</a>
        </template>
      </vxe-column>
      <!-- <vxe-colgroup title="未完成" align="center">
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
      </vxe-colgroup>-->
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
      startdate: '',
      enddate: '',
      showCompanyRanks: false,
      rawlen: 0,
      sublist: {},
      filter: '',
      multipleSelection: [],
      basedict: {},
      allAlign: 'left',
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
    showFundHis(code) {
      Bus.$emit('showChart', {
        cur_code: code,
        diagName: 'hisChart',
        wk: '1'
      })
    },
    getCompanyProduct(row) {
      console.log(row)
      this.$axios
        .get('/fof/tasklist', {
          params: { 'company_code': row['company_code'] }
        })
        .then((res) => {
          Bus.$emit('showChart', {
            'prodlist': res.data,
            'canEdit': true,
            'diagName': 'prodDiag'
          })
        })
    },
    getClass(status) {
      if (status == '未尽调') {
        return 'col-red'
      } else if (status == '信息不完整') {
        return 'col-yellow'
      }
      return ''
    },
    getCellDis(tp, idx) {
      let tlist = this.sublist[tp]
      if (tlist && idx < tlist.length) {
        return tlist[idx]
      }
      return {}
    },
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
      XLSX.writeFile(nwb, '未排名产品.xlsx')
    },
    cellClickEvent({ column, row }) {
      console.log(`单元格点击${column.title} ${column.field}`)
      if (row[column.field]['code'])
        Bus.$emit('editInfo', { 'cur_code': row[column.field]['code'] })
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
    sumNum(list, field, status) {
      let count = 0
      list.forEach((item) => {
        if (item[field]['code']) {
          if (status && status != item[field]['status']) {
          } else {
            count++
          }
        }
      })
      if (count == count) return count
      return 0
    },
    ftmtd() {
      return [['合计', '2', '44', '67', '-']]
    },
    footerMethod1({ columns, data }) {
      console.log(data)
      const sums0 = []
      const sums = []
      const sums1 = []
      columns.forEach((column, columnIndex) => {
        console.log(column.property)
        if (columnIndex === 0) {
          sums0.push('红')
          sums.push('合计')
          sums1.push('黄')
        } else {
          let sum0Cell = null
          let sumCell = null
          let sum1Cell = null
          // switch (column.property) {
          //   case 'age':
          //   case 'amount':
          //     meanCell = this.meanNum(data, column.property)
          sumCell = this.sumNum(data, column.property, '')
          sum0Cell = this.sumNum(data, column.property, '未尽调')
          sum1Cell = this.sumNum(data, column.property, '信息不完整')

          //     break
          //   case 'sex':
          //     otherCell = '无'
          //     break
          // }
          sums1.push(sum1Cell)
          sums.push(sumCell)
          sums0.push(sum0Cell)
        }
      })
      // 返回一个二维数组的表尾合计
      console.log(sums)
      return [sums0, sums1, sums]
    },
    getStatInfo() {
      this.$axios
        .get('/fof/no_rankprod', {
          params: {
            'date': this.startdate
          }
        })
        .then((res) => {
          // let maxlen = 0
          // this.sublist = {}
          // for (var tp of this.tps) {
          //   this.sublist[tp] = res.data
          //     .filter((r) => r.class_type == tp)
          //     .sort((a, b) => b['yr'] - a['yr'])
          //   if (this.sublist[tp].length > maxlen) {
          //     maxlen = this.sublist[tp].length
          //   }
          // }
          // console.log(this.sublist)
          // console.log(maxlen)
          // this.tableList = []
          // for (let i = 0; i < maxlen; i++) {
          //   let row = { 'idx': i }
          //   for (let ap of this.tps) {
          //     if (this.sublist[ap].length > i) {
          //       row[ap] = this.sublist[ap][i]
          //     } else {
          //       row[ap] = {}
          //     }
          //   }
          //   this.tableList.push(row)
          // }
          this.tableList = res.data.filter(
            (row) => ['指数', '股票主观', 'FOF'].indexOf(row['class_type']) < 0
          )
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
<style lang="scss"  >
.mytable-style .vxe-body--row.row-green {
  background-color: #187;
  color: #fff;
}
.mytable-style .vxe-header--column.col-blue {
  background-color: #2db7f5;
  color: rgb(170, 8, 8);
}
.col-red {
  //   background-color: #ff0000;
  color: #ff0000;
}
.col-yellow {
  //   background-color: yellow;
  color: #ffb703;

  // color: #000;
}
.col-green {
  background-color: #006400;
  //color: #000;
}
.col-yellowgreen {
  background-color: yellowgreen;
  //color: #fff;
}
</style>