<template>
  <div ref="tableContainer" style="	height : 100%;">
{{type}}{{date}}
    <el-date-picker style="width:130px"
      v-model="date"
      value-format="yyyyMMdd"
      format="yyyyMMdd"
      align="right"
      type="date"
      placeholder="选择日期"
      >
    </el-date-picker>
                <vxe-radio-group v-model="type" size="mini" :strict="false">
            <vxe-radio-button label="aas" content="AAS"></vxe-radio-button>
            <vxe-radio-button label="cta0" content="CTA0"></vxe-radio-button>
            <vxe-radio-button label="cta1" content="CTA1"></vxe-radio-button>
            <vxe-radio-button label="指增" content="指增"></vxe-radio-button>
            <vxe-radio-button label="中性" content="中性"></vxe-radio-button>

          </vxe-radio-group>
       <vxe-table
          border
          :align="allAlign"
          size="mini"
          show-overflow
          :sort-config="{trigger: 'cell', defaultSort: {field: 'rank', order: 'asc'}, orders: ['desc', 'asc', null]}"
          :data="tableData"
        >
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column width="160" field="code" title="产品名称" >
            <template #default="{ row }">{{
              showFundName(row.code)
            }}</template>
          </vxe-column>
            <vxe-column width="80" field="date" title="数据日期" >
          </vxe-column>
          <vxe-column :key="af" sortable v-for="af of ['rank','rankF','rankR','sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility']"  :title="af" :field="af"  >
            <template #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
          </vxe-column>
        </vxe-table> 
    </div>
</template>

 <script>
import { mapGetters, mapMutations, mapState } from "vuex";
export default {
        //   components: {
        //     SankeyChart,
        // },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    type :{
              handler(n){
                  this.getProducts()
            },
    
    },
     date :{
              handler(n){
                  this.getProducts()
            },
    
    }
  },
  computed: {
    ...mapState(["foflist"]),
    ...mapGetters(["sysparam","token","showFundName"]),
  },
  data() {
    return {  
        allAlign:"right",
        tableData:[],
        date: '',
        type: 'aas',
    };
  },
  methods: {
    getProducts() {
      this.$axios
        .get("/fof/rankbyType", { params: { date: this.date,type:this.type } })
        .then((response) => {
          this.tableData =response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
  created() {
      this.date=this.$moment().format("YYYYMMDD");
    // this.getMisc("fof_action")

  },
};
</script>
<style lang="scss" >
</style>
