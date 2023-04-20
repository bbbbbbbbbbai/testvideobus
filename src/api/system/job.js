import request from '@/utils/request'

// 查询定时任务调度列表
export function listJob(query) {
  return request({
    url: '/system/job/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return request({
    url: '/system/job/info?jobId=' + jobId,
    method: 'get'
  })
}

// 新增定时任务调度
export function addJob(data) {
  return request({
    url: '/system/job/save',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob(data) {
  return request({
    url: '/system/job/update',
    method: 'put',
    data: data
  })
}

// 删除定时任务调度
export function delJob(jobIds) {
  return request({
    url: '/system/job/delete?jobIds=' + jobIds,
    method: 'delete'
  })
}

// 任务状态修改
export function changeJobStatus(jobId, status) {
  return request({
    url: `/system/job/${status === 'NORMAL' ? 'start' : 'stop'}?jobId=${jobId}`,
    method: 'put'
  })
}


// 定时任务立即执行一次
export function runJob(jobId) {
  return request({
    url: `/system/job/execute?jobId=${jobId}`,
    method: 'put'
  })
}
