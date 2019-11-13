<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>用例集管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-select v-model="value" filterable placeholder="请选择项目">
          <el-option
            v-for="item in projectOptions"
            :key="item.pid"
            :label="item.pname"
            :value="item.pid">
          </el-option>
        </el-select>
      </span>
      <span>
        <el-input
          placeholder="请输入用例集名称"
          prefix-icon="el-icon-search"
          v-model="search_val">
        </el-input>
      </span>
      <span>
        <el-button type="primary" @click="getDataBasesByName(1)">搜索</el-button>
        <el-button type="primary" @click="addCaseSet">新增</el-button>
      </span>


    </div>

    <AddCaseSet @getDataBases="getDataBases"></AddCaseSet>

    <el-table
      :data="dataBaseLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="600" :default-sort="{prop: 'updatetime', order: 'descending'}">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../../static/img/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        fixed="left"
        prop="caseName"
        label="用例集名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="caseDesc"
        label="用例集描述"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="updatetime"
        label="更新时间"
        width="300">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="updateDataBase(scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteDatabase(scope.row)"
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
        :total="total" @current-change="getDataBasesByName(page)" :current-page.sync="page">
      </el-pagination>
    </el-footer>


  </div>

</template>

<script>
    import AddCaseSet from '@/views/case/AddCaseSet'



    export default {

        name:'DataBases',
        methods: {

            getDataBases(){
                this.page=1;
                this.loading = true;
                this.$axios.get('/apis/database/1?filter='+this.search_val).then(res=>{
                    if (res.data.code === 200){
                        this.dataBaseLists = res.data.data.list;
                        this.total = res.data.data.total;
                    } else {
                        this.$message({type:'warning',message:res.data.msg});
                    }
                    this.loading = false;
                }).catch(err=>{
                    this.$message({type:'error',message:err});
                });
            },
            getDataBasesByName(page){
                this.$axios.get('/apis/database/'+page+'?filter='+this.search_val).then(res=>{
                        this.loading = true;
                        if (res.data.code === 200){
                            this.dataBaseLists = res.data.data.list;
                            this.total = res.data.data.total;
                        } else {
                            this.$message({type:'warning',message:res.data.msg});
                        }
                        this.loading = false;
                    }

                ).catch(err=>{
                    this.$message({type:'error',message:err});
                });
            },
            addCaseSet(){
                this.$store.commit('changeAddCaseSetShow',true);
                console.log(this.$store.state.addcasesetshow);
            },
            updateDataBase(row){
                this.$axios.get('/apis/database/'+row.dbId+'/info').then(res=>{
                    this.$store.commit('setDatabaseDetail',res.data.data);
                    this.$store.commit('changeEditDataBaseShow',true);
                });
            },
            deleteDatabase(row){
                this.$confirm('确定要删除吗？').then(_=>{
                        this.$axios.delete('/apis/database/'+row.dbId).then(res=>{
                            if (res.data.code===200){
                                this.$message({type:'success',message:res.data.msg});
                            } else {
                                this.$message({type:'warning',message:res.data.msg});
                            }
                            this.page = 1;
                            this.getDataBases();
                        }).catch(err=>{
                            this.$message({type:'error',message:err});
                        });
                    }
                );

            },
        },
        data() {
            return {
                page:1,
                total: 0,
                search_val:'',
                dataBaseLists: [],
                loading: true,
                items: [
                    '','success','info','danger','warning'
                ],
                dialogVisible: false,
                projectOptions: [],
            }
        },
        components:{
            AddCaseSet,
        },
        created() {
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
