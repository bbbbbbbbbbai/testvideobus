import request from '@/utils/request'

// 查询区域管理列表
export function listArea(query) {
    return request({
        url: '/area/area/list',
        method: 'get',
        params: query
    })
}

// 查询区域管理详细
export function getArea(id) {
    return request({
        url: '/area/area/info?areaId=' + id,
        method: 'get'
    })
}

// 新增区域管理
export function addArea(data) {
    return request({
        url: '/area/area/save',
        method: 'post',
        data: data
    })
}

// 修改区域管理
export function updateArea(data) {
    return request({
        url: '/area/area/update',
        method: 'put',
        data: data
    })
}

// 删除区域管理
export function delArea(id) {
    return request({
        url: '/area/area/batch/remove?areaIds=' + id,
        method: 'delete'
    })
}

// 删除区域管理
export function remoteAreas() {
    return request({
        url: '/area/area/list/remote',
        method: 'get'
    })
}
