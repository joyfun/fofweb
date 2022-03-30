<template>

  <div>
      <div class="el-card">
       <vxe-table
          class="mytable-style"
          border
          ref="rankTable"
          height="auto"
          max-height="480px"
          align="right"
          size="mini"
          show-overflow
          :sort-config="{trigger: 'cell', orders: ['desc', 'asc', null]}"
          :data="tableData"
        >
      <!-- <vxe-column  type="checkbox" width="30" fixed="left"></vxe-column> -->
                <vxe-column  width="200" field="基金名称" align="left" title="基金名称" fixed="left" >
        <template #default="{ row }">
                   <el-button  @click.native.prevent="addCart(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="添加" placement="left-start"><i class="el-icon-shopping-cart-full" ></i></el-tooltip></el-button>
           {{ showFundName(row["code"])}}
            </template>
          </vxe-column>
            <vxe-column sortable width="60" field="类型" title="类型" align="left"  fixed="left" ></vxe-column>
            <vxe-column sortable :key="key" :field="key" :title="key" align="right"   v-for="key in ['本周收益','当月收益','当年收益','近6月收益','近12月收益','2021','2020','2019','过去3年年均收益']">                 <template #default="{ row }">
              <span :style="'text-align:right;color:'+(row[key]>=0?'red':'green') " >
                    {{showResult(row[key])}}</span>
                </template></vxe-column>
            <vxe-column sortable :key="key" :field="key" :title="key" align="right"   v-for="key in ['夏普比率','波动率','卡玛比率']">                 <template #default="{ row }">
              <span :style="'text-align:right;color:'+(row[key]>=0?'red':'green') " >
                    {{showResult(row[key],1)}}</span>
                </template></vxe-column>

            <vxe-column  field="最大回撤" title="最大回撤" align="right"  >   <template #default="{ row }">
              <span :style="'text-align:right;color:'+(row['最大回撤']>=0?'red':'green') " >
                    {{showResult(row["最大回撤"])}}</span>
                </template></vxe-column>

       </vxe-table>
      </div>
  </div>
</template>

 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import Bus from '../store/bus.js';
import { mapGetters, mapMutations, mapState } from "vuex";
// 引入柱状图
// require('echarts/lib/chart/line');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
  props: {
    visable:{
      type: Boolean,
      default: false
    },
     code:{
      type: String,
      default: ""
    },
    temp:{
      type: Number,
      default: 0
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
    code: {
      handler: function (val) {
       this.showcomapre();
      },
    },
  },
   computed: {
    ...mapGetters(["sysparam","token","showFundName"]),
  },
  data() {
    return {
    tableData:[],
    }
  },
  methods: {
    addCart(row){
      if(row['基金名称']){
        row['name']=row['基金名称']
        Bus.$emit("addcart",row)
      }
    },
    showcomapre(){
        let curl='/fof/jreport'

        this.$axios( {
                url: curl,
                method: 'GET',
                params: {code:this.code}
                })//axis后面的.get可以省略；
        .then((response) => {
          this.tableData = this.$tools.pandasToJson(response.data)
        //   .map(row=>{
        //         for(let key in row){
        //           if(this.$tools.isNumber(row[key])){
        //             row[key]=parseFloat(row[key]).toFixed(3)
        //           }
        //       }
        //       return row
        //   });
        this.tableData.sort((b,a)=>{
            let ret= a['类型']>b['类型']?1:-1
            if(a['类型']==b['类型']){
                ret= a['当年收益']-b['当年收益']
            }
            return ret
        })

    
          console.log(this.tableData)
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error);
        });
      },

    showResult(number,rate=100){
       if (null == number)
          return '' 
        var color=number>=0?"red":"green"
        //return '<span style="text-align:right;color='+color+'">'+this.formatMoney(number,4)+'</span>'
        return this.$tools.formatMoney(number*rate,3)
    },
    cellStyle ({ row, rowIndex, column }) {
        console.log(row)
        if(this.$tools.isNumber(row[column.property])){
                if(row[column.property]>=0){
                return {
                    color: 'red'
                  }  
                }
                       return {
                    color: 'green'
                  }  
        }
      
            }
  },
  mounted() {
      this.showcomapre()
    window.addEventListener('resize', this.resizeChart)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
