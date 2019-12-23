<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>待打印列表</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="4" type="flex" justify="end">
          <el-col :span="2">
            <el-select v-model="paginator.PrintStatus" size="mini" placeholder="打印状态">
              <el-option label="全部" value="" />
              <el-option label="待打印" value="0" />
              <el-option label="已打印" value="1" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="paginator.OrderNum"
              size="mini"
              placeholder="输入关键词可查询"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="getList">查询</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="4" type="flex" justify="start">
          <el-col :span="17">
            <el-button type="primary" size="mini" @click="toPrint">打印</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="缩略图" align="center" width="100">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ErpSku.ErpSpu.Img && scope.row.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto;width:300px;height:300px">
                <img slot="reference" :src="scope.row.ErpSku.ErpSpu.Img && scope.row.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_58'" style="width:58px;height:58px">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="款号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.SectionNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货编号" align="center" width="240">
            <template slot-scope="scope">
              <el-select v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.GetGoodsNum" filterable allow-create default-first-option style="width:220px" placeholder="请选择">
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
              <div v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.GetGoodsNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="颜色" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.Color }}</div>
            </template>
          </el-table-column>
          <el-table-column label="码数" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.Size }}</div>
            </template>
          </el-table-column>
          <el-table-column label="拿货价格" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Price" style="width:80px" />
              <span v-else>{{ scope.row.ErpSku.ErpSpu.Price }}</span>
              <!-- <div>{{ scope.row.ErpSku.Price }}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="Amount" align="center" />
          <!-- <el-table-column label="备注" prop="Remark" align="center" /> -->
          <el-table-column label="操作" prop="" align="center" width="138">
            <template slot-scope="scope">
              <a v-if="scope.row.Id === editSkuInfo.Id" style="color:#409eff" @click="handleSkuSave()">保存<br></a>
              <a v-if="scope.row.Id === editSkuInfo.Id" @click="cancelEditSku">取消</a>
              <DropdownButton
                v-else
                :items="[
                  { name: '删除', type: 'delete', if: true },
                ]"
                :data="scope"
                @command="handleCommand"
              />
            </template>
          </el-table-column>
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
  getToPrintList,
  deleteToPrintItem
} from '@/api/getGoods'

import qs from 'qs'
import DropdownButton from '@/views/components/DropdownButton'

export default {
  components: {
    DropdownButton
  },
  data() {
    return {
      dialogScanfVisible: false,
      tableData: [],
      paginator: {
        offset: 0,
        limit: 50,
        OrderNum: '',
        PrintStatus: '0'
      },
      selectList: [],
      scanfSkuList: [],
      infoArr: [],
      goodsInfo: '',
      editSkuInfo: {
        'Id': '',
        'SkuId': null,
        'SpuId': null,
        'GetGoodsNum': '',
        'Remark': '',
        'Price': '',
        'Amount': '',
        'orderDetailID': ''
      },
      getGoodsNumList: [],
      paginatorInfo: {},
      tempGoodsInfo: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      const searchAttrs = qs.stringify(this.paginator)
      getToPrintList(searchAttrs)
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
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    toPrint() {
      if (this.selectList.length !== 0) {
        const { href } = this.$router.resolve({
          path: '/downToPrint',
          query: {
            id: this.selectList.join(',')
          }
        })
        window.open(href, '_blank')
      }
    },
    getFocus() {
      this.$nextTick(() => {
        this.$refs.scanInput.$el.children[0].focus()
      })
    },
    // 扫码枪输入相关:
    addGoods() {
      const goodsInfoStr = this.goodsInfo.replace('?', '').replace('“', '"').replace('”', '"').replace('，', ',').replace('｛', '{').replace('｝', '}').replace('",,', '",')
      const infoDetails = JSON.parse(goodsInfoStr)
      this.goodsInfo = ''
      this.scanfSkuList.push(infoDetails)
      // 存入请求参数
      const temp_info = {}
      temp_info.gid = Number(infoDetails.gid)
      temp_info.am = 1
      this.infoArr.push(temp_info)
    },
    handleScanf() {
      this.dialogScanfVisible = true
      this.getFocus()
    },
    cancelScanf() {
      this.dialogScanfVisible = false
      this.scanfSkuList = []
      this.goodsInfo = ''
      this.infoArr = []
    },
    enterOption(index) {
      this.focusNum = index
    },
    leaveOption() {
      this.focusNum = null
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
    handleCommand({ type, data }) {
      switch (type) {
        case 'delete':
          this.handleDeleteToPrintItem(data.Id)
          break
      }
    },
    // 删除待打印项目
    handleDeleteToPrintItem(id) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteToPrintItem('id=[' + id + ']')
          .then(res => {
            if (res.success) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
          .catch(e => {
            console.log(e)
          })
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

