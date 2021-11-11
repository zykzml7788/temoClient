<template>
  <div
    id="app"
    v-if="this.$route.path === '/'"
    :style="{ backgroundImage: 'url(' + this.login + ')' }"
    class="main"
  >
    <router-view />
  </div>
  <el-container v-else style="height: 100%">
    <el-aside
      width="210px"
      class="el-aside"
      style="height: 100%; padding: 0; margin: 0; background-color: #2c3259"
    >
      <headers></headers>
    </el-aside>

    <el-main style="height: 100%; padding: 0">
      <worktab></worktab>
      <div style="background-color: ghostwhite; padding: 20px">
        <div
          id="app"
          style="background-color: white; padding: 20px; height: 100%"
        >
          <keep-alive :exclude="closingPage">
            <router-view />
          </keep-alive>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Headers from "@/views/Header";
import Worktab from "@/common/component/tabs/worktab.vue";

export default {
  name: "App",
  components: {
    Headers,
    Worktab,
  },
  data() {
    return {
      login: require("../static/img/login.jpg"),
    };
  },
  computed: {
    closingPage() {
      return this.$store.state.closingPage;
    },
  },
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main {
  background-size: 100%;
  height: 100%;
}

#el-header {
  background-color: dodgerblue;
  height: 300px;
}

html,
body {
  margin: 0;
  padding: 0;
  border: 0;
  height: 100%;
}

.el-aside::-webkit-scrollbar {
  width: 0 !important;
}

.circle {
  border-radius: 50%;
}
</style>
