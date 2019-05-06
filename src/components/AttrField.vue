<template>
  <div>
    <div v-if="isArrayOpera">
      <el-form-item
        :label="attr['@Text']"
        v-for="(attr, index) in fieldArray"
        :key="index"
      >
        <component
          :is="fieldEnum[attr['@ComponentType']]"
          :ftitle="title"
          :att.sync="attr"
          :serverId="serverId"
          v-model="attr['@Value']"
          :placeholder="attr['@Text']"
          value-format="yyyy-MM-dd"
          style="width:100%"
        >
          <div v-if="attr['@Items']">
            <el-option
              v-for="(option, index) in attr['@Items'].split(',')"
              :key="index"
              :label="option"
              :value="option"
            >
            </el-option>
          </div>
        </component>
      </el-form-item>
    </div>
    <div v-if="!isArrayOpera">
      <el-form-item :label="fieldArray['@Text']">
        <component
          :is="fieldEnum[fieldArray['@ComponentType']]"
          :ftitle="title"
          :att.sync="fieldArray"
          :serverId="serverId"
          v-model="fieldArray['@Value']"
          :placeholder="fieldArray['@Text']"
          value-format="yyyy-MM-dd"
          style="width:100%"
        >
          <div v-if="fieldArray['@Items']">
            <el-option
              v-for="(option, index) in fieldArray['@Items'].split(',')"
              :key="index"
              :label="option"
              :value="option"
            >
            </el-option>
          </div>
        </component>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import MultiplTreeView from "./MultiplTreeView.vue";
export default {
  name: "AttrField",
  components: {
    MultiplTreeView
  },
  props: {
    attr: Object,
    title: String,
    serverId: Number
  },
  data() {
    return {
      isArrayOpera: true,
      fieldEnum: {
        MultiplTreeView: "MultiplTreeView",
        TextBox: "el-input",
        FolderBrowserDialog: "MultiplTreeView",
        ListBox: "el-select",
        CheckBox: "el-checkbox",
        DateTimePicker: "el-date-picker",
        NumberBox: "el-input"
      },
      fieldArray: []
    };
  },
  watch: {
    fieldArray(val) {
      if (Array.isArray(val)) {
        this.isArrayOpera = true;
      } else {
        this.isArrayOpera = false;
      }
    }
  },
  methods: {
    isArrayFn() {},
    findFields(obj) {
      if (obj["@ComponentType"]) {
        this.fieldArray = obj;
        return;
      } else {
        for (let attName in obj) {
          if (Array.isArray(obj[attName])) {
            if (obj[attName].length > 0 && obj[attName][0]["@ComponentType"]) {
              this.fieldArray = obj[attName];
              return;
            }
          } else if (typeof obj[attName] === "object") {
            this.findFields(obj[attName]);
          }
        }
      }
    }
  },
  created() {
    this.findFields(this.attr);
  }
};
</script>

<style lang="scss" scoped></style>
