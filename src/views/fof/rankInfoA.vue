<template>
  <div ref="tableContainer" style="height: 100%">
    <vxe-toolbar>
      <template #buttons>
        <vxe-button size="mini" @click="clearSelect">取消</vxe-button>
        <vxe-button size="mini" @click="showRankHis">排名</vxe-button>
        <vxe-button size="mini" @click="showStatHisBatch">指标</vxe-button>
        <vxe-button size="mini" @click="compareData">业绩</vxe-button>
        <vxe-button
          v-if="usermenu.indexOf('holding-info') > -1"
          size="mini"
          @click="compareInvest"
          >已投对比</vxe-button
        >
        <el-date-picker
          style="width: 130px"
          v-model="date"
          value-format="yyyyMMdd"
          format="yyyyMMdd"
          align="right"
          type="date"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <vxe-radio-group v-model="type" size="mini">
          <vxe-radio-button
            v-if="ftype != '投后'"
            label="aas"
            content="AAS"
          ></vxe-radio-button>
          <vxe-radio-button label="cta0" content="CTA0"></vxe-radio-button>
          <vxe-radio-button label="cta1" content="CTA1"></vxe-radio-button>
          <vxe-radio-button label="指增" content="指增"></vxe-radio-button>
          <!---->
          <vxe-radio-button label="I5" content="Z5"></vxe-radio-button>
          <vxe-radio-button label="I3" content="Z3"></vxe-radio-button>
          <vxe-radio-button label="I1" content="Z1"></vxe-radio-button>
          <vxe-radio-button label="中性" content="中性"></vxe-radio-button>
          <vxe-radio-button label="混合" content="混合"></vxe-radio-button>
          <vxe-radio-button label="套利" content="套利"></vxe-radio-button>
          <vxe-radio-button label="期权" content="期权"></vxe-radio-button>
          <vxe-radio-button label="FOF" content="FOF"></vxe-radio-button>
          <vxe-radio-button label="非常规" content="非常规"></vxe-radio-button>
        </vxe-radio-group>
        <vxe-radio-group size="mini" v-model="range" :strict="false">
          <vxe-radio label="quarter" content="3月"></vxe-radio>
          <vxe-radio label="hyr" content="半年"></vxe-radio>
          <vxe-radio label="1yr" content="1年"></vxe-radio>
          <!-- <vxe-radio v-else label="2yr" content="2年"></vxe-radio> -->
        </vxe-radio-group>
        <vxe-button size="mini" @click="exportDataEvent">导出</vxe-button>

        <!-- <vxe-button @click="jumptodash">排名信息</vxe-button> -->
      </template>
    </vxe-toolbar>
    <vxe-table
      @checkbox-change="selectChangeEvent1"
      @checkbox-all="checkAll"
      class="mytable-style"
      border
      ref="rankTable"
      :height="height"
      :align="allAlign"
      size="mini"
      :row-config="{ keyField: 'code', isCurrent: true, isHover: true }"
      show-overflow
      :scroll-y="{ oSize: 500 }"
      :sort-config="{
        trigger: 'cell',
        sortMethod: customSort,
        defaultSort: { field: 'rank', order: 'asc' },
        orders: ['desc', 'asc', null]
      }"
      :data="tableList"
    >
      <vxe-column type="checkbox" width="30" fixed="left"></vxe-column>
      <vxe-column type="seq" width="30" fixed="left"></vxe-column>
      <vxe-column
        width="80"
        title="公司"
        field="company"
        align="left"
        fixed="left"
      >
        <template #default="{ row }">
          <a href="javascript:;" @click="showCompany(row.company_code)">{{
            row.company
          }}</a>
        </template>
      </vxe-column>
      <!-- <vxe-column type="seq" width="60"></vxe-column> -->
      <vxe-column
        width="180"
        field="code"
        align="left"
        :title="prodTitle"
        fixed="left"
        :title-help="{
          message: '默认显示排名前30%和历史平均排名进入前30%次数超过70%的产品'
        }"
      >
        <template #header>
          {{ prodTitle }}
          <br />{{ tableList.length }}
          <vxe-switch
            v-if="usermenu.indexOf('holding-info') > -1"
            v-model="showList"
            open-label="已投"
            :open-value="true"
            close-label="所有"
            :close-value="false"
          ></vxe-switch>
          <vxe-input v-model="filter" @change="filterNames"></vxe-input>
        </template>
        <template #default="{ row }">
          <vxe-button
            @click.native.prevent="addCart(row)"
            type="text"
            status="primary"
            size="small"
            ><i class="iconfont icon-mairu"></i
          ></vxe-button>
          <!-- <vxe-button  @click.native.prevent="addCart(row)" type="text" status="primary" size="small" ><i class="iconfont icon-mairu" ></i></vxe-button> -->
          <!-- &nbsp;<vxe-button  @click.native.prevent="oneKeyBuy(row)" type="text" status="primary" size="small"><i class="iconfont icon-yijiangoumai" ></i></vxe-button> -->
          <a href="javascript:;" @click="showHis(row)">{{
            showFundName(row.code)
          }}</a>
          <!-- <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><i class="el-icon-s-marketing" ></i></el-button>
                           <el-button  @click.native.prevent="showBaseHis(row)" type="text" size="small"><i class="el-icon-s-order" ></i></el-button>
                            <el-button  @click.native.prevent="showBaseInfo(row)" type="text" size="small"><i class="el-icon-info" ></i></el-button> -->
        </template>
      </vxe-column>
      <vxe-column
        v-if="usermenu.indexOf('holding-info') > -1"
        field="marketval"
        width="50"
        sortable
        :title="'持仓(万)'"
      >
        <template #default="{ row }">
          {{ $tools.formatMoney(row['marketval'] / 10000, 0) }}
        </template>
      </vxe-column>
      <vxe-column sortable title="信息" width="80" align="center" field="level">
        <template #default="{ row }">
          <el-button
            @click.native.prevent="showFundHis(row)"
            type="text"
            size="small"
            ><i class="el-icon-s-marketing"></i
          ></el-button>
          <el-button
            @click.native.prevent="showBaseHis(row)"
            type="text"
            size="small"
            ><i class="el-icon-s-order"></i
          ></el-button>
          <el-button
            @click.native.prevent="showStatHis(row)"
            type="text"
            size="small"
            ><i class="el-icon-s-data"></i
          ></el-button>
          <el-button
            @click.native.prevent="showBaseInfo(row)"
            type="text"
            size="small"
            ><i class="el-icon-info"></i
          ></el-button>
        </template>
      </vxe-column>
      <!-- -->
      <vxe-column
        sortable
        title="级别"
        width="36"
        align="center"
        field="level"
        sort-by="lscore"
        :filters="[
          { label: '甲', value: '甲' },
          { label: '乙', value: '乙' },
          { label: '丙', value: '丙' },
          { label: '丁', value: '丁' },
          { label: '戊', value: '戊' }
        ]"
        :title-help="{ message: '根据产品波动率和最大回撤对产品进行分级' }"
      >
      </vxe-column>
      <vxe-column
        field="sub_type"
        width="60"
        sortable
        :title="'子'"
        :filters="[]"
      >
      </vxe-column>
      <vxe-column field="rank" width="40" sortable :title="'rank'">
      </vxe-column>
      <template v-if="type == '非常规'">
        <vxe-column field="fee" width="60" title="fee"></vxe-column>
        <vxe-column
          align="left"
          field="carry1"
          width="160"
          title="carry"
        ></vxe-column>
        <!-- <vxe-column field="perf_comp" width="80"  title="业绩提计方式"  ></vxe-column> -->
        <vxe-column
          align="left"
          field="remark"
          width="240"
          title="备注"
        ></vxe-column>
      </template>
      <template v-else>
        <vxe-column field=" " width="2" sortable :title="' '"> </vxe-column>
        <template v-for="tp of ['hyr', '1yr', '2yr']">
          <vxe-colgroup
            :key="tp"
            :title="
              yrdict[tp] + '排名信息(' + rawlen + ')平均' + avgcnt[range] + '个'
            "
            align="center"
          >
            <vxe-column
              :field="'mean' + winlength[tp]"
              width="48"
              sortable
              :title="'mean%'"
            >
              <template #default="{ row }">
                <span
                  :class="
                    'rank_text_color' +
                    Math.floor(row['mean' + winlength[tp] + '_R'] * 4)
                  "
                  >{{
                    row['mean' + winlength[tp]] == '0.00'
                      ? ''
                      : row['mean' + winlength[tp]]
                  }}</span
                >
              </template>
            </vxe-column>
            <vxe-column
              :field="'listrate' + winlength[tp]"
              width="48"
              sortable
              :title="'listrate%'"
            >
              <template #default="{ row }">
                <span
                  :class="
                    'rank_text_color' +
                    Math.floor((1 - row['listrate' + winlength[tp] + '_R']) * 4)
                  "
                  >{{
                    row['listrate' + winlength[tp]] == '0.00'
                      ? ''
                      : row['listrate' + winlength[tp]]
                  }}</span
                >
              </template>
            </vxe-column>
            <vxe-column
              :key="dkey"
              :field="dkey + winlength[tp]"
              width="48"
              sortable
              :title="dkey + '%'"
              v-for="dkey in ['std']"
            >
              <template #default="{ row }">
                <span
                  :class="
                    'rank_text_color' +
                    Math.floor(row['std' + winlength[tp] + '_R'] * 4)
                  "
                  >{{
                    row['std' + winlength[tp]] == '0.00'
                      ? ''
                      : row['std' + winlength[tp]]
                  }}</span
                >
              </template>
            </vxe-column>
            <vxe-column
              :field="'meand' + winlength[tp]"
              width="48"
              sortable
              :title="'Δrank'"
            >
            </vxe-column>
          </vxe-colgroup>
          <vxe-column
            :key="'blank_' + tp"
            field=" "
            width="2"
            sortable
            :title="' '"
          >
          </vxe-column>
        </template>
      </template>
      <vxe-colgroup :title="yrdict[range] + '指标数据'" align="center">
        <template #header>
          <vxe-radio-group v-model="brange" :strict="false">
            <vxe-radio label="00-6" content="00-6"></vxe-radio>
            <vxe-radio label="0-12" content="0-12"></vxe-radio>
            <vxe-radio label="1224" content="1224"></vxe-radio>
            <vxe-radio label="2436" content="2436 指标数据"></vxe-radio>
          </vxe-radio-group>
        </template>
        <vxe-column field="length" width="48" sortable title="length">
        </vxe-column>
        <vxe-column
          :key="af"
          :width="48"
          sortable
          v-for="af of [
            'yeaily_return',
            'sharpe',
            'calmar',
            'sortino',
            'dd',
            'dd_week',
            'win_ratio',
            'volatility',
            'profit_loss',
            'dd_ratio'
          ]"
          :title="af"
          :field="af"
        >
          <template
            v-if="
              [
                'yeaily_return',
                'sharpe',
                'calmar',
                'sortino',
                'dd',
                'win_ratio',
                'profit_loss'
              ].indexOf(af) > -1
            "
            #default="{ row }"
          >
            <span :class="'rank_text_color' + Math.floor(row[af + '_R'] * 4)">{{
              row[af]
            }}</span>
          </template>
          <!-- <template v-else-if="['dd_ratio'].indexOf(af)>-1" #default="{ row }">
              <span :class="'rank_text_color'+Math.floor(row[af]/25)">{{row[af]}}</span>
            </template> -->
          <template v-else #default="{ row }">
            <span>{{ row[af] }}</span>
          </template>
        </vxe-column>
      </vxe-colgroup>

      <!-- <vxe-column sortable  title="分"  field="lscore" >
          </vxe-column>  -->
    </vxe-table>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showCompanyRanks"
    >
      <vxe-toolbar>
        <template #buttons>
          <vxe-button @click="compareDatac">业绩对比</vxe-button>
          <vxe-radio-group v-model="srange" :strict="false">
            <vxe-radio label="hyr" content="半年"></vxe-radio>
            <vxe-radio label="1yr" content="1年"></vxe-radio>
            <vxe-radio
              v-if="ftype == '投后'"
              label="quarter"
              content="3月"
            ></vxe-radio>
            <vxe-radio v-else label="2yr" content="2年"></vxe-radio>
          </vxe-radio-group>
        </template>
      </vxe-toolbar>
      <vxe-table
        ref="companyTable"
        :align="allAlign"
        size="mini"
        :row-config="{ keyField: 'code', isCurrent: true, isHover: true }"
        show-overflow
        :sort-config="{
          trigger: 'cell',
          defaultSort: { field: 'rank', order: 'asc' },
          orders: ['desc', 'asc', null]
        }"
        :data="company_ranks"
      >
        <vxe-column type="checkbox" width="30" fixed="left"></vxe-column>
        <!-- <vxe-column type="seq" width="60"></vxe-column> -->
        <vxe-column
          width="180"
          field="code"
          align="left"
          :title="prodTitle"
          fixed="left"
          :title-help="{
            message: '默认显示排名前30%和历史平均排名进入前30%次数超过70%的产品'
          }"
        >
          <template #default="{ row }">
            <!-- <vxe-button  @click.native.prevent="addCart(row)" type="text" status="primary" size="small" ><i class="iconfont icon-mairu" ></i></vxe-button> -->
            <!-- <vxe-button  @click.native.prevent="addCart(row)" type="text" status="primary" size="small" ><i class="iconfont icon-mairu" ></i></vxe-button> -->
            <!-- &nbsp;<vxe-button  @click.native.prevent="oneKeyBuy(row)" type="text" status="primary" size="small"><i class="iconfont icon-yijiangoumai" ></i></vxe-button> -->
            <a href="javascript:;" @click="showHis(row)">{{
              showFundName(row.code)
            }}</a>
            <!-- <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><i class="el-icon-s-marketing" ></i></el-button>
                           <el-button  @click.native.prevent="showBaseHis(row)" type="text" size="small"><i class="el-icon-s-order" ></i></el-button>
                            <el-button  @click.native.prevent="showBaseInfo(row)" type="text" size="small"><i class="el-icon-info" ></i></el-button> -->
          </template>
        </vxe-column>

        <!-- -->
        <vxe-column
          field="rank_type"
          width="80"
          sortable
          title=""
          :filters="[]"
        >
        </vxe-column>
        <vxe-column
          field="sub_type"
          width="80"
          sortable
          :title="'子'"
          :filters="[]"
        >
        </vxe-column>
        <vxe-column field="rank" width="40" sortable :title="'rank'">
        </vxe-column>
        <template v-if="type == '高费率'">
          <vxe-column field="fee" width="60" title="fee"></vxe-column>
          <vxe-column
            align="left"
            field="carry"
            width="160"
            title="carry"
          ></vxe-column>
          <!-- <vxe-column field="perf_comp" width="80"  title="业绩提计方式"  ></vxe-column> -->
          <vxe-column
            align="left"
            field="remark"
            width="240"
            title="备注"
          ></vxe-column>
        </template>
        <template v-else>
          <vxe-column field=" " width="2" sortable :title="' '"> </vxe-column>
          <template v-for="tp of ['hyr', '1yr', '2yr']">
            <vxe-colgroup
              :key="tp"
              :title="
                yrdict[tp] +
                '排名信息(' +
                rawlen +
                ')平均' +
                avgcnt[range] +
                '个'
              "
              align="center"
            >
              <vxe-column
                :field="'mean' + winlength[tp]"
                width="48"
                sortable
                :title="'mean%'"
              >
                <template #default="{ row }">
                  <span
                    :class="
                      'rank_text_color' +
                      Math.floor(row['mean' + winlength[tp] + '_R'] * 4)
                    "
                    >{{
                      row['mean' + winlength[tp]] == '0.00'
                        ? ''
                        : row['mean' + winlength[tp]]
                    }}</span
                  >
                </template>
              </vxe-column>
              <vxe-column
                :field="'listrate' + winlength[tp]"
                width="48"
                sortable
                :title="'listrate%'"
              >
                <template #default="{ row }">
                  <span
                    :class="
                      'rank_text_color' +
                      Math.floor(
                        (1 - row['listrate' + winlength[tp] + '_R']) * 4
                      )
                    "
                    >{{
                      row['listrate' + winlength[tp]] == '0.00'
                        ? ''
                        : row['listrate' + winlength[tp]]
                    }}</span
                  >
                </template>
              </vxe-column>
              <vxe-column
                :key="dkey"
                :field="dkey + winlength[tp]"
                width="48"
                sortable
                :title="dkey + '%'"
                v-for="dkey in ['std']"
              >
                <template #default="{ row }">
                  <span
                    :class="
                      'rank_text_color' +
                      Math.floor(row['std' + winlength[tp] + '_R'] * 4)
                    "
                    >{{
                      row['std' + winlength[tp]] == '0.00'
                        ? ''
                        : row['std' + winlength[tp]]
                    }}</span
                  >
                </template>
              </vxe-column>
              <vxe-column
                :field="'meand' + winlength[tp]"
                width="48"
                sortable
                :title="'Δrank'"
              >
              </vxe-column>
            </vxe-colgroup>
            <vxe-column
              :key="'blank_' + tp"
              field=" "
              width="2"
              sortable
              :title="' '"
            >
            </vxe-column>
          </template>
        </template>
        <vxe-colgroup :title="yrdict[range] + '指标数据'" align="center">
          <template #header>
            <vxe-radio-group v-model="arange" :strict="false">
              <vxe-radio label="00-6" content="00-6"></vxe-radio>
              <vxe-radio label="0-12" content="0-12"></vxe-radio>
              <vxe-radio label="1224" content="1224"></vxe-radio>
              <vxe-radio label="2436" content="2436 指标数据"></vxe-radio>
            </vxe-radio-group>
          </template>
          <vxe-column field="length" width="48" sortable title="length">
          </vxe-column>
          <vxe-column
            :key="af"
            :width="48"
            sortable
            v-for="af of [
              'yeaily_return',
              'sharpe',
              'calmar',
              'sortino',
              'dd',
              'dd_week',
              'win_ratio',
              'volatility',
              'profit_loss',
              'dd_ratio'
            ]"
            :title="af"
            :field="af"
          >
            <template
              v-if="
                [
                  'yeaily_return',
                  'sharpe',
                  'calmar',
                  'sortino',
                  'dd',
                  'win_ratio',
                  'profit_loss'
                ].indexOf(af) > -1
              "
              #default="{ row }"
            >
              <span
                :class="'rank_text_color' + Math.floor(row[af + '_R'] * 4)"
                >{{ row[af] }}</span
              >
            </template>
            <!-- <template v-else-if="['dd_ratio'].indexOf(af)>-1" #default="{ row }">
              <span :class="'rank_text_color'+Math.floor(row[af]/25)">{{row[af]}}</span>
            </template> -->
            <template v-else #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
          </vxe-column>
        </vxe-colgroup>

        <!-- <vxe-column sortable  title="分"  field="lscore" >
          </vxe-column>  -->
      </vxe-table>
    </el-dialog>
  </div>
</template>

 <script>
const level_dic = {
  common: [
    [-0.03, -0.05, -0.07, -0.1],
    [0.06, 0.1, 0.13, 0.15]
  ],
  cta1: [
    [-0.13, -0.15, -0.2],
    [0.15, 0.2, 0.25]
  ]
}
const lvs = ['丁', '丙', '乙', '甲']
const class_dict = {
  cta0: ['CTA'],
  cta1: ['CTA'],
  中性: ['中性'],
  指增: ['指增', '可转债'],
  套利: ['套利', '可转债'],
  期权: ['期权'],
  混合: ['混合'],
  FOF: ['FOF'],
  aas: ['中性', 'CTA', '期权', '套利', '混合']
}
function isNumber(val) {
  if (parseFloat(val).toString() == 'NaN') {
    return false
  } else {
    return true
  }
}

import { mapGetters, mapMutations, mapState } from 'vuex'
import XLSX from 'xlsx'
import Vue from 'vue'
import FileSaver from 'file-saver'
import Bus from '@/store/bus.js'
// const sort_key =['mean26','mean52','mean104','listrate26','listrate52','listrate104','std26','std52','std104','yeaily_return','sharpe', 'calmar', 'sortino', 'dd', 'win_ratio']

const sort_key_r = ['mean26', 'mean52', 'mean104', 'std26', 'std52', 'std104']
const sort_key = [
  'listrate26',
  'listrate52',
  'listrate104',
  'yeaily_return',
  'sharpe',
  'calmar',
  'sortino',
  'dd',
  'win_ratio'
]
const sort_by = (field, reverse, primer) => {
  const key = primer
    ? function (x) {
        return primer(x[field])
      }
    : function (x) {
        return x[field]
      }

  reverse = !reverse ? 1 : -1

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a))
  }
}
export default {
  //   components: {
  //     SankeyChart,
  // },
  props: {
    filters: {
      type: Object,
      default: { weight_type: '' }
    },
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
  watch: {
    watch: {
      $route: {
        handler(n) {
          console.log(n)
          let params = n.params
          if (this.filters) {
            params = this.filters
          }
          // this.getProducts()
          // 初始化操作
        },
        immediate: true,
        deep: true
      }
    },
    type: {
      handler(n) {
        if (this.type == '非常规') {
          this.showList = false
        }
        this.getProducts()
      }
    },
    showList: {
      handler(n) {
        this.filterList()
      }
    },
    range: {
      handler(n) {
        this.getProducts()
      }
    },
    srange: {
      handler(n) {
        this.getComanyPords()
      }
    },
    brange: {
      handler(n) {
        this.getBaseInfo()
      }
    },
    arange: {
      handler(n) {
        this.getBaseInfoA()
      }
    },
    date: {
      handler(n) {
        this.getProducts()
      }
    }
  },
  computed: {
    rankTitle: {
      get() {
        return '排名(' + this.tableData.length + ')'
      }
    },
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
    prodTitle: {
      get() {
        return '产品名称/' + this.calcdate
      }
    },
    ...mapState(['foflist', 'holding', 'mholding']),
    ...mapGetters(['sysparam', 'token', 'showFundName', 'usermenu'])
  },
  data() {
    return {
      statdict: {},
      company_ranks: [],
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
          // {
          //   text: '7日',
          //   onClick(picker) {
          //     picker.$emit('pick', '20230101')
          //   }
          // },
          // {
          //   text: '14日',
          //   onClick(picker) {
          //     picker.$emit('pick', '20230101')
          //   }
          // }
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
    customSort({ data, sortList }) {
      const sortItem = sortList[0]
      console.log(sortItem)
      // 取出第一个排序的列
      const { property, order } = sortItem
      let list = []
      if (order === 'asc') {
        // 例如：实现中英文混排，按照字母排序
        list = data.sort((a, b) => {
          let ret = a[property] - b[property]
          console.log(a['mean26'])
          if (a['mean26'] < 0.01) {
            ret = 1
          }
          if (b['mean26'] < 0.01) {
            ret = -1
          }
          return ret
        })
      }
      if (order === 'desc') {
        list = data.sort((b, a) => {
          let ret = a[property] - b[property]
          console.log(a['mean26'])
          if (a['mean26'] < 0.01) {
            ret = -1
          }
          if (b['mean26'] < 0.01) {
            ret = 1
          }
          return ret
        })
      }
      return list
    },

    getWeeks() {
      this.$axios.get('/fof/lastweeks?cnt=10').then((res) => {
        let wks = res.data['weeks']
        for (let wk of wks) {
          this.pickerOptions.shortcuts.push({
            text: wk,
            onClick: (picker) => {
              picker.$emit('pick', wk)
            }
          })
        }
        console.log(this.pickerOptions)
      })
    },
    getBaseInfoA() {
      this.$axios
        .get('/fof/baseinfoNew', {
          params: {
            date: this.date,
            type: this.type,
            range: this.arange,
            code: this.company_ranks.map((row) => row.code).join()
          }
        })
        .then((res) => {
          this.company_ranks.map((r) => {
            r = Object.assign(r, res.data[r['code']])
            for (let ak in r) {
              if (!isNaN(parseFloat(r[ak]))) {
                r[ak] = Math.floor(r[ak] * 100) / 100
              }
            }
            return r
          })
        })
    },
    getComanyPords() {
      this.$axios
        .get('/fof/rank4', {
          params: {
            company_code: this.company_code,
            ftype: this.ftype,
            date: this.date,
            type: this.type,
            range: this.srange,
            weight_type: this.filters['weight_type']
          }
        })
        .then((response) => {
          let rets = response.data
          Vue.set(this, 'company_ranks', rets)
          this.company_ranks = response.data
          this.getBaseInfoA()
          this.showCompanyRanks = true
        })
    },
    showCompany(ccode) {
      this.company_code = ccode
      this.getComanyPords()
    },
    setSelect() {
      let selrow = this.tableData.filter(
        (row) => this.multipleSelection.indexOf(row['code']) > -1
      )
      this.$refs.rankTable.setCheckboxRow(selrow, true)
    },
    clearSelect() {
      this.$refs.rankTable.clearCheckboxRow()
      this.multipleSelection = []
    },
    checkAll({ checked, $event }) {
      if (checked) {
        this.multipleSelection = this.tableList.map((r) => r['code'])
      } else {
        this.multipleSelection = []
      }
      console.log(this.multipleSelection)
    },
    selectChangeEvent1({
      checked,
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      $event
    }) {
      if (checked && this.multipleSelection.indexOf(row['code'] < 0)) {
        this.multipleSelection.push(row['code'])
      } else {
        this.multipleSelection = this.multipleSelection.filter(
          (r) => r != row['code']
        )
      }
    },
    oneKeyBuy(row) {
      if (row['code']) {
        Bus.$emit('oneKeyBuy', { b_code: row['code'], stage: '待投资' })
      }
    },
    deleteByCode(code) {
      let nlen = this.tableData.length
      for (let i = 0; i < nlen; i++) {
        if (this.tableData[i]['code'] == code) {
          this.tableData.splice(i, 1)
          return
        }
      }
    },
    filterCompay() {
      let cmap = {}
      let tlen = this.tableData.length - 1
      let todel = 0
      for (let a = 0; a < tlen; ) {
        let arow = this.tableData[a]
        if (arow && arow['company_code'] && cmap[arow['company_code']]) {
          let old = cmap[arow['company_code']]
          let diff = Math.abs(arow['yeaily_return'] - old['yeaily_return'])
          if (diff <= 5) {
            if (arow['length'] > old['length']) {
              console.log(
                `#########${arow['company_code']}删除了前面产品${old['code']}:${old['length']}——${old['rankF']}`
              )
              if (
                this.holding.filter((hd) => hd['b_code'] == old['code'])
                  .length > 0
              ) {
                console.log(`#########已购产品${old['code']}不删除`)
                a++
                continue
              }
              this.deleteByCode(old['code'])
              cmap[arow['company_code']] = arow
              todel++
            } else {
              console.log(
                `#########${arow['company_code']}删除了后面产品${arow['code']}:${arow['length']}——${old['rankF']}`
              )
              if (
                this.holding.filter((hd) => hd['b_code'] == arow['code'])
                  .length > 0
              ) {
                console.log(`#########已购产品${arow['code']}不删除`)
                a++
                continue
              }
              this.deleteByCode(arow['code'])
              todel++
            }
            //删除游标不增加
          } else {
            console.log(
              `####${arow['company_code']}:${old['code']}:${arow['code']}收益率差值${diff}超过5%不删除`
            )
            a++
          }
        } else {
          if (arow && arow['company_code']) {
            cmap[arow['company_code']] = arow
          }
          a++
        }
      }
      console.log(cmap)
      console.log(`总计删除:${todel}`)
    },
    filterNames() {
      if (this.filter) {
        this.tableList = this.tableData.filter((row) => {
          return row['name'].indexOf(this.filter) > -1
        })
      } else {
        this.filterList()
      }
    },
    filterList() {
      if (this.showList) {
        this.tableList = this.tableData.filter((row) => {
          return (
            this.holding.filter((hd) => hd['b_code'] == row['code']).length > 0
          )
          //   for(let key in this.yrdict){

          //     if(isNumber(row["mean"+this.winlength[key]])&&row["mean"+this.winlength[key]]<=0.3){
          //       return true
          //     }
          //     if(isNumber(row["listrate"+this.winlength[key]])&&row["listrate"+this.winlength[key]]>=0.7){
          //       return true
          //     }
          //     if(isNumber(row['rankF_'+key+"_r"])&&(row['rankF_'+key+"_r"]/this.rgdict[key])<=0.3){
          //       return true
          //     }
          //   }
          // return false
        })
      } else {
        this.tableList = this.tableData
      }
      this.setSelect()
    },
    cellClass1({ row, rowIndex, column, columnIndex }) {
      if (row[column['field']] < 0.25) {
        return 'col-green'
      }
      if (row[column['field']] < 0.5) {
        return ''
      }
      if (row[column['field']] < 0.75) {
        return 'col-orange'
      }
      if (row[column['field']] >= 0.75) {
        return 'col-red'
      }
      return ''
    },
    cellClass2({ row, rowIndex, column, columnIndex }) {
      if (row[column['field']] < 0.25) {
        return 'col-red'
      }
      if (row[column['field']] < 0.5) {
        return 'col-orange'
      }
      if (row[column['field']] < 0.75) {
        return ''
      }
      if (row[column['field']] >= 0.75) {
        return 'col-green'
      }
      return ''
    },
    cellClassBg({ row, rowIndex, column, columnIndex }) {
      let clr = ''
      if (sort_key.indexOf(column['field']) > -1) {
        clr = this.genColor(row[column['field'] + '_R'])
        return { color: clr }
      } else if (sort_key_r.indexOf(column['field']) > -1) {
        clr = this.genColor(1 - row[column['field'] + '_R'])
        return { color: clr }
      } else if (column['field'] == 'dd_ratio') {
        clr = this.genColor(1 - row[column['field']] / 100)
        return { color: clr }
      }
      return { color: clr }
      // if(['yeaily_return','sharpe', 'calmar', 'sortino', 'dd', 'win_ratio'].indexOf(column['field'])>-1){
      //   if(this.statdict[column['field']]){
      //   let rg=(row[column['field']]-this.statdict[column['field']]["min"])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      //
      //             }
      // }
      // else if(column['field']&&column['field'].startsWith("std")){
      //   let rg=(this.statdict[column['field']]["max"]-row[column['field']])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      // let clr=this.genColor(rg)
      //       return {
      //               color: clr
      //             }}
      // else if(column['field']&&column['field'].startsWith("mean")&&this.statdict[column['field']]){
      //   let rg=(this.statdict[column['field']]["max"]-row[column['field']])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      // let clr=this.genColor(rg)
      //       return {
      //               color: clr
      //             }}
      //   else if(column['field']&&column['field'].startsWith("listrate")){
      //   let rg=(row[column['field']]-this.statdict[column['field']]["min"])/(this.statdict[column['field']]["max"]-this.statdict[column['field']]["min"])
      // let clr=this.genColor(rg)
      //       return {
      //               color: clr
      //             }}
      // else if(column['field']&&column['field']=='dd_ratio'){
      //       return { color:row[column['field']]>=90?'#66ff00':''}
      // }
    },
    nclassify(row) {
      let lmts = level_dic['common']
      let lcnt = 4
      if (this.type == 'cta1') {
        lmts = level_dic['cta1']
        lcnt = 3
      }
      let score = 0
      for (let i = 0; i < lcnt; i++) {
        if (row['dd'] >= lmts[0][i] && row['volatility'] <= lmts[1][i]) {
          score++
        }
      }
      row['lscore'] = score
      row['level'] = lvs[score - 1]
      return lvs[score - 1]
    },
    classify(row) {
      let key = this.type
      row['level'] = '丁'
      let conf = this.cls_gap['aas']
      if (this.cls_gap[this.type]) {
        conf = this.cls_gap[this.type]
      }
      let ranks = ['丙', '乙', '甲']
      for (var lvk in conf['level']) {
        let alvs = conf['level'][lvk]
        for (var i in alvs) {
          if (row[lvk] > alvs[i]) {
            row['level'] = ranks[i]
          }
        }
      }
      return row['level']
    },

    addCart(row) {
      if (row['code']) {
        Bus.$emit('addcart', {
          code: row['code'],
          name: this.showFundName(row['code'])
        })
      }
    },
    showFundHis(row) {
      Bus.$emit('showChart', {
        cur_code: row.code,
        diagName: 'hisChart',
        wk: '1'
      })
    },
    jumptodash() {
      this.$router.push({ name: 'rankinfo' })
      this.$store.commit('selectMenu', 'rankinfo')
    },
    showHis(row) {
      console.log(row)
      Bus.$emit('showChart', {
        cur_code: row.code,
        rg: this.range,
        diagName: 'rankChart'
      })
    },
    showRankHis() {
      // let sels=this.$refs.rankTable.getCheckboxRecords()
      if (this.multipleSelection.length > 0)
        Bus.$emit('showChart', {
          cur_code: this.multipleSelection.join(','),
          rg: this.range,
          diagName: 'rankChart'
        })
    },
    showStatHisBatch() {
      // let sels=this.$refs.rankTable.getCheckboxRecords()
      if (this.multipleSelection.length > 0)
        Bus.$emit('showChart', {
          cur_code: this.multipleSelection.join(','),
          rg: this.range,
          diagName: 'statChart'
        })
    },
    showBaseHis(row) {
      // let sels=this.$refs.rankTable.getCheckboxRecords()
      Bus.$emit('showChart', {
        cur_code: row.code,
        rg: this.range,
        diagName: 'baseChart'
      })
    },
    showStatHis(row) {
      // let sels=this.$refs.rankTable.getCheckboxRecords()
      Bus.$emit('showChart', {
        cur_code: row.code,
        rg: this.range,
        diagName: 'statChart'
      })
    },
    showBaseInfo(row) {
      // let sels=this.$refs.rankTable.getCheckboxRecords()
      Bus.$emit('showInfo', { cur_code: row.code })
    },
    compareData() {
      if (this.multipleSelection.length > 0)
        Bus.$emit('showChart', {
          cur_code: this.multipleSelection.join(','),
          wk: '1',
          diagName: 'fullDialog'
        })
    },
    compareDatac() {
      console.log(this.$refs.companyTable.getCheckboxRecords())
      let codes = this.$refs.companyTable
        .getCheckboxRecords()
        .map((r) => r['code'])
      Bus.$emit('showChart', {
        cur_code: codes.join(','),
        diagName: 'fullDialog'
      })
    },
    compareInvest() {
      let ntype = this.type
      console.log(ntype)
      if (ntype.startsWith('I')) {
        ntype = '指增'
      }
      let clss = class_dict[ntype]
      console.log(clss)
      // let sels=this.$refs.rankTable.getCheckboxRecords()
      // if(sels.length==0){
      //   sels=this.tableList
      // }
      console.log(
        this.foflist.filter(
          (row) =>
            this.holding.filter((hd) => hd['b_code'] == row['code']).length > 0
        )
      )
      let holds = this.foflist
        .filter(
          (row) =>
            this.holding.filter(
              (hd) =>
                hd['b_code'] == row['code'] &&
                (ntype == 'aas' || ntype == row['type'])
            ).length > 0
        )
        .filter((row) => clss.indexOf(row['class_type']) > -1)
        .map((row) => row['code'])
      // if (['中性', '混合'].indexOf(ntype) > -1 && holds.indexOf('ST8876') < 0) {
      //   holds.push('ST8876')
      // }

      console.log(holds)
      let sels = this.multipleSelection.concat(holds)
      Bus.$emit('showChart', {
        cur_code: sels.join(','),
        diagName: 'compareTable'
      })
    },
    exportDataEvent() {
      const header = XLSX.utils.table_to_sheet(
        this.$refs.rankTable.$el.querySelector(
          '.body--wrapper>.vxe-table--header'
        )
      )
      const workBook = XLSX.utils.table_to_sheet(
        this.$refs.rankTable.$el.querySelector(
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
      XLSX.writeFile(nwb, '排名信息.xlsx')
    },
    getBaseInfo() {
      // this.$refs.rankTable.loadData([])
      let that = this
      console.log(this.holding)
      this.$axios
        .get('/fof/baseinfoNew', {
          params: {
            date: this.date,
            type: this.type,
            range: this.brange,
            code: this.tableData.map((row) => row.code).join()
          }
        })
        .then((response) => {
          this.baseData = response.data
          this.tableData.map((row) => {
            row['marketval'] = 0
            this.trank[row.code] = {}
            if (this.baseData[row.code]) {
              row['company_code'] = this.baseData[row.code]['company_code']
              //获取持仓信息 待优化
              if (this.mholding[row['code']]) {
                console.log('存在持仓信息')
                row['marketval'] = this.mholding[row['code']]
              } else {
                let holds = this.holding.filter(
                  (hd) => hd['b_code'] == row['code']
                )
                if (holds.length > 0) {
                  row['marketval'] = holds.reduce((prev, r) => {
                    return prev + r['marketval']
                  }, 0)
                }
              }

              row['dd_ratio'] = this.$tools.formatMoney(
                (this.baseData[row.code]['nowdrop'] /
                  this.baseData[row.code]['dd']) *
                  100,
                2
              )
              for (let af of [
                'sharpe',
                'calmar',
                'sortino',
                'dd',
                'win_ratio',
                'yeaily_return',
                'volatility',
                'profit_loss'
              ]) {
                let digi = 2
                if (this.baseData[row.code][af] >= 10) {
                  digi = 1
                }
                if (
                  af == 'yeaily_return' ||
                  af == 'win_ratio' ||
                  af == 'volatility' ||
                  af == 'dd'
                ) {
                  row[af] = this.$tools.formatMoney(
                    this.baseData[row.code][af] * 100,
                    digi
                  )
                } else {
                  row[af] = this.$tools.formatMoney(
                    this.baseData[row.code][af],
                    digi
                  )
                }
                if (isNumber(row[af])) {
                  let tmp = this.statdict[af]
                  if (tmp) {
                  } else {
                    tmp = { max: row[af], min: row[af] }
                    this.statdict[af] = tmp
                  }
                  if (row[af] > tmp['max']) {
                    tmp['max'] = parseFloat(row[af])
                  }
                  if (row[af] < tmp['min']) {
                    tmp['min'] = parseFloat(row[af])
                  }
                }
                row[af + '_R'] = this.baseData[row.code][af + '_R']
              }
              row['dd_week'] = this.baseData[row.code]['dd_week']
              row['length'] = this.baseData[row.code]['tlength']
            }
            // this.nclassify(row)
            return row
          })
          console.log(this.tableData)
          // for var prop in ['yeaily_return','sharpe', 'calmar', 'sortino', 'dd', 'win_ratio']:
          // this.tableData.sort(sort_by('price', true, parseFloat))
          // this.filterCompay()
          this.filterNames()

          // this.$nextTick(()=>{
          this.$refs.rankTable.setFilter(
            this.$refs.rankTable.getColumnByField('sub_type'),
            this.subtypes.map((st) => {
              return { label: st, value: st }
            })
          )
          let sc = { field: 'rank', order: 'asc' }
          for (let as of this.$refs.rankTable.getSortColumns()) {
            sc['field'] = as['field']
            sc['order'] = as['asc']
            break
          }
          // this.$refs.rankTable.getSortColumns()
          this.$refs.rankTable.loadData(this.tableList)
          this.setSelect()
          // this.$refs.rankTable.sort(sc)
          // })
        })
        .catch((error) => {
          console.log(error)
        })
    },

    rgbaToHex(color) {
      var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',')
      var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)

      return (
        '#' +
        ('0' + r.toString(16)).slice(-2) +
        ('0' + g.toString(16)).slice(-2) +
        ('0' + b.toString(16)).slice(-2)
      )
    },

    genColor(n) {
      //       黄色（深黄）#FFB90F
      // 黄色（中黄）#EEC900
      // 绿色（深绿）#0ce91f69
      // 绿色（中绿）#88b924d3
      let colors = ['#FFFFFF', '#FFB90F', '#229954', '#FFFFFF']
      let color = '#FFFFFF'
      if (n >= 0.75) {
        color = '#ff0000'
      } else if (n >= 0.5) {
        color = '#FFB90F'
      } else if (n <= 0.25) {
        color = '#229954'
      }
      console.log(`${n}  ${n * 4} ${color}`)
      return color

      // let halfMax = 0.5  //最大数值的二分之一
      //   //var 百分之一 = (单色值范围) / halfMax;  单颜色的变化范围只在50%之内
      //   var one = 255 / halfMax;
      //   var r = 0;
      //   var g = 0;
      //   var b = 0;

      //   if (n < halfMax) {
      //     // 比例小于halfMax的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.
      //     r = one * n;
      //     g = 255;
      //   }

      //   if (n >= halfMax) {
      //     // 比例大于halfMax的时候绿色是越来越少的,直到0 变为纯红
      //     g = (255 - ((n - halfMax) * one)) < 0 ? 0 : (255 - ((n - halfMax) * one))
      //     r = 255;

      //   }
      //   r = parseInt(r);// 取整
      //   g = parseInt(g);// 取整
      //   b = parseInt(b);// 取整

      //   // console.log(r,g,b)
      //   return this.rgbaToHex("rgb(" + r + "," + g + "," + b + ")");
    },
    getProducts() {
      this.$axios
        .get('/fof/rank3', {
          params: {
            ftype: this.ftype,
            date: this.date,
            type: this.type,
            range: this.range,
            weight_type: this.filters['weight_type']
          }
        })
        .then((response) => {
          this.rgdict = {}
          this.subtypes = []
          this.rawlen = response.data.length
          this.tableData = response.data.map((row) => {
            row['name'] = this.showFundName(row['code'])
            if (this.subtypes.indexOf(row['sub_type']) < 0) {
              this.subtypes.push(row['sub_type'])
            }
            for (var key of [
              'mean26',
              'mean52',
              'mean104',
              'listrate26',
              'listrate52',
              'listrate104',
              'std26',
              'std52',
              'std104'
            ]) {
              if (row[key]) {
                row[key] = this.$tools.formatMoney(
                  parseFloat(row[key]) * 100,
                  2
                )
              }
            }

            for (let rg of ['hyr', '1yr', '2yr']) {
              //   if(row['rankF_'+rg]){
              //     row['rankF_'+rg+'_r']=row['rankF_'+rg].split("-")[0]
              //     row['meand_'+rg]=row['meanr_'+rg]-row['rankF_'+rg+'_r']

              //     this.rgdict[rg]=row['rankF_'+rg].split("-")[1]
              //   }
              row['meand' + this.winlength[rg]] =
                row['meanr' + this.winlength[rg]] - row['rank']
            }
            // for(let key in row){
            //     if(['mean26','mean52','mean104','listrate26','listrate52','listrate104','std26','std52','std104'].indexOf(key)>-1){
            //       row[key]=this.$tools.formatMoney((parseFloat(row[key])*100),2)
            //      if(isNumber(row[key])){
            //         let tmp=this.statdict[key]
            //         if(tmp){

            //         }else{
            //           tmp={"max":row[key],"min":row[key]}
            //           this.statdict[key]=tmp
            //         }
            //         if(row[key]>tmp["max"]){
            //           tmp["max"]=parseFloat(row[key])
            //         }
            //         if(row[key]<tmp["min"]){
            //           tmp["min"]=parseFloat(row[key])
            //         }
            //       }
            //     }
            //     // if(['sharpe', 'calmar', 'sortino', 'dd', 'win_ratio','yeaily_return', 'volatility'].indexOf(key)>-1){
            //     //                       let fcnt=2
            //     //                       let rval=parseFloat(row[key])
            //     //                       if(rval>=10){
            //     //                         fcnt=1
            //     //                       }
            //     //                       row[key]=rval.toFixed(fcnt)
            //     // }
            //   }
            return row
          })
          console.log(this.statdict)
          if (this.tableData && this.tableData.length > 0) {
            this.calcdate = this.tableData[0]['date']
          }
          this.$nextTick(() => {
            this.getBaseInfo()
          })
          this.$axios
            .get('/fof/rankstat', {
              params: { ftype: this.ftype, date: this.date, type: this.type }
            })
            .then((response) => {
              this.avgcnt = response.data
              for (let k in this.avgcnt) {
                this.avgcnt[k] = parseInt(this.avgcnt[k])
              }
            })
          if (this.type == '非常规') {
            this.$axios
              .get('/fof/list', { params: { scale: '高费率,黑名单,不可投' } })
              .then((response) => {
                let scalelist = response.data
                this.tableData.map((row) => {
                  let infos = scalelist.filter(
                    (info) => info['code'] == row['code']
                  )
                  if (infos.length == 1) {
                    let finfo = infos[0]
                    row['fee'] = finfo['fee']
                    row['carry'] = finfo['carry']
                    row['carry1'] = finfo['carry1']
                    row['perf_comp'] = finfo['perf_comp']
                    row['remark'] = finfo['remark']
                  }
                  return row
                })
              })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted() {
    // if (this.ftype == '投后') {
    //   this.range = 'quarter'
    // } else {
    this.date = this.$moment().format('YYYYMMDD')
    // console.log('xxxxxmounted')
    // this.getWeeks()
    // }
    //this.getProducts();
  },
  created() {
    // this.getMisc("fof_action")
    console.log('xxxxxcreated')
    this.getWeeks()
    Bus.$on('cartchart', (arg) => {
      var selcode = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selcode += this.multipleSelection[i] + ','
      }
      console.log(selcode)
      console.log(arg)
      Bus.$emit('showChart', {
        cur_code: selcode + arg,
        diagName: 'fullDialog'
      })
      // this.showcomapre(selcode + arg)
      // this.showChartByCodes(arg)
    })
  }
}
</script>
<style lang="scss"  >
.vxe-button + .vxe-button {
  margin-left: 0px;
  padding-right: 0px;
  padding-left: 0px;
  margin-right: 0px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.rank_text_color0 {
  color: #ff0000;
}
.rank_text_color1 {
  color: #ffb90f;
}
.rank_text_color3 {
  color: #229954;
}
.rank_text_color4 {
  color: #229954;
}
.rank_text_color2 {
  color: #000000;
}
.mytable-style .col--group {
  border: 2px;
}
.mytable-style .vxe-cell {
  padding-right: 2px;
  padding-left: 2px;
}
.mytable-style .vxe-body--row.row-green {
  background-color: #187;
  color: #fff;
}
.mytable-style .vxe-header--column.col-blue {
  background-color: #2db7f5;
  color: rgb(170, 8, 8);
}
.mytable-style .vxe-body--column.col-red {
  color: #ff0000;
  // color: #fff;
}
.mytable-style .vxe-body--column.col-yellow {
  color: yellow;
  // color: #000;
}
.mytable-style .vxe-body--column.col-green {
  color: #006400;
  //color: #000;
}
.mytable-style .vxe-body--column.col-yellowgreen {
  color: yellowgreen;
  //color: #fff;
}
</style>
