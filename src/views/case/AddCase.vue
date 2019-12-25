<template>
  <el-dialog :visible.sync="$store.state.addcaseshow" style="height: 100%;" :close-on-click-modal="false"
             @close="closeView">
  <div id="caseTest" v-loading="loading">
    <h2 style="text-align: left">添加用例及脚本</h2>
    <h4>用例集：<strong style="color: red;">{{setName}}</strong></h4>
    <div style="text-align: right">
      <el-button type="primary" @click="testCaseSet" >调试</el-button>
    </div>


    <AddCaseForApi @getCaseInfo="getCaseInfo"></AddCaseForApi>
    <EditCaseForApi @getCaseInfo="getCaseInfo"></EditCaseForApi>
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="前/后置脚本添加" name="first" >
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
          </el-collapse-item>
        </el-collapse>
        <div style="text-align: left">
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
    <el-drawer
      title="实时执行记录"
      :visible.sync="drawer"
      :direction="'rtl'"
      size="50%"
      >
      <div style="margin: 20px;display: inline">
        <el-card shadow="always" style="width:40%;height:25%;margin:20px;text-align: left;float: left">
          <div style="margin-bottom: 20px"><strong>执行进度</strong></div>
          <h5>{{executedRate}}%</h5>
          <el-progress  :percentage="executedRate" :show-text="false" status="success" v-if="executedRate===100"></el-progress>
          <el-progress  :percentage="executedRate" :show-text="false" v-else></el-progress>
          <div style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>已执行用例数：{{executeNum}}</span></div>
          <div style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>用例总数：{{caseNum}}</span></div>
        </el-card>
        <el-card shadow="always" style="width:40%;height:25%;margin:20px;text-align: left;float: left">
          <div style="margin-bottom: 20px"><strong>成功率</strong></div>
          <h5>{{successRate}}%</h5>
          <el-progress  :percentage="successRate" :show-text="false" status="success" v-if="successRate===100"></el-progress>
          <el-progress  :percentage="successRate" :show-text="false" v-else-if="successRate<100 && successRate>49"></el-progress>
          <el-progress  :percentage="successRate" :show-text="false" status="exception" v-else></el-progress>
          <div><p style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>成功数：{{success}}</span><span style="margin-left: 60px">失败数：{{error}}</span></p></div>
          <div style="font-size: 8px;font-weight: bold;margin-top: 20px;"><span>用例总数：{{caseNum}}</span></div>
        </el-card>
      </div>
      <el-card shadow="always" style="margin: 20px;float: left;width:100%">
        <el-table
          :data="executedRows"
          stripe height="500"
          style="width: 100%;">
          <el-table-column
            prop="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="caseName"
            label="用例名称"
            width="500">
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
              <el-button type="primary" round icon="el-icon-tickets" size="mini" @click="lookLogs(scope.row.logs)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

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
                executedRows:[],
                executedRate:0,
                successRate:0,
                caseNum:0,
                executeNum:0,
                success:0,
                error:0,
                drawer:false,
                path:"ws://129.204.148.24:8080/temo/websocket/123",
                logpath:"ws://129.204.148.24:8080/temo/websocket/101",
                socket:"",
                logSocket:"",
                setId:'',
                setName:'',
                loading:false,
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
                this.activeNames = ['setup'];
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
            testCaseSet(){
              this.$refs['envInfo'].validate(bol=> {
                if (bol) {
                  let formData = new FormData();
                  formData.append('envId',this.envInfo.env);
                  this.$axios.post('/apis/testcaseset/execute/'+this.setId,formData).then(res=>{
                      if (res.data.code === 200){
                        this.$notify({title:'操作成功',type:'success',message:res.data.msg,position: 'top-left'});
                      } else {
                        this.$notify({title:'操作失败',type:'warning',message:res.data.msg,position: 'top-left'});
                      }

                    }
                  ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err,position: 'top-left'});
                  });
                  this.success=0;
                  this.error=0;
                  this.executeNum=0;
                  this.caseNum=0;
                  this.executedRate = 0;
                  this.successRate = 0;
                  this.executedRows = [];
                  this.drawer = true;
                }else{
                  this.activeName = "forth";
                }
              });
            },
            reset(){
                this.tearDownScripts = [];
                this.setUpScripts = [];
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
            logInit: function(){
              if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
              }else{
                // 实例化socket
                this.logSocket = new WebSocket(this.logpath);
                // 监听socket连接
                this.logSocket.onopen = function () {
                  console.log("logSocket连接成功")
                };
                // 监听socket错误信息
                this.logSocket.onerror = function () {
                  console.log("logSocket连接错误")
                };
                // 监听socket消息
                this.logSocket.onmessage = this.logOnMessage;
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
              let testResult = JSON.parse(msg.data);
              this.executedRate = parseFloat(testResult.executedRate);
              this.successRate = parseFloat(testResult.successRate);
              this.error = testResult.error;
              this.success = testResult.success;
              this.caseNum = testResult.caseNum;
              this.executeNum = testResult.executedNum;
            },
            send: function () {
              this.socket.send(params)
            },
            close: function () {
              console.log("socket已经关闭")
            },
            logOnMessage: function(msg){
                let executedRow = JSON.parse(msg.data);
                console.log(executedRow);
                this.executedRows.push(executedRow);
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
          this.logInit();
        },
        destroyed () {
          // 销毁监听
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
