<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-container>
          <el-header style="height:20px">
            <el-button style="float: right; padding: 3px 0" type="danger" icon="el-icon-back" @click="onReturnBL">返回电池列表</el-button>
          </el-header>
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
                    <el-form-item label="DTU编号:">
                      {{ batteryDetailInfo.dtu_id }}
                    </el-form-item>
                  </div>
                  <div>
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
                  <div>
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
                    <el-form-item label="DTU绑定:">
                      <div v-if="batteryDetailInfo.dtu_bmsBindStatus == '1'">
                        <el-tag type="success">绑定</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">分离</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
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
                  <div>
                    <el-form-item label="DTU状态:">
                      <div v-if="batteryDetailInfo.dtu_aliyunStatus == '1'">
                        <el-tag type="success">在线</el-tag>
                      </div>
                      <div v-else>
                        <el-tag type="danger">离线</el-tag>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </el-col>
              <el-col :span="12">
                <div>
                  <gdmap :data-init="mapcenter" />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="电池单体电压" name="first">
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
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="运动轨迹" name="second"><gaodemovealong :data-init="pkgid" /></el-tab-pane>
                <el-tab-pane label="电池配置" name="third">
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
                </el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
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
      mapcenter: [],
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
    this.queryParams.pkg_id = this.$route.params.id

    // console.log(this.$route.params.id)
    // this.queryParams.pkg_id = this.$route.params.id
    // this.getdevinfo()

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
      getBatteryDetailInfo(this.queryParams).then(response => {
        this.batteryDetailInfo = response.data[0]
        this.mapcenter.push(this.batteryDetailInfo.dtu_longitude)
        this.mapcenter.push(this.batteryDetailInfo.dtu_latitude)
        this.loading = false
        this.pkgid = this.batteryDetailInfo.pkg_id
        console.log('getDTUDetailDtuSpecInfo', response)
      })
    },
    onReturnBL() {
      this.$router.push({ name: 'batterylist' })
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
