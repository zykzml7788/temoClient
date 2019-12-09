<template>

    <div id="app" v-if="this.$route.path==='/login'" style="height: 100%;margin:0;background-image: url('../static/img/loginbgp.jpeg'); background-repeat: repeat;">
      <router-view/>
    </div>
    <el-container v-else style="height: 100%">
      <el-aside width="210px" class="el-aside" style="height: 100%;padding: 0;margin: 0;background-color: midnightblue;">
        <headers></headers>
      </el-aside>
      <el-main style="height: 100%;padding: 0;">
        <el-header id="el-header" height="50px" style="background-color: dodgerblue;">
          <h5 style="float: right;margin: 20px 10px;color: white;" class="el-icon-setting">测试用户</h5>
          <img src="../static/img/user.jpg" style="height: 30px;width: 30px;float: right;margin-top: 10px" alt="" class="circle">
        </el-header>
        <div style="background-color: ghostwhite;padding: 20px;">
          <div id="app" style="background-color: white;padding: 20px">
            <router-view/>
          </div>
        </div>

      </el-main>
    </el-container>
</template>

<script>
  import Headers from '@/views/Header'
  export default {
    name: 'App',
    components:{
      Headers
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

  #el-header {
    background-color: dodgerblue;
    height: 300px;
  }

  html,body {
    margin: 0;
    padding: 0;
    border: 0;
    height: 100%;
  }

.el-aside::-webkit-scrollbar {
  width: 0 !important
}

  .circle {
    border-radius:50%
  }

</style>
