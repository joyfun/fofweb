<template>
  <div id="tableContainer" style="height: 100%">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 打分权重设置</span> 
        <fof-misc code="fof_weight" :cols="['sub_type','style','yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility']"></fof-misc>
        </el-tab-pane>
      <el-tab-pane label="list权重设置"
        >   
     <fof-misc code="list_weight" :cols="['name', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility']"></fof-misc>
      </el-tab-pane> 
    <el-tab-pane label="大类级别">   
     <fof-misc code="quant_type" :cols="['name', 'sharpe_', 'calmar_', 'sortino_', 'dd_', 'dd_week_', 'win_ratio_','yeaily_return_', 'volatility_']"></fof-misc>
      </el-tab-pane> 
     <el-tab-pane label="List条件">   
     <fof-misc code="list_cond" :cols="['name', 'length', 'goodR', 'listratio']"></fof-misc>
      </el-tab-pane> 
    </el-tabs>
</div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import FofMisc from "@/components/FofMisc.vue";
import MarkdownIt from 'markdown-it';

export default {
          components: {
            FofMisc,
        },
};
</script>
