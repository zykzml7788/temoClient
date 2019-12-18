<template>
  <el-dialog :visible.sync="$store.state.addcaseshow" style="height: 100%;" :close-on-click-modal="false"
             @close="closeView">
  <div id="caseTest">
    <h2 style="text-align: left">添加用例及脚本</h2>
    <h4>用例集：<strong style="color: red;">{{setName}}</strong></h4>
    <el-button type="primary" @click="" style="float: right">调试</el-button>

    <AddCaseForApi @getCaseInfo="getCaseInfo"></AddCaseForApi>
    <EditCaseForApi @getCaseInfo="getCaseInfo"></EditCaseForApi>
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="前/后置脚本添加" name="first" >
        <h3 style="text-align: left">前置脚本列表</h3>
        <div id="setup_script" style="text-align: left">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入脚本名称"
            v-model="setUpScripts"
            :data="scripts"  :titles="['脚本列表','前置脚本列表']">
          </el-transfer>
        </div>
        <div id="teardown_script" style="text-align: left">
          <h3 style="text-align: left">后置脚本列表</h3>
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入脚本名称"
            v-model="tearDownScripts"
            :data="tScripts"  :titles="['脚本列表','后置脚本列表']">
          </el-transfer>
          <el-button type="primary" round style="margin-top: 20px" @click="addSTScript">保存</el-button>
          <el-button type="danger" round style="margin-top: 20px" @click="reset">重置</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用例列表" name="third">
        <div id="cases">
          <h3 style="text-align: left">用例列表</h3>
          <el-button type="primary" style="float: left;margin: 10px;" @click="showAddCaseForApi">添加接口用例</el-button>
          <el-button type="primary" @click="" style="float: left;margin: 10px;">添加数据库用例</el-button>
          <el-table
            :data="cases"
            stripe height="400px" :default-sort="{prop: 'sorting',order:'ascending'}" v-loading="loading">
            <el-table-column
              prop="sorting"
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
                  @click.native.prevent="updateCase(scope.row)"
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
        <el-form :model="envInfo"  :rules="rules" ref="envInfo" label-width="100px" class="demo-ruleForm" style="float: left">
          <el-form-item label="项目" prop="project">
            <el-select v-model="envInfo.project" placeholder="请选择项目" @change="getEnvs">
              <el-option
                v-for="item in projects"
                :key="item.pid"
                :label="item.pname"
                :value="item.pid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" prop="env">
            <el-select v-model="envInfo.env" placeholder="请选择调试环境">
              <el-option
                v-for="item in envs"
                :key="item.envId"
                :label="item.envName"
                :value="item.envId">
              </el-option>
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
    import EditCaseForApi from "@/views/case/EditCaseForApi";
    export default {
        data() {
            return {
                setId:'',
                setName:'',
                loading:false,
                activeName: 'first',
                scripts: [],
                tScripts:[],
                setUpScripts: [],
                tearDownScripts: [],
                stScripts:[],
                tdScripts:[],
                cases: [],
                envInfo: {
                  project:'',
                  env:''
                },
                projects:[],
                envs:[],
                rules:{
                    project:[
                        {required:true,message:'请选择项目',trigger:'blur'},
                    ],
                    env:[
                        {required:true,message:'请选择环境',trigger:'blur'},
                    ],
                },
                filterMethod(query, item) {
                    return  item.label.indexOf(query)!==-1;
                }
            };
        },
        methods:{
            handleClick(tab, event) {
                console.log(tab, event);
            },
            showAddCaseForApi(){
              this.$store.commit("changeAddcaseForApiShow",true);
            },
            getScripts(){
                this.$axios.get('/apis/script/list').then(res=>{
                    res.data.data.forEach(n => {
                        this.scripts.push({
                            key:n.scriptId,
                            label:n.scriptName,
                        });
                        this.tScripts.push({
                            key:n.scriptId,
                            label:n.scriptName,
                        });
                        this.stScripts.push(
                            {
                                exScriptId: n.scriptId,
                                exScriptType: "0",
                                stScriptType: "1"
                            }
                        );
                        this.tdScripts.push(
                            {
                                exScriptId: n.scriptId,
                                exScriptType: "0",
                                stScriptType: "2"
                            }
                        );

                    });

                });
                this.$axios.get('/apis/testcaseset/list').then(res=>{
                    res.data.data.forEach(n => {this.scripts.push({
                        key:n.setId,
                        label:n.setName,
                    });
                        this.tScripts.push({
                            key:n.setId,
                            label:n.setName,
                        });
                        this.stScripts.push(
                            {
                                exScriptId: n.setId,
                                exScriptType: "1",
                                stScriptType: "1"
                            }
                        );
                        this.tdScripts.push(
                            {
                                exScriptId: n.setId,
                                exScriptType: "1",
                                stScriptType: "2"
                            }
                        );


                    });


                });
            },
          getCaseInfo(){
              this.loading=true;
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
              this.loading=false;
          },
            updateCase(row){
                this.$axios.get('/apis/testcase/'+row.caseId+'/info').then(res=>{
                    this.$store.commit('setCaseInfo',res.data.data);
                    this.$store.commit('changeEditcaseForApiShow',true);
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
          },
            getProjects(){
                this.$axios.get('/apis/project/list').then(res=> {
                    this.projects = res.data.data;
                }).catch(err=>{
                    this.$notify({
                        title: '失败',
                        type:'error',
                        message:err
                    });
                });
            },
            getEnvs(){
                this.envInfo.env = '';
                this.$axios.get('/apis/project/env/?projectId='+this.envInfo.project).then(res=>{
                        if (res.data.code === 200){
                            this.envs = res.data.data;
                        } else {
                            this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                        }

                    }
                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
            },
            closeView(){
                this.$refs['envInfo'].resetFields();
                this.envs = [];
                this.envInfo = {
                    project:'',
                    env:''
                };
                this.activeName = 'first';
                this.setUpScripts = [];
                this.tearDownScripts = [];
                this.tScripts = [];
                this.scripts = [];
                this.getScripts();
            },
            addSTScript(){
                let body = {
                    setId: this.setId,
                    stScriptRequests:  []
                };
                this.setUpScripts.forEach(n => {
                   const script = this.stScripts.filter(m => m.exScriptId === n)[0];
                   script.sorting = this.setUpScripts.indexOf(n);
                   script.setId = this.setId;
                   body.stScriptRequests.push(script);
                });
                this.tearDownScripts.forEach(n => {
                    const script = this.tdScripts.filter(m => m.exScriptId === n)[0];
                    script.sorting = this.tearDownScripts.indexOf(n);
                    script.setId = this.setId;
                    body.stScriptRequests.push(script);
                });
                this.$axios.post('/apis/testcaseset/stScript',body).then(res=>{
                        if (res.data.code === 200){
                            this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                        } else {
                            this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                        }

                    }
                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
            },
            reset(){
                this.tearDownScripts = [];
                this.setUpScripts = [];
            }
        },
        created(){
          this.getProjects();
          this.getScripts();
        },
        computed: {
        },
        components:{
            AddCaseForApi,
            EditCaseForApi,
        },
        watch:{
          '$store.state.caseSetInfo': function (val) {
            this.setId = val.setId;
            this.setName = val.setName;
            this.cases = val.testCase;
            for (const index in val.stScript){
                if (val.stScript[index].stScriptType === "1"){
                    this.setUpScripts.push(
                        val.stScript[index].exScriptId
                    );
                    // this.scripts.splice(this.scripts.indexOf(this.scripts.filter(n => n.key === val.stScript[index].stScriptId)[0]),1);
                }else{
                    this.tearDownScripts.push(
                        val.stScript[index].exScriptId
                    );
                    // this.tScripts.splice(this.scripts.indexOf(this.scripts.filter(n => n.key === val.stScript[index].stScriptId)[0]),1);
                }
            }
          }
        }
    };
</script>
