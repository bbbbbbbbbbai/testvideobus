import request from '@/utils/request'

// 查询车辆信息列表
export function listCar(query) {
    return request({
        url: '/car/car/list',
        method: 'get',
        params: query
    })
}

// 查询车辆信息详细
export function getCar(id) {
    return request({
        url: '/car/car/info?carId=' + id,
        method: 'get'
    })
}

// 新增车辆信息
export function addCar(data) {
    return request({
        url: '/car/car/save',
        method: 'post',
        data: data
    })
}

// 修改车辆信息
export function updateCar(data) {
    return request({
        url: '/car/car/update',
        method: 'put',
        data: data
    })
}

// 删除车辆信息
export function delCar(id) {
    return request({
        url: '/car/car/batch/remove?carIds=' + id,
        method: 'delete'
    })
}


export function remoteCars(query) {
    return request({
        url: '/car/car/list/remote',
        method: 'get',
        params: query
    })
}
