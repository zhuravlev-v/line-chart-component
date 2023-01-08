<template>
  <div :class="[ 'left-bar', theme ]">
    <span class="left-bar__item" v-for="dig of formattedDigits">{{ dig }}</span>
  </div>
</template>

<script>
export default {
  name: 'LineChartLeftBar',
  props: {
    data: { type: Array, required: true },
    theme: { type: String, required: true },
    itemsNumber: { type: Number, required: false, default: 5 },
  },
  computed: {
    formattedDigits() {
      let digits = this.data
      digits = digits.sort((a, b) => a - b)
      digits = this.truncArrayTo(digits, this.itemsNumber)
      return digits.map(digit => this.replaceThousands(digit))
    },
  },
  methods: {
    replaceThousands(number) {
      if (isNaN(number)) throw new Error(number + " is not a Number!");
      let num = Math.trunc(number)

      let digitСapacity = {
        "0": "",
        "1": "k",
        "2": "kk",
        "3": "kkk",
      };

      let thousands = Math.floor((("" + num).length - 1) / 3);

      let coef = 1000 ** thousands;

      if (digitСapacity[thousands] > 2) {
        return (num / coef).toFixed(1) + digitСapacity[thousands]
      } else {
        return Math.trunc((num / coef).toFixed(1)) + digitСapacity[thousands]
      }
    },
    truncArrayTo(arr, div) {
      const arrMax = arr[arr.length - 1]
      const step = arrMax / div
      const arrCore = []

      for (let i = 1; i <= div - 1; i++) {
        arrCore.push(step * i)
      }

      return [0, ...arrCore, arrMax]
    }
  },
}
</script>

<style lang='scss' scoped>
  .left-bar {
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    // font-family: 'Mail Sans Roman';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 155%;
    text-align: right;
    color: #A7A7A7;
    max-width: 31px;
    grid-column: 1/2;
    grid-row: 1/2;

    &__item {

    }
  }
  .left-bar.dark {

    &__item {

    }
  }
</style>