import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/permission/list',
    method: 'get',
    params: query
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/permission/save',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/permission/update',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: `/system/permission/delete?permissionId=${menuId}`,
    method: 'delete'
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: `/system/permission/info?permissionId=${menuId}`,
    method: 'get'
  })
}
