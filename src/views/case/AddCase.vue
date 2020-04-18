<template>
  <el-dialog :visible.sync="$store.state.addcaseshow" style="height: 100%" :close-on-click-modal="false"
             @close="closeView" width="80%">

  <div id="caseTest" v-loading="setName === ''" >
    <el-card shadow="hover" style="margin-bottom: 30px">
    <h2>用例集：<strong style="color: crimson;">{{setName}}</strong></h2>
    <div style="text-align: right">
      <el-button type="primary" @click="testCaseSet" round icon="el-icon-caret-right">调试</el-button>
      <el-button type="primary" @click="drawer=true" round>实时结果</el-button>
    </div>
    </el-card>



    <AddCaseForApi @getCaseInfo="getCaseInfo"></AddCaseForApi>
    <EditCaseForApi @getCaseInfo="getCaseInfo"></EditCaseForApi>
    <el-card shadow="hover">
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="前/后置脚本添加" name="first" style="text-align: left">
        <h3>脚本列表</h3>
        <el-collapse v-model="activeNames"  accordion>
          <el-collapse-item title="前置脚本" name="setup">
            <div id="setup_script" style="text-align: left">
              <el-transfer
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入脚本名称"
                v-model="setUpScripts"
                :data="scripts"  :titles="['脚本列表','前置脚本列表']">
              </el-transfer>
              <div style="text-align: left">
                <el-button type="primary" round style="margin-top: 20px" @click="saveSetupScript">保存</el-button>
                <el-button type="danger" round style="margin-top: 20px" @click="resetSetUp">重置</el-button>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="后置脚本" name="teardown">
            <div id="teardown_script" style="text-align: left">
              <el-transfer
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入脚本名称"
                v-model="tearDownScripts"
                :data="tScripts"  :titles="['脚本列表','后置脚本列表']">
              </el-transfer>
            </div>
            <div style="text-align: left">
              <el-button type="primary" round style="margin-top: 20px" @click="saveteardownScript">保存</el-button>
              <el-button type="danger" round style="margin-top: 20px" @click="resetTearDown">重置</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>

      </el-tab-pane>
      <el-tab-pane label="用例列表" name="third">
        <div id="cases">
          <h3 style="text-align: left">用例列表</h3>
          <el-button type="primary" style="float: left;margin: 10px;" @click="showAddCaseForApi">添加接口用例</el-button>
          <el-button type="primary" @click="" style="float: left;margin: 10px;">添加数据库用例</el-button>
          <el-table
            :data="cases"
            stripe height="500px" :default-sort="{prop: 'sorting',order:'ascending'}" v-loading="loading" style="float: left">
            <el-table-column
              prop="sorting"
              label="执行顺序"
              width="80">
            </el-table-column>
            <el-table-column
              prop="caseDesc"
              label="用例名称"
              width="450">
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
              width="400">
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
                  @click.native.prevent="copyTestCase(scope.row)"
                  type="warning"
                  size="mini">
                  复制
                </el-button>
                <el-button
                  @click.native.prevent="updateCase(scope.row)"
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
      <el-tab-pane label="执行环境" name="forth" style="text-align: left">
        <h3>调试环境</h3>
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
    </el-card>
  </div>
    <el-drawer
      title="实时执行记录"
      :visible.sync="drawer"
      :direction="'rtl'"
      size="80%"
      >
      <div style="margin: 10px;display: inline">
        <el-card shadow="always" style="width:45%;height:30%;margin:10px;text-align: left;float: left">
          <div style="margin-bottom: 20px"><strong>执行进度</strong></div>
          <h5>{{executedRate}}%</h5>
          <el-progress  :percentage="executedRate" :show-text="false" status="success" v-if="executedRate===100"></el-progress>
          <el-progress  :percentage="executedRate" :show-text="false" v-else></el-progress>
          <div style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>已执行用例数：{{executeNum}}</span></div>
          <div style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>用例总数：{{caseNum}}</span></div>
        </el-card>
        <el-card shadow="always" style="width:45%;height:30%;margin:10px;text-align: left;float: left">
          <div style="margin-bottom: 20px"><strong>成功率</strong></div>
          <h5>{{successRate}}%</h5>
          <el-progress  :percentage="successRate" :show-text="false" status="success" v-if="error===0"></el-progress>
          <el-progress  :percentage="successRate" :show-text="false" status="exception" v-else></el-progress>
          <div><p style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>成功数：{{success}}</span><span style="margin-left: 60px">失败数：{{error}}</span></p></div>
          <div style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>用例总数：{{caseNum}}</span></div>
        </el-card>
      </div>
      <div style="height: auto;display: inline">
        <el-card shadow="always" style="margin: 10px;width:45%;float: left">
          <h4>前置脚本</h4>
          <el-table
            :data="setUpResult"
            stripe height="300"
            style="width: 100%;">
            <el-table-column
              type="index"
              width="50"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="scriptName"
              label="脚本名称"
              width="200">
            </el-table-column>
            <el-table-column
              prop="success"
              label="状态"
              width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.success" type="success">成功</el-tag>
                <el-tag v-else type="danger">失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-s-claim" round size="mini" @click="fixScript(scope.row)">fix</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="always" style="margin: 10px;width:45%;float: left">
          <h4>测试步骤</h4>
          <el-table
            :data="executedRows"
            stripe height="300"
            style="width: 100%;">
            <el-table-column
              prop="index"
              label="序号"
              width="60">
            </el-table-column>
            <el-table-column
              prop="caseName"
              label="用例名称"
              width="200">
            </el-table-column>
            <el-table-column
              prop="status"
              label="执行状态"
              width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" type="success">成功</el-tag>
                <el-tag v-else type="danger">失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="logs"
              label="日志"
              width="100">
              <template slot-scope="scope">
                <el-button type="primary" round icon="el-icon-tickets" size="mini" @click="lookLogs(scope.row.logs)">detail</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-drawer>
      <el-dialog
        title="日志详情"
        :visible.sync="logView"
        width="60%"
        :append-to-body="true">
        <div v-html="logs" style="">

        </div>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="logView = false">确 定</el-button>
    </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import AddCaseForApi from '@/views/case/AddCaseForApi'
  import EditCaseForApi from "@/views/case/EditCaseForApi";

  export default {
        data() {
            return {
                logs:'',
                logView:false,
                setUpResult:[],
                executedRows:[],
                executedRate:0,
                successRate:0,
                caseNum:0,
                executeNum:0,
                success:0,
                error:0,
                drawer:false,
                path:this.$websockerUrl+JSON.parse(localStorage.getItem("userInfo")).userId,
                socket:"",
                logSocket:"",
                setId:'',
                setName:'',
                loading:true,
                activeNames: ['setup'],
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
                        {required:true,message:'请选择项目',trigger:'change'},
                    ],
                    env:[
                        {required:true,message:'请选择环境',trigger:'change'},
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
                this.loading = true;
                this.$axios.get('/apis/script/list').then(res=>{
                    res.data.data.forEach(n => {
                        this.scripts.push({
                            key:n.scriptId,
                            label:n.scriptName+"(DB)",
                        });
                        this.tScripts.push({
                            key:n.scriptId,
                            label:n.scriptName+"(DB)",
                        });
                        this.stScripts.push(
                            {
                                scriptId: n.scriptId,
                                scriptType: 'DB'
                            }
                        );
                        this.tdScripts.push(
                            {
                                scriptId: n.scriptId,
                                scriptType: 'DB'
                            }
                        );

                    });

                });
                this.$axios.get('/apis/testcaseset/list').then((res) => {
                    res.data.data.forEach((n) => {
                        this.scripts.push({
                            key:n.setId,
                            label:n.setName+"(SET)",
                            // disabled: n.setId === this.setId
                        });
                        this.tScripts.push({
                            key:n.setId,
                            label:n.setName+"(SET)",
                            // disabled: n.setId === this.setId
                        });
                        this.stScripts.push(
                            {
                                scriptId: n.setId,
                                scriptType: 'SET'
                            }
                        );
                        this.tdScripts.push(
                            {
                                scriptId: n.setId,
                                scriptType: 'SET'
                            }
                        );
                    });


                });
              this.loading = false;
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
            let setName = this.setName;
            this.setName = "";
            this.$axios.put('/apis/testcase/'+row.caseId+'/order',data).then(res=>{
                if (res.data.code === 200){
                  this.$store.commit('setCaseSetInfo',res.data.data);
                  this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                  this.getCaseInfo();
                } else {
                  this.setName = setName;
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
            let setName = this.setName;
            this.setName = "";
            this.$axios.put('/apis/testcase/'+row.caseId+'/order',data).then(res=>{
                if (res.data.code === 200){
                  this.$store.commit('setCaseSetInfo',res.data.data);
                  this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                  this.getCaseInfo();
                } else {
                  this.setName = setName;
                  this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                }

              }
            ).catch(err=>{
              this.$notify({title:'操作失败',type:'error',message:err});
            });
          },
          copyTestCase(row){
            this.$confirm('确定要复制吗？').then(_=>{
                this.$axios.post('/apis/testcase/copyTestCase/'+row.caseId).then(res=>{
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
                this.setName = '';
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
                this.stScripts = [];
                this.tdScripts = [];
                this.activeNames = ['setup'];
                this.clearLog();
                this.getScripts();
            },
            saveSetupScript(){
                let body = [];
                console.log(this.stScripts);
                for (const i in this.setUpScripts){
                    for (const j in this.stScripts){
                        if (this.setUpScripts[i] === this.stScripts[j].scriptId){
                            console.log(this.stScripts[j].scriptId);
                            body.push(this.stScripts[j]);
                        }
                    }
                }
                let formData = new FormData();
                formData.append("setupScript",JSON.stringify(body));
                this.$axios.put('/apis/testcaseset/setup/'+this.setId,formData).then(res=>{
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
            saveteardownScript(){
                let body = [];
                for (const i in this.tearDownScripts){
                    for (const j in this.tdScripts){
                        if (this.tearDownScripts[i] === this.tdScripts[j].scriptId){
                            body.push(this.tdScripts[j]);
                        }
                    }
                }
                let formData = new FormData();
                formData.append("teardownScript",JSON.stringify(body));
                this.$axios.put('/apis/testcaseset/teardown/'+this.setId,formData).then(res=>{
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
            testCaseSet(){
              this.$refs['envInfo'].validate(bol=> {
                if (bol) {
                  let formData = new FormData();
                  formData.append('envId',this.envInfo.env);
                  this.$axios.post('/apis/testcaseset/execute/'+this.setId,formData).then(res=>{
                      if (res.data.code === 200){
                      } else {
                        this.$notify({title:'操作失败',type:'warning',message:res.data.msg,position: 'top-left'});
                      }

                    }
                  ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err,position: 'top-left'});
                  });
                  this.clearLog();
                  this.drawer = true;
                }else{
                  this.activeName = "forth";
                }
              });
            },
            fixScript(row){
              this.drawer = false;
              this.closeView();
              this.$store.commit('changeAddCaseShow',false);
              this.$emit("addCase",row.scriptId);
            },
            clearLog(){
              this.success=0;
              this.error=0;
              this.executeNum=0;
              this.caseNum=0;
              this.executedRate = 0;
              this.successRate = 0;
              this.setUpResult = [];
              this.executedRows = [];
            },
            resetSetUp(){
                this.setUpScripts = [];
            },
            resetTearDown(){
                this.tearDownScripts = [];
            },
            init: function () {
              if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
              }else{
                // 实例化socket
                this.socket = new WebSocket(this.path);
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                this.socket.onerror = this.error;
                // 监听socket消息
                this.socket.onmessage = this.getMessage;
              }
            },
            open: function () {
              console.log("socket连接成功")
            },
            error: function () {
              console.log("连接错误")
            },
            getMessage: function (msg) {
              console.log(msg.data);
              let message = JSON.parse(msg.data);
              if (message.type === "executedRow"){
                  this.executedRows.push(message);
              }
              if (message.type === "testResult"){
                  this.executedRate = parseFloat(message.executedRate);
                  this.successRate = parseFloat(message.successRate);
                  this.error = message.error;
                  this.success = message.success;
                  this.caseNum = message.caseNum;
                  this.executeNum = message.executedNum;
              }
              if (message.type === "setUpResult"){
                  this.setUpResult.push(message);
              }


            },
            send: function () {
              this.socket.send(params)
            },
            close: function () {
              console.log("socket已经关闭")
            },
            lookLogs(logs){
              this.logs = logs.replace(/\n/g, "<br/>");
              this.logView = true;
            }
            },

        created(){
          this.getProjects();
          this.getScripts();
        },
        mounted(){
          this.init();
        },
        destroyed () {
          // 销毁监听d
          this.socket.onclose = this.close;
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
            if (val.setupScript!==null){
                JSON.parse(val.setupScript).forEach(n=>{
                    this.setUpScripts.push(n.scriptId);
                });
            }
            if (val.teardownScript!==null){
                JSON.parse(val.teardownScript).forEach(n=>{
                    this.tearDownScripts.push(n.scriptId);
                });
            }
          }
        }
    };
</script>
