<template>
  <el-dialog title="编辑数据源配置" :visible.sync="$store.state.editdatabaseshow" style="height: 100%;" :close-on-click-modal="false"
             @close="closeEditDatabaseView">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="数据源名" :label-width="formLabelWidth" prop="dbName">
        <el-input placeholder="请输入数据源名" v-model="form.dbName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="数据库" :label-width="formLabelWidth" prop="dbLibraryName">
        <el-input placeholder="请输入数据库" v-model="form.dbLibraryName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="主机域名" :label-width="formLabelWidth" prop="host">
        <el-input placeholder="请输入主机域名" v-model="form.host" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="端口号" :label-width="formLabelWidth" prop="port" type="number">
        <el-input  placeholder="请输入端口号" v-model.number="form.port" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号" :label-width="formLabelWidth" prop="user">
        <el-input placeholder="请输入数据库账号" v-model="form.user" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
        <el-input placeholder="请输入数据库密码" v-model="form.pwd" show-password></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editDataBase">确 定</el-button>
      <el-button @click="closeEditDatabaseView">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>


    export default {
        data() {
            return {
                rules:{
                    dbName:[
                        {required:true,message:'请输入数据源名称',trigger:'blur'},
                    ],
                    dbLibraryName:[
                        {required:true,message:'请输入数据库名称',trigger:'blur'},
                    ],
                    host:[
                        {required:true,message:'域名不能为空',trigger:'blur'},
                    ],
                    port:[
                        {required:true,message:'端口号不能为空',trigger:'blur'},
                        { type: 'number', message: '端口号必须为数字',trigger: 'blur'}
                    ],
                    user:[
                        {required:true,message:'请输入数据库账号',trigger:'blur'},
                    ],
                    pwd:[
                        {required:true,message:'请输入数据库密码',trigger:'blur'},
                    ]

                },
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: {},
                formLabelWidth: '80px',
            };
        },
        methods:{
            editDataBase(){
                const database = {
                    "dbId": this.form.dbId,
                    "dbName": this.form.dbName,
                    "dbLibraryName": this.form.dbLibraryName,
                    "host": this.form.host,
                    "port": this.form.port,
                    "user": this.form.user,
                    "pwd": this.form.pwd
                };
                this.$refs['form'].validate(bol=>{
                    if (bol){
                        this.$axios.put('/apis/database/'+database.dbId,database).then(res=>{
                            this.$message({
                                type:'success',
                                message:res.data.msg
                            });
                            this.$emit('getDataBases');
                            this.closeEditDatabaseView();
                        }).catch(err=>{
                            this.$message({
                                type:'error',
                                message:err
                            });
                        });

                    }
                });
            },
            closeEditDatabaseView(){
                this.$store.commit('changeEditDataBaseShow',false);
                this.$refs['form'].resetFields();

            }
        },
        watch: {
            "$store.state.databaseDetail":function () {
                this.form = this.$store.state.databaseDetail;
            }
        },
    };
</script>
