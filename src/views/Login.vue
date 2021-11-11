<template>
  <div class="login-container">
    <el-form
      :model="loginInfo"
      :rules="rules2"
      status-icon
      ref="ruleForm2"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title" style="color: white">Teemo Login</h3>
      <el-form-item prop="userName">
        <el-input
          type="text"
          v-model="loginInfo.userName"
          auto-complete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginInfo.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-checkbox
        v-model="checked"
        class="rememberme"
        style="color: white; float: left; margin: 5px 0 10px 0"
        >Remember Me
      </el-checkbox>
      <el-link type="primary" style="float: right" href="https://www.baidu.com"
        >没有账号？点击注册</el-link
      >
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%"
          @click="handleSubmit"
          :loading="logining"
          >Login</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logining: false,
      loginInfo: {
        userName: "",
        password: "",
      },
      rules2: {
        userName: [
          {
            required: true,
            message: "please enter your account",
            trigger: "change",
          },
        ],
        password: [
          { required: true, message: "enter your password", trigger: "change" },
        ],
      },
      checked: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$router.push({ path: "/main" });
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.$axios.post("/apis/login", this.loginInfo).then((res) => {
            if (true) {
              localStorage.setItem("userInfo", JSON.stringify(res.data.data));
              this.$router.push({ path: "/main" });
            } else {
              this.$alert(res.data.msg, "登入失败");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  padding-top: 180px;
  text-align: center;
}
.login-page {
  opacity: 0.75;
  background-color: dimgray;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 0 auto;
  width: 350px;
  padding: 35px 35px 15px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label .el-checkbox .rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>
