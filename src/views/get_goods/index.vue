<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拿货列表</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="8" type="flex" justify="right">
          <el-col :span="17">
            <el-button type="primary" @click="toPrint">打印</el-button>
            <el-button type="warning" @click="handleScanf">扫描入库</el-button>
          </el-col>
          <el-col :span="2">
            <el-select v-model="paginator.GoodsStatus" placeholder="拿货状态">
              <el-option label="全部" value="" />
              <el-option label="待拿货" value="Pending" />
              <el-option label="已拿货" value="Get" />
              <el-option label="缺货" value="Lack" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="paginator.OrderNum"
              placeholder="输入订单号可查询"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="getList">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table
          :data="tableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="缩略图" align="center" width="100">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                width="326"
                trigger="hover"
              >
                <img :src="scope.row.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_300,limit_0'" style="margin:0 auto;width:300px;height:300px">
                <img slot="reference" :src="scope.row.ErpSku.ErpSpu.Img + '?x-oss-process=image/resize,h_58'" style="width:58px;height:58px">
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
          <el-table-column label="拿货编号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.GetGoodsNum }}</div>
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
              <div>{{ scope.row.ErpSku.ErpSpu.Price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="Amount" align="center" />
          <el-table-column label="备注" prop="Remark" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.IsLack === 0 && scope.row.IsGet === 0" type="info">待拿货</el-tag>
              <el-tag v-if="scope.row.IsLack === 1" type="danger">缺货</el-tag>
              <el-tag v-if="scope.row.IsGet === 1" type="success">已拿货</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" prop="" align="center" /> -->
        </el-table>
      </div>
    </el-card>
    <!-- 扫码入库dialog -->
    <el-dialog title="扫码入库" :visible.sync="dialogScanfVisible" :close-on-click-modal="false" :modal="true" top="5vh" :lock-scroll="false">
      <el-input ref="scanInput" v-model="goodsInfo" autofocus placeholder="扫码枪输入" @keyup.enter.native="addGoods" @blur="getFocus" />
      <el-card v-loading="scanfLoading" element-loading-text="入库中" style="margin-top:10px;">
        <el-tag
          v-for="(item, i) in scanfSkuList"
          :key="i"
          :type="Number(item.am) > 1 ? 'primary' : 'info'"
          closable
          style="margin: 5px"
          @close="handleClose(item)"
        >
          <el-badge :value="item.am" class="item">
            {{ item.onum + ' / ' + item.sn }}
          </el-badge>
        </el-tag>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelScanf">取 消</el-button>
        <el-button type="primary" @click="emitScanf">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      dialogScanfVisible: false,
      tableData: [],
      paginator: {
        offset: 0,
        limit: 20,
        OrderNum: '',
        GoodsStatus: 'Pending'
      },
      selectList: [],
      scanfSkuList: [],
      infoArr: [],
      goodsInfo: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const searchAttrs = qs.stringify(this.paginator)
      getGoodsList(searchAttrs)
        .then(res => {
          if (res.success) {
            console.log(res)
            this.tableData = res.data.rows
            console.log('tabledata', this.tableData)
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
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
  }
</style>

