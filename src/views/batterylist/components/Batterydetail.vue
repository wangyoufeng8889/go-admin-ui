<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="12">
          <label>电池详情</label>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="warning" icon="el-icon-back" align="right" @click="onReturnBL">返回电池列表</el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电池编号" prop="pkgid">
            <el-input v-model="formData.pkgid" readonly :style="{width: '100%'}" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单行文本" prop="field104">
            <el-input v-model="formData.field104" placeholder="请输入单行文本" clearable :style="{width: '100%'}" />
          </el-form-item>
        </el-col>

      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        pkgid: undefined,
        field104: undefined
      },
      rules: {
        pkgid: [{
          required: true,
          message: '',
          trigger: 'blur'
        }],
        field104: [{
          required: true,
          message: '请输入单行文本',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onReturnBL() {
      const data = {
        goPage: 'Batterylist',
        pkgid: ''
      }
      this.$emit('goBatteryPage', data)
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    }
  }
}

</script>
<style>
</style>
