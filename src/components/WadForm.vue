<template>
    <el-form :model="current" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
    <template v-for="(row,index)  in cForm" >

     <el-row  :key="index"   v-show="index%2==0">
      <el-col :span="12">              
      <el-form-item v-if="index<=cForm.length-1"  :prop="row.dataIndex"      :label=" row.tilte">
          <el-select v-if="row.param" v-model="current[row.dataIndex]"  style="width:120px"  clearable :placeholder="row.tilte">
    <el-option
      v-for="item in sysparam[row.param]"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
          <el-input v-else v-model="current[row.dataIndex]"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="12">              
      <el-form-item v-if="index+1<cForm.length"  :prop="cForm[index+1].dataIndex"      :label=" cForm[index+1].tilte">
          <el-select v-if="cForm[index+1].param" v-model="current[cForm[index+1].dataIndex]"  style="width:120px"  clearable :placeholder="cForm[index+1].tilte">
    <el-option
      v-for="item in sysparam[cForm[index+1].param]"
      :key="item.value"
      :label="item.value"
      :value="item.code">
    </el-option>
  </el-select>
          <el-input v-else v-model="current[cForm[index+1].dataIndex]"></el-input>
      </el-form-item>
      </el-col>
    </el-row >
    </template>
<el-form-item>
    <el-button v-if="usermenu.indexOf('info-edit')>-1" type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button v-if="usermenu.indexOf('info-edit')>-1" @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>
<script>
    import {mapGetters} from 'vuex'

export default {
    props: {
     cForm:{
      type: Array,
      default: {}
    }},
    computed: {
        // ...mapState({
        //     current: state => state.tab.currentMenu
        // }),
       ...mapGetters(['token','sysparam','usermenu']),

    },
      methods: {
       submitForm(){

       },
       resetForm(){

       }
      },
    data(){
        return{
          current:{}
        }
    }
}
</script>