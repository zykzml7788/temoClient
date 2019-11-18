<template>
  <el-dialog title="编辑数据库脚本" :visible.sync="$store.state.editscriptshow" style="height: 100%" width="60%" :close-on-click-modal="false"
             @close="closeEditScriptView">
    <el-form :model="form" :rules="rules" ref="form" style="text-align: left">

      <el-form-item label="数据库" :label-width="formLabelWidth" prop="dbId">
        <el-select v-model="form.dbId" filterable placeholder="请选择数据源">
          <el-option
            v-for="item in dbOptions"
            :label="item.dbName"
            :value="item.dbId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="脚本名称" :label-width="formLabelWidth" prop="scriptName">
        <el-input placeholder="请输入脚本名称" v-model="form.scriptName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(sql, index) in sqls"
        :label="'sql' + (index+1)"
      >
        <span><el-input v-model="sql.value" style="width: 70%;"></el-input></span>
        <span v-if="index!==0"><el-button @click.prevent="removeSql(sql)">删除</el-button></span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editScript">保 存</el-button>
      <el-button type="primary" @click="testScript">调 试</el-button>
      <el-button @click="addSql">新增sql</el-button>
      <el-button @click="closeEditScriptView">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>


    export default {
        data() {
            return {
                loading:'',
                sqlValue:'',
                rules:{
                    dbId:[
                        {required:true,message:'请选择数据库',trigger:'blur'},
                    ],
                    sqlValue:[
                        { required: true, message: 'sql不能为空', trigger: 'blur'
                        }],
                    scriptName:[
                        {required:true,message:'脚本名称不能为空',trigger:'blur'},
                    ]
                },
                dialogTableVisible: false,
                dialogFormVisible: false,
                dbOptions:[],
                sqls: [],
                form: {
                    scriptId:'',
                    scriptName:'',
                    dbId:'',
                    sqlScript:''
                },
                formLabelWidth: '80px',
            };
        },
        methods:{
            getDataBases(){
                this.$axios.get('/apis/database/').then(res=>{
                    if (res.data.code === 200){
                        this.dbOptions = res.data.data;
                    } else {
                        this.$message({type:'warning',message:res.data.msg});
                    }
                    this.loading = false;
                }).catch(err=>{
                    this.$message({type:'error',message:err});
                });
            },
            editScript(){
              const sqlValue = [];
              const sqls = this.sqls;
              for (let index in sqls){
                sqlValue.push(sqls[index].value);
              }
                const script = {
                    "dbId": this.form.dbId,
                    "scriptId": this.form.scriptId,
                    "scriptName": this.form.scriptName,
                    "sqlScript": sqlValue.join("$")
                };
                this.$refs['form'].validate(bol=>{
                    if (bol){
                        this.$axios.put('/apis/script/'+this.form.scriptId,script).then(res=>{
                            if (res.data.code === 200){
                                this.$message({
                                    type:'success',
                                    message:res.data.msg
                                });
                                this.closeEditScriptView();
                                this.$emit('getScripts');
                            }else{
                                this.$message({
                                    type:'error',
                                    message:res.data.msg
                                });
                            }
                        }).catch(err=>{
                            this.$message({
                                type:'error',
                                message:err
                            });
                        });

                    }
                });
            },
            testScript(){
                const sqlValue = [];
                const sqls = this.sqls;
                for (let index in sqls){
                    sqlValue.push(sqls[index].value);
                }

                const script = {
                    "dbId": this.form.dbId,
                    "scriptName": this.form.scriptName,
                    "sqlScript": sqlValue.join("$")
                };
                this.$refs['form'].validate(bol=>{
                    if (bol){
                        this.$axios.post('/apis/sqlExecute/',script).then(res=>{
                            if (res.data.code === 200){
                                this.$message({
                                    type:'success',
                                    message:res.data.msg+"本次共执行"+res.data.data.total+"条sql,全部成功！"
                                });
                            }else {
                                let errorMsg = [];
                                res.data.data.errorList.forEach(v=>{errorMsg.push("【错误SQL:"+v.sql+",错误信息:"+v.errMsg+"】");
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    duration: 10000,
                                    message: "SQL调试出现异常！本次共执行"+res.data.data.total+"条sql,失败"+res.data.data.error+"条"+errorMsg.join(" \n ")
                                    })
                                });
                            }
                        }).catch(err=>{
                            this.$message({
                                type:'error',
                                message:err
                            });
                        });

                    }
                });
            },
            closeEditScriptView(){
                this.$refs['form'].resetFields();
                this.$store.commit('changeEditScriptShow',false);
                this.form = {
                    scriptName:'',
                    dbId:''
                };
                this.sqls = [];
            },
            removeSql(item) {
                const index = this.sqls.indexOf(item);
                if (index !== -1) {
                    this.sqls.splice(index, 1);
                    console.log(this.sqls);
                }
            },
            addSql() {
                this.sqls.push({
                    value: '',
                    key: Date.now()
                });
            },

        },
        computed: {
        },
        watch:{
            "$store.state.scriptDetail":function () {
                this.form.scriptId = this.$store.state.scriptDetail.scriptId;
                this.form.sqlScript = this.$store.state.scriptDetail.sqlScript;
                this.form.dbId = this.$store.state.scriptDetail.dbId;
                this.form.scriptName = this.$store.state.scriptDetail.scriptName;
                let sqls = this.$store.state.scriptDetail.sqlScript.split("$");
                for (let index in sqls){
                    this.sqls.push({"key":Date.now(),"value":sqls[index]})
                }
            }
        },
        components:{

        },
        created() {
            this.getDataBases();
        }
    };
</script>
