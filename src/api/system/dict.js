import request from '@/utils/request'

// 查询字典列表
export function listDict(query) {
  return request({
    url: '/system/data/dict/list',
    method: 'get',
    params: query
  })
}

// 新增字典
export function addDict(data) {
  return request({
    url: '/system/data/dict/save',
    method: 'post',
    data: data
  })
}

// 修改字典
export function updateDict(data) {
  return request({
    url: '/system/data/dict/update',
    method: 'put',
    data: data
  })
}

// 删除字典
export function delDicts(dataDictIds) {
  return request({
    url: `/system/data/dict/delete?dataDictIds=${dataDictIds}`,
    method: 'delete'
  })
}

// 根据类型查询字典
export function getDicts(type) {
  return request({
    url: `/system/data/dict/list/type?type=${type}`,
    method: 'get'
  })
}
