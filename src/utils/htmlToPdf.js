// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      var title = this.htmlTitle
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: false
      }).then(function(canvas) {
        console.log(canvas)
        const contentWidth = canvas.width // 获取img宽度
        const contentHeight = canvas.height // 获取img高度
        // const pageHeight = contentWidth / 50 * 30 // 获取适合比例下的页面高度
        const pageHeight = contentWidth / 291.97 * 85.20 // 获取适合比例下的页面高度
        // const pageHeight = contentWidth / 612 * 792
        // const pageHeight = contentHeight
        let leftHeight = contentHeight // 总高度
        let position = 0
        // const imgWidth = 141.73
        const imgWidth = 291.97
        // const imgHeight = 283.46 / contentWidth * contentHeight
        const imgHeight = 291.97 / contentWidth * contentHeight
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const PDF = new JsPDF('l', 'pt', 'tab53', false)
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 82.2
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
    }
  }
}
