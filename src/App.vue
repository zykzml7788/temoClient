<template>
  <el-container>
    <el-aside width="200px">
      <headers></headers>
    </el-aside>
    <el-main>
      <el-header id="el-header" height="10%"></el-header>
      <div id="app">
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
    background-image: url("../static/img/header.jpg");
  }
</style>
