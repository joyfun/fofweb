<template>
  <div id="tableContainer" style="height: 100%">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 资金状况</span>
        <el-table
          :data="finalData"
          style="width: 100%; margin-bottom: 20px"
          :row-key="getRowKeys"
          border
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            label="基金名称"
            sortable
            prop="code"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["name"] }}</template>
          </el-table-column>
          <el-table-column
            label="市值"
            sortable
            prop="marketval"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["marketval"] }}</template>
          </el-table-column>
          <el-table-column
            label="可用资金"
            sortable
            prop="cash"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["cash"] }}</template>
          </el-table-column>
          <el-table-column
            label="预入款"
            sortable
            prop="income"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["income"] }}</template>
          </el-table-column>
          <el-table-column
            label="预赎回"
            sortable
            prop="redeem"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["redeem"] }}</template>
          </el-table-column>
          <el-table-column
            label="待投资"
            sortable
            prop="buy"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["buy"] }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="资金预操作"
        ><div style="display: flex; justify-content: space-between">
          {{actionData}}
          <el-button size="small" @click="addAction()">添加操作</el-button>
        </div>
        <el-table
          ref="actionTable"
          :data="actionData"
          tooltip-effect="dark"
          :max-height="tmaxh"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column
            label="基金名称"
            sortable
            prop="code"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{
              showFundName(scope.row.code)
            }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            prop="stage"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="产品"
            sortable
            prop="b_code"
            show-overflow-tooltip
          >{{showFundName(b_code)}}
          </el-table-column>
          <el-table-column
            label="金额(万)"
            sortable
            prop="marketval"
            show-overflow-tooltip
          >
          </el-table-column> </el-table
      ></el-tab-pane>
      <el-tab-pane label="资金明细">
        <el-button @click="addAction">添加</el-button>
        <el-table
          :data="detailData"
          style="width: 100%; margin-bottom: 20px"
          :row-key="getRowKeys"
          border
        >
          <el-table-column
            label="基金名称"
            sortable
            prop="code"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["name"] }}</template>
          </el-table-column>
          <el-table-column
            label="持仓名称"
            sortable
            prop="code"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["b_name"] }}</template>
          </el-table-column>

          <el-table-column
            label="市值(万)"
            sortable
            prop="marketval"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{
              showMoney(scope.row["marketval"])
            }}</template>
          </el-table-column>
          <el-table-column
            label="状态"
            sortable
            prop="stage"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row["stage"] }}</template>
          </el-table-column>
            <el-table-column
            label="预操作金额"
            sortable
            prop="act_amount"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row["act_amount"] }}</template>
          </el-table-column>

          <el-table-column
            label="操作"
            sortable
            prop="b_code"
            align="right"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row["b_code"] }}
              <el-button
                v-if="scope.row['b_code'].length == 6"
                @click="fundAction(scope.row)"
                >操作</el-button
              >
              <el-button v-if="scope.row['id']" @click="delAction(scope.row)"
                >删除</el-button
              >
              <!---->
            </template>
          </el-table-column>
        </el-table></el-tab-pane
      >
      <!-- <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
    </el-tabs>
    <el-dialog
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="actionDiagShow"
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
            :disabled="prodDisabled"
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
        <!-- -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('actionForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('actionForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
 <script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  computed: {
    combineDate() {
      return this.detailData.concat(this.actionData);
    },
    ...mapState(["foflist"]),
    ...mapGetters(["sysparam","showFundName"]),
  },
  data() {
    return {
      rules: {
        code: [{ required: true, message: "请选择基金", trigger: "blur" }],
        name: [{ required: true, message: "请选择基金", trigger: "blur" }],
        marketval: [{ required: true, message: "请输入金额", trigger: "blur" }],
      },
      stages: ["预赎回", "待投资", "预入款"],
      actionDiagShow: false,
      curAction: {},
      prodDisabled:false,
      finalData: [],
      detailData: [],
      tableData: [],
      actionData: [
        {
          id: 1,
          code: "SY9620",
          name: "华道多策略",
          stage: "预入款",
          b_name: "预入款",
          b_code: "CASH",
          marketval: 2000,
        },
        {
          id: 2,
          code: "SY9620",
          stage: "预赎回",
          b_name: "同亨多策略五号私募证券投资基金",
          b_code: "SCF687",
          marketval: 800,
        },
      ],
      tmaxh: 600,
    };
  },
  methods: {
    changeFOF(val){
          console.log(this.showFundName(val))
      this.curAction.name=this.showFundName(val)
    },
    changeStage(val){
      if(val=='预入款'){
        this.prodDisabled=true
        this.curAction.b_code='CASH'
      }else{
        this.prodDisabled=false

      }
    },
    changeTarget(val){
      console.log(this.showFundName(val))
      this.curAction.b_name=this.showFundName(val)
    },
    showMoney(money) {
      if (money > 20000) {
        return Math.round(money / 10000);
      }
      return money;
    },
    findAction(code,b_code){
      for(let row of this.actionData){
        if(row['code']==code && row['b_code']==b_code)
        {
          return row
        }
      }
      return null
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curAction.stage == "预入款") {
            this.curAction["b_code"] = "CASH";
            this.curAction["b_name"] = "现金";
          }
          if (this.curAction.id) {
            for (let i in this.actionData) {
              if (this.actionData[i]["id"] == curAction.id) {
                this.actionData[i] = JSON.parse(JSON.stringify(this.curAction));
                return;
              }
            }
          } else {
            this.actionData.push(JSON.parse(JSON.stringify(this.curAction)));
          }
          this.actionDiagShow = !this.actionDiagShow;
          this.calcFinal();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    },
    addAction() {
      this.prodDisabled=false
      this.actionDiagShow = !this.actionDiagShow;
      this.curAction = {};
    },
    fundAction(row) {
      this.prodDisabled=false
      this.actionDiagShow = !this.actionDiagShow;
      this.curAction = JSON.parse(JSON.stringify(row));
      this.curAction.stage="预赎回"
      this.curAction.marketval=this.showMoney(this.curAction.marketval)
      console.log(this.curAction);
    },
    getRowKeys(row) {
      return row.code + row.stage + row.b_code;
    },
    calcFinal() {
      let rdict = {};
      this.detailData = [];
      for (var row of this.tableData) {
        let pdict = rdict[row["code"]];
        if (!pdict) {
          pdict = {
            code: row["code"],
            name: this.showFundName(row.code),
            marketval: 0,
            buy: 0,
            income: 0,
            redeem: 0,
            cash: 0,
            children: [],
          };
          rdict[row["code"]] = pdict;
        }
        if (row["b_code"].startsWith("SUBJECT10")) {
          pdict["cash"] += row["marketval"];
        } else if (row["b_code"].startsWith("SUBJECT11")) {
          pdict["marketval"] += row["marketval"];
        } else if (row["b_code"].length == 6) {
          row["name"] = this.showFundName(row.code);
          row["stage"] = "已投";
          let act=this.findAction(row['code'],row['b_code'])
          if(act){
            row['stage']=act['stage']
            row['act_amount']=act['marketval']
          }
          this.detailData.push(row);
          // row['name']=row['b_name']
          // pdict.children.push(row)
        }
        // console.log(pdict)
      }
      for (var row of this.actionData) {
        let pdict = rdict[row["code"]];
        if (!pdict) {
          pdict = {
            code: row["code"],
            name: this.showFundName(row.code),
            marketval: 0,
            buy: 0,
            income: 0,
            redeem: 0,
            cash: 0,
          };
          rdict[row["code"]] = pdict;
        }
        if (row["stage"] == "预赎回") {
          pdict["redeem"] += row["marketval"] * 10000;
        } else if (row["stage"] == "待投资") {
          pdict["buy"] += row["marketval"] * 10000;
        } else if (row["stage"] == "预入款") {
          pdict["income"] += row["marketval"] * 10000;
        }
      }
      this.finalData = [];
      for (var key in rdict) {
        this.finalData.push(rdict[key]);
      }
    },
    showholding(row) {
      if (row["b_code"].startsWith("SUBJECT110")) {
        return "持仓基金市值";
      }
      return row["b_name"];
    },
    getProducts() {
      this.$axios
        .get("/fof/holding", { params: { code: "" } }) //axis后面的.get可以省略；
        .then((response) => {
          this.tableData = this.$tools
            .pandasToJson(response.data)
            .filter((item) => !item.b_code.startsWith("SUBJECT2"));
          this.calcFinal();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
  created() {},
};
</script>