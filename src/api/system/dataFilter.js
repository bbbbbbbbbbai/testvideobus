import request from '@/utils/request'

// 查询数据过滤列表
export function listDataFilter(query) {
  return request({
    url: '/system/data/filter/list',
    method: 'get',
    params: query
  })
}

// 新增数据过滤
export function addDataFilter(data) {
  return request({
    url: '/system/data/filter/save',
    method: 'post',
    data: data
  })
}

// 修改数据过滤
export function updateDataFilter(data) {
  return request({
    url: '/system/data/filter/update',
    method: 'put',
    data: data
  })
}

// 删除数据过滤
export function delDataFilters(dataFilterIds) {
  return request({
    url: `/system/data/filter/delete?dataFilterIds=${dataFilterIds}`,
    method: 'delete'
  })
}
