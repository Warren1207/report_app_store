<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  .table-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 15px 0;
  }
  .opera-wrap {
    text-align: left;
    padding: 10px 0;
    .opera-item {
      display: inline-block;
      padding-left: 35px;
      position: relative;
      color: #666;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
      > i {
        font-size: 20px;
        position: absolute;
        left: 3px;
        top: 3px;
      }
      > span {
        line-height: 30px;
        font-size: 15px;
      }
    }
  }
}
</style>
