import request from '@/utils/request'
// 查询dtustatusinfo列表
export function getDTUDetailDtuSpecInfo(query) {
  return request({
    url: '/api/bm1/battery/dtudetail/dtu_specinfo',
    method: 'get',
    params: query
  })
}
// 查询dtustatusinfo列表
export function getDTUDetailDtuStatusInfo(query) {
  return request({
    url: '/api/bm1/battery/dtudetail/dtu_statusinfo',
    method: 'get',
    params: query
  })
}
