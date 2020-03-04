<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-input
          placeholder="请输入任务名称"
          prefix-icon="el-icon-search"
          v-model="search_val">
        </el-input>
      </span>
      <span>
        <el-select v-model="taskStatus"  clearable placeholder="请选择任务状态">
          <el-option label="待执行" :value="'0'"></el-option>
          <el-option label="执行中" :value="'1'"></el-option>
          <el-option label="执行完毕" :value="'2'"></el-option>
        </el-select>
      </span>
      <span>
        <el-button type="primary" @click="getTasks(1)">搜索</el-button>
        <el-button type="primary" @click="">新增</el-button>
        <el-button type="success" @click="">批量执行</el-button>
      </span>


    </div>

    <el-table
      :data="taskLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="600" :default-sort="{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../../static/img/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed="left"
        prop="taskName"
        label="任务名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="taskDesc"
        label="任务描述"
        width="300" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="testSetList"
        label="绑定用例集"
        width="500" :show-overflow-tooltip="true">
        <template slot-scope="scope" >
          <el-tooltip class="item" effect="light" :content="testset.setName" placement="top-start" v-for="testset in scope.row.testSetList">
            <el-tag
              :key="testset.setId"
              :type="items[scope.row.testSetList.indexOf(testset)%5]"
              effect="light" style="margin-left: 5px" size="mini">
              {{ "用例集"+(scope.row.testSetList.indexOf(testset)+1) }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="200">
        <template slot-scope="scope">
          <p  v-if="taskLists[scope.$index].status===0">待执行</p>
          <p  v-if="taskLists[scope.$index].status===1">执行中</p>
          <p  v-if="taskLists[scope.$index].status===2">执行完毕</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="isTiming"
        label="手动/定时"
        width="200">
        <template slot-scope="scope">
          <el-tag  type="primary" v-if="taskLists[scope.$index].isTiming==='0'">定时</el-tag>
          <el-tag type="success"  v-if="taskLists[scope.$index].isTiming==='1'">手动</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isParallel"
        label="执行方式"
        width="200">
        <template slot-scope="scope">
          <el-tag  type="primary" v-if="taskLists[scope.$index].isParallel==='0'">串行</el-tag>
          <el-tag type="success"  v-if="taskLists[scope.$index].isParallel==='1'">并发</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="mail"
        label="邮件通知人"
        width="300">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="预计执行时间"
        width="300">
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
              @click.native.prevent=""
              type="primary"
              size="mini">
              执行任务
            </el-button>
            <el-button
              @click.native.prevent=""
              type="warning"
              size="mini">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteTask(scope.row)"
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

    name:'Task',
    methods: {
      handleSelectionChange(val) {
        this.tasks = val;
      },
      getTasks(page){
        this.$axios.get('/apis/task/'+page,{params:{taskName:this.search_val,status:this.taskStatus}}).then(res=>{
            this.loading = true;
            if (res.data.code === 200){
              this.taskLists = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
            }
            this.loading = false;
          }

        ).catch(err=>{
          this.$notify({title:'操作失败',type:'error',message:err});
        });
      },
      deleteTask(row){
        this.$confirm('确定要删除吗？').then(_=>{
            this.$axios.delete('/apis/task/'+row.taskId).then(res=>{
              if (res.data.code===200){
                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
              this.page = 1;
              this.getTasks(1);
            }).catch(err=>{
              this.$notify({title:'操作失败',type:'error',message:err});
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
        projects:[],
        taskLists: [],
        taskStatus:'',
        loading: false,
        items: [
          '','success','info','danger','warning'
        ],
        dialogVisible: false,
        tasks: []
      }
    },
    components:{

    },
    created() {
      this.getTasks(1);
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
