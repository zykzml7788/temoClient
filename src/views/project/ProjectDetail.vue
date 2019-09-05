<template>
  <el-dialog title="项目详情" :visible.sync="$store.state.projectdetailshow" style="height: 100%;" :close-on-click-modal="false"
             @close="closeDetail">

    <el-form  ref="form">
      <el-form-item label="项目名称" :label-width="formLabelWidth">
        <el-input v-model="$store.state.projectDetail.name" autocomplete="off" disabled></el-input>
      </el-form-item>
      <br/>
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
      </el-table>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDetail">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    data() {
      return {
        formLabelWidth: '80px',
      };
    },
    methods:{

      closeDetail(){
        this.$store.commit('changeProjectDetailShow',false);
        this.$store.commit('clearEnvList');
      }
    },
    computed:{
      envList(){
        return this.$store.getters.getProjectDetail.envList;
      },
    },
    components:{
    }
  };
</script>
