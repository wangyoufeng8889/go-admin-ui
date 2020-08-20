import request from '@/utils/request'
// 查询电池列表
export function getBatteryDetail_dtustatusinfo(query) {
  return request({
    url: '/api/bm1/batterydetail/dtu_statusinfo',
    method: 'get',
    params: query
  })
}
