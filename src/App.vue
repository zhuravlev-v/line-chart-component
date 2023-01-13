<template>
  <div id="app">
    <button @click="changeTheme">{{ chartTheme }}</button>
    <LineChart :theme="chartTheme" :counter="counter" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      chartTheme: 'light',
      counter: '$',
    }
  },
  methods: {
    changeTheme() {
      this.chartTheme = this.chartTheme === 'light' ? 'dark' : 'light'
    }
  }
}
</script>

<style scoped>
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
