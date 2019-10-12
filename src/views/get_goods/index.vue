<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拿货列表</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="8" type="flex" justify="right">
          <el-col :span="17">
            <el-button type="primary" size="small" @click="toPrint">打印</el-button>
            <el-button type="warning" size="small" @click="tempPrint">临时打印</el-button>
          </el-col>
          <el-col :span="2">
            <el-select v-model="paginator.GoodsStatus" size="small" placeholder="拿货状态">
              <el-option label="全部" value="" />
              <el-option label="待拿货" value="Pending" />
              <el-option label="已拿货" value="Get" />
              <el-option label="缺货" value="Lack" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="paginator.OrderNum"
              size="small"
              placeholder="输入订单号可查询"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="small" @click="getList">查询</el-button>
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
          <el-table-column label="订单号" align="center" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.OrderNum }}</div>
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
              <!-- <div>{{ scope.row.GetGoodsNum }}</div> -->
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
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.ErpSku.Price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="Amount" align="center" />
          <el-table-column label="备注" prop="Remark" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.IsLack === 0 && scope.row.IsGet === 0" size="mini" type="info">待拿货</el-tag>
              <el-tag v-if="scope.row.IsLack === 1" size="mini" type="danger">缺货</el-tag>
              <el-tag v-if="scope.row.IsGet === 1" size="mini" type="success">已拿货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" align="center" width="138">
            <template slot-scope="scope">
              <!-- <el-link :underline="false" @click="handleEditGetGoodsInfo(scope.row)">编辑</el-link> -->
              <a v-if="scope.row.Id === editSkuInfo.Id" style="color:#409eff" @click="handleSkuSave()">保存<br></a>
              <a v-if="scope.row.Id === editSkuInfo.Id" @click="cancelEditSku">取消</a>
              <a v-else style="color:#409eff" @click="handleEditGetGoodsInfo(scope.row)">编辑<br></a>
              <!-- <el-link v-if="scope.row.Id !== editSkuInfo.Id" :underline="false" style="color:#f56c6c" @click="handleSkuDelete(scope.row.Id)">删除</el-link> -->
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
    <!-- 临时打印dialog -->
    <el-dialog title="临时打印" :visible.sync="dialogTempPrintVisible" :close-on-click-modal="false" :modal="true" top="5vh" :lock-scroll="false">
      <el-input v-model="tempGoodsInfo" type="textarea" autofocus placeholder="按行输入,每行一个拿货信息" autosize />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTempPrintVisible = false">取 消</el-button>
        <el-button type="primary" @click="emitTempPrint">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, editGetGoodsInfo, getGetGoodsNumListBySpuID, setDefaultGetGoodsNum } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      dialogScanfVisible: false,
      dialogTempPrintVisible: false,
      tableData: [],
      paginator: {
        offset: 0,
        limit: 50,
        OrderNum: '',
        GoodsStatus: 'Pending'
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
        'Amount': ''
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
      getGoodsList(searchAttrs)
        .then(res => {
          if (res.success) {
            console.log(res)
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
        console.log(i)
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    toPrint() {
      if (this.selectList.length !== 0) {
        const { href } = this.$router.resolve({
          path: '/downGetGoods',
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
      console.log(infoDetails)
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
    handleDefaultNum(val) {
      this.$confirm('是否设置为默认拿货编码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const data = qs.stringify({ spuID: this.editSkuInfo.SpuId, num: val })
        setDefaultGetGoodsNum(data).then(res => {
          if (res.success) {
            this.$message.success('设置成功!')
          }
        })
      })
    },
    handleEditGetGoodsInfo(item) {
      // Id
      this.editSkuInfo.Id = item.Id
      this.editSkuInfo.SkuId = item.ErpSku.Id
      this.editSkuInfo.SpuId = item.ErpSku.ErpSpu.Id
      // Info
      this.editSkuInfo.GetGoodsNum = item.ErpSku.ErpSpu.GetGoodsNum
      this.editSkuInfo.Price = item.ErpSku.ErpSpu.Price
      this.editSkuInfo.Remark = item.Remark
      // 根据item.spuId拉取getGoodsList, 存至getgoodslist
      getGetGoodsNumListBySpuID(item.ErpSku.ErpSpu.Id).then(res => {
        if (res.success) {
          this.getGoodsNumList = Array.from(res.data.rows, i => { return i.GetGoodsNum })
          console.log(this.getGoodsNumList)
        }
      })
    },
    handleSkuSave() {
      if (this.getGoodsNumList.indexOf(this.editSkuInfo.GetGoodsNum) === -1) {
        this.editSkuInfo.newNum = 1
        this.$confirm('是否将新编号设置为默认拿货编码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => {
            const data = qs.stringify({ spuID: this.editSkuInfo.SpuId, num: this.editSkuInfo.GetGoodsNum })
            setDefaultGetGoodsNum(data).then(res => {
              if (res.success) {
                this.$message.success('设置成功!')
              }
            })
          })
          .finally(() => {
            this.emitSkuSave()
          })
      } else {
        this.editSkuInfo.newNum = 0
        this.emitSkuSave()
      }
    },
    emitSkuSave() {
      const getGoodsInfo = qs.stringify(this.editSkuInfo)
      editGetGoodsInfo(getGoodsInfo).then(res => {
        if (res.success) {
          this.editSkuInfo = {
            'Id': '',
            'SkuId': null,
            'SpuId': null,
            'GetGoodsNum': '',
            'Remark': '',
            'Price': '',
            'Amount': ''
          }
          this.$message.success('保存成功!')
          this.getList()
        } else {
          this.$message.error('处理失败，请重试!')
        }
      })
    },
    cancelEditSku() {
      this.editSkuInfo = {
        'Id': '',
        'SkuId': null,
        'SpuId': null,
        'GetGoodsNum': '',
        'Remark': '',
        'Price': '',
        'Amount': ''
      }
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
    emitTempPrint() {
      // console.log(this.tempGoodsInfo.split('\n'))
      const { href } = this.$router.resolve({
        path: '/downGetGoodsTemp',
        query: {
          tempGoodsInfo: this.tempGoodsInfo
        }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

