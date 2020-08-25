<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-container>
          <el-header style="height:20px">
            <el-button style="float: right; padding: 3px 0" type="danger" icon="el-icon-back" @click="onReturnBL">返回电池列表</el-button>
            <el-button icon="el-icon-refresh-left" size="mini" @click="onRefresh">刷新</el-button>          </el-header>
          <el-main>
            <el-row>
              <el-col class="batterydetail" :span="6">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <div>
                    <el-form-item label="电池编号:">
                      {{ batteryDetailInfo.pkg_id }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="更新时间:">
                      {{ parseTime(batteryDetailInfo.dtu_uptime) }}
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="当前电压:">
                      {{ parseFloat(batteryDetailInfo.bms_voltage)/10 }}V

                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="当前电流:">
                      {{ parseFloat(batteryDetailInfo.bms_current-3200)/10 }}A
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="充电mos:">
                      <div v-if="batteryDetailInfo.bms_chargeMosStatus == '1'">
                        <el-tag type="warning">断开</el-tag>
                      </div>
                      <div v-if="batteryDetailInfo.bms_chargeMosStatus == '2'">
                        <el-tag type="success">吸合</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="放电mos:">
                      <div v-if="batteryDetailInfo.bms_dischargeMosStatus == '1'">
                        <el-tag type="warning">断开</el-tag>
                      </div>
                      <div v-if="batteryDetailInfo.bms_dischargeMosStatus == '2'">
                        <el-tag type="success">吸合</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="DTU编号:">
                      {{ batteryDetailInfo.dtu_id }}
                    </el-form-item>
                  </div>
                  <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="DTU类型:">
                      <div v-if="batteryDetailInfo.dtu_type == '6'">
                        4G-CAT1
                      </div>
                      <div v-if="batteryDetailInfo.dtu_type == '5'">
                        5G
                      </div>
                      <div v-if="batteryDetailInfo.dtu_type == '4'">
                        4G-CAT4
                      </div>
                      <div v-if="batteryDetailInfo.dtu_type == '2'">
                        2G
                      </div>
                    </el-form-item>
                  </div>
                  <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="网络强度:">
                      <div v-if="batteryDetailInfo.dtu_csq > '25'">
                        <el-tag type="success">{{ batteryDetailInfo.dtu_csq }}</el-tag>
                      </div>
                      <div v-else-if="batteryDetailInfo.dtu_csq < '25' && batteryDetailInfo.dtu_csq > '15'">
                        <el-tag type="warning">{{ batteryDetailInfo.dtu_csq }}</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">{{ batteryDetailInfo.dtu_csq }}</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col class="batterydetail" :span="6">
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                  <br><br>
                  <div>
                    <el-form-item label="是否装车:">
                      <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                        <el-tag type="success">是</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">否</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="电量:">
                      {{ batteryDetailInfo.bms_soc }}%
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="充放电状态:">
                      <div v-if="batteryDetailInfo.bms_chargeStatus == '0'">
                        <el-tag type="warning">搁置</el-tag>
                      </div>
                      <div v-if="batteryDetailInfo.bms_chargeStatus == '1'">
                        <el-tag type="danger">放电</el-tag>
                      </div>
                      <div v-if="batteryDetailInfo.bms_chargeStatus == '2'">
                        <el-tag type="success">充电</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="故障:">
                      {{ batteryDetailInfo.bms_errNbr }}个
                    </el-form-item>
                  </div>
                  <br><br>
                  <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="DTU状态:">
                      <div v-if="batteryDetailInfo.dtu_aliyunStatus == '1'">
                        <el-tag type="success">在线</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">离线</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                    <el-form-item label="定位状态:">
                      <div v-if="batteryDetailInfo.dtu_locateMode == '1'">
                        <el-tag type="success">GPS</el-tag>
                      </div>
                      <div v-if="batteryDetailInfo.dtu_locateMode == '2'">
                        <el-tag type="danger">基站</el-tag>
                      </div>
                      <div v-if="batteryDetailInfo.dtu_locateMode == '3'">
                        <el-tag type="warning">WIFI</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col :span="12">
                <div>
                  <gdmap :data-init="pkgid" />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="电池规格" name="first">
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="电池类型:">
                              <div v-if="batteryDetailInfo.pkg_type == '1'">
                                三元锂
                              </div>
                              <div v-else>
                                磷酸铁锂
                              </div>
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="标称电压:">
                              {{ parseFloat(batteryDetailInfo.pkg_nominalVoltage)/10 }}V
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="额定容量:">
                              {{ parseFloat(batteryDetailInfo.pkg_capacity)/100 }}Ah
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="电池串数:">
                              {{ batteryDetailInfo.pkg_count }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="硬件版本:">
                              {{ batteryDetailInfo.bms_hardVer }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="软件版本:">
                              {{ batteryDetailInfo.bms_softVer }}
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="协议版本:">
                              {{ batteryDetailInfo.bms_protocolVer }}
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="BMS编号:">
                              {{ batteryDetailInfo.bms_id }}
                            </el-form-item>
                          </div>

                          <div>
                            <el-form-item label="NTC:">
                              {{ batteryDetailInfo.pkg_ntcCount }}个
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="生产日期:">
                              {{ parseTime(batteryDetailInfo.pkg_manufactureDate) }}
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="单体电压" name="second">
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体1:">
                              {{ batteryDetailInfo.bms_cellVoltage1 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体2:">
                              {{ batteryDetailInfo.bms_cellVoltage2 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体3:">
                              {{ batteryDetailInfo.bms_cellVoltage3 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体4:">
                              {{ batteryDetailInfo.bms_cellVoltage4 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体5:">
                              {{ batteryDetailInfo.bms_cellVoltage5 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体6:">
                              {{ batteryDetailInfo.bms_cellVoltage6 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体7:">
                              {{ batteryDetailInfo.bms_cellVoltage7 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体8:">
                              {{ batteryDetailInfo.bms_cellVoltage8 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体9:">
                              {{ batteryDetailInfo.bms_cellVoltage9 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体10:">
                              {{ batteryDetailInfo.bms_cellVoltage10 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体11:">
                              {{ batteryDetailInfo.bms_cellVoltage11 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体12:">
                              {{ batteryDetailInfo.bms_cellVoltage12 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体13:">
                              {{ batteryDetailInfo.bms_cellVoltage13 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体14:">
                              {{ batteryDetailInfo.bms_cellVoltage14 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体15:">
                              {{ batteryDetailInfo.bms_cellVoltage15 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体16:">
                              {{ batteryDetailInfo.bms_cellVoltage16 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体17:">
                              {{ batteryDetailInfo.bms_cellVoltage17 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体18:">
                              {{ batteryDetailInfo.bms_cellVoltage18 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体19:">
                              {{ batteryDetailInfo.bms_cellVoltage19 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体20:">
                              {{ batteryDetailInfo.bms_cellVoltage20 }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-divider />
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="最低单体:">
                              {{ batteryDetailInfo.bms_minCellVoltage }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="最高单体:">
                              {{ batteryDetailInfo.bms_maxCellVoltage }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="平均单体:">
                              {{ batteryDetailInfo.bms_averageCellVoltage }}mv
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="最高温度:">
                              {{ batteryDetailInfo.bms_maxTemperature }}°C
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="最底温度:">
                              {{ batteryDetailInfo.bms_minTemperature }}°C
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="配置参数" name="third">
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="充电高温保护:">
                              {{ batteryDetailInfo.bms_chargeHighTempProtect }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="充电高温释放:">
                              {{ batteryDetailInfo.bms_chargeHighTempRelease }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="充电低温保护:">
                              {{ batteryDetailInfo.bms_chargeLowTempProtect }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="充电低温释放:">
                              {{ batteryDetailInfo.bms_chargeLowTempRelease }}°C
                            </el-form-item>
                          </div>

                          <div>
                            <el-form-item label="充电高温延时:">
                              {{ batteryDetailInfo.bms_chargeHighTempDelay }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="充电低温延时:">
                              {{ batteryDetailInfo.bms_chargeLowTempDelay }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="放电高温保护:">
                              {{ batteryDetailInfo.bms_dischargeHighTempProtect }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电高温释放:">
                              {{ batteryDetailInfo.bms_dischargeHighTempRelease }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电低温保护:">
                              {{ batteryDetailInfo.bms_dischargeLowTempProtect }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电低温释放:">
                              {{ batteryDetailInfo.bms_dischargeLowTempRelease }}°C
                            </el-form-item>
                          </div>

                          <div>
                            <el-form-item label="放电高温延时:">
                              {{ batteryDetailInfo.bms_dischargeHighTempDelay }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电低温延时:">
                              {{ batteryDetailInfo.bms_dischargeLowTempDelay }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="MOS高温保护:">
                              {{ batteryDetailInfo.bms_mosHighTempProtect }}°C
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="MOS高温释放:">
                              {{ batteryDetailInfo.bms_mosHighTempRelease }}°C
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="整组过压保护:">
                              {{ batteryDetailInfo.bms_pkgOverVoltageProtect/100 }}V
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="整组过压释放:">
                              {{ batteryDetailInfo.bms_pkgOverVoltageRelease/100 }}V
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="整组欠压保护:">
                              {{ batteryDetailInfo.bms_pkgUnderVoltageProtect/100 }}V
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="整组欠压释放:">
                              {{ batteryDetailInfo.bms_pkgUnderVoltageRelease/100 }}V
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="整组欠压延时:">
                              {{ batteryDetailInfo.bms_pkgUnderVoltageDelay }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="整组过压延时:">
                              {{ batteryDetailInfo.bms_pkgOverVoltageDelay }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="单体过压保护:">
                              {{ batteryDetailInfo.bms_cellOverVoltageProtect }}mV
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="单体过压释放:">
                              {{ batteryDetailInfo.bms_cellOverVoltageRelease }}mV
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="单体欠压保护:">
                              {{ batteryDetailInfo.bms_cellUnderVoltageProtect }}mV
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="单体欠压释放:">
                              {{ batteryDetailInfo.bms_cellUnderVoltageRelease }}mV
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="单体欠压延时:">
                              {{ batteryDetailInfo.bms_cellUnderVoltageDelay }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="单体过压延时:">
                              {{ batteryDetailInfo.bms_cellOverVoltageDelay }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="充电过流保护:">
                              {{ batteryDetailInfo.bms_chargeOverCurrentProtect }}A
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="充电过流延时:">
                              {{ batteryDetailInfo.bms_chargeOverCurrentDelay }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="充电过流释放:">
                              {{ batteryDetailInfo.bms_chargeOverCurrentRelease }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电过流保护:">
                              {{ batteryDetailInfo.bms_dischargeOverCurrentProtect }}A
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电过流延时:">
                              {{ batteryDetailInfo.bms_dischargeOverCurrentDelay }}s
                            </el-form-item>
                          </div>
                          <div>
                            <el-form-item label="放电过流释放:">
                              {{ batteryDetailInfo.bms_dischargeOverCurrentRelease }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-divider />
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="均衡开启电压:">
                              {{ batteryDetailInfo.bms_balanceOpenVoltage }}mV
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="均衡压差:">
                              {{ batteryDetailInfo.bms_balanceVoltageDiff }}mV
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="均衡时间:">
                              {{ batteryDetailInfo.bms_balanceTime }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="硬件单体过压:">
                              {{ batteryDetailInfo.bms_hardCellOverVoltage }}mV
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="硬件单体欠压:">
                              {{ batteryDetailInfo.bms_hardCellUnderVoltage }}mV
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="电池功能配置:">
                              {{ batteryDetailInfo.bms_funcConfig }}
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="110px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="放电系数:">
                              {{ batteryDetailInfo.bms_funcConfig }}
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="150px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="硬件过流和延时时间:">
                              {{ batteryDetailInfo.bms_hardOverCurrentAndDelayTime }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="180px" class="demo-ruleForm">
                          <div>
                            <el-form-item label="硬件欠压和过流延时时间:">
                              {{ batteryDetailInfo.bms_hardUnderVoltageAndOverCurrentDelayTime }}s
                            </el-form-item>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="24">
                      <div class="batterydetail">
                        <el-form ref="ruleForm" :model="ruleForm" label-width="200px" class="demo-ruleForm">
                          <div>
                            <el-tag type="warning">*参数为FF即255、65535表示功能不支持*</el-tag>
                          </div>
                        </el-form>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="运动轨迹" name="fourth"><gaodemovealong :data-init="pkgid" /></el-tab-pane>
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
import { getBatteryDetailInfo } from '@/api/batterymanage/batterydetail'

export default {
  name: 'Batterydetail',
  components: { gdmap, gaodemovealong },
  props: [],
  data() {
    return {
      activeName: 'first',
      // 遮罩层
      loading: true,
      // 电池规格信息
      batteryDetailInfo: {},

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
      pkgid: '',
      // 查询参数
      queryParams: {
        bms_specInfoId: undefined,
        pkg_id: undefined
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.pkgid = this.$route.params.id
    console.log('pkg_id=', this.pkgid)
    if (typeof (this.pkgid) === 'undefined') {
      // 获取session存储编号
      this.pkgid = sessionStorage.getItem('pkg_id')
      console.log('quchu pkid=', this.pkgid)
    } else {
      sessionStorage.setItem('pkg_id', this.pkgid)
      console.log('cunchu pkid=', this.pkgid)
    }
    this.getdevinfo()
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    /** 查询电池列表 */
    getdevinfo() {
      this.loading = true

      // const bms_specInfoId1 = this.queryParams.bms_specInfoId
      this.queryParams.pkg_id = this.pkgid
      getBatteryDetailInfo(this.queryParams).then(response => {
        this.batteryDetailInfo = response.data[0]
        this.loading = false
        // this.pkgid = this.batteryDetailInfo.pkg_id
        console.log('getBatteryDetailInfo', response)
      })
    },
    onReturnBL() {
      this.$router.push({ name: 'batterylist' })
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
 .batterydetail/deep/ .el-form-item{
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
