<template>

  <div id="header">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse" id="cehuaMenu" width="20%">
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">项目管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">用例管理</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-document"></i>
        <span slot="title">任务管理</span>
      </el-menu-item>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">数据库管理</span>
        </template>
        <el-menu-item index="5-1">环境配置管理</el-menu-item>
        <el-menu-item index="5-2">脚本管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="6">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
    </el-menu>

  </div>

</template>

<script>
  import Comfirm from '@/common/Confirm'
  export default {

    name: 'headers',
    data () {
      return {
        isCollapse: false,
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
            break;
          case '2':
            this.$router.push('/project');
            break;
          case '3':
            this.$router.push('/case');
            break;
          case '5-1':
            this.$router.push('/database/config');
            break;
          case '5-2':
            this.$router.push('/database/script');
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
  #cehuaMenu {
  }
  #logout {
    margin: 10px 10px;
    float: right;
  }


</style>
