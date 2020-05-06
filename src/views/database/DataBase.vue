<template>

  <div id="database">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据库管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据源管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <span>
        <el-input
          placeholder="请输入数据源名称"
          prefix-icon="el-icon-search"
          v-model="search_dbName">
        </el-input>
      </span>
      <span>
        <el-select v-model="search_dbType" placeholder="请选择类型" style="float: left" clearable="true">
          <el-option
            v-for="item in dbOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span>
        <el-button type="primary" @click="getDataBasesByName(1)">搜索</el-button>
        <el-button type="primary" @click="addDataBase">新增</el-button>
      </span>


    </div>

    <AddDataBase @getDataBases="getDataBases"></AddDataBase>
    <EditDataBase @getDataBases="getDataBases"></EditDataBase>

    <el-table
      :data="dataBaseLists"
      style="width: 100%"
      max-height="80%"  v-loading="loading" height="800" :default-sort="{prop: 'updatetime', order: 'descending'}">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../../static/img/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
      </div>
      <el-table-column
        fixed="left"
        prop="dbName"
        label="数据源名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="dbLibraryName"
        label="数据库"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="host"
        label="类型"
        width="100">
        <template slot-scope="scope">
          <el-tag effect="light" v-if="scope.row.dbType==='100'">
            mysql
          </el-tag>
          <el-tag effect="light" v-else type="warning">
            redis
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="host"
        label="域名"
        width="300">
      </el-table-column>
      <el-table-column
        prop="port"
        label="端口号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="user"
        label="账号"
        width="300">
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
            size="mini">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteDatabase(scope.row)"
            type="danger"
            size="mini">
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
  import AddDataBase from '@/views/database/AddDataBase'
  import EditDataBase from "@/views/database/EditDataBase";


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
            this.$notify({type:'warning',message:res.data.msg});
          }
          this.loading = false;
        }).catch(err=>{
          this.$notify({type:'error',message:err});
        });
      },
      getDataBasesByName(page){
          this.page=page;
          this.loading = true;
        this.$axios.get('/apis/database/'+page+'?dbName='+this.search_dbName+"&dbType="+this.search_dbType).then(res=>{
            if (res.data.code === 200){
              this.dataBaseLists = res.data.data.list;
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
      addDataBase(){
        this.$store.commit('changeAddDataBaseShow',true);
      },
      updateDataBase(row){
        this.$store.commit('changeEditDataBaseShow',true);
        this.$axios.get('/apis/database/'+row.dbId+'/info').then(res=>{
            this.$store.commit('setDatabaseDetail',res.data.data);
        });
      },
      deleteDatabase(row){
        this.$confirm('确定要删除吗？').then(_=>{
            this.$axios.delete('/apis/database/'+row.dbId).then(res=>{
              if (res.data.code===200){
                this.$notify({title:'成功',type:'success',message:res.data.msg});
              } else {
                this.$notify({title:'失败',type:'warning',message:res.data.msg});
              }
              this.page = 1;
              this.getDataBases();
            }).catch(err=>{
              this.$notify({title:'失败',type:'error',message:err});
            });
          }
        );

      },
    },
    data() {
      return {
        page:1,
        total: 0,
        search_dbName:'',
        search_dbType:'',
        dataBaseLists: [],
        loading: true,
        items: [
          '','success','info','danger','warning'
        ],
        dbOptions:[
          {
            value: '100',
            label: 'Mysql'
          },
          {
            value: '200',
            label: 'Redis'
          },
        ],
        dialogVisible: false,
        options: [
          {
          value: '产品服务数据库',
          label: '产品服务数据库'
          },
          {
            value: '支付服务数据库',
            label: '支付服务数据库'
          }],
      }
    },
    components:{
        AddDataBase,
        EditDataBase
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
