<template>
  <div id="tableContainer" style="	height : 100%;">
      <el-row>
            <el-col :span="6">
                  <el-select v-model="filter.class_type" @change="changeSub"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
  <el-select v-model="filter.sub_type" @change="getList"  style="width:100px"  clearable placeholder="子">
    <el-option
      v-for="item in sub_type"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>  

    <el-table
    ref="multipleTable"
    :data="foflist"
    tooltip-effect="dark"
    :row-key="(row)=>{ return row.code}"
    :max-height="tmaxh"
    style="width: 100%;margin-top:20px;">
    <el-table-column
      label="名称"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <!-- <el-table-column v-if="full"
      label="类别"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row['class_type'] }}</template>
    </el-table-column>
    <el-table-column v-if="full"
      label="子类别"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row['sub_type'] }}</template>
    </el-table-column>
    <el-table-column v-if="full"
      label="阶段"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row['stage'] }}</template>
    </el-table-column>
    <el-table-column
    width="40"
            fixed="right"
      >
        <template slot-scope="scope">
            <el-button  @click.native.prevent="delCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete rightCell" style="color:red;"></i></el-tooltip></el-button>
        </template>
    </el-table-column> -->
    </el-table> 
            </el-col>
            <el-col :span="18">
                    <rank-table       ref="ranktable"   :code="cur_code"  ></rank-table>

            </el-col>   
      </el-row>
  </div>
</template>

<script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import { mapState,mapGetters,mapMutations } from 'vuex'
import Bus from '@/store/bus.js';
import Vue from 'vue'
import RankTable from '@/components/RankTable';
// 引入柱状图
// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
        components: {
            RankTable,
        },
  props: {
    full:{
      type: Boolean,
      default: false
    },
     code:{
      type: String,
      default: ""
    },
    temp:{
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
       ...mapGetters(['allCart','token',"allparam","sysparam",'usermenu'])

    },
  watch: {
  },
  data() {
    return {
      foflist:[],
      cur_code:"",
      filter:{},
      fofoptions:[],
      inputVisible: false,
      nTagName: '',
      zz500:5,
      tmaxh:600,
      tlist:[{"name":"名称","code":"code1"},{"name":"名称2","code":"code2"}],
      rawlist:[],
      mult:[],
      sel:[],
      alllist:[],
      tableData:[]  
    }
  },
  methods: {
  changeSub(row){
    var id=-1
        for (var ap of this.sysparam.class_type)
                {
                    if(ap.code==row){
                        id=ap.id
                        break;
                    }
                    
                }

                this.sub_type=this.allparam['param_'+id]

    },
    getList(){},
    handleSelectionChange(val) {
        this.sel = val;
      }
  },
  created(){   
    //this.changeCart(this.nowcart)
    this.remoteMethod();
},

  mounted() {
    window.addEventListener('resize', this.resizeChart)
    Bus.$on('addcart',(arg)=> {
          console.log("========add========")
          this.cartAction(arg)
  })
    Bus.$on('switchcart',(arg)=> {
          console.log(arg)
          this.changeCart(arg)
  })
  
  }
  ,
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>