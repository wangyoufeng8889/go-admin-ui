import request from '@/utils/request'
// 查询电池列表
export function getBatteryList(query) {
  return request({
    url: '/api/bm1/battery/batterylist',
    method: 'get',
    params: query
  })
}

// 删除电池
export function delOneBatteryList(bms_specinfoId) {
  return request({
    url: '/api/bm1/battery/batterylist/' + bms_specinfoId,
    method: 'delete'
  })
}
