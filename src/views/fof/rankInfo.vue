<template>
  <div ref="tableContainer" style="	height : 100%;">
          <vxe-toolbar>
          <template #buttons>
            <vxe-button @click="showRankHis">排名对比</vxe-button>
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
          </template>
        </vxe-toolbar>    
       <vxe-table
          border
          ref="rankTable"
          :align="allAlign"
          size="mini"
          show-overflow
          :sort-config="{trigger: 'cell', defaultSort: {field: 'rank', order: 'asc'}, orders: ['desc', 'asc', null]}"
          :data="tableData"
        >
                  <vxe-column type="checkbox" width="30"></vxe-column>
          <!-- <vxe-column type="seq" width="60"></vxe-column> -->
          <vxe-column width="160" field="code" title="产品名称" >
        <template #default="{ row }">
                   <el-button  @click.native.prevent="addCart(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>
       <a href="javascript:;" @click="showHis(row)">{{ showFundName(row.code) }}</a>
                           <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="历史" placement="left-start"><i class="el-icon-s-marketing" ></i></el-tooltip></el-button>

            </template>
          </vxe-column>
            <vxe-column width="80" field="date" title="数据日期" >
          </vxe-column>
           <vxe-column width="80" field="rank" sortable :title="rankTitle" >
          </vxe-column>
          <vxe-column :key="af" sortable v-for="af of ['sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio','yeaily_return', 'volatility']"  :title="af" :field="af"  >
            <template #default="{ row }">
              <span>{{ row[af] }}</span>
            </template>
          </vxe-column>
        </vxe-table> 
    </div>
</template>

 <script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Bus from '@/store/bus.js';
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
    rankTitle: {
      get() {
        return '排名('+this.tableData.length+')';
      }
    },
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

        addCart(row){
      if(row['code']){
        Bus.$emit("addcart",{code:row['code'],name:this.showFundName(row['code'])})
      }
    },
     showFundHis(row){
          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"hisChart"})

      },
    showHis(row){
       Bus.$emit("showChart",{"cur_code":row.code,"diagName":"rankChart"})

    },
         showHis(row){
          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"rankChart"})

      },
     showRankHis(){
          let sels=this.$refs.rankTable.getCheckboxRecords()
          Bus.$emit("showChart",{"cur_code":sels.map(r=>r["code"]).join(','),"diagName":"rankChart"})

      },
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
