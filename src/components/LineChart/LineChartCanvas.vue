<template>
  <canvas 
    class="canvas"       
    @mousemove="handlerMouseMove" 
    @mouseleave="handlerMouseLeave">
  </canvas>
</template>
<script>
export default {
  name: 'LineChartCanvas',
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
</style>