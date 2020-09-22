<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item label="固件名称" prop="firmwareName">
            <el-input
              v-model="queryParams.firmwareName"
              placeholder="请输入固件名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="版本号" prop="firmwareVer">
            <el-input
              v-model="queryParams.firmwareVer"
              placeholder="请输入版本号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh-left" size="mini" @click="resetQuery">刷新</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="firmwareList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30" align="lift" />
          <el-table-column label="固件名称" align="center" prop="firmwareName" width="400" />
          <el-table-column label="内核" align="center" prop="coreVer" width="80" />
          <el-table-column label="版本号" align="center" prop="firmwareVer" width="80" />
          <el-table-column label="文件名" align="center" prop="fileName" width="400">
            <template slot-scope="scope">
              <span>{{ scope.row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:firmwarelist:query']"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleViewDetail(scope.row)"
              >详情</el-button>
              <el-button
                v-permisaction="['system:firmwarelist:remove']"
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

      <!-- 添加固件文件话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="选择固件" prop="logo">
            <el-upload
              class="upload-firmware"
              :action="url"
              :data="{type:'4'}"
              :before-upload="handleUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传bin文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="固件名称" prop="roleName">
            <el-input v-model="form.firmwareName" :disabled="true" />
          </el-form-item>
          <el-form-item label="固件版本" prop="roleName">
            <el-input v-model="form.firmwareVer" :disabled="true" />
          </el-form-item>
          <el-form-item label="内核版本" prop="roleName">
            <el-input v-model="form.coreVer" :disabled="true" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import { getFirmwareList, delOneFirmwareList, addFirmware } from '@/api/batterymanage/firmwarelist'
// import { formatJson } from '@/utils'

export default {
  name: 'Batterylist',
  data() {
    return {
      // 文件上传地址
      url: process.env.VUE_APP_BASE_API + '/api/v1/public/uploadFile',
      fileList: [],
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
      firmwareList: [],
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
        firmwareName: undefined,
        firmwareVer: undefined
      },
      // 表单参数
      form: {}
    }
  },
  created() {
    this.getList()
  },

  methods: {
    /** 查询电池列表 */
    getList() {
      this.loading = true
      getFirmwareList(this.queryParams).then(response => {
        this.firmwareList = response.data.list
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
        firmwareName: undefined,
        firmwareVer: undefined,
        coreVer: undefined,
        remark: undefined,
        fileName: undefined
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
    /* 查看固件详情 */
    handleViewDetail(row) {
      console.log('handleViewDetail', row)
      this.$router.push({ name: 'dtudetail', params: { id: row.dtu_id }})
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addFirmware(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const firmware_listIds = row.ota_firmwareId || this.ids
      this.$confirm('是否确认删除固件"' + firmware_listIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOneFirmwareList(firmware_listIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    //* * 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加固件'
    },
    handleUpload(file) {
      console.log('handleUpload', typeof file, file)
      let filename = file.name
      this.form.fileName = filename
      this.form.firmwareVer = filename.match('\\d+.\\d+.\\d+')[0]
      this.form.coreVer = filename.match('V\\d+')[0]
      filename = filename.replace(this.form.firmwareVer, '')
      filename = filename.replace(this.form.coreVer, '')
      filename = filename.replace('.bin', '')
      filename = filename.replace('.dfota', '')
      this.form.firmwareName = filename.replace('__', '_')
      console.log('handleUpload form', this.form)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
