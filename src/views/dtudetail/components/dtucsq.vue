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
      <el-button type="primary" style="float: right; position: relative;left: -20px;" @click="findCSQData">搜索</el-button>
    </div>
    <div v-if="loading" id="chartsoc">
      <ve-line :data="chartData" :settings="chartSettings" />
    </div>
  </div>
</template>

<script>
// NPM 方式
import { getDtuCSQInfo } from '@/api/batterymanage/dtudetail'
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
        columns: ['日期', 'csq', '外接电压'],
        rows: [
          // { '日期': '2020-09-01 12:00:01', 'SOC': 10, '电压': 630},
          // { '日期': '2020-09-02 12:00:01', 'SOC': 20, '电压': 640},
          // { '日期': '2020-09-03 12:00:01', 'SOC': 30, '电压': 640},
          // { '日期': '2020-09-05 12:00:01', 'SOC': 40, '电压': 640},
          // { '日期': '2020-09-10 12:00:01', 'SOC': 80, '电压': 640},
          // { '日期': '2020-09-20 12:00:01', 'SOC': 100, '电压': 640}
        ]
      },
      chartSettings: {
        xAxisType: 'time',
        yAxisType: ['normal', 'normal'],
        yAxisName: ['外接电压', 'csq'],
        axisSite: { right: ['csq'] }
      }
    }
  },
  created() {
    setTimeout(() => {
      this.queryParams = this.dataInit
      this.getcsqData()
    }, 1000)
  },
  methods: {
    getcsqData() {
      this.loading = false
      console.log(this.queryParams, 'this.queryParams')
      getDtuCSQInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.socdata = response.data
        const listData = []
        for (var i = 0; i < this.socdata.length; i++) {
          const add = {}
          add['日期'] = parseTime(this.socdata[i].dtu_uptime)
          add['csq'] = this.socdata[i].dtu_csq
          add['外接电压'] = this.socdata[i].dtu_pluginVoltage
          listData.push(add)
        }
        this.chartData.rows = listData
        console.log('listData=', listData)
        this.loading = true
      })
    },
    findCSQData() {
      if (this.buckTime.length !== 0) {
        this.queryParams.startTime = this.buckTime[0]
        this.queryParams.endTime = this.buckTime[1]
      }
      this.getcsqData()
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
