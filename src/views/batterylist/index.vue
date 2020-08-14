<template>
  <div v-if="infoOnOff">
    <BasicLayout>

      <template #wrapper>
        <el-card class="box-card">
          <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
            <el-form-item label="电池编号" prop="pkg_id">
              <el-input
                v-model="queryParams.pkg_id"
                placeholder="请输入电池编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="DTU编号" prop="dtu_id">
              <el-input
                v-model="queryParams.dtu_id"
                placeholder="请输入DTU编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="电池状态" prop="bms_chargeStatus">
              <el-select v-model="queryParams.bms_chargeStatus" placeholder="充放电状态" clearable size="small">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
              >导出</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="loading" :data="batteryList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="30" align="lift" />
            <el-table-column label="电池编号" align="center" prop="pkg_id" width="160" />
            <el-table-column label="标压" align="center" prop="pkg_nominalVoltage" width="50" />
            <el-table-column label="电量" align="center" prop="bms_soc" width="50" />
            <el-table-column label="在线状态" align="center" prop="pkg_onOffLineStatus" width="100" />
            <el-table-column label="更新时间" align="center" prop="dtu_uptime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.dtu_uptime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="故障" align="center" prop="pkg_errStatus" width="50" />
            <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['system:syspost:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleViewDetail(scope.row)"
                >详情</el-button>
                <el-button
                  v-permisaction="['system:syspost:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageIndex"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
      </template>
    </BasicLayout>

  </div>
  <div v-else>
    <Batteryinfo @returnblist="retumainlist" />
  </div>
</template>

<script>
import { getBatteryList, delOneBatteryList } from '@/api/batterymanage/batterylist'
import { formatJson } from '@/utils'
import Batteryinfo from './onebatteryinfo/batteryinfo'
export default {
  name: 'Post',
  components: { Batteryinfo },
  data() {
    return {
      // 详情开关
      infoOnOff: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      batteryList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        dtu_id: undefined,
        pkg_id: undefined,
        bms_chargeStatus: undefined
      },
      // 表单参数
      form: {}
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_charge_status').then(response => {
      this.statusOptions = response.data
    })
  },

  methods: {
    retumainlist() {
      this.infoOnOff = true
    },
    /** 查询电池列表 */
    getList() {
      this.loading = true
      getBatteryList(this.queryParams).then(response => {
        this.batteryList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 电池状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.bms_chargeStatus)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        battery_listId: undefined,
        pkg_id: undefined,
        dtu_id: undefined,
        bms_chargeStatus: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.battery_listId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /* 查看电池详情 */
    handleViewDetail(row) {
      this.infoOnOff = false
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const battery_listIds = row.battery_listId || this.ids
      this.$confirm('是否确认删除电池编号为"' + battery_listIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOneBatteryList(battery_listIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // const queryParams = this.queryParams
      this.$confirm('是否确认导出所有电池数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '电池编号', 'DTU编号', '更新时间', 'SOC', '充放电状态', '在线状态', '错误状态', '电池串数', '电池类型', '电池容量', '标称电压']
          const filterVal = ['battery_listId', 'pkg_id', 'dtu_id', 'dtu_uptime', 'bms_soc', 'bms_chargeStatus', 'pkg_onOffLineStatus', 'pkg_errStatus', 'pkg_count', 'pkg_type', 'pkg_capacity', 'pkg_nominalVoltage']
          const list = this.batteryList
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '电池管理',
            autoWidth: true, // Optional
            bookType: 'xlsx' // Optional
          })
          this.downloadLoading = false
        })
      }).catch(function() {})
    }
  }
}
</script>
