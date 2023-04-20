import request from '@/utils/request'

// 查询视频信息列表
export function listVideo(query) {
    return request({
        url: '/video/video/list',
        method: 'get',
        params: query
    })
}

// 查询视频信息详细
export function getVideo(id) {
    return request({
        url: '/video/video/info?videoId=' + id,
        method: 'get'
    })
}

// 新增视频信息
export function addVideo(data) {
    return request({
        url: '/video/video/save',
        method: 'post',
        data: data
    })
}

// 修改视频信息
export function updateVideo(data) {
    return request({
        url: '/video/video/update',
        method: 'put',
        data: data
    })
}

// 删除视频信息
export function delVideo(id) {
    return request({
        url: '/video/video/batch/remove?videoIds=' + id,
        method: 'delete'
    })
}
