<template>
  <div width="800px">
    <el-row width="800px">
      <el-col span="12">
        <el-select
          v-model="cur_fof"
          style="width: 160px"
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
        <el-button type="primary" @click="genWeekly">生成周报</el-button>
        <el-button type="primary" @click="downWeekly">下载周报</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col span="12">
        <el-button type="primary" @click="doaction">刷新最新净值</el-button>
        <el-button type="primary" @click="updateparam">刷新参数</el-button>
        <el-button type="primary" @click="sendmail">发送邮件</el-button>
        <el-button type="primary" @click="fetchmail">收取邮件</el-button>
        <el-button type="primary" @click="testAction">测试事件</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col span="24">
        <iframe
          width="100%"
          height="600px"
          src="http://192.168.0.22:5555"
        ></iframe>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import store from '@/store'
import { mapGetters } from 'vuex'

// import the styles
export default {
  components: {},
  computed: {
    ...mapGetters(['sysparam']),
    compares: {
      get() {
        //   console.log(this.filter.class_type)
        //   console.log(this.addition)
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
      cur_fof: 'SY9620',
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
      },
      normalizer: (node) => {
        return {
          id: node.code,
          label: node.name
        }
      }
    }
  },

  watch: {
    compares: {
      handler(n) {
        var len = n.length
        if (len > 1 && n.indexOf(',') < len - 1) {
          this.doload()
        }
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
    //this.remoteMethod();
  },
  methods: {
    genWeekly() {
      this.$axios({
        url: '/fof/action',
        data: { 'code': 'weekly', 'fof': this.cur_fof }, //
        method: 'POST'
      }).then((response) => {
        console.log(response.data)
      })
    },
    downWeekly() {
      window.location.href =
        '/fof/downreport?code=' + this.cur_fof + '&r=' + Math.random()
    },
    updateparam() {
      var that = this
      this.$axios.get('/sys/param?refresh=1').then((response) => {
        let params = {}
        for (var key in response.data) {
          params[key] = response.data[key]['child']
        }
        store.commit('setSysParam', params)
      })
    },
    doaction() {
      this.$axios({
        url: '/fof/action',
        data: { 'code': 'update_cur' }, //
        method: 'POST'
      }).then((response) => {
        console.log(response.data)
      })
    },
    sendmail() {
      this.$axios({
        url: '/fof/action',
        data: { 'code': 'sendmail' }, //
        method: 'POST'
      }).then((response) => {
        console.log(response.data)
      })
    },
    fetchmail() {
      this.$axios({
        url: '/fof/action',
        data: { 'code': 'fetchmail' }, //
        method: 'POST'
      }).then((response) => {
        console.log(response.data)
      })
    },
    testAction() {
      this.$axios({
        url: '/sys/protected',
        // data: { 'code': 'fetchmail' }, //
        method: 'GET'
      }).then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>
<style scoped>
.ctable {
  position: relative;
  border: 1px solid #000;
  overflow-x: scroll;
}
td {
  border: solid #000;
  width: 120px;
  border-width: 0px 1px 1px 0px;
}
</style>