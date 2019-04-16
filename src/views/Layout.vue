<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <i class="icon iconfont icon-menu"></i>
        <div class="logo"></div>
      </div>
      <div class="header-right">admin</div>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color:#191919">
        <el-menu
          :default-active="currentRoute"
          class="el-menu-vertical-demo"
          background-color="#191919"
          text-color="#ffffff"
          active-text-color="#0057ff"
          :router="true"
        >
          <el-menu-item index="/reportList">
            <i class="icon iconfont icon-baogaoliebiao"></i>
            <span slot="title">报告列表</span>
          </el-menu-item>
          <el-menu-item index="/uploadStation">
            <i class="icon iconfont icon-gongcanshangchuan"></i>
            <span slot="title">工参上传</span>
          </el-menu-item>
          <el-menu-item index="/uploadReport">
            <i class="icon iconfont icon-mobanshangchuan"></i>
            <span slot="title">报告模板上传</span>
          </el-menu-item>
          <el-menu-item index="/taskPlan">
            <i class="icon iconfont icon-jihuarenwu"></i>
            <span slot="title">计划任务</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>© Copyright 2009-2019 报告应用商店</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "layout",
  data() {
    return {
      currentRoute: ""
    };
  },
  created() {
    this.currentRoute = this.$router.currentRoute.path;
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #191919;
  line-height: 60px;
  color: #ffffff;
  .header-left {
    float: left;
    .logo {
      width: 203px;
      height: 41px;
      background: url("../assets/logo.png");
      border-radius: 3px;
      float: right;
      position: relative;
      top: 7px;
      left: 25px;
    }
  }
  .header-right {
    float: right;
  }
}
.el-footer {
  color: #c1c1c1;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  text-align: left;
}

.el-main {
  background-color: #fafafa;
  color: #333;
  text-align: center;
}
.el-menu {
  border-right: 0;
}
.el-menu-item.is-active {
  border-left: 3px solid #409eff;
  background-color: #fafafa !important;
}
.el-menu-item i {
  color: #ffffff;
}
body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
