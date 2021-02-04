<template>
  <div>
    <div class="block" style="display: flex; justify-content: space-between">
        <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
        <!-- <el-select v-model="filter.class_type" @change="getList"  style="width:100px"   placeholder="类型">
    <el-option
      v-for="item in class_types"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>     -->

        <!-- <el-select v-model="filter.left" @change="getList" style="width:100px"   placeholder="阶段一">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-select v-model="filter.right" @change="getList" style="width:100px"   placeholder="阶段二">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select> -->
  <el-row>
      <el-col :span="10">
        <el-select v-model="comb1" filterable placeholder="名称">
          <el-option
            v-for="item in foflist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-select v-model="comb2" filterable placeholder="名称">
          <el-option
            v-for="item in foflist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-input v-model="expect"></el-input>
        </el-col>
        <el-col :span="2">
        <el-button type="primary" @click="docalc">计算</el-button>
        </el-col>
  </el-row>
    </div>
  <el-row>
              <el-col :span="24">

 <el-table
          :data="compData"
          show-summary
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="基金名称" label="名称"> </el-table-column>
          <el-table-column prop="近12月收益" label="近12月收益"> </el-table-column>
          <el-table-column prop="波动率" label="波动率"> </el-table-column>
          <el-table-column prop="vola" label="预期波动性"><el-input-number></el-input-number>
          <template slot-scope="scope">
            <el-input-number  v-model="scope.row.vola" :precision="2" :step="0.1" :min="0" :max="10" placeholder="预期波动性"></el-input-number>

            <span></span>
          </template>
           </el-table-column>
          <el-table-column prop="预期收益率" label="预期收益率"><el-input-number></el-input-number>
          <template slot-scope="scope">
              <el-input-number  v-model="scope.row.ret" :precision="2" :step="0.1" :min="0" :max="10" placeholder="预期收益率"></el-input-number>
            <span></span>
          </template>
           </el-table-column>

          <!-- <el-table-column hide="true" prop="amount" label="份额"> </el-table-column> -->

        </el-table>
              </el-col>
  </el-row>
        <!-- <el-button  size="small" @click="downFile()">下载</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button> -->


    <fund-echart
      ref="hischart"
      :titles="current.name"
      style="height: 600px"
      :code="compares"
      :compares="compares"
      :visable="dialogVisible"
    ></fund-echart>
  </div>
</template>
<script>
import axis from "axios";
import FundEchart from "../../components/FundEchart.vue";
import HisTable from "../../components/HisTable.vue";
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    FundEchart,
    Treeselect,
    HisTable,
  },
  computed: {
    compares: {
      get() {
        //   console.log(this.filter.class_type)
        //   console.log(this.addition)
        return this.comb1 + "," + this.comb2;
      },
    },
  },
  props: {
    filters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      temp: -1,
      comb1: "",
      comb2: "",
      expect:0.2,
      compData:[],
      dialogVisible: true,
      origin: {},
      current: {},
      foflist: [],
      filter: {
        class_type: "CTA",
        left: "",
        right: "",
      },
      options: [
        {
          value: "预选",
          label: "预选",
        },
        {
          value: "二选",
          label: "二选",
        },
        {
          value: "备投",
          label: "备投",
        },
        {
          value: "已投",
          label: "已投",
        },
      ],
      class_types: [
        {
          value: "CTA",
          label: "CTA",
        },
        {
          value: "指增",
          label: "指增",
        },
        {
          value: "中性",
          label: "中性",
        },
        {
          value: "套利",
          label: "套利",
        },
        {
          value: "混合",
          label: "混合",
        },
      ],
      normalizer: (node) => {
        return {
          id: node.code,
          label: node.name,
        };
      },
    };
  },

  watch: {
    compares:{      handler(n) {
        var len=n.length
        if(len>1&&n.indexOf(",")<len-1){
        this.doload()
        }
    }},
    $route: {
      handler(n) {
        if (this.filters) {
          console.log("route init ");
          console.log(this.filter);
          var jobj = JSON.parse(JSON.stringify(this.filters));
          for (var key in jobj) {
            this.filter[key] = jobj[key];
          }

          //   this.filter=JSON.parse(JSON.stringify(this.filters));
          //   this.filter["class_type"]="CTA"
        } else {
          this.filter = n.params;
        }
        // 初始化操作
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.remoteMethod();
  },
  methods: {
      docalc(){
          var ret=[]
          for (var i in this.compData){
              var row=this.compData[i]
              if(row["vola"])
              ret.push({"code":row["code"].replace("_extra",""),"vola":row["vola"]})
          }
          if(ret.length==2){
              this.$axios({
        url: "/fof/percent", //          

        method: "POST",
        data: { fund1: ret[0],fund2:ret[1],goal:this.expect},
      }).then((response) => {
            this.compData = this.$tools.pandasToJson(response.data);
            console.log(this.compData)
        });
          }

      },
    doload() {
      this.$axios({
        url: "/fof/jreport", //          

        method: "GET",
        params: { code: this.compares },
      }).then((response) => {
            this.compData = this.$tools.pandasToJson(response.data);
            console.log(this.compData)
        });
    },
    remoteMethod(query) {
      this.$axios({
        url: "/fof/foflist",
        method: "GET",
        params: {},
      }).then((response) => {
        this.foflist = response.data;
      });
    },
    getList() {
      console.log(this.filter);
    },
  },
};
</script>