<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-container>
          <el-header style="height:20px">
            <el-button style="float: right; padding: 3px 0" type="danger" icon="el-icon-back" @click="onReturnDtuList">返回DTU列表</el-button>
            <el-button icon="el-icon-refresh-left" size="mini" @click="onRefresh">刷新</el-button>          </el-header>
          <el-main>
            <el-row>
              <el-col class="dtudetail" :span="6">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <div>
                    <el-form-item label="DTU编号:">
                      {{ dtuDetailInfo.dtu_id }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="更新时间:">
                      {{ parseTime(dtuDetailInfo.dtu_uptime) }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="DTU故障:">
                      {{ dtuDetailInfo.dtu_errNbr }}个
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="故障码:">
                      {{ dtuDetailInfo.dtu_errCode }}
                    </el-form-item>
                  </div>
                  <div v-if="dtuDetailInfo.dtu_bmsBindStatus == '1'" style="cursor:pointer" @click="gotobatterydetail(dtuDetailInfo.pkg_id)">
                    <el-form-item label="电池编号:">
                      <a href="javascript:0" style="text-decoration: revert;">  {{ dtuDetailInfo.pkg_id }}</a>
                    </el-form-item>
                  </div>
                  <div v-if="dtuDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="电池故障:">
                      {{ dtuDetailInfo.bms_errNbr }}个
                    </el-form-item>
                  </div>
                  <div v-if="dtuDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="故障码:">
                      {{ dtuDetailInfo.bms_errCode }}
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col class="dtudetail" :span="6">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <div>
                    <el-form-item label="网络状态:">
                      <div v-if="dtuDetailInfo.dtu_aliyunStatus == '1'">
                        <el-tag type="success">在线</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">离线</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="信号质量:">
                      <div v-if="dtuDetailInfo.dtu_csq > '25'">
                        <el-tag type="success">{{ dtuDetailInfo.dtu_csq }}</el-tag>
                      </div>
                      <div v-else-if="dtuDetailInfo.dtu_csq < '25' && dtuDetailInfo.dtu_csq > '15'">
                        <el-tag type="warning">{{ dtuDetailInfo.dtu_csq }}</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">{{ dtuDetailInfo.dtu_csq }}</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="定位状态:">
                      <div v-if="dtuDetailInfo.dtu_locateMode == '1'">
                        <el-tag type="success">GPS</el-tag>
                      </div>
                      <div v-if="dtuDetailInfo.dtu_locateMode == '2'">
                        <el-tag type="danger">基站</el-tag>
                      </div>
                      <div v-if="dtuDetailInfo.dtu_locateMode == '3'">
                        <el-tag type="warning">WIFI</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="搜星数:">
                      {{ dtuDetailInfo.dtu_gpsSateCnt }}
                    </el-form-item>
                  </div>
                  <div v-if="dtuDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="电量:">
                      {{ dtuDetailInfo.bms_soc }}%
                    </el-form-item>
                  </div>
                  <div v-if="dtuDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="当前电压:">
                      {{ parseFloat(dtuDetailInfo.bms_voltage)/10 }}V

                    </el-form-item>
                  </div>
                  <div v-if="dtuDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="充放电状态:">
                      <div v-if="dtuDetailInfo.bms_chargeStatus == '0'">
                        <el-tag type="warning">搁置</el-tag>
                      </div>
                      <div v-if="dtuDetailInfo.bms_chargeStatus == '1'">
                        <el-tag type="danger">放电</el-tag>
                      </div>
                      <div v-if="dtuDetailInfo.bms_chargeStatus == '2'">
                        <el-tag type="success">充电</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col :span="12">
                <div>
                  <gdmap v-if="loading" :data-init="moveTrack" />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="DTU规格" name="first">
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="dtudetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="内核版本:">
                              {{ dtuDetailInfo.dtu_coreVer }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="硬件版本:">
                              {{ dtuDetailInfo.dtu_hardVer }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="软件版本:">
                              {{ dtuDetailInfo.dtu_softVer }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="协议版本:">
                              {{ dtuDetailInfo.dtu_protocolVer }}
                            </el-form-item>
                          </div>

                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="dtudetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="IMEI:">
                              {{ dtuDetailInfo.dtu_imei }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="ICCID:">
                              {{ dtuDetailInfo.dtu_simIccid }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="DTU类型:">
                              <div v-if="dtuDetailInfo.dtu_type == '6'">
                                4G-CAT1
                              </div>
                              <div v-if="dtuDetailInfo.dtu_type == '5'">
                                5G
                              </div>
                              <div v-if="dtuDetailInfo.dtu_type == '4'">
                                4G-CAT4
                              </div>
                              <div v-if="dtuDetailInfo.dtu_type == '2'">
                                2G
                              </div>
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="安装位置:">
                              <div v-if="dtuDetailInfo.dtu_setupType == '1'">
                                车
                              </div>
                              <div v-if="dtuDetailInfo.dtu_setupType == '0'">
                                电池
                              </div>
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="dtudetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="速度:">
                              {{ dtuDetailInfo.dtu_speed }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="海拔:">
                              {{ dtuDetailInfo.dtu_altitude }}m
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="外接电源:">
                              {{ dtuDetailInfo.dtu_pluginVoltage }}V
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="内置电源:">
                              {{ dtuDetailInfo.dtu_selfInVoltage/10 }}V
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>

                  </el-row>

                </el-tab-pane>
                <el-tab-pane label="配置参数" name="second">
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <div class="dtudetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="150px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="远程锁车:">
                              <div v-if="dtuDetailInfo.dtu_remoteLockCar == '1'">
                                <el-tag type="success">已锁车</el-tag>
                              </div>
                              <div v-else>
                                <el-tag type="danger">未上锁</el-tag>
                              </div>
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="电池包信息上报周期:">
                              {{ dtuDetailInfo.dtu_pkgInfoReportPeriod }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="OTA IP地址:">
                              {{ dtuDetailInfo.dtu_otaIP }}
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="dtudetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="200px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="语音提示开关:">
                              <div v-if="dtuDetailInfo.dtu_voiceTipsOnOff == '1'">
                                <el-tag type="success">开</el-tag>
                              </div>
                              <div v-else>
                                <el-tag type="danger">关</el-tag>
                              </div>
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="语音提示电量阈值:">
                              {{ dtuDetailInfo.dtu_voiceTipsThresholdValue }}%
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="语音提示电量下降增量值:">
                              {{ dtuDetailInfo.dtu_voiceTipsDownBulk }}%
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="运动轨迹" name="third"><gaodemovealong v-if="thirdready" :data-init="moveTrack" /></el-tab-pane>
                <el-tab-pane label="数据分析" name="fourth"><dtucsq v-if="fourthready" :data-init="moveTrack" /></el-tab-pane>
                <el-tab-pane label="换电日志" name="fifth"><dtubmsbandlog v-if="fifthready" :data-init="moveTrack" /></el-tab-pane>
              </el-tabs>
            </el-row>
          </el-main>
        </el-container>
      </el-card>
    </template>
  </BasicLayout>
</template>
<script>
import gdmap from './components/gaodemap'
import gaodemovealong from './components/gaodemovealong'
import dtucsq from './components/dtucsq'
import dtubmsbandlog from './components/dtubmsbandlog'
import { getDtuDetailInfo } from '@/api/batterymanage/dtudetail'

export default {
  name: 'Dtudetail',
  components: { gdmap, gaodemovealong, dtucsq, dtubmsbandlog },
  props: [],
  data() {
    return {
      activeName: 'first',
      thirdready: false,
      fourthready: false,
      fifthready: false,

      // 遮罩层
      loading: false,
      // 电池规格信息
      dtuDetailInfo: {},

      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dtuid: '',
      moveTrack: {
        pkg_id: '',
        dtu_id: ''
      },
      // 查询参数
      queryParams: {
        dtu_specInfoId: undefined,
        dtu_id: undefined
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.dtuid = this.$route.params.id
    console.log('dtu_id=', this.dtuid)
    if (typeof (this.dtuid) === 'undefined') {
      // 获取session存储编号
      this.dtuid = sessionStorage.getItem('dtu_id')
      console.log('quchu pkid=', this.dtuid)
    } else {
      sessionStorage.setItem('dtu_id', this.dtuid)
      console.log('cunchu pkid=', this.dtuid)
    }
    this.moveTrack.dtu_id = this.dtuid
    this.loading = true
    this.getdevinfo()
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      if (tab._props.label === '数据分析') {
        this.fourthready = true
      } else if (tab._props.label === '运动轨迹') {
        this.thirdready = true
      } else if (tab._props.label === '换电日志') {
        this.fifthready = true
      }
    },
    /** 查询电池列表 */
    getdevinfo() {
      this.queryParams.dtu_id = this.dtuid
      getDtuDetailInfo(this.queryParams).then(response => {
        this.dtuDetailInfo = response.data[0]
        console.log('getDtuDetailInfo', response)
      })
    },
    onReturnDtuList() {
      console.log('goto dtu detail')
      this.$router.push({ name: 'dtulist' })
    },
    onRefresh() {
      this.getdevinfo()
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    gotobatterydetail(batteryid) {
      this.$router.push({ name: 'batterydetail', params: { id: batteryid }})
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    }
  }
}
</script>
<style scoped>
  .demo-ruleForm{
    /*
    display: flex;
    justify-content: space-between;
    */
  }
  .demo-ruleForm>div{
    flex:1
  }
 .dtudetail/deep/ .el-form-item{
    margin-bottom: 0;
  }
  /* .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  } */
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
