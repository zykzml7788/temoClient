<template>
  <el-dialog title="新建用例" :visible.sync="$store.state.addcaseshow" :modal-append-to-body="false">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="用例描述" prop="desc">
        <el-input v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="接口地址" prop="url">
        <el-input v-model="ruleForm.url"></el-input>
      </el-form-item>
      <el-form-item label="请求方式" prop="method" style="text-align: left" inline="true">
        <el-select v-model="ruleForm.method" placeholder="请求类型">
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
          <el-option label="PUT" value="PUT"></el-option>
          <el-option label="DELETE" value="DELETE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库" prop="database" style="text-align: left" inline="true">
        <el-select v-model="ruleForm.database" placeholder="数据库">
          <el-option label="Mysql" value="Mysql"></el-option>
          <el-option label="Redis" value="Redis"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求头部" prop="header">
        <el-input type="textarea" v-model="ruleForm.header" rows="8"></el-input>
      </el-form-item>
      <el-form-item label="Cookies" prop="cookies">
        <el-input type="textarea" v-model="ruleForm.cookies" rows="8"></el-input>
      </el-form-item>
      <el-form-item label="请求参数" prop="param">
        <el-input type="textarea" v-model="ruleForm.param" rows="8"></el-input>
      </el-form-item>
      <el-form-item label="请求体" prop="body">
        <el-input type="textarea" v-model="ruleForm.body" rows="8"></el-input>
      </el-form-item>
      <el-form-item label="请求文件" prop="file" style="text-align: left">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="响应断言" prop="verify">
        <el-input v-model="ruleForm.verify"></el-input>
      </el-form-item>
      <el-form-item label="参数关联" prop="saves">
        <el-input v-model="ruleForm.saves"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          desc: '',
          url: '',
          method: '',
          header: '',
          cookies:'',
          param: '',
          body: '',
          file:'',
          verify:'',
          saves: '',
          database:''
        },
        rules: {
          name: [
            { required: true, message: '请输入用例描述', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请输入接口地址', trigger: 'blur' },
          ],
          method: [
            { required: true, message: '请选择请求方式', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请输入用例描述', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          verify: [
            {required: true,message: '请输入断言',trigger:'blur'}
          ],
        },
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
  };
</script>
