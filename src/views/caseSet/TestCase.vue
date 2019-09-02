<template>

  <div id="case">
    <div class="header">

      <span>
        <el-input
          placeholder="请输入用例集名称"
          prefix-icon="el-icon-search"
          v-model="caseName">
      </el-input>
      </span>
      <span>
        <el-button type="primary" @click="getCaseSets(1)">搜索</el-button>
        <el-button type="primary" @click="addshow = true">新增</el-button>
      </span>


    </div>

      <div id="addPage" v-show="addshow" class="transition-box">
        <addcaseset @closeAddPage="closeAddPage" :dialog="addshow"></addcaseset>
      </div>
      <div id="editPage" v-show="editshow" class="transition-box">
        <editcaseset @closeEditPage="closeEditPage" :dialog="editshow" :sdesc="set.desc" :sname="set.name" :setId="set.setid"></editcaseset>
      </div>
      <div id="caseList" v-show="caseListShow" class="transition-box">
        <caselist :caseList="caseList" :setid="set.setid" :dialog="caseListShow" @closeCaseList="closeCaseList" @getCaseSets="getCaseSets"></caselist>
      </div>
      <confirm :dialog="dialogs.deldialog" :msg="dialogs.delmsg"  @closeCf="closeDelConfirm"></confirm>
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="80%" :default-sort="{prop: 'updatetime', order: 'descending'}" v-loading="loading" height="600">
      <div slot="empty" style="text-align: left;margin: 30px;" >
        <div>
          <img src="../../assets/timo.png" alt="" width="140px" height="140px"/>
        </div>
        <p>没有查询到数据呦～</p>
        </div>
      <el-table-column
        fixed="left"
        prop="name"
        label="用例集名称"
        width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="详细步骤"
        width="500" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="testCases.length"
        label="用例数"
        width="100">
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
            @click.native.prevent="showCaseList(scope.$index, scope.row)"
            type="text"
            size="small">
            查看用例
          </el-button>
          <el-button
            @click.native.prevent="updateSet(scope.$index, scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteSet(scope.$index, scope.row)"
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
  import AddCaseSet from '@/views/caseSet/AddCaseSet';
  import Confirm from '@/common/Confirm';
  import EditCaseSet from '@/views/caseSet/EditCaseSet'
  import CaseList from '@/views/caseSet/CaseList'

  export default {

    name:'Case',
    methods: {
      showCaseList(index,row){
        this.caseListShow = true;
        this.caseList = row.testCases;
        this.set.setid = row.setid;
      },
      updateSet(index,row){
        this.editshow = true;
        this.set.desc = row.desc;
        this.set.name = row.name;
        this.set.setid = row.setid;
      },
      deleteSet(index, row) {
        this.dialogs.deldialog = true;
        this.row = row;

      },
      getCaseSets(page){
        this.$axios.get("/apis/testCaseSet/lists/"+page+"?filter="+this.caseName).then(res=>{
          this.tableData = res.data.data.list;
          this.loading = false;
          this.total = res.data.data.total;
        }).catch(err=>{
          this.$message({
            type: 'error',
            message: err
          })
        });
      },
      handleCurrentChange(page){
        this.getCaseSets(page);
      },
      closeAddPage(close){
        this.addshow = close;
        this.getCaseSets(1);
      },
      closeEditPage(close){
        this.editshow = close;
        this.getCaseSets(1);
      },
      closeDelConfirm(data,val){
        this.dialogs.deldialog = data;
        // 判断子组件的值，传入true则调用删除接口
        if (val){
            this.$axios.delete("/apis/testCaseSet/"+this.row.setid).then(res=>{
              if (res.data.code === 200){
                this.$message({
                  type:"success",
                  message:res.data.msg
                });
              } else{
                this.$message({
                  type:"warning",
                  message:res.data.msg
                })
              }
            }).catch(err=>{
              this.$message({
                type:"error",
                message:err
              })
            });

        }
        // 删除后调用查询接口
        this.getCaseSets(1);
      },
      closeCaseList(bol){
        this.caseListShow = bol;
      }
    },
    data() {
      return {
        total:0,
        loading:true,
        caseList:[],
        dialogs:
          {
            deldialog:false,
            delmsg: '你确定要删除该用例吗？'
          }
        ,
        caseName: '',
        tableData: [],
        addshow: false,
        editshow: false,
        caseListShow: false,
        row:'',
        set:{
          setid:'',
          desc:'',
          name:''
        }
      }
    },
    components:{
      "addcaseset": AddCaseSet,
      "confirm": Confirm,
      "editcaseset": EditCaseSet,
      "caselist": CaseList
    },
    created() {
      this.getCaseSets(1);
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

  #addPage{
    text-align: center;
  }

</style>
