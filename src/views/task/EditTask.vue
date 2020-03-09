<template>
  <el-dialog title="更改配置" :visible.sync="$store.state.edittaskshow" style="height: 100%;" :close-on-click-modal="false" :append-to-body="true"
             @close="closeEditTaskView">
    <el-form :model="form" :rules="rules" ref="form" v-loading="loading">
      <el-form-item label="任务名称" :label-width="formLabelWidth" prop="taskName">
        <el-input placeholder="请输入任务名称" v-model="form.taskName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" :label-width="formLabelWidth" prop="taskDesc">
        <el-input placeholder="请输入任务描述" v-model="form.taskDesc" autocomplete="off" type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5}"></el-input>
      </el-form-item>
      <el-form-item label="执行方式" :label-width="formLabelWidth" prop="isParallel" style="text-align: left">
        <el-select v-model="form.isParallel" placeholder="请选择执行方式">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="轮询次数" :label-width="formLabelWidth" prop="times" >
        <el-input placeholder="请输入轮询次数" v-model.number="form.times" autocomplete="off"></el-input>
      </el-form-item>
      <el-dialog title="添加用例集" :visible.sync="addTestSetShow" :append-to-body="true" style="text-align: left" @close="closeAddTestSetShow">
        <el-form :model="form2" :rules="rules2" ref="form2">
          <el-form-item label="用例集" :label-width="formLabelWidth" prop="set">
            <el-select v-model="form2.set" placeholder="请选择用例集" filterable  @change="getEnvsOfSet"  value-key="setId">
              <el-option
                v-for="item in setOptions"
                :key="item.setId"
                :label="item.setName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行环境" :label-width="formLabelWidth" prop="env">
            <el-select v-model="form2.env" placeholder="请选择执行环境" filterable clearable  value-key="envId">
              <el-option
                v-for="item in envOptions"
                :key="item.envId"
                :label="item.envName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSet">添 加</el-button>
          <el-button @click="closeAddTestSetShow">取 消</el-button>
        </div>
      </el-dialog>
      <div style="text-align: left">
        <el-button type="primary" @click="showAddTestSet" >添加用例集</el-button>
        <el-divider content-position="left">用例集列表</el-divider>
        <el-card shadow="hover">
        <el-table
          :data="testSets"
          stripe
          style="width: 100%" height="300">
          <el-table-column
            prop="index"
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="setName"
            label="用例集名称"
            width="400">
          </el-table-column>
          <el-table-column
            prop="envName"
            label="执行环境"
            width="280">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="delSet(scope.$index)" type="danger" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-card>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editTask">保 存</el-button>
      <el-button @click="closeEditTaskView">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>


    export default {
        data() {
            return {
                rules:{
                    taskName:[
                        {required:true,message:'请输入任务名称',trigger:'change'},
                    ],
                    isParallel:[
                        {required:true,message:'执行方式不能为空',trigger:'change'},
                    ],
                    times:[
                        { required:true,message:'请输入轮询次数',trigger:'change'},
                        { type: 'number', message: '轮询次数必须为数字',trigger:'change'}
                    ]
                },
                rules2:{
                    set:[
                        {required:true,message:'请选择用例集',trigger:'change'},
                    ],
                    env:[
                        {required:true,message:'请选择执行环境',trigger:'change'},
                    ]
                },
                options: [{
                    value: 0,
                    label: '串行'
                }, {
                    value: 1,
                    label: '并发'
                }],
                setOptions: [],
                envOptions: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: {
                    taskId:'',
                    taskName:'',
                    taskDesc:'',
                    isParallel:'',
                    times:0
                },
                formLabelWidth: '80px',
                addTestSetShow: false,
                form2: {
                    env:'',
                    set:''
                },
                testSets:[],
                loading: true,
            };
        },
        methods:{
            editTask(){
                const task = {
                    "isTiming": 0,
                    "taskName": this.form.taskName,
                    "taskDesc": this.form.taskDesc,
                    "isParallel": this.form.isParallel,
                    "testSets": JSON.stringify(this.testSets),
                    "times": this.form.times,
                    "taskId": this.form.taskId
                };
                this.$refs['form'].validate(bol=>{
                    if (bol){
                        this.$axios.put('/apis/task/'+this.form.taskId,task).then(res=>{
                            if (res.data.code === 200){
                                this.$notify({
                                    title: '成功',
                                    type:'success',
                                    message:res.data.msg
                                });
                            }else{
                                this.$notify({
                                    title: '失败',
                                    type:'error',
                                    message:res.data.msg
                                });
                            }
                            this.closeEditTaskView();
                            this.$emit('getTasks');
                        }).catch(err=>{
                            this.$notify({
                                title: '失败',
                                type:'error',
                                message:err
                            });
                        });

                    }
                });
            },
            closeEditTaskView(){
                this.loading = true;
                this.$refs['form'].resetFields();
                this.$store.commit('changeEditTaskShow',false);
            },
            showAddTestSet(){
                this.$axios.get('/apis/testcaseset/list').then(res=>{
                        if (res.data.code === 200){
                            res.data.data.forEach((n) =>{
                                this.setOptions.push(
                                    {setName:n.setName,setId:n.setId}
                                );
                            });
                        } else {
                            this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                        }
                    }
                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
                this.addTestSetShow = true;
            },
            getEnvsOfSet(){
                this.envOptions = [];
                this.$axios.get('/apis/testcaseset/'+this.form2.set.setId+'/env').then(res=>{
                        if (res.data.code === 200){
                            res.data.data.forEach((n) =>{
                                this.envOptions.push(
                                    {envName:n.envName,envId:n.envId}
                                );
                            });
                        } else {
                            this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                        }
                    }
                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
            },
            addSet(){
                this.$refs['form2'].validate(bol=>{
                    if (bol){
                        this.testSets.push(
                            {
                                setName:this.form2.set.setName,
                                setId:this.form2.set.setId,
                                envName:this.form2.env.envName,
                                envId:this.form2.env.envId
                            }
                        );
                        this.addTestSetShow = false;
                        this.form2 = {
                            env:'',
                            set:''
                        };
                    }
                });
            },
            delSet(row){
                this.testSets.splice(row,1);
            },
            closeAddTestSetShow(){
                this.$refs['form2'].resetFields();
                this.setOptions = [];
                this.envOptions = [];
                this.form2 = {
                    env:'',
                    set:''
                };
                this.addTestSetShow = false;
            },
        },
        computed: {
        },
        components:{
        },
        watch:{
            "$store.state.taskDetail":function () {
                this.form = this.$store.state.taskDetail;
                this.form.isParallel = parseInt(this.$store.state.taskDetail.isParallel);
                this.testSets = this.form.testSetList;
                this.loading = false;
            }
        }
    };
</script>
