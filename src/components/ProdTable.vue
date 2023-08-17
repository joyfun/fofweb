<template>
  <div>
    <el-button size="small" @click="hisCompare()">对比</el-button>
    <el-button size="small" @click="showcorr()">相关性</el-button>
    <el-button size="small" @click="compare()">业绩对标</el-button>
    <el-button size="small" @click="exportExcel">导出</el-button>
    <el-table
      ref="multipleTable"
      :data="foflist"
      tooltip-effect="dark"
      :row-key="
        (row) => {
          return row.code
        }
      "
      :max-height="tmaxh"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55">
      </el-table-column>
      <el-table-column
        label="名称"
        sortable
        width="180"
        prop="short_name"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a href="javascript:;" @click="showHis(scope.row)">{{
            scope.row.short_name
          }}</a></template
        >
      </el-table-column>
      <el-table-column label="备案号" prop="code" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column
        label="类别"
        sortable
        prop="class_type"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row['class_type'] }}</template>
      </el-table-column>

      <el-table-column
        label="子类别"
        sortable
        prop="sub_type"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="对接人"
        sortable
        prop="maintainer"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="来源"
        sortable
        prop="prod_source"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="渠道备注"
        sortable
        prop="source_remark"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="可投" sortable prop="scale" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="管理费" sortable prop="fee" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="carry"
        sortable
        prop="carry1"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        v-if="canEdit"
        label="状态"
        sortable
        prop="status"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span :class="getClass(row['status'])">{{ row['status'] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="canEdit"
        label="可投"
        sortable
        prop="scale"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="阶段" sortable prop="stage" show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="最新净值"
        sortable
        prop="latest_date"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- -->
      <el-table-column v-if="canEdit" width="40" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="doEdit(scope.row)"
            type="text"
            size="small"
            ><el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="left-start"
              ><i class="el-icon-edit rightCell"></i></el-tooltip
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 <script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Bus from '@/store/bus.js'
export default {
  props: {
    foflist: {
      type: Array,
      default: []
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // code:{
    // handler: function(val) {
    //     console.log(val)
    //             this.getTable(val)
    //           }
    // }
  },
  data() {
    return {
      tmaxh: 600,
      tableExport: {
        // 默认选中类型
        type: 'xlsx',
        // 自定义类型
        types: ['xlsx', 'csv', 'html', 'xml', 'txt']
      }
      //   raw_data:{},
      //   corrdata:[],
      //   funds:{},
      //   startidx:0,
      //   max_date:'',
      // //   width: this.initWidth(),
      //   echart: null,
      //   tableData:[]
    }
  },
  methods: {
    getClass(status) {
      if (status == '未尽调') {
        return 'col-red'
      } else if (status == '信息不完整') {
        return 'col-yellow'
      }
      return ''
    },
    exportExcel() {
      var title = '产品信息'
      var workbook = XLSX.utils.book_new()
      var st = XLSX.utils.table_to_sheet(this.$refs.multipleTable.$el)
      XLSX.utils.book_append_sheet(workbook, st, '产品')
      var wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          title + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      // this.$refs.rankTable.exportData({
      //   filename: '排名信息'+this.type+'_'+this.date,
      //   sheetName: 'Sheet1',
      //   type: 'xlsx'
      // })
    },
    doEdit(row) {
      Bus.$emit('editInfo', { 'cur_code': row['code'] })
    },
    showHis(row) {
      Bus.$emit('showChart', { 'cur_code': row.code, 'diagName': 'hisChart' })
    },
    hisCompare() {
      let sels = this.$refs.multipleTable.selection.map((row) => row['code'])
      let selcode = sels.join(',')

      if (selcode) {
        Bus.$emit('showChart', { 'cur_code': selcode, 'diagName': 'hisChart' })
      }
    },
    compare() {
      let sels = this.$refs.multipleTable.selection.map((row) => row['code'])
      let selcode = sels.join(',')

      if (selcode) {
        Bus.$emit('showChart', {
          'cur_code': selcode,
          'diagName': 'fullDialog'
        })
      }
    },
    showcorr() {
      let sels = this.$refs.multipleTable.selection.map((row) => row['code'])
      let selcode = sels.join(',')

      if (selcode) {
        Bus.$emit('showChart', {
          'cur_code': selcode,
          'diagName': 'corrDialog'
        })
      }
    }
  },
  mounted() {}
}
</script>