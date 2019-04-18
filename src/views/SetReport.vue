<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="模板名称"
          v-model="input5"
          readonly
          class="input-with-select"
        >
          <el-button slot="append" v-if="selectIsShow" @click="templatList"
            >选中模板</el-button
          >
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
            <el-form
              label-position="right"
              label-width="180px"
              v-for="item2 in parameterChlid[index]"
              :key="item2.id"
            >
              <el-form-item :label="item2.name">
                <el-input
                  v-show="item2.isInput == true"
                  v-model="item2.value"
                  :readonly="read_only"
                  placeholder="请输入内容"
                ></el-input>
                <el-select
                  class="selectStyle"
                  v-show="item2.isPullDown == true"
                  v-model="item2.value"
                  :disabled="read_only"
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
                  class="dateStyle"
                  style="width: 100%;"
                  v-model="item2.value"
                  :readonly="read_only"
                  v-show="item2.isDate == true"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-row>
        </div>
      </div>
      <el-button
        type="primary"
        style="margin-bottom: 20px;"
        v-show="saveIsShow"
        @click="saveFun"
        >{{ whatButton }}</el-button
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
      pageCount: 0,
      parameter: [],
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

    publicFun(item, array) {
      if (item.RRRppp_ComponentType === "DateTimePicker") {
        array.push({
          name: item.RRRppp_Text,
          value: item.RRRppp_Value,
          isDate: true
        });
      }
      if (
        item.RRRppp_ComponentType === "NumberBox" ||
        item.RRRppp_ComponentType === "TextBox"
      ) {
        array.push({
          name: item.RRRppp_Text,
          value: item.RRRppp_Value,
          isInput: true
        });
      }
      if (item.RRRppp_ComponentType === "ListBox") {
        let arr = [];
        item.RRRppp_Items.split(",").forEach(items => {
          arr.push({ label: items });
        });
        array.push({
          name: item.RRRppp_Text,
          value: item.RRRppp_Value,
          items: arr,
          isPullDown: true
        });
      }
      // if (item.RRRppp_ComponentType === "MultiplTreeView") {
      // }
      // if (item.RRRppp_ComponentType === "FolderBrowserDialog") {
      // }
      // if (item.RRRppp_ComponentType === "CheckBox") {
      // }
    },
    sharingFun(data) {
      this.saveData = data;
      this.parameter = [];
      this.parameterChlid = [];

      for (let key in data) {
        let parameterChlidArray = new Array();
        this.parameterChlid.push(parameterChlidArray);
        let keys = data[key];
        if (keys && keys.RRRppp_ComponentType) {
          this.parameter.push(keys.RRRppp_Text);
          this.publicFun(keys, parameterChlidArray);
        } else if (keys && !keys.RRRppp_ComponentType) {
          this.parameter.push(keys.RRRppp_Text);
          for (let traverse in keys) {
            let traverse1 = keys[traverse];
            if (traverse1 instanceof Array) {
              traverse1.forEach(traverse8 => {
                if (traverse8.RRRppp_ComponentType) {
                  this.publicFun(traverse8, parameterChlidArray);
                }
              });
            } else if (traverse1 instanceof Object) {
              if (traverse1.RRRppp_ComponentType) {
                this.publicFun(keys, parameterChlidArray);
              } else {
                for (let traverse2 in traverse1) {
                  let traverse3 = traverse1[traverse2];
                  if (traverse3 instanceof Array) {
                    traverse3.forEach(traverse4 => {
                      if (traverse4.RRRppp_ComponentType) {
                        this.publicFun(traverse4, parameterChlidArray);
                      }
                    });
                  } else if (traverse3 instanceof Object) {
                    // if (traverse3.RRRppp_ComponentType) {
                    //   this.publicFun(keys, parameterChlidArray);
                    // } else {
                    //   for (let traverse4 in traverse3) {
                    //     console.log(traverse4);
                    //   }
                    // }
                  }
                }
              }
            }
          }
        }
        if (parameterChlidArray.length === 0) {
          this.parameterChlid.splice(
            this.parameterChlid.indexOf(parameterChlidArray),
            1
          );
          if (keys) {
            this.parameter.splice(this.parameter.indexOf(keys.RRRppp_Text), 1);
          }
        }
      }
      this.saveIsShow = true;
      this.loading = false;
    },
    saveTemplate() {
      this.loading = true;
      this.dialogTableVisible = false;
      const selected = this.$refs["uploadStationTable"].selection;
      if (selected.length !== 0) {
        this.templateId = selected[0].id;
        this.input5 = selected[0].name;
        this.$fetch("/ReportTemplate/GetReportTemplateXml", {
          id: this.templateId
        }).then(res => {
          let data = JSON.parse(res.Data.replace(/@/g, "RRRppp_")).Parameters;
          this.sharingFun(data);
        });
      } else {
        this.loading = false;
        this.$message.warning("请选择模板！");
      }
    },
    saveFun() {
      if (this.whatButton === "保存") {
        this.loading = true;
        let count2 = -1;
        for (let key in this.saveData) {
          let keys = this.saveData[key];

          if (keys && keys.RRRppp_Text === "Connections") {
            count2++;
            keys.Connection.Property.forEach((item, index) => {
              item.RRRppp_Value = this.parameterChlid[count2][index].value;
            });
          } else if (keys && keys.RRRppp_Text === "Select Categories") {
            // eslin -disable-next-line
          } else if (keys && keys.RRRppp_Text === "Output File Name") {
            count2++;
            keys.RRRppp_Value = this.parameterChlid[count2][0].value;
          } else if (keys && keys.RRRppp_Text === "Output Directory") {
            // eslin -disable-next-line
          } else if (keys && keys.RRRppp_Text === "Output Type") {
            count2++;
            keys.RRRppp_Value = this.parameterChlid[count2][0].value;
          } else if (keys && keys.RRRppp_Text === "Save By Category") {
            // eslin -disable-next-line
          } else if (keys && keys.RRRppp_Text === "Project Map Source") {
            count2++;
            keys.RRRppp_Value = this.parameterChlid[count2][0].value;
          } else if (keys && keys.RRRppp_Text === "Customs") {
            count2++;
            let count3 = -1;
            keys.Custom.forEach(item => {
              if (
                item.RRRppp_ComponentType &&
                item.RRRppp_ComponentType !== "OpenFileDialog" &&
                item.RRRppp_ComponentType !== "FolderBrowserDialog" &&
                item.RRRppp_ComponentType !== "SaveFileDialog"
              ) {
                count3++;
                item.RRRppp_Value = this.parameterChlid[count2][count3].value;
              }
            });
          }
        }
        this.$post("/TaskPlanReprotTemplate/Create", {
          taskplanid: this.$route.query.plan_id,
          reporttemplateid: this.templateId,
          xmlparams: JSON.stringify(this.saveData).replace(/RRRppp_/g, "@")
        }).then(res => {
          if (res.State === 0) {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.$route.query.plan_id = "";
            this.templateId = "";
            this.$router.push({ path: "/TaskPlan" });
            this.saveIsShow = false;
          } else {
            this.$message.error(res.Message);
          }
          this.parameter = [];
          this.parameterChlid = [];
          this.loading = false;
        });
      } else {
        this.$router.push({ path: "/TaskPlan" });
      }
    }
  },
  created() {
    if (this.$route.query.dataXml) {
      this.selectIsShow = false;
      this.read_only = true;
      this.input5 = this.$route.query.dataName;
      this.whatButton = "关闭";
      let data = JSON.parse(this.$route.query.dataXml.replace(/@/g, "RRRppp_"))
        .Parameters;
      this.sharingFun(data);
    }
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
</style>
