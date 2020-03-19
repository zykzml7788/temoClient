<template>
  <div id="main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>/</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 50px">
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>自动化已运行</span>
          <el-tag effect="dark" class="tag" size="mini">持续</el-tag>
        </div>
        <span class="content" style="color: deepskyblue"> 0 天 0 小时 0 分钟</span>
        <div class="bottom"><span>正在执行任务 10 个</span></div>
      </el-card>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>今日执行情况</span>
          <el-tag effect="dark" class="tag" size="mini" type="warning">运行</el-tag>
        </div>
        <span  class="content" style="color: #ffcd32">已执行用例 300 条</span>
        <div class="bottom"><span>成功率 90% </span></div>
      </el-card>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>用例库</span>
          <el-tag effect="dark" class="tag" size="mini" type="danger">库存</el-tag>
        </div>
        <span  class="content" style="color: #ff4d51;">用例集库存 100 条</span>
        <div class="bottom"><span>包含用例 1000 条</span></div>
      </el-card>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>任务库</span>
          <el-tag effect="dark" class="tag" size="mini" type="success">库存</el-tag>
        </div>
        <span  class="content" style="color: #13ce66">普通任务 20 个</span>
        <div class="bottom"><span>已开启定时任务  10 个</span></div>
      </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        }
    }
</script>

<style scoped>

  #main{
    font-family: "Microsoft YaHei UI",serif;
  }

  .card {
    float: left;
    margin: 2%;
    width:  20%;
    height: 200px;
    border-radius:10px;
    text-align: left;

  }

  .chead {
    text-align: left;
    font-size: x-small;
    font-weight: bold;
  }

  .content {
    font-size: large;
  }

  .bottom {
    margin-top: 50PX;
    font-size: x-small;
    font-weight: bold;
  }

  .tag {
    float: right;
  }
</style>
