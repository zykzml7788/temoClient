<template>
  <el-dialog title="新增数据库脚本" :visible.sync="$store.state.addscriptshow" style="height: 100%" width="60%" :close-on-click-modal="false"
             @close="closeAddScriptView">
    <el-form :model="form" :rules="rules" ref="form" style="text-align: left">

      <el-form-item label="数据源" :label-width="formLabelWidth" prop="dbId">
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
      <Code :mime="'sql'"  v-model="sqls"></Code>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addScript">保 存</el-button>
      <el-button type="success" @click="testScript">调 试</el-button>
      <el-button @click="closeAddScriptView">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>

    import Code from '@/common/component/codeView/Code.vue'

    export default {
        data() {
            return {
                loading:'',
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
                sqls: '',
                form: {
                    scriptName:'',
                    dbId:''
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
                        this.$notify({type:'warning',message:res.data.msg});
                    }
                    this.loading = false;
                }).catch(err=>{
                    this.$notify({type:'error',message:err});
                });
            },
            addScript(){
                let sqls = [];
                this.sqls.replace(/\n/g,"").split(";").forEach(n=>{
                  if (n!==''){
                    sqls.push(
                      {
                        script: n.replace(/(^\s+)|(\s+$)/g,""),
                        saveParam: true
                      }
                    )
                  }
                });
                const script = {
                    "dbId": this.form.dbId,
                    "scriptName": this.form.scriptName,
                    "sqlScript": JSON.stringify(sqls)
                };
                this.$refs['form'].validate(bol=>{
                    if (bol){
                        this.$axios.post('/apis/script/',script).then(res=>{
                            if (res.data.code === 200){
                                this.$notify({
                                    title: '成功',
                                    type:'success',
                                    message:res.data.msg
                                });
                                this.closeAddScriptView();
                                this.$emit('getScripts');
                            }else{
                                this.$notify({
                                    title: '失败',
                                    type:'error',
                                    message:res.data.msg
                                });
                            }
                        }).catch(err=>{
                            this.$notify({
                                type:'error',
                                message:err
                            });
                        });

                    }
                });
            },
            testScript(){
                let sqls = [];
                this.sqls.replace(/\n/g,"").split(";").forEach(n=>{
                  if (n!==''){
                    sqls.push(
                      {
                        script: n.replace(/(^\s+)|(\s+$)/g,""),
                        saveParam: true
                      }
                    )
                  }
                });
                const script = {
                    "dbId": this.form.dbId,
                    "scriptName": this.form.scriptName,
                    "sqlScript": JSON.stringify(sqls)
                };
                this.$refs['form'].validate(bol=>{
                    if (bol){
                        this.$axios.post('/apis/sqlExecute/',script).then(res=>{
                            if (res.data.code === 200){
                                this.$notify({
                                    title: '调试成功',
                                    type:'success',
                                    message:res.data.msg+"本次共执行"+res.data.data.total+"条sql,全部成功！"
                                });
                            }else {
                                // let errorMsg = [];
                                // res.data.data.errorList.forEach(v=>{errorMsg.push("【错误SQL:"+v.sql+",错误信息:"+v.errMsg+"】"));
                                    this.$notify({
                                        title: '调试失败',
                                        type: 'error',
                                        showClose: true,
                                        duration: 10000,
                                        dangerouslyUseHTMLString: true,
                                        message: "SQL调试出现异常！本次共执行"+res.data.data.total+"条sql,失败"+res.data.data.error+"条,详情请查看" +
                                        "<strong style='color: indianred'>NetWork</strong>"
                                    });
                            }
                        })

                    }
                });
            },
            closeAddScriptView(){
                this.$refs['form'].resetFields();
                this.$store.commit('changeAddScriptShow',false);
                this.form = {
                    scriptName:'',
                    dbId:''
                };
                this.sqls = ''
            },

        },
        computed: {
        },
        components:{
          Code
        },
        created() {
            this.getDataBases();
        }
    };
</script>
