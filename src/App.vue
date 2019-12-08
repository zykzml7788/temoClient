<template>

    <div id="app" v-if="this.$route.path==='/login'" style="height: 2000px;margin:0;background-image: url('../static/img/loginbgp.jpeg'); background-repeat: repeat;">
      <router-view/>
    </div>
    <el-container v-else>
      <el-aside width="200px" class="el-aside">
        <headers></headers>
      </el-aside>
      <el-main style="height: 90%">
        <el-header id="el-header" height="10%">

        </el-header>
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
    background-color: dodgerblue;
    height: 300px;
  }

</style>
