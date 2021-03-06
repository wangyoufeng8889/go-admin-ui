<template>
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
          <el-form-item label="电池类型" prop="pkg_type">
            <el-select v-model="queryParams.pkg_type" placeholder="选择电池类型" clearable size="small">
              <el-option
                v-for="dict in pkg_typeTable"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh-left" size="mini" @click="resetQuery">刷新</el-button>
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
          <el-table-column label="电量" align="center" prop="bms_soc" width="50">
            <template slot-scope="scope">
              {{ scope.row.bms_soc }}%
            </template>
          </el-table-column>
          <el-table-column label="电压" align="center" prop="bms_voltage" width="50">
            <template slot-scope="scope">
              {{ parseFloat(scope.row.bms_voltage)/10 }}V
            </template>
          </el-table-column>
          <el-table-column label="故障" align="center" prop="bms_errNbr" width="50">
            <template slot-scope="scope">
              {{ scope.row.bms_errNbr }}个
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="pkg_type" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.pkg_type == '1'">
                三元锂
              </div>
              <div v-else>
                磷酸铁锂
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标压" align="center" prop="pkg_nominalVoltage" width="50">
            <template slot-scope="scope">
              {{ parseFloat(scope.row.pkg_nominalVoltage)/10 }}V
            </template>
          </el-table-column>
          <el-table-column label="容量" align="center" prop="pkg_capacity" width="70">
            <template slot-scope="scope">
              {{ parseFloat(scope.row.pkg_capacity)/100 }}Ah
            </template>
          </el-table-column>
          <el-table-column label="串数" align="center" prop="pkg_count" width="50">
            <template slot-scope="scope">
              {{ scope.row.pkg_count }}串
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" prop="dtu_uptime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.dtu_uptime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:batterylist:query']"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleViewDetail(scope.row)"
              >详情</el-button>
              <el-button
                v-permisaction="['system:batterylist:remove']"
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
</template>

<script>
import { getBatteryList, delOneBatteryList } from '@/api/batterymanage/batterylist'
// import { formatJson } from '@/utils'

export default {
  name: 'Batterylist',
  data() {
    return {
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
      title: 'hello',
      // 是否显示弹出层
      open: false,
      // 电池类型词典
      pkg_typeTable: [],
      // 状态数据字典
      // statusOptions: [],
      // 在线状态
      // statusOnOff: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        dtu_id: undefined,
        pkg_id: undefined,
        pkg_type: undefined,
        pkg_capacity: undefined,
        bms_chargeStatus: undefined,
        bms_soc: undefined,
        bms_errNbr: undefined
        // bms_chargeStatus: undefined,
        // pkg_onOffLineStatus: undefined
      },
      // 表单参数
      form: {}
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_pkg_type').then(response => {
      this.pkg_typeTable = response.data
      console.log('pkg_typeTable', response)
    })
    // this.getDicts('sys_net_status').then(response => {
    // this.statusOnOff = response.data
    // })
  },

  methods: {
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
      this.selectDictLabel(this.pkg_typeTable, row.pkg_type)
      // this.selectDictLabel(this.statusOnOff, row.pkg_onOffLineStatus)
      return
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        bms_specinfoId: undefined,
        pkg_id: undefined,
        dtu_id: undefined,
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
      this.ids = selection.map(item => item.bms_specInfoId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /* 查看电池详情 */
    handleViewDetail(row) {
      console.log('handleViewDetail', row)
      this.$router.push({ name: 'batterydetail', params: { id: row.pkg_id }})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const battery_listIds = row.bms_specInfoId || this.ids
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
    }
  }
}
</script>
