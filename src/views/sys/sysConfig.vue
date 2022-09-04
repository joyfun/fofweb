<template>
  <div id="tableContainer" style="height: 100%">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 打分权重设置</span> 
        <fof-misc code="fof_weight" :cols="['sub_type','style','yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility']"></fof-misc>
        </el-tab-pane>
      <el-tab-pane label="投资List权重"
        >   
     <fof-misc code="list_weight" :cols="['name', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility','profit_loss']"></fof-misc>
      </el-tab-pane> 
      <el-tab-pane label="投后List权重"
        >   
     <fof-misc code="after_weight" :cols="['name', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility','profit_loss']"></fof-misc>
      </el-tab-pane> 
      <el-tab-pane label="投后分析权重"
        >   
     <fof-misc code="after_weight1" :cols="['name', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility','profit_loss']"></fof-misc>
      </el-tab-pane> 
    <el-tab-pane label="大类级别">   
     <fof-misc code="quant_type" :cols="['name', 'sharpe_', 'calmar_', 'sortino_', 'dd_', 'dd_week_', 'win_ratio_','yeaily_return_', 'volatility_']"></fof-misc>
      </el-tab-pane> 
     <el-tab-pane label="观察状态">   
     <fof-misc code="watch_cond" :cols="['status',  'listrate', 'mean']"></fof-misc>
      </el-tab-pane> 
           <el-tab-pane label="更多说明">   
     <iframe width="100%" height="1200px" src="http://192.168.0.21:4999/web/#/10?page_id=245"></iframe>
      </el-tab-pane> 
    </el-tabs>
</div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import FofMisc from "@/components/FofMisc.vue";

export default {
          components: {
            FofMisc,
        },
};
</script>
