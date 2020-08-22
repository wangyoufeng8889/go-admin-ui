<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item label="DTU编号" prop="dtu_id">
            <el-input
              v-model="queryParams.dtu_id"
              placeholder="请输入DTU编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="电池编号" prop="pkg_id">
            <el-input
              v-model="queryParams.pkg_id"
              placeholder="请输入电池编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh-left" size="mini" @click="resetQuery">刷新</el-button>
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
        <el-table v-loading="loading" :data="dtuList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30" align="lift" />
          <el-table-column label="DTU编号" align="center" prop="dtu_id" width="160" />
          <el-table-column label="电池编号" align="center" prop="pkg_id" width="160" />
          <el-table-column label="更新时间" align="center" prop="dtu_uptime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.dtu_uptime) }}</span>
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
</template>

<script>
import { getDTUList, delOneDTUList } from '@/api/batterymanage/dtulist'
import { formatJson } from '@/utils'

export default {
  name: 'DtuList',
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
      dtuList: [],
      // 弹出层标题
      title: 'hello',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      // statusOptions: [],
      // 在线状态
      // statusOnOff: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        dtu_id: undefined,
        pkg_id: undefined
        // pkg_type: undefined
        // bms_chargeStatus: undefined,
        // pkg_onOffLineStatus: undefined
      },
      // 表单参数
      form: {}
    }
  },
  created() {
    this.getList()
    // this.getDicts('sys_pkg_type').then(response => {
    // this.pkg_typeTable = response.data
    // })
    // this.getDicts('sys_net_status').then(response => {
    // this.statusOnOff = response.data
    // })
  },
  activated() {
    // 进入页面时自动刷新
    this.init()
  },
  methods: {
    /** 查询电池列表 */
    getList() {
      this.loading = true
      getDTUList(this.queryParams).then(response => {
        this.dtuList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // DTU状态字典翻译
    statusFormat(row) {
      // this.selectDictLabel(this.pkg_typeTable, row.pkg_type)
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
        dtuPkg_listId: undefined,
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
      this.ids = selection.map(item => item.battery_listId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /* 查看DTU详情 */
    handleViewDetail(row) {
      console.log(row)
      this.$router.push({ name: 'dtudetail', params: { id: row.dtu_id }})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dtu_listIds = row.dtu_id || this.ids
      this.$confirm('是否确认删除DTU编号为"' + dtu_listIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOneDTUList(dtu_listIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // const queryParams = this.queryParams
      this.$confirm('是否确认导出所有DTU数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '更新时间', 'DTU编号', '电池编号']
          const filterVal = ['dtuPkg_listId', 'dtu_uptime', 'dtu_id', 'pkg_id']
          const list = this.dtuList
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'DTU绑定关系信息',
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
