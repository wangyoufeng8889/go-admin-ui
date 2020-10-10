import request from '@/utils/request'
// 查询电池列表

export function getDtuBmsBandInfo(query) {
  console.log('getDtuBmsBandInfo', query)
  return request({
    url: '/api/bm1/battery/dtubmsbandlog',
    method: 'get',
    params: query
  })
}
