import request from '@/utils/request'
// 查询电池列表
export function getBatteryDetailBmsStatusInfo(query) {
  return request({
    url: '/api/bm1/battery/batterydetail/bms_statusinfo',
    method: 'get',
    params: query
  })
}
