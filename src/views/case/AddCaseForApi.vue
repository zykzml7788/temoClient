<template>
  <el-dialog :visible.sync="$store.state.addcaseforapishow" style="height: 100%;" :close-on-click-modal="false" :append-to-body="true"
             @close="">
    <div id="caseTest">
      <h2 style="text-align: left">添加接口用例</h2>

      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane label="接口基本信息" name="apiInfo">
          <el-form :inline="true"  class="demo-form-inline">
            <el-form-item>
              <el-select v-model="api.method" placeholder="请选择请求方式">
                <el-option
                  v-for="item in methodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="100px;"><el-input v-model="api.url" placeholder="请输入接口地址" style="width:450px;"></el-input></el-form-item>
          </el-form>
          <el-tabs v-model="activeNameForApi" @tab-click="handleClick" type="border-card">
            <el-tab-pane label="Params" name="params">

            </el-tab-pane>
            <el-tab-pane label="Headers" name="headers">

            </el-tab-pane>
            <el-tab-pane label="Body" name="body">

            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="关联参数设置" name="paramSave">

        </el-tab-pane>
        <el-tab-pane label="断言设置" name="verify">

        </el-tab-pane>
        <el-tab-pane label="延迟时间" name="delayTime">

        </el-tab-pane>
        <el-tab-pane label="全局Cookie & Header注入" name="cookieAndHeader">

        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>


  export default {
    data() {
      return {
        activeName: 'apiInfo',
        activeNameForApi: 'params',
        methodOptions: [{
          value: 'GET',
          label: 'GET'
        }, {
          value: 'POST',
          label: 'POST'
        }, {
          value: 'PUT',
          label: 'PUT'
        }, {
          value: 'DELETE',
          label: 'DELETE'
        }],
        api:{
          url:'',
          method:''
        }
      };
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    computed: {

    },
    components:{
    }
  };
</script>
