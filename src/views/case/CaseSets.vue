<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>用例集管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-select v-model="projectId" filterable placeholder="请选择项目">
          <el-option
            v-for="item in projects"
            :key="item.pid"
            :label="item.pname"
            :value="item.pid">
          </el-option>
        </el-select>
      </span>
      <span>
        <el-select v-model="setStatus" filterable placeholder="请选择状态">
          <el-option label="待完成" :value="'0'"></el-option>
          <el-option label="待维护" :value="'1'"></el-option>
          <el-option label="已完成" :value="'2'"></el-option>
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
        <el-button type="primary" @click="getCaseSet(1)">搜索</el-button>
        <el-button type="primary" @click="addCaseSet">新增</el-button>
      </span>


    </div>

    <AddCase @getCaseSet="getCaseSet(1)"></AddCase>
    <AddCaseSet @getCaseSet="getCaseSet(1)"></AddCaseSet>
    <EditCaseSet @getCaseSet="getCaseSet(1)"></EditCaseSet>

    <el-table
      :data="caseSetLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="600" :default-sort="{prop: 'createTime', order: 'descending'}">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../../static/img/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        fixed="left"
        prop="setName"
        label="用例集名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="setDesc"
        label="用例集描述"
        width="400" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="setStatus"
        label="状态"
        width="200">
        <template slot-scope="scope">
          <p  v-if="caseSetLists[scope.$index].setStatus==='0'">待完成</p>
          <p  v-if="caseSetLists[scope.$index].setStatus==='1'">待维护</p>
          <p  v-if="caseSetLists[scope.$index].setStatus==='2'">已完成</p>
        </template>
      </el-table-column>
      <el-table-column
        label="是否启用"
        width="200">
        <template slot-scope="scope">
          <p  v-if="caseSetLists[scope.$index].valid==='0'">禁用</p>
          <p  v-if="caseSetLists[scope.$index].valid==='1'">启用</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="300">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <div style="margin-bottom: 10px;">
            <el-button
              @click.native.prevent="addCaseSet(scope.row)"
              type="primary"
              size="mini">
              执行
            </el-button>
            <el-button
              @click.native.prevent="addCase(scope.row)"
              type="success"
              size="mini">
              添加用例
            </el-button>
          </div>
          <div>
            <el-button
              @click.native.prevent="updateCaseSet(scope.row)"
              type="warning"
              size="mini">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteCaseSet(scope.row)"
              type="danger"
              size="mini">
              移除
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <el-footer id="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total" @current-change="getCaseSet(page)" :current-page.sync="page">
      </el-pagination>
    </el-footer>


  </div>

</template>

<script>
  import AddCase from '@/views/case/AddCase'
  import EditCaseSet from '@/views/case/EditCaseSet'
  import AddCaseSet from '@/views/case/AddCaseSet'


  export default {

    name:'CaseSet',
    methods: {


      getCaseSet(page){
        this.$axios.get('/apis/testcaseset/'+page,{params:{set_name:this.search_val,project_id:this.projectId,set_status:this.setStatus}}).then(res=>{
            this.loading = true;
            if (res.data.code === 200){
              this.caseSetLists = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$notify({title:'操作成功',type:'warning',message:res.data.msg});
            }
            this.loading = false;
          }

        ).catch(err=>{
          this.$notify({title:'操作失败',type:'error',message:err});
        });
      },
      addCaseSet(){
        this.$store.commit('changeAddCaseSetShow',true);
      },
      addCase(){
        this.$store.commit('changeAddCaseShow',true);
      },
      updateCaseSet(row){
        this.$axios.get('/apis/testcaseset/'+row.setId+'/info').then(res=>{
          this.$store.commit('setCaseSetDetail',res.data.data);
          this.$store.commit('changeEditCaseSetShow',true);
        });
      },
      deleteCaseSet(row){
        this.$confirm('确定要删除吗？').then(_=>{
            this.$axios.delete('/apis/testcaseset/'+row.setId).then(res=>{
              if (res.data.code===200){
                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
              this.page = 1;
              this.getCaseSet(1);
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
      }
    },
    data() {
      return {
        page:1,
        total: 0,
        search_val:'',
          projectId:'',
          setStatus:'',
        projects:[],
        caseSetLists: [
        ],
        loading: false,
        items: [
          '','success','info','danger','warning'
        ],
        dialogVisible: false,
      }
    },
    components:{
      AddCase,
      AddCaseSet,
        EditCaseSet
    },
    created() {
       this.getCaseSet(1);
      this.getProjects();
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
