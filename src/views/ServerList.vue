<template>
  <div class="wrap">
    <el-row>
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="文件名称"></el-input
      ></el-col>
      <el-col :span="4" style="text-align: left;">
        <el-button type="primary" @click="queryFn">搜索</el-button>
      </el-col>
    </el-row>
    <div class="opera-wrap">
      <div class="opera-item" @click="addTemplate = true">
        <i class="icon iconfont icon-xinzeng"></i>
        <span>添加文件</span>
      </div>
      <div class="opera-item" @click="modifyStation()">
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
        <el-table-column prop="filename" label="文件名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createdate"
          label="创建时间"
          show-overflow-tooltip
        >
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
    <el-dialog title="添加文件" :visible.sync="addTemplate" width="30%">
      <el-form
        ref="templateFrom"
        :model="templateInfo"
        :rules="rules"
        label-position="right"
        label-width="80px"
        style="text-align: left;"
      >
        <!-- <el-form-item label="文件名称" prop="Name">
          <el-input
            v-model="templateInfo.Name"
            autocomplete="off"
            style="width:300px;margin-right:10px;"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="文件路径" prop="fileurl">
          <el-input
            v-model="templateInfo.fileurl"
            autocomplete="off"
            :readonly="true"
            style="width:300px;margin-right:10px;"
          ></el-input>
          <el-upload
            class="upload-demo"
            style="display: inline-block;"
            :action="uploadRtUrl"
            :data="paramRt"
            :show-file-list="false"
            :on-success="uploadCompletedRt"
            :before-upload="uploadValidRt"
            :headers="uploadHeaders"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTemplate = false">取 消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/libs/config";
import store from "@/store";
export default {
  name: "serverlist",
  data() {
    return {
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      pageCount: 0,
      queryData: [],
      paramRt: {
        isXml: false
      },
      addTemplate: false,
      rules: {
        // Name: [{ required: true, message: "请填写文件名称", trigger: "blur" }],
        fileurl: [{ required: true, message: "请上传文件", trigger: "blur" }]
      },
      templateInfo: {
        // Name: "",
        fileurl: ""
      },
      uploadRtUrl:
        config.baseUrl + "TemplateResourceManage/UploadTemplateResource",
      uploadHeaders: {
        Token: store.getters.Token
      }
    };
  },
  methods: {
    queryFn() {
      this.$fetch("/TemplateResourceManage/Index", this.queryParams).then(
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
    modifyStation() {
      const selected = this.$refs["uploadStationTable"].selection;
      if (selected.length !== 1) {
        this.$message({
          message: "请选择一条数据！",
          type: "warning"
        });
      } else {
        const Id = selected[0].id;
        this.$post("/TemplateResourceManage/Delete", { Id }).then(res => {
          if (res.State === 0) {
            this.$message({
              message: "操作成功！",
              type: "success"
            });
            this.queryFn();
          } else {
            this.$message.error("操作失败！");
          }
        });
      }
    },
    uploadValidRt(file) {
      const type = file.name.replace(/.+\./, "").toLowerCase();
      let isRT = false;
      if (type === "rtlx" || type === "rtl") {
        isRT = true;
      }
      if (!isRT) {
        this.$message.error("只能上传rtlx、rtl文件!");
      }
      return isRT;
    },
    uploadCompletedRt(res) {
      if (res.State === 0) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
        this.templateInfo.fileurl = res.Data;
      } else {
        this.$notify.error({
          title: "文件上传错误",
          message: res.Message,
          duration: 0
        });
      }
    },
    saveTemplate() {
      this.$refs["templateFrom"].validate(valid => {
        if (valid) {
          console.log(this.templateInfo);
          this.$post("/TemplateResourceManage/Create", this.templateInfo).then(
            res => {
              if (res.State === 0) {
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
                this.addTemplate = false;
                this.templateInfo = {
                  // Name: "",
                  fileurl: ""
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
    downloadFn(row) {
      window.location.href =
        config.baseUrl + "File/FileDownload?FilePath=" + row.fileurl;
    }
  },
  created() {
    this.queryFn();
  }
};
</script>

<style lang="scss" scoped></style>
