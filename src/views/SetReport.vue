<template>
  <div class="wrap" style="height:0;" v-loading="loading">
    <el-form label-position="right" :rules="rules" :model="reportInfo" ref="reportFrom" label-width="270px" style="overflow-y: auto;">
      <el-card class="box-card">
        <div slot="header" class="header">
          <span>报表命名</span>
        </div>
        <div>
          <el-form-item label="报告名称" prop="Name">
            <el-input v-model="reportInfo.Name"></el-input>
          </el-form-item>
          <el-form-item label="报告描述" prop="Desc">
            <el-input type="textarea" v-model="reportInfo.Desc"></el-input>
          </el-form-item>
          <el-form-item label="服务器" prop="ServerId">
            <el-select v-model="reportInfo.ServerId" clearable placeholder="请选择服务器" style="width:100%">
              <el-option v-for="(item, index) in serverList" :key="index" :label="item.Name" :value="item.Id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参数模板" prop="Template">
            <el-select v-model="reportInfo.Template" clearable placeholder="请选择参数模板" style="width:100%" @visible-change="loadTemp">
              <el-option v-for="(item, index) in tempList" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件列表" prop="FileNames">
            <el-input placeholder="请选择文件" :readonly="true" v-model="reportInfo.FileNames">
              <el-button @click="showFiledialog" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="资源文件" prop="resourceFile">
            <el-input v-model="reportInfo.resourceFile"></el-input>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="header">
          <span>模板</span>
        </div>
        <div>
          <el-form-item label="模板名称" prop="templateName">
            <el-input placeholder="模板名称" v-model="reportInfo.templateName" :readonly="true" class="input-with-select">
              <el-button slot="append" v-if="selectIsShow" @click="templatList">选中模板</el-button>
            </el-input>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="header">
          <span>参数</span>
        </div>
        <div>
          <div v-for="(value, key, index) in reportInfo.Parameters" :key="index">
            <fieldset v-if="filterFn(value)" class="field-set-wrap">
              <legend>{{ value["@Text"] }}</legend>
              <attr-field :attr.sync="value" :title="value['@Text']" :serverId="reportInfo.ServerId"></attr-field>
            </fieldset>
          </div>
        </div>
      </el-card>
      <el-form-item>
        <el-button type="primary" @click="saveFun">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择文件" :visible.sync="showFileDlg">
      <div style="max-height:350px;overflow-y: auto;">
        <el-tree :props="fileTreeProps" :load="loadFileTreeFn" node-key="Id" lazy ref="fileTree" show-checkbox>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFileDlg = false">取 消</el-button>
        <el-button type="primary" @click="saveFiles">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择模板" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" ref="uploadStationTable" @selection-change="chooseInstance" class="removeCheckbox">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column property="createdate" label="上传日期"></el-table-column>
        <el-table-column property="name" label="模板名称"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AttrField from "@/components/AttrField.vue";
export default {
  name: "setreport",
  components: {
    AttrField
  },
  data() {
    return {
      loading: false,
      input5: "",
      gridData: [],
      dialogTableVisible: false,
      saveData: "",
      templateId: "",
      read_only: false,
      selectIsShow: true,
      whatButton: "保存",
      saveIsShow: false,
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      fieldEnum: {
        MultiplTreeView: "el-input",
        TextBox: "el-input",
        FolderBrowserDialog: "el-input",
        ListBox: "el-select",
        CheckBox: "el-checkbox",
        DateTimePicker: "el-date-picker",
        NumberBox: "el-input"
      },
      pageCount: 0,
      parameter: [],
      parameterChlid: [],
      /** Modify by Warren Lee 2019-04-30  **/
      rules: {
        Name: [
          { required: true, message: "请填写报告名称", trigger: "blur" },
          { max: 50, message: "长度不能大于 50 个字符", trigger: "blur" }
        ],
        Desc: [{ max: 50, message: "长度不能大于 50 个字符", trigger: "blur" }],
        ServerId: [
          { required: true, message: "请选择服务器", trigger: "change" }
        ],
        Template: [
          { required: true, message: "请选择参数模板", trigger: "change" }
        ],
        FileNames: [
          { required: true, message: "请选择文件", trigger: "change" }
        ],
        resourceFile: [
          { max: 50, message: "长度不能大于 50 个字符", trigger: "blur" }
        ],
        templateName: [
          { required: true, message: "请选择模板", trigger: "change" }
        ]
      },
      showFileDlg: false,
      reportInfo: {},
      serverList: [],
      tempList: [],
      fileTreeProps: {
        label: "Text",
        isLeaf: function(data) {
          return !data.Children;
        }
      },
      testList: []
    };
  },
  methods: {
    templatList() {
      this.dialogTableVisible = true;
      this.$fetch(
        "/ReportTemplate/GetReportTemplateList",
        this.queryParams
      ).then(res => {
        this.gridData = res.Data;
        this.pageCount = res.TotalCount;
      });
    },
    chooseInstance(val) {
      if (val.length > 1) {
        this.$refs["uploadStationTable"].clearSelection();
        this.$refs["uploadStationTable"].toggleRowSelection(val.pop());
      }
    },
    saveTemplate() {
      this.loading = true;
      this.dialogTableVisible = false;
      const selected = this.$refs["uploadStationTable"].selection;
      if (selected.length !== 0) {
        this.reportInfo.templateId = selected[0].id;
        this.reportInfo.templateName = selected[0].name;
        this.$fetch("/ReportTemplate/GetReportTemplateXml", {
          id: this.reportInfo.templateId
        }).then(res => {
          if (res.State === 0) {
            this.loading = false;
            this.reportInfo["Parameters"] = JSON.parse(res.Data).Parameters;
          } else {
            this.$message.warning(res.Message);
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
        this.$message.warning("请选择模板！");
      }
    },
    saveFun() {
      this.$refs["reportFrom"].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.reportInfo));
          params.xmlcontent = JSON.stringify(params.Parameters);
          delete params.Parameters;
          params.reporttemplateid = this.reportInfo.templateId;
          this.$post("/TaskReport/CreateReport", params).then(res => {
            if (res.State === 0) {
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.$router.push({
                name: "reportList"
              });
            } else {
              this.$message.error("保存失败！");
            }
          });
        }
      });
    },
    queryServerList() {
      this.$fetch("/Ftp/GetFtpList", { status: 1 }).then(res => {
        this.serverList = res.Data;
      });
    },
    loadTemp(show) {
      if (this.reportInfo.ServerId) {
        if (show && this.tempList.length === 0) {
          this.$post("/TaskReport/GetParameterTemplates", {
            id: this.reportInfo.ServerId
          }).then(res => {
            if (res.Data) {
              this.tempList = res.Data;
            } else {
              this.$message({
                message: "没有查询到此服务器的参数模板！",
                type: "warning"
              });
            }
          });
        }
      } else {
        this.$message({
          message: "请先选择服务器！",
          type: "warning"
        });
      }
    },
    showFiledialog() {
      if (this.reportInfo.ServerId) {
        this.showFileDlg = true;
      } else {
        this.$message({
          message: "请先选择服务器！",
          type: "warning"
        });
      }
    },
    loadFileTreeFn(node, resolve) {
      if (node.level === 0) {
        this.$post("/TaskReport/GetFTPTree", {
          id: this.reportInfo.ServerId,
          Path: ""
        }).then(res => {
          if (res.State === 0) {
            return resolve(res.Data);
          } else {
            return resolve([]);
          }
        });
      } else if (node.level >= 1) {
        this.$post("/TaskReport/GetFTPTree", {
          id: this.reportInfo.ServerId,
          Path: node.data.Id
        }).then(res => {
          if (res.State === 0) {
            return resolve(res.Data);
          } else {
            return resolve([]);
          }
        });
      }
    },
    saveFiles() {
      const selectNodes = this.$refs["fileTree"].getCheckedNodes();
      let names = [],
        ids = [];
      selectNodes.map(function(node) {
        names.push(node.Text);
        ids.push(node.Id);
      });
      this.reportInfo.FileNames = names.toString();
      this.reportInfo.FileIds = ids.toString();
      this.showFileDlg = false;
    },
    filterFn(value) {
      if (value === null) {
        return false;
      } else if (value["@Text"] === "Streams") {
        return false;
      }
      return true;
    },
    queryField(value) {
      if (value["@ComponentType"]) {
        return [value];
      } else {
        for (let att in value) {
          if (Array.isArray(value[att])) {
            return value[att];
          } else if (typeof value[att] === "object") {
            if (value[att]["@ComponentType"]) {
              return [value[att]];
            }
          }
        }
      }
      return value;
    }
  },
  created() {
    this.queryServerList();
  }
};
</script>

<style lang="scss">
.text_explain {
  text-align: left;
  margin-top: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  font-size: 20px;
  color: #666;
}
.createStyle {
  flex-direction: column;
  margin-top: 20px;
  > div {
    display: flex;
    margin-bottom: 20px;
    > span {
      line-height: 40px;
      white-space: nowrap;
    }
    > div.el-select {
      width: 100%;
    }
  }
}

.removeCheckbox thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
.dateStyle.el-input--suffix .el-input__inner {
  padding-right: 0;
}
.selectStyle > .el-input--suffix .el-input__inner {
  padding-right: 15px;
}

.box-card {
  margin: 0 0 10px 0;
  .header {
    text-align: left;
  }
  fieldset {
    border: 1px solid #dcdfe6;
    text-align: left;
    legend {
      padding: 5px 10px;
    }
  }
}
</style>
