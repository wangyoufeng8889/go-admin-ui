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
      <el-button type="primary" style="float: right; position: relative;left: -20px;" @click="findCellData">搜索</el-button>
    </div>
    <div v-if="loading" id="chartcell">
      <ve-line :data="chartData" :settings="chartSettings" />
    </div>
  </div>
</template>

<script>
// NPM 方式
import { getBatteryCellInfo } from '@/api/batterymanage/batterydetail'
import { parseTime } from '@/utils/index.js'
import VeLine from 'v-charts/lib/line'
// import carUrl from 'https://webapi.amap.com/images/car.png'
export default {
  name: 'SOC',
  components: { VeLine },
  props: ['dataInit'],
  data() {
    return {
      // 遮罩层
      loading: false,
      buckTime: [],
      // 查询参数
      queryParams: {
        dtu_id: undefined,
        pkg_id: undefined,
        startTime: undefined,
        endTime: undefined
      },
      socdata: [],
      chartData: {
        columns: ['日期', '单体1', '单体2', '单体3', '单体4', '单体5', '单体6', '单体7', '单体8', '单体9', '单体10', '单体11', '单体12', '单体13', '单体14', '单体15', '单体16', '单体17', '单体18', '单体19', '单体20'],
        rows: []
      },
      chartSettings: {
        xAxisType: 'time',
        yAxisType: ['normal'],
        yAxisName: ['电压(mV)']
      }
    }
  },
  created() {
    this.queryParams = this.dataInit
    this.getCellData()
  },
  methods: {
    getCellData() {
      console.log(this.queryParams, 'this.queryParams')
      getBatteryCellInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.chartData.rows = []
        response.data.map(x => {
          const add = {}
          add['日期'] = parseTime(x.dtu_uptime)
          add['单体1'] = x.bms_cellVoltage1
          add['单体2'] = x.bms_cellVoltage2
          add['单体3'] = x.bms_cellVoltage3
          add['单体4'] = x.bms_cellVoltage4
          add['单体5'] = x.bms_cellVoltage5
          add['单体6'] = x.bms_cellVoltage6
          add['单体7'] = x.bms_cellVoltage7
          add['单体8'] = x.bms_cellVoltage8
          add['单体9'] = x.bms_cellVoltage9
          add['单体10'] = x.bms_cellVoltage10
          add['单体11'] = x.bms_cellVoltage11
          add['单体12'] = x.bms_cellVoltage12
          add['单体13'] = x.bms_cellVoltage13
          add['单体14'] = x.bms_cellVoltage14
          add['单体15'] = x.bms_cellVoltage15
          add['单体16'] = x.bms_cellVoltage16
          add['单体17'] = x.bms_cellVoltage17
          add['单体18'] = x.bms_cellVoltage18
          add['单体19'] = x.bms_cellVoltage19
          add['单体20'] = x.Bms_cellVoltage20
          this.chartData.rows.push(add)
        })
        console.log('chartData.rows=', this.chartData.rows)
        this.loading = true
      })
    },
    findCellData() {
      if (this.buckTime.length !== 0) {
        this.queryParams.startTime = this.buckTime[0]
        this.queryParams.endTime = this.buckTime[1]
      }
      this.getCellData()
    },
    msg() {
      this.$notify.info({
        title: '提示',
        message: '暂无单体数据'
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
