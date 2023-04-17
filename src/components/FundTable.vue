<template>
  <div ref="tableContainer" style="height: 100%">
    <div class="block" style="display: flex; justify-content: space-between">
      <div style="display: flex; justify-content: space-between">
        <!-- <el-button-group>
  <el-button type="primary">7天</el-button>
  <el-button type="primary">30天</el-button>
  <el-button type="primary">90天</el-button>
  <el-button type="primary">本年</el-button>
</el-button-group> -->

        <!-- <el-select
          v-model="filter.class_type"
          @change="changeSub"
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
        </el-select> -->
        <el-select
          v-model="suser"
          style="width: 140px"
          clearable
          @change="getCart"
          placeholder="切换购物车"
        >
          <el-option
            v-for="item of selusers"
            :key="item"
            v-show="item != token"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="mult"
          style="width: 140px"
          multiple
          popper-class="pop-div-my"
          :popper-append-to-body="true"
          clearable
          filterable
          :filter-method="filterMethod"
          placeholder="名称"
        >
          <el-option
            v-for="item in fofoptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="block" style="display: flex; justify-content: space-between">
      <el-button type="primary" size="small" @click="addCart">添加</el-button>
      <el-button type="primary" size="small" @click="showCart">对比</el-button>
      <el-button
        v-if="usermenu.indexOf('rank-btn') > -1"
        type="primary"
        size="small"
        @click="showRank"
        >排名</el-button
      >
      <!-- <el-button type="primary"   size="small" @click="showSimu">仿真</el-button> -->
    </div>
    <div class="block" style="display: flex; flex-wrap: wrap">
      <el-tag
        @click="changeCart('default')"
        :effect="'default' == nowcart ? 'dark' : 'light'"
        type="warning"
        :disable-transitions="false"
      >
        默认
      </el-tag>
      <el-tag
        :key="tag"
        v-for="(item, tag) in allCart"
        v-show="tag != 'default'"
        @click="changeCart(tag)"
        @close="delCartTag(tag)"
        :effect="tag == nowcart ? 'dark' : 'light'"
        type="warning"
        :closable="tag == nowcart"
        :disable-transitions="false"
      >
        {{ tag }}
      </el-tag>
      <el-input
        id="tInput1"
        style="width: 80px"
        v-show="inputVisible"
        v-model="nTagName"
        width="10"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
      >
      </el-input>
      <el-button
        id="tBtn1"
        v-show="!inputVisible"
        class="button-new-tag"
        size="small"
        @click="showInput"
        >+添加</el-button
      >
    </div>
    <div>
      <el-tag
        :key="tag"
        v-for="(item, tag) in otherCart"
        @click="changeCart(tag, true)"
        :effect="tag == nowcart ? 'dark' : 'light'"
        type="info"
        :disable-transitions="false"
      >
        {{ tag }}
      </el-tag>
    </div>
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
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55">
      </el-table-column>
      <el-table-column label="名称" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column v-if="full" label="类别" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row['class_type'] }}</template>
      </el-table-column>
      <el-table-column
        v-if="full"
        label="子类别"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row['sub_type'] }}</template>
      </el-table-column>
      <el-table-column v-if="full" label="阶段" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row['stage'] }}</template>
      </el-table-column>
      <el-table-column v-if="showmy" width="40" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="delCart(scope.row)"
            type="text"
            size="small"
            ><el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="left-start"
              ><i
                class="el-icon-delete rightCell"
                style="color: red"
              ></i></el-tooltip
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import { mapState, mapGetters, mapMutations, Store } from 'vuex'
import Bus from '../store/bus.js'
import Vue from 'vue'
// 引入柱状图

// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
  props: {
    full: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    },
    temp: {
      type: Number,
      default: 0
    },
    title: {
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
    ...mapState({
      current: (state) => state.tab.currentMenu,
      nowcart: (state) => state.nowcart,
      rawlist: (state) => state.foflist
    }),
    ...mapGetters(['allCart', 'token', 'allparam', 'sysparam', 'usermenu'])
  },
  watch: {
    code: {
      handler: function (val) {
        this.getTable(val)
      }
    },
    temp: {
      handler: function (temp) {
        this.getTable(this.code)
      }
    },
    isVisible: {
      handler: function (val) {
        console.log(val)
        console.log(this)
        if (val) {
          this.getChart(this.code)
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
      foflist: [],
      filter: {},
      suser: '',
      showmy: true,
      otherCart: {},
      selusers: ['chenjie', 'zhoujian', 'ccc'],
      fofoptions: [],
      inputVisible: false,
      nTagName: '',
      zz500: 5,
      tmaxh: 600,
      tlist: [
        { 'name': '名称', 'code': 'code1' },
        { 'name': '名称2', 'code': 'code2' }
      ],
      // rawlist:[],
      mult: [],
      sel: [],
      alllist: [],
      tableData: []
    }
  },
  methods: {
    ...mapMutations({
      setFoflist: 'setFoflist'
    }),
    getCart() {
      if (this.suser) {
        this.$axios({
          url: '/sys/getcart',
          method: 'GET',
          params: { 'user': this.suser }
        }).then((response) => {
          console.log('======get cart=======')
          console.log(response.data)
          this.otherCart = {}
          for (let cname in response.data) {
            this.otherCart[cname] = JSON.parse(response.data[cname])
          }
          console.log(this.otherCart)

          //})
        })
      } else {
        this.otherCart = {}
      }
    },
    filterMethod(query) {
      console.log(query)
      console.log(this.alllist)
      if (query) {
        this.fofoptions = []
        let qrys = query.split(' ')

        let result = []
        let codes = []
        for (var qry of qrys)
          this.alllist.forEach((val) => {
            if (val.name.indexOf(qry) != -1) {
              result.push(val)
              if (val.name == qry) codes.push(val.code)
            }
          })
        // if(qrys.length==codes.length){
        Vue.set(this, 'fofoptions', result)
        // this.$nextTick(()=>{
        for (var cd of codes) {
          this.mult.push(cd)
        }
        // })
      }
      // }
      else {
        this.fofoptions = this.alllist
      }
    },
    handleInputConfirm() {
      console.log(this.nTagName)
      var message = ''
      if (this.allCart[this.nTagName]) {
        message = '标签已存在'
      } else {
        // this.allCart[this.nTagName]='[]'
        this.$store.dispatch('addCartTag', this.nTagName).then(() => {
          Vue.set(this, 'foflist', [])
          this.nTagName = ''
          this.inputVisible = false
          console.log(this.allCart)
        })
      }
      this.$message({
        showClose: true,
        message: '添加标签成功',
        type: 'info'
      })
    },
    delCartTag(tag) {
      let that = this
      this.$axios({
        url: '/sys/delcart',
        data: { 'user': this.token, 'name': tag }, //
        method: 'POST'
      }).then((response) => {
        this.$store.dispatch('delCartTag', tag).then(() => {
          that.$refs.multipleTable.clearSelection()
          that.sel = []
          Vue.set(this, 'foflist', this.allCart[this.nowcart])
        })
      })
      // this.allCart.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true
    },

    get_info(code) {
      console.log('get info:' + code)
      for (var af of this.rawlist) {
        if (af['code'] == code) {
          console.log(af)
          return af
        }
      }
      return null
    },
    changeCart(row, other) {
      let allCart = this.allCart
      if (other) {
        allCart = this.otherCart
        this.showmy = false
      } else {
        this.showmy = true
        this.$store.dispatch('changeCart', row)
      }
      let ret = allCart[row]
      for (var i in ret) {
        let aret = this.get_info(ret[i]['code'])
        if (aret) {
          Vue.set(ret, i, aret)
        }
      }
      console.log(ret)
      Vue.set(this, 'foflist', ret)
      console.log(this.foflist)
    },
    delCart(row) {
      for (var key in this.foflist) {
        if (this.foflist[key].code === row.code) {
          this.foflist.splice(key, 1)
        }
      }
      this.$store.dispatch('setCart', this.foflist)
      this.updateCart()
    },
    showCart(rows) {
      var codes = ''
      this.sel.forEach((row) => {
        codes = codes + row['code'] + ','
      })
      console.log(this.$route.path)
      if (
        this.$route.path.indexOf('fundinfo') > -1 ||
        this.$route.path.indexOf('rankinfo') > -1
      ) {
        Bus.$emit('cartchart', codes)
      } else {
        Bus.$emit('showChart', {
          'cur_code': codes,
          'diagName': 'compareTable'
        })
      }
    },
    showRank(rows) {
      var codes = ''
      this.sel.forEach((row) => {
        codes = codes + row['code'] + ','
      })
      console.log(codes)
      Bus.$emit('cartrank', codes)
    },
    showSimu(rows) {
      var codes = ''
      this.sel.forEach((row) => {
        codes = codes + row['code'] + ','
      })
      console.log(codes)
      Bus.$emit('calcsimu', codes)
    },
    addCart() {
      // var funds=[]
      for (var code of this.mult) {
        console.log(code)
        var afund = this.alllist.find((item) => {
          //遍历list的数据
          return item.code === code //筛选出匹配数据
        })
        var old = this.foflist.find((item) => {
          //遍历list的数据
          return item.code === code //筛选出匹配数据
        })
        console.log(old)
        if (old) {
          continue
        }
        this.foflist.push({ code: afund['code'], name: afund['name'] })
      }
      this.$store.dispatch('setCart', this.foflist)
      this.foflist.splice(1, 0)
      this.updateCart()

      // console.log(funds)
    },
    cartAction(afund) {
      var old = this.foflist.find((item) => {
        //遍历list的数据
        return item.code === afund['code'] //筛选出匹配数据
      })
      console.log(old)
      if (old) {
        return
      }
      this.foflist.push({ code: afund['code'], name: afund['name'] })
      this.$store.dispatch('setCart', this.foflist)
      this.updateCart()
      this.foflist.splice(1, 0)
    },
    updateCart() {
      this.$axios({
        url: '/sys/updatecart1',
        data: {
          'user': this.token,
          'name': this.nowcart,
          'codes': JSON.stringify(this.foflist)
        }, //
        method: 'POST'
      }).then((response) => {
        console.log(response.data)
      })
    },
    changeSub(row) {
      console.log(row)
      if (row) {
        var a = []
        for (var ar of this.rawlist) {
          if (ar.class_type == row) a.push(ar)
        }
        if (a.length > 0) this.alllist = a
      } else {
        this.alllist = this.rawlist
      }
      this.fofoptions = this.alllist
    },
    remoteMethod(query) {
      // this.$axios({
      //   url: "/fof/foflist",
      //   method: "GET",
      // })
      //   .then((response) => {
      //       this.rawlist=response.data
      this.changeSub(this.filter.class_type)
      //       this.setFoflist(this.rawlist)
      //       console.log("####init####")

      //   })
      // this.rawlist=this.foflist
      this.tmaxh = this.$refs.tableContainer.clientHeight - 120
    },
    handleSelectionChange(val) {
      this.sel = val
    }
  },
  created() {
    //this.changeCart(this.nowcart)
  },

  mounted() {
    window.addEventListener('resize', this.resizeChart)
    Bus.$on('addcart', (arg) => {
      console.log('========add========')
      this.cartAction(arg)
    })
    Bus.$on('switchcart', (arg) => {
      console.log(arg)
      this.changeCart(arg)
    })
    this.remoteMethod()
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped>
// .el-input--mini .el-input__inner {
//     width: 20%;
//   }
</style>
