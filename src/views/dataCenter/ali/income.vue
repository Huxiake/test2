<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>阿里收入记录</span>
      </div>
      <div class="box-tools">
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
        <el-row :gutter="4" type="flex" justify="space-between">
          <el-col style="width:47px;margin-bottom: 17px;">
            <el-button type="primary" size="mini" @click="getList">查询</el-button>
          </el-col>
          <el-col style="width:77px;margin-bottom: 17px;">
            <el-button size="mini" @click="exportXlsx">导出数据</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="tableData"
          stripe
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="订单号" align="center" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.OrderNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              {{ $moment(scope.row.OrderCreateTime).format('YYYY-MM-DD hh:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="实收金额" prop="GoodsRealPrice" align="center" />
          <el-table-column label="拿货成本" prop="GetGoodsPrice" align="center" />
          <el-table-column label="利润" prop="Profit" align="center" />
          <!-- <el-table-column label="操作" prop="" align="center" width="138">
            <template slot-scope="scope">
              <a v-if="scope.row.Id === editSkuInfo.Id" style="color:#409eff" @click="handleSkuSave()">保存<br></a>
              <a v-if="scope.row.Id === editSkuInfo.Id" @click="cancelEditSku">取消</a>
              <DropdownButton
                :items="[
                  { name: '编辑', type: 'edit', if: true },
                  { name: '完成', type: 'get', if: true },
                  { name: '搁置', type: 'omit', if: true },
                ]"
                :data="scope"
                @command="handleCommand"
              />
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          :current-page="paginatorInfo.currentPage"
          :page-sizes="[50, 100, 200, 300, 400, 500]"
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
import {
  orderList,
  exportProfitFile
} from '@/api/order'

// import {
//   markOrderDetailStatus
// } from '@/api/order'

import qs from 'qs'
// import DropdownButton from '@/views/components/DropdownButton'

export default {
  // components: {
  //   DropdownButton
  // },
  data() {
    return {
      dialogScanfVisible: false,
      dialogTempPrintVisible: false,
      tableHeight: '',
      tableLoading: '',
      tableData: [],
      paginator: {
        Date: '',
        offset: 0,
        limit: 50,
        OrderNum: '',
        // ErpStatusList: ["pending", "fulfilled"],
        ErpStatus: 'calculated',
        Belong: 0
      },
      paginatorInfo: {}, // 分页信息
      selectList: [],
      pickerDate: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(this.pickerDate)
      this.tableLoading = true
      if (this.pickerDate !== '' && this.pickerDate !== null) {
        console.log('if')
        this.paginator.Date = '["' + this.pickerDate.join('","') + '"]'
      } else {
        console.log('else')
        this.paginator.Date = ''
      }
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
    tableLoadingMode(sign) {
      this.tableHeight = sign ? '500' : ''
      this.tableLoading = sign
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
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
    tempPrint() {
      this.dialogTempPrintVisible = true
    },
    handleCommand({ type, data }) {
      switch (type) {
        case 'edit':
          this.handleEditGetGoodsInfo(data)
          break
        case 'get':
          this.toGet([data.Id])
          break
        case 'omit':
          this.toOmit(data)
          break
      }
    },
    changeDate() {
      this.paginator.Date = '["' + this.pickerDate.join('","') + '"]'
    },
    exportXlsx() {
      const orderIdlist = 'OrderIDList=[' + this.selectList.join(',') + ']'
      exportProfitFile(orderIdlist)
        .then(res => {
          if (res.success) {
            window.open(res.data.URL)
          }
        })
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

