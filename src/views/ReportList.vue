<template>
  <div class="wrap">
    <el-row>
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="报告名称"></el-input
      ></el-col>
      <el-col :span="4">
        <el-select v-model="queryParams.status" clearable placeholder="状态">
          <el-option label="成功" :value="1"> </el-option>
          <el-option label="失败" :value="2"> </el-option>
          <el-option label="进行中" :value="0"> </el-option> </el-select
      ></el-col>
      <el-col :span="4" style="text-align: left;">
        <el-button type="primary" @click="queryFn">搜索</el-button>
      </el-col>
    </el-row>
    <div class="table-wrap">
      <el-table
        ref="reportTable"
        :data="queryData"
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="55"> </el-table-column>
        <el-table-column prop="Name" label="报告名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ statusObj[scope.row.State] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.Type === 0 ? "手动" : "自动" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进度条">
          <template slot-scope="scope">
            <span>{{ scope.row.RateProgress + "%" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DownloadCount" label="下载次数">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间"> </el-table-column>
        <el-table-column prop="UpdateTime" label="更新时间"> </el-table-column>
        <el-table-column prop="Remarks" label="备注" show-overflow-tooltip>
        </el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "reportlist",
  data() {
    return {
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      queryData: [],
      pageCount: 0,
      statusObj: {
        1: "成功",
        2: "失败",
        0: "进行中"
      }
    };
  },
  methods: {
    queryFn() {
      this.$fetch("/TaskReport/GetTaskReportList", this.queryParams).then(
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

<style lang="scss" scoped></style>
