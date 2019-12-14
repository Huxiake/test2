<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拿货反馈</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="right">
          <el-col :span="3" :offset="20">
            <el-input
              v-model="paginator.OrderNum"
              placeholder="请输入订单号"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="medium" @click="1">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column label="缩略图" align="center" width="80">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ErpGetGoods.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto;width:300px;height:300px">
                <img slot="reference" :src="scope.row.ErpGetGoods.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_58'" style="width:58px;height:58px">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="订单号" align="center" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpGetGoods.OrderNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="款号" align="center" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpGetGoods.ErpSku.SectionNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货编号" align="center">
            <template slot-scope="scope">
              <!-- <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.GetGoodsNum" style="width:180px" @change="editFeedbackItem('GetGoodsNum')" /> -->
              <el-select v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.GetGoodsNum" filterable allow-create default-first-option style="width:180px" placeholder="请选择" @change="editFeedbackItem('GetGoodsNum')">
                <el-option
                  v-for="(item, index) in getGoodsNumList"
                  :key="index"
                  :value="item"
                  @mouseover="enterOption(index)"
                  @mouseleave="leaveOption()"
                >
                  <span style="float: left" @mouseover="enterOption(index)">{{ item }}</span>
                  <span v-if="index === focusNum" style="float: right; color: #66b1ff; font-size: 13px" @click="handleDefaultNum(item)">默认</span>
                </el-option>
              </el-select>
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.GetGoodsNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="颜色" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Color" style="width:180px" @change="editFeedbackItem('Color')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.Color }}</div>
            </template>
          </el-table-column>
          <el-table-column label="码数" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Size" style="width:180px" @change="editFeedbackItem('Size')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.Size }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货价格" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Price" style="width:180px" @change="editFeedbackItem('Price')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.ErpSku.ErpSpu.Price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Amount" style="width:180px" @change="editFeedbackItem('Amount')" />
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.Amount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.ErpGetGoods.Remark }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.Id === editSkuInfo.Id" type="primary" size="mini" @click="handleSkuSave()">保存</el-button>
              <el-button v-if="scope.row.Id === editSkuInfo.Id" size="mini" @click="cancelSkuSave()">取消</el-button>
              <!-- <el-button v-if="scope.row.Id !== editSkuInfo.Id" type="primary" size="mini" @click="handleSkuEdit(scope.row)">编辑</el-button> -->
              <DropdownButton
                v-if="scope.row.Id !== editSkuInfo.Id"
                :items="[
                  { name: '编辑', type: 'edit', if: true },
                  { name: '完成', type: 'done', if: true },
                ]"
                :data="scope"
                @command="handleCommand"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getFeedback,
  markRead,
  dealFeedback,
  doneFeedback,
  getGetGoodsNumListBySpuID,
  setDefaultGetGoodsNum
} from '@/api/getGoods'
import qs from 'qs'
import DropdownButton from '@/views/components/DropdownButton'

export default {
  components: {
    DropdownButton
  },
  data() {
    return {
      tableData: [],
      paginator: {
        offset: 0,
        limit: 200,
        OrderNum: '',
        deal: 0
      },
      editSkuInfo: {
        'Id': '',
        'FeedbackId': null,
        'GetGoodsId': null,
        'SkuId': null,
        'SpuId': null,
        'GetGoodsNum': '',
        'Color': '',
        'Size': '',
        'Price': '',
        'Amount': ''
      },
      sendSkuInfo: {},
      feedbackIdList: [],
      getGoodsNumList: [],
      focusNum: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const searchAttrs = qs.stringify(this.paginator)
      getFeedback(searchAttrs)
        .then(res => {
          if (res.success) {
            this.tableData = res.data.rows
            const dataLen = this.tableData.length
            for (let i = 0; i < dataLen; i++) {
              this.feedbackIdList.push(this.tableData[i].Id)
            }
            this.markRead()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    markRead() {
      const idList = '[' + this.feedbackIdList.join(',') + ']'
      markRead(idList).then(res => {
        console.log(res)
      })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        console.log(i)
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    handleSkuEdit(item) {
      // Id
      this.editSkuInfo.Id = item.Id
      this.sendSkuInfo.FeedbackId = item.Id
      this.sendSkuInfo.GetGoodsId = item.ErpGetGoods.Id
      this.sendSkuInfo.SkuId = item.ErpGetGoods.ErpSku.Id
      this.sendSkuInfo.SpuId = item.ErpGetGoods.ErpSku.ErpSpu.Id
      // Info
      this.editSkuInfo.GetGoodsNum = item.ErpGetGoods.GetGoodsNum
      this.editSkuInfo.Price = item.ErpGetGoods.ErpSku.ErpSpu.Price
      this.editSkuInfo.Color = item.ErpGetGoods.ErpSku.Color
      this.editSkuInfo.Size = item.ErpGetGoods.ErpSku.Size
      this.editSkuInfo.Amount = item.ErpGetGoods.Amount
      // 根据item.spuId拉取getGoodsList, 存至getgoodslist
      getGetGoodsNumListBySpuID(item.ErpGetGoods.ErpSku.ErpSpu.Id).then(res => {
        if (res.success) {
          this.getGoodsNumList = Array.from(res.data.rows, i => { return i.GetGoodsNum })
          console.log(this.getGoodsNumList)
        }
      })
    },
    cancelSkuSave() {
      this.editSkuInfo = {}
      console.log(this.sendSkuInfo)
    },
    editFeedbackItem(key) {
      this.sendSkuInfo[key] = this.editSkuInfo[key]
    },
    handleSkuSave() {
      if (this.getGoodsNumList.indexOf(this.editSkuInfo.GetGoodsNum) === -1) {
        this.sendSkuInfo.newNum = 1
        this.$confirm('是否将新编号设置为默认拿货编码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => {
            const data = qs.stringify({ spuID: this.sendSkuInfo.SpuId, num: this.editSkuInfo.GetGoodsNum })
            setDefaultGetGoodsNum(data).then(res => {
              if (res.success) {
                this.$message.success('设置成功!')
              }
            })
          })
          .finally(() => {
            this.emitSaveFeedback()
          })
      } else {
        this.sendSkuInfo.newNum = 0
        this.emitSaveFeedback()
      }
    },
    emitSaveFeedback() {
      const skuInfo = qs.stringify(this.sendSkuInfo)
      dealFeedback(skuInfo).then(res => {
        if (res.success) {
          this.$message.success('处理成功!')
          this.editSkuInfo = {}
          this.getList()
        } else {
          this.$message.error('处理失败，请重试!')
        }
      })
    },
    enterOption(index) {
      console.log(index)
      this.focusNum = index
    },
    leaveOption() {
      console.log('index')
      this.focusNum = null
    },
    handleDefaultNum(val) {
      this.$confirm('是否设置为默认拿货编码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const data = qs.stringify({ spuID: this.sendSkuInfo.SpuId, num: val })
        setDefaultGetGoodsNum(data).then(res => {
          if (res.success) {
            this.$message.success('设置成功!')
          }
        })
      })
    },
    handleDoneFeedback(feedbackId) {
      doneFeedback(feedbackId)
        .then(res => {
          if (res.success) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    handleCommand({ type, data }) {
      switch (type) {
        case 'edit':
          this.handleSkuEdit(data)
          break
        case 'done':
          this.handleDoneFeedback([data.Id])
          break
      }
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>
