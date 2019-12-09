<template>

    <div id="app" v-if="this.$route.path==='/login'" style="height: 2000px;margin:0;background-image: url('../static/img/loginbgp.jpeg'); background-repeat: repeat;">
      <router-view/>
    </div>
    <el-container v-else>
      <el-aside width="210px" class="el-aside" style="height: 100%;padding: 0;margin: 0;">
        <headers></headers>
      </el-aside>
      <el-main style="height: 90%;padding: 0;">
        <el-header id="el-header" height="10%" style="padding: 30px;background-color: dodgerblue">

        </el-header>
        <div id="app" style="margin: 20px;">
          <router-view/>
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

  body {
    margin: 0;
    padding: 0;
    border: 0
  }

</style>
