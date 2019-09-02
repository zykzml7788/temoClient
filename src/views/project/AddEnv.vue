<template>
  <el-dialog title="添加环境" :visible.sync="$store.state.addenvshow" :modal-append-to-body="false" @close="closeAddEnv" :modal="false" width="30%"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="环境名称" prop="envName">
        <el-input v-model="form.envName"></el-input>
      </el-form-item>
      <el-form-item label="域名" prop="host">
        <el-input v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input v-model="form.port"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addEnv">确 定</el-button>
      <el-button @click="closeAddEnv">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    data() {
      return {
        rules:{
          envName:[
            {required:true,message:'请输入环境名称',trigger:'blur'},
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          host:[
            {required:true,message:'请输入域名',trigger:'blur'},
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          port:[
            {required:true,message:'请输入端口号',trigger:'blur'},
            { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
          ]
        },
        form:{
          envName:'',
          host:'',
          port:''
        }
      }
    },
    methods:{
      addEnv(){
        const env = {
          "envName":this.form.envName,
          "host":this.form.host,
          "port":this.form.port
        };
        this.$refs['form'].validate(bol => {
          if (bol) {
            this.$store.commit('appendEnv', env);
            this.closeAddEnv();
          }
        });
      },
      closeAddEnv(){
        this.$refs['form'].resetFields();
        this.$store.commit('changeAddEnvShow',false);

      }
    }
  }
</script>
