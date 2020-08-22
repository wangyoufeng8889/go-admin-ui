import request from '@/utils/request'
// 查询电池列表
export function getDTUList(query) {
  return request({
    url: '/api/bm1/battery/dtulist',
    method: 'get',
    params: query
  })
}

// 删除电池
export function delOneDTUList(dtuPkg_listId) {
  return request({
    url: '/api/bm1/battery/dtulist/' + dtuPkg_listId,
    method: 'delete'
  })
}
