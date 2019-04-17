<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="工参名称"></el-input
      ></el-col>
      <el-col :span="3">
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
      <div class="opera-item" @click="addTemplate = true">
        <i class="icon iconfont icon-xinzeng"></i>
        <span>添加模板</span>
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
        <el-table-column prop="name" label="模板名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ statusObj[scope.row.status] }}</span>
          </template>
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
    <el-dialog title="添加模板" :visible.sync="addTemplate" width="30%">
      <el-form
        ref="templateFrom"
        :model="templateInfo"
        :rules="rules"
        label-position="right"
        label-width="80px"
        style="text-align: left;"
      >
        <el-form-item label="模板名称" prop="Name">
          <el-input
            v-model="templateInfo.Name"
            autocomplete="off"
            style="width:300px;margin-right:10px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板路径" prop="Path">
          <el-input
            v-model="templateInfo.Path"
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
        <el-form-item label="配置路径" prop="XmlPath">
          <el-input
            v-model="templateInfo.XmlPath"
            autocomplete="off"
            :readonly="true"
            style="width:300px;margin-right:10px;"
          ></el-input>
          <el-upload
            class="upload-demo"
            style="display: inline-block;"
            :action="uploadXmlUrl"
            :data="paramXml"
            :show-file-list="false"
            :on-success="uploadCompletedXml"
            :before-upload="uploadValidXml"
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
  name: "uploadreport",
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
      paramRt: {
        isXml: false
      },
      paramXml: {
        isXml: true
      },
      addTemplate: false,
      rules: {
        Name: [{ required: true, message: "请填写模板名称", trigger: "blur" }],
        Path: [{ required: true, message: "请上传模板", trigger: "blur" }],
        XmlPath: [
          { required: true, message: "请上传模板配置", trigger: "blur" }
        ]
      },
      templateInfo: {
        Name: "",
        Path: "",
        XmlPath: ""
      },
      uploadXmlUrl: config.baseUrl + "ReportTemplate/UploadReportTemplate",
      uploadRtUrl: config.baseUrl + "ReportTemplate/UploadReportTemplate",
      uploadHeaders: {
        Token: store.getters.Token
      }
    };
  },
  methods: {
    queryFn() {
      this.$fetch(
        "/ReportTemplate/GetReportTemplateList",
        this.queryParams
      ).then(res => {
        this.queryData = res.Data;
        this.pageCount = res.TotalCount;
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
    delFn(Id, Status) {
      this.$post("/ReportTemplate/UpdateReportTemplate", { Id, Status }).then(
        res => {
          if (res.State === 0) {
            this.$message({
              message: "操作成功！",
              type: "success"
            });
            this.queryFn();
          } else {
            this.$message.error(res.Message);
          }
        }
      );
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
        if (Status === 3) {
          this.$confirm("是否确认删除此数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.delFn(Id, Status);
          });
        } else {
          this.delFn(Id, Status);
        }
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
    uploadValidXml(file) {
      const isXml = file.name.replace(/.+\./, "").toLowerCase() === "xml";
      if (!isXml) {
        this.$message.error("只能上传xml文件!");
      }
      return isXml;
    },
    uploadCompletedRt(res) {
      if (res.State === 0) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
        this.templateInfo.Path = res.Data;
      } else {
        this.$notify.error({
          title: "模板上传错误",
          message: res.Message,
          duration: 0
        });
      }
    },
    uploadCompletedXml(res) {
      if (res.State === 0) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
        this.templateInfo.XmlPath = res.Data;
      } else {
        this.$notify.error({
          title: "模板配置上传错误",
          message: res.Message,
          duration: 0
        });
      }
    },
    saveTemplate() {
      this.$refs["templateFrom"].validate(valid => {
        if (valid) {
          this.$post(
            "/ReportTemplate/AddReportTemplate",
            this.templateInfo
          ).then(res => {
            if (res.State === 0) {
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.addTemplate = false;
              this.templateInfo = {
                Name: "",
                Path: "",
                XmlPath: ""
              };
              this.queryFn();
            } else {
              this.$message.error("保存失败!");
            }
          });
        }
      });
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
