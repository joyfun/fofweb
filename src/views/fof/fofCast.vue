<template>
  <div id="tableContainer" ref="tableContainer" style="height: 100%">
      <el-row>
          <el-col :span="16">
                    <vxe-toolbar perfect>
          <template #buttons>
          <vxe-select v-model="cur_fof" placeholder="默认尺寸">
            <vxe-option v-for="item in sysparam.FOF" :key="item.value" :label="item.value"
      :value="item.code" ></vxe-option>
          </vxe-select>
            <vxe-radio-group v-model="clicktype" size="small" :strict="false">
            <vxe-radio-button :key="key" v-for="key of types" :label="key" :content="key?key:'所有'"></vxe-radio-button>
          </vxe-radio-group>  
          <vxe-button icon="vxe-icon--refresh" status="perfect" @click="revertEvent">还原</vxe-button> 
          数据日期{{pos_date}}       
          </template>
        </vxe-toolbar>
<vxe-table
          border
          ref="holdingTable"
          :data="holdingData"
          align="right"
          keep-source
          tooltip-effect="dark"
                    :mouse-config="{selected: true}"
          :edit-config="{trigger: 'dblclick', mode: 'cell',activeMethod: activeCellMethod}"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
          @edit-closed="adjamount"
          show-footer
          :footer-method="calcCast"
        >
          <vxe-column
            title="类型"
            sortable
            field="type"
            show-overflow-tooltip
          >
              <template #header>
                {{data_time}}<br>类型
              </template>
            <template slot-scope="scope">
              {{scope.row['type']=='指增'?'指增超额':scope.row['type']}}
            </template>
          </vxe-column>
          <!-- <vxe-column
            title="金额(万)"
            sortable
            align="right"
            field="marketval"
            show-overflow-tooltip
          >          
          </vxe-column> -->

          <vxe-colgroup title="收益(年化)" align="center">
           <vxe-column
            title="正常"
            sortable
            field="yeaily_return"
            show-overflow-tooltip :edit-render="{}"
          >

            <template #default="{ row }">
              <span>{{               $tools.formatMoney(row.yeaily_return*100,2) }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" v-model="row['yeaily_return']" class="myinput"></vxe-input>
            </template>
          </vxe-column>
           <vxe-column
            title="悲观"
            sortable
            field="yeaily_return_w"
            show-overflow-tooltip :edit-render="{}"
          >
                      
            <template #default="{ row }">
              <span>{{               $tools.formatMoney(row.yeaily_return_w*100,2) }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" v-model="row['yeaily_return_w']" class="myinput"></vxe-input>
            </template>
          </vxe-column>
          </vxe-colgroup>
          <vxe-column
            title="回撤"
            sortable
            field="dd"
            show-overflow-tooltip :edit-render="{}"
          >
   
      <template #default="{ row }">
              <span>{{               $tools.formatMoney(row.dd*100,2) }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" v-model="row['dd']" class="myinput"></vxe-input>
            </template>
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
            title="调整(万)"
            sortable
            width="100"
            field="adj"
            show-overflow-tooltip :edit-render="{}"
          >
          <!-- <template #default="{ row }">
                 <vxe-input  v-model="row.adj" type="number"></vxe-input>
          </template> -->
           <template #default="{ row }">
              <span>{{             row.adj }}</span>
            </template>
            <template #edit="{ row }">
              <vxe-input type="number" v-model="row.adj" class="myinput"></vxe-input>
            </template>
          </vxe-column>
          </vxe-colgroup>
                      <vxe-colgroup title="占比" align="center">

           <vxe-column
            title="前"
            sortable
            width="60"
            field="marketval"
            show-overflow-tooltip
          >
                    <template slot-scope="scope ">{{
 $tools.formatMoney(scope.row.marketval*100/ptotal,2) 
             }}</template>
      <!--
                          $tools.formatMoney(scope.row.marketval*100/ptotal,2)  +'\n'+

            $tools.formatMoney((scope.row.marketval+parseFloat(scope.row.adj)*10000)*100/total,2)

        -->
          </vxe-column>
          <vxe-column
            title="后"
            sortable
            width="60"
            field="marketval"
            show-overflow-tooltip
          >
                    <template slot-scope="scope ">{{
            $tools.formatMoney((scope.row.marketval+parseFloat(scope.row.adj)*10000)*100/total,2)
            }}</template>
      <!--
                          $tools.formatMoney(scope.row.marketval*100/ptotal,2)  +'\n'+

            $tools.formatMoney((scope.row.marketval+parseFloat(scope.row.adj)*10000)*100/total,2)

        -->
          </vxe-column>
          </vxe-colgroup>
            <vxe-colgroup title="近期表现" align="center">
      <vxe-column
            title="半年"
            sortable
            field="yeaily_return_hyr"
            show-overflow-tooltip
          >
          <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.yeaily_return_hyr*100,2)
            }}</template>
          </vxe-column>
                <vxe-column
            title="一年"
            sortable
            field="yeaily_return_1yr"
            show-overflow-tooltip
          >
                    <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.yeaily_return_1yr*100,2)
            }}</template>
          </vxe-column>
                <vxe-column
            title="两年"
            sortable
            field="yeaily_return_2yr"
            show-overflow-tooltip
          >          <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.yeaily_return_2yr*100,2)
            }}</template></vxe-column>
            </vxe-colgroup>
          <vxe-column
            title="波动率(年化)"
            sortable
            field="volatility"
            show-overflow-tooltip :edit-render="{}"
          >
          <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.volatility*100,2)
            }}</template>
          </vxe-column>
           </vxe-table>
             </el-col>

          <el-col :span="8">

             <echart
    ref="piechart"
    :chartData="pieData"
    style="height: 480px"
    :isAxisChart="false"
  ></echart>             </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
                  <vxe-table
          border
          show-header-overflow
          show-overflow
          header-align="center"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'marketval', order: 'desc'}, orders: ['desc', 'asc', null]}"
          max-height="500"
          :align="'right'"
          :row-config="{isHover: true}"
          :data="subholding">
          <vxe-column field="code" width="240"  align="left" title="基金名称">
                           <template slot-scope="scope">{{
              showFundName(scope.row.code)
            }}</template>
          </vxe-column>
          <vxe-column field="level" width="70" title="level"></vxe-column>
          <vxe-column field="marketval"  sortable title="市值(万)">
                <template slot-scope="scope">{{
              showMoney(scope.row.marketval)
            }}</template>
          </vxe-column>
            <vxe-column field="marketval"  sortable title="占比">
                <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.marketval*100/ptotal,2)+'%'
            }}</template>
          </vxe-column>
           <vxe-colgroup title="近期表现" align="center">
      <vxe-column
            title="半年"
            sortable
            field="yeaily_return_hyr"
            show-overflow-tooltip
          >
          <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.yeaily_return_hyr*50,2)
            }}</template>
          </vxe-column>
                <vxe-column
            title="一年"
            sortable
            field="yeaily_return_1yr"
            show-overflow-tooltip
          >
                    <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.yeaily_return_1yr*100,2)
            }}</template>
          </vxe-column>
                <vxe-column
            title="两年"
            sortable
            field="yeaily_return_2yr"
            show-overflow-tooltip
          >          <template slot-scope="scope">{{
              $tools.formatMoney(scope.row.yeaily_return_2yr*200,2)
            }}</template></vxe-column>
            </vxe-colgroup>
        </vxe-table>
        </el-col>
        <el-col :span="8">
        <echart 
    ref="subchart"
    :chartData="subData"
    style="height: 480px;widht:480px"
    :isAxisChart="false"
  ></echart>         </el-col>

      </el-row>
      <!-- <el-row>
        <vxe-form :data="precast" >
          <vxe-form-item title="预期波动率" field="vola" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.vola" placeholder="volatility" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="预期收益" field="yr" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.yr" placeholder="yeaily_return"></vxe-input>
            </template>
          </vxe-form-item>
             <vxe-form-item title="悲观收益" field="yr_w" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.yr_w" placeholder="yeaily_return"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="预期回撤" field="dd" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.dd" placeholder="dd"></vxe-input>
            </template>
          </vxe-form-item>
        </vxe-form>
      </el-row> -->
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Echart from "../../components/Echart.vue";

export default {
          components: {
            Echart
        },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  computed:{
        ...mapState(["foflist","actionData"]),
        ...mapGetters(["sysparam","token","showFundName","showFundInfo"]),
    //       subholding() {
    //           return this.holdings.filter(row=>{
    //             if(this.clicktype){
    //                 return row["type"]=this.clicktype
    //             }else{
    //               return row["type"]
    //             }
    //           })
    // },
  },
  watch: {
      cur_fof: {
      handler: function (val) {
        this.changeHoldingtype(val);
      }},
      clicktype: {
      handler: function (val) {
        this.refreshSubPie();
      },
    }
  },
  data() {
      return {
        indexData:{},
        pos_date:"",
        fof_percent:{},
        subresult:{},
        subsum:{},
        rdict:{},
        types:[],
        data_time:"",
        worsekey:"m25",
        performs:{},
        clicktype:"",
        subholding:[],
        precast:{},
        holdingData:[],
        pieData:{
          action:{},
           legend: {type: 'scroll',
        top: 2,
        data: []},
          series:{     name:"资金占比",       type: 'pie',
                //   radius: ['50%', '70%'],
            avoidLabelOverlap: true,

            label: {
                formatter:(params) => {  //格式化数据的函数
            return params.name+":"+params.percent+"%" 
              },
            },
    tooltip: {
        trigger: 'item',
        valueFormatter: (value) =>   (value/10000).toFixed(1)+"万"

    },
                    data:[
            
            ]}},
        subData:{
          action:{},
           legend: {type: 'scroll',
        top: 2,
        data: []},
          series:{     name:"资金占比",       type: 'pie',
                //   radius: ['50%', '70%'],
            avoidLabelOverlap: true,

            label: {
                formatter:(params) => {  //格式化数据的函数
            return params.name+":\n"+(params.value/10000).toFixed(1)+"万 "+params.percent+"%" 
              },
            },
    tooltip: {
        trigger: 'item',
        valueFormatter: (value) =>   (value/10000).toFixed(1)+"万"

    },
                    data:[
            
            ]}},
        cls_gap:{"AAS":{"limit":{"dd":[-0.1,0],"volatility":[0,0.15]},"level":{"dd":[-0.07,-0.05,-0.03]}},
               "CTA":{"limit":{"dd":[-0.2,0],"dd_week":[0,60]},"level":{"dd":[-0.15,-0.07,-0.03]}}},
        holdings:[],
        total:0,
        ptotal:0,
        sumdict:{},
        cur_fof:"SY9620"  
      }
  },
  methods:{
    showPercentComp(row){
      console.log(row)
      let ret= this.$tools.formatMoney(row.marketval*100/this.ptotal,2)
      if(Math.abs(this.ptotal-this.total)>0){
        ret=this.$tools.formatMoney((row.marketval+parseFloat(row.adj)*10000)*100/this.total,2)+'/'+ret
      }
      return ret
    },
    async revertEvent () {
            this.$refs.holdingTable.revertData()
            this.adjamount()
            },
    activeCellMethod ({ row, rowIndex ,column, columnIndex }) {
              console.log(column.field)
              if(column.field=="adj"&&(rowIndex === 0&&row['type'] === '中证500')){
                return false
              }
              if(column.field=="adj"){
                return true
              }
              if (row['type'] === '中证500') {
                return true
              }
              return false
            },
    showMoney(money) {
        return Math.round(money / 10000);
    },
    showPercent(money) {
        return Math.round(money * 1000)/10;
    },
    genHoldingData(){
            this.holdingData=[]
            for(let atype in this.sumdict){
                if(atype && 'null'!=atype){
            let row={"adj":this.sumdict[atype]["adj"],"type":atype,"marketval":this.sumdict[atype]["marketval"],"yeaily_return_hyr":this.sumdict[atype]["yeaily_return_hyr"]/2,"yeaily_return_1yr":this.sumdict[atype]["yeaily_return_1yr"],"yeaily_return_2yr":this.sumdict[atype]["yeaily_return_2yr"]*2}
            let tkey=atype
            if(atype=="混合"){
                tkey="aas"
            }
          for (let akey of ["yeaily_return","dd","volatility"]){
              let nm=0
              let ws=0
              if(this.rdict["normal"][tkey]){
                nm=this.rdict["normal"][tkey][akey]
                ws=this.rdict[this.worsekey][tkey][akey]   
              }
              row[akey]=nm
              row[akey+"_w"]=ws
              }
              if(row['type']=="中证500"){
                  if(this.performs["000905.SH"]){
                //  for(let key of ["hyr","1yr","2yr"]){
				        //     row["yeaily_return_"+key]+=this.performs["000905.SH"]['yeaily_return_'+key]
                // }  
                 row["yeaily_return_hyr"]+=this.performs["000905.SH"]['yeaily_return_hyr']/2
                 row["yeaily_return_1yr"]+=this.performs["000905.SH"]['yeaily_return_1yr']
                 row["yeaily_return_2yr"]+=this.performs["000905.SH"]['yeaily_return_2yr']*2

                this.indexData=JSON.parse(JSON.stringify(row))              
                }

                this.holdingData.push(row)
              }

              if(row['marketval']){
                  this.holdingData.push(row)

              }
            }

          }
           if(this.holdingData.filter(row=>row["type"]=="指增").length<1){
              this.holdingData.shift()
            }
                 this.adjamount()
    },
    getMisc(code){
      this.$axios
        .get("/sys/misc", { params: { "code": code } }) //axis后面的.get可以省略；
        .then((response) => {
            this.rdict=response.data
})
        .catch((error) => {
          console.log(error);
        });
    },
    classify(row){
       let key="AAS"
       if(row['type'].startsWith('cta')){
         key="CTA"
       }
      row["numeric_type"]=key
      row["level"]="丁"
        if(key){
          let conf=this.cls_gap[key]
          let ranks=["丙","乙","甲"]
          for(var lvk  in  conf["level"]){
            let alvs=conf["level"][lvk]
            for (var i in alvs){
              if(row[lvk]>alvs[i]){
                row["level"]=ranks[i]
              }
            }
          }
        }
        
     },
    changeHoldingtype(mcode){
          this.sumdict={"中证500":{'marketval':0,"adj":0},"指增":{'marketval':0,"adj":0},"cta1":{'marketval':0,"adj":0},"cta0":{'marketval':0,"adj":0},"套利":{'marketval':0,"adj":0},"中性":{'marketval':0,"adj":0},"期权":{'marketval':0,"adj":0},"中性":{'marketval':0,"adj":0},"混合":{'marketval':0,"adj":0},null:{'marketval':0,"adj":0},"现金":{'marketval':0,"adj":0}}
          this.holdings=JSON.parse(JSON.stringify(this.subresult[mcode]))
          console.log(this.holdings)
          console.log(this.actionData.filter(r=>r['code']==this.cur_fof))
          this.holdings.filter(row=> row["class_type"]=="FOF").forEach((srow,idx)=>{
              if(srow["code"]){
                console.log(srow)
              let rt=srow["marketval"]/this.subsum[srow["code"]]
              this.subresult[srow["code"]].map(prow=>{
                  let nrow=JSON.parse(JSON.stringify(prow))
                  nrow["omarketval"]=nrow["marketval"]
                  nrow["rt"]=rt
                  nrow["marketval"]=nrow["marketval"]*rt
                  this.holdings.push(nrow)
              })
              }

          })
          
          this.holdings.map(row=>{
                if(row['type']){
          this.classify(row)
				this.sumdict[row['type']]["marketval"]+=row['marketval']
                }
                else if(row['b_code'].startsWith("SUBJECT")){
              row['type']="现金"
              this.sumdict["现金"]["marketval"]+=row['marketval']
 
                }
            })
          this.actionData.filter(row=>row['code']==this.cur_fof||row['b_code']==this.cur_fof).map(row=>{
            let rinfo=this.showFundInfo(row['b_code'])
            let mval=parseFloat(row['marketval'])
            if(row['stage']=='预入款'||row['b_code']==this.cur_fof){
              console.log(row)
              this.sumdict['现金']["adj"]+=mval

            }else if(rinfo['type']){
            if(row['stage']=='待投资'){
              this.sumdict[rinfo['type']]["adj"]+=mval
              this.sumdict['现金']["adj"]-=mval
            }else if(row['stage']=='预赎回'){
              this.sumdict[rinfo['type']]["adj"]-=mval
              this.sumdict['现金']["adj"]+=mval

            }}else if(rinfo['class_type']=="FOF"){
              this.sumdict['现金']["adj"]-=mval
            }
          })
        this.types=[...new Set(this.holdings.map(r=>r['type']))]
        this.types.sort((a,b)=>{
          if(b==null){
            return -1
          }
          else{
            return a-b
          }
        })
        console.log(this.types)
        this.addPerformance()
        this.genHoldingData()
    },
    getHoldingType(code){
        this.$axios
        .get("/fof/holdingType", { params: { "code": code } }) //axis后面的.get可以省略；
        .then((response) => {
         let resp=response.data
         this.subsum={}
         for(let fof of this.sysparam.FOF){
             this.subresult[fof['code']]=resp.filter(row=>row['mcode']==fof['code'])
             this.subsum[fof['code']]=resp.filter(row=>row['mcode']==fof['code']).reduce((preVal, row) => { return preVal + row["marketval"];}, 0)
         }
        this.changeHoldingtype(this.cur_fof)
        this.getPerform(response.data.map(row=>row["code"]))

        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPerform(codes){
        let acode=this.sysparam.FOF.map(row=>row['code'])
        acode.push("000905.SH")
        acode=acode.concat(codes)
        console.log(acode)
        this.$axios
        .get("/fof/recentPerform", { params: { "code": acode.join(","),"key":"yeaily_return" } }) //axis后面的.get可以省略；
        .then((response) => {
            this.performs=response.data
            this.addPerformance()
            this.genHoldingData()

        })
        .catch((error) => {
          console.log(error);
        });
    },
    addPerformance(){
            this.holdings.map(row=>{
                let rdata=this.performs[row["code"]]
                for(let k in rdata){
                    row[k]=rdata[k]
                }
                row["subTotal"]=this.sumdict[row['type']]["marketval"]
                row["percent"]=row["marketval"]/row["subTotal"]
            })
            for(let key of ["hyr","1yr","2yr"]){
                for(let skey in this.sumdict){
                    this.sumdict[skey]["yeaily_return_"+key]=0
                }
            }
            this.holdings.map(row=>{
                for(let key of ["hyr","1yr","2yr"]){
				this.sumdict[row['type']]["yeaily_return_"+key]+=row["percent"]*row['yeaily_return_'+key]
                }
            })
    },
    getFofPercent(){
        this.$axios
        .get("/fof/fofpercent") //axis后面的.get可以省略；
        .then((response) => {
            this.fof_percent=response.data
        })
    },
    refreshSubPie(){
        let subdata={"甲":0,"乙":0,"丙":0,"丁":0}
        this.subholding=[]
        this.holdings.map(row=>{
          if(row["level"]&&(row["type"]==this.clicktype||!this.clicktype)){
            this.subholding.push(row)
            subdata[row["level"]]+=row["marketval"]
          }
        })
        let subseries=[]
        for (let akey in subdata){
          subseries.push({"name":akey,"value":subdata[akey]})
        }
        console.log(subseries)
        this.subData.series.data=subseries
        this.$refs.subchart.initChart() 
    },
    adjamount(){
        this.total=0
        this.ptotal=0
        console.log(this.holdingData)
        
        this.pieData.series.data=this.holdingData.map(row=>{if(row['type']!='中证500')
        {if(row['adj']==''){
           row['adj']=0
         }
          this.total+=row['marketval']+parseFloat(row['adj'])*10000
         this.ptotal+=row['marketval']
         
        return {"name":row["type"],"value":row['marketval']+row["adj"]*10000}}
        return null})
        this.$refs.piechart.initChart() 
        this.calcCast()
        this.$refs.holdingTable.updateFooter()
        this.refreshSubPie()

    },
    calcCast(){
      if(this.performs["000905.SH"]){
        let cmap={}
        this.holdingData.map(row=>{
            cmap[row["type"]]=row
        })
        let sadj=0
        if(cmap["中证500"]&&cmap["指增"]){
            cmap["中证500"]["marketval"]=cmap["指增"]["marketval"]
            cmap["中证500"]["adj"]=cmap["指增"]["adj"]
        }
        let prev={"vola":0,"yr":0,"yr_w":0,"dd":0}
        let nprev={"vola":0,"yr":0,"yr_w":0,"dd":0}
        console.log(cmap)
        this.holdingData.map(row=>{
            let pct=(row["marketval"]+parseFloat(row['adj'])*10000)/this.total
            let ppct=row["marketval"]/this.ptotal
            if(row["type"]!='中证500'){
            sadj+=parseFloat(row["adj"])
            prev.vola+=row["volatility"]*row["volatility"]*pct*pct
            nprev.vola+=row["volatility"]*row["volatility"]*ppct*ppct 
            nprev.yr+=row["yeaily_return"]*ppct
            nprev.yr_w+=row["yeaily_return_w"]*ppct
            }else{
            nprev.yr+=this.indexData["yeaily_return"]*ppct
            nprev.yr_w+=this.indexData["yeaily_return_w"]*ppct
            }
            prev.yr+=row["yeaily_return"]*pct
            prev.yr_w+=row["yeaily_return_w"]*pct
            })
        prev.vola=this.$tools.formatMoney(Math.sqrt(prev.vola)*100,2)
        nprev.vola=this.$tools.formatMoney(Math.sqrt(nprev.vola)*100,2)
        if(cmap["中证500"]){
        prev.dd=this.$tools.formatMoney((cmap["中证500"]["dd"]*(cmap["中证500"]["marketval"]+cmap["中证500"]["adj"]*10000)/this.total-prev.vola*0.6/100)*100,2)
        nprev.dd=this.$tools.formatMoney((this.indexData["dd"]*cmap["中证500"]["marketval"]/this.ptotal-nprev.vola*0.6/100)*100,2)

        }else{
        prev.dd=this.$tools.formatMoney(-prev.vola*0.6,2)  
        nprev.dd=this.$tools.formatMoney(-nprev.vola*0.6,2)  

        }
        prev.yr=this.$tools.formatMoney(prev.yr*100,2)
        prev.yr_w=this.$tools.formatMoney(prev.yr_w*100,2)
        nprev.yr=this.$tools.formatMoney(nprev.yr*100,2)
        nprev.yr_w=this.$tools.formatMoney(nprev.yr_w*100,2)
        this.precast=prev
        return [["预期",nprev.yr,nprev.yr_w,nprev.dd,(this.ptotal/10000).toFixed(0),"","近期",this.$tools.formatMoney(this.performs[this.cur_fof]["yeaily_return_hyr"]*100/2,2),this.$tools.formatMoney(this.performs[this.cur_fof]["yeaily_return_1yr"]*100,2),this.$tools.formatMoney(this.performs[this.cur_fof]["yeaily_return_2yr"]*200,2),nprev.vola],
                ["调整后",prev.yr,prev.yr_w,prev.dd,(this.total/10000).toFixed(0),sadj,"","","","",prev.vola]
        ]
      }
      return []
    }
  },
 mounted() {
            this.getHoldingType()
            
  },
  created() {
    //   this.getFofPercent()
        this.$axios
        .get("/fof/last_posdate") //axis后面的.get可以省略；
        .then((response) => {
          this.pos_date=response.data['last_posdate']
        })
        .catch((error) => {
          console.log(error);
        });
    this.$axios
        .get("/fof/last_calcdate") //axis后面的.get可以省略；
        .then((response) => {
          this.data_time=response.data['latest_date']
        })
        .catch((error) => {
          console.log(error);
        });
    this.pieData.action["click"]=(params)=>{
            console.log(params)
            this.clicktype=params.data.name
        }
        this.getMisc("median_info")
        console.log(this.actionData)
  },
  }
</script>
