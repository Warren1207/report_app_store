<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="4"
        ><el-input
          v-model="queryParams.searchtext"
          placeholder="FTP名称/IP"
        ></el-input
      ></el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.status" clearable placeholder="状态">
          <el-option label="启用" :value="1"> </el-option>
          <el-option label="停用" :value="2"> </el-option>
          <el-option label="删除" :value="3"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" style="text-align: left;">
        <el-button type="primary" @click="queryFn">搜索</el-button>
      </el-col>
    </el-row>
    <div class="opera-wrap">
      <div
        class="opera-item"
        @click="
          addFtp = true;
          ftpInfo = {};
        "
      >
        <i class="icon iconfont icon-xinzeng"></i>
        <span>添加FTP</span>
      </div>
      <div class="opera-item" @click="addFtp = true">
        <i class="icon iconfont icon-xiugai1"></i>
        <span>修改FTP</span>
      </div>
      <div class="opera-item" @click="modifyFTP(1)">
        <i class="icon iconfont icon-qiyong"></i>
        <span>启用</span>
      </div>
      <div class="opera-item" @click="modifyFTP(2)">
        <i class="icon iconfont icon-tingyong"></i>
        <span>停用</span>
      </div>
      <div class="opera-item" @click="modifyFTP(3)">
        <i class="icon iconfont icon-shanchu"></i>
        <span>删除</span>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        ref="uploadStationTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="queryData"
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
      >
        <el-table-column type="index" width="55"> </el-table-column>
        <el-table-column prop="Name" label="FTP名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="IP" label="IP" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ statusObj[scope.row.Status] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Port" label="服务器端口"> </el-table-column>
        <el-table-column
          prop="UserName"
          label="FTP用户名"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="RemotePath" label="根目录" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="CreatDate"
          label="创建时间"
          show-overflow-tooltip
        >
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
    ></el-pagination>
    <el-dialog
      title="FTP信息"
      :visible.sync="addFtp"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        ref="FTPFrom"
        :model="ftpInfo"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="服务器名称" prop="Name">
          <el-input v-model="ftpInfo.Name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务器Ip" prop="IP">
          <el-input v-model="ftpInfo.IP" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口" prop="Port">
          <el-input v-model.number="ftpInfo.Port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="FTP用户名" prop="UserName">
          <el-input v-model="ftpInfo.UserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="FTP密码" prop="Password">
          <el-input v-model="ftpInfo.Password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="根目录" prop="RemotePath">
          <el-input v-model="ftpInfo.RemotePath" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFtp = false">取 消</el-button>
        <el-button type="primary" @click="testFTP">测试连接</el-button>
        <el-button type="primary" @click="saveFTP">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FtpList",
  data() {
    const validateIP = (rule, value, callback) => {
      if (value == "" || value == undefined || value == null) {
        callback();
      } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value) && value != "") {
          callback(new Error("请输入正确的IP地址"));
        } else {
          callback();
        }
      }
    };
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
      addFtp: false,
      rules: {
        Name: [
          { required: true, message: "请填写FTP名称", trigger: "blur" },
          { max: 50, message: "长度不能大于 50 个字符", trigger: "blur" }
        ],
        IP: [
          { required: true, message: "请填IP", trigger: "blur" },
          { trigger: "blur", validator: validateIP }
        ],
        Port: [
          { required: true, message: "请填写端口", trigger: "blur" },
          { type: "number", message: "端口数字值" }
        ],
        UserName: [
          { required: true, message: "请填用户名称", trigger: "blur" },
          { max: 30, message: "长度不能大于 30 个字符", trigger: "blur" }
        ],
        Password: [
          { required: true, message: "请填密码", trigger: "blur" },
          { max: 30, message: "长度不能大于 30 个字符", trigger: "blur" }
        ],
        RemotePath: [
          { required: true, message: "请填写根目录", trigger: "blur" },
          { max: 200, message: "长度不能大于200 个字符", trigger: "blur" }
        ]
      },
      ftpInfo: {}
    };
  },
  methods: {
    handleCurrentChange(val) {
      if (val !== null) {
        this.ftpInfo = val;
      }
    },
    queryFn() {
      this.$fetch("/Ftp/GetFtpList", this.queryParams).then(res => {
        this.queryData = res.Data;
        this.pageCount = res.TotalCount;
      });
    },
    modifyFTP(Status) {
      if (isNaN(this.ftpInfo.Id)) {
        this.$message({
          message: "请选择一条数据！",
          type: "warning"
        });
      } else {
        const Id = this.ftpInfo.Id;
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
    pageSizeFn(val) {
      this.queryParams.pageSize = val;
      this.queryFn();
    },
    pageChangeFn(val) {
      this.queryParams.pageIndex = val;
      this.queryFn();
    },
    delFn(Id, Status) {
      this.$post("/Ftp/StatusFtp", { Id, Status }).then(res => {
        if (res.State === 0) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.queryFn();
        } else {
          this.$message.error(res.Message);
        }
      });
    },
    saveFTP() {
      this.$refs["FTPFrom"].validate(valid => {
        if (valid) {
          let url = "/Ftp/UpdateFtp";
          if (isNaN(this.ftpInfo.Id)) {
            url = "/Ftp/AddFtp";
          }
          this.$post(url, this.ftpInfo).then(res => {
            if (res.State === 0) {
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              this.addFtp = false;
              this.ftpInfo = {};
              this.queryFn();
            } else {
              this.$message.error("保存失败!");
            }
          });
        }
      });
    },
    testFTP() {
      this.$post("/Ftp/CheckFtp", this.ftpInfo).then(res => {
        if (res.State === 0) {
          this.$message({
            message: "连接成功！",
            type: "success"
          });
        } else {
          this.$message.error("连接失败!");
        }
      });
    }
  },
  created() {
    this.queryFn();
  }
};
</script>

<style lang="scss" scoped></style>
