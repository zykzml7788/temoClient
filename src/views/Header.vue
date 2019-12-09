<template>

  <div id="header" style="background-color: midnightblue;padding: 1px">
<!--    <div style="background-color: coral">-->
<!--      <img src="../../static/img/mogu.jpg" alt="" style="height: 20%;width: 20%">Teemo-->
<!--    </div>-->
    <div style="height: 80px; margin: 20px" >
      <h2 style="color: white">Teemo</h2>
      <p style="font-weight: normal;font-size: small;color: #eaeaea">AutoTest For Api</p>
    </div>
    <div id="user" style="margin: 20px">
      <div style="display: inline-block;width: 20%;height: 100%"><img src="../../static/img/user.jpg" style="width:  100%;height: 100%" alt="" class="circle"></div>
      <div style="display: inline-block;">
        <div><strong class="el-icon-user-solid" style="color: white">test</strong></div>
        <i class="el-icon-switch-button" style="color:red;"><strong style="font-size: small">注销</strong></i>
      </div>
    </div>

    <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse" id="cehuaMenu" width="20%" background-color="midnightblue"
             text-color="white" >
      <el-menu-item index="1">
        <i class="el-icon-menu" style="color:white"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-menu" style="color:white"></i>
        <span slot="title">项目管理</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location" style="color:white"></i>
          <span slot="title">用例管理</span>
        </template>
        <el-menu-item index="3-1">用例集管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="4">
        <i class="el-icon-document" style="color:white"></i>
        <span slot="title">任务管理</span>
      </el-menu-item>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location" style="color:white"></i>
          <span slot="title">数据库管理</span>
        </template>
        <el-menu-item index="5-1">数据源管理</el-menu-item>
        <el-menu-item index="5-2">脚本管理</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-location" style="color:white"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item index="6-1">用户管理</el-menu-item>
        <el-menu-item index="6-2">角色管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="7">
        <i class="el-icon-document" style="color:white"></i>
        <span slot="title">调试工具</span>
      </el-menu-item>
      <el-menu-item index="6">
        <i class="el-icon-document" style="color:white"></i>
        <span slot="title">函数助手</span>
      </el-menu-item>
      <el-menu-item index="6">
        <i class="el-icon-document" style="color:white"></i>
        <span slot="title">个人中心</span>
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
          case '3-1':
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
