<template>
<div>
        <el-button  size="small" @click="hisCompare()">对比</el-button>
        <el-button  size="small" @click="showcorr()">相关性</el-button>
        <el-button  size="small" @click="compare()">业绩对标</el-button>
 <el-table
    ref="multipleTable"
    :data="foflist"
    tooltip-effect="dark"
    :row-key="(row)=>{ return row.code}"
    :max-height="tmaxh"
    style="width: 100%;margin-top:20px;">
    <el-table-column
      type="selection"
      :reserve-selection="true"
      width="55">
    </el-table-column>
    <el-table-column
      label="名称"
      sortable
      prop="short_name"
      show-overflow-tooltip>
     <template slot-scope="scope">       <a href="javascript:;" @click="showHis(scope.row)">{{ scope.row.short_name }}</a></template>
    </el-table-column>
    <el-table-column
      label="备案号"
      prop="code"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.code }}</template>
    </el-table-column>
    <el-table-column 
      label="类别"
      sortable
      prop="class_type"
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row['class_type'] }}</template>
    </el-table-column>
    <el-table-column 
      label="子类别"
      sortable
      prop="sub_type"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column 
      label="阶段"
      sortable
      prop="stage"
      show-overflow-tooltip>
    </el-table-column>
    <!-- <el-table-column
    width="40"
            fixed="right"
      >
        <template slot-scope="scope">
            <el-button  @click.native.prevent="delCart(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete rightCell" style="color:red;"></i></el-tooltip></el-button>
        </template>
    </el-table-column> -->
    </el-table> 
</div>
</template>
 <script>
import Bus from '@/store/bus.js';
export default {
  props: {
    foflist: {
      type: Array,
      default: []
    },
     full: {
      type: Boolean,
      default: false
    },
    },
  watch: {
    // code:{
    // handler: function(val) {
    //     console.log(val)
    //             this.getTable(val)
    //           }
    // }
  },
  data() {
    return {
        tmaxh:600,
    //   raw_data:{},
    //   corrdata:[],
    //   funds:{},
    //   startidx:0,
    //   max_date:'',
    // //   width: this.initWidth(),
    //   echart: null,
    //   tableData:[]  
    }
  },
  methods: {
      showHis(row){
          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"hisChart"})

      },
      hisCompare() {
          let sels=this.$refs.multipleTable.selection.map(row=>row['code'])
          let selcode=sels.join(',')

          if(selcode){
            Bus.$emit("showChart",{"cur_code":selcode,"diagName":"hisChart"})
          }
      },
      compare(){
          let sels=this.$refs.multipleTable.selection.map(row=>row['code'])
          let selcode=sels.join(',')

          if(selcode){
              Bus.$emit("showChart",{"cur_code":selcode,"diagName":"fullDialog"})
          }
      },
      showcorr(){
          let sels=this.$refs.multipleTable.selection.map(row=>row['code'])
          let selcode=sels.join(',')

          if(selcode){
              Bus.$emit("showChart",{"cur_code":selcode,"diagName":"corrDialog"})
          }
      }
  },
  mounted() {

  },

}
</script>