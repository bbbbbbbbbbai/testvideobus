import request from '@/utils/request'

// 查询定时任务调度列表
export function listTask(query) {
  return request({
    url: '/system/task/list',
    method: 'get',
    params: query
  })
}

// 定时任务立即执行一次
export function executeTasks(taskIds) {
  return request({
    url: `/system/task/execute?taskIds=${taskIds}`,
    method: 'put'
  })
}
