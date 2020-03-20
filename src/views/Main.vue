<template>
  <div id="main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>/</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>自动化已运行</span>
          <el-tag effect="dark" class="tag" size="mini">持续</el-tag>
        </div>
        <span class="content" style="color: deepskyblue"> 0 天 0 小时 0 分钟</span>
        <div class="bottom"><span>正在执行任务 10 个</span></div>
      </el-card>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>今日执行情况</span>
          <el-tag effect="dark" class="tag" size="mini" type="warning">运行</el-tag>
        </div>
        <span  class="content" style="color: #ffcd32">已执行用例 300 条</span>
        <div class="bottom"><span>成功率 90% </span></div>
      </el-card>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>用例库</span>
          <el-tag effect="dark" class="tag" size="mini" type="danger">库存</el-tag>
        </div>
        <span  class="content" style="color: #ff4d51;">用例集库存 100 条</span>
        <div class="bottom"><span>包含用例 1000 条</span></div>
      </el-card>
      <el-card shadow="hover" class="card">
        <div slot="header" class="chead">
          <span>任务库</span>
          <el-tag effect="dark" class="tag" size="mini" type="success">库存</el-tag>
        </div>
        <span  class="content" style="color: #13ce66">普通任务 20 个</span>
        <div class="bottom"><span>已开启定时任务  10 个</span></div>
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
                  { '用例类别': '成功用例数', '数量': 1393 },
                  { '用例类别': '失败用例数', '数量': 3530 }
                ]
              },
              todayTask: {
                columns: ['任务情况', '访问用户'],
                rows: [
                  { '任务情况': '执行中', '访问用户': 1393 },
                  { '任务情况': '执行完毕', '访问用户': 3530 },
                  { '任务情况': '待执行', '访问用户': 2923 },
                ]
              },
              chartData: {
                columns: ['word', 'count'],
                rows: this.getRows()
              }
            }
        },
        methods:{
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
