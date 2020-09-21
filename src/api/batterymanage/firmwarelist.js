import request from '@/utils/request'
// 查询固件列表
export function getFirmwareList(query) {
  return request({
    url: '/api/bm1/otaupdate/firmwarelist',
    method: 'get',
    params: query
  })
}

// 删除固件
export function delOneFirmwareList(ota_firmwareId) {
  return request({
    url: '/api/bm1/otaupdate/firmwarelist/' + ota_firmwareId,
    method: 'delete'
  })
}

// 新增固件
export function addFirmware(data) {
  return request({
    url: '/api/bm1/otaupdate/firmwarelist',
    method: 'post',
    data: data
  })
}
