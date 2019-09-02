<template>
  <el-dialog title="用例列表" :visible.sync="dialogTableVisible"  width="1200px"  style="font-weight: bold;" @close="close" :fullscreen="true">
    <h3 style="float: left">前/后置脚本列表</h3>
    <el-table :data="scriptList" height="300px">
      <div slot="empty" style="text-align:left;margin: 30px;" >
        <div>
          <img src="../../assets/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column type="index" label="顺序" width="50" fixed="left"></el-table-column>
      <el-table-column property="desc" label="脚本描述" width="200" fixed="left" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="type" label="脚本类型" width="200" fixed="left"></el-table-column>
      <el-table-column property="beforeOrAfter" label="前/后置" width="200" fixed="left">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.beforeOrAfter === 'before'">前置</el-tag>
          <el-tag v-else>后置</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div id="btn" style="width: 500px;height:70px;">
      <el-button type="primary" @click="addCase" style="float: left;margin: 10px 5px;">新增用例</el-button>
      <el-button type="primary" @click="" style="float: left;margin: 10px 5px;">添加前/后置脚本</el-button>
      <el-button type="primary" @click="" style="float: left;margin: 10px 5px;">保存</el-button>
    </div>

    <div id="addPage" v-show="$store.state.addcaseshow" class="transition-box">
      <addcase></addcase>
    </div>
    <div><h3 style="float: left">用例列表</h3></div>
    <el-table :data="testCases" height="1000px">
      <div slot="empty" style="text-align:left;margin: 30px;" >
        <div>
          <img src="../../assets/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column type="index" label="顺序" width="50" fixed="left"></el-table-column>
      <el-table-column property="description" label="用例描述" width="200" fixed="left" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="url" label="接口地址" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="method" label="请求方式" width="200"></el-table-column>
      <el-table-column property="headers" label="请求头部" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="cookies" label="Cookies" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="params" label="请求参数" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="body" label="请求体" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="file" label="文件路径" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="verify" label="响应断言" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="saves" label="参数关联" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="dbtype" label="数据库类型" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="db" label="数据库名称" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="setupSql" label="前置sql" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column property="teardownSql" label="后置sql" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.$index,scope.row.caseid)" type="text" size="small">查看</el-button>
          <el-button @click="editCase(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delCase(scope.$index,scope.row.caseid)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
  import AddCase from './AddCase'

  export default {
    data() {
      return {
        setId:'',
        dialog:false,
        testCases:[],
        scriptList:[{
          desc: "登入注册",
          type: "用例集脚本",
          beforeOrAfter: "before"
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    },
    methods:{
      close(){
        this.$emit('closeCaseList',false);
        this.$emit('getCaseSets','1');
      },
      getCaseList(id){
        this.$axios.get("/apis/testCaseSet/"+id+"/caseList/").then(res=>{
          console.log(res.data);
          this.testCases = res.data.data.testCases;
        })
      },
      showDetail(index,id){
        this.$axios.get("/apis/testCase/"+id).then(res=>{
          console.log(res.data);
        })
      },
      delCase(index,id){
        this.$axios.delete("/apis/testCase/"+id).then(res=>{
          console.log(res.data);
          this.$message({
            message: res.data.msg,
            type:'success'
          });
          this.getCaseList(this.setId);
        });
      },
      addCase(){
        // 改变新建用例弹窗状态
        this.$store.commit('changeAddCaseShow',true);
      },
      editCase(index,row){
        this.$axios.put("/apis/testCase",{
          "caseid": row.caseid,
          "priority": index+1,
          "description": row.description,
          "url": row.url,
          "method": row.method,
          "headers": row.headers,
          "cookies": row.cookies,
          "params": row.params,
          "body": row.body,
          "file": row.file,
          "verify": row.verify,
          "saves": row.saves,
          "dbtype": row.dbtype,
          "db": row.db,
          "setupSql": row.setupSql,
          "teardownSql": row.teardownSql
        }).then(res=>{
          console.log(res);
          this.getCaseList(this.setId)
        })
      }

    },
    props:[
      "dialog",
      "caseList",
      "setid"
    ],
    watch: {
      dialog: {
        immediate: true,
        deep: true,
        handler(val){
          this.dialogTableVisible = val;
        }
      },
      caseList:{
        immediate: true,
        deep: true,
        handler(val){
          this.testCases = val;
        }
      },
      setid:{
        immediate: true,
        deep: true,
        handler(val){
          this.setId = val;
        }
      }
    },
    components:{
      "addcase": AddCase
    }
  };
</script>
