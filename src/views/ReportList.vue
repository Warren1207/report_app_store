<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="报告名称"></el-input
      ></el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.status" clearable placeholder="状态">
          <el-option label="成功" :value="1"> </el-option>
          <el-option label="失败" :value="2"> </el-option>
          <el-option label="进行中" :value="0"> </el-option> </el-select
      ></el-col>
      <el-col :span="3">
        <el-select
          v-model="queryParams.scenes"
          clearable
          placeholder="任务场景"
        >
          <el-option
            v-for="(item, index) in scenesArray"
            :key="index"
            :label="item.name"
            :value="item.name"
          >
          </el-option> </el-select
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
        <el-table-column
          prop="scenesname"
          label="任务场景"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="name" label="报告名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ statusObj[scope.row.state] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type === 0 ? "手动" : "自动" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进度条">
          <template slot-scope="scope">
            <span>{{ scope.row.rateprogress + "%" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="downloadcount" label="下载次数">
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间"> </el-table-column>
        <el-table-column prop="updatetime" label="更新时间"> </el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="downloadFn(scope.row)"
              >下载</el-button
            >
          </template>
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
import config from "@/libs/config";
export default {
  name: "reportlist",
  data() {
    return {
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      queryData: [],
      scenesArray: [],
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
    queryScene() {
      this.$fetch("/scenes/index").then(res => {
        this.scenesArray = res.Data;
      });
    },
    pageSizeFn(val) {
      this.queryParams.pageSize = val;
      this.queryFn();
    },
    pageChangeFn(val) {
      this.queryParams.pageIndex = val;
      this.queryFn();
    },
    downloadFn(row) {
      window.location.href =
        config.baseUrl + "File/FileDownload?FilePath=" + row.downloadurl;
    }
  },
  created() {
    this.queryFn();
    this.queryScene();
  }
};
</script>

<style lang="scss" scoped></style>
