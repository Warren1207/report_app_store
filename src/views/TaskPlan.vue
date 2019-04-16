<template>
  <div class="wrap">
    <el-row>
      <el-col :span="4"
        ><el-input v-model="queryParams.name" placeholder="工参名称"></el-input
      ></el-col>
      <!-- <el-col :span="4">
        <el-select
          v-model="selectScene_selected"
          clearable
          placeholder="任务场景"
        >
          <el-option
            v-for="item in statusObj"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          >
          </el-option> </el-select
      ></el-col> -->
      <el-col :span="4" style="text-align: left;">
        <el-button type="primary" @click="queryFn">搜索</el-button>
      </el-col>
    </el-row>
    <div class="opera-wrap">
      <div class="opera-item" @click="addStation = true">
        <i class="icon iconfont icon-xinzeng"></i>
        <span>添加</span>
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
        <el-table-column prop="planname" label="计划名称"> </el-table-column>
        <el-table-column prop="repeattype" label="重复类型"> </el-table-column>
        <el-table-column prop="startdate" label="开始日期"> </el-table-column>
        <el-table-column prop="enddate" label="结束日期"> </el-table-column>
        <el-table-column prop="intervaltime" label="间隔时间">
        </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column prop="createuserid" label="创建用户ID">
        </el-table-column>
        <el-table-column prop="createdate" label="创建时间"> </el-table-column>
        <el-table-column prop="errormessage" label="错误消息">
        </el-table-column>
        <el-table-column prop="lastexecute" label="最后执行"> </el-table-column>
        <el-table-column prop="executecount" label="执行数"> </el-table-column>
        <el-table-column prop="configuration" label="配置"
          ><template slot-scope="scope">
            <el-button
              size="mini"
              @click="goConfiguration(scope.$index, scope.row)"
              >配置</el-button
            >
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            > -->
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
    <el-dialog title="添加" :visible.sync="addStation" width="30%">
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
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复类型" prop="repeattype">
          <el-input
            v-model="stationInfo.repeattype"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startdate">
          <el-date-picker
            style="width: 100%;"
            v-model="stationInfo.startdate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="enddate">
          <el-date-picker
            style="width: 100%;"
            v-model="stationInfo.enddate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="间隔" prop="intervaltime">
          <el-input
            v-model="stationInfo.intervaltime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务场景" prop="selectScene_selected">
          <el-select
            v-model="stationInfo.selectScene_selected"
            clearable
            placeholder="任务场景"
            style="width: 100%;"
          >
            <el-option
              v-for="item in statusObj"
              :key="item.value"
              :label="item.name"
              :value="item.id"
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
      // selectScene_selected: "",
      queryData: [],
      statusObj: {},
      stationInfo: {
        planname: "",
        repeattype: "",
        startdate: "",
        enddate: "",
        intervaltime: "",
        selectScene_selected: ""
      },
      rules: {
        planname: [
          { required: true, message: "请填写计划名称", trigger: "blur" }
        ],
        repeattype: [
          { required: true, message: "请填写重复类型", trigger: "blur" }
        ],
        startdate: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        enddate: [
          { required: true, message: "请选择结束时间", trigger: "blur" }
        ],
        intervaltime: [
          { required: true, message: "请填写间隔", trigger: "blur" }
        ],
        selectScene_selected: [
          { required: true, message: "请选择任务场景", trigger: "blur" }
        ]
      },
      addStation: false
    };
  },
  methods: {
    queryFn() {
      this.loading = true;
      this.$fetch("/taskplan/index", this.queryParams).then(res => {
        this.queryData = res.Data;
        this.pageCount = res.TotalCount;
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
          this.$post("/taskplan/create", this.stationInfo).then(res => {
            if (res.State === 0) {
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.addStation = false;
              this.stationInfo = {
                planname: "",
                repeattype: "",
                startdate: "",
                enddate: "",
                intervaltime: "",
                selectScene_selected: ""
              };
              this.queryFn();
            } else {
              this.$message.error("保存失败!");
            }
          });
        }
      });
    },
    goConfiguration(parame1, parame2) {
      this.$router.push({
        path: "/SetReport",
        query: { plan_id: parame2.id }
      });
    }
  },
  created() {
    this.queryFn();
    this.selectScene();
  }
};
</script>

<style lang="scss" scoped></style>
