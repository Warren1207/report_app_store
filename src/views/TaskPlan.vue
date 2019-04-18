<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="计划名称"></el-input
      ></el-col>
      <el-col :span="4" style="text-align: left;">
        <el-button type="primary" @click="queryFn">搜索</el-button>
      </el-col>
    </el-row>
    <div class="opera-wrap">
      <div class="opera-item" @click="addStation = true">
        <i class="icon iconfont icon-xinzeng"></i>
        <span>添加计划</span>
      </div>
      <div class="opera-item" @click="modifyStation()">
        <i class="icon iconfont icon-shanchu"></i>
        <span>删除</span>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        ref="uploadStationTable"
        :data="queryData"
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="55"> </el-table-column>
        <el-table-column prop="scenesname" label="场景"> </el-table-column>
        <el-table-column prop="planname" label="计划名称"> </el-table-column>
        <el-table-column prop="startdate" label="开始日期"> </el-table-column>
        <el-table-column prop="enddate" label="结束日期"> </el-table-column>
        <el-table-column prop="intervaltime" label="间隔时间(天)">
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态"> </el-table-column> -->
        <el-table-column prop="createdate" label="创建时间"> </el-table-column>
        <el-table-column prop="lastexecute" label="最后执行"> </el-table-column>
        <el-table-column prop="executecount" label="执行数"> </el-table-column>
        <el-table-column prop="configuration" label="配置"
          ><template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="goConfiguration(scope.row)"
              >配置</el-button
            >
            <el-button
              size="mini"
              type="info"
              @click="ToViewConfiguration(scope.row)"
              >查看</el-button
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
    <el-dialog title="添加计划" :visible.sync="addStation" width="30%">
      <el-form
        ref="stationFrom"
        :model="stationInfo"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="计划名称" prop="planname">
          <el-input
            v-model="stationInfo.planname"
            maxlength="50"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间段" prop="timePeriod">
          <el-date-picker
            style="width: 100%;"
            :picker-options="pickerOptions"
            v-model="stationInfo.timePeriod"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="间隔(天)" prop="intervaltime">
          <el-input-number
            style="width: 100%;"
            v-model="stationInfo.intervaltime"
            @change="handleClick"
            :min="1"
            :max="30"
            label="请输入间隔时间(1-30)"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="任务场景" prop="scenesname">
          <el-select
            v-model="stationInfo.scenesname"
            clearable
            placeholder="任务场景"
            style="width: 100%;"
          >
            <el-option
              v-for="item in statusObj"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStation = false">取 消</el-button>
        <el-button type="primary" @click="saveStation">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "taskplan",
  data() {
    return {
      loading: false,
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      pageCount: 0,
      queryData: [],
      statusObj: {},
      stationInfo: {
        planname: "",
        // startdate: "",
        // enddate: "",
        timePeriod: [],
        intervaltime: "",
        scenesname: ""
      },
      rules: {
        planname: [
          { required: true, message: "请填写计划名称", trigger: "blur" }
        ],
        timePeriod: [
          { required: true, message: "请选择时间段", trigger: "blur" }
        ],
        intervaltime: [
          { required: true, message: "请填写间隔", trigger: "blur" }
        ],
        scenesname: [
          { required: true, message: "请选择任务场景", trigger: "blur" }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      addStation: false
    };
  },
  methods: {
    queryFn() {
      this.loading = true;
      this.$fetch("/taskplan/index", this.queryParams).then(res => {
        if (res.State === 0) {
          this.queryData = res.Data;
          this.pageCount = res.TotalCount;
        } else {
          this.$message.error(res.Message);
        }
        this.loading = false;
      });
    },
    selectScene() {
      this.$fetch("/scenes/index").then(res => {
        this.statusObj = res.Data;
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
    modifyStation() {
      const selected = this.$refs["uploadStationTable"].selection;
      if (selected.length !== 1) {
        this.$message({
          message: "请选择一条数据！",
          type: "warning"
        });
      } else {
        const Id = selected[0].id;
        this.$post("/taskplan/delete", { id: Id }).then(res => {
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
    saveStation() {
      this.$refs["stationFrom"].validate(valid => {
        if (valid) {
          this.stationInfo.startdate = this.stationInfo.timePeriod[0];
          this.stationInfo.enddate = this.stationInfo.timePeriod[1];
          this.$post("/taskplan/create", this.stationInfo).then(res => {
            if (res.State === 0) {
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.addStation = false;
              // this.stationInfo = {
              //   planname: "",
              //   timePeriod: [],
              //   intervaltime: "",
              //   scenesname: ""
              // };
              this.$refs["stationFrom"].resetFields();
              this.queryFn();
            } else {
              this.$message.error("保存失败!");
            }
          });
        }
      });
    },
    goConfiguration(parame) {
      this.$router.push({
        path: "/SetReport",
        query: { plan_id: parame.id }
      });
    },
    ToViewConfiguration(parame) {
      if (parame.templateids.length !== 0) {
        let id = parame.templateids[parame.templateids.length - 1];
        this.$fetch("/TaskPlanReprotTemplate/Details", { id }).then(res => {
          let dataxml = res.Data.xmlcontent;
          let dataname = res.Data.reporttemplatename;
          this.$router.push({
            path: "/SetReport",
            query: { dataXml: dataxml, dataName: dataname }
          });
        });
      } else {
        this.$message.warning("未配置模板,无法查看!");
      }
    },
    handleClick() {
      this.$nextTick(function() {
        this.stationInfo.intervaltime = parseInt(this.stationInfo.intervaltime);
      });
    }
  },
  created() {
    this.queryFn();
    this.selectScene();
    // this.$router.push({
    //   path: "/SetReport"
    // });
  }
};
</script>

<style lang="scss" scoped></style>
