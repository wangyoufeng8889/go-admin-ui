<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-container>
          <el-header style="height:20px">
            <el-button style="float: right; padding: 3px 0" type="danger" icon="el-icon-back" @click="onReturnBL">返回电池列表</el-button>
          </el-header>
          <el-main>
            <el-row>
              <el-col class="batterydetail" :span="16">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <div>
                    <el-form-item label="电池编号:" />
                  </div>
                  <div>
                    <el-form-item label="活动名称">
                      2
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="活动名称">
                      3
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col :span="6">
                <div>
                  <gdmap />
                </div>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-card>
    </template>
  </BasicLayout>
</template>
<script>
import gdmap from './components/gaodemap'
import { getBatteryList } from '@/api/batterymanage/batterylist'
export default {
  name: 'Batterydetail',
  components: { gdmap },
  props: [],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      batteryListInfo: [],
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      pkgid: '',
      formData: {
        pkgid: undefined
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        pkg_id: undefined
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    console.log(this.$route.params.id)
    this.queryParams.pkg_id = this.$route.params.id
    this.getdevinfo()
  },
  mounted() {},
  methods: {
    /** 查询电池列表 */
    getdevinfo() {
      this.loading = true
      getBatteryList(this.queryParams).then(response => {
        this.batteryListInfo = response.data.list[0]
        this.total = response.data.count
        this.loading = false
        console.log(this.batteryListInfo)
      })
    },
    onReturnBL() {
      this.$router.push({ name: 'batterylist' })
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
<style scoped>
  .demo-ruleForm{
    display: flex;
    justify-content: space-between;
  }
  .demo-ruleForm>div{
    flex:1
  }
 .batterydetail/deep/ .el-form-item{
    margin-bottom: 0;
  }
</style>
