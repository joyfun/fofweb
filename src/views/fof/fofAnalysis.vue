<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">
           <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
 <el-select v-model="filter.class_type" @change="changeSub"  style="width:100px"   placeholder="类型">
    <el-option
      v-for="item in sysparam.class_type"
      :key="item.id"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>   
  <el-select v-model="filter.sub_type" @change="getList"  style="width:100px"  clearable placeholder="子类型">
    <el-option
      v-for="item in sub_type"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>  

     <el-select v-model="filter.left" @change="getList" style="width:100px"   placeholder="阶段一">
    <el-option
      v-for="item in sysparam.stage"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
   <el-select  v-model="filter.right" @change="getList" style="width:100px" clearable  placeholder="阶段二">
    <el-option
      v-for="item in sysparam.stage"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
  <el-select v-show="filter.other" v-model="filter.other" @change="getList" style="width:100px"   placeholder="阶段三">
    <el-option
      v-for="item in sysparam.stage"
      :key="item.code"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
  <el-select
    v-model="mult"
    style="width:360px"   
    multiple
    clearable
    filterable
    placeholder="名称"
    >
    <el-option
      v-for="item in foflist"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
  
       <el-button type="primary"  size="small" @click="searchRank">查询</el-button>
       <!-- <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button> -->
        </div>
      </div>
    <rank-table     ref="ranktable"  :titles="current.name"  style="height: 600px"  :code="cur_code" ></rank-table>
   


  </div>
  
</template>
<script>
import axis from 'axios'
    import FundEchart from '../../components/FundEchart.vue';
    import HisTable from '../../components/RankTable.vue';
    import {mapGetters} from 'vuex'

  export default {
      components: {
            FundEchart,
            RankTable
        },
        computed:{
            ...mapGetters(['sysparam',"allparam"]),
    //          compares:{
    //       get() {
    //           console.log(this.filter.class_type)
    //           console.log(this.addition)
    //     return this.filter.sub_type+","+this.filter.left+","+this.filter.right+","+this.addition
    //   }
    //   }
        },
        props: {filters:{
      type: Object,
      default:null
    },},
     data() {
      return {
          temp:-1,
          addition:"",
          compares:"",
          mult:[],
          dialogVisible:true,
          origin:{},
          current:{},
          sub_type:[],
          foflist:[],
          filter:{
              class_type:"指增",
              sub_type:"低频alpha",
              left:"",
              right:""
              },
        }}
        ,
            watch: {
    $route:{
      handler(n){
          if(this.filters){
              console.log("route init ")
              console.log(this.filter)
              var jobj=JSON.parse(JSON.stringify(this.filters))
              for(var key in jobj){
                this.filter[key]=  jobj[key]
              }

            //   this.filter=JSON.parse(JSON.stringify(this.filters));
            //   this.filter["class_type"]="CTA"
          }else{
          this.filter=n.params
          }
		// 初始化操作
      },
      immediate: true,
      deep: true,
    }
  },
    created() {
        this.remoteMethod();
    },
        methods: {
            multchange(val){
                console.log(val)
                this.addition=val.join()
            },
            searchHis(){
                this.compares=this.filter.sub_type+","+this.filter.left+","+this.filter.right+","+this.addition 
                this.addition=this.mult.join()
            },
            changeSub(row){
                var id=-1
                for (var ap of this.sysparam.class_type)
                {
                    if(ap.code==row){
                        id=ap.id
                        break;
                    }
                    
                }
                console.log(id)
                console.log(this.allparam)
                this.sub_type=this.allparam['param_'+id]
                console.log(this.sub_type)

            },
            remoteMethod(query){
                this.$axios({
        url: "/fof/foflist",
        method: "GET",
        params: {},
      })
        .then((response) => {
            this.foflist=response.data
                this.sub_type=this.allparam['param_13']

        })
    this.sub_type=this.allparam['param_13']
            },
            getList() {
                console.log(this.filter)
        },
        }
}
</script>