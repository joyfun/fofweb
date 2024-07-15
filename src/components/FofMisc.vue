<template>
  <div ref="tableContainer" style="height: 100%">
    <!-- <i class="vxe-icon--caret-top"></i>
                <vxe-button content="主要图标颜色" type="text" status="primary" icon="fa fa-save"></vxe-button>
                 <el-button  @click="addRow">添加</el-button>
                 <el-button  @click="saveMisc"  icon="fa fa-save">保存</el-button> -->
    <vxe-toolbar>
      <template #buttons>
        <!-- <vxe-button icon="fa fa-plus" @click="insertEvent()">新增</vxe-button>
            <vxe-button @click="insertEvent(tableData[2])">在第3行插入并激活 Sex 单元格</vxe-button> -->
        <vxe-button @click="insertEvent(-1)">新增</vxe-button>
        <vxe-button @click="$refs.xTable.removeCheckboxRow()"
          >删除选中</vxe-button
        >
        <!-- <vxe-button @click="getSelectionEvent">获取选中</vxe-button>
            <vxe-button @click="getInsertEvent">获取新增</vxe-button> -->
        <!-- <vxe-button @click="$refs.xTable.setActiveCell(tableData[2], 'name')">激活第三行</vxe-button> -->
        <vxe-button icon="fa fa-save" @click="saveEvent">保存</vxe-button>
        <vxe-button
          v-if="code.startsWith('after_weight')"
          icon="fa fa-calculator"
          @click="recalc"
          >重新计算</vxe-button
        >
        <span v-if="code.startsWith('after_weight')"
          >最新计算时间：{{ latest_time }}</span
        >
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="xTable"
      border
      align="right"
      size="mini"
      :mouse-config="{ selected: true }"
      show-overflow
      :data="tableData"
      :area-config="{ autoClear: false }"
      :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      :keyboard-config="{
        isArrow: true,
        isDel: true,
        isEnter: true,
        isTab: true,
        isEdit: true
      }"
    >
      <!-- <vxe-column type="seq" width="60"></vxe-column> -->
      <!-- <vxe-column width="140" field="name" title="募集层一" :edit-render="{autofocus: '.myinput'}">
            <template #edit="{ row }">
              <vxe-input v-model="row.name" class="myinput"></vxe-input>
            </template>
          </vxe-column> -->
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column
        :key="col"
        v-for="col of cols"
        :field="col"
        :title="col.replace(/_$/, '')"
        :edit-render="{}"
        align="center"
      >
        <template #default="{ row }">
          <span v-if="col.endsWith('_')"
            >{{ row[col + 'l'] }}至{{ row[col + 'h'] }}</span
          >
          <span v-else>{{ row[col] }}</span>
        </template>

        <template v-if="col.endsWith('_')" #edit="{ row }">
          <p>
            <vxe-input
              style="width: 60px; float: left"
              type="number"
              size="mini"
              v-model="row[col + 'l']"
              class="myinput"
            ></vxe-input
            ><span style="float: left">至</span
            ><vxe-input
              size="mini"
              type="number"
              style="width: 60px; float: left"
              v-model="row[col + 'h']"
              class="myinput"
            ></vxe-input>
          </p>
        </template>
        <template v-else #edit="{ row }">
          <vxe-input v-model="row[col]" class="myinput"></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
    <div>
      <markdown-it-vue-light class="md-body" :content="content" />
    </div>
  </div>
</template>
 <script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import VXETable from 'vxe-table'
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

export default {
  components: {
    MarkdownItVueLight
  },
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Array,
      default: null
    },
    finalData: {
      type: Array,
      default: null
    },
    code: {
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
    ...mapGetters(['sysparam', 'token', 'showFundName', 'showFundClassType']),
    isVisible: {
      get() {
        return this.visable
      },
      set() {
        this.close()
      }
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  watch: {
    isVisible: {
      handler: function (val) {
        if (val) {
          this.getChart(this.code)
        }
      }
    },
    finalData: {
      handler: function (val) {
        if (val) {
          this.initChart('')
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
      latest_time: '',
      tableData: [],
      lowest: 0.9,
      startdate: '',
      range: '',
      content: '',
      showdrop: false,
      startidx: 0,
      max_date: '',
      //   width: this.initWidth(),
      echart: null
    }
  },
  methods: {
    getlatest_time() {
      this.$axios.get('/fof/last_calctime').then((response) => {
        this.latest_time = response.data['latest_time']
      })
    },
    getWts(code) {
      let $this = this
      //   this.$axios.get('/sys/getwts', { params: { "code": this.code } }).then(response=>{
      //     $this.tableData=response.data
      //   })
      this.$axios
        .get('/sys/misc', { params: { 'code': this.code } })
        .then((response) => {
          $this.tableData = response.data
        })
      this.$axios
        .get('/sys/misc', { params: { 'code': 'doc_' + this.code } })
        .then((response) => {
          $this.content = response.data
        })
    },
    async insertEvent(row) {
      const $table = this.$refs.xTable
      const record = {}
      const { row: newRow } = await $table.insertAt(record, row)
      await $table.setActiveCell(newRow, this.cols[0])
    },
    getInsertEvent() {
      const $table = this.$refs.xTable
      const insertRecords = $table.getInsertRecords()
      VXETable.modal.alert(insertRecords.length)
    },
    getSelectionEvent() {
      const $table = this.$refs.xTable
      const selectRecords = $table.getCheckboxRecords()
      VXETable.modal.alert(selectRecords.length)
    },
    saveEvent() {
      const $table = this.$refs.xTable
      const { insertRecords, removeRecords, updateRecords } =
        $table.getRecordset()
      VXETable.modal.alert(
        `insertRecords=${insertRecords.length} removeRecords=${removeRecords.length} updateRecords=${updateRecords.length}`
      )
      this.saveMisc()
    },
    recalc() {
      this.$axios({
        url: '/fof/action',
        data: { 'code': 'calc_job', 'param': this.code }, //
        method: 'POST'
      }).then((response) => {
        console.log(response.data)
      })
    },
    saveMisc() {
      let tabledata = JSON.parse(
        JSON.stringify(this.$refs.xTable.getTableData()['tableData'])
      ).map((row) => {
        delete row['_X_ID']
        return row
      })
      this.$axios({
        method: 'post',
        url: '/sys/misc', // 请求地址
        data: {
          'code': this.code,
          'info': JSON.stringify(tabledata),
          'user': this.token
        }, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      }).then((response) => console.log(response.data))
    },
    resizeChart() {
      this.echart ? this.echart.resize() : ''
    }
  },
  mounted() {
    this.getlatest_time()
    this.getWts(this.code)
    //       this.content=`
    // ## 说明
    // + yeaily return 年化收益
    //     $$ 分子 \\over 分 $$
    //     据计算
    //     $$ \\frac{(期末-期初)}{期初} \\times \\frac{52}{期数} $$

    //      (($期末-期初$) \\div $期初$ -1)*52/周数$
    // + sharpe :

    // `
    // window.addEventListener("resize", this.resizeChart);
  },
  unmounted() {
    // window.removeEventListener("resize", this.resizeChart);
  }
}
</script>

<style lang="scss" scoped>
.katex .mfrac .frac-line {
  display: inline-block;
  width: 100%;
  border-style: solid;
  border-top-width: 1px;
}
</style>