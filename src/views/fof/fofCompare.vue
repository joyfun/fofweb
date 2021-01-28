<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">
           <!-- <el-button  size="small" @click="delSelection()">删除</el-button> -->
 <el-select v-model="filter.class_type" @change="getList"  style="width:100px"   placeholder="类型">
    <el-option
      v-for="item in class_types"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>    

     <el-select v-model="filter.left" @change="getList" style="width:100px"   placeholder="阶段一">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-select v-model="filter.right" @change="getList" style="width:100px"   placeholder="阶段二">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="名称"
    :loading="loading">
    <el-option
      v-for="item in foflist"
      :key="item.code"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
  
        <!-- <el-button  size="small" @click="downFile()">下载</el-button>
        <el-input v-model="filter.name" clearable placeholder="名称" style="width:180px"></el-input>
          <el-button type="primary"  @click="getList" style="margin-left: 10px;">搜索</el-button> -->
        </div>
      </div>
       
     
    
    <fund-echart       ref="hischart"  :titles="current.name"  style="height: 600px" :code="current.cur_code" :filter="filter" :compares="compares"   :visable="dialogVisible"></fund-echart>
   


  </div>
  
</template>
<script>
import axis from 'axios'
    import FundEchart from '../../components/FundEchart.vue';
    import HisTable from '../../components/HisTable.vue';

  export default {
      components: {
            FundEchart,
            HisTable
        },
        computed:{
             compares:{
          get() {
              console.log(this.filter.class_type)
        return this.filter.class_type+","+this.filter.left+","+this.filter.right
      }
      }
        },
        props: {filters:{
      type: Object,
      default:null
    },},
     data() {
      return {
          temp:-1,
          dialogVisible:true,
          origin:{},
          current:{},
          foflist:[],
          filter:{
              class_type:"CTA",
              left:"",
              right:""
              },
          options: [{
          value: '预选',
          label: '预选'
        }, {
          value: '二选',
          label: '二选'
        }, {
          value: '备投',
          label: '备投'
        }, {
          value: '已投',
          label: '已投'
        }],
        class_types: [{
          value: 'CTA',
          label: 'CTA'
        }, {
          value: '指增',
          label: '指增'
        }, {
          value: '中性',
          label: '中性'
        }, {
          value: '套利',
          label: '套利'
        }, {
          value: '混合',
          label: '混合'
        }]
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
            remoteMethod(query){
                this.$axios({
        url: "/fof/foflist",
        method: "GET",
        params: {},
      })
        .then((response) => {
            this.foflist=response.data

        })
            },
            getList() {
                console.log(this.filter)
        },
        }
}
</script>