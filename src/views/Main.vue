<template>
  <div id="main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>/</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-card shadow="hover" class="card" :v-loading="autoRunning.autoRunningLoading">
        <div slot="header" class="chead">
          <span>自动化已运行</span>
          <el-tag effect="dark" class="tag" size="mini">持续</el-tag>
        </div>
        <span class="content" style="color: deepskyblue"> {{autoRunning.days}} 天 {{autoRunning.hours}} 小时 {{autoRunning.minutes}} 分钟</span>
        <div class="bottom"><span>正在执行任务 {{autoRunning.tasks}} 个</span></div>
      </el-card>
      <el-card shadow="hover" class="card" :v-loading="todayRunning.todayRunningLoading">
        <div slot="header" class="chead">
          <span>今日执行情况</span>
          <el-tag effect="dark" class="tag" size="mini" type="warning">运行</el-tag>
        </div>
        <span  class="content" style="color: #ffcd32">已执行用例 {{todayRunning.executeCaseTodayNum}} 条</span>
        <div class="bottom"><span>成功率 {{todayRunning.successRate}}% </span></div>
      </el-card>
      <el-card shadow="hover" class="card" :v-loading="caseRepertory.caseRepertoryLoading">
        <div slot="header" class="chead">
          <span>用例库</span>
          <el-tag effect="dark" class="tag" size="mini" type="danger">库存</el-tag>
        </div>
        <span  class="content" style="color: #ff4d51;">用例集库存 {{caseRepertory.setNum}} 条</span>
        <div class="bottom"><span>包含用例 {{caseRepertory.caseNum}} 条</span></div>
      </el-card>
      <el-card shadow="hover" class="card" :v-loading="taskRepertory.taskRepertoryLoading">
        <div slot="header" class="chead">
          <span>任务库</span>
          <el-tag effect="dark" class="tag" size="mini" type="success">库存</el-tag>
        </div>
        <span  class="content" style="color: #13ce66">普通任务 {{taskRepertory.taskNum}} 个</span>
        <div class="bottom"><span>已开启定时任务 {{taskRepertory.timingTaskNum}} 个</span></div>
      </el-card>
    </div>
    <div>
      <h3>近7日用例执行情况</h3>
      <ve-line :data="caseHistory" :settings="caseHistorySettings"></ve-line>
    </div>
    <div style="text-align: center">
      <div class="today">
        <h3>今日用例执行</h3>
        <ve-ring :data="todayCase" :settings="todayCaseSettings"></ve-ring>
      </div>

      <div class="today">
        <h3>任务执行</h3>
        <ve-ring :data="todayTask"></ve-ring>
      </div>
    </div>
    <ve-wordcloud :data="chartData"></ve-wordcloud>
  </div>
</template>

<script>
    export default {
        data() {
            this.caseHistorySettings = {
              xAxisType: 'time',
              area: true,
              yAxisType: ['KMB', 'percent'],
              yAxisName: ['用例数', '成功率'],
              axisSite: { right: ['成功率'] },
            };
            this.todayCaseSettings = {
              roseType: 'radius'
            };
            return {
              autoRunning: {
                 days:'',
                 hours:'',
                 minutes:'',
                 tasks:'',
                autoRunningLoading:'',
              } ,
              todayRunning:{
                  executeCaseTodayNum:'',
                  successRate:'',
                  todayRunningLoading:''
              } ,
              caseRepertory:{
                  setNum:'',
                  caseNum:'',
                  caseRepertoryLoading:''
              },
              taskRepertory:{
                  taskNum:'',
                  timingTaskNum:'',
                  taskRepertoryLoading:''
              },
              caseHistory: {
                columns: ['日期', '成功用例', '成功率', '失败用例'],
                rows: [
                  { '日期': '2018-01-01', '成功用例': 1393, '失败用例': 1093, '成功率': 0.32 },
                  { '日期': '2018-01-02', '成功用例': 3530, '失败用例': 3230, '成功率': 0.26 },
                  { '日期': '2018-01-03', '成功用例': 2923, '失败用例': 2623, '成功率': 0.76 },
                  { '日期': '2018-01-04', '成功用例': 1723, '失败用例': 1423, '成功率': 0.49 },
                  { '日期': '2018-01-05', '成功用例': 3792, '失败用例': 3492, '成功率': 0.323},
                  { '日期': '2018-01-06', '成功用例': 4593, '失败用例': 4293, '成功率': 0.78 },
                  { '日期': '2018-01-07', '成功用例': 4593, '失败用例': 4293, '成功率': 0.78 }
                ]
              },
              todayCase: {
                columns: ['用例类别', '数量'],
                rows: [

                ]
              },
              todayTask: {
                columns: ['任务情况', '数量'],
                rows: [

                ]
              },
              chartData: {
                columns: ['word', 'count'],
                rows: this.getRows()
              }
            }
        },
        methods:{
          getAutoRunning(){
              this.autoRunning.autoRunningLoading = true;
              this.$axios.get('/apis/dataStatistics/executeInfoNow').then(res=> {
                      if (res.data.code === 200) {
                          this.autoRunning.days = res.data.data.executeTime.day;
                          this.autoRunning.hours = res.data.data.executeTime.hour;
                          this.autoRunning.minutes = res.data.data.executeTime.minute;
                          this.autoRunning.tasks = res.data.data.executeTaskNumNow;
                      } else {
                          this.$notify({title: '操作失败', type: 'warning', message: res.data.msg});
                      }
                  }
              ).catch(err=>{
                  this.$notify({title:'操作失败',type:'error',message:err});
              });
              this.autoRunning.autoRunningLoading = false;
          },
          getTodayRunning(){
              this.todayRunning.todayRunningLoading = true;
              this.$axios.get('/apis/dataStatistics/todayInfo').then(res=> {
                      if (res.data.code === 200) {
                          this.todayRunning.executeCaseTodayNum = res.data.data.executeCaseTodayNum;
                          this.todayRunning.successRate = parseFloat(res.data.data.successRate)*100;
                      } else {
                          this.$notify({title: '操作失败', type: 'warning', message: res.data.msg});
                      }
                  }
              ).catch(err=>{
                  this.$notify({title:'操作失败',type:'error',message:err});
              });
              this.todayRunning.todayRunningLoading = false;
          },
          getTodayCaseInfo(){
              this.$axios.get('/apis/dataStatistics/todayCaseInfo').then(res=> {
                      if (res.data.code === 200) {
                          this.todayCase.rows.push({ '用例类别': '成功用例数', '数量': res.data.data.successNum })
                          this.todayCase.rows.push({ '用例类别': '失败用例数', '数量': res.data.data.falseNum })
                      } else {
                          this.$notify({title: '操作失败', type: 'warning', message: res.data.msg});
                      }
                  }
              ).catch(err=>{
                  this.$notify({title:'操作失败',type:'error',message:err});
              });
          },
            getTodayTASKInfo(){
                this.$axios.get('/apis/dataStatistics/taskExecuteInfo').then(res=> {
                        if (res.data.code === 200) {
                            this.todayTask.rows.push({ '任务情况': '执行中', '数量': res.data.data.taskIsStartNum })
                            this.todayTask.rows.push({ '任务情况': '执行完毕', '数量': res.data.data.taskIsEndNum })
                        } else {
                            this.$notify({title: '操作失败', type: 'warning', message: res.data.msg});
                        }
                    }
                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
            },
          getCaseRepertory(){
              this.caseRepertory.caseRepertoryLoading = true;
              this.$axios.get('/apis/dataStatistics/setInfo').then(res=> {
                      if (res.data.code === 200) {
                          this.caseRepertory.setNum = res.data.data.testCaseSetNum;
                          this.caseRepertory.caseNum = res.data.data.testCaseNum;
                      } else {
                          this.$notify({title: '操作失败', type: 'warning', message: res.data.msg});
                      }
                  }
              ).catch(err=>{
                  this.$notify({title:'操作失败',type:'error',message:err});
              });
              this.caseRepertory.caseRepertoryLoading = false;
          } ,
            getTaskRepertory(){
                this.taskRepertory.taskRepertoryLoading = true;
                this.$axios.get('/apis/dataStatistics/taskInfo').then(res=> {
                        if (res.data.code === 200) {
                            this.taskRepertory.taskNum = res.data.data.taskNum;
                            this.taskRepertory.timingTaskNum = res.data.data.taskIsTimingNum;
                        } else {
                            this.$notify({title: '操作失败', type: 'warning', message: res.data.msg});
                        }
                    }
                ).catch(err=>{
                    this.$notify({title:'操作失败',type:'error',message:err});
                });
                this.taskRepertory.taskRepertoryLoading = false;
            } ,
          getRows(){
            return [{
              'word': '用例集',
              'count': 2
               },
              {
                'word': '测试用例',
                'count': 2
              },
              {
                'word': '自动化测试',
                'count': 2
              },
              {
                'word': '接口',
                'count': 2
              },
              {
                'word': '测试报告',
                'count': 2
              },
              {
                'word': '实时调试',
                'count': 2
              },
              {
                'word': '函数助手',
                'count': 1
              },
              {
                'word': '接口测试',
                'count': 2
              },
              {
                'word': 'Teemo',
                'count': 5
              },
              {
                'word': '提效',
                'count': 1
              },
              {
                'word': '回归测试',
                'count': 1
              },
              {
                'word': '定时任务',
                'count': 2
              },
              {
                'word': '手动任务',
                'count': 2
              },
              {
                'word': '项目',
                'count': 2
              },
              {
                'word': '涨工资',
                'count': 3
              },
              {
                'word': '升职加薪',
                'count': 2
              },
              {
                'word': '迎娶白富美',
                'count': 2
              },
              {
                'word': '自动化进阶之路',
                'count': 2
              },
              {
                'word': '测试开发',
                'count': 3
              },
              {
                'word': '奥利给',
                'count': 1
              },
              {
                'word': '努力奋斗',
                'count': 1
              },
              {
                'word': '加油',
                'count': 1
              },
              {
                'word': '自动化成神',
                'count': 3
              },
              {
                'word': '数据库脚本',
                'count': 2
              },
              {
                'word': '数据源',
                'count': 2
              },
              {
                'word': 'HTTP',
                'count': 2
              },
              {
                'word': 'HTTPS',
                'count': 2
              },
              {
                'word': 'WebClient',
                'count': 2
              },
              {
                'word': 'PostMan',
                'count': 2
              },
              {
                'word': 'Jmeter',
                'count': 2
              },
              {
                'word': 'Java',
                'count': 2
              },
              {
                'word': 'Python',
                'count': 2
              },
              {
                'word': 'Mysql',
                'count': 2
              },
              {
                'word': 'Redis',
                'count': 2
              },
              {
                'word': 'Requests',
                'count': 2
              },
              {
                'word': 'HttpClient',
                'count': 2
              },
              {
                'word': 'Pytest',
                'count': 2
              },
              {
                'word': 'TestNG',
                'count': 2
              },
              {
                'word': 'JUnit 4',
                'count': 2
              },
              {
                'word': 'Unittest',
                'count': 2
              },
              {
                'word': 'HttpRunner',
                'count': 2
              },
              {
                'word': 'RobotFrameWork',
                'count': 2
              },
              {
                'word': 'Excel',
                'count': 2
              },
              {
                'word': 'Jenkins',
                'count': 2
              },
              {
                'word': 'SpringBoot',
                'count': 2
              },
              {
                'word': 'Maven',
                'count': 2
              },
              {
                'word': 'Docker',
                'count': 2
              },
              {
                'word': 'Linux',
                'count': 2
              },
              {
                'word': 'Windows',
                'count': 2
              },
              {
                'word': 'Vue',
                'count': 2
              },
              {
                'word': 'Echarts',
                'count': 2
              },
              {
                'word': 'Swagger',
                'count': 2
              },
              {
                'word': '关键字驱动',
                'count': 2
              },
              {
                'word': '自动化框架',
                'count': 2
              },
              {
                'word': '数据驱动',
                'count': 2
              },
              {
                'word': '单元测试框架',
                'count': 2
              },
              {
                'word': '接口关联',
                'count': 2
              },
              {
                'word': '接口断言',
                'count': 2
              },
              {
                'word': '参数化',
                'count': 2
              },
              {
                'word': '邮件通知',
                'count': 2
              }
            ]
          }
        },
        created() {
            this.getAutoRunning();
            this.getTodayRunning();
            this.getCaseRepertory();
            this.getTaskRepertory();
            this.getTodayCaseInfo();
            this.getTodayTASKInfo();
        }
    }
</script>

<style scoped>

  #main{

  }

  .card {
    display: inline-block;
    margin: 2%;
    width:  20%;
    height: 200px;
    border-radius:10px;
    text-align: left;

  }

  .chead {
    text-align: left;
    font-size: x-small;
    font-weight: bold;
  }

  .content {
    font-size: large;
  }

  .bottom {
    margin-top: 50PX;
    font-size: x-small;
    font-weight: bold;
  }

  .tag {
    float: right;
  }

  .today {
    display: inline-block;
    width: 49%;
  }
</style>
