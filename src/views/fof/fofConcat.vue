<template>
  <div>
    <div class="block" style="display: flex; justify-content: space-between">
      <div style="width: 1200px">
        <el-select v-model="comb1" filterable placeholder="新产品">
          <el-option
            v-for="item in foflist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-select v-model="comb2" filterable placeholder="旧产品">
          <el-option
            v-for="item in foflist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="doload" style="margin-left: 10px"
          >拼接</el-button
        >
      </div>
    </div>
    <!-- <el-button  size="small" @click="downFile()">下载</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button> -->

    <fund-echart
      ref="hischart"
      :titles="current.name"
      :wk="'0'"
      style="height: 600px"
      :code="compares"
    ></fund-echart>
  </div>
</template>
<script>
import FundEchart from '../../components/FundEchart.vue'
import HisTable from '../../components/HisTable.vue'
import Vue from 'vue'

// import the styles
export default {
  components: {
    FundEchart,
    HisTable
  },
  computed: {
    compares: {
      get() {
        return this.comb1 + ',' + this.comb2
      }
    }
  },
  props: {
    filters: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      temp: -1,
      comb1: '',
      comb2: '',
      combine: null,
      corr: 0,
      goal0: 0,
      expect: 0.2,
      cret: 0,
      eret: 0,
      cvola: 0,
      evola: 0,
      compData: [],
      dialogVisible: true,
      origin: {},
      current: {},
      foflist: [],
      filter: {
        class_type: 'CTA',
        left: '',
        right: ''
      }
    }
  },

  watch: {
    compares: {
      handler(n) {
        // var len=n.length
        // if(len>1&&n.indexOf(",")<len-1){
        // this.doload()
        // }
      }
    },
    $route: {
      handler(n) {
        if (this.filters) {
          console.log('route init ')
          console.log(this.filter)
          var jobj = JSON.parse(JSON.stringify(this.filters))
          for (var key in jobj) {
            this.filter[key] = jobj[key]
          }

          //   this.filter=JSON.parse(JSON.stringify(this.filters));
          //   this.filter["class_type"]="CTA"
        } else {
          this.filter = n.params
        }
        // 初始化操作
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    dochange(row) {
      //calcvola(row[""],v1,w2,v2,corr)
    },
    doload() {
      this.$axios({
        url: '/fof/concat', //
        method: 'GET',
        params: { base: this.comb1, comb: this.comb2 }
      }).then((response) => {
        if ((response.data.status = 'success')) {
          this.comb2 = ''
        }
      })
    },
    remoteMethod(query) {
      this.$axios({
        url: '/fof/foflist',
        method: 'GET',
        params: {}
      }).then((response) => {
        this.foflist = response.data
      })
    }
  }
}
</script>