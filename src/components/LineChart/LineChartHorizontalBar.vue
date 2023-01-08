<template>
  <div :class="[ 'horizontal-bar', theme ]">
    <span 
      :class="[ 'horizontal-bar__item', { active: pointerActive === index } ]" 
      v-for="(item, index) of data"
    >
        {{ item }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'LineChartLeftBar',
  props: {
    data: { type: Array, required: true },
    theme: { type: String, required: true },
    pointerActive: { required: true },
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style lang='scss' scoped>
  .horizontal-bar {
    display: flex;
    // font-family: "Mail Sans Roman";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 155%;
    text-align: right;
    color: #A7A7A7;
    grid-column: 2/3;
    grid-row: 2/3;
    justify-content: space-between;
    padding-top: 8.5px;

    &__item {
      flex-grow: 1;
      text-align: center;

      &.active {
        color: #E83D46;
      }
    }
  }
  .horizontal-bar.dark {

    &__item {

    }
  }
</style>