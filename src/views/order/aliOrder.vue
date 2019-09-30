<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="box-tools">
        <el-tabs v-model="paginator.ErpStatus" @tab-click="handleTab">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="未发货" name="pending" />
          <el-tab-pane label="已发货" name="shiped" />
          <el-tab-pane label="已完成" name="success" />
          <el-tab-pane label="退款中" name="refund" />
        </el-tabs>
        <el-form label-position="right" label-width="70px">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="查询订单">
                <el-input
                  v-model="paginator.OrderNum"
                  size="medium"
                  placeholder="请输入订单号"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="日期范围">
                <el-date-picker
                  v-model="pickerDate"
                  value-format="yyyy-MM-dd 00:00:00"
                  type="daterange"
                  size="medium"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeDate"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 按钮组 -->
        <div class="order_content__btns">
          <div class="content__btns__result">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            </div>
            <div v-if="paginator.ErpStatus === 'all'">
              <!-- TODO -->
              <!-- 同步订单btn -->
              <el-button size="mini" type="warning" @click="putAliOrder">同步订单</el-button>
            </div>
            <div v-else-if="paginator.ErpStatus === 'pending'">
              <!-- TODO -->
              <!-- 配货btn -->
              <el-button size="mini" type="warning" @click="dealWithOrder">配货</el-button>
            </div>
            <div v-else-if="paginator.ErpStatus === 'shiped'">
              <!-- TODO -->
            </div>
            <div v-else>
              <!-- TODO -->
            </div>
            <span class="total-tip">共筛选出 <font color="#DF6137;">{{ paginatorInfo.totalCount }}</font> 条订单信息</span>
          </div>
          <div class="content__btns__group">
            <el-button v-if="paginator.ErpStatus === 'pending'" size="mini" type="warning" @click="1">订单拣货</el-button>
          </div>
        </div>
      </div>
      <div class="box-table">
        <!-- 主表 -->
        <el-table
          v-loading="tableLoading"
          element-loading-text="数据加载中"
          :data="tableData"
          cell-class-name="testStyle"
          :max-height="tableHeight"
          :default-expand-all="true"
          @selection-change="handleSelectionChange"
        >
          <!-- 勾选列 -->
          <el-table-column key="selection" type="selection" width="45" />
          <!-- 扩展子表列 -->
          <el-table-column key="expand" type="expand" width="16">
            <template slot-scope="scope">
              <!-- 子表 -->
              <el-table
                :data="scope.row.ErpOrderDetails"
                :show-header="false"
                header-row-class-name="expand-header"
                border
                style="padding:0px;width:99.9%"
                @cell-mouse-enter="enterOrderDetailsOption"
                @cell-mouse-leave="leaveOrderDetailsOption"
              >
                <!-- 商品信息框 -->
                <el-table-column key="goodsInfo" width="265">
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
                <!-- 子表中间空白 -->
                <el-table-column key="centerSpace" />
                <!-- 子表状态框 -->
                <el-table-column key="subErpStatus" align="center" width="100">
                  <template slot-scope="subScope">
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" size="mini" type="info">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'get'" size="mini" type="success">已拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'fulfilled'" size="mini" type="success">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" size="mini" type="warning">待拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'lack'" size="mini" type="danger">待处理缺货</el-tag>
                  </template>
                </el-table-column>
                <!-- 子表操作框 -->
                <el-table-column align="center" width="180" />
              </el-table>
            </template>
          </el-table-column>
          <!-- 主表商品信息 -->
          <el-table-column label="商品信息" prop="OrderNum" width="201" />
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
          <!-- 主表订单状态， 只读 -->
          <el-table-column key="OrderStatus" label="平台状态" align="center" width="97">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.OrderStatus === 'success'" type="success" color="#008158" style="color:#ffffff" size="mini" effect="dark">已完成</el-tag>
              <el-tag v-if="scope.row.OrderStatus === 'waitsellersend'" size="mini" color="#e8811a" style="color:#ffffff" effect="dark">待发货</el-tag>
              <el-tag v-if="scope.row.OrderStatus === 'waitbuyerreceive'" type="warning" color="#0d5499" style="color:#ffffff" size="mini" effect="dark">待收货</el-tag>
            </template>
          </el-table-column>
          <!-- 主表仓库状态 -->
          <el-table-column key="ErpStatus" label="仓库状态" prop="ErpStatus" align="center" width="97">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'forPickup'" type="info" color="#c95732" size="mini" style="color:#ffffff" effect="plain">拿货中</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'pending'" type="info" size="mini" effect="plain">未发货</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'shiped'" size="mini" effect="plain">已发货</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'success'" type="success" size="mini" effect="plain">已完成</el-tag>
            </template>
          </el-table-column>
          <!-- 主表操作 -->
          <el-table-column label="操作" align="center" width="183">
            <template slot-scope="scope">
              <DropdownButton
                :items="[
                  // { name: 'submit', type: 'submit', show: ['uncommit', 'verify_fail'] },
                  { name: '详情', type: 'detail', loading: scope.row.Id === detailBtnLoading, if: true },
                  // { name: '添加', type: 'add', if: ['all', 'shiped', 'refund'].indexOf(paginator.ErpStatus) === -1 },
                  { name: '删除', type: 'delete', if: true }
                ]"
                :data="scope"
                @command="handleCommand"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
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
    <!-- 添加明细dialog -->
    <el-dialog title="添加订单明细" :visible.sync="dialogAddOrderDetalisVisible">
      <el-form :model="newOrderDetailsInfo" label-position="right" label-width="100px">
        <el-form-item>
          <img style="width: 100px; height: 100px" :src="newOrderDetailsInfo.SpuPicURL !== '' ? newOrderDetailsInfo.SpuPicURL : 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/zhanwei.png'">
        </el-form-item>
        <el-form-item label="款号">
          <el-input v-model="newOrderDetailsInfo.SectionNum" autocomplete="off" @change="changeSectionID" />
        </el-form-item>
        <el-form-item label="颜色">
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
    <DialogOrderDetail ref="dialogOrderDetail" />
  </div>
</template>

<script>
import {
  orderList,
  toGetGoodsList,
  deleteOrder,
  getSpuInfoBySectionID,
  addErpOrderDetails,
  pullAliOrderList,
  pullAliOrderDetail
} from '@/api/order'
import qs from 'qs'
import DropdownButton from '@/views/components/DropdownButton'
import DialogOrderDetail from '@/views/components/DialogOrderDetail'

export default {
  components: {
    DropdownButton,
    DialogOrderDetail
  },
  data() {
    return {
      dialogAddOrderDetalisVisible: false,
      dialogViewOrderDetalisVisible: false,
      detailBtnLoading: null,
      tableLoading: false,
      tableData: [],
      pickerDate: '',
      newOrderInfo: {},
      newOrderDetailsInfo: {
        ErpOrder: {
          Id: ''
        },
        SectionNum: '',
        Color: '',
        Size: '',
        Amount: '',
        ErpStatus: 'pending',
        SpuPicURL: ''
      },
      paginator: {
        Date: '',
        offset: 0,
        limit: 50,
        OrderNum: '',
        // ErpStatusList: ["pending", "forPickup"],
        ErpStatus: 'pending'
      },
      selectList: [],
      paginatorInfo: {}, // 分页信息
      tableHeight: '',
      skuInfo: {},
      orderDetailInfo: { // 商品详情信息
        address: '',
        areaCode: '',
        contactPerson: '',
        mobile: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoadingMode(true)
      this.paginator.OrderNum = this.paginator.OrderNum.trim()
      const searchAttrs = qs.stringify(this.paginator)
      orderList(searchAttrs)
        .then(res => {
          if (res.success) {
            this.tableData = res.data.rows
            this.paginatorInfo = res.data.paginator
            this.tableLoadingMode(false)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getOrderDetail(orderIDList) {
      const params = '[' + orderIDList.join(',') + ']'
      pullAliOrderDetail(params)
        .then(res => {
          if (res.success) {
            this.$refs.dialogOrderDetail.open(res.data)
          }
        })
        .finally(() => {
          this.detailBtnLoading = null
        })
    },
    tableLoadingMode(sign) {
      this.tableHeight = sign ? '500' : ''
      this.tableLoading = sign
    },
    newOrderDetailsInfoInit() {
      this.newOrderDetailsInfo = {
        ErpOrder: {
          Id: ''
        },
        SectionNum: '',
        Color: '',
        Size: '',
        Amount: '',
        ErpStatus: 'pending',
        SpuPicURL: ''
      }
    },
    // 同步阿里订单
    putAliOrder() {
      this.tableLoadingMode(true)
      pullAliOrderList().then(res => {
        if (res.success) {
          this.$message.success('同步成功!')
          this.tableLoadingMode(false)
          this.getList()
        }
      })
        .catch(e => {
          console.log(e)
        })
    },
    // 配货
    dealWithOrder() {
      this.tableLoadingMode(true)
      const orderList = 'OrderList=[' + this.selectList.join(',') + ']'
      toGetGoodsList(orderList)
        .then(res => {
          this.$message.success('配货成功！等待拿货')
          this.getList()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.tableLoadingMode(false)
        })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    // 删除订单
    deleteOrder(id) {
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
    changeDate() {
      this.paginator.Date = '["' + this.pickerDate.join('","') + '"]'
    },
    addOrderDetails(orderId) {
      this.dialogAddOrderDetalisVisible = true
      this.newOrderDetailsInfo.ErpOrder.Id = orderId
    },
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
    tableFormatter(row, column, cellValue) {
      let res = false
      if (cellValue === '') {
        res = true
      }
      return res ? '-' : cellValue
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
    // 点击tab页
    handleTab() {
      this.getList()
    },
    handleCommand({ type, data }) {
      switch (type) {
        case 'detail':
          this.detailBtnLoading = data.Id
          this.getOrderDetail([data.Id])
          break
        case 'add':
          this.addOrderDetails(data.Id)
          break
        case 'delete':
          this.handleDeleteOrder(data.Id)
          break
      }
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
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 200px);
    .box-tools {
      margin-bottom: 20px;
      .order_content__btns {
        display: inline-flex;
        width: 100%;
        >div button {
          margin-left: 8px;
        }
        .total-tip {
          margin-left: 10px;
          line-height: 28px;
          font-size: 14px;
        }
        // 结果条数
        .content__btns__result {
          flex: 1;
          font-size: 12px;
          line-height: 32px;
          div {
            display: inline;
          }
          .el-button+span {
            margin-left: 5px;
          }
          .el-button+.el-button {
            margin-left: 5px;
          }
        }
        .content__btns__group {
          line-height: 30px;
          .el-button+.el-button {
            margin-left: 5px;
          }
        }
      }
    }
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
