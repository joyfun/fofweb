<template>
<div>
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
    <el-table-column
      label="备案号"
      sortable
      show-overflow-tooltip>
     <template slot-scope="scope">{{ scope.row.code }}</template>
    </el-table-column>
    <el-table-column v-if="full"
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

  },
  mounted() {

  },

}
</script>