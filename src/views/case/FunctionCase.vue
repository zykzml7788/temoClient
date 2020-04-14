<template>
  <div id="minder-container">
    <el-button @click="xmindShow = true">新增用例</el-button>
    <el-drawer
      :visible.sync="xmindShow"
      :direction="'ttb'"
      size="90%"
    >
      <div style="height: 800px">
        <minder
          ref="minder"
          @exportData="exportData"

          :importData="importData"
          @saveData="saveData"
        ></minder>
      </div>
    </el-drawer>
  </div>

</template>


<script>

  export default {
      name : '',
      data () {
          return{
              importData: {//数据结构
                  data: { text: '测试用例名称', id: 1 },
                  children: [
                  ]
              },
              xmindShow: false
          }
      },
      methods: {
          exportData(data) {//变化时返回数据
              console.log(data);
          },
          saveData(data){ //
            this.xmindShow = false;
          }
      }
  }
</script>

<style scoped>
  #minder-container {
    height: 100vh;
  }
</style>
