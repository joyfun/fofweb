<template> 
<div>
</div>
</template>



<script>
import Echart from "../../components/Echart.vue";
import FundEchart from "../../components/FundEchart.vue";
export default {
     props: {
     code:{
      type: String,
      default: ""
    },
     title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '80%'
    },

  },
  watch: {
    code:{
    handler: function(val) {
                this.getTable()
              }
    },
    // wts:{
    // handler: function(val) {
    //             console.log(val)
    //             this.forceUpdate()
    //           }
    // }, 
    range:{
    handler: function(val) {
                this.getTable()
              }
    },
  },
      data() {},
      methods: {
          getRankGap(){
        
          }
      },
      mounted(){}
}

</script>