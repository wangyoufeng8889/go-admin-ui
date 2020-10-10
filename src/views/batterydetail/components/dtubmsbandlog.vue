<template>
  <div class="myTable">
    <div class="input searchInfo">
      <span><span>时间：</span>
        <el-date-picker
          v-model="buckTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:SS"
          :default-time="['08:00:00', '20:00:00']"
        />
      </span>
      <el-button type="primary" style="float: right; position: relative;left: -20px;" @click="findBandInfo">搜索</el-button>
    </div>
    <div v-if="loading" id="tabledtubmsband">
      <el-table :data="bandInfodata">
        <el-table-column label="更换时间" align="center" prop="dtu_uptime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dtu_uptime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电池编号" align="center" prop="pkg_id" width="400" />
        <el-table-column label="DTU编号" align="center" prop="dtu_id" width="400" />
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getBandInfoData"
    />
  </div>
</template>

<script>
// NPM 方式
import { getDtuBmsBandInfo } from '@/api/batterymanage/dtubmsbandlist'
// import carUrl from 'https://webapi.amap.com/images/car.png'
export default {
  name: 'Dtubmsbandlog',
  props: ['dataInit'],
  data() {
    return {
      // 遮罩层
      loading: false,
      buckTime: [],
      total: 0,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        dtu_id: undefined,
        pkg_id: undefined,
        startTime: undefined,
        endTime: undefined
      },
      bandInfodata: []
    }
  },
  created() {
    this.queryParams = this.dataInit
    this.getBandInfoData()
  },
  methods: {
    getBandInfoData() {
      console.log(this.queryParams, 'this.queryParams')
      getDtuBmsBandInfo(this.queryParams).then(response => {
        console.log('getDtuBmsBandInfo=', response)
        this.bandInfodata = response.data.list
        this.total = response.data.count
        this.loading = true
      })
    },
    findBandInfo() {
      if (this.buckTime.length !== 0) {
        this.queryParams.startTime = this.buckTime[0]
        this.queryParams.endTime = this.buckTime[1]
      }
      this.getBandInfoData()
    },
    msg() {
      this.$notify.info({
        title: '提示',
        message: '暂无soc数据'
      })
    }
  }
}
</script>

<style scoped>
    .input input{
        position: relative;
        display: inline-block;
        border-radius: 5px;
        height: 20px;
        margin-right: 20px;
        font-size: 16px;
        line-height: 32px;
        width: 250px;
        padding-left: 8px;
    }
</style>
