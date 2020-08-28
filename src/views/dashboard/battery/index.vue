<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="6" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="电池总数" :total="dashboardInfo.batteryTotalNbr">
          <el-tooltip slot="action" class="item" effect="dark" content="电池在线率" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="90" :percentage="dashboardInfo.batteryOnlineNbr*100/dashboardInfo.batteryTotalNbr" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="top" style="margin-right: 16px;" :rate="dashboardInfo.batteryOnlineNbr">
              <span slot="term">在线数量</span>
            </trend>
            <trend flag="bottom" :rate="dashboardInfo.batteryOfflineNbr">
              <span slot="term">故障数</span>
            </trend>
          </template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="6" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="访问量" :total="8846">
          <el-tooltip slot="action" class="item" effect="dark" content="指标说明" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">日访问量<span> {{ '1234' }}</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="6" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="DTU总数" :total="dashboardInfo.dtuTotalNbr">
          <el-tooltip slot="action" class="item" effect="dark" content="DTU在线率" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="90" :percentage="dashboardInfo.dtuOnlineNbr*100/dashboardInfo.dtuTotalNbr" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="top" style="margin-right: 16px;" :rate="dashboardInfo.dtuOnlineNbr">
              <span slot="term">在线数量</span>
            </trend>
            <trend flag="bottom" :rate="dashboardInfo.dtuOfflineNbr">
              <span slot="term">故障数</span>
            </trend>
          </template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="6" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="支付笔数" :total="6560">
          <el-tooltip slot="action" class="item" effect="dark" content="指标说明" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">转化率 <span>60%</span></template>
        </chart-card>
      </el-col>
    </el-row>
    <el-card :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <el-tabs>
          <el-tab-pane label="设备地图" style="height: 100;">
            <el-row>
              <Aimap v-if="localInfo.length" :data-init="localInfo" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="访问量">
            <el-row />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import Trend from './components/Trend'
import MiniArea from '@/components/MiniArea'
import MiniBar from '@/components/MiniBar'
import MiniProgress from '@/components/MiniProgress'
import Aimap from './components/Aimap.vue'
import { getBatteryDashboardInfo } from '@/api/batterymanage/dashboard'

export default {
  name: 'DashboardBattery',
  components: {
    ChartCard,
    Trend,
    MiniArea,
    MiniBar,
    MiniProgress,
    Aimap
  },
  data() {
    return {
      dashboardInfo: [],
      localInfo: [],
      // 查询参数
      queryParams: {
        tdtu_specInfoId: undefined,
        dtu_id: undefined
      }
    }
  },
  created() {
    this.getDashboard()
  },
  methods: {
    /** 查询电池列表 */
    getDashboard() {
      this.loading = true

      // const bms_specInfoId1 = this.queryParams.tdtu_specInfoId
      getBatteryDashboardInfo(this.queryParams).then(response => {
        this.dashboardInfo = response.data
        this.localInfo = this.dashboardInfo.DtuLocation
        this.loading = false
        // this.dtuid = this.dtuDetailInfo.dtu_id
        console.log('getDtuDetailInfo', response)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

/deep/ .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
