<template>
  <el-dialog title="编辑项目" :visible.sync="$store.state.editprojectshow" style="height: 100%;" :close-on-click-modal="false" :append-to-body="true"
             @close="closeAddProjectView">
    <addenv></addenv>
    <editenv></editenv>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="项目名称" :label-width="formLabelWidth" prop="pname">
        <el-input v-model="form.pname" autocomplete="off"></el-input>
      </el-form-item>
      <br/>
      <div style="text-align:left;">
        <el-button type="primary" @click="showEnv">添加环境</el-button>
      </div>
      <div>
        <el-divider content-position="left">项目环境</el-divider>
      </div>
      <el-table
        :data="envList"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="envName"
          label="环境名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="host"
          label="域名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口号">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="showEditEnv(scope.$index,scope.row)" type="warning" size="mini">编辑</el-button>
            <el-button @click="delEnv(scope.$index)" type="danger" size="mini">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editProject">确 定</el-button>
      <el-button @click="closeAddProjectView">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AddEnv from '@/views/project/AddEnv'
  import EditEnv from '@/views/project/EditEnv'

  export default {
    data() {
      return {
        rules:{
          pname:[
            {required:true,message:'请输入项目名称',trigger:'blur'},
          ]
        },
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          pname:'',
        },
        formLabelWidth: '80px',
      };
    },
    methods:{
      showEnv(){
        this.$store.commit('changeAddEnvShow',true);
      },
      showEditEnv(id,row){
        const envDetail = {
          "id":id,
          "envId":row.envId,
          "envName":row.envName,
          "host":row.host,
          "port":row.port
        };
        this.$store.commit('setEnvDetail',envDetail);
        this.$store.commit('changeEditEnvShow',true);
      },
      delEnv(index){
        this.$store.commit('rmEnvById',index);
      },
      editProject(){
        const project = {
          "pid": this.$store.state.projectDetail.id,
          "pname": this.form.pname,
          "envs": this.envList
        };
        this.$refs['form'].validate(bol=>{
          if (bol){
            this.$axios.put('/apis/project/'+project.pid,project).then(res=>{
              if (res.data.code===200){
                this.$notify({
                  title: '成功',
                  type:'success',
                  message:res.data.msg
                });
                this.closeAddProjectView();
                this.$emit('getProjects');
              } else{
                this.$notify({
                  title: '失败',
                  type:'warning',
                  message:res.data.msg
                });
              }
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
      closeAddProjectView(){
        this.$refs['form'].resetFields();
        this.$store.commit('changeEditProjectShow',false);
        this.$store.commit('clearEnvList');
        this.$store.commit('setProjectDetail','');
      }
    },
    computed:{
      envList(){
        return this.$store.getters.getEnvList;
      }
    },
    components:{
      "addenv":AddEnv,
      "editenv":EditEnv
    },
    watch:{
      "$store.state.projectDetail.name":function () {
        this.form.pname = this.$store.state.projectDetail.name;
      }
    }
  };
</script>
