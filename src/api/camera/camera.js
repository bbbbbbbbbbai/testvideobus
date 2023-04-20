import request from '@/utils/request'

// 查询摄像头信息列表
export function listCamera(query) {
    return request({
        url: '/camera/camera/list',
        method: 'get',
        params: query
    })
}

// 查询摄像头信息列表
export function listAllCamera(query) {
    return request({
        url: '/camera/camera/list/all',
        method: 'get',
        params: query
    })
}

// 查询摄像头信息详细
export function getCamera(id) {
    return request({
        url: '/camera/camera/info?cameraId=' + id,
        method: 'get'
    })
}

// 新增摄像头信息
export function addCamera(data) {
    return request({
        url: '/camera/camera/save',
        method: 'post',
        data: data
    })
}

// 修改摄像头信息
export function updateCamera(data) {
    return request({
        url: '/camera/camera/update',
        method: 'put',
        data: data
    })
}

// 删除摄像头信息
export function delCamera(id) {
    return request({
        url: '/camera/camera/batch/remove?cameraIds=' + id,
        method: 'delete'
    })
}


// 远程查询摄像头信息
export function listRemoteCamera(query) {
    return request({
        url: '/camera/camera/list/remote',
        method: 'get',
        params: query
    })
}
