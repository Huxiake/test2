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
export function markPicked(params) {
  return request({
    url: '/order/markPicked?' + params,
    method: 'post'
  })
}

// order标记确认发货
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

// 删除订单详情
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

// 获取阿里订单详情
export function pullAliOrderDetail(params) {
  return request({
    url: '/order/getAndPullAliOrder?OrderIDList=' + params,
    method: 'get'
  })
}

// 根据spuID获取spu
export function getSpuInfoBySectionID(sectionID) {
  return request({
    url: '/order/getSpuInfoBySectionID?SectionID=' + sectionID,
    method: 'get'
  })
}

// 根据快递单号获取订单详情
export function getOrderDetailByCourierNum(courierNum) {
  return request({
    url: '/order/getOrderDetailByCourierNum?CourierNum=' + courierNum,
    method: 'get'
  })
}

// 设置订单详情状态
export function markOrderDetailStatus(id, orderID, status, amount) {
  return request({
    url: '/order/markOrderDetailStatus?orderDetailID=' + id + '&status=' + status + '&amount=' + amount + '&orderID=' + orderID,
    method: 'post'
  })
}

// 标记订单重拿状态
export function signOrderPending(params) {
  return request({
    url: '/order/signOrderPending?OrderList=' + params,
    method: 'post'
  })
}

// 标记订单重拿状态
export function returnGoodsByOrderDetailID(params) {
  return request({
    url: '/order/returnGoodsByOrderDetailID?OrderDetailID=' + params,
    method: 'post'
  })
}

// 更新订单金额利润
export function updateProfitCostByOrderID(params) {
  return request({
    url: '/order/updateProfitCostByOrderID?' + params,
    method: 'post'
  })
}

// 标记订单确认退货
export function markRefund(params) {
  return request({
    url: '/order/markRefund?' + params,
    method: 'post'
  })
}

// 根据idlist导出利润文件
export function exportProfitFile(params) {
  return request({
    url: '/order/exportProfitFile?' + params,
    method: 'post'
  })
}
