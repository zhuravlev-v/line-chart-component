<template>
  <div :class="[ 'chart', theme ]">
    <LineChartLeftBar 
      ref="LineChartLeftBar" 
      :data="[...fact, ...plan]" 
      :theme="theme" 
      :itemsNumber="canvas.leftBarNumber"
    />
    <LineChartCanvas 
      ref="canvas"
      @mouse-move="handlerCanvasMouseMove"
      @mouse-leave="handlerCanvasMouseLeave"
    />
    <LineChartHorizontalBar
      ref="LineChartHorizontalBar"
      :data="labels" 
      :theme="theme" 
      :pointerActive="pointerActive"
    />
  </div>
</template>

<script>
import LineChartCanvas from '@/components/LineChart/LineChartCanvas.vue';
import LineChartLeftBar from '@/components/LineChart/LineChartLeftBar.vue';
import LineChartHorizontalBar from '@/components/LineChart/LineChartHorizontalBar.vue';

export default {
  name: 'LineChart',
  components: { LineChartCanvas, LineChartLeftBar, LineChartHorizontalBar },
  props: {
    theme: { 
      type: String, 
      required: false, 
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].includes(value)
      }
    },
    counter: { type: String, required: false, default: '' },
  },
  data: () => ({
    fact: [21000, 38000, 25000, 0, 47893, 143000, 143000, 143000, 31954, 78992, 15666, 67359],
    plan: [60000, 55000, 10000, 109553, 40500, 60000, 36725, 54653, 62359, 19999, 34615, 0],
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    lineChartColors: ['#E83D46', '#DADADA', '#F9A620', '#005FA7', '#00BFB9', '#FD2D91'],
    // 'rgba(38, 36, 36, 0.17)'
    // 'rgba(38, 36, 36, 0.17)'
    canvas: {
      canvas: null,
      ctx: null,
      DPI_WIDTH: null,
      DPI_HEIGHT: null,
      leftBarNumber: 5,
    },
    pointerActive: null,
  }),
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.initCanvas)
  },
  destroyed() {
    window.removeEventListener('resize', this.initCanvas)
  },
  methods: {
    initCanvas() {
      this.canvas.canvas = this.$refs.canvas.$el
      this.canvas.ctx = this.canvas.canvas.getContext('2d')
      this.setCanvasDimensions(this.canvas.canvas)
      this.drawDashMarkup()

      if (this.theme === 'light') {
        this.drawLineChartBezier(this.plan, this.lineChartColors[1], 1)
      } else {
        this.drawLineChartBezier(this.plan, this.lineChartColors[1], 0.17)
      }

      this.drawLineChartBezier(this.fact, this.lineChartColors[0], 1)
      // this.drawLineChart(this.fact, this.lineChartColors[0], 1)

      // this.canvas.ctx.save()
    },
    setCanvasDimensions(canvas) {
      const canvasStyle = getComputedStyle(canvas)
      const DPI_WIDTH = parseFloat(canvasStyle.width) * 2
      const DPI_HEIGHT = parseFloat(canvasStyle.height) * 2
      const DPI_PADDING_TOP = 20 * 2
      const DPI_PADDING_BOTTOM = 10 * 2
      canvas.width = DPI_WIDTH
      canvas.height = DPI_HEIGHT
      this.canvas.DPI_WIDTH = DPI_WIDTH
      this.canvas.DPI_HEIGHT = DPI_HEIGHT
      this.canvas.DPI_HEIGHT_VIEW = DPI_HEIGHT - (DPI_PADDING_TOP + DPI_PADDING_BOTTOM)
      this.canvas.DPI_PADDING_TOP = DPI_PADDING_TOP
      this.canvas.DPI_PADDING_BOTTOM = DPI_PADDING_BOTTOM
    },
    drawDashMarkup() {
      const drawFirstDash = () => {
        ctx.moveTo(0, leftBarItemHeight_DPI / 2 + DPI_PADDING_TOP) //передвигаем перо
        ctx.lineTo(this.canvas.DPI_WIDTH, leftBarItemHeight_DPI / 2 + DPI_PADDING_TOP) //рисуем линию
        ctx.stroke()
      }
      const drawLastDash = () => {
        ctx.moveTo(0, this.canvas.DPI_HEIGHT - DPI_PADDING_BOTTOM - lineWidth)
        ctx.lineTo(this.canvas.DPI_WIDTH, this.canvas.DPI_HEIGHT - DPI_PADDING_BOTTOM - lineWidth)
        ctx.stroke()
      }
      const drawCoreDash = () => {
        for (let i = 1; i < this.canvas.leftBarNumber; i++) {
          const y = leftBarItemHeight_DPI * i + leftBarItemHeight_DPI / 2 + leftBarItemGap_DPI * i + DPI_PADDING_TOP
          ctx.moveTo(0, y)
          ctx.lineTo(this.canvas.DPI_WIDTH, y)
          ctx.stroke()
        }
      }
      
      const ctx = this.canvas.ctx
      const DPI_PADDING_TOP = this.canvas.DPI_PADDING_TOP
      const DPI_PADDING_BOTTOM = this.canvas.DPI_PADDING_BOTTOM
      const leftBar = this.$refs.LineChartLeftBar.$el
      const isLeftBarHidden = getComputedStyle(leftBar).display === 'none'
      let leftBarHeight
      let leftBarItemHeight_DPI
      let leftBarItemGap_DPI

      if (isLeftBarHidden) {
        const canvasEl = this.$refs.canvas.$el
        leftBarHeight = parseFloat(getComputedStyle(canvasEl).height).toFixed(2)
        const leftBarLength = this.canvas.leftBarNumber + 1
        leftBarItemGap_DPI = 20
        leftBarItemHeight_DPI = (this.canvas.DPI_HEIGHT / leftBarLength).toFixed(2) - leftBarItemGap_DPI
      }
      else {
        leftBarHeight = parseFloat(getComputedStyle(leftBar).height).toFixed(2)
        leftBarItemHeight_DPI = parseFloat(getComputedStyle(leftBar.children[0]).height).toFixed(2) * 2
        leftBarItemGap_DPI = ((leftBarHeight - leftBarItemHeight_DPI / 2 * leftBar.children.length) / this.canvas.leftBarNumber).toFixed(2) * 2
      }
      // const leftBarItemGap_DPI = ((parseFloat(getComputedStyle(leftBar).height).toFixed(2) - leftBarItemHeight_DPI / 2 * leftBar.children.length) / this.canvas.leftBarNumber).toFixed(2) * 2
      
      ctx.beginPath()
      ctx.strokeStyle = this.theme === 'light' ? '#EDEDED' : '#575757'
      // ctx.strokeStyle = 'blue'
      const lineWidth = 1
      ctx.lineWidth = lineWidth
      const dashWidth = 8 * 2
      const dashGap = 7 * 2

      ctx.setLineDash([dashWidth, dashGap])

      drawFirstDash()
      drawLastDash()
      drawCoreDash()

      ctx.closePath()
    },
    drawLineChart(data, color, alpha) {
      const ctx = this.canvas.ctx
      const DPI_PADDING_TOP = this.canvas.DPI_PADDING_TOP
      // const maxPoint = Math.max(...data)
      const maxPoint = this.maxPoint
      const ratio = this.canvas.DPI_HEIGHT_VIEW / maxPoint
      const axisY = data.map(item => (this.canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
      const axisX = this.getCoordsAxisX()

      for (let i = 0; i < data.length; i++) {
        if (isFinite(i + 1)) {
          ctx.beginPath()
          ctx.globalAlpha = alpha
          ctx.setLineDash([])
          ctx.moveTo((axisX[i] * 2), axisY[i])
          ctx.lineTo((axisX[i + 1] * 2), axisY[i + 1])
          ctx.strokeStyle = color
          ctx.lineWidth = 3 * 2
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    },
    drawLineChartBezier(data, color, alpha) {
      const canvas = this.canvas
      const ctx = this.canvas.ctx
      const DPI_PADDING_TOP = canvas.DPI_PADDING_TOP
      // const maxPoint = Math.max(...data)
      const maxPoint = this.maxPoint
      const ratio = canvas.DPI_HEIGHT_VIEW / maxPoint
      const axisX = this.getCoordsAxisX()
      const axisY = data.map(item => (canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
      const horizontalBarItemsWidth = this.horizontalBarItemsWidth()
      let yA, yB, yC, xA, subYaYb, subYaYc, k, s, xLeft, yLeft, xRight, yRight

      ctx.beginPath()

      yA = axisY[0]
      yC = axisY[1]

      ctx.moveTo(axisX[0], yA)

      for (let i = 1; i < data.length; i++) {
        const xStretch = Number(horizontalBarItemsWidth[i])
        const xStretchSqr = xStretch * xStretch
        // console.log(xStretch)
        yB = yA
        yA = yC
        yC = axisY[i + 1]

        xA = axisX[i] * 2

        if (i < data.length - 1) {
          subYaYb = yA - yB
          subYaYc = yA - yC

          if (subYaYb != subYaYc) {
            k = (Math.sqrt((xStretchSqr + subYaYb * subYaYb) * (xStretchSqr + subYaYc * subYaYc)) - xStretchSqr - subYaYb * subYaYc) / (xStretch * (yC - yB));
          } else {
            k = 0;
          }

          s = xStretch / 2 * Math.sqrt(1 / (1 + k * k));

          xLeft = xA - s;
          yLeft = yA - k * s;
        }

        //ctx.moveTo(getGraphicPointX(i - 1), yB);
        if (i == 1) {
          ctx.quadraticCurveTo(xLeft, yLeft, xA, yA);
        } else if (i < data.length - 1) {
          ctx.bezierCurveTo(xRight, yRight, xLeft, yLeft, xA, yA);
        } else {
          ctx.quadraticCurveTo(xRight, yRight, xA, yA);
        }

        if (i < data.length - 1) {
          xRight = xA + s;
          yRight = yA + k * s;
        }

      //   //ctx.moveTo(xLeft, yLeft);
      //   //ctx.lineTo(xRight, yRight);
      }

      
      ctx.lineWidth = 3 * 2
      ctx.setLineDash([])
      ctx.globalAlpha = alpha
      ctx.strokeStyle = color
      ctx.stroke();
    },   
    getCoordsAxisX() {
      const axisX = []
      const horizontalBarItemsWidth = this.horizontalBarItemsWidth()

      for (let i = 0; i < horizontalBarItemsWidth.length; i++) {
        let arr = []
        const itemsWidthReducedArray = horizontalBarItemsWidth.slice(0, i + 1)

        for (let i = 0; i < itemsWidthReducedArray.length; i++) {
          if (i + 1 === itemsWidthReducedArray.length) {
            arr.push(itemsWidthReducedArray[i] / 2)
          }
          else {
            arr.push(itemsWidthReducedArray[i])
          }
        }
        axisX.push(arr.reduce((acc, item) => acc += Number(item), 0))
      }

      return axisX
    },
    drawPointer() {
      const ctx = this.canvas.ctx
      const DPI_PADDING_TOP = this.canvas.DPI_PADDING_TOP
      const DPI_PADDING_BOTTOM = this.canvas.DPI_PADDING_BOTTOM
      // const maxPoint = Math.max(...this.fact)
      const maxPoint = this.maxPoint
      const ratio = this.canvas.DPI_HEIGHT_VIEW / maxPoint
      const axisX = this.getCoordsAxisX()
      const axisY = this.fact.map(item => (this.canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
      const index = this.pointerActive
      const tooltipWidth = 105 * 2
      const tooltipHeight = 67 * 2
      const pointerOuterWidth = 14

      const drawOuterCircle = (width) => {
        ctx.beginPath()
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 3
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
        ctx.arc(axisX[index] * 2, axisY[index], width, 0, 2*Math.PI, false)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
        ctx.lineWidth = 1
        ctx.strokeStyle = '#FFFFFF'
        ctx.stroke()
        ctx.closePath()
      }
      const drawInnerCircle = () => {
        ctx.beginPath()
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 0
        ctx.arc(axisX[index] * 2, axisY[index], 6, 0, 2*Math.PI, false)
        ctx.fillStyle = '#E83D46'
        ctx.fill()
        ctx.lineWidth = 1
        ctx.strokeStyle = '#E83D46'
        ctx.stroke()
        ctx.closePath()
      }
      const drawVerticalLine = () => {
        ctx.beginPath()
        ctx.strokeStyle = '#E83D46'
        const lineWidth = 1
        ctx.lineWidth = lineWidth
        const dashWidth = 15 * 2
        const dashGap = 5 * 2

        ctx.setLineDash([dashWidth, dashGap])
        ctx.moveTo(axisX[index] * 2, this.canvas.DPI_HEIGHT - DPI_PADDING_BOTTOM - lineWidth)
        ctx.lineTo(axisX[index] * 2, axisY[index])
        ctx.stroke()
      }
      const drawTooltip = (width, height) => {

        const definePosition = () => {
          const rightSide = axisX[index] * 2 + marginX + width
          const topSide = axisY[index] - height - marginY 

          if (rightSide > this.canvas.DPI_WIDTH) {
            xCoord = axisX[index] * 2 - marginX - width
          }
          else {
            xCoord = axisX[index] * 2 + marginX
          }

          if (topSide < 0) {
            yCoord = axisY[index] + marginY
          }
          else {
            yCoord = axisY[index] - height - marginY
          }
        }

        const marginX = 9 * 2
        const marginY = pointerOuterWidth / 2
        const paddingPercentLeft = 0.1428
        const paddingPercentTop = 0.1333
        const paddingPercentRight = 0.1714
        const paddingPercentBottom = 0.1142
        let xCoord = null
        let yCoord = null
        let lineHeight = 0
        // const position = definePosition()
        definePosition()
        ctx.beginPath()
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 3
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
        ctx.roundRect(xCoord, yCoord, width, height, [10])
        ctx.fillStyle = this.theme === 'light' ? '#FFFFFF' : '#262424'
        ctx.fill()

        const drawTitle = () => {
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
          ctx.shadowColor = 0
          ctx.fillStyle = this.theme === 'light' ? "#262424" : '#FFFFFF'
          ctx.font = 'bold 32px Segoe UI,sans-serif'
          const text = this.fact[index] + ' ' + this.counter
          const maxWidth = width - width * paddingPercentLeft - width * paddingPercentRight
          const metrics = ctx.measureText(text)
          // const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
          const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
          const xAxisCoord = xCoord + Number((width * paddingPercentLeft).toFixed(2))
          const yAxisCoord = yCoord + actualHeight + Number((width * paddingPercentTop).toFixed(2)) + lineHeight
          lineHeight += actualHeight
          ctx.fillText(text, xAxisCoord, yAxisCoord, maxWidth)
        }

        const drawSubtitle = () => {
          ctx.fillStyle = '#A7A7A7'
          ctx.font = 'normal 28px Mail Sans Roman, sans-serif'
          const text = this.labels[index]
          const maxWidth = width - width * paddingPercentLeft - width * paddingPercentRight
          const metrics = ctx.measureText(text)
          // const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
          const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
          const xAxisCoord = xCoord + Number((width * paddingPercentLeft).toFixed(2))
          const yAxisCoord = yCoord + actualHeight + Number((width * paddingPercentTop).toFixed(2)) + lineHeight + 24
          ctx.fillText(text, xAxisCoord, yAxisCoord, maxWidth)
        }

        drawTitle()
        drawSubtitle()
      }

      drawVerticalLine()
      drawOuterCircle(pointerOuterWidth)
      drawInnerCircle()
      drawTooltip(tooltipWidth, tooltipHeight)
    },
    getHorizontalBarItemsCoords() {
      const horizontalBar = this.$refs.LineChartHorizontalBar.$el
      const isHorizontalBarHidden = getComputedStyle(horizontalBar).display === 'none'
      const canvasEl = this.$refs.canvas.$el
      let horizontalBarItemsCoords = []

      if (isHorizontalBarHidden) {
        let prevRightCoord = 0
        const leftInit = canvasEl.getBoundingClientRect().left
        const horizontalBarLength = horizontalBar.children.length
        const itemWidth = this.canvas.DPI_WIDTH / 2 / horizontalBarLength

        horizontalBarItemsCoords = Array.from(horizontalBar.children).map(item => {
          const left = prevRightCoord === 0 ? leftInit : prevRightCoord
          const right = left + itemWidth
          prevRightCoord = right
          return [left, right]
        })
      }
      else {
        horizontalBarItemsCoords = Array.from(horizontalBar.children).map(item => {
          return [item.getBoundingClientRect().left, item.getBoundingClientRect().right]
        })
      }

      return horizontalBarItemsCoords
    },
    horizontalBarItemsWidth() {
      const horizontalBar = this.$refs.LineChartHorizontalBar.$el
      const isHorizontalBarHidden = getComputedStyle(horizontalBar).display === 'none'

      if (isHorizontalBarHidden) {
        const horizontalBarLength = horizontalBar.children.length
        const itemWidth = this.canvas.DPI_WIDTH / 2 / horizontalBarLength
        return Array(horizontalBarLength).fill(itemWidth, 0, horizontalBarLength)
      }
      else {
        return Array.from(horizontalBar.children).map(item => {
          return parseFloat(getComputedStyle(item).width).toFixed(2)
        })
      }
    },
    handlerCanvasMouseMove(e) {
      this.initCanvas()
      const horizontalBarItemsCoords = this.getHorizontalBarItemsCoords()
      horizontalBarItemsCoords.forEach(([left, right], index) => {
        if (left <= e.clientX && e.clientX <= right) {
          this.pointerActive = index
        }
      })
      this.drawPointer()
    },
    handlerCanvasMouseLeave() {
      this.pointerActive = null
      // this.canvas.ctx.restore()
      this.initCanvas()
    },
  },
  computed: {
    maxPoint() {
      const data = [...this.fact, ...this.plan]
      return Math.max(...data)
    }
  },
}
</script>

<style lang='scss' scoped>
.chart {
  max-width: 810px;
  max-height: 350px;
  width: 100%;
  height: 350px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
  border-radius: 0px 5px 5px 0px;
  padding: 30px 30px 20px 27.5px;
  // padding-left: 27.5px;
  display: grid;
  grid-template-columns: 31px 1fr;
  grid-template-rows: 1fr 22px;
  grid-column-gap: 5.5px;
  background-color: #FFFFFF;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}

.chart.dark {
  background-color: #262424;
}
</style>