import request from '@/utils/request'

// 登录方法
export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/auth/login?loginName=' + username + '&password=' + password,
    headers: {
      isToken: false
    },
    method: 'post'
  })
}

// 获取用户详细信息
export function getPermissions() {
  return request({
    url: '/system/user/session/user/permissions',
    headers: {
      isToken: true
    },
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    headers: {
      isToken: true
    },
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/user/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
