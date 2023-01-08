<template>
  <div id="app">
    <LineChart :theme="chartTheme" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      chartTheme: 'light'
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
