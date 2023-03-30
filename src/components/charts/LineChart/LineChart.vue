<template>
  <div :class="[ 'chart', theme ]">
    <LineChartLeftBar
      v-if="!noData"
      ref="LineChartLeftBar"
      :data="dataMergedValues"
      :theme="theme"
      :itemsNumber="canvas.leftBarNumber"
    />
    <div class="chart__canvas-wrapper"
      @mousemove="handlerCanvasMouseMove"
      @mouseleave="handlerCanvasMouseLeave"
    >
      <LineChartCanvas
        :noData="noData"
        ref="canvas"
        id="canvas"
      />
        <!-- :coords="[
          coordsAxisX?.[pointerActive] || null,
          coordsAxisY[0]?.[pointerActive] || null
        ]" -->
      <LineChartTooltip
        v-if="isInitialized"
        :data="data"
        :active="pointerActive"
        :coordsAxisX="coordsAxisX"
        :coordsAxisY="coordsAxisY"
        :canvasRect="{
          width: canvas.DPI_WIDTH / 2,
          height: canvas.DPI_HEIGHT / 2,
          pBottom: canvas.DPI_PADDING_BOTTOM
        }"
        :counter="counterFormatted"
        :type="type"
      />
    </div>
    <LineChartHorizontalBar
      ref="LineChartHorizontalBar"
      :data="labels"
      :theme="theme"
      :pointerActive="pointerActive"
    />
  </div>
</template>

<script>
import spacesInDigit from '@/assets/script/spacesInDigit';
import LineChartCanvas from '@/components/charts/LineChart/LineChartCanvas.vue';
import LineChartLeftBar from '@/components/charts/LineChart/LineChartLeftBar.vue';
import LineChartHorizontalBar from '@/components/charts/LineChart/LineChartHorizontalBar.vue';
import LineChartTooltip from '@/components/charts/LineChart/LineChartTooltip.vue';

export default {
  name: 'LineChart',
  components: { LineChartCanvas, LineChartLeftBar, LineChartHorizontalBar, LineChartTooltip },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].includes(value)
      }
    },
    counter: { type: [String, Array], required: false, default: ' ' },
    type: { type: String, required: false, default: 'default' },
    labelsRaw: { type: Array, required: false, default: function() { return [] } },
    // fact: { type: Array, required: true },
    // plan: { type: Array, required: false, default: function() { return [] } },
    data: { type: Array, required: false, default: function() { return [] } },
  },
  data: () => ({
    isInitialized: false,
    canvas: {
      canvas: null,
      ctx: null,
      DPI_WIDTH: null,
      DPI_HEIGHT: null,
      leftBarNumber: 5,
    },
    pointerActive: null,
    coordsAxisX: [],
    coordsAxisY: [],
    minPoint: 0,
    maxPoint: 0,
  }),
  mounted() {

    if (this.noData) return
    this.setMinMaxPoint()
    this.initCanvas()
    this.isInitialized = true
    window.addEventListener('resize', this.initCanvas)
  },
  destroyed() {
    window.removeEventListener('resize', this.initCanvas)
  },
  watch: {
    theme() {
      this.initCanvas()
    }
  },
  computed: {
    counterFormatted() {
      if (typeof this.counter === 'string') {
        return this.counter
      }
      else if (Array.isArray(this.counter)) {
        if (this.counter.length < this.data.length) {
          const newCounter = this.counter
          const placeholder = this.counter[0] ? this.counter[0] : ' '

          for (let i = this.counter.length; i < this.data.length; i++) {
            newCounter.push(placeholder)
          }

          return newCounter

        } else {
          return this.counter
        }
      }
    },
    // minPoint() {
    //   return Math.min(...this.dataMergedValues)
    // },
    // maxPoint() {
    //   return Math.max(...this.dataMergedValues)
    // },
    dataMergedValues() {
      return this.data.reduce((accArr, item, index, array) => {
        return accArr.concat(item.values)
      }, [])
    },
    labels() {
      return this.labelsRaw.map(item => item.label)
    },
    labelsDesc() {
      return this.labelsRaw.map(item => item.desc)
    },
    noData() {
      // return (this.fact.length === 0 && this.plan.length === 0) ||
      // (this.fact.reduce((acc, item) => acc += item, 0) === 0 &&
      // this.plan.reduce((acc, item) => acc += item, 0) === 0)
      return this.dataMergedValues.length === 0
    },
    colors() {
      return [
        { color: '#E83D46', alpha: 1 },
        { color: '#DADADA', alpha: this.theme === 'light' ? 1 : 0.17 },
        { color: '#F9A620', alpha: 1 },
        { color: '#005FA7', alpha: 1 },
        { color: '#00BFB9', alpha: 1 },
        { color: '#FD2D91', alpha: 1 },
      ]
    },
  },
  methods: {
    setMinMaxPoint() {
      this.minPoint = Math.min(...this.dataMergedValues)
      this.maxPoint = Math.max(...this.dataMergedValues)

      if (this.minPoint < 0) {
        //console.log('setMinMaxPoint minPoint < 0')
        this.maxPoint = this.maxPoint + Math.abs(this.minPoint)
        // this.minPoint = 0
      }
    },
    initCanvas() {
      if (this.noData) return
      this.canvas.canvas = this.$refs.canvas.$el
      this.canvas.ctx = this.canvas.canvas.getContext('2d')
      this.setCanvasDimensions(this.canvas.canvas)
      this.drawDashMarkup()
      this.setPeaks()

      for (let i = this.data.length - 1; i > -1; i--) {
        const item = this.data[i]
        if (item.values.length > 2) {
          this.drawLineChartBezier(item.values, this.colors[i].color, this.colors[i].alpha)
        } else {
          this.drawLineChart(item.values, this.colors[i].color, this.colors[i].alpha)
        }
      }

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
    setPeaks() {
      const DPI_HEIGHT_VIEW = this.canvas.DPI_HEIGHT_VIEW
      const DPI_PADDING_TOP = this.canvas.DPI_PADDING_TOP
      const ratio = DPI_HEIGHT_VIEW / this.maxPoint
      const minPoint = this.minPoint
      // const coordsAxisX = this.getCoordsAxisX()
      // this.coordsAxisX = coordsAxisX
      this.coordsAxisX = this.getCoordsAxisX()
      this.coordsAxisY = []

      if (minPoint > 0) {
      //  console.log('minPoint > 0')
        for (const { values } of this.data) {
          const axisY = values.map(item => ((DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio) / 2)
          this.coordsAxisY.push(axisY)
        }
      }
      else {
      //  console.log('minPoint < 0')
        // const valuesMergedCopy = []
        for (const { values } of this.data) {
          const axisY = values.map(item => {
            const itemNormalized = item >= 0 ? item : item + Math.abs(minPoint)
            // const itemNormalized = item + Math.abs(minPoint)
          //  console.log(itemNormalized)
            // valuesMergedCopy.push(itemNormalized)
            return ((DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - itemNormalized * ratio) / 2
          })
          this.coordsAxisY.push(axisY)
        }
        // const newMaxPoint = Math.max(...valuesMergedCopy)
        // console.log(newMaxPoint)
        // this.maxPoint = newMaxPoint
      }

    },
    drawLineChart(data, color, alpha) {
      const ctx = this.canvas.ctx
      const DPI_PADDING_TOP = this.canvas.DPI_PADDING_TOP
      // const maxPoint = Math.max(...data)
      const maxPoint = this.maxPoint
      const minPoint = this.minPoint
      const ratio = this.canvas.DPI_HEIGHT_VIEW / maxPoint
      const axisX = this.getCoordsAxisX()
      // const axisY = data.map(item => (this.canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
      let axisY
      //
        if (minPoint > 0) {
          axisY = data.map(item => (this.canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
        }
        else {
          axisY = data.map(item => {
            const itemNormalized = item >= 0 ? item : item + Math.abs(minPoint)
            return (this.canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - itemNormalized * ratio
          })
        }
      //

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
    drawLineChartCurve(ctx, ptsa, color) {
      ctx.strokeStyle = /* '#E83D46' */ color
      ctx.lineWidth = 3
      ctx.setLineDash([0, 0]);
      var points = ptsa
      ctx.beginPath();
      // move to the first point
      ctx.moveTo((points[0].x), points[0].y);
      for(var i = 0; i < points.length-1; i ++) {
          var x_mid = (points[i].x + points[i+1].x) / 2;
          var y_mid = (points[i].y + points[i+1].y) / 2;
          var cp_x1 = (x_mid + points[i].x) / 2;
          var cp_x2 = (x_mid + points[i+1].x) / 2;
          ctx.quadraticCurveTo(cp_x1,points[i].y ,x_mid, y_mid);
          ctx.quadraticCurveTo(cp_x2,points[i+1].y,points[i+1].x,points[i+1].y);
      }
      ctx.stroke();
      ctx.closePath();
    },
    drawLineChartBezier(data, color, alpha) {
      const canvas = this.canvas
      const ctx = this.canvas.ctx
      const DPI_PADDING_TOP = canvas.DPI_PADDING_TOP
      const maxPoint = this.maxPoint
      const minPoint = this.minPoint
      const ratio = canvas.DPI_HEIGHT_VIEW / maxPoint
      // const axisX = this.getCoordsAxisX()
      const axisX = this.coordsAxisX
      // const axisY = data.map(item => (canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
      let axisY
      //
      if (minPoint > 0) {
        axisY = data.map(item => (canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - item * ratio)
      }
      else {
        axisY = data.map(item => {
          const itemNormalized = item >= 0 ? item : item + Math.abs(minPoint)
          return (canvas.DPI_HEIGHT_VIEW + DPI_PADDING_TOP) - itemNormalized * ratio
        })
      }
      //
      const horizontalBarItemsWidth = this.horizontalBarItemsWidth()
      let yA, yB, yC, xA, subYaYb, subYaYc, k, s, xLeft, yLeft, xRight, yRight

      ctx.beginPath()

      yA = axisY[0]
      yC = axisY[1]

      ctx.moveTo(axisX[0] * 2, yA)

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
      if (this.noData) return
      if (e.target.id !== 'canvas') return
      // this.initCanvas()
      const horizontalBarItemsCoords = this.getHorizontalBarItemsCoords()
      horizontalBarItemsCoords.forEach(([left, right], index) => {
        if (left <= e.clientX && e.clientX <= right) {
          this.pointerActive = index
        }
      })
    },
    handlerCanvasMouseLeave() {
      if (this.noData) return
      this.pointerActive = null
      // this.canvas.ctx.restore()
      this.initCanvas()
    },
  },
}
</script>

<style lang='scss' scoped>
.chart {
  max-width: 1260px;
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

  @media (max-width: 1350px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &__canvas-wrapper {
    position: relative;
    width: 100%;
    height: 278px;
    grid-column: 2/3;
    grid-row: 1/2;

    @media (max-width: 768px) {
      grid-column: unset;
      grid-row: unset;
    }
  }
}

.chart.dark {
  background-color: #262424;
  transition: 0.3s all;

  & .chart__placeholder-text {
    opacity: 0.1;
  }
}
</style>
