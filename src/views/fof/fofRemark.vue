<template>
  <div ref="tableContainer" style="height: 100%">
    <vxe-toolbar>
      <template #buttons>
        <!-- <vxe-button size="mini" @click="clearSelect">取消</vxe-button> -->
        <!-- <span class="demonstration">起</span>
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
        </el-date-picker> -->
        <el-select
          v-model="suser"
          style="width: 140px"
          clearable
          @change="getRemarks"
          placeholder="选择用户"
        >
          <el-option
            v-for="item of selusers"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <!-- <vxe-button size="mini" @click="exportDataEvent">导出</vxe-button> -->
      </template>
    </vxe-toolbar>
    <vxe-table
      class="mytable-style"
      ref="statTable"
      :align="allAlign"
      size="mini"
      :row-config="{ keyField: 'code', isCurrent: true, isHover: true }"
      show-overflow
      :scroll-y="{ oSize: 500 }"
      :sort-config="{
        trigger: 'cell',
        defaultSort: { field: 'weekday', order: 'desc' },
        orders: ['desc', 'asc', null]
      }"
    >
      <!-- <vxe-column type="checkbox" width="30" fixed="left"></vxe-column> -->
      <!-- <vxe-column type="seq" width="30" fixed="left"></vxe-column> -->
      <vxe-column field="code" width="120" sortable align="left" title="code">
        <template #default="{ row }">
          <a href="javascript:;" @click="showHis(row)">{{
            showFundName(row.code)
          }}</a>
        </template>
      </vxe-column>
      <vxe-column field="user" width="80" sortable title="用户"> </vxe-column>
      <vxe-column field="audit_time" width="160" sortable title="添加时间">
      </vxe-column>

      <vxe-column field="stage" width="80" sortable title="阶段"> </vxe-column>
      <vxe-column field="remark" sortable title="内容"> </vxe-column>
    </vxe-table>
    <vxe-pager
      align="left"
      :loading="loading1"
      :current-page="tablePage1.currentPage"
      :page-size="tablePage1.pageSize"
      :total="tablePage1.totalResult"
      :layouts="[
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump',
        'Sizes',
        'Total'
      ]"
      @page-change="handlePageChange"
    >
    </vxe-pager>
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
      selusers: ['chenjie', 'mayh', 'wangl', 'liuxq', 'qiwq', 'zhaoyx'],
      tablePage1: {
        currentPage: 1,
        pageSize: 20,
        totalResult: 0
      },
      suser: '',
      company_ranks: [],
      startdate: '',
      enddate: '',
      showCompanyRanks: false,
      rawlen: 0,
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
    showHis(row) {
      console.log(row)
      Bus.$emit('showChart', {
        cur_code: row.code,
        rg: this.range,
        diagName: 'hisChart'
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage1.currentPage = currentPage
      this.tablePage1.pageSize = pageSize
      this.getRemarks()
    },

    getRemarks() {
      console.log(this.tablePage1)
      this.$axios
        .get('/fof/pageremark', {
          params: {
            'stage': this.stage,
            'user': this.suser,
            'page_size': this.tablePage1.pageSize,
            'page_index': this.tablePage1.currentPage
          }
        })
        .then((res) => {
          this.tableList = res.data.items
          this.tablePage1.totalResult = res.data.total
          //   this.tableList.map((r) => {
          //     r['sum'] = 0
          //     for (let k of this.tps) {
          //       if (r[k]) {
          //         r['sum'] += r[k]
          //       }
          //     }
          //     return r
          //   })
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
    this.getRemarks()
  },
  created() {
    // this.getMisc("fof_action")
  }
}
</script>