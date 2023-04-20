import request from '@/utils/request'

// 查询评论列表
export function listComment(query) {
    return request({
        url: '/comment/comment/list',
        method: 'get',
        params: query
    })
}

// 查询评论详细
export function getComment(id) {
    return request({
        url: '/comment/comment/info?commentId=' + id,
        method: 'get'
    })
}

// 新增评论
export function addComment(data) {
    return request({
        url: '/comment/comment/save',
        method: 'post',
        data: data
    })
}

// 修改评论
export function updateComment(data) {
    return request({
        url: '/comment/comment/update',
        method: 'put',
        data: data
    })
}

// 删除评论
export function delComment(id) {
    return request({
        url: '/comment/comment/batch/remove?commentIds=' + id,
        method: 'delete'
    })
}
