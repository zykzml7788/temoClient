<template>

  <div id="header">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2">项目管理</el-menu-item>
      <el-menu-item index="3">用例集管理</el-menu-item>
      <el-menu-item index="4">任务管理</el-menu-item>
      <el-submenu index="5">
        <template slot="title">数据库管理</template>
        <el-menu-item index="5-1">脚本管理</el-menu-item>
        <el-menu-item index="5-2">配置管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="6">用户管理</el-menu-item>
      <span id="logout">
        <i class="el-icon-user-solid"></i>
        <el-button type="text" @click="dialog = true">注销</el-button>
        <comfirm :dialog="dialog" :msg="msg"  @closeCf="closeConfirm"></comfirm>
      </span>
    </el-menu>

  </div>

</template>

<script>
  import Comfirm from '@/common/Confirm'
  export default {

    name: 'headers',
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        msg:'你确定要注销吗?',
        dialog: false
      }
    },
    methods:{
      handleSelect(key) {
        switch (key) {
          case '1':
            this.$router.push('/');
          case '2':
            this.$router.push('/project');
            break;
          case '3':
            this.$router.push('/case');
            break;
        }
      },
      closeConfirm(data,val){
        this.dialog = data;
      }
    },
    components:{
      "comfirm":Comfirm
    },
    created() {
      console.log("楷楷最帅！")
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #header {
    font-weight: bold;
  }

  #logout {
    margin: 10px 10px;
    float: right;
  }


</style>
