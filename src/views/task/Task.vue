<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>普通任务管理</el-breadcrumb-item>
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
        <el-select v-model="isParallel"  placeholder="请选择执行方式" clearable>
          <el-option label="串行" :value="0"></el-option>
          <el-option label="并发" :value="1"></el-option>
        </el-select>
      </span>
      <span>
        <el-button type="primary" @click="getTasks(1)">搜索</el-button>
        <el-button type="primary" @click="openAddTask">新增</el-button>
        <el-button type="success" @click="startTasks">批量执行</el-button>
      </span>

    </div>

    <AddTasks @getTasks="getTasks(1)"></AddTasks>
    <EditTask @getTasks="getTasks(1)"></EditTask>

    <el-table
      :data="taskLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="800" :default-sort="{prop: 'updateTime', order: 'descending'}"
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
        prop="isParallel"
        label="执行方式"
        width="200">
        <template slot-scope="scope">
          <el-tag  type="primary" v-if="scope.row.isParallel==='0'">串行</el-tag>
          <el-tag type="success"  v-if="scope.row.isParallel==='1'">并发</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isDing"
        label="钉钉通知"
        width="200">
        <template slot-scope="scope">
          <el-tag  type="danger" v-if="scope.row.isDing===0">关闭</el-tag>
          <el-tag type="success"  v-if="scope.row.isDing===1">开启</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="300">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <div style="margin-bottom: 10px;">
            <el-button
              @click.native.prevent="startTask(scope.row.taskId)"
              type="primary"
              size="mini">
              执行任务
            </el-button>
            <el-button
              @click.native.prevent="openEditTask(scope.row.taskId)"
              size="mini">
              更改配置
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
        :total="total" @current-change="getTasks(page)" :current-page.sync="page">
      </el-pagination>
    </el-footer>


  </div>

</template>

<script>
  import AddTasks from '@/views/task/AddTasks'
  import EditTask from '@/views/task/EditTask'


  export default {

    name:'Task',
    methods: {
      openAddTask(){
         this.$store.commit('changeAddTaskShow',true);
      } ,
      openEditTask(id){
          this.$store.commit('changeEditTaskShow',true);
          this.$axios.get('/apis/task/'+id+'/info').then(res=>{
              this.$store.commit('setTaskDetail',res.data.data);
          });
      } ,
      startTask(id){
        this.$confirm('是否发起任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/apis/task/startTask/'+id).then(res=>{
              if (res.data.code === 200){
                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                this.getTasks(1);
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
            }

          ).catch(err=>{
            this.$notify({title:'操作失败',type:'error',message:err});
          });
        });
      },
      startTasks(){
        const taskIds = [];
        this.tasks.forEach((n)=>{taskIds.push(n.taskId)});
        this.$confirm('是否要批量发起任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/apis/task/startTasks/',taskIds).then(res=>{
              if (res.data.code === 200){
                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                this.getTasks(1);
              } else {
                this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
              }
            }

          ).catch(err=>{
            this.$notify({title:'操作失败',type:'error',message:err});
          });
        });
      },
      handleSelectionChange(val) {
        this.tasks = val;
      },
      getTasks(page){
        this.page = page;
        this.loading = true;
        this.$axios.get('/apis/task/'+page,{params:{taskName:this.search_val,isParallel:this.isParallel}}).then(res=>{
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
          isParallel:'',
        loading: false,
        items: [
          '','success','info','danger','warning'
        ],
        dialogVisible: false,
        tasks: []
      }
    },
    components:{
        AddTasks,EditTask
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
