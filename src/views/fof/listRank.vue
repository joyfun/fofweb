<template>
  <div ref="tableContainer" style="	height : 100%;">
      <el-row >
            <el-col :span="llen">
                  <el-select v-model="filter.class_type" @change="changeSub"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.quant_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
  <el-select v-model="filter.sub_type" @change="getAASList"  style="width:100px"  clearable placeholder="子">
    <el-option
      v-for="item in sub_type"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>  {{aastype}}
<!-- <el-radio-group v-model="aastype" size="medium">
      <el-radio-button label="AAS" ></el-radio-button>
      <el-radio-button label="CTA"></el-radio-button>
    </el-radio-group> -->
    <span style="float:right">
            <el-button  type="primary" size="small" @click="do_rank">{{btntext}}</el-button>
    </span>
      <el-table
    ref="multipleTable"
    :data="tableData"
    :max-height="tmaxh"
    :row-key="(row)=>{ return row.code}"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px;"
     >
    <el-table-column
      label="名称"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
   <el-table-column
      label="类别"
      width="80"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row['class_type'] }}</template>
    </el-table-column>
    <!--  <el-table-column v-if="full"
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
    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 25, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totaltableData.length">
        </el-pagination>
            </el-col>
            <el-col :span="24-llen" :style="'height:'+tmaxh+'px;'">
                    <rank-table       ref="ranktable"   :code="cur_code"  style=""></rank-table>

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
          aastype:{
    handler: function(val) {
                this.getAASList(val)
              }
    }
  },
  data() {
    return {
      foflist:[],
      sub_type:[],
      cur_code:"",
      llen:6,
      aastype:"",
      btntext:"分析",
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
      currentPage: 1,
      PageSize:30,
      alllist:[],
      totaltableData:[],
      tableData:[]  
    }
  },
  methods: {
  do_rank(){
      let codes=[]
      if(this.btntext=="<"){
          this.llen=6
          this.btntext="分析"
      }else{
      if(this.totaltableData.length>0){
          codes=this.totaltableData.map(r=>r["code"]);
          this.cur_code=codes.join(",")
          this.btntext="<"
          this.llen=1
      }}

  },
  changeSub(row){
    var id=-1
    var lvs=["甲","乙","丙","丁"]
    var ret=[]
        if(row=='AAS' || row=="CTAFOF"){
          for (var lv of lvs){
              ret.push({'code':row.substring(0,3)+lv,'value':row.substring(0,3)+lv})
          }
          this.sub_type=ret
        }else{
        for (var ap of this.sysparam.quant_type)
                {
                    if(ap.code==row){
                        id=ap.id
                        break;
                    }
                    
                }
                if(this.allparam['param_'+id]){
                  this.sub_type=this.allparam['param_'+id]
                }else{
                  this.sub_type=[{'code':ap.code,'value':ap.value}]
                }
              }
    },
    getAASList(subType){
        let $this=this
            this.$axios( {
                url: '/fof/getsub',
                method: 'GET',
                params: {"aastype":subType}
                }).then((response) => {
                 this.totaltableData = response.data
                 this.tableData = this.totaltableData.slice(0 ,$this.PageSize);
                })

    },
    getList(subType){
        let $this=this
            this.$axios( {
                url: '/fof/list',
                method: 'GET',
                params: {"sub_type":subType}
                }).then((response) => {
                 this.totaltableData = response.data
                 this.tableData = this.totaltableData.slice(0 ,$this.PageSize);
                })

    },
    handleSelectionChange(val) {
        this.sel = val;
      }
      ,
          // 分页方法
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.PageSize = val;
        console.log(this.PageSize)
        console.log(this.currentPage)
      },
      // 跳转
      handleCurrentChange(val) {
        console.log(this.multipleSelection)
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        //页面每页大小
        console.log(this.PageSize)
        //当前页
        console.log(this.currentPage)
        let startindex = (this.currentPage - 1) * this.PageSize;
        if(startindex <= 0){
                  startindex = 0;
        }
        let endindex;
        if (this.PageSize * this.currentPage > this.totaltableData.length){
            endindex =  this.totaltableData.length ;
        }else{
            endindex =  this.PageSize * this.currentPage ;
        }
        console.log(startindex,endindex)
          this.tableData =  this.totaltableData.slice(startindex ,endindex);
      },
       resizeChart(){
                this.tmaxh=this.$refs['tableContainer'].clientHeight-120

      },
  },
  created(){   
    //this.changeCart(this.nowcart)
    //this.remoteMethod();
    // this.$nextTick
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
                    this.$nextTick(() => { 
                  this.resizeChart()})
  
  }
  ,
  destroyed() {
    // window.removeEventListener('resize', this.resizeChart)
  }
}
</script>