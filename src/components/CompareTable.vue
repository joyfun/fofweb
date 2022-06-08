<template>

  <div>
      <div class="el-card">
              <vxe-toolbar>
          <template #buttons>
            <vxe-button @click="exportEvent">导出.xlsx</vxe-button>
          </template>
        </vxe-toolbar>
       <vxe-table
          class="mytable-style"
          border
          ref="rankTable"
          height="auto"
          :max-height="tmaxh"
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
                   <el-button  @click.native.prevent="showFundHis(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="历史" placement="left-start"><i class="el-icon-s-marketing" ></i></el-tooltip></el-button>

            </template>
          </vxe-column>
            <vxe-column sortable width="60" field="类型" title="类型" align="left"  fixed="left" ></vxe-column>
             <vxe-column sortable width="60" field="level" title="级别" align="left"  fixed="left" ></vxe-column>
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

                <vxe-column  v-if="showDrop"  sortable field="tdd" title="2年回撤" align="right"  >   <template #default="{ row }">
                    {{showResult(row["tdd"])}}
                </template></vxe-column>
                 <vxe-column v-if="showDrop" sortable  field="nowdrop" title="当前回撤" align="right"  >   <template #default="{ row }">
                    {{showResult(row["nowdrop"])}}
                </template></vxe-column>
       </vxe-table>
      </div>
  </div>
</template>

 <script>
// import echarts from 'echarts'
// import 'echarts/lib/chart/line'
import Bus from '../store/bus.js';
import XLSX from 'xlsx'
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
      tmaxh:{
      type: String,
      default: "480px"
    },
     showDrop:{
      type: Boolean,
      default: false
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

    exportEvent () {
          const header = XLSX.utils.table_to_sheet (this.$refs.rankTable.$el.querySelector('.body--wrapper>.vxe-table--header'))
          const workBook = XLSX.utils.table_to_sheet (this.$refs.rankTable.$el.querySelector('.body--wrapper>.vxe-table--body'))
          console.log(XLSX.utils.sheet_to_aoa(workBook))
          XLSX.utils.sheet_add_aoa(header,XLSX.utils.sheet_to_csv(workBook))
          var nwb= XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(nwb, header, "Sheet1");
              XLSX.writeFile(nwb, '数据导出.xlsx')
    },
    addCart(row){
      if(row['基金名称']){
        row['name']=row['基金名称']
        Bus.$emit("addcart",row)
      }
    },
    showFundHis(row){

          Bus.$emit("showChart",{"cur_code":row.code,"diagName":"hisChart"})

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
          if(this.showDrop){
          this.$axios( {
                url: '/fof/recentDrop',
                method: 'GET',
                params: {code:this.code}
                })//axis后面的.get可以省略；
        .then((response)=>{
            let rdict=response.data
            this.tableData=this.tableData.map(row=>{
                let dret=rdict[row['code']]

                if(row['code'].endsWith("_E")){
                    dret=rdict[row['code'].substring(0,6)]
                }
                if(dret){
                row['nowdrop']=dret['nowdrop']
                row['tdd']=dret["dd"]
                row['level']=dret["level"]
                }

                return row
            })
            console.log(this.tableData)
 
        this.tableData.sort((b,a)=>{
            let ret= a['类型']>b['类型']?1:-1
            if(a['类型']==b['类型']){
                ret= a['当年收益']-b['当年收益']
            }
            return ret
        })
                  console.log(this.tableData)
       })}
    
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
