<template>
  <div class="login-container" @keyup.13="loginFn">
    <div class="from-wrapper-outside"></div>
    <div class="login-from-wrapper">
      <div class="login-from-inner">
        <div class="login-from-icon"></div>
        <el-form
          ref="loginFrom"
          :model="loginFromData"
          :rules="rules"
          class="login-from"
          @submit.native.prevent="loginFn"
        >
          <el-form-item prop="UserName">
            <el-input
              class="log_in_input"
              v-model="loginFromData.UserName"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="PassWord">
            <el-input
              class="log_in_input"
              v-model="loginFromData.PassWord"
              placeholder="密码"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col>
                <el-button
                  v-loading="loading"
                  type="primary"
                  @click="loginFn"
                  :style="{ width: '100%' }"
                  >登录</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginFromData: {},
      rules: {
        UserName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        PassWord: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    loginFn() {
      this.loading = true;
      this.$refs["loginFrom"].validate(valid => {
        if (valid) {
          this.$post("/Account/Login", this.loginFromData).then(res => {
            this.loading = false;
            if (res.State === 0) {
              store.commit("setToken", res.Data.Token);
              localStorage.setItem("report_app_token", res.Data.Token);
              this.$router.push({
                name: "Layout"
              });
            } else {
              this.$message.error(res.Message);
            }
          });
        } else {
          this.loading = false;
          this.$message({
            message: "请输入用户名及密码",
            type: "warning"
          });
          return false;
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: url("../assets/bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  .from-wrapper-outside {
    width: 420px;
    height: 470px;
    background-color: #000000;
    opacity: 0.15;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .login-from-wrapper {
    width: 400px;
    height: 450px;
    background-color: #ffffff;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-flow: column;
    .login-from-inner {
      width: 100%;
      height: 100%;
      .login-from-icon {
        background: url("../assets/log_in.png") no-repeat center;
        width: 171px;
        height: 103px;
        margin: auto;
        margin-top: 30px;
      }
      .login-from {
        margin-top: 25px;
        padding: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
.log_in_input > .el-input__inner {
  border: none;
  border-bottom: 2px solid #dcdfe6;
  border-radius: 0;
  &:focus {
    border-color: #61daa5;
  }
}
</style>
