<template>

  <div id="header" style="background-color: #2c3259 ;padding: 1px">
<!--    <div style="background-color: coral">-->
<!--      <img src="../../static/img/mogu.jpg" alt="" style="height: 20%;width: 20%">Teemo-->
<!--    </div>-->
    <div style="height: 80px; margin: 20px" >
      <h2 style="color: white">Teemo</h2>
      <p style="font-weight: normal;font-size: smaller;color: #eaeaea">AutoTest For Api</p>
    </div>
    <div id="user"  style="margin: 10px;background-color: #2c3259">
      <div style="display: inline-block;width: 20%;height: 100%;margin-left: 20px">
        <el-tooltip class="item" effect="dark" :content="userName" placement="top-start">
        <img src="../../static/img/timo.png" style="width:  55px;height: 55px" alt="" class="circle">
        </el-tooltip>
      </div>
      <div style="display: inline-block;margin: 15px">
        <div>
          <el-tooltip class="item" effect="dark" :content="userName" placement="top-start">
          <strong class="el-icon-user-solid" style="color: white;margin-left: 5px;font-size: smaller" >
            在线
          </strong>
          </el-tooltip>
        </div>
        <el-tooltip class="item" effect="dark" content="注销一下～" placement="top-start">
            <el-button size="mini" type="danger" @click="logout" icon="el-icon-switch-button" style="margin: 15px 0 0 20px" circle></el-button>
        </el-tooltip>
      </div>
    </div>

    <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse" id="cehuaMenu" width="20%" background-color="#2c3259"
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
        <el-menu-item index="3-1">功能脑图管理</el-menu-item>
<!--        <el-menu-item index="3-2">功能用例管理</el-menu-item>-->
        <el-menu-item index="3-3">自动化用例集管理</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location" style="color:white"></i>
          <span slot="title">数据库管理</span>
        </template>
        <el-menu-item index="4-1">数据源管理</el-menu-item>
        <el-menu-item index="4-2">脚本管理</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-document" style="color:white"></i>
          <span slot="title">任务管理</span>
        </template>
        <el-menu-item index="5-1">普通任务管理</el-menu-item>
        <el-menu-item index="5-2">定时任务管理</el-menu-item>
        <el-menu-item index="5-3">执行记录管理</el-menu-item>
      </el-submenu>
<!--      <el-submenu index="6">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-location" style="color:white"></i>-->
<!--          <span slot="title">用户管理</span>-->
<!--        </template>-->
<!--        <el-menu-item index="6-1">用户管理</el-menu-item>-->
<!--        <el-menu-item index="6-2">角色管理</el-menu-item>-->
<!--      </el-submenu>-->
      <el-menu-item index="7">
        <i class="el-icon-document" style="color:white"></i>
        <span slot="title">调试工具</span>
      </el-menu-item>
      <el-submenu index="8">
        <template slot="title">
          <i class="el-icon-document" style="color:white"></i>
          <span slot="title">配置管理</span>
        </template>
        <el-menu-item index="8-1">钉钉通知</el-menu-item>
        <el-menu-item index="8-2">Hook函数</el-menu-item>
      </el-submenu>
      <el-menu-item index="9">
        <i class="el-icon-document" style="color:white"></i>
        <span slot="title">个人中心</span>
      </el-menu-item>
    </el-menu>

  </div>

</template>

<script>
  import Comfirm from '@/common/component/Confirm'
  export default {

    name: 'headers',
    data () {
      return {
        isCollapse: false,
        activeIndex: '1',
        activeIndex2: '1',
        msg:'你确定要注销吗?',
        dialog: false,
        userName:JSON.parse(localStorage.getItem('userInfo')).userName
      }
    },
    methods:{
      handleSelect(key) {
        switch (key) {
          case '1':
            this.$router.push('/main');
            break;
          case '2':
            this.$router.push('/project');
            break;
          case '3-1':
              this.$router.push('/mind');
              break;
          case '3-2':
              this.$router.push('/case');
              break;
          case '3-3':
            this.$router.push('/autocase');
            break;
          case '4-1':
            this.$router.push('/database/config');
            break;
          case '4-2':
            this.$router.push('/database/script');
            break;
          case '5-1':
            this.$router.push('/task');
            break;
          case '5-2':
            this.$router.push('/timingTask');
            break;
          case '5-3':
            this.$router.push('/taskResult');
            break;
          case '7':
            this.$router.push('/apiUtil');
            break;
          case '8-1':
            this.$router.push('/dingTalk');
            break;
          case '8-2':
            this.$router.push('/hookFunction');
            break;
        }
      },
      closeConfirm(data,val){
        this.dialog = data;
      },
      logout(){

        this.$confirm('是否要注销？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios.post('/apis/logout').then(res => {
              if (res.data.success === true) {
                localStorage.removeItem('userInfo');
                this.$router.push({path:'/'});
              }
            });
        });
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
