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
            <span style="margin-left: 10px">{{
              statusObj[scope.row.status]
            }}</span>
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
}
</style>
