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
    <div v-for="(item, i) of coordsAxisY"
      @mousemove="mouseMoveTooltip($event, i)" 
      @mouseleave="mouseLeaveTooltip"
      ref="tooltip" 
      class="tooltip__tooltip"
      :class="{ active : activeTooltip === i }" 
      :style="{ top: calcTooltipStyle(i).top, left: calcTooltipStyle(i).left }">
      <span class="tooltip__value">{{ data[i].values[active] }}</span>
      <span class="tooltip__label">{{ data[i].labels[active]?.desc }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: { type: Number, required: false },
    data: { type: Array, required: false },
    coords: { type: Array, required: true },
    coordsAxisX: { type: Array },
    coordsAxisY: { type: Array },
    canvasRect: { type: Object, required: false },
  },
  data() {
    return {
      activeTooltip: null,
      tooltipSetting: {
        paddingLeft: 9,
      },
    }
  },
  computed: {
    isActive() {
      return this.active !== null && !this.coords.includes(null)
    },
  },
  methods: {
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
    calcTooltipStyle(index) {
      const coords = this.coords
      const paddingLeft = this.tooltipSetting.paddingLeft
      let height = 0
      const tooltip = document.querySelectorAll('.tooltip__tooltip')[index]
      if (tooltip) {
        height = parseFloat(getComputedStyle(tooltip).height).toFixed(2)
      }
      const top = this.coordsAxisY[index][this.active] - height
      return {
        left: coords[0] + paddingLeft + 'px',
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
    & .tooltip__tooltip {
      opacity: 1;
    }
    & .tooltip__dot {
      opacity: 1;
    }
    & .tooltip__line {
      opacity: 1;
    }
  }

  &__tooltip {
    position: absolute;
    transition: 0.3s all;
    opacity: 0;
    background-color: #FFFFFF;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding: 14px 15px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 105px;
    min-height: 67px;
    z-index: 5;

    &.active {
      z-index: 6;
    }
  }

  &__value {
    font-weight: 600;
    font-size: 16px;
    color: #262424;
  }

  &__label {
    font-weight: 400;
    font-size: 12px;
    letter-spacing: -0.04em;
    color: #A7A7A7;
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
</style>