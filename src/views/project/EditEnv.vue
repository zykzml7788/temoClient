<template>
  <el-dialog title="修改环境" :visible.sync="$store.state.editenvshow" :modal-append-to-body="false" @close="closeEditEnv" :modal="false" width="30%"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="环境名称" prop="envName">
        <el-input v-model="form.envName"></el-input>
      </el-form-item>
      <el-form-item label="域名" prop="host">
        <el-input v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input v-model.number="form.port"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editEnv">确 定</el-button>
      <el-button @click="closeEditEnv">取 消</el-button>
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
          id: this.$store.state.envDetail.id,
          envId: this.$store.state.envDetail.envId,
          envName: this.$store.state.envDetail.envName,
          host: this.$store.state.envDetail.host,
          port: this.$store.state.envDetail.port
        }
      }
    },
    methods:{
      editEnv(){

        const env = {
          "id": this.form.id,
          "envId": this.form.envId,
          "envName":this.form.envName,
          "host":this.form.host,
          "port":this.form.port
        };
        this.$refs['form'].validate(bol => {
          if (bol) {
            this.$store.commit('editEnv', env);
            this.closeEditEnv();
          }
        });
      },
      closeEditEnv(){
        this.$store.commit('changeEditEnvShow',false);
        this.$refs['form'].resetFields();
      }
    },
    watch: {
      '$store.state.envDetail': function (val) {
          this.form = val;
      }
    }
  }
</script>
