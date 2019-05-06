<template>
  <div>
    <el-input
      v-if="ftitle === 'Gis Groups'"
      :placeholder="att['@Text']"
      v-model="inputValue"
      :readonly="true"
    >
      <el-button
        @click="showDialog"
        slot="append"
        icon="el-icon-search"
      ></el-button>
    </el-input>
    <el-input
      v-if="ftitle !== 'Gis Groups'"
      :placeholder="att['@Text']"
      v-model="att['@Value']"
    ></el-input>
    <el-dialog :title="att['@Text']" :visible.sync="showTreeViewDlg">
      <div style="min-height: 270px;max-height:350px;overflow-y: auto;">
        <el-tree
          :props="treeViewProps"
          node-key="Id"
          ref="treeView"
          show-checkbox
          :data="multiplTreeData"
        >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTreeViewDlg = false">取 消</el-button>
        <el-button type="primary" @click="saveTreeView">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MultiplTreeView",
  props: {
    att: Object,
    ftitle: String,
    serverId: Number
  },
  data() {
    return {
      showTreeViewDlg: false,
      inputValue: "",
      multiplTreeData: [],
      treeViewProps: {
        label: "Text",
        children: "Children"
      }
    };
  },
  methods: {
    showDialog() {
      if (this.serverId) {
        if (this.ftitle === "Gis Groups") {
          if (this.multiplTreeData.length === 0) {
            this.$post("/TaskReport/GetGisAreasTree", {
              id: this.serverId
            }).then(res => {
              this.multiplTreeData = res.Data;
            });
          }
          this.showTreeViewDlg = true;
        }
      } else {
        this.$message({
          message: "请先选择服务器！",
          type: "warning"
        });
      }
    },
    saveTreeView() {
      this.showTreeViewDlg = false;
      const selectNodes = this.$refs["treeView"].getCheckedNodes(true, false);
      let names = [],
        ids = [];
      const self = this;
      const getNodeNames = function(node, nameArray) {
        nameArray.push(node.Text);
        const pNode = self.$refs["treeView"].getNode(node.Pid);
        if (pNode.data.Id === "Gis1") {
          return nameArray.join(".");
        }
        getNodeNames(pNode.data, nameArray);
      };
      selectNodes.map(function(node) {
        let nameArray = [];
        getNodeNames(node, nameArray);
        nameArray = nameArray.reverse();
        names.push(nameArray.join("."));
        ids.push(node.Text);
      });
      this.inputValue = ids.toString();
      this.att["@Value"] = names.toString();
    }
  }
};
</script>
