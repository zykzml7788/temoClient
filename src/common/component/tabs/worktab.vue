<template>
  <div class="cp-worktab">
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane
        v-for="t in worktabs"
        :key="t.name"
        :label="t.tabname"
        :name="t.name"
        :closable="t.name !== 'main'"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    created () {
      // 进来不是主页时等list加载后再更新一次current
      setTimeout(() => {
        this.activeTab = this.$store.state.worktab.current.name
      }, 500)
    },
    watch: {
      '$store.state.worktab.current' (tab) {
        this.activeTab = tab.name
      }
    },
    computed: {
      worktabs () {
        return this.$store.state.worktab.list
      }
    },
    data () {
      return {
        activeTab: 'main'
      }
    },
    methods: {
      clickTab (tab) {
        this.$router.push(this.worktabs[1 * tab.index].path)
      },
      removeTab (name) {
        this.$store.dispatch('worktabRemove', name)
      }
    }
  }
</script>
