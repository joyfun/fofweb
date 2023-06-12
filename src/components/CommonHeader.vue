<template>
  <div>
    <header>
      <div class="l-content">
        <el-button type="primary" icon="el-icon-menu" size="mini"></el-button>
        <!-- <el-tabs v-model="activeName" @tab-click="handleTabClick" type="border-card">
    <el-tab-pane label="投资渠道" name="company">投资渠道</el-tab-pane>
    <el-tab-pane label="尽职调查" name="invest">尽职调查</el-tab-pane>
    <el-tab-pane label="投资决策" name="decision">投资决策</el-tab-pane>
    <el-tab-pane label="投后管理" name="after">投后管理</el-tab-pane>
    <el-tab-pane label="系统设置" name="sys">系统设置</el-tab-pane>
  </el-tabs> -->
        <!-- <el-breadcrumb separator="/">
                  <el-breadcrumb-item >首页</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('company')">投资渠道</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('invest')">尽职调查</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('decision')">投资决策</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('after')">投后管理</el-breadcrumb-item>
                  <el-breadcrumb-item @click="changeMenu('sys')">系统设置</el-breadcrumb-item> 

                 
        </el-breadcrumb> -->
        <el-row :gutter="5" v-if="!$isElectron">
          <el-button-group>
            <el-button @click="changeMenu('company')">投资渠道</el-button>
            <el-button @click="changeMenu('invest')">尽职调查</el-button>
            <el-button @click="changeMenu('decision')">投资决策</el-button>
            <el-button @click="changeMenu('after')">投后管理</el-button>
            <el-button @click="changeMenu('datamag')">数据管理</el-button>
            <el-button @click="changeMenu('sys')">系统设置</el-button>
          </el-button-group>

          <!-- <el-col :span="3"><div @click="changeMenu('company')" class="grid-content bg-purple-light">投资渠道</div></el-col>
  <el-col :span="3"><div @click="changeMenu('invest')" class="grid-content bg-purple-light">尽职调查</div></el-col>
  <el-col :span="3"><div @click="changeMenu('decision')" class="grid-content bg-purple-light">投资决策</div></el-col>
  <el-col :span="3"><div @click="changeMenu('after')" class="grid-content bg-purple-light">投后管理</div></el-col>
  <el-col :span="3"><div @click="changeMenu('sys')" class="grid-content bg-purple-light">系统设置</div></el-col> -->
        </el-row>
      </div>

      <div class="r-content">
        <el-dropdown trigger="click" size="mini" @command="handleCommand">
          <span class="el-dropdown-link"
            ><img :src="userImg" alt="" class="user"
          /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changepassword"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item v-if="$isElectron" command="backupDB"
              >备份数据</el-dropdown-item
            >
            <el-dropdown-item v-if="$isElectron" command="loadDB"
              >导入数据</el-dropdown-item
            >

            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <el-dialog
      width="50%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="resetVisible"
    >
      <el-form
        :model="current"
        ref="resetPassForm"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item label="密码">
          <el-input
            placeholder="请输入密码"
            v-model="current.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPass('resetPassForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('resetPassForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      width="50%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="infoVisible"
    >
      <el-descriptions :column="3" size="small" border>
        <el-descriptions-item label="备案号">{{
          prodInfo.code
        }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{
          prodInfo.name
        }}</el-descriptions-item>
        <el-descriptions-item label="简称">{{
          prodInfo.short_name
        }}</el-descriptions-item>
        <el-descriptions-item label="基金类型">{{
          prodInfo.class_type
        }}</el-descriptions-item>
        <el-descriptions-item label="子类型">{{
          prodInfo.sub_type
        }}</el-descriptions-item>
        <el-descriptions-item label="所属公司">{{
          prodInfo.company
        }}</el-descriptions-item>
        <el-descriptions-item span="3" label="备注">{{
          prodInfo.remark
        }}</el-descriptions-item>
        <el-descriptions-item label="投资类型">{{
          prodInfo.scale
        }}</el-descriptions-item>
        <el-descriptions-item label="购买时净值">{{
          prodInfo.buy_price
        }}</el-descriptions-item>
        <el-descriptions-item label="购买时间">{{
          prodInfo.buy_date
        }}</el-descriptions-item>
        <el-descriptions-item label="份额">{{
          prodInfo.amount
        }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{
          prodInfo.prod_source
        }}</el-descriptions-item>
        <el-descriptions-item label="说明">{{
          prodInfo.source_remark
        }}</el-descriptions-item>
        <el-descriptions-item label="基金成立时间">{{
          prodInfo.founded
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{
          prodInfo.stage
        }}</el-descriptions-item>
        <el-descriptions-item label="子基金对标">{{
          prodInfo.compare
        }}</el-descriptions-item>
        <el-descriptions-item label="管理费">{{
          prodInfo.fee
        }}</el-descriptions-item>
        <el-descriptions-item label="carry">{{
          prodInfo.carry
        }}</el-descriptions-item>
        <el-descriptions-item label="业绩报酬计提方式" span="2">{{
          prodInfo.perf_comp
        }}</el-descriptions-item>
        <el-descriptions-item label="其他关键条款">{{
          prodInfo.other
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog
      width="60%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="formVisible"
    >
      <el-tabs type="border-card">
        <el-tab-pane
          ><span slot="label"><i class="el-icon-date"></i> 产品信息</span>
          <el-form
            :model="prodInfo"
            ref="prodValidateForm"
            label-width="120px"
            class="demo-dynamic"
            :rules="{
              'code': [
                { required: true, message: '请输入备案号', trigger: 'blur' },
                {
                  min: 6,
                  max: 20,
                  message: '长度在 6 到 20 个字符',
                  trigger: 'blur'
                }
              ],
              'short_name': [
                { required: true, message: '简称必须输人', trigger: 'blur' }
              ],
              'name': [
                { required: true, message: '基金名称必须输人', trigger: 'blur' }
              ],
              'class_type': [
                { required: true, message: '类型必选', trigger: 'blur' }
              ],
              'type': [{ required: true, message: '渠道必选', trigger: 'blur' }]
            }"
          >
            <template v-for="(row, index) in cForm">
              <el-row :key="index" v-show="index % 2 == 0">
                <el-col :span="12">
                  <el-form-item
                    v-if="index <= cForm.length - 1"
                    :prop="row.dataIndex"
                    :label="row.tilte"
                    style="color: #409eff"
                  >
                    <el-select
                      v-if="row.param"
                      v-model="prodInfo[row.dataIndex]"
                      style="width: 120px"
                      clearable
                      :placeholder="row.tilte"
                    >
                      <el-option
                        v-for="item in sysparam[row.param]"
                        :key="item.value"
                        :label="item.value"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      v-else
                      :type="row['type']"
                      rows="3"
                      v-model="prodInfo[row.dataIndex]"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    v-if="index + 1 < cForm.length"
                    :prop="cForm[index + 1].dataIndex"
                    :label="cForm[index + 1].tilte"
                  >
                    <el-select
                      v-if="cForm[index + 1].param"
                      v-model="prodInfo[cForm[index + 1].dataIndex]"
                      @change="
                        (v) =>
                          cForm[index + 1].dataIndex == 'class_type' &&
                          changeSub(v)
                      "
                      style="width: 120px"
                      clearable
                      :placeholder="cForm[index + 1].tilte"
                    >
                      <el-option
                        v-for="item in cForm[index + 1].dataIndex == 'sub_type'
                          ? sub_type
                          : sysparam[cForm[index + 1].param]"
                        :key="item.value"
                        :label="item.value"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      v-else
                      v-model="prodInfo[cForm[index + 1].dataIndex]"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-form-item>
              <el-button
                v-if="usermenu.indexOf('info-edit') > -1"
                type="primary"
                @click="submitForm('prodValidateForm')"
                >提交</el-button
              >
              <el-button
                v-if="usermenu.indexOf('info-edit') > -1"
                @click="resetForm('prodValidateForm')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          ><span slot="label"><i class="el-icon-date"></i> 公司信息</span>
          <el-form
            :model="curCompany"
            ref="companyForm"
            label-width="100px"
            class="demo-dynamic"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :prop="'name'"
                  :label="'名称1'"
                  style="color: #409eff"
                >
                  <el-input v-model="curCompany.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :span="12"
                  :prop="curCompany.maintainer"
                  :label="'对接人'"
                >
                  <el-select
                    filterable
                    allow-create
                    v-model="curCompany['maintainer']"
                    style="width: 120px"
                    clearable
                    :placeholder="'对接人'"
                  >
                    <el-option
                      v-for="item in sysparam['maintainer']"
                      :key="item.value"
                      :label="item.value"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-for="(row, index) in compForm">
              <el-row :key="index" v-show="index % 2 == 0">
                <el-col :span="12">
                  <el-form-item
                    v-if="index <= compForm.length - 1"
                    :prop="row.dataIndex"
                    :label="row.tilte"
                  >
                    <el-select
                      v-if="row.param"
                      v-model="curCompany[row.dataIndex]"
                      filterable
                      allow-create
                      style="width: 120px"
                      clearable
                      :placeholder="row.tilte"
                    >
                      <el-option
                        v-for="item in sysparam[row.param]"
                        :key="item.value"
                        :label="item.value"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      v-else
                      v-model="curCompany[row.dataIndex]"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    v-if="index + 1 <= compForm.length - 1"
                    :prop="compForm[index + 1].dataIndex"
                    :label="compForm[index + 1].tilte"
                  >
                    <el-input
                      :type="compForm[index + 1].type"
                      v-model="curCompany[compForm[index + 1].dataIndex]"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-form-item>
              <el-button
                v-if="usermenu.indexOf('info-edit') > -1"
                type="primary"
                @click="submitCompForm('companyForm')"
                >提交</el-button
              >
              <el-button
                v-if="usermenu.indexOf('info-edit') > -1"
                @click="resetForm('companyForm')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane
          ><span slot="label"><i class="el-icon-date"></i> 尽调信息</span>
          <vxe-table
            border
            ref="investTable"
            height="480px"
            align="right"
            size="mini"
            :sort-config="{ trigger: 'cell', orders: ['desc', 'asc', null] }"
            :data="investList"
          >
            <vxe-column
              sortable
              width="80"
              field="invest_date"
              title="尽调时间"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="80"
              field="investor"
              title="尽调人"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="160"
              field="policy_scale"
              title="策略规模"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="60"
              field="fee"
              title="管理费"
              align="right"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="carry"
              title="carry"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="carry2"
              title="carry2"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="lock_period"
              title="锁定期"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="open_date"
              title="开放日"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="temp_open"
              title="临开"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="margin"
              title="保证金上限"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="ex_rate"
              title="换手率"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="host"
              title="托管"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="broker"
              title="交易商"
              align="left"
            ></vxe-column>
            <vxe-column
              sortable
              width="100"
              field="vip_account"
              title="专户"
              align="left"
            ></vxe-column>
          </vxe-table>
        </el-tab-pane>-->
      </el-tabs>
    </el-dialog>
    <el-dialog
      width="50%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="buyVisible"
    >
      <el-form
        :rules="rules"
        :model="curAction"
        ref="actionForm"
        label-width="120px"
      >
        <el-form-item label="基金名称" prop="code">
          <!-- <el-input placeholder="基金名称" v-model="curAction.name" ></el-input> -->
          <el-select
            v-model="curAction.code"
            style="width: 160px"
            @change="changeFOF"
            clearable
            placeholder="基金选择"
          >
            <el-option
              v-for="item in sysparam.FOF"
              :key="item.value"
              :label="item.value"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作类型">
          <!-- <el-input placeholder="操作类型" v-model="curAction.stage" ></el-input> -->
          <el-select
            v-model="curAction.stage"
            style="width: 160px"
            clearable
            @change="changeStage"
            placeholder="操作类型"
          >
            <el-option
              v-for="item in stages"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标的">
          <el-select
            v-model="curAction.b_code"
            filterable
            :disabled="curAction.prodDisabled"
            @change="changeTarget"
            style="width: 160px"
            clearable
            placeholder="标的选择"
          >
            <!-- <el-option   :key="'CASH'"
              :label="'现金'"
              :value="'CASH'">
          </el-option> -->
            <el-option
              v-for="item in foflist"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作金额(万)" prop="marketval">
          <el-input
            placeholder="操作金额"
            v-model="curAction.marketval"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="备注" v-model="curAction.remark"></el-input>
        </el-form-item>
        <!-- -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('actionForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('actionForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      width="50%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="auditVisible"
    >
      <el-form ref="form" :model="curAction" label-width="80px">
        <el-form-item label="基金名称">
          <label>{{ curAction.name }}</label>
        </el-form-item>
        <el-form-item label="决策阶段">
          <el-radio-group v-model="curAction.stage">
            <el-radio
              :key="idx"
              v-for="(item, idx) in sysparam.stage"
              :label="item.value"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="投资份额" v-if="curAction.stage != '投后'">
          <el-input-number
            style="width: 200px"
            placeholder="份额"
            v-model="curAction.amount"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="发生时间">
          <el-date-picker
            style="width: 130px"
            v-model="curAction.actiondate"
            value-format="yyyyMMdd"
            format="yyyyMMdd"
            align="right"
            type="date"
            placeholder="发生时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="评审意见">
          <el-input type="textarea" v-model="curAction.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="auditSubmit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      width="80%"
      top="50px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
    >
      <stat-chart
        @close="editClose"
        ref="statchart"
        style="height: 600px"
        :code="cur_code"
        :rg="rg"
        v-if="diagName == 'statChart'"
      ></stat-chart>
      <base-chart
        @close="editClose"
        ref="basechart"
        style="height: 600px"
        :code="cur_code"
        :rg="rg"
        v-if="diagName == 'baseChart'"
      ></base-chart>
      <rank-chart
        @close="editClose"
        ref="rankchart"
        style="height: 600px"
        :code="cur_code"
        :rg="rg"
        v-if="diagName == 'rankChart'"
      ></rank-chart>
      <compare-table
        @close="editClose"
        ref="comparetable"
        :code="cur_code"
        v-if="diagName == 'compareTable'"
      ></compare-table>
      <fund-echart
        @close="editClose"
        ref="hischart"
        style="height: 500px"
        :code="cur_code"
        :wk="wk"
        :orig="orig"
        v-if="diagName == 'hisChart' || diagName == 'compareTable'"
      ></fund-echart>
      <his-table
        @close="editClose"
        ref="histable"
        style="height: 600px"
        :temp="temp"
        :code="cur_code"
        v-if="diagName == 'hisTable'"
      ></his-table>
      <rank-table
        @close="editClose"
        ref="ranktable"
        style="height: 800px"
        :code="cur_code"
        v-if="diagName == 'rankDialog'"
      ></rank-table>
      <fof-simulate
        @close="editClose"
        ref="simtable"
        style="height: 900px"
        :code="cur_code"
        v-if="diagName == 'simuDialog'"
      ></fof-simulate>
      <audit-log
        @close="editClose"
        ref="auditlog"
        :titles="current.name"
        style="height: 600px"
        :code="cur_code"
        v-if="diagName == 'auditDialog'"
      ></audit-log>
      <fund-corr
        @close="editClose"
        ref="fundcorr"
        style="height: 600px"
        :code="cur_code"
        v-if="diagName == 'corrDialog'"
      ></fund-corr>
      <prod-table
        @close="editClose"
        ref="prodtable"
        :foflist="prodlist"
        :canEdit="canEdit"
        v-if="diagName == 'prodDiag'"
      ></prod-table>
      <el-tabs
        type="border-card"
        :value="fullActive"
        v-if="diagName == 'fullDialog'"
        @tab-click="handleDiagClick"
      >
        <el-tab-pane name="sumvaltab">
          <span slot="label"><i class="el-icon-date"></i> 净值曲线</span>
          <compare-table
            @close="editClose"
            ref="comparetable"
            :code="cur_code"
          ></compare-table>
          <fund-echart
            @close="editClose"
            ref="hischart"
            style="height: 500px"
            :code="cur_code"
            :wk="wk"
          ></fund-echart>
        </el-tab-pane>
        <el-tab-pane name="basedatatab">
          <span slot="label"><i class="el-icon-date"></i> 指标信息</span>
          <base-chart
            @close="editClose"
            ref="basechart"
            style="height: 600px"
            :code="cur_code"
            :visable="fullActive == 'basedatatab'"
          ></base-chart>
        </el-tab-pane>
        <!-- <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 排名曲线</span> 
            <rank-chart       @close="editClose" ref="rankchart"    style="height: 600px" :code="cur_code"  ></rank-chart>
      </el-tab-pane> -->
      </el-tabs>
    </el-dialog>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogCompVisible"
    >
      <prod-table
        @close="editClose"
        ref="protable"
        :foflist="foflist"
        :canEdit="canEdit"
        :full="true"
        v-if="diagName == 'prodDiag'"
      ></prod-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import Bus from '../store/bus.js'
import tools from '../store/tools.js'
import axis from 'axios'
import FundEchart from '@/components/FundEchart.vue'
import HisTable from '@/components/HisTable.vue'
import RankTable from '@/components/RankTable.vue'
import RankChart from '@/components/RankChart.vue'
import BaseChart from '@/components/BaseChart.vue'
import StatChart from '@/components/StatChart.vue'

import FofSimulate from '@/components/FofSimulate'
import ReportTable from '@/components/ReportTable'
import CompareTable from '@/components/CompareTable'
import AuditLog from '@/components/AuditLog.vue'
import FundCorr from '@/components/FundCorr.vue'
import ProdTable from '@/components/ProdTable.vue'
const cForm0 = [
  { tilte: '备案号', dataIndex: 'code', required: 'true' },
  { tilte: '所属公司', dataIndex: 'company' },
  { tilte: '运作时间', dataIndex: 'founded' },
  { tilte: '产品简称', dataIndex: 'short_name', required: 'true' },
  { tilte: '可投状态', dataIndex: 'scale', param: 'scale', bold: true },
  { tilte: '产品全称', dataIndex: 'name', required: 'true' },
  { tilte: '投资阶段', dataIndex: 'stage', param: 'stage' },
  {
    tilte: '一级策略',
    dataIndex: 'class_type',
    param: 'class_type',
    change: 'changeSub'
  },
  {
    tilte: '数据渠道',
    dataIndex: 'type',
    param: 'data_type',
    required: 'true'
  },
  { tilte: '子类型', dataIndex: 'sub_type', param: 'sub_type', bold: true },
  { tilte: '私募网代码', dataIndex: 'SiMuWang' },
  { tilte: '格上代码', dataIndex: 'GeShang' },
  { tilte: '朝阳代码', dataIndex: 'ZhaoYang' },
  { tilte: '托管邮箱', dataIndex: 'mail' },
  { tilte: '产品来源', dataIndex: 'prod_source', param: 'prod_source' },
  { tilte: '来源说明', dataIndex: 'source_remark' }
]
const cForm1 = [
  { tilte: '管理费%', dataIndex: 'fee', bold: true },
  { tilte: '计提方式', dataIndex: 'perf_comp' },
  // { tilte: 'carry%', dataIndex: 'carry' },
  { tilte: 'carry第一级%', dataIndex: 'carry_gap1', bold: true },
  { tilte: 'carry1%', dataIndex: 'carry1', bold: true },
  { tilte: 'carry第二级%', dataIndex: 'carry_gap2' },
  { tilte: 'carry2%', dataIndex: 'carry2' },
  { tilte: '购买时间', dataIndex: 'buy_date' },
  { tilte: '购买时净值', dataIndex: 'buy_price' },
  { tilte: '持有份额', dataIndex: 'amount' },
  { tilte: '止损', dataIndex: 'lost' },
  { tilte: '其他关键条款', dataIndex: 'other' },
  { tilte: '预警', dataIndex: 'alarm' },
  { tilte: '备注', dataIndex: 'remark', type: 'textarea' },
  { tilte: '已投基金对标', dataIndex: 'compare' }
]

const compForm = [
  { tilte: '简称', dataIndex: 'short_name' },
  { tilte: '城市', dataIndex: 'city' },
  { tilte: '主策略', dataIndex: 'master_strategy', param: 'strategy' },
  { tilte: '负责人', dataIndex: 'manager' },
  { tilte: '管理规模', dataIndex: 'scale', param: 'mgt_scale' },
  { tilte: '渠道', dataIndex: 'channel' },
  { tilte: '市场经理', dataIndex: 'business_man' },
  { tilte: '联系方式', dataIndex: 'contact' },
  { tilte: '渠道联系人', dataIndex: 'channel_man' },
  { tilte: '渠道联系方式', dataIndex: 'channel_contact' },
  { tilte: '产品', dataIndex: 'product' },
  { tilte: '备注', dataIndex: 'remark', type: 'textarea' }
]
export default {
  components: {
    FundEchart,
    AuditLog,
    FundCorr,
    HisTable,
    RankTable,
    FofSimulate,
    RankChart,
    BaseChart,
    StatChart,
    CompareTable,
    ReportTable,
    ProdTable
  },
  watch: {
    infoVisible: {
      handler(n) {
        if (n) {
          this.getInfo(this.cur_code)
        }
      }
    },
    formVisible: {
      handler(n) {
        if (n) {
          this.getInfo(this.cur_code)
        }
      }
    }
  },
  computed: {
    ...mapState({
      current: (state) => state.tab.currentMenu,
      foflist: (state) => state.foflist
    }),
    ...mapGetters(['token', 'sysparam', 'usermenu', 'allparam'])
  },
  methods: {
    changeSub(row) {
      var id = -1
      for (var ap of this.sysparam.class_type) {
        if (ap.code == row) {
          id = ap.id
          break
        }
      }
      this.prodInfo['sub_type'] = ''
      this.sub_type = this.allparam['param_' + id]
    },
    ...mapMutations({
      addAction: 'addAction'
    }),
    auditSubmit() {
      axis({
        method: 'post',
        url: '/fof/updateinfo', // 请求地址
        data: this.curAction, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      }).then((response) => {
        if (response.data.status == 'success') {
          this.auditVisible = false
          this.$message({
            message: '保存成功',
            type: 'success',
            center: true
          })
        }
      })
    },
    editClose() {
      this.dialogVisible = false
    },
    loadDB() {
      //     const { dialog } = require('electron').remote
      //     console.log(dialog)
      //     dialog.showOpenDialog({
      //     title: '导入备份文件',
      //     defaultPath: 'C:/',
      //     filters: [{
      //         name: '备份文件',
      //         extensions: ['db', 'sqlite3']
      //     }],
      //     buttonLabel: '导入!'
      // }).then(result => {
      //   console.log(result)
      //     fs.readFile(result.filePaths[0], (err, data) => {
      //     if (!err) {
      //       DB.reload(data)
      //               this.$message({
      //     showClose: true,
      //     message: "导入数据成功 请重新启动APP",
      //     type: "info"
      //   })
      //     }
      // })
      // }).catch(err=>{
      //     console.log(err)
      // })
    },
    backupDB() {
      const fileName = 'backup.db'
      console.log(fileName)
      const buffer = DB.serialize()
      console.log(buffer.length)
      let blob = new Blob([buffer])
      if (window.navigator.msSaveOrOpenBlob) {
        // console.log(2)
        navigator.msSaveBlob(blob, fileName)
      } else {
        // console.log(3)
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        //释放内存
        window.URL.revokeObjectURL(link.href)
      }
    },
    handleDiagClick(item) {
      console.log(item)
      this.fullActive = item.name
    },
    handleTabClick(item) {
      console.log(item)
      this.changeMenu(item.name)
    },
    handleCommand(item) {
      if (item == 'logout') {
        this.$router.push({ name: 'login' })
        this.$store.commit('selectMenu', item)
      } else if (item == 'changepassword') {
        this.resetVisible = true
        this.current.user = this.token
      } else if (item == 'backupDB') {
        this.backupDB()
      } else if (item == 'loadDB') {
        this.loadDB()
      }
    },
    changeStage(val) {
      if (val == '预入款') {
        this.curAction.prodDisabled = true
        this.curAction.b_code = 'CASH'
      } else {
        this.curAction.prodDisabled = false
      }
    },
    changeTarget() {},
    getInfo(code) {
      this.$axios
        .get('/fof/info', { params: { 'code': code } })
        .then((response) => {
          this.prodInfo = response.data
          if (this.formVisible) {
            let sub_type = this.prodInfo.sub_type
            this.changeSub(this.prodInfo.class_type)
            this.prodInfo['sub_type'] = sub_type
          }
          if (this.prodInfo.company_code) {
            this.$axios
              .get('/fof/compinfoby', {
                params: { reg_code: this.prodInfo.company_code }
              })
              .then((r) => {
                this.curCompany = r.data
                this.curCompany['reg_code'] = this.current.company_code
                console.log(this.curCompany)
              })
          }
        })
    },
    submitCompForm(formName) {
      console.log(this.$refs[formName].model)
      axis({
        method: 'post',
        url: '/fof/savecompany', // 请求地址
        data: this.curCompany, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      }).then(
        (response) => {
          if (response.data['status'] == 'success') {
          }
        },
        (err) => {
          reject(err)
        }
      )
    },
    changeFOF() {},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName == 'actionForm') {
            console.log(this.curAction)
            if (this.curAction.stage == '预入款') {
              this.curAction['b_code'] = 'CASH'
              this.curAction['b_name'] = '现金'
              if (
                this.curAction['code'] == 'SY9620' ||
                this.curAction['code'] == 'SSS105'
              ) {
                //this.updateCash(this.curAction["code"],{"value":this.curAction["marketval"]})
                //this.saveAction()
                // this.actionDiagShow = !this.actionDiagShow;
                // return true
              } else {
                this.$message({
                  showClose: true,
                  message: '只有多策略和进取预入资金',
                  type: 'error'
                })
                return false
              }
            }
            this.curAction.add_time = new Date().getTime()
            this.curAction.status = '无'
            delete this.curAction.name
            this.addAction(JSON.parse(JSON.stringify(this.curAction)))
            // }
            this.buyVisible = !this.buyVisible
          } else if (formName == 'prodValidateForm') {
            this.prodInfo['user'] = this.token
            this.$axios({
              method: 'post',
              url: '/fof/saveinfo', // 请求地址
              data: this.prodInfo, // 参数
              responseType: 'json' // 表明返回服务器返回的数据类型
            }).then(
              (response) => {
                if (response.data['status'] == 'success') {
                  // this.getList(this.filter)
                  this.formVisible = false
                }
              },
              (err) => {
                reject(err)
              }
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitPass(formName) {
      if (this.current && this.current.user) {
        axis({
          method: 'post',
          url: '/sys/updatepass', // 请求地址
          data: {
            'user': this.current.user,
            'password': this.current.password
          }, // 参数
          responseType: 'json' // 表明返回服务器返回的数据类型
        }).then(
          (response) => {
            if (response.data['status'] == 'success') {
              this.resetVisible = false
            }
          },
          (err) => {
            reject(err)
          }
        )
      }
    },
    clickPerson(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    },
    changeMenu(type) {
      Bus.$emit('changeMenu', type)
    }
  },
  data() {
    return {
      activeName: '首页',
      sub_type: [],
      fullActive: 'sumvaltab',
      wk: '1',
      cForm: [...cForm0, ...cForm1],
      orig: 0,
      curAction: {},
      compForm,
      curCompany: {},
      rules: {
        code: [{ required: true, message: '请选择基金', trigger: 'blur' }],
        name: [{ required: true, message: '请选择基金', trigger: 'blur' }],
        marketval: [{ required: true, message: '请输入金额', trigger: 'blur' }]
      },
      dialogVisible: false,
      cur_code: '',
      rg: '',
      prodDisabled: false,
      stages: ['预赎回', '待投资', '预入款'],
      diagName: '',
      temp: '',
      dialogCompVisible: false,
      resetVisible: false,
      buyVisible: false,
      infoVisible: false,
      formVisible: false,
      auditVisible: false,
      userImg: require('../assets/images/user.png'),
      prodInfo: {},
      formItems4: [
        {
          title: '产品信息',
          span: 24,
          children: [
            { 'title': '备案号', 'field': 'code' },
            { 'title': '名称', 'field': 'name' },
            { 'title': '简称', 'field': 'short_name' },
            {
              'title': '基金类型',
              'field': 'class_type',
              'param': 'class_type'
            },
            { 'title': '投资类型', 'field': 'scale', 'param': 'scale' },
            { 'title': '购买时净值', 'field': 'buy_price' },
            { 'title': '子类型', 'field': 'sub_type' },
            { 'title': '购买时间', 'field': 'buy_date' },
            { 'title': '份额', 'field': 'amount' },
            { 'title': '所属公司', 'field': 'company' },
            { 'title': '来源', 'field': 'prod_source', 'param': 'prod_source' },
            { 'title': '说明', 'field': 'source_remark' },
            { 'title': '基金成立时间', 'field': 'founded' },
            { 'title': '状态', 'field': 'stage', 'param': 'stage' },
            { 'title': '子基金对标', 'field': 'compare' },
            { 'title': '管理费', 'field': 'fee' },
            { 'title': 'carry', 'field': 'carry1' },
            { 'title': '业绩报酬计提方式', 'field': 'perf_comp' },
            { 'title': '其他关键条款', 'field': 'other' },
            { 'title': '备注', 'field': 'remark', 'type': 'textarea' }
          ]
        }
      ]
    }
  },
  created() {
    Bus.$on('showChart', (arg) => {
      console.log('===============CHART show==================')
      console.log(arg)
      for (let key in arg) {
        this[key] = arg[key]
      }
      if (!arg['orig']) {
        this.orig = 0
      }
      this.dialogVisible = true
      console.log('on监听参数====', arg) //['string',false,{name:'vue'}]
    })
    Bus.$on('oneKeyBuy', (arg) => {
      this.buyVisible = true
      this.curAction = arg
      console.log('on监听参数====', arg) //['string',false,{name:'vue'}]
    })
    Bus.$on('showInfo', (arg) => {
      this.cur_code = arg['cur_code']
      this.infoVisible = true
      console.log('on监听参数====', arg) //['string',false,{name:'vue'}]
    })
    Bus.$on('editInfo', (arg) => {
      this.cur_code = arg['cur_code']
      this.formVisible = true
      console.log('on监听参数====', arg) //['string',false,{name:'vue'}]
    })
    Bus.$on('auditAction', (arg) => {
      this.auditVisible = true
      this.curAction = arg
      if (!this.curAction['actiondate']) {
        this.curAction['actiondate'] = this.$moment().format('YYYYMMDD')
      }
      console.log('on监听参数====', arg) //['string',false,{name:'vue'}]
    })
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  width: 1000px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
}
.row-bg {
  padding: 10px 0;
}

header {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 20%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin: 20px;
  }
}
</style >

<style lang="scss">
.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #666666;
    font-weight: normal;
  }
  &:last-child {
    .el-breadcrumb__inner {
      color: #ffffff;
    }
  }
}
</style>