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
              <el-col class="batterydetail" :span="6">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <div>
                    <el-form-item label="电池编号:">
                      {{ batteryListInfo.pkg_id }}
                    </el-form-item>
                  </div>

                  <div>
                    <el-form-item label="更新时间:">
                      {{ parseTime(batteryListInfo.dtu_uptime) }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="电池类型:">
                      <div v-if="batteryListInfo.pkg_type == '1'">
                        三元锂
                      </div>
                      <div v-else>
                        磷酸铁锂
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="标称电压:">
                      {{ parseFloat(batteryListInfo.pkg_nominalVoltage)/10 }}V
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="额定容量:">
                      {{ parseFloat(batteryListInfo.pkg_capacity)/100 }}Ah
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="电池串数:">
                      {{ batteryListInfo.pkg_count }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="DTU编号:">
                      {{ batteryListInfo.dtu_id }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="DTU类型:">
                      <div v-if="batteryListInfo.dtu_type == '6'">
                        4G-CAT1
                      </div>
                      <div v-if="batteryListInfo.dtu_type == '5'">
                        5G
                      </div>
                      <div v-if="batteryListInfo.dtu_type == '4'">
                        4G-CAT4
                      </div>
                      <div v-if="batteryListInfo.dtu_type == '2'">
                        2G
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="网络强度:">

                      <div v-if="batteryListInfo.dtu_csq > '25'">
                        <el-tag type="success">{{ batteryListInfo.dtu_csq }}</el-tag>
                      </div>
                      <div v-else-if="batteryListInfo.dtu_csq < '25' && batteryListInfo.dtu_csq > '15'">
                        <el-tag type="warning">{{ batteryListInfo.dtu_csq }}</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">{{ batteryListInfo.dtu_csq }}</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col class="batterydetail" :span="6">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <br><br>
                  <div>
                    <el-form-item label="在线状态:">
                      <div v-if="batteryListInfo.pkg_onOffLineStatus == '1'">
                        <el-tag type="success">在线</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">离线</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="电量:">
                      {{ batteryListInfo.bms_soc }}%
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="充放电状态:">
                      {{ batteryListInfo.bms_chargeStatus }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="故障状态:">
                      {{ batteryListInfo.pkg_errStatus }}
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col :span="12">
                <div>
                  <gdmap :data-init="batteryListInfo" />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
              </el-tabs>
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
      activeName: 'first',
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      batteryListInfo: {},
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
    handleClick(tab, event) {
      console.log(tab, event)
    },
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
    /*
    display: flex;
    justify-content: space-between;
    */
  }
  .demo-ruleForm>div{
    flex:1
  }
 .batterydetail/deep/ .el-form-item{
    margin-bottom: 0;
  }
</style>
