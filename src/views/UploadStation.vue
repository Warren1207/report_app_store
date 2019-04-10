<template>
  <div class="wrap">
    <el-row>
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="工参名称"></el-input
      ></el-col>
      <el-col :span="4">
        <el-select v-model="queryParams.status" clearable placeholder="状态">
          <el-option label="启用" :value="1"> </el-option>
          <el-option label="停用" :value="2"> </el-option>
          <el-option label="删除" :value="3"> </el-option> </el-select
      ></el-col>
      <el-col :span="4" style="text-align: left;">
        <el-button type="primary" @click="queryFn">搜索</el-button>
      </el-col>
    </el-row>
    <div class="opera-wrap">
      <div class="opera-item" @click="addStation()">
        <i class="icon iconfont icon-xinzeng"></i>
        <span>添加工参</span>
      </div>
      <div class="opera-item" @click="modifyStation(1)">
        <i class="icon iconfont icon-qiyong"></i>
        <span>启用</span>
      </div>
      <div class="opera-item" @click="modifyStation(2)">
        <i class="icon iconfont icon-tingyong"></i>
        <span>停用</span>
      </div>
      <div class="opera-item" @click="modifyStation(3)">
        <i class="icon iconfont icon-shanchu"></i>
        <span>删除</span>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        ref="uploadStationTable"
        :data="queryData"
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="filename" label="文件名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ statusObj[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobilemode" label="制式"> </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="pageSizeFn"
      @current-change="pageChangeFn"
      :current-page="queryParams.pageIndex"
      :page-sizes="[10, 20, 30, 100]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageCount"
    >
    </el-pagination>
    <div class="pagination-wrap"></div>
  </div>
</template>

<script>
export default {
  name: "uploadstation",
  data() {
    return {
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      pageCount: 0,
      queryData: [],
      statusObj: {
        1: "启用",
        2: "停用",
        3: "删除"
      }
    };
  },
  methods: {
    queryFn() {
      this.$fetch("/BaseStation/GetBaseStationList", this.queryParams).then(
        res => {
          this.queryData = res.Data;
          this.pageCount = res.TotalCount;
        }
      );
    },
    pageSizeFn(val) {
      this.queryParams.pageSize = val;
      this.queryFn();
    },
    pageChangeFn(val) {
      this.queryParams.pageIndex = val;
      this.queryFn();
    },
    modifyStation(Status) {
      const selected = this.$refs["uploadStationTable"].selection;
      if (selected.length !== 1) {
        this.$message({
          message: "请选择一条数据！",
          type: "warning"
        });
      } else {
        const Id = selected[0].id;
        this.$post("/BaseStation/UpdateBaseStation", { Id, Status }).then(
          res => {
            if (res.State === 0) {
              this.$message({
                message: "操作成功！",
                type: "success"
              });
              this.queryFn();
            } else {
              this.$message.error("操作失败！");
            }
          }
        );
      }
    }
  },
  created() {
    this.queryFn();
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-wrap {
    flex: 1;
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
        font-size: 30px;
        position: absolute;
        left: 0;
      }
      > span {
        line-height: 30px;
        font-size: 15px;
      }
    }
  }
}
</style>
