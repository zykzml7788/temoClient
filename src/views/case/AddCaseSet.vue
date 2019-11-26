<template>
  <el-dialog title="新增用例集" :visible.sync="$store.state.addcasesetshow" style="height: 100%;" :close-on-click-modal="false"
             @close="closeAddCaseSetView">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="caseSetName">
        <el-input placeholder="请输入用例集名称" v-model="form.caseSetName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="步骤" :label-width="formLabelWidth" prop="caseSetDesc">
        <el-input type="textarea" v-model="form.caseSetDesc" placeholder="请在此填写描述" :rows="15"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addDataBase">确 定</el-button>
      <el-button @click="closeAddCaseSetView">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>


  export default {
    data() {
      return {
        rules:{
          caseSetName:[
            {required:true,message:'请输入用例集名称',trigger:'blur'},
          ],

          caseSetDesc:[
            {required:true,message:'请输入用例集步骤描述',trigger:'blur'},
          ]

        },
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          caseSetName:'',
          caseSetDesc:''
        },
        formLabelWidth: '80px',
      };
    },
    methods:{
      addDataBase(){
        const database = {
          "dbName": this.form.dbName,
          "dbLibraryName": this.form.dbLibraryName,
          "host": this.form.host,
          "port": this.form.port,
          "user": this.form.user,
          "pwd": this.form.pwd
        };
        this.$refs['form'].validate(bol=>{
          if (bol){
            this.$axios.post('/apis/database/',database).then(res=>{
              this.$notify({
                title: '成功',
                type:'success',
                message:res.data.msg
              });
              this.closeAddDatabaseView();
              this.$emit('getDataBases');
            }).catch(err=>{
              this.$notify({
                title: '失败',
                type:'error',
                message:err
              });
            });

          }
        });
      },
      closeAddCaseSetView(){
        this.$refs['form'].resetFields();
        this.$store.commit('changeAddCaseSetShow',false);
      }
    },
    computed: {

    },
    components:{
    }
  };
</script>
