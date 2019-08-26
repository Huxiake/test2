import request from '@/utils/request'

// 获取未处理的order列表
export function orderList(params) {
  return request({
    url: '/order/getOrderList?' + params,
    method: 'get'
  })
}

// order配货
export function toGetGoodsList(params) {
  return request({
    url: '/order/toGetGoodsList?' + params,
    method: 'post'
  })
}

// order标记待货
export function markWaiting(params) {
  return request({
    url: '/order/markWaiting?' + params,
    method: 'post'
  })
}

// order标记完成拣货
export function markCompleted(params) {
  return request({
    url: '/order/markCompleted?' + params,
    method: 'post'
  })
}

// order上传模板
export function uploadOrder(data) {
  return request({
    url: '/order/uploadOrder',
    method: 'post',
    data: data
  })
}

// 新增订单
export function addErpOrder(data) {
  return request({
    url: '/order/addErpOrder',
    method: 'post',
    data: data
  })
}

// 新增订单详情
export function addErpOrderDetails(data) {
  return request({
    url: '/order/addErpOrderDetails',
    method: 'post',
    data: data
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: '/order/deleteOrder?id=' + id,
    method: 'post'
  })
}

// 删除订单
export function deleteOrderDetails(id) {
  return request({
    url: '/order/deleteOrderDetails?id=' + id,
    method: 'post'
  })
}

// 删除订单
export function getSkuInfoBySectionNum(SectionNum) {
  return request({
    url: '/order/getSkuInfoBySectionNum?SectionNum=' + SectionNum,
    method: 'get'
  })
}

// 同步阿里订单
export function pullAliOrderList() {
  return request({
    url: '/order/pullAliOrderList',
    method: 'post'
  })
}
