import request from '@/utils/request'
// 查询电池列表
export function getDTUDetail_dtustatusinfo(query) {
  return request({
    url: '/api/bm1/battery/batterydetail/dtu_statusinfo',
    method: 'get',
    params: query
  })
}
