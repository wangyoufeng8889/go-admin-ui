import request from '@/utils/request'
// 查询电池列表

export function getBatteryDetailInfo(query) {
  console.log('getBatteryDetailInfo', query)
  return request({
    url: '/api/bm1/battery/batterydetail',
    method: 'get',
    params: query
  })
}
// 查询电池SOC
export function getBatterySOCInfo(query) {
  return request({
    url: '/api/bm1/battery/batterydetail/batterysoc',
    method: 'get',
    params: query
  })
}
// 查询电池单体
export function getBatteryCellInfo(query) {
  return request({
    url: '/api/bm1/battery/batterydetail/batterycell',
    method: 'get',
    params: query
  })
}
// 查询电池温度
export function getBatteryTemperInfo(query) {
  return request({
    url: '/api/bm1/battery/batterydetail/batterytemper',
    method: 'get',
    params: query
  })
}
