<template>
  <el-dialog title="添加环境" :visible.sync="$store.state.addenvshow" :modal-append-to-body="false" @close="closeAddEnv" :modal="false" width="30%"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="环境名称" prop="envName">
        <el-input v-model="form.envName" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="域名" prop="host">
        <el-input v-model="form.host" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input v-model.number="form.port" maxlength="6"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addEnv">添 加</el-button>
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
          ],
          host:[
            {required:true,message:'请输入域名',trigger:'blur'},
          ],
          port:[
            { required:true,message:'请输入端口号',trigger:'blur'},
            { type: 'number', message: '端口号必须为数字',trigger:'blur'}
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
