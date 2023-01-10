<template>
  <div :class="[ 'chart', theme ]">
    <LineChartLeftBar 
      ref="LineChartLeftBar" 
      :data="[...fact, ...plan]" 
      :theme="theme" 
      :itemsNumber="canvas.leftBarNumber" />
    <canvas 
      ref="canvas" 
      class="chart__canvas" 
      @mousemove="handlerCanvasMouseMove" 
      @mouseleave="handlerCanvasMouseLeave" />
    <LineChartHorizontalBar
      ref="LineChartHorizontalBar"
      :data="labels" 
      :theme="theme" 
      :pointerActive="pointerActive" />
  </div>
</template>

<script>
import LineChartLeftBar from '@/components/LineChart/LineChartLeftBar.vue';
import LineChartHorizontalBar from '@/components/LineChart/LineChartHorizontalBar.vue';

export default {
  name: 'LineChart',
  components: { LineChartLeftBar, LineChartHorizontalBar },
  props: {
    theme: { 
      type: String, 
      required: false, 
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].includes(value)
      }
    }
  },
  data: () => ({
    fact: [85865, 38000, 25000, 87553, 70000, 10000, 169985, 15000, 15433, 5500, 3000, 387544],
    plan: [80865, 30000, 19000, 89553, 80000, 18000, 169985, 412586, 15433, 5500, 3000, 387544],
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',],
    counter: 'шт.',
    graphChartColors: ['#E83D46', "#00000054", "#F9A620", "#005FA7", "#00BFB9", "#FD2D91"],
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
  },
  methods: {
    initCanvas() {
      this.canvas.canvas = this.$refs.canvas
      this.canvas.ctx = this.canvas.canvas.getContext('2d')
      this.setCanvasDimensions(this.canvas.canvas)
      this.drawDashMarkup()
      this.drawLineChart(this.fact)
    },
    setCanvasDimensions(canvas) {
      const canvasStyle = getComputedStyle(canvas)
      const DPI_WIDTH = parseFloat(canvasStyle.width) * 2
      const DPI_HEIGHT = parseFloat(canvasStyle.height) * 2
      canvas.width = DPI_WIDTH
      canvas.height = DPI_HEIGHT
      this.canvas.DPI_WIDTH = DPI_WIDTH
      this.canvas.DPI_HEIGHT = DPI_HEIGHT
    },
    drawDashMarkup() {
      const drawFirstDash = () => {
        ctx.moveTo(0, leftBarItemHeight_DPI / 2) //передвигаем перо
        ctx.lineTo(this.canvas.DPI_WIDTH, leftBarItemHeight_DPI / 2) //рисуем линию
        ctx.stroke()
      }
      const drawLastDash = () => {
        ctx.moveTo(0, this.canvas.DPI_HEIGHT - lineWidth)
        ctx.lineTo(this.canvas.DPI_WIDTH, this.canvas.DPI_HEIGHT - lineWidth)
        ctx.stroke()
      }
      const drawCoreDash = () => {
        for (let i = 1; i < this.canvas.leftBarNumber; i++) {
          const y = leftBarItemHeight_DPI * i + leftBarItemHeight_DPI / 2 + leftBarItemGap_DPI * i
          ctx.moveTo(0, y)
          ctx.lineTo(this.canvas.DPI_WIDTH, y)
          ctx.stroke()
        }
      }
      
      const ctx = this.canvas.ctx
      const leftBar = this.$refs.LineChartLeftBar.$el
      const leftBarItemHeight_DPI = parseFloat(getComputedStyle(leftBar.children[0]).height).toFixed(2) * 2
      const leftBarItemGap_DPI = ((parseFloat(getComputedStyle(leftBar).height).toFixed(2) - leftBarItemHeight_DPI / 2 * leftBar.children.length) / this.canvas.leftBarNumber).toFixed(2) * 2
      
      ctx.beginPath()
      ctx.strokeStyle = this.theme === 'light' ? '#EDEDED' : '#575757'
      const lineWidth = 1
      ctx.lineWidth = lineWidth // толщина линии
      const dashWidth = 8 * 2
      const dashGap = 7 * 2

      ctx.setLineDash([dashWidth, dashGap])

      drawFirstDash()
      drawLastDash()
      drawCoreDash()

      ctx.closePath()
    },
    drawLineChart(data) {
      const ctx = this.canvas.ctx
      const maxPoint = Math.max(...data)
      const ratio = this.canvas.DPI_HEIGHT / maxPoint
      const axisY = data.map(item => this.canvas.DPI_HEIGHT - item * ratio)
      const axisX = this.getCoordsAxisX()

      for (let i = 0; i < data.length; i++) {
        if (isFinite(i + 1)) {
          ctx.beginPath()
          ctx.setLineDash([])
          ctx.moveTo((axisX[i] * 2), axisY[i])
          ctx.lineTo((axisX[i + 1] * 2), axisY[i + 1])
          ctx.strokeStyle = 'red'
          ctx.lineWidth = 3
          ctx.stroke()
        }
      }
    },
    getCoordsAxisX() {
      const axisX = []

      for (let i = 0; i < this.horizontalBarItemsWidth.length; i++) {
        let arr = []
        const itemsWidthReducedArray = this.horizontalBarItemsWidth.slice(0, i + 1)

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
    handlerCanvasMouseMove(e) {
      this.horizontalBarItemsCoords.forEach(([left, right], index) => {
        if (left <= e.clientX && e.clientX <= right) {
          this.pointerActive = index
        }
      })
    },
    handlerCanvasMouseLeave() {
      this.pointerActive = null
    },
  },
  computed: {
    horizontalBarItemsCoords() {
      const horizontalBar = this.$refs.LineChartHorizontalBar.$el
      const horizontalBarItemsCoords = Array.from(horizontalBar.children).map(item => {
        return [item.getBoundingClientRect().left, item.getBoundingClientRect().right]
      })
      return horizontalBarItemsCoords
    },
    horizontalBarItemsWidth() {
      const horizontalBar = this.$refs.LineChartHorizontalBar.$el
      return Array.from(horizontalBar.children).map(item => {
        return parseFloat(getComputedStyle(item).width).toFixed(2)
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.chart {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  &__canvas {
    width: 100%;
    height: 278px;
    grid-column: 2/3;
    grid-row: 1/2;
  }
}

.chart.dark {
  background-color: #262424;
}
</style>