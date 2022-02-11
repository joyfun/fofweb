<template>
  <div id="tableContainer" style="	height : 100%;">
      </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  props: {
     full: {
      type: Boolean,
      default: false
    },
    },
  watch: {

  },
     computed: {
    combineDate() {
      return this.detailData.concat(this.actionData)
    },
     ...mapGetters(['sysparam'])

   },
  data() {
    return {
        finalData:[],
        detailData:[],
        tableData:[],
        actionData:[{"code":"SY9620","name":"华道多策略","stage":"预入款","b_name":"预入款","amount":2000},{"code":"SY9620","stage":"预赎回","b_name":"同亨多策略五号私募证券投资基金","amount":800}],
        tmaxh:600,

    }
  },
  methods: {
     getRowKeys(row){
      return row.code + row.b_code
    }
  },
  mounted() {
      this.getProducts()
  },
  created(){
      
  }

}
</script>