import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role/save',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role/update',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: `/system/role/delete?roleId=${roleId}`,
    method: 'delete'
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: `/system/role/info?roleId=${roleId}`,
    method: 'get'
  })
}

// 查询角色权限
export function getRolePermissionIds(roleId) {
  return request({
    url: `/system/role/permission/ids?roleId=${roleId}`,
    method: 'get'
  })
}

// 重置角色权限
export function updateRolePermission(query) {
  return request({
    url: `/system/role/reset/permissions`,
    method: 'put',
    params: query
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/system/role/list/allocated/users',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/list/unallocated/users',
    method: 'get',
    params: query
  })
}

// 添加角色用户
export function addRoleUsers(data) {
  return request({
    url: '/system/role/allocate/user',
    method: 'put',
    params: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/remove/allocated/users',
    method: 'put',
    params: data
  })
}

