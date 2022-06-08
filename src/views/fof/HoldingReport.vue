<template>

  <div ref="tableContainer" style="height:100%">
      <compare-table :code="holdingcode" :showDrop="true"  :tmaxh="tmaxh"></compare-table>
  </div>
</template>

 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import { mapGetters, mapMutations, mapState } from "vuex";
import CompareTable from '../../components/CompareTable';

export default {
      components: {
            CompareTable,
            
        },
  watch: {
    code: {
      handler: function (val) {
       this.showcomapre();
      },
    },
  },
   computed: {
    ...mapState(["foflist","holding","actionData"]),
    ...mapGetters(["sysparam","token","showFundName"]),
  },
  data() {
    return {
    holdingcode:"",
    tmaxh:"600px"
    }
  },
  methods: {
    
  },
  mounted() {
      console.log(this.holding)
      this.holdingcode=this.holding.map(row=>row["b_code"]).join()
      this.tmaxh=this.$refs.tableContainer.clientHeight-60

  },
  destroyed() {
  }
}
</script>

<style lang="scss" scoped></style>
