<template>
  <el-dialog :visible.sync="$store.state.addcasesetshow" style="height: 100%;" :close-on-click-modal="false"
             @close="">
  <div id="caseTest">
    <h2 style="text-align: left">新增用例集</h2>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <div id="base">
          <h3 style="text-align: left">基本信息</h3>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用例集名称" prop="name">
              <el-input v-model="baseInfo.setName"  placeholder="请输入用例集名称"></el-input>
            </el-form-item>
            <el-form-item label="调试环境" prop="name" style="text-align: left">
              <el-cascader
                placeholder="请选择调试环境"
                :options="baseInfo.envOptions"
                filterable></el-cascader>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="前/后置脚本添加" name="second">

        <div id="setup_script">
          <h3 style="text-align: left">前置脚本列表</h3>
          <el-button type="primary" @click="" style="float: left;margin: 20px;">添加前置脚本</el-button>
          <el-table
            :data="setUpScripts"
            border height="300">
            <el-table-column
              prop="sorting"
              label="执行顺序"
              width="80">
            </el-table-column>
            <el-table-column
              prop="scriptName"
              label="脚本名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="scriptType"
              label="脚本类别">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteDatabase(scope.row)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div id="teardown_script">
          <h3 style="text-align: left">后置脚本列表</h3>
          <el-button type="primary" @click="" style="float: left;margin: 20px;">添加后置脚本</el-button>
          <el-table
            :data="tearDownScripts"
            border height="300">
            <el-table-column
              prop="sorting"
              label="执行顺序"
              width="80">
            </el-table-column>
            <el-table-column
              prop="scriptName"
              label="脚本名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="scriptType"
              label="脚本类别">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteDatabase(scope.row)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用例列表" name="third">
        <div id="cases">
          <h3 style="text-align: left">用例列表</h3>
          <el-button type="primary" @click="" style="float: left;margin: 20px;">添加接口用例</el-button>
          <el-button type="primary" @click="" style="float: left;margin: 20px;">添加数据库用例</el-button>
          <el-table
            :data="cases"
            border height="600">
            <el-table-column
              prop="sorting"
              label="执行顺序"
              width="80">
            </el-table-column>
            <el-table-column
              prop="scriptName"
              label="用例名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="scriptType"
              label="用例类别">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteDatabase(scope.row)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  </el-dialog>
</template>

<script>


    export default {
        data() {
            return {
                baseInfo:{
                    setName:'',
                    envOptions:[

                    ]
                },
                activeName: 'first',
                setUpScripts: [
                    {sorting:1,scriptName:"CRM系统登入",scriptType:"接口脚本"},
                    {sorting:2,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:3,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:4,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:5,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:6  ,scriptName:"查询所有项目id",scriptType:"数据库脚本"}
                ],
                tearDownScripts: [
                    {sorting:1,scriptName:"CRM系统登入",scriptType:"接口脚本"},
                    {sorting:2,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:3,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:4,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:5,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:6,scriptName:"查询所有项目id",scriptType:"数据库脚本"}
                ],
                cases: [
                    {sorting:1,scriptName:"CRM系统登入",scriptType:"接口用例"},
                    {sorting:2,scriptName:"查询所有项目id",scriptType:"数据库用例"},
                    {sorting:3,scriptName:"查询所有项目id",scriptType:"数据库用例"},
                    {sorting:4,scriptName:"查询所有项目id",scriptType:"数据库用例"},
                    {sorting:5,scriptName:"查询所有项目id",scriptType:"数据库用例"},
                    {sorting:6,scriptName:"查询所有项目id",scriptType:"数据库用例"}
                ]
            };
        },
        methods:{
            handleClick(tab, event) {
                console.log(tab, event);
            }
        },
        computed: {

        },
        created:{
            getEnvs(){

            }
        },
        components:{
        }
    };
</script>
