<template>

  <div id="script">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据库管理</el-breadcrumb-item>
      <el-breadcrumb-item>脚本管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-select v-model="value" filterable placeholder="请选择数据源">
          <el-option
            v-for="item in dbOptions"
            :key="item.dbId"
            :label="item.dbName"
            :value="item.dbId">
          </el-option>
        </el-select>
      </span>
      <span>
        <el-input
          placeholder="请输入脚本名称"
          prefix-icon="el-icon-search"
          v-model="search_val">
        </el-input>
      </span>
      <span>
        <el-button type="primary" @click="getScripts(1)">搜索</el-button>
        <el-button type="primary" @click="addScript">新增</el-button>
      </span>


    </div>

    <AddScript @getScripts="getScripts(1)"></AddScript>
    <EditScript @getScripts="getScripts(1)"></EditScript>

    <el-table
      :data="scriptLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="650" :default-sort="{prop: 'updatetime', order: 'descending'}">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../../static/img/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        fixed="left"
        prop="scriptName"
        label="脚本名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="sqlScript"
        label="脚本内容"
        width="300" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="db.dbName"
        label="所属数据源"
        width="300" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="300">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="updateScript(scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteScript(scope.row)"
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-footer id="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total" @current-change="getScripts(page)" :current-page.sync="page">
      </el-pagination>
    </el-footer>


  </div>

</template>

<script>
    import AddScript from '@/views/database/AddScript'
    import EditScript from "@/views/database/EditScript";


    export default {

        name:'Script',

        methods: {

            getDataBases(){
                this.$axios.get('/apis/database/').then(res=>{
                    if (res.data.code === 200){
                        this.dbOptions = res.data.data;
                    } else {
                        this.$notify({title: '成功',type:'warning',message:res.data.msg});
                    }
                    this.loading = false;
                }).catch(err=>{
                    this.$notify({title: '失败',type:'error',message:err});
                });
            },
            getScripts(page){
                this.$axios.get('/apis/script/'+page+'?scriptName='+this.search_val+'&dbId='+this.value).then(res=>{
                        this.loading = true;
                        if (res.data.code === 200){
                            this.scriptLists = res.data.data.list;
                            this.total = res.data.data.total;
                        } else {
                            this.$notify({type:'warning',message:res.data.msg});
                        }
                        this.loading = false;
                    }

                ).catch(err=>{
                    this.$notify({type:'error',message:err});
                });
            },
            addScript(){
                this.$store.commit('changeAddScriptShow',true);
            },
            updateScript(row){
                this.$axios.get('/apis/script/'+row.scriptId+'/info').then(res=>{
                    this.$store.commit('setScriptDetail',res.data.data);
                    this.$store.commit('changeEditScriptShow',true);
                });
            },
            deleteScript(row){
                this.$confirm('确定要删除吗？').then(_=>{
                        this.$axios.delete('/apis/script/'+row.scriptId).then(res=>{
                            if (res.data.code===200){
                                this.$notify({title: '成功',type:'success',message:res.data.msg});
                            } else {
                                this.$notify({title: '失败',type:'warning',message:res.data.msg});
                            }
                            this.page = 1;
                            this.getScripts(1);
                        }).catch(err=>{
                            this.$notify({title: '失败',type:'error',message:err});
                        });
                    }
                );

            },
        },
        data() {
            return {
                value:'',
                page:1,
                total: 0,
                search_val:'',
                dbOptions:[],
                scriptLists: [],
                loading: true,
                items: [
                    '','success','info','danger','warning'
                ],
                dialogVisible: false,
            }
        },
        components:{
            AddScript,
            EditScript
        },
        created() {
            this.getScripts(1);
            this.getDataBases();
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
