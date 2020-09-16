import request from '@/utils/request'
// 查询dtustatusinfo列表
export function getDtuDetailInfo(query) {
  return request({
    url: '/api/bm1/battery/dtudetail',
    method: 'get',
    params: query
  })
}
// 查询电池SOC
export function getDtuCSQInfo(query) {
  return request({
    url: '/api/bm1/battery/dtudetail/dtucsq',
    method: 'get',
    params: query
  })
}
