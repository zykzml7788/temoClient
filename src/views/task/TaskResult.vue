<template>

  <div id="case">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
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
        prop="taskName"
        label="任务名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="taskResultNum"
        label="编号"
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
          <el-tag  v-if="scope.row.status===0">等待执行</el-tag>
          <el-tag  type="warning"  v-if="scope.row.status===1">执行中</el-tag>
          <el-tag  type="success" v-if="scope.row.status===2">执行完毕</el-tag>
        </template>
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
              @click.native.prevent="lookDetail(scope.row.taskResultId)"
              type="primary"
              size="mini">
              查看详情
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="任务执行详情" :visible.sync="setResultShow" @close="closeTaskDetail">
      <el-table :data="setResults"    stripe  height="500"  v-loading="sloading">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column property="setName" label="用例集名称" width="200"></el-table-column>
        <el-table-column property="successNum" label="成功数"></el-table-column>
        <el-table-column property="totalNum" label="执行总数"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            <el-tag  type="danger"  v-if="scope.row.status===0">失败</el-tag>
            <el-tag  type="success" v-if="scope.row.status===1">成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="lookCaseDetail(scope.$index)"
              type="primary"
              size="mini">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-drawer
      title="用例执行记录"
      :visible.sync="drawer"
      :direction="'rtl'"
      size="60%"
    >
      <el-card shadow="always" style="margin: 20px;float: left;width:100%">
        <el-table
          :data="executedRows"
          stripe height="800"
          style="width: 100%;">
          <el-table-column
            prop="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="caseName"
            label="用例名称"
            width="400">
          </el-table-column>
          <el-table-column
            prop="status"
            label="执行状态"
            width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="success">成功</el-tag>
              <el-tag v-else type="danger">失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="logs"
            label="日志"
            width="200">
            <template slot-scope="scope">
              <el-button type="primary" round icon="el-icon-tickets" size="mini" @click="lookLogs(scope.row.logs)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

    </el-drawer>
    <el-dialog
      title="日志详情"
      :visible.sync="logView"
      width="60%"
      :append-to-body="true">
      <div v-html="logs" style="">

      </div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="logView = false">确 定</el-button>
    </span>
    </el-dialog>

    <el-footer id="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total" @current-change="getTaskResults(page)" :current-page.sync="page">
      </el-pagination>
    </el-footer>


  </div>

</template>

<script>
    import AddCase from '@/views/case/AddCase'
    import EditCaseSet from '@/views/case/EditCaseSet'
    import AddCaseSet from '@/views/case/AddCaseSet'


    export default {

        name:'TaskResult',
        methods: {
            lookDetail(id){
                this.setResultShow = true;
                this.sloading = true;
                this.$axios.get('/apis/taskResult/'+id+'/detail').then(res=>{
                        if (res.data.code === 200){
                            this.setResults = res.data.data;
                        } else {
                            this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                        }
                    this.sloading = false;
                    }

                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
            },
            lookCaseDetail(index){
                this.drawer = true;
                this.executedRows = JSON.parse(this.setResults[index].caseResults);
            },
            lookLogs(logs){
                this.logs = logs.replace(/\n/g, "<br/>");
                this.logView = true;
            },
            closeTaskDetail(){
                this.setResults = [];
                this.setResultShow = false;
            },
            handleSelectionChange(val) {
                this.tasks = val;
            },
            getTaskResults(page){
                this.page = page;
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
                tasks: [],
                setResultShow:false,
                setResults:[],
                sloading: false,
                drawer: false,
                logView: false,
                logs: '',
                executedRows: []
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
