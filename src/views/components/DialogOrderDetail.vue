<template>
  <!-- 查看订单详情dialog -->
  <el-dialog title="订单详情" :visible.sync="visible" @keyup.enter.native="save">
    <el-alert
      :title="'单号：' + orderDetail.orders[0].OrderNum + '\n姓名：' + orderDetail.orderDetail.contactPerson + '\n手机：' + orderDetail.orderDetail.mobile + '\n邮编：' + orderDetail.orderDetail.areaCode + '\n地址：' + orderDetail.orderDetail.address"
      type="info"
      class="baseinfo-alter"
      :closable="false"
    />
    <el-alert
      v-if="orderDetail.orders[0].BuyerRemake !== ''"
      :title="'买家备注：' + orderDetail.orders[0].BuyerRemake"
      type="warning"
      style="margin-bottom: 20px"
      :closable="false"
    />
    <div
      v-for="(item, index) in orderDetail.orders"
      :key="index"
    >
      <el-divider content-position="left">订单号：{{ item.OrderNum }}</el-divider>
      <!-- :data="orderDetail.orders[0].ErpOrderDetails" -->
      <el-table
        :data="item.ErpOrderDetails"
        border
        stripe
      >
        <el-table-column label="商品信息">
          <template slot-scope="scope">
            <div class="goodsInfo-left">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ProductImgURL" style="margin:0 auto;width:300px;height:300px">
                <span>{{ "ID: " + scope.row.SectionID }}</span>
                <img slot="reference" :src="scope.row.ProductImgURL" style="width:66px;height:66px;border:2px solid #e3e3e3;">
              </el-popover>
            </div>
            <div class="goodsInfo-right">
              <div style="line-height:16px;">
                <a :href="scope.row.SaleURL" target="_blank" style="color:#428bca">{{ scope.row.Color + " " + scope.row.Size }}</a>
                <span>*</span>
                <el-badge :value="scope.row.Amount" class="item" style="padding-top: 8px;" :type="Number(scope.row.Amount) > 1 ? 'danger' : 'info'" />
              </div>
              <div>
                {{ scope.row.SectionNum }}
              </div>
              <div>
                {{ scope.row.ProductSalePrice }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="pickedList.indexOf(scope.row.Id) !== -1" type="success" size="small">已拣货</el-tag>
            <el-tag v-if="getAgainList.indexOf(scope.row.Id) !== -1" type="warning" size="small">重拿</el-tag>
            <el-tag v-if="ignoreList.indexOf(scope.row.Id) !== -1" type="danger" size="small">搁置</el-tag>
            <el-tag v-if="refundList.indexOf(scope.row.Id) !== -1" type="danger" size="small">退货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <DropdownButton
              :items="[
                { name: '已拣货', type: 'picked', if: true },
                { name: '重拿', type: 'getAgain', if: true },
                { name: '搁置', type: 'ignore', if: true },
                { name: '退货', type: 'return', if: orderDetail.orders[0].ErpStatus === 'success' || orderDetail.orders[0].ErpStatus === 'shiped' },
              ]"
              :data="scope"
              @command="handleCommand"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        关闭
      </el-button>
      <el-button v-if="(type === 'pickup' || orderDetail.orders[0].ErpStatus === 'fulfilled')" :disabled="getAgainList.length > 0" type="primary" @click="save">
        完成拣货
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  markOrderDetailStatus,
  markPicked,
  returnGoodsByOrderDetailID
} from '@/api/order'
import DropdownButton from '@/views/components/DropdownButton'

export default {
  name: 'DialogOrderDetail',
  components: {
    DropdownButton
  },
  data() {
    return {
      visible: false,
      type: 'view',
      orderDetail: {
        orderDetail: {
          address: '',
          areaCode: '',
          contactPerson: '',
          mobile: ''
        },
        orders: [
          {
            BuyerRemake: '',
            ErpOrderDetails: ''
          }
        ]
      },
      pickedList: [],
      getAgainList: [],
      ignoreList: [],
      refundList: []
    }
  },
  methods: {
    open(data = {}, type) {
      this.type = type
      this.orderDetail = data
      this.visible = true
      if (this.type === 'pickup' || this.orderDetail.orders[0].ErpStatus === 'fulfilled') {
        this.keyupSubmit()
      }
    },
    save() {
      this.visible = false
      var OrderList = []
      for (let i = 0, len = this.orderDetail.orders.length; i < len; i++) {
        OrderList.push(this.orderDetail.orders[i].Id)
      }
      markPicked('OrderList=[' + OrderList.join(',') + ']')
        .then(res => {
          // console.log(res)
        })
      this.$emit('submit', this.type)
    },
    close() {
      this.visible = false
    },
    handleCommand({ type, data }) {
      switch (type) {
        case 'picked':
          this.pickedList.push(data.Id)
          this.getAgainList.splice(this.getAgainList.indexOf(data.Id), 1)
          this.ignoreList.splice(this.ignoreList.indexOf(data.Id), 1)
          break
        case 'getAgain':
          // 拿货列表重新生成拿货单
          // 订单详情状态设置为 待拿货 forPickup
          // 隐藏完成拣货的按钮
          // this.handleDeleteOrder(data.Id)
          markOrderDetailStatus(data.Id, data.ErpOrder.Id, 'forPickup', data.Amount)
            .then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.pickedList.splice(this.pickedList.indexOf(data.Id), 1)
                this.getAgainList.push(data.Id)
                this.ignoreList.splice(this.ignoreList.indexOf(data.Id), 1)
              }
            })
          break
        case 'ignore':
          // 订单详情的状态设置为 omit
          markOrderDetailStatus(data.Id, data.ErpOrder.Id, 'omit', data.Amount)
            .then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.pickedList.splice(this.pickedList.indexOf(data.Id), 1)
                this.getAgainList.splice(this.getAgainList.indexOf(data.Id), 1)
                this.ignoreList.push(data.Id)
              }
            })
          break
        case 'return':
          returnGoodsByOrderDetailID(data.Id)
            .then(res => {
              console.log(res)
              if (res.success) {
                this.$message.success('操作成功')
                this.refundList.push(data.Id)
              }
            })
            .catch(e => {
              console.log(e)
            })
          break
      }
    },
    keyupSubmit() {
      document.onkeydown = e => {
        const _key = window.event.keyCode
        if (_key === 13) {
          this.save()
        }
      }
    }
  }
}
</script>

<style lang="scss" scope>
  .baseinfo-alter {
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 20px;
    white-space: pre-wrap;
  }
  .goodsInfo-left {
    width: 70px;
    float: left;
  }
  .goodsInfo-right {
    width: 174px;
    float: left;
  }
  .op-card {
    margin-top: 20px;
  }
</style>
