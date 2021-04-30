<template>
  <div>
    <div class="block" style="display: flex; justify-content: space-between">
      <div >

       

        <el-button type="primary" @click="doaction">刷新最新净值</el-button>
        <el-button type="primary" @click="updateparam">刷新参数</el-button>
        <el-button type="primary" @click="downWeekly">下载周报</el-button>
        <el-button type="primary" @click="sendmail">发送邮件</el-button>

      
      </div>
    </div>
  
  </div>
</template>
<script>
import Vue from 'vue'
import store from '@/store'
import {mapGetters} from 'vuex'

// import the styles
export default {
  components: {

  },
  computed: {
     ...mapGetters(['sysparam']),
    compares: {
      get() {
        //   console.log(this.filter.class_type)
        //   console.log(this.addition)
        return this.comb1 + "," + this.comb2;
      },
    },
  },
  props: {
    filters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      temp: -1,
      comb1: "",
      comb2: "",
      combine:null,
      corr:0,
      goal0:0,
      expect:0.2,
      cret:0,
      eret:0,
      cvola:0,
      evola:0,
      compData:[],
      dialogVisible: true,
      origin: {},
      current: {},
      foflist: [],
      filter: {
        class_type: "CTA",
        left: "",
        right: "",
      },
      normalizer: (node) => {
        return {
          id: node.code,
          label: node.name,
        };
      },
    };
  },

  watch: {
    compares:{      handler(n) {
        var len=n.length
        if(len>1&&n.indexOf(",")<len-1){
        this.doload()
        }
    }},
    $route: {
      handler(n) {
        if (this.filters) {
          console.log("route init ");
          console.log(this.filter);
          var jobj = JSON.parse(JSON.stringify(this.filters));
          for (var key in jobj) {
            this.filter[key] = jobj[key];
          }

          //   this.filter=JSON.parse(JSON.stringify(this.filters));
          //   this.filter["class_type"]="CTA"
        } else {
          this.filter = n.params;
        }
        // 初始化操作
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    //this.remoteMethod();
  },
  methods: {
      downWeekly(){
          window.location.href="/fof/downfile?code=FOF"
      },
      updateparam(){
          var that=this
this.$axios.get('/sys/param?refresh=1').then((response) => {
        let params={}
        for (var key in response.data){
            params[key]=response.data[key]['child']
        }
        store.commit('setSysParam',params)
    })
      },
    doaction() {
       this.$axios({
        url: "/fof/action",
        data:{"code":"update_cur"}, //          
        method: "POST"
      }).then((response) => {
            console.log(response.data)
        }); 
    },
    sendmail() {
       this.$axios({
        url: "/fof/action",
        data:{"code":"sendmail"}, //          
        method: "POST"
      }).then((response) => {
            console.log(response.data)
        }); 
    },
    }
};
</script>
<style scoped>
.ctable{
  position:relative;
  border:1px solid #000;
  overflow-X:scroll;
}
td{
    border:solid #000;
    width:120px;
     border-width:0px 1px 1px 0px;
}

</style>