import request from '@/utils/request'

// 获取拿货列表
export function getGoodsList(params) {
  return request({
    url: '/getgoods/getGetGoodsList?' + params,
    method: 'get'
  })
}

// 获取待打印列表
export function getToPrintList(params) {
  return request({
    url: '/getgoods/getToPrintList?' + params,
    method: 'get'
  })
}

// 获取拿货反馈
export function getFeedback(params) {
  return request({
    url: '/getgoods/getFeedback?' + params,
    method: 'get'
  })
}

// 标记为已读
export function markRead(params) {
  return request({
    url: '/getgoods/markRead?id=' + params,
    method: 'post'
  })
}

// 标记为完成
export function markGet(params) {
  return request({
    url: '/getgoods/markGet?id=' + params,
    method: 'post'
  })
}

// 处理拿货反馈
export function dealFeedback(params) {
  return request({
    url: '/getgoods/dealFeedback?' + params,
    method: 'post'
  })
}

// 完成拿货反馈
export function doneFeedback(params) {
  return request({
    url: '/getgoods/doneFeedback?FeedbackId=' + params,
    method: 'post'
  })
}

// 编辑拿货表
export function editGetGoodsInfo(params) {
  return request({
    url: '/getgoods/editGetGoodsInfo?' + params,
    method: 'post'
  })
}

// 根据spuID获取getgoodslist
export function getGetGoodsNumListBySpuID(id) {
  return request({
    url: '/getgoods/getGetGoodsNumListBySpuID?spuID=' + id,
    method: 'get'
  })
}

// 设置默认拿货
export function setDefaultGetGoodsNum(params) {
  return request({
    url: '/getgoods/setDefaultGetGoodsNum?' + params,
    method: 'post'
  })
}
