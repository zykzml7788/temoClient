<template>
  <el-dialog title="创建用例集" :visible.sync="dialogFormVisible" @close="close" :center="center" :destroy-on-close="destroyOnClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用例集名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="详细步骤" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc" :rows="15"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="close('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

  export default {
    name:'addCaseSet',
    data() {
      return {
        ruleForm: {
          name: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用例集名称', trigger: 'blur' },
            { min: 0, max: 50, message: '长度不能大于50个字符', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写相关用例描述', trigger: 'blur' }
          ],

        },
        dialogFormVisible: this.dialog,
        center: true,
        destroyOnClose: true
      };
    },
    props:[
      "dialog"
    ],
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("/apis/testCaseSet/",
              {
                "desc":this.ruleForm.desc,
                "name":this.ruleForm.name,
                "testCases":[]
              }
              ).then(res=> {
              if (res.data.code === 200){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error'
                });
              }
              this.close(formName);
            }).catch(err=>{
              this.$message({
                showClose: true,
                message: err,
                type: 'error'
              });
            });
          } else {
            return false;
          }
        });

        },
      resetForm(formName) {
        this.$nextTick(()=>{

          this.$refs[formName].resetFields();

        })
      },
      close(formName){
        this.$emit('closeAddPage',false);
        this.resetForm(formName);
      }

    },
    watch: {
      dialog: {
      immediate: true,
      deep: true,
      handler(val){
        this.dialogFormVisible = val;
      }
    }
  }

  }
</script>
