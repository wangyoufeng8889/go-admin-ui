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
      <el-button type="primary" style="float: right; position: relative;left: -20px;" @click="findSOCData">搜索</el-button>
    </div>
    <div id="chartsoc">
      <ve-line :data="chartData" :settings="chartSettings" />
    </div>
  </div>
</template>

<script>
// NPM 方式
import { getBatterySOCInfo } from '@/api/batterymanage/batterysoc'
import VeLine from 'v-charts/lib/line'
// import carUrl from 'https://webapi.amap.com/images/car.png'
export default {
  name: 'SOC',
  components: { VeLine },
  props: ['dataInit'],
  data() {
    return {
      // 遮罩层
      loading: true,
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
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '2018-01-01', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '2018-01-02', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '2018-01-03', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '2018-01-05', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '2018-01-10', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '2018-01-20', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      chartSettings: {
        xAxisType: 'time'
      }
    }
  },
  created() {
    setTimeout(() => {
      this.queryParams = this.dataInit
      this.ISdata = true
      this.getSOCData()
    }, 3000)
  },
  methods: {
    getSOCData() {
      this.loading = true
      console.log(this.queryParams, 'this.queryParams')
      getBatterySOCInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.socdata = response.data
        this.loading = false
      })
    },
    findSOCData() {
      if (this.buckTime.length !== 0) {
        this.queryParams.startTime = this.buckTime[0]
        this.queryParams.endTime = this.buckTime[1]
      }
      this.getSOCData()
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
