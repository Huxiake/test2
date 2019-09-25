<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>待处理订单</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="4" type="flex" justify="end">
          <!-- <el-col :span="4" :offset="20"> -->
          <el-col :span="4">
            <el-input
              v-model="paginator.OrderNum"
              size="medium"
              placeholder="请输入款号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="medium" @click="getList">查询</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-top:20px;margin-bottom:20px" type="flex" justify="space-between">
          <el-col :span="4">
            <el-button type="primary" size="medium" @click="dealWithOrder">配货</el-button>
            <el-button size="medium" @click="handleMarkWaiting">标记待货</el-button>
          </el-col>
          <el-col :span="3">
            <el-button size="medium" type="primary" style="font-size:12px;" @click="addOrder">新增</el-button>
            <el-button size="medium" type="warning" style="font-size:12px;" @click="putAliOrder">同步订单</el-button>
            <!-- <el-upload
              class="upload-demo"
              action=""
              style="float:right"
              :show-file-list="false"
              :before-upload="beforeXlsUpload"
              :http-request="uploadXlsFile"
            >
              <el-button size="medium" type="warning" style="font-size:12px;">导入</el-button>
            </el-upload> -->
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <!-- <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row type="flex" justify="end">
                <el-col :span="1">
                  <el-button type="primary" size="small" @click="addOrderDetails(scope)">
                    添加
                  </el-button>
                </el-col>
              </el-row>
              <div class="expand-header">订单明细:</div>
              <el-table
                :data="scope.row.ErpOrderDetails"
                header-row-class-name="testStyle"
                border
              >
                <el-table-column label="款号" align="center">
                  <template slot-scope="subScope">
                    <el-input v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" v-model="newOrderDetailsInfo.SectionNum" @change="changeSectionNum" />
                    <span v-else>{{ subScope.row.SectionNum }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="颜色" align="center">
                  <template slot-scope="subScope">
                    <el-select v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" v-model="newOrderDetailsInfo.Color" filterable placeholder="请选择">
                      <el-option
                        v-for="item in Object.keys(skuInfo)"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                    <span v-else>{{ subScope.row.Color }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="尺码" align="center">
                  <template slot-scope="subScope">
                    <el-select v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" v-model="newOrderDetailsInfo.Size" filterable placeholder="请选择">
                      <el-option
                        v-for="item in skuInfo[newOrderDetailsInfo.Color]"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                    <span v-else>{{ subScope.row.Size }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                  <template slot-scope="subScope">
                    <el-input v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" v-model="newOrderDetailsInfo.Amount" />
                    <span v-else>{{ subScope.row.Amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="状态" prop="ErpStatus" align="center">
                  <template slot-scope="subScope">
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" type="info">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'fulfilled'" type="success">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'get'" type="success">已拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" type="warning">待拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'lack'" type="danger">待处理缺货</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="发货备注" align="center">
                  <template slot-scope="subScope">
                    <span v-html="subScope.row.DeliverRemark.replace(',', '</br>')" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="subScope">
                    <el-button v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" type="primary" size="small" @click="newOrderDetalisSubmit">保存</el-button>
                    <el-button v-else size="small" @click="handleDeleteOrderDetails(subScope.row.Id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="OrderNum" align="center" />
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              {{ $moment(scope.row.OrderCreateTime).format('YYYY-MM-DD hh:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="买家公司名" prop="BuyerCompanyName" align="center" />
          <el-table-column :formatter="tableFormatter" label="买家会员名" prop="BuyerMemberName" align="center" />
          <el-table-column label="实付金额" prop="GoodsRealPrice" align="center" width="80" />
          <el-table-column :formatter="tableFormatter" label="买家留言" prop="BuyerRemake" align="center" />
          <el-table-column :formatter="tableFormatter" label="备注" prop="Remark" align="center" />
          <el-table-column label="订单状态" prop="OrderStatus" align="center" />
          <el-table-column label="仓库状态" prop="ErpStatus" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'pending'" type="info">新订单</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'forPickup'">处理中</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'waiting'" type="danger">待货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteOrder(scope.row.Id)" />
            </template>
          </el-table-column>
        </el-table> -->
        <el-table
          v-loading="tableLoading"
          element-loading-text=""
          :data="tableData"
          header-cell-class-name="orderHeaderStyle"
          cell-class-name="testStyle"
          :default-expand-all="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column type="expand" width="20">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.ErpOrderDetails"
                :show-header="false"
                header-row-class-name="expand-header"
                border
                style="padding:0px;"
                @cell-mouse-enter="enterOrderDetailsOption"
                @cell-mouse-leave="leaveOrderDetailsOption"
              >
                <!-- 商品信息框 -->
                <el-table-column width="265">
                  <template slot-scope="subScope">
                    <div class="goodsInfo-left">
                      <el-popover
                        placement="right-start"
                        width="326"
                        trigger="hover"
                      >
                        <img :src="subScope.row.ProductImgURL" style="margin:0 auto;width:300px;height:300px">
                        <span>{{ "ID: " + subScope.row.SectionID }}</span>
                        <img slot="reference" :src="subScope.row.ProductImgURL" style="width:66px;height:66px;border:2px solid #e3e3e3;">
                      </el-popover>
                    </div>
                    <div class="goodsInfo-right">
                      <div style="line-height:16px;">
                        <a :href="subScope.row.SaleURL" target="_blank" style="color:#428bca">{{ subScope.row.Color + " " + subScope.row.Size }}</a>
                        <span>*</span>
                        <el-badge :value="subScope.row.Amount" class="item" style="padding-top: 8px;" :type="Number(subScope.row.Amount) > 1 ? 'danger' : 'info'" />
                      </div>
                      <div>
                        {{ subScope.row.SectionNum }}
                      </div>
                      <div>
                        {{ subScope.row.ProductSalePrice }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 中间的 -->
                <el-table-column align="center">
                  <!-- <template slot-scope="subScope">
                    <el-input v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" v-model="newOrderDetailsInfo.Amount" />
                    <span v-else>{{ subScope.row.Amount }}</span>
                  </template> -->
                </el-table-column>
                <!-- 状态框 -->
                <el-table-column prop="ErpStatus" align="center" width="100">
                  <template slot-scope="subScope">
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" type="info" size="small">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'fulfilled'" type="success" size="small">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'get'" type="success" size="small">已拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" type="warning" size="small">待拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'lack'" type="danger" size="small">待处理缺货</el-tag>
                  </template>
                </el-table-column>
                <!-- 操作框 -->
                <el-table-column align="center" width="180">
                  <template slot-scope="subScope">
                    <!-- <el-button v-if="subScope.row.ErpOrder.Id = newOrderDetailsInfo.ErpOrder.Id && subScope.row.new" type="primary" size="small" @click="newOrderDetalisSubmit">保存</el-button> -->
                    <a v-show="deleteOrderDetailsBtnId === subScope.row.Id" type="primary" size="small" @click="handleDeleteOrderDetails(subScope.row.Id)">
                      删除
                    </a>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" prop="OrderNum" width="205" />
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              {{ $moment(scope.row.OrderCreateTime).format('YYYY-MM-DD hh:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="订单金额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.GoodsRealPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="买家信息" prop="BuyerMemberName" align="center">
            <template slot-scope="scope">
              {{ scope.row.BuyerMemberName }}
            </template>
          </el-table-column>
          <el-table-column :formatter="tableFormatter" label="买家留言" prop="BuyerRemake" align="center" />
          <el-table-column :formatter="tableFormatter" label="备注" prop="Remark" align="center" />
          <el-table-column keylabel="仓库状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'pending'" type="info" size="small">新订单</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'forPickup'" size="small">处理中</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'waiting'" type="danger" size="small">待货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <!-- <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteOrder(scope.row.Id)">删除</el-buton> -->
              <el-button type="danger" size="mini" @click="handleDeleteOrder(scope.row.Id)">
                删除
              </el-button>
              <el-button size="mini" @click="addOrderDetails(scope.row.Id)">
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="paginatorInfo.currentPage + 1"
          :page-sizes="[50, 100, 200, 300, 400]"
          :page-size="paginator.limit"
          :total="paginatorInfo.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top:20px;margin-bottom:20px;float:right"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @prev-click="prevPage"
          @next-click="nextPage"
        />
      </div>
    </el-card>
    <!-- 新增订单 -->
    <el-dialog title="新增订单" :visible.sync="dialogAddOrderVisible">
      <el-form :model="newOrderInfo" label-position="right" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="newOrderInfo.OrderNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="买家公司">
          <el-input v-model="newOrderInfo.BuyerCompanyName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="买家名">
          <el-input v-model="newOrderInfo.BuyerMemberName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="newOrderInfo.GoodsRealPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newOrderInfo.Remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="newOrderSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加明细 -->
    <el-dialog title="添加订单明细" :visible.sync="dialogAddOrderDetalisVisible">
      <el-form :model="newOrderDetailsInfo" label-position="right" label-width="100px">
        <el-form-item>
          <img style="width: 100px; height: 100px" :src="newOrderDetailsInfo.SpuPicURL !== '' ? newOrderDetailsInfo.SpuPicURL : 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/zhanwei.png'">
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="newOrderDetailsInfo.SectionNum" autocomplete="off" @change="changeSectionID" />
          <!-- <el-input v-model="newOrderDetailsInfo.SectionNum" autocomplete="off" @change="changeSectionNum" /> -->
        </el-form-item>
        <el-form-item label="颜色">
          <!-- <el-input v-model="newOrderDetailsInfo.SkuName" autocomplete="off" /> -->
          <el-select v-model="newOrderDetailsInfo.Color">
            <el-option
              v-for="(item, index) in Object.keys(skuInfo)"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="尺码">
          <!-- <el-input v-model="newOrderDetailsInfo.SkuName" autocomplete="off" /> -->
          <el-select v-model="newOrderDetailsInfo.Size">
            <el-option
              v-for="(item, index) in skuInfo[newOrderDetailsInfo.Color]"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="newOrderDetailsInfo.SalePrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="newOrderDetailsInfo.Amount" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrderDetalisVisible = false;skuInfo = {};newOrderDetailsInfoInit()">取 消</el-button>
        <el-button type="primary" @click="newOrderDetalisSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderList, toGetGoodsList, markWaiting, uploadOrder, deleteOrder, addErpOrder, addErpOrderDetails, deleteOrderDetails, getSkuInfoBySectionNum, pullAliOrderList, getSpuInfoBySectionID } from '@/api/order'
import qs from 'qs'

export default {
  /**
   * pending 待处理
   * waiting 待货
   * forPickup 拿货中
   * fulfilled 已配货
   * complete 完成
   */
  data() {
    return {
      tableLoading: false,
      dialogAddOrderVisible: false,
      dialogAddOrderDetalisVisible: false,
      deleteOrderDetailsBtnId: '',
      newOrderInfo: {},
      newOrderDetailsInfo: {
        ErpOrder: {
          Id: ''
        },
        SectionNum: '',
        Color: '',
        Size: '',
        Amount: '',
        ErpStatus: 'pending'
      },
      tableData: [],
      paginator: {
        offset: 0,
        limit: 20,
        OrderNum: '',
        ErpStatus: '["pending","waiting","forPickup"]'
      },
      selectList: [],
      skuInfo: {},
      paginatorInfo: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      const searchAttrs = qs.stringify(this.paginator)
      orderList(searchAttrs)
        .then(res => {
          if (res.success) {
            this.tableData = res.data.rows
            this.paginatorInfo = res.data.paginator
            this.tableLoading = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    dealWithOrder() {
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      toGetGoodsList(orderList)
        .then(res => {
          this.$message.success('配货成功！等待拿货')
          this.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        console.log(list[i]['Id'])
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    handleMarkWaiting() {
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      markWaiting(orderList).then(res => {
        if (res.success) {
          this.$message.success('标记成功')
          this.getList()
        }
      })
        .catch(e => {
          console.log(e)
        })
    },
    handleDeleteOrder(id) {
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功!')
            this.getList()
          }
        })
      })
    },
    tableFormatter(row, column, cellValue) {
      let res = false
      if (cellValue === '') {
        res = true
      }
      return res ? '-' : cellValue
    },
    beforeXlsUpload(file) {
      const pattern = /^(\S)*.xlsx/
      const isXlsx = pattern.test(file.name)

      if (!isXlsx) {
        this.$message.error('文件只能是 xlsx 格式')
      }
      return isXlsx
    },
    uploadXlsFile(item) {
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      uploadOrder(form).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addOrder() {
      this.dialogAddOrderVisible = true
    },
    addOrderDetails(orderId) {
      this.dialogAddOrderDetalisVisible = true
      this.newOrderDetailsInfo.ErpOrder.Id = orderId
    },
    newOrderSubmit() {
      this.newOrderInfo.ErpStatus = 'pending'
      addErpOrder(this.newOrderInfo).then(res => {
        if (res.success) {
          this.dialogAddOrderVisible = false
          this.newOrderInfo = {}
          this.$message.success('新增成功！')
          this.getList()
        }
      }).catch(e => {
        console.log(e)
      })
    },
    newOrderDetalisSubmit() {
      console.log(this.newOrderDetailsInfo)
      addErpOrderDetails(this.newOrderDetailsInfo).then(res => {
        if (res.success) {
          this.dialogAddOrderDetalisVisible = false
          this.$message.success('添加订单详情成功！')
          this.newOrderDetailsInfoInit()
          this.getList()
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // newOrderSubmit() {
    //   this.newOrderInfo.ErpStatus = 'pending'
    //   addErpOrder(this.newOrderInfo).then(res => {
    //     if (res.success) {
    //       this.dialogAddOrderVisible = false
    //       this.newOrderInfo = {}
    //       this.$message.success('新增成功！')
    //       this.getList()
    //     }
    //   }).catch(e => {
    //     console.log(e)
    //   })
    // },
    // 分页下一页
    handleCurrentChange(val) {
      this.paginator.offset = this.paginator.limit * (val - 1)
      this.getList()
    },
    // 分页size改变
    handleSizeChange(val) {
      this.paginator.limit = val
      this.getList()
    },
    prevPage() {
      this.paginator.offset = this.paginator.offset - this.paginator.limit
    },
    nextPage() {
      this.paginator.offset = this.paginator.offset + this.paginator.limit
    },
    enterOrderDetailsOption(row, column, cell, event) {
      this.deleteOrderDetailsBtnId = row.Id
    },
    leaveOrderDetailsOption(row, column, cell, event) {
      if (this.deleteOrderDetailsBtnId === row.Id) {
        this.deleteOrderDetailsBtnId = ''
      }
    },
    handleDeleteOrderDetails(Id) {
      this.$confirm('此操作将删除该订单详情, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrderDetails(Id).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
      })
    },
    changeSectionNum(sNum) {
      getSkuInfoBySectionNum(sNum).then(res => {
        if (res.success) {
          const data = res.data.rows
          console.log(data)
          const temp_skuInfo = {}
          for (let i = 0; i < data.length; i++) {
            temp_skuInfo[data[i].Color] = []
            // const item = {}
            // item.color = data[i].Color
            // item.size = []
            for (let j = 0; j < data.length; j++) {
              if (data[j].Color === data[i].Color) {
                temp_skuInfo[data[i].Color].push(data[j].Size)
                // item.size.push(data[j].Size)
              }
            }
          }
          this.skuInfo = temp_skuInfo
        }
      }).catch(e => {
        console.log(e)
      })
    },
    putAliOrder() {
      this.tableLoading = true
      pullAliOrderList().then(res => {
        if (res.success) {
          this.$message.success('同步成功!')
          this.tableLoading = false
          this.getList()
        }
      })
        .catch(e => {
          console.log(e)
        })
    },
    // 根据填入的款式ID获取spu详情
    changeSectionID(sID) {
      getSpuInfoBySectionID(sID).then(res => {
        if (res.success) {
          const data = res.data.rows
          const erpSkus = data.ErpSkus
          console.log(erpSkus)
          const temp_skuInfo = {}
          for (let i = 0; i < erpSkus.length; i++) {
            temp_skuInfo[erpSkus[i].Color] = []
            console.log(erpSkus[i].Color)
            // const item = {}
            // item.color = data[i].Color
            // item.size = []
            for (let j = 0; j < erpSkus.length; j++) {
              if (erpSkus[j].Color === erpSkus[i].Color) {
                temp_skuInfo[erpSkus[i].Color].push(erpSkus[j].Size)
                // item.size.push(data[j].Size)
                console.log(temp_skuInfo)
              }
            }
          }
          this.skuInfo = temp_skuInfo
          console.log(this.skuInfo)
          this.newOrderDetailsInfo.SpuPicURL = data.Img
          this.newOrderDetailsInfo.SaleURL = data.OriginURL
        }
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
    .expand-header {
      font-size: 15px;
      font-weight: bold;
      padding-bottom: 5px;
    }
    .testStyle {
      color: #000;
    }
    .el-table td, .el-table th {
      padding: 8px 0;
      .el-table__expanded-cell {
        padding: 0px;
      }
    }
    .goodsInfo-left {
      width: 70px;
      float: left;
    }
    .goodsInfo-right {
      width: 174px;
      float: left;
    }
  }
</style>
