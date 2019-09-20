<template>
  <div style="width: 100%;background-color:#525659">
    <div id="pdfDom" v-loading.fullscreen="loading" element-loading-text="标签生成中" style="margin: 0 auto;background-color:#ffffff" :style="{width: pdfWidth, height: pdfHeght}">
      <div
        v-for="(item, i) in goodsInfo"
        :key="i"
        style="float:left;height:328.8px;width:328.79px;"
        :style="{width: Math.ceil(i%2) === 0 ? '600.93px' : '566.92px'}"
      >
        <span style="display:table-cell;width:560px;height:310px;font-size:50px;text-align:center;vertical-align:middle;word-wrap: break-word;word-break:break-all">{{ item }}</span>
      </div>
      <!-- <div v-for="(item, i) in pagedata" :key="i" style="float:left;height:328.8px;" :style="{width: Math.ceil(i%2) === 0 ? '600.93px' : '566.92px'}">
        <div class="tabLeft">
          <div style="width:100%;height:20%;font-size:44px;font-weight:bold;margin-left:22px;">{{ item.ErpSku.ErpSpu.SectionNum }}&nbsp;<span style="font-size:40px;font-weight:100">{{ item.ErpSku.Size.replace('码', '') }}</span></div>
          <div style="display:table-cell;width:207px;height:126px;font-size:32px;text-align:center;vertical-align:middle">{{ item.ErpSku.Color }}</div>
          <div style="width:100%;height:40%;font-size:30px;font-weight:bold;margin-top:8px;margin-left:22px;">{{ item.GetGoodsNum.replace(/\#+/g, `&#10;`).replace(/\*/g, `&nbsp;&nbsp;`) }}</div>
        </div>
        <div class="tabRight">
          <div :id="'qrDom' + i" />
        </div>
        <div v-if="Math.ceil(i%2) === 0" style="height:328.8px;width:34.01px;float:right" />
      </div> -->
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      htmlTitle: new Date(),
      printList: [],
      pagedata: [],
      pdfWidth: '1167.85px',
      pdfHeght: '',
      goodsInfo: []
    }
  },
  created() {
    this.goodsInfo = this.$route.query.tempGoodsInfo.split('\n')
    this.loading = false
    this.pdfHeght = (167.08 * (this.goodsInfo.length + 1)) + 'px'
    console.log(this.pdfHeght)
    this.$nextTick(() => {
      this.getPdf()
    })
  }
}
</script>

<style lang="scss" scoped>
  .tabLeft {
    width: 208px;
    height: 310px;
    margin:5px;
    float:left;
    div {
      margin-top: 5px;
    }
  }
  .tabRight {
      width: 310px;
      margin:5px;
      float:left;
  }
</style>
