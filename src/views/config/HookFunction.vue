<template>

  <div id="hook">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配置管理</el-breadcrumb-item>
      <el-breadcrumb-item>Hook函数</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-button type="primary" @click="showHook('add','')">新增Hook函数</el-button>
      </span>
    </div>

    <el-table
      :data="dingLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="800" :default-sort="{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../../static/img/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        fixed="left"
        prop="webhook"
        label="webhook"
        width="500">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        width="400">
      </el-table-column>
      <el-table-column
        prop="keysWord"
        label="keyWord"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <div style="margin-bottom: 10px;">
            <el-button
              @click.native.prevent="openTest(scope.row.descId)"
              size="mini"
              type="success">
              调试
            </el-button>
            <el-button
              @click.native.prevent="showDing('edit',scope.row.descId)"
              size="mini">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteDing(scope.row.descId)"
              size="mini"
              type="danger">
              删除
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dingShow" @close="closeDing">
      <el-form :model="form" :rules="rules" ref="form" style="text-align: left">
        <el-form-item label="hookName" :label-width="formLabelWidth" prop="funcName">
          <el-input placeholder="请输入hookName" v-model="form.funcName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="hook函数说明" :label-width="formLabelWidth" prop="funcDescribe">
          <el-input placeholder="请输入函数说明" v-model="form.funcDescribe" autocomplete="off" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"></el-input>
        </el-form-item>
        <el-form-item label="脚本语言类型" :label-width="formLabelWidth" prop="funcLang">
          <el-select v-model="form.funcLang" placeholder="请选择脚本语言类型">
            <el-option label="python" value="python"></el-option>
            <el-option label="javascript" value="javascript"></el-option>
            <el-option label="groovy" value="groovy"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="code" :label-width="formLabelWidth" prop="funcScript">
          <Code :mime="form.funcLang" :value="form.funcScript"></Code>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDing(button)">保 存</el-button>
        <el-button type="success" @click="saveDing(button)">调 试</el-button>
        <el-button @click="closeDing">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="机器人调试" :visible.sync="testShow" @close="closeTestDing">
      <el-form :model="form2" :rules="rules2" ref="form2">
        <el-form-item label="消息内容" :label-width="formLabelWidth" prop="content">
          <el-input placeholder="请输入消息内容" v-model="form2.content" autocomplete="off" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"></el-input>
        </el-form-item>
        <el-form-item label="需要@的手机号" :label-width="formLabelWidth" prop="atMobiles">
          <el-input placeholder="请输入需要@的手机号(多个手机号用英文分号隔开)" v-model="form2.atMobiles" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否@全部" :label-width="formLabelWidth" prop="isAtAll" style="text-align: left">
          <el-switch
            v-model="form2.isAtAll"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="testDing">发 送</el-button>
        <el-button @click="closeTestDing">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import Code from '@/common/component/codeView/Code.vue'


  export default {

    name:'TaskResult',
    methods: {
      showHook(type,id){
        this.dialogTitle = (type==='add'?"新增":"编辑")+"Hook函数";
        this.button = type;
        if (type==='edit'){
          this.$axios.get('/apis/Dingding/'+id).then(res=>{
              if (res.data.code === 200){
                this.form = {
                  descId: res.data.data.descId,
                  desc: res.data.data.desc,
                  webhook: res.data.data.webhook,
                  keysWord: res.data.data.keysWord
                };
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
              this.loading = false;
            }

          ).catch(err=>{
            this.$notify({title:'操作失败',type:'error',message:err});
          });
        }
        this.dingShow = true;
      },
      openTest(id){
        this.testShow = true;
        this.$axios.get('/apis/Dingding/'+id).then(res=>{
            if (res.data.code === 200){
              this.dingId = res.data.data.descId;
            } else {
              this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
            }
            this.loading = false;
          }
        ).catch(err=>{
          this.$notify({title:'操作失败',type:'error',message:err});
        });
      },
      testDing(){
        let body = {
          isAtAll: this.form2.isAtAll,
          content: this.form2.content,
          atMobiles: this.form2.atMobiles.split(";")
        };
        this.$refs['form2'].validate(bol=>{
          if (bol){
            this.$axios.post('/apis/Dingding/sendText/'+this.dingId,body).then(res=>{
              if (res.data.code === 200){
                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
              this.loading = false;
            });
          }
        });

      },
      closeDing(){
        this.$refs['form'].resetFields();
        this.dingShow = false;
      },
      closeTestDing(){
        this.$refs['form2'].resetFields();
        this.testShow = false;
      },
      getDings(){
        this.loading = true;
        this.$axios.get('/apis/Dingding/list').then(res=>{
            if (res.data.code === 200){
              this.dingLists = res.data.data;
            } else {
              this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
            }
            this.loading = false;
          }

        ).catch(err=>{
          this.$notify({title:'操作失败',type:'error',message:err});
        });
      },
      saveDing(type){
        if (type==='add'){
          this.$refs['form'].validate(bol=>{
            if (bol){
              this.$axios.post('/apis/Dingding/',this.form).then(res=>{
                  if (res.data.code === 200){
                    this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                    this.closeDing();
                    this.getDings();
                  } else {
                    this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                  }
                  this.loading = false;
                }

              ).catch(err=>{
                this.$notify({title:'操作失败',type:'error',message:err});
              });
            }
          });

        } else {
          this.$refs['form'].validate(bol=>{
            if (bol){
              this.$axios.put('/apis/Dingding/update/',this.form).then(res=>{
                  if (res.data.code === 200){
                    this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                    this.closeDing();
                    this.getDings();
                  } else {
                    this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                  }
                  this.loading = false;
                }

              ).catch(err=>{
                this.$notify({title:'操作失败',type:'error',message:err});
              });
            }
          });

        }

      },
      deleteDing(id){
        this.$confirm('确定要删除吗？').then(_=>{
            this.$axios.delete('/apis/Dingding/'+id).then(res=>{
              if (res.data.code===200){
                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
              this.getDings();
            }).catch(err=>{
              this.$notify({title:'操作失败',type:'error',message:err});
            });
          }
        )
      }
    },
    data() {
      return {
        code:'',
        mime: '',
        dingId:'',
        dialogTitle: '',
        button: '',
        testShow:false,
        rules:{
          funcName:[
            {required:true,message:'请输入hookName',trigger:'change'},
          ],
          funcScript:[
            {required:true,message:'请输入code',trigger:'change'},
          ],
          funcLang:[
            {required:true,message:'请选择语言类型',trigger:'change'},
          ]
        },
        rules2:{
          content:[
            {required:true,message:'请输入消息内容',trigger:'change'},
          ]
        },
        page:1,
        total: 0,
        search_val:'',
        projects:[],
        dingLists: [],
        status:'',
        loading: false,
        items: [
          '','success','info','danger','warning'
        ],
        dialogVisible: false,
        dingShow:false,
        form: {
          funcName:'',
          funcLang:'',
          funcDescribe:'',
          funcParams:'',
          funcScript:'',
          isShare:''
        },
        form2: {
          isAtAll: false,
          content: '',
          atMobiles: ''
        },
        formLabelWidth:'120px'
      }
    },
    components:{
      Code
    },
    created() {
      this.getDings();
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header span{
    display: inline;
    float: left;
    margin: 30px 10px;
  }



  #footer {
    margin: 30px 10px;
  }

</style>
