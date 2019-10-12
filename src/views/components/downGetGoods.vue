<template>
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff" :style="{width: pdfWidth, height: pdfHeght}">
      <div v-for="(item, i) in pagedata" :key="i" style="float:left;height:328.8px;" :style="{width: Math.ceil(i%2) === 0 ? '600.93px' : '566.92px'}">
        <div class="tabLeft">
          <div style="width:100%;height:20%;font-size:44px;font-weight:bold;margin-left:22px;">{{ item.ErpSku.ErpSpu.SectionNum }}&nbsp;<span style="font-size:40px;font-weight:100">{{ item.ErpSku.Size.replace('码', '') }}</span></div>
          <div style="display:table-cell;width:207px;height:126px;font-size:32px;text-align:center;vertical-align:middle">{{ item.ErpSku.Color }}</div>
          <div style="width:100%;height:40%;font-size:37px;font-weight:bold;margin-top:8px;margin-left:22px;">{{ item.GetGoodsNum.replace(/\#+/g, `&#10;`).replace(/\*/g, `&nbsp;&nbsp;`) }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
          <span style="float:right;font-weight:bold;font-size:41px;">
            {{ item.DailyNum }}
          </span>
        </div>
        <div v-if="Math.ceil(i%2) === 0" style="height:328.8px;width:34.01px;float:right" />
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getGoodsList } from '@/api/getGoods'
import qs from 'qs'

export default {
  data() {
    return {
      loading: true,
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      pdfWidth: '1167.85px',
      pdfHeght: '',
      paginator: {
        offset: 0,
        limit: 10
      }
    }
  },
  created() {
    this.printList = 'ids=[' + this.$route.query.id + ']'
    this.paginator.limit = this.$route.query.id.length
    this.getList()
  },
  methods: {
    getList() {
      const data = qs.stringify(this.paginator)
      getGoodsList(this.printList + '&' + data)
        .then(res => {
          if (res.success) {
            const data = res.data.rows
            const temp_data = []
            // let mlCount = 0
            Object.assign(temp_data, data)
            for (let i = 0; i < data.length; i++) {
              // const getAmount = Number(data[i].Amount) - Number(data[i].PutInAmount)
              const getAmount = Number(data[i].Amount)
              if (getAmount > 1) {
                for (let j = 0; j < getAmount - 1; j++) {
                  temp_data.splice(temp_data.indexOf(data[i]), 0, data[i])
                //   mlCount++
                //   temp_data.splice(i + j + mlCount, 0, data[i])
                }
              }
            }
            this.pagedata = temp_data
            this.pdfHeght = (167.08 * (this.pagedata.length + 1)) + 'px'
          }
        })
        .finally(() => {
          this.qrcode()
          this.loading = false
          this.getPdf()
        })
    },
    qrcode() {
      console.log(this.pagedata)
      const skuLen = this.pagedata.length
      console.log(skuLen)
      for (let i = 0; i < skuLen; i++) {
        new QRCode('qrDom' + i, {
          width: 270,
          height: 270,
          text: `{"sNum":"${this.pagedata[i].ErpSku.ErpSpu.SectionNum}","SkuId":"${this.pagedata[i].ErpSku.Id}","gid":"${this.pagedata[i].Id}"}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 248px;
    height: 310px;
    margin:5px;
    float:left;
    div {
      margin-top: 5px;
    }
  }
  .tabRight {
      width: 270px;
      height: 310px;
      margin:5px;
      float:left;
  }
</style>
