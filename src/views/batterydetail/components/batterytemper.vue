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
      <el-button type="primary" style="float: right; position: relative;left: -20px;" @click="findTemperData">搜索</el-button>
    </div>
    <div v-if="loading" id="chartcell">
      <ve-line :data="chartData" :settings="chartSettings" />
    </div>
  </div>
</template>

<script>
// NPM 方式
import { getBatteryTemperInfo } from '@/api/batterymanage/batterydetail'
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
        columns: ['日期', '温度1(℃)', '温度2(℃)', '温度3(℃)', '温度4(℃)', '温度5(℃)', '温度6(℃)'],
        rows: []
      },
      chartSettings: {
        xAxisType: 'time',
        yAxisType: ['normal'],
        yAxisName: ['温度(℃)']
      }
    }
  },
  created() {
    this.queryParams = this.dataInit
    this.getTemperData()
  },
  methods: {
    getTemperData() {
      console.log(this.queryParams, 'this.queryParams')
      getBatteryTemperInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.chartData.rows = []
        response.data.map(x => {
          const add = {}
          add['日期'] = parseTime(x.dtu_uptime)
          add['温度1(℃)'] = x.bms_temperature1
          add['温度2(℃)'] = x.bms_temperature2
          add['温度3(℃)'] = x.bms_temperature3
          add['温度4(℃)'] = x.bms_temperature4
          add['温度5(℃)'] = x.bms_temperature5
          add['温度6(℃)'] = x.bms_temperature6
          this.chartData.rows.push(add)
        })
        console.log('chartData.rows=', this.chartData.rows)
        this.loading = true
      })
    },
    findTemperData() {
      if (this.buckTime.length !== 0) {
        this.queryParams.startTime = this.buckTime[0]
        this.queryParams.endTime = this.buckTime[1]
      }
      this.getTemperData()
    },
    msg() {
      this.$notify.info({
        title: '提示',
        message: '暂无温度数据'
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
