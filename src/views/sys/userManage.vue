<template>
  <div>
      <div class="block" style="display: flex;justify-content: space-between">
        

        <div style="display: flex;justify-content: space-between">
        <el-button  size="small" @click="addInfo()">添加</el-button>
        <el-button  size="small" @click="toggleSelection()">取消选择</el-button>


         </div>
      </div>
       
      <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px;"
    @selection-change="handleSelectionChange"      >
<!--    @row-click = "Selection"-->

    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
<!--      测试ID-->
    <el-table-column
      prop="name"
      label="名称"
      width="120">
      <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
<!--      用例编号-->
     <el-table-column
      prop="user"
      label="值"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.user }}</template>
    </el-table-column>
<!--      测试项目-->
<el-table-column
      label="操作"
            fixed="right"
      width="160">
        <template slot-scope="scope">
            <el-button @click.native.prevent="edituser(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="编辑" placement="left-start"><i class="el-icon-edit" ></i></el-tooltip></el-button>
            <el-button @click.native.prevent="resetPass(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="修改密码" placement="left-start"><i class="el-icon-key"></i></el-tooltip></el-button>
            <el-button @click.native.prevent="deluser(scope.row)" type="text" size="small"><el-tooltip class="item" effect="dark" content="删除" placement="left-start"><i class="el-icon-delete" style="color:red;"></i></el-tooltip></el-button>

        </template>
    </el-table-column>
  </el-table>
      <div style="display: flex;justify-content: space-between">
      
      <div class="block" style=" margin-top: 25px; height: 120px; ">
        <!-- --><el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 25, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totaltableData.length">
        </el-pagination> 
      </div>
    </div>

      <el-dialog
    width="80%"
    top="50px"
    @close="saveClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="formVisible"
  >
<el-form :model="current" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
    <template v-for="(row,index)  in cForm" >
    <el-form-item  :key="index" :prop="row.dataIndex"      :label=" row.tilte"><el-input v-model="current[row.dataIndex]"></el-input>
      </el-form-item>   
    </template>
          <el-form-item v-if="adduser" label="密码"> 

    <el-input placeholder="请输入密码" v-model="current.password" show-password></el-input>
          </el-form-item>
      <el-form-item label="权限"> 
    <el-checkbox-group v-model="current.permission">
             
     <!----> <template  v-for="(row,index)  in allmenu" >

      <el-checkbox :key="index" :label="row['lable']" :name="row['value']"></el-checkbox>

      </template> 
     
    </el-checkbox-group>
  </el-form-item>
<el-form-item>
    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>

    </el-dialog>

    <el-dialog
    width="80%"
    top="50px"
    @close="saveClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="resetVisible"
  >
<el-form :model="current" ref="resetPassForm" label-width="120px" class="demo-dynamic">
    <el-form-item label="密码"> 
        <el-input placeholder="请输入密码" v-model="current.password" show-password></el-input>
    </el-form-item>
<el-form-item>
    <el-button type="primary" @click="submitPass('resetPassForm')">提交</el-button>
    <el-button @click="resetForm('resetPassForm')">重置</el-button>
  </el-form-item>
</el-form>

    </el-dialog>
  </div>
  
</template>

<!--1、用例编号;-->
<!--2、测试项目;-->
<!--3、测试标题;-->
<!--4、重要级别;-->
<!--5、预置条件;-->
<!--6、测试输入;-->
<!--7、操作步骤;-->
<!--8、预期输出-->
<script>
    import axis from 'axios'
import {mapGetters} from 'vuex'
    
const cForm=[
    {"tilte":"用户","dataIndex":"user"},
    {"tilte":"名称","dataIndex":"name"}]
  export default {
      components: {
        },
        computed:{
        ...mapGetters(['allmenu'])
        },
    data() {
      return {
          stage:'',
          adduser:false,
          cForm:cForm,
          formVisible:false,
          resetVisible:false,
          parent:0,
          subData: [],
        multipleSelection: [],
        current:{permission:[]},
        cur_code:"",
        dialogVisible: false,
        rowdata: '',
        value2: '',
        PageSize:30,
        input: '',
          tableData:[],
          totaltableData: [],
          currentPage: 1,
          multipleSelection: []
      }
    },
    watch: {
    $route:{
      handler(n){
          this.getList(n.params)
		// 初始化操作
      },
      immediate: true,
      deep: true,
    }
  },
    methods: {

         deluser(row) {
          axis({
      method: 'post',
      url: "/sys/deluser", // 请求地址
      data: {user:row.user}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
            this.getList()
          }

      },
      err => {
        reject(err)
      }
    )
      },
         addInfo(){
          this.adduser=true
          this.current={permission:[]}
          this.formVisible=true
      },
      resetPass(row){
          this.current=row
          this.resetVisible=true
      },
      resetForm(formName) {
          console.log(formName)
        this.$refs[formName].resetFields();
      },
      edituser(row){
          console.log(row)
          this.adduser=false
          var perms=[]
          for(var perm of row.permissions.split(",")){
              for(var aperm of this.allmenu){
                  if(aperm["value"]==perm){
                      perms.push(aperm['lable'])
                      break
                  }
              }
          }
          this.current={user:row.user,name:row.name,permission:perms}
          this.formVisible=true
      }
      ,
         editClose() {
        this.dialogVisible = false
        this.parent=0
        },
        saveClose(){
            this.formVisible=false
            this.getList()
        },
        submitPass(formName){
            if(this.current&&this.current.user){
                axis({
      method: 'post',
      url: "/sys/updatepass", // 请求地址
      data: {"user":this.current.user,"password":this.current.password}, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
            this.resetVisible = false
          }

      },
      err => {
        reject(err)
      }
    )
            }
        },
        submitForm(formName) {
          var permissions=""
          for(var perm of this.current.permission){
              for(var aperm of this.allmenu){
                  if(aperm["lable"]==perm){
                      permissions+=aperm["value"]+","
                      break
                  }
              }
          }
          this.current.permissions=permissions
          var sumitData={"user":this.current.user,"name":this.current.name,"password":this.current.password,"permissions":permissions}
          if(formName=='editform'){
              delete sumitData.password
          }else{

          }
          axis({
      method: 'post',
      url: "/sys/saveuser", // 请求地址
      data: sumitData, // 参数
      responseType: 'json' // 表明返回服务器返回的数据类型
    }).then(
      response => {
          if(response.data["status"]=="success"){
              this.getList(this.filter)
            this.formVisible = false
          }

      },
      err => {
        reject(err)
      }
    )
      },

      showHis(row){
          this.cur_code=""
          this.parent=row.id
          this.current=row
          this.dialogVisible=true
          this.cur_code=row.code
           axis( {
                url: 'sys/param',
                method: 'GET',
                params: {parent:row.id}
                }).then((response) => {
                                console.log(response);
                                this.subData = response.data;
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
          
        //   this.$refs.hischart.$emit("getChart",row.code)    //子组件$on中的名字
      },
      handleClose(done) {
          done()
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      //表格方法
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        this.multipleSelection=[]
      },
      //
      allrun() {
        // console.log(this.multipleSelection)
        if(this.multipleSelection.length<1){
            return
        }
        var selcode=""
        console.log(this.multipleSelection)
        for (let i = 0; i < this.multipleSelection.length; i++) {
              selcode+=","+this.multipleSelection[i].code;
        }
          this.cur_code=""
          this.current=this.multipleSelection[0]
          this.dialogVisible=true
          this.cur_code=selcode
        //   this.$refs.hischart.$emit("getChart",selcode)  
      },
      // 选中
      handleSelectionChange(val) {
          console.log(val)
        this.multipleSelection = val;
      },
      delSelection(){
        for (let i = 0; i < this.multipleSelection.length; i++) {
            console.log(this.multipleSelection[i].id);
            for (let j = 0; j < this.tableData.length; j++) {
                if(this.multipleSelection[i].id === this.tableData[j].id){
                   this.tableData.splice(j, 1);
                   break;
                }
            }
         }
      },
       clickSelection(index, row){
            // console.log(index, row);
           console.log(row.test_id)
           this.request_excute(row.test_id)
        },
      // 分页方法
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.PageSize = val;
        console.log(this.PageSize)
        console.log(this.currentPage)
      },
      // 跳转
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        //页面每页大小
        console.log(this.PageSize)
        //当前页
        console.log(this.currentPage)
        let startindex = (this.currentPage - 1) * this.PageSize;
        if(startindex <= 0){
                  startindex = 0;
        }
        let endindex;
        if (this.PageSize * this.currentPage > this.totaltableData.length){
            endindex =  this.totaltableData.length ;
        }else{
            endindex =  this.PageSize * this.currentPage ;
        }
        console.log(startindex,endindex)
          this.tableData =  this.totaltableData.slice(startindex ,endindex);
      },
      //时间选择器方法
      handeldateChange(){
        console.log(this.value2[0]);
        console.log(this.value2[1]);
      },
      //
     getList(param){
            console.log(param)
             var $this=this
             var data={parent:0}
             if(param && typeof(param)=='object'){
                 data=param
             }
             
            //   axis.get('/fof/list')//axis后面的.get可以省略；
            axis( {
                url: 'sys/user',
                method: 'GET',
                params: data
                }).then((response) => {
                                console.log(response);
                                this.totaltableData = response.data;
                                this.tableData = this.totaltableData.slice(0 ,$this.PageSize);
                            })
                        .catch(
                            (error) => {
                                console.log(error);
                    });
            },
              //
        },

    //   async mounted() {
    //         console.log(this.$route.params)
    //         this.getList(this.$route.params.type);
    //   }
  }
  
</script>