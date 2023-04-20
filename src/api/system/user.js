import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/save',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user/update',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url:  `/system/user/delete?userId=${userId}`,
    method: 'delete'
  })
}


// 查询用户详细
export function getUser(userId) {
  return request({
    url: `/system/user/info?userId=${userId}`,
    method: 'get'
  })
}

// 用户状态修改
export function changeUserStatus(userId, enable) {
  return request({
    url: `/system/user/${enable ? 'enable' : 'disable'}?userId=${userId}`,
    method: 'put'
  })
}

// 查询当前会话用户个人信息
export function getSessionUserInfo() {
  return request({
    url: '/system/user/session/user/info',
    method: 'get'
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/update/password',
    method: 'put',
    params: data
  })
}
