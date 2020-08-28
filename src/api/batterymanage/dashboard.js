import request from '@/utils/request'
// 查询电池列表

export function getBatteryDashboardInfo(query) {
  console.log('getBatteryDashboardInfo', query)
  return request({
    url: '/api/bm1/battery/dashboard',
    method: 'get',
    params: query
  })
}
