<template>
  <!-- @mousemove="handlerMouseMove" 
  @mouseleave="handlerMouseLeave" -->
  <canvas v-if="!noData" class="canvas">
  </canvas>
  <div class="placeholder" v-else>
    <p class="placeholder__text notification">Нет данных</p>
  </div>
</template>
<script>
export default {
  name: 'LineChartCanvas',
  props: {
    noData: { type: Boolean, requried: true }
  },
  data() {
    return {
    }
  },
  methods: {
    handlerMouseMove(event) {
      this.$emit('mouse-move', event)
    },
    handlerMouseLeave() {
      this.$emit('mouse-leave')
    },
  }
}
</script>
<style lang='scss' scoped>
.canvas {
  width: 100%;
  height: 278px;
  grid-column: 2/3;
  grid-row: 1/2;

  @media (max-width: 500px) {
    grid-column: unset;
    grid-row: unset;
  }
}

.placeholder {
  width: 100%;
  height: 278px;
  grid-column: 2/3;
  grid-row: 1/2;
  position: relative;

  @media (max-width: 500px) {
    grid-column: unset;
    grid-row: unset;
  }

  &__text {
    font-family: 'Mail Sans Roman';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 155%;
    text-align: right;
    text-transform: uppercase;
  }
}
</style>