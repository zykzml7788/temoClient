<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>执行记录管理</el-breadcrumb-item>
      <el-breadcrumb-item>执行记录管理</el-breadcrumb-item>
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
        <el-select v-model="status"  clearable placeholder="请选择状态">
          <el-option label="等待执行" :value="0"></el-option>
          <el-option label="执行中" :value="1"></el-option>
          <el-option label="执行完毕" :value="2"></el-option>
        </el-select>
      </span>
      <span>
        <el-button type="primary" @click="getTaskResults(1)">搜索</el-button>
      </span>


    </div>

    <el-table
      :data="taskLists"
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
        prop="taskResultNum"
        label="编号"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        fixed="left"
        prop="taskName"
        label="任务名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="successNum"
        label="成功用例集数"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="totalNum"
        label="总用例集数"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="successRate"
        label="成功率"
        width="200">
        <template slot-scope="scope">
          <span v-if="taskLists[scope.$index].successRate!==''">{{taskLists[scope.$index].successRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="执行状态"
        width="200">
        <template slot-scope="scope">
          <el-tag  v-if="taskLists[scope.$index].status===0">等待执行</el-tag>
          <el-tag  type="warning"  v-if="taskLists[scope.$index].status===1">执行中</el-tag>
          <el-tag  type="success" v-if="taskLists[scope.$index].status===2">执行完毕</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="mail"
        label="邮件提醒"
        width="300">
      </el-table-column>
      <el-table-column
        prop="person"
        label="执行人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
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
              查看详情
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
            startTask(id){
                this.$confirm('是否发起任务？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/apis/task/startTask/'+id).then(res=>{
                            if (res.data.code === 200){
                                this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                                this.getTaskResults(1);
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
            getTaskResults(page){
                this.page = 1;
                this.loading = true;
                this.$axios.get('/apis/taskResult/'+page,{params:{taskName:this.search_val,status:this.status}}).then(res=>{
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
                            this.getTaskResults(1);
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
                status:'',
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
            this.getTaskResults(1);
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
