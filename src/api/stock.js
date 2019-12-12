import request from '@/utils/request'

// 获取spu列表
export function stockList(params) {
  return request({
    url: '/stock/getErpSpuList?' + params,
    method: 'get'
  })
}

// 修改spu信息
export function updateErpSpu(data) {
  return request({
    url: '/stock/updateErpSpu',
    method: 'put',
    data: data
  })
}

// 删除spu
export function deleteErpSpu(id) {
  return request({
    url: '/stock/deleteErpSpu?sectionId=' + id,
    method: 'post'
  })
}

// 获取打印列表
export function getPrintList(id_arr) {
  return request({
    url: '/stock/getPrintList?id=' + id_arr,
    method: 'get'
  })
}

// 获取spu详情（sku列表）
export function stockDetails(id) {
  return request({
    url: '/stock/details/getErpSpuDetails?sectionId=' + id,
    method: 'get'
  })
}

// 上传spu图片
export function uploadSpuPic(data) {
  return request({
    url: '/stock/uploadSpuImg',
    method: 'post',
    data: data
  })
}

// 上传库存xls
export function uploadSpuXls(data) {
  return request({
    url: '/stock/uploadStock',
    method: 'post',
    data: data
  })
}

// 新增sku信息
export function addErpSku(data) {
  return request({
    url: '/stock/details/addErpSku',
    method: 'post',
    data: data
  })
}

// 新增spu信息
export function addErpSpu(data) {
  return request({
    url: '/stock/addErpSpu',
    method: 'post',
    data: data
  })
}

// 修改sku信息
export function updateErpSku(data) {
  return request({
    url: '/stock/details/updateErpSku',
    method: 'put',
    data: data
  })
}

// 删除sku
export function deleteErpSku(id) {
  return request({
    url: '/stock/details/deleteErpSku?skuId=' + id,
    method: 'post'
  })
}

// 扫描入库
export function scaningEnter(id) {
  return request({
    url: '/stock/scanToWarehouse?id=' + id,
    method: 'post'
  })
}

// 扫描出库
export function scaningOut(id) {
  return request({
    url: '/stock/scanToSend?id=' + id,
    method: 'post'
  })
}

// 同步阿里商品
export function putAliProductList() {
  return request({
    url: '/stock/pullAliProductList',
    method: 'post'
  })
}

// 获取分组
export function getGroupList() {
  return request({
    url: '/stock/getGroupList',
    method: 'get'
  })
}

// 编辑分组
export function updateErpGroup(data) {
  return request({
    url: '/stock/updateErpGroup',
    method: 'post',
    data: data
  })
}

// 删除分组
export function deleteGroup(params) {
  return request({
    url: '/stock/deleteGroup?' + params,
    method: 'post'
  })
}

// 添加分组
export function addErpGroup(data) {
  return request({
    url: '/stock/addErpGroup',
    method: 'post',
    data: data
  })
}

// 设置分组
export function setSpuGroup(params) {
  return request({
    url: '/stock/setSpuGroup?' + params,
    method: 'post'
  })
}
