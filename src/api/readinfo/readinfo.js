import request from '@/utils/request'

// 查询调阅信息列表
export function listReadinfo(query) {
    return request({
        url: '/readinfo/readinfo/list',
        method: 'get',
        params: query
    })
}

// 查询调阅信息详细
export function getReadinfo(id) {
    return request({
        url: '/readinfo/readinfo/info?readInfoId=' + id,
        method: 'get'
    })
}

// 新增调阅信息
export function addReadinfo(data) {
    return request({
        url: '/readinfo/readinfo/save',
        method: 'post',
        data: data
    })
}

// 修改调阅信息
export function updateReadinfo(data) {
    return request({
        url: '/readinfo/readinfo/update',
        method: 'put',
        data: data
    })
}

// 删除调阅信息
export function delReadinfo(id) {
    return request({
        url: '/readinfo/readinfo/batch/remove?readInfoIds=' + id,
        method: 'delete'
    })
}
