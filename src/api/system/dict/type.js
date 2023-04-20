import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params: query
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/system/dict/type/save',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/system/dict/type/update',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delType(dictIds) {
  return request({
    url: '/system/dict/type/delete?dictTypeIds=' + dictIds,
    method: 'delete'
  })
}

// 查询字典类型详细
export function getType(dictTypeId) {
  return request({
    url: '/system/dict/type/info?dictTypeId=' + dictTypeId,
    method: 'get'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/type/list/all',
    method: 'get'
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/system/dict/type/refresh/cache',
    method: 'delete'
  })
}

