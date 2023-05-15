<template>
  <div ref="tableContainer" style="height: 100%">
    <div class="block" style="display: flex; justify-content: space-between">
      <div style="display: flex; justify-content: space-between">
        <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
        <el-button size="small" @click="toggleSelection()">取消选择</el-button>
        <!-- <el-button size="small" @click="addInfo()">添加</el-button> -->
        <el-button size="small" @click="allrun()">对比</el-button>
        <!-- <el-button size="small" @click="showcorr()">相关性</el-button> -->
        <el-button size="small" @click="compare()">业绩对标</el-button>
        <el-button
          v-if="usermenu.indexOf('rank-btn') > -1"
          size="small"
          @click="showRank()"
          >排名</el-button
        >
        <el-button
          v-if="usermenu.indexOf('sim-btn') > -1"
          size="small"
          @click="showSimulate()"
          >仿真</el-button
        >
        <el-button
          v-if="usermenu.indexOf('info-edit') > -1"
          @click="uploadInvestAll()"
          size="small"
          >上传尽调表</el-button
        >

        <!-- <el-select
          v-model="filter.stage"
          @change="getList"
          style="width: 80px"
          clearable
          placeholder="阶段"
        >
          <el-option
            v-for="item in sysparam.stage.filter(
              (r) => r.value != '对标' && r.value != '投后'
            )"
            :key="item.value"
            :label="item.value"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="filter.scale"
          @change="getList"
          style="width: 80px"
          clearable
          placeholder="可投状态"
        >
          <el-option
            v-for="item in sysparam.scale"
            :key="item.value"
            :label="item.value"
            :value="item.code"
          >
          </el-option>
        </el-select> -->
        <el-select
          v-model="filter.class_type"
          @change="getList"
          style="width: 80px"
          clearable
          placeholder="类型"
        >
          <el-option
            v-for="item in sysparam.class_type"
            :key="item.value"
            :label="item.value"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="filter.status"
          @change="getList"
          style="width: 80px"
          clearable
          placeholder="状态"
        >
          <el-option
            v-for="item in sysparam.invest_status"
            :key="item.value"
            :label="item.value"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <!-- <el-select
          v-model="filter.sub_type"
          @change="getList"
          style="width: 100px"
          clearable
          placeholder="子"
        >
          <el-option
            v-for="item in sub_type"
            :key="item.code"
            :label="item.value"
            :value="item.code"
          >
          </el-option>
        </el-select> -->
        <el-button size="small" @click="downFile()">下载</el-button>
        <el-input
          v-model="filter.name"
          clearable
          placeholder="名称"
          style="width: 180px"
        ></el-input>
        <el-button type="primary" @click="getList" style="margin-left: 10px"
          >搜索</el-button
        >
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :data="tableData"
      :max-height="tmaxh"
      :row-key="
        (row) => {
          return row.code
        }
      "
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
      @select-all="onselectAll"
      @select="handleSelectionChange"
    >
      <!--    @row-click = "Selection"-->

      <el-table-column type="selection" :reserve-selection="true" width="55">
      </el-table-column>
      <!--      测试ID-->
      <!-- <el-table-column
      prop="code"
      label="基金编号"
      width="120">
      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.code }}</a></template>
    </el-table-column> -->
      <!--      用例编号-->

      <!--      测试项目-->
      <el-table-column
        fixed
        prop="short_name"
        label="基金"
        min-width="160px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="addCart(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="添加"
              placement="left-start"
              ><i class="el-icon-shopping-cart-full"></i
            ></el-tooltip>
          </el-button>
          <a href="javascript:;" @click="showHis(scope.row)">{{
            scope.row.short_name
          }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="company" label="公司" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.company }}</template>
      </el-table-column>
      <el-table-column
        prop="class_type"
        label="类型"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.class_type }}</template>
      </el-table-column>

      <el-table-column
        prop="sub_type"
        label="子类型"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.sub_type }}</template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.status }}</template>
      </el-table-column>
      <!-- <el-table-column
        prop="scale"
        label="可投状态"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.scale }}</template>
      </el-table-column> -->
      <!-- <el-table-column
      prop="buy_date"
      label="建仓日期"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.buy_date }}</template>
    </el-table-column> -->
      <!-- <el-table-column
        prop="status"
        label="处理阶段"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.status }}</template>
      </el-table-column> -->
      <el-table-column prop="stage" label="阶段" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.stage }}</template>
      </el-table-column>
      <el-table-column prop="fee" label="管理费" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.fee }}</template>
      </el-table-column>
      <el-table-column
        prop="carry"
        label="carry"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{
          scope.row.carry
        }}</template> </el-table-column
      >>

      <el-table-column
        prop="latest_date"
        label="净值日期"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.latest_date }}</template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="入库"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{
          scope.row.create_time | formatDate
        }}</template>
      </el-table-column>

      <!--      测试输入-->

      <!-- <el-table-column
      prop="name"
      label="基金名称"
      show-overflow-tooltip>
      <template slot-scope="scope"><a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.name }}</a></template>
    </el-table-column> -->
      <el-table-column prop="remark" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="viewHis(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="查看净值历史"
              placement="left-start"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </el-button>
          <el-button
            @click.native.prevent="viewAudit(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="查看审核历史"
              placement="left-start"
            >
              <i class="el-icon-s-order"></i>
            </el-tooltip>
          </el-button>
          <!-- <el-button @click.native.prevent="viewHisTemp(scope.row)" type="text" size="small"> <el-tooltip class="item" effect="dark" content="核对数据" placement="left-start"><i class="el-icon-success"></i></el-tooltip></el-button> -->
          <el-button
            v-if="usermenu.indexOf('info-audit') > -1"
            @click.native.prevent="editStatus(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="更新状态"
              placement="left-start"
              ><i class="el-icon-s-tools"></i
            ></el-tooltip>
          </el-button>
          <el-button
            @click.native.prevent="editInfo(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="left-start"
              ><i class="el-icon-edit"></i
            ></el-tooltip>
          </el-button>
          <el-button
            v-if="usermenu.indexOf('info-edit') > -1"
            @click.native.prevent="uploadFile(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="上传报告"
              placement="left-start"
              ><i class="el-icon-upload"></i
            ></el-tooltip>
          </el-button>
          <el-button v-show="scope.row.filename" type="text" size="small">
            <el-tooltip
              class="item"
              effect="dark"
              content="下载报告"
              placement="left-start"
              ><a :href="'/fof/downfile?code=' + scope.row.code"
                ><i class="el-icon-download"></i></a
            ></el-tooltip>
          </el-button>
          <el-button
            v-show="scope.row.combine"
            @click.native.prevent="viewConcat(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="拼接历史"
              placement="left-start"
              ><i class="el-icon-link"></i
            ></el-tooltip>
          </el-button>
          <el-button
            v-show="scope.row.compare"
            @click.native.prevent="vcompare(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="业绩对标"
              placement="left-start"
              ><i class="el-icon-sort"></i
            ></el-tooltip>
          </el-button>
          <el-button
            v-if="usermenu.indexOf('info-edit') > -1"
            @click.native.prevent="delFund0(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="left-start"
              ><i class="el-icon-delete" style="color: red"></i
            ></el-tooltip>
          </el-button>
          <el-button
            v-if="usermenu.indexOf('info-edit') > -1"
            @click.native.prevent="doCheck(scope.row)"
            type="text"
            size="small"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="核对"
              placement="left-start"
              ><i class="el-icon-finished"></i
            ></el-tooltip>
          </el-button>

          <!-- <vxe-button v-if="usermenu.indexOf('info-edit')>-1"  @click="uploadInvest(scope.row)" type="text" size="small">上传尽调表</vxe-button > -->
        </template>
      </el-table-column>
    </el-table>
    <el-upload
      class="upload-demo"
      style="display: none"
      :accept="fileAccept"
      :action="uploadUrl"
      :data="{ code: cur_code }"
      :before-upload="(file) => loadModel(file)"
      auto-upload
    >
      <el-button id="uploadButton" size="small" type="primary"
        >点击上传</el-button
      >
    </el-upload>
    <div style="display: flex; justify-content: space-between">
      <div class="block" style="margin-top: 25px; height: 40px">
        <!-- -->
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
      :visible.sync="tableVisible"
    >
      <el-button @click="downFile('/fof/jreport_down')" size="small"
        >下载数据</el-button
      >
      <el-button @click="downPDF('comparediv')" size="small">导出PDF</el-button>
      <div ref="comparediv">
        <!-- <report-table  ref="compdata"  :titles="current.name"   :tableData="compData"  ></report-table> -->
        <compare-table
          ref="compdata"
          :titles="current.name"
          :code="selcode"
        ></compare-table>
        <fund-echart
          ref="hischart1"
          :titles="current.name"
          style="height: 480px"
          :code="selcode"
        ></fund-echart>
      </div>
    </el-dialog>
    <el-dialog
      width="50%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="concatVisible"
    >
      <concat-log
        @close="editClose"
        ref="concatlog"
        :titles="current.name"
        style="height: 600px"
        :temp="temp"
        :code="cur_code"
        :visable="concatVisible"
      ></concat-log>
    </el-dialog>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="corrVisible"
    >
      <fund-corr
        @close="editClose"
        ref="corrtable"
        :titles="current.name"
        style="height: 600px"
        :temp="temp"
        :code="selcode"
      ></fund-corr>
    </el-dialog>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="editVisible"
    >
      <el-form ref="form" :model="current" label-width="80px">
        <el-form-item label="基金名称">
          <label>{{ current.name }}</label>
        </el-form-item>
        <el-form-item label="决策阶段">
          <el-radio-group v-model="current.stage">
            <el-radio
              :key="idx"
              v-for="(item, idx) in sysparam.stage"
              :label="item.value"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="投资份额">
          <el-input-number
            style="width: 200px"
            placeholder="份额"
            v-model="current.amount"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="评审意见">
          <el-input type="textarea" v-model="current.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      width="50%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="checkVisible"
    >
      <el-button type="primary" @click="reCrawl">重新爬取</el-button>
      <vxe-table
        border
        ref="crawInfo"
        size="mini"
        :sort-config="{ trigger: 'cell', orders: ['desc', 'asc', null] }"
        :data="checkData"
      >
        <vxe-column field="source" title="来源" width="100">
          <template slot-scope="scope"
            >{{ scope.row.source }}
            <el-button
              @click.native.prevent="changeSource(scope.row.source)"
              type="text"
              size="small"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="切换"
                placement="left-start"
                ><i class="el-icon-finished"></i
              ></el-tooltip>
            </el-button>
          </template>
        </vxe-column>
        <vxe-column field="start" title="开始"> </vxe-column>
        <vxe-column field="end" title="结束"> </vxe-column>
        <vxe-column field="cnt" title="总计"> </vxe-column>
        <vxe-column field="total_week" title="合计周数"> </vxe-column>
        <vxe-column field="miss_week" title="缺失周"> </vxe-column>
        <vxe-column field="miss_week" title="缺失率">
          <template slot-scope="scope">{{
            $tools.formatMoney(scope.row.miss_week / scope.row.total_week, 3)
          }}</template>
        </vxe-column>
        <vxe-column field="ostd" title="异常std"> </vxe-column>
        <vxe-column field="over_data" show-overflow-tooltip title="异常std">
        </vxe-column>
        <vxe-column field="rdiff" show-overflow-tooltip title="异常增长率">
        </vxe-column>
      </vxe-table>
      <!-- <el-table
      :data="checkData"
      key="source"
      style="width: 100%">
      
    </el-table> -->
      <el-tabs type="border-card">
        <el-tab-pane
          ><span slot="label"><i class="el-icon-date"></i> 净值曲线</span>
          <fund-echart
            ref="hischart"
            :titles="current.name"
            :code="current.code"
            :orig="1"
          ></fund-echart>
        </el-tab-pane>
        <el-tab-pane
          ><span slot="label">单位净值</span>
          <vxe-table
            border
            ref="netValsInfo"
            size="mini"
            height="480"
            :sort-config="{ trigger: 'cell', orders: ['desc', 'asc', null] }"
            :data="netvals"
          >
            <vxe-column field="date" sortable="" title="日期">
              <template #header>
                {{ '日期' }}
                <vxe-switch
                  v-model="showDiff"
                  open-label="差异"
                  :open-value="true"
                  close-label="所有"
                  :close-value="false"
                ></vxe-switch>
              </template>
            </vxe-column>
            <vxe-column
              v-for="item in sources"
              :key="item"
              :field="item"
              :title="item"
            >
            </vxe-column>
          </vxe-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="formVisible"
    >
      <el-tabs type="border-card">
        <el-tab-pane
          ><span slot="label"><i class="el-icon-date"></i> 产品信息</span>
          <!-- <wad-form :cForm="cForm"></wad-form>
 -->
          <!-- <vxe-form :data="current" @submit="submitForm('dynamicValidateForm')" @reset="resetForm('dynamicValidateForm')">
                <vxe-form-item span=12 title-width="100px" :key="index" v-for="(row,index)  in cForm" :title="row.tilte" :field="row.dataIndex" :item-render="{}">
                  <vxe-select v-if="row.param" v-model="current[row.dataIndex]" clearable >
                    <vxe-option v-for="item in sysparam[row.param]" :key="item.value" :value="item.code" :label="item.value"></vxe-option>
                  </vxe-select> 
                    <vxe-input v-else v-model="current[row.dataIndex]"  clearable></vxe-input>
                </vxe-form-item>
         </vxe-form> -->

          <!---->
          <el-form
            :model="current"
            ref="dynamicValidateForm"
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
                  >
                    <el-select
                      v-if="row.param"
                      v-model="current[row.dataIndex]"
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
                      v-model="current[row.dataIndex]"
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
                      v-model="current[cForm[index + 1].dataIndex]"
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
                      v-model="current[cForm[index + 1].dataIndex]"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-form-item>
              <el-button
                v-if="usermenu.indexOf('info-edit') > -1"
                type="primary"
                @click="submitForm('dynamicValidateForm')"
                >提交</el-button
              >
              <el-button
                v-if="usermenu.indexOf('info-edit') > -1"
                @click="resetForm('dynamicValidateForm')"
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
                <el-form-item :prop="'name'" :label="'名称'">
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
        <el-tab-pane
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
            <!-- <vxe-column  type="checkbox" width="30" fixed="left"></vxe-column> -->

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
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="confirmVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认删除{{ current.name }}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="delFund()">确 定</el-button>
      </span>
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
import AuditLog from '../../components/AuditLog.vue'
import ConcatLog from '../../components/ConcatLog.vue'
import Bus from '@/store/bus.js'
import HisTable from '../../components/HisTable.vue'
import RankTable from '../../components/RankTable.vue'
import FofSimulate from '../../components/FofSimulate'
import WadForm from '../../components/WadForm'

import ReportTable from '../../components/ReportTable'
import CompareTable from '../../components/CompareTable'

import { mapGetters } from 'vuex'
import VXETable from 'vxe-table'
import Vue from 'vue'

import FundCorr from '../../components/FundCorr.vue'
const cForm0 = [
  { tilte: '备案号', dataIndex: 'code', required: 'true' },
  { tilte: '所属公司', dataIndex: 'company' },
  { tilte: '运作时间', dataIndex: 'founded' },
  { tilte: '产品简称', dataIndex: 'short_name', required: 'true' },
  { tilte: '可投状态', dataIndex: 'scale', param: 'scale' },
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
  { tilte: '子类型', dataIndex: 'sub_type', param: 'sub_type' },
  { tilte: '私募网代码', dataIndex: 'SiMuWang' },
  { tilte: '格上代码', dataIndex: 'GeShang' },
  { tilte: '朝阳代码', dataIndex: 'ZhaoYang' },
  { tilte: '托管邮箱', dataIndex: 'mail' },
  { tilte: '产品来源', dataIndex: 'prod_source', param: 'prod_source' },
  { tilte: '来源说明', dataIndex: 'source_remark' }
]
const cForm1 = [
  { tilte: '管理费%', dataIndex: 'fee' },
  { tilte: '计提方式', dataIndex: 'perf_comp' },
  // { tilte: 'carry%', dataIndex: 'carry' },
  { tilte: 'carry第一级%', dataIndex: 'carry_gap1' },
  { tilte: 'carry1%', dataIndex: 'carry1' },
  { tilte: 'carry第一级%', dataIndex: 'carry_gap2' },
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
    HisTable,
    RankTable,
    AuditLog,
    ConcatLog,
    FofSimulate,
    ReportTable,
    CompareTable,
    WadForm,
    FundCorr,
    WadForm
  },

  props: {
    filters: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters(['sysparam', 'token', 'usermenu', 'allparam', 'sources'])
  },
  data() {
    return {
      cForm: [],
      compForm,
      fcompanys: [],
      investList: [],
      showDiff: true,
      selcode: '',
      allSelect: false,
      filter: { year: '2022' },
      temp: -1,
      origin: {},
      pdf: null,
      multipleSelection: [],
      sub_type: [],
      current: {},
      curCompany: { maintainer: '' },
      cur_code: '',
      fileAccept: '.doc,.dot,,docx,.pdf',
      uploadUrl: '/fof/upload',
      diagName: '',
      dialogVisible: false,
      confirmVisible: false,
      corrVisible: false,
      formVisible: false,
      tableVisible: false,
      hisVisible: false,
      auditVisible: false,
      concatVisible: false,
      editVisible: false,
      checkVisible: false,
      checkData: [],
      checkAll: {},
      netvals: [],
      compData: [],
      rowdata: '',
      tmaxh: 500,
      value2: '',
      PageSize: 30,
      chartData: {
        xData: [],
        series: [
          {
            data: [],
            type: 'line',
            smooth: true
          }
        ]
      },
      input: '',
      tableData: [],
      totaltableData: [],
      currentPage: 1
    }
  },
  watch: {
    $route: {
      handler(n) {
        console.log(n)
        let params = n.params
        if (this.filters) {
          params = this.filters
        }
        this.getList(params)
        // 初始化操作
      },
      immediate: true,
      deep: true
    },
    showDiff: {
      handler(n) {
        this.showNetVals()
      }
    }
  },
  methods: {
    reCrawl() {
      axis
        .get('/fof/reCrawl', { params: { code: this.current.code } })
        .then((response) => {
          this.tableData = response.data
          this.resizeChart()
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changeSource(source) {
      axis({
        method: 'post',
        url: '/fof/update_source', // 请求地址
        data: { code: this.current.code, source: source }, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      })
        .then((response) => {
          this.tableData = response.data
          this.resizeChart()
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error)
        })
    },
    qryCompany(query) {
      if (query && query.length > 1) {
        axis({
          url: '/fof/compinfo',
          method: 'GET',
          params: { qry: query }
        }).then((response) => {
          this.fcompanys = response.data
        })
      }
    },
    onselectAll(row) {
      this.allSelect = !this.allSelect
      console.log(row)
      var flag = row.length > 0
      //console.log(flag)
      this.toggleSelection(this.totaltableData)
    },
    addCart(row) {
      Bus.$emit('addcart', row)
    },
    changeSub(row) {
      var id = -1
      for (var ap of this.sysparam.class_type) {
        if (ap.code == row) {
          id = ap.id
          break
        }
      }

      this.sub_type = this.allparam['param_' + id]
    },
    changeFormSub(row) {
      var id = -1
      for (var ap of this.sysparam.class_type) {
        if (ap.code == row) {
          id = ap.id
          break
        }
      }

      this.sub_type = this.allparam['param_' + id]
    },
    editInfo(row) {
      //   this.cur_id=row.id
      //   this.current=JSON.parse(JSON.stringify(row))
      this.current = row
      this.cForm = [...cForm0, ...cForm1]
      this.changeSub(this.current.class_type)
      this.formVisible = true
      this.$axios
        .get('/fof/compinfoby', {
          params: { reg_code: this.current.company_code }
        })
        .then((r) => {
          this.curCompany = r.data
          this.curCompany['reg_code'] = this.current.company_code
          console.log(this.curCompany)
        })
      this.$axios
        .get('/fof/investList', { params: { code: this.current.code } })
        .then((r) => {
          this.investList = r.data
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
    submitForm(formName) {
      if (this.current.type && this.current.class_type) {
        this.current.code = this.current.code.trim()
        this.current.user = this.token
        if (
          this.current.type.length < 2 ||
          (this.current.type.length > 2 && this.current[this.current.type])
        ) {
          axis({
            method: 'post',
            url: '/fof/saveinfo', // 请求地址
            data: this.current, // 参数
            responseType: 'json' // 表明返回服务器返回的数据类型
          }).then(
            (response) => {
              if (response.data['status'] == 'success') {
                this.getList(this.filter)
                this.formVisible = false
              }
            },
            (err) => {
              reject(err)
            }
          )
        } else {
          this.$message({
            showClose: true,
            message: this.current.type + '代码必填',
            type: 'error'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '类型和来源为必填项',
          type: 'error'
        })
      }
    },
    delFund0(row) {
      this.confirmVisible = true
      this.current = row
    },
    delFund(row) {
      if (!row) {
        row = this.current
      }
      console.log(row)
      axis({
        method: 'post',
        url: '/fof/delfund', // 请求地址
        data: { code: row.code }, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      }).then(
        (response) => {
          if (response.data['status'] == 'success') {
            this.confirmVisible = false
            this.getList(this.filter)
          }
        },
        (err) => {
          reject(err)
        }
      )
    },
    addInfo() {
      this.current = { stage: '入库', scale: '待尽调', sub_type: '' }
      this.cForm = cForm0
      this.formVisible = true
    },
    loadModel(file) {
      console.log(file.name)
    },
    uploadFile(row) {
      this.fileAccept = '.dot,.doc,docx,.pdf'
      this.uploadUrl = '/fof/upload'
      this.cur_code = row.code
      document.getElementById('uploadButton').click()
    },
    uploadInvestAll() {
      VXETable.readFile({ multiple: true, types: ['xlsx', 'xls'] }).then(
        (file) => {
          var formData = new FormData()
          let fls = file.files
          console.log(fls)
          for (let idx = 0; idx < fls.length; idx++) {
            formData.append('file[]', fls[idx])
          }
          this.$axios({
            method: 'post',
            url: '/fof/upInvest', // 请求地址
            data: formData, // 参数
            responseType: 'json' // 表明返回服务器返回的数据类型
          }).then((res) => {
            console.log(res)
          })

          // document.getElementById('uploadButton').click()
        }
      )
    },
    uploadInvest(row) {
      VXETable.readFile({ multiple: false, types: ['xlsx'] }).then((file) => {
        var formData = new FormData()
        formData.append('file', file.file)
        this.$axios({
          method: 'post',
          url: '/fof/upInvest', // 请求地址
          data: formData, // 参数
          responseType: 'json' // 表明返回服务器返回的数据类型
        }).then((res) => {
          console.log(res)
        })

        // document.getElementById('uploadButton').click()
      })
    },
    editClose() {
      this.dialogVisible = false
    },

    downFile(durl) {
      var url = '/fof/report'
      if (durl) {
        url = durl
      }
      if (this.selcode.length < 1) {
        this.selcode = ''
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.selcode += ',' + this.multipleSelection[i].code
        }
      }
      if (this.selcode.length < 1) {
        return
      }
      // var selcode=""

      // console.log(url)
      const options = { code: this.selcode }
      this.$tools.exportExcel(url, options)
    },
    downPDF(exportRef) {
      this.$tools.downloadPdf(this.$refs[exportRef], '业绩对标.pdf')
    },
    forceUpdate() {
      this.$forceUpdate()
    },
    //   downloadPdf (exportdiv) {
    //   this.pdf = this.$refs[exportdiv]
    //   let target = this.pdf

    //   html2canvas(target, {
    //       useCORS: true, // 当图片是链接地址时，需加该属性，否组无法显示图片
    //       "imageTimeout": 0,
    //       'scale': 1,
    //       "width": target.clientWidth,
    //       "height": target.clientHeight,
    //     })
    //       .then(canvas => {
    //         console.log(canvas)
    //         let contentWidth = canvas.width; // 592px
    //         let contentHeight = canvas.height; // 841px
    //         //一页pdf显示html页面生成的canvas高度;
    //         let pageHeight = contentWidth / 592 * 841;
    //         //未生成pdf的html页面高度
    //         let leftHeight = contentHeight;
    //         //页面偏移
    //         // let offsetX = 100;
    //         // let offsetY = 100;
    //         let offsetX = 0;
    //         let offsetY = 0;
    //         //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    //         let imgWidth = 592;
    //         //let imgWidth = 592 - 2 * offsetX;//边框留白
    //         let imgHeight = imgWidth / contentWidth * contentHeight;
    //         let pageData = canvas.toDataURL('image/jpeg', 1.0);

    //         // 第一个方向,第二个单位,第三个尺寸格式
    //         // landscape横向
    //         // let pdf = new jspdf('landscape', 'pt', 'a4');
    //         let pdf = new jspdf('', 'pt', 'a4');

    //         //有两个高度需区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //         //当内容未超过pdf一页显示的范围，无需分页
    //         if(leftHeight < pageHeight) {
    //           pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    //         } else {
    //           while(leftHeight > 0) {
    //             pdf.addImage(pageData, 'JPEG', offsetX, offsetY, imgWidth, imgHeight)
    //             leftHeight -= pageHeight;
    //             offsetX -= 592;
    //             offsetY -= 841;
    //             //避免添加空白页
    //             if(leftHeight > 0) {
    //               pdf.addPage();
    //             }
    //           }
    //         }
    //         let name = '业绩对标.pdf'; // 定义生成的pdf的文件名字
    //         pdf.save(name);
    //       });
    // },
    showResult(number, rate = 100) {
      if (null == number) return ''
      var color = number >= 0 ? 'red' : 'green'
      //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
      return this.$tools.formatMoney(number * rate, 3)
    },
    showHis(row) {
      Bus.$emit('showChart', {
        cur_code: row.code,
        wk: '1',
        diagName: 'hisChart'
      })
    },
    showRank() {
      this.cur_code = ''
      this.dialogVisible = true
      this.diagName = 'rankDialog'
      var selcode = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].stage != '非卖') {
          selcode += this.multipleSelection[i].code + ','
        }
      }
      this.cur_code = selcode
      Bus.$emit('showChart', {
        cur_code: this.cur_code,
        diagName: 'rankDialog'
      })
    },
    showSimulate() {
      this.cur_code = ''
      var selcode = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].stage != '非卖') {
          selcode += this.multipleSelection[i].code + ','
        }
      }
      this.cur_code = selcode
      console.log(this.cur_code)
      Bus.$emit('showChart', {
        cur_code: this.cur_code,
        diagName: 'simuDialog'
      })
    },
    onSubmit() {
      var ret = this.$tools.checkModi(this.current, this.origin)
      var $this = this
      ret['code'] = this.origin.code
      ret['stage'] = this.current.stage
      ret['user'] = this.token
      axis({
        method: 'post',
        url: '/fof/updateinfo', // 请求地址
        data: ret, // 参数
        responseType: 'json' // 表明返回服务器返回的数据类型
      }).then((response) => {
        if (response.data.status == 'success') {
          $this.getList()
          this.editVisible = false
          this.$message({
            message: '保存成功',
            type: 'success',
            center: true
          })
        }
      })
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
      console.log(rows)
      console.log(this.multipleSelection)
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, this.allSelect)
          var insert = true
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].code == row.code) {
              if (this.allSelect) {
              } else {
                var a = this.multipleSelection.splice(i, 1)
                console.log('diselc:' + a.name)
              }
              insert = false
              break
            }
          }
          if (this.allSelect && insert) {
            this.multipleSelection.push(row)
          }
        })
      } else {
        this.$refs.multipleTable.clearSelection()
        this.multipleSelection = []
      }
      console.log(this.multipleSelection)
    },
    //
    allrun() {
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length < 1) {
        return
      }
      var selcode = ''
      // console.log(this.multipleSelection)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selcode += ',' + this.multipleSelection[i].code
      }
      // this.cur_code=""
      // this.current=this.multipleSelection[0]
      // this.dialogVisible=true
      // this.diagName="hisChart"
      // this.cur_code=selcode
      Bus.$emit('showChart', { cur_code: selcode, diagName: 'hisChart' })

      //   this.$refs.hischart.$emit("getChart",selcode)
    },
    showChartByCodes(codes) {
      this.cur_code = ''
      this.current = {}
      this.dialogVisible = true
      this.cur_code = codes
    },
    viewHis(row) {
      Bus.$emit('showChart', {
        cur_code: row.code,
        diagName: 'hisTable',
        temp: -1
      })
    },
    viewAudit(row) {
      Bus.$emit('showChart', { cur_code: row.code, diagName: 'auditDialog' })
    },
    viewConcat(row) {
      this.temp = -1
      this.cur_code = ''
      this.current = row
      this.concatVisible = true
      this.cur_code = row.code
    },

    viewHisTemp(row) {
      Bus.$emit('showChart', {
        cur_code: row.code,
        diagName: 'hisTable',
        temp: 1
      })
    },
    showNetVals() {
      let rets = this.checkAll['netvals']
      if (this.showDiff) {
        let cols = this.checkData.map((r) => r['source'])
        if (cols.length == 2) {
          rets = this.netvals.filter((row) => {
            return row[cols[0]] != row[cols[1]]
          })
        } else if (cols.length == 3) {
          rets = this.netvals.filter((row) => {
            return !(
              row[cols[0]] == row[cols[1]] &&
              row[cols[0]] == row[cols[2]] &&
              row[cols[2]] == row[cols[1]]
            )
          })
        }
        console.log(rets)
        this.netvals = rets
      }
      rets.sort((a, b) => b['date'] - a['date'])
      console.log(rets)
      this.$refs.netValsInfo.reloadData(rets)
      console.log(`loaddata ${rets.length}`)
    },
    doCheck(row) {
      this.current = JSON.parse(JSON.stringify(row))
      this.checkVisible = true
      axis
        .get('/fof/checkdata', { params: { code: this.current.code } }) //axis后面的.get可以省略；
        .then((response) => {
          console.log('#############')
          console.log(response.data['data'])
          console.log(response.data['netvals'])
          this.checkAll = response.data
          // Vue.set(checkData["data"],response.data["data"])
          Vue.set(this, 'checkData', response.data['data'])
          Vue.set(this, 'netvals', response.data['netvals'])
          this.showNetVals()
          this.$refs.crawInfo.reloadData(response.data['data'])
          // this.$refs.netValsInfo.reloadData(response.data["netvals"])

          // this.checkData["netvals"]=response.data["netvals"]
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editStatus(row) {
      this.cur_code = ''
      this.current = JSON.parse(JSON.stringify(row))
      this.origin = row
      this.editVisible = true
      this.cur_code = row.code
    },
    downInvest(row) {
      var url = '/fof/downfile'
      const options = { code: row.code }
      this.$tools.exportExcel(url, options)
    },
    //    downFile(){
    //         if(this.multipleSelection.length<1){
    //         return
    //     }
    //     var selcode=""
    //     console.log(this.multipleSelection)
    //     for (let i = 0; i < this.multipleSelection.length; i++) {
    //           selcode+=this.multipleSelection[i].code+",";
    //     }
    //     var url="/fof/down_jreport"

    //     const options = {"code":selcode}
    //     this.$tools.exportExcel(url,options)
    //     },
    vcompare(row) {
      this.showcomapre(row.code, '/fof/jcompare')
    },
    showcomapre(selcode, vcomp) {
      console.log(selcode)
      let curl = '/fof/jreport'
      if (vcomp) curl = vcomp
      this.tableVisible = true
      this.selcode = selcode
      // this.cur_code=selcode
      // // console.log(this.multipleSelection)
      //   axis( {
      //         url: curl,
      //         method: 'GET',
      //         params: {code:selcode}
      //         })//axis后面的.get可以省略；
      // .then((response) => {
      //   this.compData = this.$tools.pandasToJson(response.data);
      //   //this.tableData = this.totaltableData;
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
    },
    compare() {
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length < 1) {
        return
      }
      var selcode = ''
      console.log(this.multipleSelection)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selcode += this.multipleSelection[i].code + ','
      }
      this.showcomapre(selcode)
      //   this.$refs.hischart.$emit("getChart",selcode)
    },
    showcorr() {
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length < 1) {
        return
      }
      var selcode = ''
      console.log(this.multipleSelection)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selcode += this.multipleSelection[i].code + ','
      }
      this.selcode = selcode
      this.corrVisible = true
      //   this.$refs.hischart.$emit("getChart",selcode)
    },
    // 选中
    handleSelectionChange(val) {
      console.log(val)
      //   console.log(this.multipleSelection)

      this.multipleSelection = val
      //         if (this.multipleSelection.length > 0) {
      //     this.multipleSelection.forEach((item, index) => {
      //         if (item.code == row.code) {
      //             this.multipleSelection.splice(index,1)
      //         } else {
      //             this.multipleSelection.push(row)
      //         }
      //     })
      // } else {
      //     this.multipleSelection.push(row)
      // }
    },
    handlecollapse(val) {
      // if(val.length>1){
      this.filter.extra = val.length
      // }
      // console.log(val);
    },
    resizeChart() {
      if (this.$refs['tableContainer']) {
        console.log(this.$refs['tableContainer'].clientHeight)
        this.tmaxh = this.$refs['tableContainer'].clientHeight - 180
      }
      console.log(this.tmaxh)
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
      console.log(this.multipleSelection)
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
        endindex = this.totaltableData.length
      } else {
        endindex = this.PageSize * this.currentPage
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
    seachChange(param) {
      console.log(param)
      this.getList()
    },
    getList(param) {
      // console.log(this.filter)
      // return
      var $this = this
      console.log(param)
      if (param && typeof param == 'object' && 'click' != param.type) {
        this.filter = param
      }
      var data = this.filter
      // data['user'] = this.token
      console.log(data)
      //  if(this.input)
      //  data["name"]=this.input
      //  console.log(this)
      //  if(this.stage)
      //  data["stage"]=this.stage
      //   axis.get('/fof/list')//axis后面的.get可以省略；
      axis({
        url: '/fof/tasklist',
        method: 'GET',
        params: data
      })
        .then((response) => {
          this.totaltableData = response.data
          // this.totaltableData = response.data.sort((a, b) => {
          //   return b['create_time'].localeCompare(a['create_time'])
          // })
          this.tableData = this.totaltableData.slice(0, $this.PageSize)
          this.resizeChart()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //
    request_excute(test_id) {
      let url = '/api/testcase/case/?testid=' + test_id
      // console.log(url)
      axis
        .get(url) //axis后面的.get可以省略；
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  created() {
    console.log(this.$moment().date(-7))
  },
  filters: {
    formatDate: function (time) {
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
    // this.getList({})
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body {
  padding: 10px 10px;
}
</style>