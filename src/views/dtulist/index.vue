<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item label="DTU编号" prop="pkg_id">
            <el-input
              v-model="queryParams.dtu_id"
              placeholder="请输入DTU编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="DTU类型" prop="pkg_type">
            <el-select v-model="queryParams.dtu_type" placeholder="选择DTU类型" clearable size="small">
              <el-option
                v-for="dict in dtu_typeTable"
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
        <el-table v-loading="loading" :data="dtuList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30" align="lift" />
          <el-table-column label="DTU编号" align="center" prop="dtu_id" width="160" />
          <el-table-column label="电池编号" align="center" prop="pkg_id" width="160" />
          <el-table-column label="信号强度" align="center" prop="dtu_csq" width="50">
            <template slot-scope="scope">
              <div v-if="scope.row.dtu_csq > '25'">
                <el-tag type="success">{{ scope.row.dtu_csq }}</el-tag>
              </div>
              <div v-else-if="scope.row.dtu_csq < '25' && scope.row.dtu_csq > '15'">
                <el-tag type="warning">{{ scope.row.dtu_csq }}</el-tag>
              </div>
              <div v-else>
                <el-tag type="danger">{{ scope.row.dtu_csq }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="安装位置" align="center" prop="dtu_setupType" width="50">
            <template slot-scope="scope">
              <div v-if="scope.row.dtu_setupType == '1'">
                车
              </div>
              <div v-if="scope.row.dtu_setupType == '0'">
                电池
              </div>
            </template>
          </el-table-column>
          <el-table-column label="故障" align="center" prop="dtu_errNbr" width="50">
            <template slot-scope="scope">
              <div v-if="scope.row.dtu_errNbr == '0'">
                <el-tag type="success">{{ scope.row.dtu_errNbr }}个</el-tag>
              </div>
              <div v-if="scope.row.dtu_errNbr > '0'">
                <el-tag type="danger">{{ scope.row.dtu_errNbr }}个</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="dtu_type" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.dtu_type == '2'">
                2G
              </div>
              <div v-if="scope.row.dtu_type == '3'">
                3G
              </div>
              <div v-if="scope.row.dtu_type == '4'">
                4G-CAT4
              </div>
              <div v-if="scope.row.dtu_type == '5'">
                5G
              </div>
              <div v-if="scope.row.dtu_type == '6'">
                4G-CAT1
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网络" align="center" prop="dtu_aliyunStatus" width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.dtu_aliyunStatus == '1'">
                <el-tag type="success">在线</el-tag>
              </div>
              <div v-if="scope.row.dtu_aliyunStatus == '0'">
                <el-tag type="warning">离线</el-tag>
              </div>
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
      // dtu表格数据
      dtuList: [],
      // 弹出层标题
      title: 'hello',
      // 是否显示弹出层
      open: false,
      // DTU类型词典
      dtu_typeTable: [],
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
        dtu_type: undefined,
        dtu_setupType: undefined,
        dtu_aliyunStatus: undefined,
        dtu_csq: undefined,
        dtu_errNbr: undefined
      },
      // 表单参数
      form: {}
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_dtu_type').then(response => {
      this.dtu_typeTable = response.data
      console.log('dtu_typeTable', response)
    })
    // this.getDicts('sys_net_status').then(response => {
    // this.statusOnOff = response.data
    // })
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
    // 电池状态字典翻译
    statusFormat(row) {
      // this.selectDictLabel(this.dtu_typeTable, row.pkg_type)
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
        dtu_id: undefined,
        pkg_id: undefined,
        dtu_type: undefined,
        dtu_setupType: undefined,
        dtu_aliyunStatus: undefined,
        dtu_csq: undefined,
        dtu_errNbr: undefined,
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
      this.$router.push({ name: 'dtudetail', params: { id: row.dtu_id }})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dtu_listIds = row.dtu_specInfoId || this.ids
      this.$confirm('是否确认删除电池编号为"' + dtu_listIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOneDTUList(dtu_listIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
