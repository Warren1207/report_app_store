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
      <div class="opera-item" @click="addStation = true">
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
        <el-table-column type="index" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="filename" label="文件名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ statusObj[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobilemode" label="制式"> </el-table-column>
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
    <el-dialog title="添加工参" :visible.sync="addStation" width="30%">
      <el-form
        ref="stationFrom"
        :model="stationInfo"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="工参名称" prop="Name">
          <el-input v-model="stationInfo.Name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="制式" prop="MobileMode">
          <el-input
            v-model="stationInfo.MobileMode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="Path">
          <el-input
            v-model="stationInfo.Path"
            autocomplete="off"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        drag
        :action="uploadAction"
        :show-file-list="false"
        :on-success="uploadCompleted"
        :before-upload="uploadValid"
        :headers="uploadHeaders"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span style="color:red;"
        >注：工参excel必须完全按照模板内容的格式。<a
          href="#"
          @click="downLoadTemplate"
          >点击下载模板。</a
        ></span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStation = false">取 消</el-button>
        <el-button type="primary" @click="saveStation">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/libs/config";
import store from "@/store";
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
      },
      stationInfo: {
        Name: "",
        MobileMode: "",
        Path: ""
      },
      rules: {
        Name: [{ required: true, message: "请填写工参名称", trigger: "blur" }],
        MobileMode: [
          { required: true, message: "请填写制式", trigger: "blur" }
        ],
        Path: [{ required: true, message: "请上传工参", trigger: "blur" }]
      },
      addStation: false,
      uploadAction: config.baseUrl + "/BaseStation/UploadBaseStation",
      uploadHeaders: {
        Token: store.getters.Token
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
    },
    saveStation() {
      this.$refs["stationFrom"].validate(valid => {
        if (valid) {
          this.$post("/BaseStation/AddBaseStation", this.stationInfo).then(
            res => {
              if (res.State === 0) {
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
                this.addStation = false;
                this.stationInfo = {
                  Name: "",
                  MobileMode: "",
                  Path: ""
                };
                this.queryFn();
              } else {
                this.$message.error("保存失败!");
              }
            }
          );
        }
      });
    },
    uploadValid(file) {
      const isExcel = file.name.replace(/.+\./, "").toLowerCase() === "xlsx";
      if (!isExcel) {
        this.$message.error("上传工参只能是 xlsx 格式!");
      }
      return isExcel;
    },
    uploadCompleted(res) {
      if (res.State === 0) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
        this.stationInfo.Path = res.Data;
      } else {
        this.$notify.error({
          title: "工参上传错误",
          message: res.Message,
          duration: 0
        });
      }
    },
    downLoadTemplate() {
      window.location.href =
        config.baseUrl +
        "File/FileDownload?FilePath=" +
        config.stationTemplateUrl;
    },
    downloadFn(row) {
      window.location.href =
        config.baseUrl + "File/FileDownload?FilePath=" + row.path;
    }
  },
  created() {
    this.queryFn();
  }
};
</script>

<style lang="scss" scoped></style>
