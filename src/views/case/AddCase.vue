<template>
  <el-dialog :visible.sync="$store.state.addcaseshow" style="height: 100%;" :close-on-click-modal="false"
             @close="">
  <div id="caseTest">
    <h2 style="text-align: left">添加用例及脚本</h2>
    <h4>用例集：<strong style="color: red;">{{setName}}</strong></h4>
    <el-button type="primary" @click="" style="float: right">调试</el-button>

    <AddCaseForApi @getCaseInfo="getCaseInfo"></AddCaseForApi>

    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="前置脚本添加" name="first">

        <div id="setup_script">
          <h3 style="text-align: left">前置脚本列表</h3>
          <el-button type="primary" @click="" style="float: left;margin: 10px;">添加前置脚本</el-button>
          <el-table
            :data="setUpScripts"
            stripe height="100%">
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
                  @click.native.prevent=""
                  type="primary"
                  size="mini">
                  上移
                </el-button>
                <el-button
                  @click.native.prevent=""
                  type="info"
                  size="mini">
                  下移
                </el-button>
                <el-button
                  @click.native.prevent="deleteTestCase(scope.row)"
                  type="danger"
                  size="mini">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="后置脚本添加" name="second">
        <div id="teardown_script">
          <h3 style="text-align: left">后置脚本列表</h3>
          <el-button type="primary" @click="" style="float: left;margin: 10px;">添加后置脚本</el-button>
          <el-table
            :data="tearDownScripts"
            stripe height="100%">
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
                  @click.native.prevent=""
                  type="primary"
                  size="mini">
                  上移
                </el-button>
                <el-button
                  @click.native.prevent=""
                  type="info"
                  size="mini">
                  下移
                </el-button>
                <el-button
                  @click.native.prevent="deleteTestCase(scope.row)"
                  type="danger"
                  size="mini">
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
          <el-button type="primary" style="float: left;margin: 10px;" @click="showAddCaseForApi">添加接口用例</el-button>
          <el-button type="primary" @click="" style="float: left;margin: 10px;">添加数据库用例</el-button>
          <el-table
            :data="cases"
            stripe height="100%" :default-sort="{prop: 'sorting',order:'ascending'}">
            <el-table-column
              type="index"
              label="执行顺序"
              width="80">
            </el-table-column>
            <el-table-column
              prop="caseDesc"
              label="用例名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="caseType"
              label="用例类别">
              <template slot-scope="scope">
                <p  v-if="cases[scope.$index].caseType==='1'">接口用例</p>
                <p  v-else>数据库用例</p>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="upCase(scope.row)"
                  type="primary"
                  size="mini">
                  上移
                </el-button>
                <el-button
                  @click.native.prevent="downCase(scope.row)"
                  type="info"
                  size="mini">
                  下移
                </el-button>
                <el-button
                  @click.native.prevent=""
                  type="warning"
                  size="mini">
                  编辑
                </el-button>
                <el-button
                  @click.native.prevent="deleteTestCase(scope.row)"
                  type="danger"
                  size="mini">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="执行环境" name="forth">
        <el-form :model="envInfo"  ref="" label-width="100px" class="demo-ruleForm" style="float: left">
          <el-form-item label="项目" prop="project">
            <el-select v-model="envInfo.project" placeholder="请选择项目">
              <el-option label="百度" value="百度"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" prop="env">
            <el-select v-model="envInfo.env" placeholder="请选择调试环境">
              <el-option label="www.baidu.com" value="www.baidu.com"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
  </el-dialog>
</template>

<script>
    import AddCaseForApi from '@/views/case/AddCaseForApi'

    export default {
        data() {
            return {
                setId:'',
                setName:'',
                activeName: 'first',
                setUpScripts: [
                    {sorting:1,scriptName:"CRM系统登入",scriptType:"接口脚本"},
                    {sorting:2,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:3,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:4,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:5,scriptName:"查询所有项目id",scriptType:"数据库脚本"},
                    {sorting:6,scriptName:"查询所有项目id",scriptType:"数据库脚本"}
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

                ],
                envInfo: {
                  project:'',
                  env:''
                },
            };
        },
        methods:{
            handleClick(tab, event) {
                console.log(tab, event);
            },
            showAddCaseForApi(){
              this.$store.commit("changeAddcaseForApiShow",true);
            },
          getCaseInfo(){
            this.$axios.get('/apis/testcaseset/'+this.setId+'/info').then(res=>{
                if (res.data.code === 200){
                  this.$store.commit('setCaseSetInfo',res.data.data);
                } else {
                  this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                }

              }
            ).catch(err=>{
              this.$notify({title:'操作失败',type:'error',message:err});
            });
          },
          upCase(row){
            let data = new FormData();
            data.append('caseId',row.caseId);
            data.append('move','up');
            this.$axios.put('/apis/testcase/'+row.caseId+'/order',data).then(res=>{
                if (res.data.code === 200){
                  this.$store.commit('setCaseSetInfo',res.data.data);
                  this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                  this.getCaseInfo();
                } else {
                  this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                }

              }
            ).catch(err=>{
              this.$notify({title:'操作失败',type:'error',message:err});
            });
          },
          downCase(row){
            let data = new FormData();
            data.append('caseId',row.caseId);
            data.append('move','down');
            this.$axios.put('/apis/testcase/'+row.caseId+'/order',data).then(res=>{
                if (res.data.code === 200){
                  this.$store.commit('setCaseSetInfo',res.data.data);
                  this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                  this.getCaseInfo();
                } else {
                  this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                }

              }
            ).catch(err=>{
              this.$notify({title:'操作失败',type:'error',message:err});
            });
          },
          deleteTestCase(row){
            this.$confirm('确定要删除吗？').then(_=>{
                this.$axios.delete('/apis/testcase/'+row.caseId).then(res=>{
                  if (res.data.code===200){
                    this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                  } else {
                    this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                  }
                  this.getCaseInfo();
                }).catch(err=>{
                  this.$notify({title:'操作失败',type:'error',message:err});
                });
              }
            );
          }

        },
        computed: {
        },
        components:{
          AddCaseForApi,
        },
        watch:{
          '$store.state.caseSetInfo': function (val) {
            this.setId = val.setId;
            this.setName = val.setName;
            this.cases = val.testCase;
          }
        }
    };
</script>
