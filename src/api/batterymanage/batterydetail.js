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

export function getBatteryMoveInfo(query) {
  return request({
    url: '/api/bm1/battery/batterymove',
    method: 'get',
    params: query
  })
}
