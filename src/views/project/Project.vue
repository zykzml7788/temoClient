<template>

  <div id="project">
    <div class="header">

      <span>
        <el-input
          placeholder="请输入项目名称"
          prefix-icon="el-icon-search"
          v-model="search_val">
      </el-input>
      </span>
      <span>
        <el-button type="primary" @click="getProjectsByName(1)">搜索</el-button>
        <el-button type="primary" @click="addProject">新增</el-button>
      </span>


    </div>
    <div id="addproject">
      <add-project @getProjects="getProjects"></add-project>
    </div>
    <el-table
      :data="projectLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="600" :default-sort="{prop: 'updateTime', order: 'descending'}">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../assets/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        fixed="left"
        prop="pname"
        label="项目名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="env"
        label="环境"
        width="500" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="env.host" placement="top-start" v-for="env in scope.row.envs">
            <el-tag
              :key="env.envName"
              :type="items[scope.row.envs.indexOf(env)%5]"
              effect="plain" style="margin-left: 5px;">
              {{ env.envName }}
            </el-tag>
          </el-tooltip>
        </template>
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
            @click.native.prevent="showProjectDetail(scope.$index, scope.row)"
            type="text"
            size="small">
            查看
          </el-button>
          <el-button
            @click.native.prevent="updateProject(scope.$index, scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteProject(scope.$index, scope.row)"
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
        :total="total" @current-change="handleCurrentChange">
      </el-pagination>
    </el-footer>


  </div>

</template>

<script>
  import AddProject from '../../views/project/AddProject'

  export default {

    name:'Project',
    methods: {

      getProjects(){
        this.loading = true;
        this.$axios.get('/apis/project/1?filter='+this.search_val).then(res=>{
          if (res.data.code === 200){
            this.projectLists = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.message({type:'warning',message:res.data.msg});
          }
          this.loading = false;
        }).catch(err=>{
          this.$message({type:'error',message:err});
        });
      },
      getProjectsByName(page){
        this.$axios.get('/apis/project/'+page+'?filter='+this.search_val).then(res=>{
            this.loading = true;
            if (res.data.code === 200){
              this.projectLists = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.message({type:'warning',message:res.data.msg});
            }
            this.loading = false;
          }

        ).catch(err=>{
          this.$message({type:'error',message:err});
        });
      },
      addProject(){
        this.$store.commit('changeAddProjectShow',true);

      },
      showProjectDetail(index,row){

      },
      updateProject(index,row){

      },
      deleteProject(index,row){

      },
      handleCurrentChange(page){
        this.getProjectsByName(page);
      }
    },
    data() {
      return {
        total: 0,
        search_val:'',
        projectLists: [],
        loading: true,
        items: [
          '','success','info','danger','warning'
        ],
      }
    },
    components:{
      AddProject
    },
    created() {
      this.getProjects();
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header span{
    display: inline;
    float: left;
    margin: 30px 20px;
  }

  #footer {
    margin: 30px 10px;
  }

</style>
