<template>
  <div class="app-container">
    <el-card class="search-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <div class="box-tools">
        <!-- <el-row>
          <el-col :span="3">
            <el-select v-model="paginator.Stock" :disabled="tableLoading" size="mini" placeholder="库存状态" @change="changeSelect">
              <el-option label="全部" value="" />
              <el-option label="现货" value="1" />
            </el-select>
          </el-col>
        </el-row> -->
        <el-row :gutter="8" type="flex" justify="right">
          <el-col :span="4">
            <el-input
              v-model="paginator.SectionNum"
              size="mini"
              placeholder="请输入关键字"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="getList">查询</el-button>
          </el-col>
        </el-row>
        <div class="content__btns">
          <div class="content__btns__result">
            <el-button type="primary" size="mini" @click="handleScaningEnter">入库</el-button>
            <el-button type="warning" size="mini" @click="handleScaningOut">出库</el-button>
            <el-button type="primary" size="mini" @click="toPrint">打印标签</el-button>
            <span class="total-tip">共筛选出 <font color="#DF6137;">{{ paginatorInfo.totalCount }}</font> 条商品信息</span>
          </div>
          <div class="content__btns__group">
            <el-button size="mini" type="primary" style="font-size:12px;" @click="handleSpuAdd">新增</el-button>
            <el-button size="mini" type="warning" style="font-size:12px;" @click="putAliProduct">同步商品</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-row :gutter="10">
      <!-- <el-col :span="3" /> -->
      <el-col :span="3">
        <!-- <div style="height: 1px;"/> -->
        <el-card class="group-card">
          <div slot="header" class="clearfix">
            <span>库存分组</span>
            <i style="float: right;" class="el-icon-plus group-card__add" />
          </div>
          <div class="group-card__item">
            测试分组1
            <span class="group-card__item__tool">
              <i class="el-icon-edit" @click.stop="1" />
              <i class="el-icon-delete" @click.stop="1" />
            </span>
          </div>
          <div class="group-card__item">
            测试分组2
          </div>
        </el-card>
      </el-col>
      <el-col :span="21">
        <el-card class="table-card">
          <div class="box-table">
            <!-- spu列表 -->
            <el-table
              v-loading="tableLoading"
              :data="stockData"
              :max-height="tableHeight"
              stripe
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="缩略图" align="center" width="80">
                <template slot-scope="scope">
                  <el-popover
                    placement="right-start"
                    width="326"
                    trigger="hover"
                  >
                    <img :src="scope.row.Img + '?x-oss-process=image/resize,h_300,limit_0' + ',' + overTime" style="margin:0 auto;width:300px;height:300px;">
                    <img slot="reference" :src="scope.row.Img + '?x-oss-process=image/resize,h_58' + ',' + overTime" style="width:58px;height:58px;">
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="标题" align="center" prop="Name" />
              <el-table-column label="款号" align="center" prop="SectionNum" />
              <el-table-column label="拿货编号" align="center" prop="GetGoodsNum" />
              <el-table-column label="价格" align="center" prop="Price" />
              <el-table-column label="备注" align="center" prop="Remark" />
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                  <DropdownButton
                    :items="[
                      { name: '详情', type: 'detail', if: true },
                      { name: '编辑', type: 'edit', if: true },
                      { name: '删除', type: 'delete', if: true },
                    ]"
                    :data="scope"
                    @command="handleCommand"
                  />
                  <!-- <el-button type="primary" size="mini" @click="handleSpuEdit(scope.row.Id)">编辑</el-button> -->
                  <!-- <el-button size="mini" @click="handleSpuDelete(scope.row.Id)">删除</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="paginatorInfo.currentPage + 1"
              :page-sizes="[20, 50, 100, 200, 300, 400]"
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
      </el-col>
    </el-row>
    <!-- 编辑spu的dialog -->
    <el-dialog title="编辑款式" :visible.sync="dialogEditVisible">
      <el-form :model="editSpuInfo" label-position="right" label-width="100px">
        <el-form-item label="图片">
          <el-upload
            ref="spuImgUpload"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImgChange"
            :http-request="uploadImgFile"
          >
            <img v-if="imageUrl_temp" :src="imageUrl_temp + (imageUrl_temp.indexOf('blob') !== -1 ? '' : '?' + overTime)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="editSpuInfo.Name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="款号">
          <el-input v-model="editSpuInfo.SectionNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="拿货编号">
          <el-input v-model="editSpuInfo.GetGoodsNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editSpuInfo.Price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editSpuInfo.Remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增spu的dialog -->
    <el-dialog title="新增款式" :visible.sync="dialogAddVisible">
      <el-form :model="addSpuInfo" label-position="right" label-width="100px">
        <el-form-item label="图片">
          <el-upload
            ref="spuImgUpload"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImgChange"
            :http-request="uploadImgFile"
          >
            <img v-if="imageUrl_temp" :src="imageUrl_temp + (imageUrl_temp.indexOf('blob') !== -1 ? '' : '?' + overTime)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="addSpuInfo.Name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="款号">
          <el-input v-model="addSpuInfo.SectionNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="拿货编号">
          <el-input v-model="addSpuInfo.GetGoodsNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="addSpuInfo.Price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addSpuInfo.Remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false;addSpuInfo = {};imageUrl_temp = ''">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { stockList, uploadSpuXls, uploadSpuPic, updateErpSpu, deleteErpSpu, addErpSpu, putAliProductList } from '@/api/stock'
import qs from 'qs'
import DropdownButton from '@/views/components/DropdownButton'

export default {
  components: {
    DropdownButton
  },
  data() {
    return {
      tableLoading: false,
      tableHeight: '',
      dialogEditVisible: false,
      dialogAddVisible: false,
      parmas: {
        first: ''
      },
      imageUrl_temp: '',
      editSpuInfo: {
        Id:	'',
        Status: '',
        SectionID: '',
        SectionNum: '',
        Name: '',
        Img: '',
        GetGoodsNum: '',
        Price: '',
        Remark: ''
      },
      addSpuInfo: {
        SectionID: '',
        SectionNum: '',
        Name: '',
        Img: '',
        GetGoodsNum: '',
        Price: '',
        Remark: ''
      },
      stockData: [],
      paginator: {
        offset: 0,
        limit: 20,
        SectionNum: '',
        Stock: '',
        Group: ''
      },
      paginatorInfo: {},
      selectList: [],
      overTime: (new Date()).valueOf()
    }
  },
  created() {
    if (this.$route.path.replace('/stock/', '') !== 'all') {
      this.paginator.Group = this.$route.path.replace('/stock/', '')
    }
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      const searchAttrs = qs.stringify(this.paginator)
      stockList(searchAttrs).then(res => {
        if (res.success) {
          this.stockData = res.data.rows
          this.tableLoading = false
          this.paginatorInfo = res.data.paginator
        }
      })
    },
    toPrint() {
      // this.getPdf()
      if (this.selectList.length !== 0) {
        const { href } = this.$router.resolve({
          path: '/downpage',
          query: {
            id: this.selectList.join(',')
          }
        })
        window.open(href, '_blank')
      }
    },
    tableLoadingMode(sign) {
      this.tableHeight = sign ? '500' : ''
      this.tableLoading = sign
    },
    toSectionDetails(Id) {
      this.$router.push({
        name: 'stockDetails',
        params: { id: Id }
      })
      // if (event.target.innerHTML !== '编辑' && event.target.innerHTML !== '<!----><!----><span>编辑</span>' && event.target.innerHTML !== '删除' && event.target.innerHTML !== '<!----><!----><span>删除</span>') {
      // }
    },
    handleSpuEdit(id) {
      const stockDataLen = this.stockData.length
      for (let i = 0; i < stockDataLen; i++) {
        if (this.stockData[i]['Id'] === id) {
          this.editSpuInfo = JSON.parse(JSON.stringify(this.stockData[i]))
          console.log(this.editSpuInfo)
          this.imageUrl_temp = this.editSpuInfo['Img']
        }
      }
      this.dialogEditVisible = true
    },
    handleSpuDelete(id) {
      this.$confirm('此操作将删除该款式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteErpSpu(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功!')
            this.getList()
          }
        })
      })
    },
    handleCommand({ type, data }) {
      switch (type) {
        case 'detail':
          this.toSectionDetails(data.Id)
          break
        case 'edit':
          this.handleSpuEdit(data.Id)
          break
        case 'delete':
          this.handleSpuDelete(data.Id)
          break
      }
    },
    beforeXlsUpload(file) {
      const pattern = /^(\S)*.xlsx/
      const isXlsx = pattern.test(file.name)

      if (!isXlsx) {
        this.$message.error('文件只能是 xlsx 格式')
      }
      return isXlsx
    },
    uploadXlsFile(item) {
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      uploadSpuXls(form).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleImgChange(file) {
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt200KB = file.raw.size < 614400

      if (!isJPG) {
        this.$message.error('图片只能是 JPG 或 PNG 格式')
      }
      if (!isLt200KB) {
        this.$message.error('图片大小不能超过 600KB')
      }
      if (isJPG && isLt200KB) {
        this.imageUrl_temp = URL.createObjectURL(file.raw)
      }
    },
    uploadImgFile(item) {
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('img', fileObj)
      form.append('size', fileObj.size)
      form.append('sectionNum', this.addSpuInfo.SectionNum === '' ? this.editSpuInfo.SectionNum : this.addSpuInfo.SectionNum)
      uploadSpuPic(form).then(res => {
        if (res.success) {
          this.tableLoading = false
        } else {
          this.$message.error('图片上传失败, 请重试')
          this.tableLoading = false
        }
      })
    },
    editSubmit() { // 提交修改
      this.dialogEditVisible = false
      if (this.editSpuInfo.Img.indexOf('alibaba') === -1) {
        this.editSpuInfo.Img = 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/' + this.editSpuInfo.SectionNum + '.jpg'
      }
      this.editSpuInfo.SectionID = this.editSpuInfo.SectionNum
      updateErpSpu(this.editSpuInfo).then(res => {
        if (res.success) {
          if (this.editSpuInfo.Img.indexOf('alibaba') === -1) {
            this.$refs.spuImgUpload.submit()
          }
          this.$message.success('修改成功')
          this.getList()
          this.editSpuInfo = {
            Id:	'',
            Status: '',
            SectionNum: '',
            Name: '',
            Img: '',
            GetGoodsNum: '',
            Price: '',
            Remark: ''
          }
        } else {
          this.$message.error('修改失败，请稍后重试')
        }
      })
    },
    handleSelectionChange(list) {
      const selectList_temp = []
      for (const i in list) {
        selectList_temp.push(list[i]['Id'])
      }
      this.selectList = selectList_temp
    },
    handleScaningEnter() {
      this.$router.push({
        name: 'scaningEnter'
      })
    },
    handleScaningOut() {
      this.$router.push({
        name: 'scaningOut'
      })
    },
    handleSpuAdd() {
      this.dialogAddVisible = true
    },
    addSubmit() {
      this.dialogAddVisible = false
      this.tableLoading = true
      this.imageUrl_temp = ''
      this.addSpuInfo.Img = 'https://xkerp-pic.oss-cn-shenzhen.aliyuncs.com/' + this.addSpuInfo.SectionNum + '.jpg'
      this.addSpuInfo.SectionID = this.addSpuInfo.SectionNum
      addErpSpu(this.addSpuInfo).then(res => {
        if (res.success) {
          this.$refs.spuImgUpload.submit()
          this.$message.success('新增款式成功')
          this.getList()
          this.addSpuInfo = {}
        } else {
          this.$message.error('新增款式失败，请稍后重试')
        }
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
    // 选择器改变
    changeSelect(val) {
      if (val === '1') {
        console.log(this.paginatorInfo.totalCount)
        this.paginator.limit = this.paginatorInfo.totalCount
      } else {
        this.paginator.limit = 50
      }
    },
    putAliProduct() {
      this.tableLoading = true
      putAliProductList().then(res => {
        if (res.success) {
          this.$message.success('成功同步' + res.data.num + '个商品!')
          this.tableLoading = false
        }
      })
        .catch(e => {
          console.log(e)
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
  .search-card {
    // position:fixed;
    margin-bottom: 10px;
    .content__btns {
      display: inline-flex;
      width: 100%;
      margin: 15px 0;
      margin-bottom: 0;
      // 结果条数
      .content__btns__result {
        flex: 1;
        font-size: 12px;
        line-height: 32px;
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
  .group-card {
    .el-card__header {
      background-color: #edf2fa;
      padding: 11px 20px;
    }
    .el-card__body {
      padding: 0px;
    }
    .group-card__add {
      font-size: 17px;
      cursor: pointer;
    }
    .group-card__item {
      font-size: 14px;
      line-height: 38px;
      border-top: 1px solid #dedede;
      padding: 0 20px;
      cursor: pointer;
      &:first-child {
        border-top: 0px;
      }
      &:hover, &.active {
        .group-card__item__tool {
          display: block;
        }
        background-color: #edf2fa;
        color: #66b1ff;
      }
    }
    .group-card__item__tool {
      float: right;
      color: #666;
      display: none;
      > i {
          margin-left: 5px;
      }
    }
  }
  .table-card {
    // width: 90%;
    min-height: calc(100vh - 70px);
    & a {
      color: #409eff;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

