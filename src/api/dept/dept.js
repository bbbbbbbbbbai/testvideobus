import request from '@/utils/request'

// 查询调阅单位列表
export function listDept(query) {
    return request({
        url: '/dept/dept/list',
        method: 'get',
        params: query
    })
}

// 查询调阅单位详细
export function getDept(id) {
    return request({
        url: '/dept/dept/info?deptId=' + id,
        method: 'get'
    })
}

// 新增调阅单位
export function addDept(data) {
    return request({
        url: '/dept/dept/save',
        method: 'post',
        data: data
    })
}

// 修改调阅单位
export function updateDept(data) {
    return request({
        url: '/dept/dept/update',
        method: 'put',
        data: data
    })
}

// 删除调阅单位
export function delDept(id) {
    return request({
        url: '/dept/dept/batch/remove?deptIds=' + id,
        method: 'delete'
    })
}

export function remoteDepts() {
    return request({
        url: '/dept/dept/list/remote',
        method: 'get'
    })
}

