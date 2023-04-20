import request from '@/utils/request'

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url: '/system/job/log/list',
    method: 'get',
    params: query
  })
}

// 删除调度日志
export function delJobLog(jobLogIds) {
  return request({
    url: '/system/job/log/delete?jobLogIds=' + jobLogIds,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog(jobId) {
  console.log(jobId)
  return request({
    url: `/system/job/log/clean?jobId=${jobId}`,
    method: 'delete'
  })
}
