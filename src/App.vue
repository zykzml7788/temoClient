<template>
  <div>
    <div id="header">
      <headers></headers>
    </div>
    <div id="app">
      <router-view/>
    </div>
  </div>
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
</style>
