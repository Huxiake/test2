<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>已完成订单</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right" style="margin-bottom:20px">
          <el-col :span="3" :offset="20">
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
      </div>
      <div class="box-table">
        <!-- <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="expand-header">订单明细:</div>
              <el-table
                :data="scope.row.ErpOrderDetails"
                header-row-class-name="testStyle"
                border
              >
                <el-table-column label="款号" prop="SectionNum" align="center" />
                <el-table-column label="颜色" prop="Color" align="center" />
                <el-table-column label="尺码" prop="Size" align="center" />
                <el-table-column label="数量" prop="Amount" align="center" />
                <el-table-column label="状态" prop="ErpStatus" align="center">
                  <template slot-scope="subScope">
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" type="info">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'get'" type="success">已拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'fulfilled'" type="success">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" type="danger">待拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'lack'" type="danger">待处理缺货</el-tag>
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
          <el-table-column label="买家公司名" prop="BuyerCompanyName" align="center" />
          <el-table-column label="买家会员名" prop="BuyerMemberName" align="center" />
          <el-table-column label="实付金额" prop="GoodsRealPrice" align="center" width="80" />
          <el-table-column label="买家留言" prop="BuyerRemake" align="center" />
          <el-table-column label="备注" prop="Rename" align="center" />
          <el-table-column label="订单状态" prop="OrderStatus" align="center" />
          <el-table-column label="仓库状态" prop="ErpStatus" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'complete'" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteOrder(scope.row.Id)" />
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
                    <el-tag v-if="subScope.row.ErpStatus === 'pending'" type="info">未处理</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'get'" type="success">已拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'fulfilled'" type="success">现货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'forPickup'" type="danger">待拿货</el-tag>
                    <el-tag v-if="subScope.row.ErpStatus === 'lack'" type="danger">待处理缺货</el-tag>
                  </template>
                </el-table-column>
                <!-- 操作框 -->
                <el-table-column align="center" width="180">
                  <!-- <template slot-scope="subScope">
                    <a v-show="deleteOrderDetailsBtnId === subScope.row.Id" type="primary" size="small" @click="handleDeleteOrderDetails(subScope.row.Id)">
                      删除
                    </a>
                  </template> -->
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
          <el-table-column label="仓库状态" prop="ErpStatus" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ErpStatus === 'pending'" type="info" size="small">新订单</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'forPickup'" size="small">处理中</el-tag>
              <el-tag v-if="scope.row.ErpStatus === 'waiting'" type="danger" size="small">待货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
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
  </div>
</template>

<script>
import { orderList, toGetGoodsList, deleteOrder } from '@/api/order'
import qs from 'qs'

export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      paginator: {
        offset: 0,
        limit: 20,
        OrderNum: '',
        ErpStatus: '["completed"]'
      },
      selectList: [],
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
          console.log(res)
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
      // this.selectList = list
      console.log(this.selectList)
    },
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
    }
  }
</style>
