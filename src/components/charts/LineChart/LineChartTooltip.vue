<template>
  <div :class="['tooltip', { active: isActive }]">
    <span ref="dot" class="tooltip__dot" :style="{ top: calcDotStyle().top, left: calcDotStyle().left }">
      <i class="tooltip__dot-inner"></i>
    </span>
    <div ref="line" class="tooltip__line"
      :style="{
        height: calcLineStyle().height,
        top: calcLineStyle().top,
        left: calcLineStyle().left,
      }">
    </div>
    <div class="tooltip__tooltip-wrapper"
      ref="tooltipWrapper"
      :style="{ left: calcTooltipWrapperPos(0).left, top: calcTooltipWrapperPos(0).top }"
    >
      <!-- :style="{ top: tooltipsCoordsY?.[i]?.[active], left: calcTooltipStyle(i).left }" -->
      <div v-for="(item, i) of coordsAxisY"
        @mousemove="mouseMoveTooltip($event, i)"
        @mouseleave="mouseLeaveTooltip"
        ref="tooltip"
        class="tooltip__tooltip"
        :class="{ active : activeTooltip === i, shown: data[i].values[active] !== undefined }"
      >
        {{ this }}
        <span class="tooltip__value">{{ getValueString(i) }}</span>
        <span class="tooltip__label">{{ data[i].labels[active]?.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import spacesInDigit from '@/assets/script/spacesInDigit';

export default {
  props: {
    active: { type: Number, required: false },
    data: { type: Array, required: false },
    // coords: { type: Array, required: true },
    coordsAxisX: { type: Array },
    coordsAxisY: { type: Array },
    canvasRect: { type: Object, required: false },
    counter: { type: [String, Array], required: false, default: ' ' },
    type: { type: String, required: false, default: 'money' },
  },
  data() {
    return {
      activeTooltip: null,
      tooltipSetting: {
        paddingLeft: 9,
      },
      tooltipsCoordsY: []
    }
  },
  mounted() {
    this.setTooltipsCoordsY()
  },
  computed: {
    isActive() {
      return this.active !== null && !this.coords.includes(null)
    },
    coords() {
      const axisYIndexLine = this.coordsAxisY.findIndex(item => item[this.active])

      return [
        this.coordsAxisX?.[this.active] || null,
        this.coordsAxisY[axisYIndexLine]?.[this.active] || null
      ]
    },
    tooltips() {
      return this?.$refs?.tooltip
    },
  },
  methods: {
    setTooltipsCoordsY() {
      const tooltips = this?.$refs?.tooltip

      if (!tooltips) return

      tooltips.forEach((tooltip, index) => {
        const tooltipHeight = tooltip.getBoundingClientRect().height
        const arr = []

        this.coordsAxisY[index].forEach(coordY => {
          const top = (coordY - tooltipHeight) + 'px'
          arr.push(top)
        })

        this.tooltipsCoordsY[index] = arr
      })
    },
    spacesInDigit,
    getValueString(i) {
      if (this.type === 'default') {
        const value = this.data[i].values[this.active]

        if (typeof this.counter === 'string') {
          return  !isNaN(parseFloat(value)) ? this.spacesInDigit(value, true) + `\u00A0${this.counter}` : 'нет данных'
        }
        else if (Array.isArray(this.counter)) {
          return  !isNaN(parseFloat(value)) ? this.spacesInDigit(value, true) + `\u00A0${this.counter[i]}` : 'нет данных'
        }

      }
      else if (this.type === 'percent') {
        const valuePercent = this.data[i].valuesPercent[this.active]
        return valuePercent ? valuePercent + `\u00A0%` : 'нет данных'
      }
      else if (this.type === 'costMain') {
        if(i !== 0){
          const valuePercent = this.data[i].valuesPercent[this.active]
          return valuePercent ? valuePercent + `\u00A0${this.counter[i]}` : 'нет данных'
        } else{
          const value = this.data[i].values[this.active]

          if (typeof this.counter === 'string') {
            return  !isNaN(parseFloat(value)) ? this.spacesInDigit(value, true) + `\u00A0${this.counter}` : 'нет данных'
          }
          else if (Array.isArray(this.counter)) {
            return  !isNaN(parseFloat(value)) ? this.spacesInDigit(value, true) + `\u00A0${this.counter[i]}` : 'нет данных'
          }
        }
      }

      else if (this.type === 'weather') {
        const value = this.data[i].values[this.active]
          return  !isNaN(parseFloat(value)) ? this.spacesInDigit(value, true) + `\u00A0${this.counter}` : 'нет данных'
      }
    },
    calcLineStyle() {
      const coords = this.coords
      const canvasRect = this.canvasRect
      const height = canvasRect.height - canvasRect.pBottom - coords[1]
      return {
        height: height > 0 ? height + 'px' : null,
        left: this.coords[0] - 0.5 + 'px',
        top: coords[1] + 'px',
        bottom: (canvasRect.height - this.coords[1]) + 'px',
      }
    },
    calcDotStyle() {
      const coords = this.coords
      const height = this.$refs.dot ? parseFloat(getComputedStyle(this.$refs.dot).height).toFixed(2) : 0
      const width = this.$refs.dot ? parseFloat(getComputedStyle(this.$refs.dot).width).toFixed(2) : 0
      return {
        left: coords[0] - (width / 2) + 'px',
        top: coords[1] - (height / 2) + 'px',
        bottom: (this.canvasRect.height - coords[1]) + 'px'
      }
    },
    calcTooltipWrapperPos(index) {
      const canvasWrapper = document.querySelector('.chart__canvas-wrapper')
      const canvasCoords = canvasWrapper.getBoundingClientRect()
      const canvasLeft = canvasCoords.left
      const coords = this.coords
      const paddingLeft = this.tooltipSetting.paddingLeft
      const tooltipWrapper = this.$refs?.tooltipWrapper
      let left = 0

      if (tooltipWrapper) {
        const tooltipWrapperWidth = tooltipWrapper.clientWidth
        const nextTooltipRight = canvasLeft + coords[0] + paddingLeft + tooltipWrapperWidth
        if (nextTooltipRight > window.innerWidth) {
          left = coords[0] - paddingLeft - tooltipWrapperWidth
        }
        else {
          left = coords[0] + paddingLeft
        }
      }


      //  coordsAxisX[active] + 'px'

      const top = this.coordsAxisY[index][this.active] - 67 - 15

      return {
        top: top + 'px',
        left: left + 'px',
      }
    },
    calcTooltipStyle(index) {
      const canvasWrapper = document.querySelector('.chart__canvas-wrapper')
      const canvasCoords = canvasWrapper.getBoundingClientRect()
      const canvasLeft = canvasCoords.left
      const coords = this.coords
      const paddingLeft = this.tooltipSetting.paddingLeft
      let height = 0
      let width = 0
      let left = 0
      const tooltip = this?.$refs?.tooltip?.[index]

      if (tooltip) {
        height = parseFloat(getComputedStyle(tooltip).height).toFixed(2)
        width = Number(parseFloat(getComputedStyle(tooltip).width).toFixed(2))
        const nextTooltipRight = canvasLeft + coords[0] + paddingLeft + width
        if (nextTooltipRight > window.innerWidth) {
          left = coords[0] - paddingLeft - width
        }
        else {
          left = coords[0] + paddingLeft
        }
      }

      const top = this.coordsAxisY[index][this.active] - height

      return {
        // left: coords[0] + paddingLeft + 'px',
        // left: left + 'px',
        left: '0px',
        top: top + 'px',
        bottom: (this.canvasRect.height - coords[1]) + 'px'
      }
    },
    mouseMoveTooltip(e, index) {
      this.activeTooltip = index
    },
    mouseLeaveTooltip(e) {
      this.activeTooltip = null
    },
  }
}
</script>

<style lang='scss' scoped>
.tooltip {
  width: 1px;
  height: 1px;
  position: relative;
  top: 0px;
  left: 0px;
  font-family: 'Mail Sans Roman';
  font-style: normal;
  position: absolute;
  transition: 0.3s all;
  opacity: 0;
  &.active {
    opacity: 1;
    // & .tooltip__tooltip {
    //   opacity: 1;
    // }
    & .tooltip__dot {
      opacity: 1;
    }
    & .tooltip__line {
      opacity: 1;
    }
  }

  &__tooltip-wrapper {
    transition: 0.3s all;
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  &__tooltip {
    // position: absolute;
    transition: 0.3s all;
    opacity: 0;
    background-color: #FFFFFF;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding: 14px 15px 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 105px;
    // min-height: 67px;
    height: 67px;
    z-index: 5;

    &.shown {
      opacity: 1;
    }

    &.active {
      z-index: 6;
    }
  }

  &__value {
    font-weight: 600;
    font-size: 16px;
    color: #262424;
    white-space: nowrap;
  }

  &__label {
    font-weight: 400;
    font-size: 12px;
    letter-spacing: -0.04em;
    color: #A7A7A7;
    white-space: nowrap;
  }

  &__dot {
    position: absolute;
    display: block;
    background-color: #FFFFFF;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.25);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    opacity: 0;
    transition: 0.3s all;
    z-index: 1;

    &-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      background: #E83D46;
      box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
      border-radius: 50%;
      width: 6px;
      height: 6px;
    }
  }

  &__line {
    width: 1px;
    background-image: linear-gradient(360deg, #e83d46, #e83d46 75%, transparent 75%, transparent 100%);
    background-size: 1px 20px;
    border: none;
    position: absolute;
    opacity: 0;
    transition: 0.3s all;
  }
}

.dark-mode {
  & .tooltip__tooltip {
    background-color: #262424;
  }
  & .tooltip__value {
    color: #FFFFFF;
  }
}
</style>
