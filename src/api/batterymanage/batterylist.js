import request from '@/utils/request'
// 查询电池列表
export function getBatteryList(query) {
  return request({
    url: '/api/bm1/batterylist',
    method: 'get',
    params: query
  })
}

// 删除电池
export function delOneBatteryList(battery_listId) {
  return request({
    url: '/api/bm1/batterylist/' + battery_listId,
    method: 'delete'
  })
}
