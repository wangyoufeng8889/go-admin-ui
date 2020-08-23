import request from '@/utils/request'
// 查询dtustatusinfo列表
export function getDTUDetailDtuSpecInfo(query) {
  return request({
    url: '/api/bm1/battery/dtudetail',
    method: 'get',
    params: query
  })
}
