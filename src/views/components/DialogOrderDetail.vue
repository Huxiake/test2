<template>
  <!-- 查看订单详情dialog -->
  <el-dialog title="订单详情" :visible.sync="visible">
    <el-alert
      :title="'姓名：' + orderDetail.orderDetail.contactPerson + '\n手机：' + orderDetail.orderDetail.mobile + '\n邮编：' + orderDetail.orderDetail.areaCode + '\n地址：' + orderDetail.orderDetail.address"
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
    <el-table
      :data="orderDetail.orders[0].ErpOrderDetails"
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
      <el-table-column label="标注" />
      <el-table-column label="操作" />
    </el-table>
    <!-- <el-form label-position="right" label-width="100px">
      <el-form-item>
        <img style="width: 100px; height: 100px" :src="newOrderDetailsInfo.SpuPicURL !== '' ? newOrderDetailsInfo.SpuPicURL : 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/zhanwei.png'">
      </el-form-item>
      <el-form-item label="款号">
        <el-input v-model="newOrderDetailsInfo.SectionNum" autocomplete="off" @change="changeSectionID" />
      </el-form-item>
    </el-form> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取 消
      </el-button>
      <el-button type="primary" @click="save">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogOrderDetail',
  data() {
    return {
      visible: false,
      type: false,
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
      }
    }
  },
  methods: {
    open(data = {}, type) {
      // this.type = type;
      console.log(data)
      this.orderDetail = data
      this.visible = true
    },
    save() {
      this.visible = false
      // if (!this.editData.reply) {
      //   this.$message.error('请输入评价解释')
      //   return;
      // }
      // this.$emit('submit', this.editData)
    },
    close() {
      this.visible = false
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
</style>
