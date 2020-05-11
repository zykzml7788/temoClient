<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配置管理</el-breadcrumb-item>
      <el-breadcrumb-item>钉钉通知</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-button type="primary" @click="showDing('add','')">新增钉钉机器人</el-button>
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
              @click.native.prevent="lookDetail(scope.row.descId)"
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
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="webhook" :label-width="formLabelWidth" prop="webhook">
          <el-input placeholder="请输入webhook" v-model="form.webhook" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="机器人描述" :label-width="formLabelWidth" prop="desc">
          <el-input placeholder="请输入机器人描述" v-model="form.desc" autocomplete="off" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"></el-input>
        </el-form-item>
        <el-form-item label="keyWord" :label-width="formLabelWidth" prop="keysWord">
          <el-input placeholder="请输入keyWord" v-model="form.keysWord" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDing(button)">保 存</el-button>
        <el-button @click="closeDing">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import AddCase from '@/views/case/AddCase'
  import EditCaseSet from '@/views/case/EditCaseSet'
  import AddCaseSet from '@/views/case/AddCaseSet'


  export default {

    name:'TaskResult',
    methods: {
      showDing(type,id){
        this.dialogTitle = (type==='add'?"新增":"编辑")+"钉钉机器人";
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
      closeDing(){
        this.$refs['form'].resetFields();
        this.dingShow = false;
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
        } else {
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
        dialogTitle: '',
        button: '',
        rules:{
          webhook:[
            {required:true,message:'请输入webhook',trigger:'change'},
          ],
          keysWord:[
            {required:true,message:'请输入keyWord',trigger:'change'},
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
          desc:'',
          webhook:'',
          keysWord:''
        },
        formLabelWidth:'100px'
      }
    },
    components:{

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
