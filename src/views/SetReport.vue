<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="input5"
          class="input-with-select"
        >
          <el-button slot="append" @click="templatList">选中模板</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div>
      <div v-for="(item, index) in parameter" :key="item.id">
        <div class="text_explain">
          <span>{{ item }}</span>
        </div>
        <div>
          <el-row type="flex" align="middle" class="createStyle">
            <el-col
              :span="8"
              style="display: flex;"
              v-for="item2 in parameterChlid[index]"
              :key="item2.id"
            >
              <span>{{ item2.name }}：</span>
              <!-- <el-button type="primary">配置</el-button> -->
              <el-input
                v-show="item2.isInput == true"
                v-model="item2.value"
                placeholder="请输入内容"
              ></el-input>

              <el-select
                v-show="item2.isPullDown == true"
                v-model="item2.value"
                placeholder="请选择"
              >
                <el-option
                  v-for="item3 in item2.items"
                  v-model="item3.label"
                  :key="item3.value"
                >
                </el-option>
              </el-select>
              <el-date-picker
                v-model="item2.value"
                v-show="item2.isDate == true"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-button type="primary" v-show="saveIsShow" @click="saveFun"
        >保存</el-button
      >
    </div>

    <el-dialog title="选择模板" :visible.sync="dialogTableVisible">
      <el-table
        :data="gridData"
        ref="uploadStationTable"
        @selection-change="chooseInstance"
        class="removeCheckbox"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column
          property="createdate"
          label="上传日期"
        ></el-table-column>
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
export default {
  name: "setreport",
  data() {
    return {
      loading: false,
      input5: "",
      gridData: [],
      dialogTableVisible: false,
      options: [],
      saveData: "",
      templateId: "",
      saveIsShow: false,
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      pageCount: 0,
      parameter: [],
      // parameter: ["Connections", "SelectCategories", "OutputFileName"],
      parameterChlid: []
      // parameterChlid: [
      //   [
      //     {
      //       name: "",
      //       value: "",
      //       isInput: true
      //     },
      //     {
      //       name: "",
      //       value: "",
      //       items: [{ label: "" }, { label: "" }, { label: "" }],
      //       isDate: true
      //     }
      //   ]
      // ]
    };
  },
  methods: {
    templatList() {
      this.dialogTableVisible = true;
      this.$fetch(
        "/ReportTemplate/GetReportTemplateList",
        this.queryParams
      ).then(res => {
        //console.log(res);
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
    publicFun(item, index) {
      if (item.ComponentType === "DateTimePicker") {
        this.parameterChlid[index].push({
          name: item.Text,
          value: item.Value,
          isDate: true
        });
      }
      if (
        item.ComponentType === "NumberBox" ||
        item.ComponentType === "TextBox"
      ) {
        this.parameterChlid[index].push({
          name: item.Text,
          value: item.Value,
          isInput: true
        });
      }
      if (item.ComponentType === "ListBox") {
        let arr = [];
        item.Items.split(",").forEach(items => {
          arr.push({ label: items });
        });
        this.parameterChlid[index].push({
          name: item.Text,
          value: item.Value,
          items: arr,
          isPullDown: true
        });
      }
    },
    saveTemplate() {
      this.loading = true;
      this.dialogTableVisible = false;
      const selected = this.$refs["uploadStationTable"].selection;
      this.templateId = selected[0].id;
      this.$fetch("/ReportTemplate/GetReportTemplateXml", {
        id: this.templateId
      }).then(res => {
        let data = JSON.parse(res.Data.replace(/@/g, "")).Parameters;
        this.saveData = data;
        this.parameter = [];
        this.parameterChlid = [[], [], [], [], [], [], [], [], [], [], []];

        let count = -1;

        for (let key in data) {
          let keys = data[key];
          if (keys && keys.Text === "Connections") {
            count++;
            this.parameter.push(keys.Text);
            keys.Connection.Property.forEach(item => {
              this.publicFun(item, count);
            });
          } else if (keys && keys.Text === "Select Categories") {
            // eslin -disable-next-line
          } else if (keys && keys.Text === "Output File Name") {
            count++;
            this.parameter.push(keys.Text);
            this.publicFun(keys, count);
          } else if (keys && keys.Text === "Output Directory") {
            // eslin -disable-next-line
          } else if (keys && keys.Text === "Output Type") {
            count++;
            this.parameter.push(keys.Text);
            this.publicFun(keys, count);
          } else if (keys && keys.Text === "Save By Category") {
            // eslin -disable-next-line
          } else if (keys && keys.Text === "Project Map Source") {
            count++;
            this.parameter.push(keys.Text);
            this.publicFun(keys, count);
          } else if (keys && keys.Text === "Customs") {
            count++;
            this.parameter.push(keys.Text);
            keys.Custom.forEach(item => {
              this.publicFun(item, count);
            });
          }
        }
        this.saveIsShow = true;
        this.loading = false;
      });
    },
    saveFun() {
      this.loading = true;
      let count2 = -1;
      for (let key in this.saveData) {
        let keys = this.saveData[key];

        if (keys && keys.Text === "Connections") {
          count2++;
          keys.Connection.Property.forEach((item, index) => {
            item.Value = this.parameterChlid[count2][index].value;
          });
        } else if (keys && keys.Text === "Select Categories") {
          // eslin -disable-next-line
        } else if (keys && keys.Text === "Output File Name") {
          count2++;
          keys.Value = this.parameterChlid[count2][0].value;
        } else if (keys && keys.Text === "Output Directory") {
          // eslin -disable-next-line
        } else if (keys && keys.Text === "Output Type") {
          count2++;
          keys.Value = this.parameterChlid[count2][0].value;
        } else if (keys && keys.Text === "Save By Category") {
          // eslin -disable-next-line
        } else if (keys && keys.Text === "Project Map Source") {
          count2++;
          keys.Value = this.parameterChlid[count2][0].value;
        } else if (keys && keys.Text === "Customs") {
          count2++;
          let count3 = -1;
          keys.Custom.forEach(item => {
            if (
              item.ComponentType &&
              item.ComponentType !== "OpenFileDialog" &&
              item.ComponentType !== "FolderBrowserDialog" &&
              item.ComponentType !== "SaveFileDialog"
            ) {
              count3++;
              item.Value = this.parameterChlid[count2][count3].value;
            }
          });
        }
      }
      this.$post("/TaskPlanReprotTemplate/Create", {
        taskplanid: this.$route.query.plan_id,
        reporttemplateid: this.templateId,
        xmlparams: this.saveData
      }).then(res => {
        if (res.State === 0) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.$route.query.plan_id = "";
          this.templateId = "";
          this.$router.push({ path: "/TaskPlan" });
          this.saveIsShow = false;
        } else {
          this.$message.error("操作失败！");
        }
        this.parameter = [];
        this.parameterChlid = [];
        this.loading = false;
      });
    }
  },
  created() {}
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
</style>
