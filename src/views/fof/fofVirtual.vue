<template> 
<div>
      <div  class="block" style="display: flex;justify-content: space-between">
        <div style="display: flex;justify-content: space-between">
              <el-select v-model="filter.class_type" @change="changeSub"  style="width:80px"  clearable placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
<el-select
    v-model="mult"
    style="width:180px;"   
    multiple
    popper-class="pop-div-my"
    :popper-append-to-body="true"
    clearable
    filterable
    placeholder="名称"
    >
    <el-option
      v-for="item in alllist"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
              <el-button type="primary"   size="small" @click="addGroup">添加</el-button>

          </div>
      </div>
      <el-card shadow="hover">
        <el-form ref="form" label-width="160px">
                    <el-button type="primary"   size="small" @click="doCalc">计算</el-button>
           <template v-for="(row,index)  in sellist" >
                    <el-row  :key="index"   v-show="index%2==0">
                      <el-col :span="12">        
                    <el-form-item   v-if="index<=sellist.length-1" :prop="row.code"      :label=" row.name"><el-input-number  v-model="row.cost"></el-input-number> 
                    <el-button  @click.native.prevent="delItem(row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>
                    </el-form-item>
                     </el-col>
                  <el-col :span="12"> 
                    <el-form-item   v-if="index+1<=sellist.length-1" :prop="row.code"      :label=" sellist[index+1].name"><el-input-number  v-model="sellist[index+1].cost"></el-input-number> 
                    <el-button  @click.native.prevent="delItem(sellist[index+1])" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>
                    </el-form-item>
      </el-col>
      </el-row></template>
        </el-form>

      </el-card>
<div ref="comparediv">
    <report-table    ref="compdata"     :tableData="compData"  ></report-table>

     <fund-echart    ref="hischart1"    style="height: 600px" :code="selcode" :wts="wts"  ></fund-echart>
</div>
</div>
</template>
<script>
    import Vue from 'vue'
    import FundEchart from '../../components/FundEchart.vue';
    import ReportTable from '../../components/ReportTable.vue';
    import { mapState,mapGetters } from 'vuex'
    export default {
  components: {
    FundEchart,
    ReportTable
  },
computed: {
        ...mapState({
            current: state => state.tab.currentMenu
        }),
       ...mapGetters(['token',"allparam","sysparam"])
    },
    props: {
      url:{
      type: String,
      default: "/fof/jreport"
    },
    },
data() {
    return {
        compData:[],
        selcode:"",
        wts:"",
      foflist:[],
      filter:{},
      zz500:5,
      tlist:[{"name":"名称","code":"code1"},{"name":"名称2","code":"code2"}],
      rawlist:[],
      mult:[],
      sel:[],
      alllist:[],
      sellist:[],
      tableData:[]  
    }
  },
  created() {
    this.remoteMethod();
  },
  methods: {
      doCalc(){
          if(this.sellist.length<1){
              return
          }
          var awt=""
          var scode=""
          var clen =this.sellist
          for (var arst of this.sellist){
              var acost=arst.cost
              if(acost){
                  scode=scode+arst.code+","
                  awt=awt+arst.cost+","
              }
          }
          Vue.set(this,"wts",awt.substring(0,awt.length-1))
          if(scode==this.selcode){
             Vue.set(this,"selcode",scode.substring(0,scode.length-1))
          }else{
             Vue.set(this,"selcode",scode)
  
          }
        
this.$axios( {
                url: '/fof/jreport',
                method: 'GET',
                params: {code:this.selcode,w:this.wts}
                })//axis后面的.get可以省略；
        .then((response) => {
          this.compData = this.$tools.pandasToJson(response.data);
          //this.tableData = this.totaltableData;
        })
        .catch((error) => {
          console.log(error);
        });
      },
      handleChange(val,row){},
      addGroup(){

        // var funds=[]
        for(var code of this.mult){
            console.log(code)
            var afund=this.alllist.find((item)=>{//遍历list的数据
                    return item.code === code;//筛选出匹配数据
                })
            var old=this.sellist.find((item)=>{//遍历list的数据
                    return item.code === code;//筛选出匹配数据
                })
              if(old){
                continue
              }
            this.sellist.push({code:afund["code"],name:afund["name"]})
        }
            // this.$store.dispatch('setCart',this.foflist)

        // console.log(funds)
    },
        delItem(row){
      for (var key in this.sellist) {
        if (this.sellist[key].code === row.code) {
         this.sellist.splice(key, 1)
        }
  }
    },
      changeSub(row){
              console.log(row)
              if(row){
              var a=[]
              for (var ar of this.rawlist){
                if(ar.class_type==row)
                a.push(ar)
              }
              if(a.length>0)
              this.alllist=a
              }else{
                this.alllist=this.rawlist
              }
            },
    remoteMethod(query){
      if(this.cart){
      this.foflist=this.cart
      }
      this.$axios({
        url: "/fof/foflist",
        method: "GET",
      })
        .then((response) => {
            this.rawlist=response.data
            this.changeSub(this.filter.class_type)
            console.log("####init####")

        })
    },
  }
  }
</script>