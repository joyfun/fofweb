<template>
  <div id="tableContainer" ref="tableContainer" style="height: 100%">
          <vxe-select v-model="cur_fof" placeholder="默认尺寸">
            <vxe-option v-for="item in sysparam.FOF" :key="item.value" :label="item.value"
      :value="item.code" ></vxe-option>
          </vxe-select>          
<vxe-table
          border
          ref="holdingTable"
          :data="holdingData"
          align="right"
          tooltip-effect="dark"
        >
          <vxe-column
            title="类型"
            sortable
            field="type"
            show-overflow-tooltip
          >
          </vxe-column>
          <!-- <vxe-column
            title="金额(万)"
            sortable
            align="right"
            field="marketval"
            show-overflow-tooltip
          >          
          </vxe-column> -->
          <vxe-column
            title="波动率"
            sortable
            field="volatility"
            show-overflow-tooltip
          >
          </vxe-column>
          <vxe-colgroup title="收益" align="center">
           <vxe-column
            title="正常"
            sortable
            field="yeaily_return"
            show-overflow-tooltip
          >
          </vxe-column>
           <vxe-column
            title="悲观"
            sortable
            field="yeaily_return_w"
            show-overflow-tooltip
          >
          </vxe-column>
          </vxe-colgroup>
          <vxe-column
            title="回撤"
            sortable
            field="dd"
            show-overflow-tooltip
          >
          </vxe-column> 
          <vxe-colgroup title="资金" align="center">
           <vxe-column
            title="金额(万)"
            sortable
            field="marketval"
            show-overflow-tooltip
          >
          <template slot-scope="scope">{{
              showMoney(scope.row.marketval)
            }}</template>
          </vxe-column>
           <vxe-column
            title="份额"
            sortable
            field="percent"
            show-overflow-tooltip
          >
          </vxe-column>
          </vxe-colgroup>
            <vxe-colgroup title="近期表现" align="center">
      <vxe-column
            title="半年"
            sortable
            field="yeaily_return"
            show-overflow-tooltip
          ></vxe-column>
                <vxe-column
            title="一年"
            sortable
            field="yeaily_return"
            show-overflow-tooltip
          ></vxe-column>
                <vxe-column
            title="两年"
            sortable
            field="yeaily_return"
            show-overflow-tooltip
          ></vxe-column>
            </vxe-colgroup>
           </vxe-table>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
          components: {

        },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  computed:{
          ...mapGetters(["sysparam","token","showFundName"]),
  },
  watch: {
      cur_fof: {
      handler: function (val) {
        this.getHoldingType(val);
      },
    }
  },
  data() {
      return {
        holdingData:[],
        sumdict:{},
        cur_fof:"SY9620"  
      }
  },
  methods:{
    showMoney(money) {
        return Math.round(money / 10000);
    },
    getMisc(code){
      this.$axios
        .get("/sys/misc", { params: { "code": code } }) //axis后面的.get可以省略；
        .then((response) => {
            this.holdingData=[]

            let rdict=response.data
            console.log(rdict)
            for(let atype in this.sumdict){
                if(atype){
                console.log(atype)
            let row={"type":atype,"marketval":this.sumdict[atype]}
            let tkey=atype
            if(atype=="混合"){
                tkey="aas"
            }
          for (let akey of ["yeaily_return","dd","volatility"]){
              row[akey]=rdict["normal"][tkey][akey]
              row[akey+"_w"]=rdict["worse"][tkey][akey]   
              }
              if(row['marketval'])
            this.holdingData.push(row)
                 }
          }})
        .catch((error) => {
          console.log(error);
        });
    },
    getHoldingType(code){
        this.$axios
        .get("/fof/holdingType", { params: { "code": code } }) //axis后面的.get可以省略；
        .then((response) => {
          this.sumdict={"指增":0,"套利":0,"混合":0,"cta0":0,"中性":0,"cta1":0,null:0}
          response.data.map(row=>this.sumdict[row['type']]+=row['marketval'])
            this.getMisc("median_info")
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
 mounted() {
            this.getHoldingType(this.cur_fof)
  },
  created() {
    // this.getMisc("fof_action")
    // this.types.map(t=>{this.rlen[t]=0})

  },
  }
</script>
