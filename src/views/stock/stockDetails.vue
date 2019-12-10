<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>款式详情</span>
      </div>
      <div class="box-tools">
        <el-row :gutter="16" type="flex" justify="start" style="margin-left:0px;">
          <!-- 图片弹出框 -->
          <el-col :span="2">
            <el-popover
              placement="right-start"
              width="326"
              trigger="hover"
            >
              <img :src="sectionData.Img + '?x-oss-process=image/resize,h_300,limit_0' + ',' + overTime" style="width:300px;height:300px;">
              <img slot="reference" :src="sectionData.Img + '?x-oss-process=image/resize,h_120' + ',' + overTime" style="width:120px;height:120px;">
            </el-popover>
          </el-col>
          <!-- 款式信息 -->
          <el-col :span="21">
            <el-form label-position="right" label-width="100px" size="mini">
              <el-form-item label="标题：">
                <el-tag type="info" size="small">{{ sectionData.Name }}</el-tag>
              </el-form-item>
              <el-form-item label="款号：">
                <el-tag type="info" size="small">{{ sectionData.SectionNum }}</el-tag>
              </el-form-item>
              <el-form-item label="拿货编号：">
                <el-tag type="info" size="small">{{ sectionData.GetGoodsNum }}</el-tag>
              </el-form-item>
              <el-form-item label="备注：">
                <el-tag type="info" size="small">{{ sectionData.remark ? sectionData.remark : '-' }}</el-tag>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <!-- 按钮 -->
          <el-col :xs="{ span:10, offset:14}" :sm="{ span:6, offset:20}" :md="{ span:13}" :lg="{span:4, offset:21}" :xl="{span:3, offset:22}">
            <el-button type="primary" size="mini" @click="handlePrint(0)">打印全部</el-button>
            <el-button type="warning" size="mini" @click="handleNewSku">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="box-table">
        <el-table :data="detailsData" stripe>
          <el-table-column label="颜色" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Color" style="width:180px" />
              <span v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.Color }}</span>
            </template>
          </el-table-column>
          <el-table-column label="尺码" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model="editSkuInfo.Size" style="width:180px" />
              <span v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.Size }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.Id === editSkuInfo.Id" v-model.number="editSkuInfo.Amount" style="width:180px" />
              <span v-if="scope.row.Id !== editSkuInfo.Id">{{ scope.row.Amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.Id === editSkuInfo.Id" type="primary" size="mini" @click="handleSkuSave()">保存</el-button>
              <el-button v-if="scope.row.Id === editSkuInfo.Id" size="mini" @click="cancelSkuSave()">取消</el-button>
              <el-button v-if="scope.row.Id !== editSkuInfo.Id" type="primary" size="mini" @click="handleSkuEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.Id !== editSkuInfo.Id" size="mini" @click="handleSkuDelete(scope.row.Id)">删除</el-button>
              <el-popover
                :value="printVisible"
                placement="top"
                width="160"
              >
                <p>打印份数：</p>
                <el-input-number v-model="printNum" size="mini" style="width:106px;margin:14px;margin-top:0px" />
                <div style="text-align: right; margin: 0">
                  <el-button type="primary" size="mini" @click="handlePrint(scope.row.Id)">打印</el-button>
                </div>
                <el-button slot="reference" size="mini" icon="el-icon-printer" />
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { stockDetails, updateErpSku, deleteErpSku, addErpSku } from '@/api/stock'
export default {
  data() {
    return {
      parmas: {
        first: ''
      },
      sectionId: '',
      sectionData: [],
      detailsData: [],
      editSkuInfo: {
        'Id': null,
        'Color': '',
        'Size': '',
        'Amount': null,
        'SectionNum': ''
      },
      printVisible: false,
      visible: false,
      printNum: 0,
      overTime: (new Date()).valueOf()
    }
  },
  created() {
    this.sectionId = this.$route.params.id
    this.getStockDetails()
  },
  methods: {
    getStockDetails() {
      stockDetails(this.sectionId).then(res => {
        if (res.success) {
          this.sectionData = res.data.rows
          this.detailsData = res.data.rows.ErpSkus
        }
      })
    },
    handleNewSku() {
      const ErpSpu_temp = this.sectionData
      delete ErpSpu_temp.ErpSkus
      this.editSkuInfo = { Id: '1', ErpSpu: this.sectionData, SectionNum: this.sectionData.SectionNum, SectionID: this.sectionData.SectionID }
      this.detailsData.push(this.editSkuInfo)
    },
    handleSkuEdit(item) {
      this.editSkuInfo = item
    },
    handleSkuSave() {
      console.log(this.editSkuInfo)
      if (this.editSkuInfo.Id === '1') {
        delete this.editSkuInfo.Id
        addErpSku(this.editSkuInfo).then(res => {
          if (res.success) {
            this.$message.success('添加成功!')
            this.getStockDetails()
            this.editSkuInfo = {}
          } else {
            this.$message.error('添加失败，请重试!')
            this.editSkuInfo.Id = '1'
          }
        })
          .catch(e => {
            this.editSkuInfo.Id = '1'
          })
      } else {
        updateErpSku(this.editSkuInfo).then(res => {
          if (res.success) {
            this.$message.success('修改成功!')
            this.getStockDetails()
            this.editSkuInfo = {}
          } else {
            this.$message.error('修改失败，请重试!')
          }
        })
      }
    },
    handleSkuDelete(id) {
      this.$confirm('此操作将删除该SKU, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteErpSku(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功!')
            this.getStockDetails()
          } else {
            this.$message.error('删除失败，请重试')
          }
        })
      })
    },
    cancelSkuSave() {
      if (this.editSkuInfo.Id === '1') {
        this.detailsData = this.detailsData.slice(0, -1)
        this.editSkuInfo = {}
      } else {
        this.editSkuInfo = {}
      }
    },
    handlePrint(id) {
      if (id !== 0) {
        console.log('print', id)
        const { href } = this.$router.resolve({
          path: '/downpage',
          query: {
            id: this.sectionId,
            num: this.printNum,
            skuId: id
          }
        })
        window.open(href, '_blank')
        this.printNum = 0
      } else {
        const { href } = this.$router.resolve({
          path: '/downpage',
          query: {
            id: this.sectionId
          }
        })
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="scss">
  .box-card {
    min-height: calc(100vh - 70px);
    & a {
      margin-right: 5px;
      color: #409eff;
    }
    // .box-tools {
    //   margin-bottom: 20px;
    // }
  }
  .el-form-item--mini.el-form-item, .el-form-item--mini.el-form-item {
    margin-bottom: 5px;
  }
</style>

