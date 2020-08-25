import request from '@/utils/request'
// 查询电池轨迹
export function getBatteryMoveInfo(query) {
  return request({
    url: '/api/bm1/battery/batterymove',
    method: 'get',
    params: query
  })
}
// 查询电池定位
export function getBatteryLocationInfo(query) {
  return request({
    url: '/api/bm1/battery/batterymove/location',
    method: 'get',
    params: query
  })
}
