<template>
  <div id="app" :class="{ 'dark-mode': chartTheme === 'dark' }">
    <button class="theme-btn" @click="changeTheme">{{ chartTheme }}</button>
    <!-- <LineChart :theme="chartTheme" :counter="counter" /> -->
    <line-chart
      :data="data"
      :labelsRaw="labelsRaw"
      :counter="'шт.'"
      :theme="chartTheme"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      chartTheme: 'light',
      counter: '$',
      data: [
        {
          values: [73, 253, 573, 125, 1152, 1579, 2024, 2024, 59, 90, 174, 1107, 1100, 188, 181, 176, 198, 1111, 1112, 1102, 290, 287, 287, 298, 292, 2122, 286, 2104, 276, 89],
          labels: [
            {label: "01", desc: "01 янв 2023"},
            {label: "02", desc: "02 янв 2023"},
            {label: "03", desc: "03 янв 2023"},
            {label: "04", desc: "04 янв 2023"},
            {label: "05", desc: "05 янв 2023"},
            {label: "06", desc: "06 янв 2023"},
            {label: "07", desc: "07 янв 2023"},
            {label: "08", desc: "08 янв 2023"},
            {label: "09", desc: "09 янв 2023"},
            {label: 10, desc: "10 янв 2023"},
            {label: 11, desc: "11 янв 2023"},
            {label: 12, desc: "12 янв 2023"},
            {label: 13, desc: "13 янв 2023"},
            {label: 14, desc: "14 янв 2023"},
            {label: 15, desc: "15 янв 2023"},
            {label: 16, desc: "16 янв 2023"},
            {label: 17, desc: "17 янв 2023"},
            {label: 18, desc: "18 янв 2023"},
            {label: 19, desc: "19 янв 2023"},
            {label: 20, desc: "20 янв 2023"},
            {label: 21, desc: "21 янв 2023"},
            {label: 22, desc: "22 янв 2023"},
            {label: 23, desc: "23 янв 2023"},
            {label: 24, desc: "24 янв 2023"},
            {label: 25, desc: "25 янв 2023"},
            {label: 26, desc: "26 янв 2023"},
            {label: 27, desc: "27 янв 2023"},
            {label: 28, desc: "28 янв 2023"},
            {label: 29, desc: "29 янв 2023"},
            {label: 30, desc: "30 янв 2023"},
            {label: 31, desc: "31 янв 2023"}
          ]
        },
        {
          values: [73, 374, 833, 722, 1752, 1256, 1374, 1000, 259, 800, 174, 208, 576, 876, 372, 458, 699, 783, 800, 700, 800, 900, 1000, 1100, 1150, 1200, 1300, 1070, 737, 0, 500],
          labels: [
            {label: "01", desc: "01 янв 2023"},
            {label: "02", desc: "02 янв 2023"},
            {label: "03", desc: "03 янв 2023"},
            {label: "04", desc: "04 янв 2023"},
            {label: "05", desc: "05 янв 2023"},
            {label: "06", desc: "06 янв 2023"},
            {label: "07", desc: "07 янв 2023"},
            {label: "08", desc: "08 янв 2023"},
            {label: "09", desc: "09 янв 2023"},
            {label: 10, desc: "10 янв 2023"},
            {label: 11, desc: "11 янв 2023"},
            {label: 12, desc: "12 янв 2023"},
            {label: 13, desc: "13 янв 2023"},
            {label: 14, desc: "14 янв 2023"},
            {label: 15, desc: "15 янв 2023"},
            {label: 16, desc: "16 янв 2023"},
            {label: 17, desc: "17 янв 2023"},
            {label: 18, desc: "18 янв 2023"},
            {label: 19, desc: "19 янв 2023"},
            {label: 20, desc: "20 янв 2023"},
            {label: 21, desc: "21 янв 2023"},
            {label: 22, desc: "22 янв 2023"},
            {label: 23, desc: "23 янв 2023"},
            {label: 24, desc: "24 янв 2023"},
            {label: 25, desc: "25 янв 2023"},
            {label: 26, desc: "26 янв 2023"},
            {label: 27, desc: "27 янв 2023"},
            {label: 28, desc: "28 янв 2023"},
            {label: 29, desc: "29 янв 2023"},
            {label: 30, desc: "30 янв 2023"},
            {label: 31, desc: "31 янв 2023"}
          ]
        },
        // {
        //   values: [50, 90, 68, 79, 67, 51, 55, 81, 68, 15, 51, 66, 64, 61, 63, 54, 59, 61, 47, 48, 65, 62, 65, 51, 23, 65, 54, 70, 63, 68, 34],
        //   labels: [
        //     {label: "01", desc: "01 янв 2022"},
        //     {label: "02", desc: "02 янв 2022"},
        //     {label: "03", desc: "03 янв 2022"},
        //     {label: "04", desc: "04 янв 2022"},
        //     {label: "05", desc: "05 янв 2022"},
        //     {label: "06", desc: "06 янв 2022"},
        //     {label: "07", desc: "07 янв 2022"},
        //     {label: "08", desc: "08 янв 2022"},
        //     {label: "09", desc: "09 янв 2022"},
        //     {label: 10, desc: "10 янв 2022"},
        //     {label: 11, desc: "11 янв 2022"},
        //     {label: 12, desc: "12 янв 2022"},
        //     {label: 13, desc: "13 янв 2022"},
        //     {label: 14, desc: "14 янв 2022"},
        //     {label: 15, desc: "15 янв 2022"},
        //     {label: 16, desc: "16 янв 2022"},
        //     {label: 17, desc: "17 янв 2022"},
        //     {label: 18, desc: "18 янв 2022"},
        //     {label: 19, desc: "19 янв 2022"},
        //     {label: 20, desc: "20 янв 2022"},
        //     {label: 21, desc: "21 янв 2022"},
        //     {label: 22, desc: "22 янв 2022"},
        //     {label: 23, desc: "23 янв 2022"},
        //     {label: 24, desc: "24 янв 2022"},
        //     {label: 25, desc: "25 янв 2022"},
        //     {label: 26, desc: "26 янв 2022"},
        //     {label: 27, desc: "27 янв 2022"},
        //     {label: 28, desc: "28 янв 2022"},
        //     {label: 29, desc: "29 янв 2022"},
        //     {label: 30, desc: "30 янв 2022"},
        //     {label: 31, desc: "31 янв 2022"}
        //   ]
        // },
        // {
        //   values: [41, 1000, 500, 1500, 47, 44, 71, 62, 27, 34, 45, 29, 55, 66, 55, 52, 50, 56, 37, 59, 66, 73, 36, 29, 36, 38, 42, 98, 85, 39, 46],
        //   labels: [
        //     {label: "01", desc: "01 янв 2024"},
        //     {label: "02", desc: "02 янв 2024"},
        //     {label: "03", desc: "03 янв 2024"},
        //     {label: "04", desc: "04 янв 2024"},
        //     {label: "05", desc: "05 янв 2024"},
        //     {label: "06", desc: "06 янв 2024"},
        //     {label: "07", desc: "07 янв 2024"},
        //     {label: "08", desc: "08 янв 2024"},
        //     {label: "09", desc: "09 янв 2024"},
        //     {label: 10, desc: "10 янв 2024"},
        //     {label: 11, desc: "11 янв 2024"},
        //     {label: 12, desc: "12 янв 2024"},
        //     {label: 13, desc: "13 янв 2024"},
        //     {label: 14, desc: "14 янв 2024"},
        //     {label: 15, desc: "15 янв 2024"},
        //     {label: 16, desc: "16 янв 2024"},
        //     {label: 17, desc: "17 янв 2024"},
        //     {label: 18, desc: "18 янв 2024"},
        //     {label: 19, desc: "19 янв 2024"},
        //     {label: 20, desc: "20 янв 2024"},
        //     {label: 21, desc: "21 янв 2024"},
        //     {label: 22, desc: "22 янв 2024"},
        //     {label: 23, desc: "23 янв 2024"},
        //     {label: 24, desc: "24 янв 2024"},
        //     {label: 25, desc: "25 янв 2024"},
        //     {label: 26, desc: "26 янв 2024"},
        //     {label: 27, desc: "27 янв 2024"},
        //     {label: 28, desc: "28 янв 2024"},
        //     {label: 29, desc: "29 янв 2024"},
        //     {label: 30, desc: "30 янв 2024"},
        //     {label: 31, desc: "31 янв 2024"}
        //   ]
        // },
        // {
        //   values: [783, 367, 747, 2000, 1700, 679, 838, 143, 27, 34, 45, 29, 55, 66, 55, 52, 50, 56, 37, 59, 66, 73, 36, 29, 36, 38, 42, 98, 85, 39, 46],
        //   labels: [
        //     {label: "01", desc: "01 янв 2024"},
        //     {label: "02", desc: "02 янв 2024"},
        //     {label: "03", desc: "03 янв 2024"},
        //     {label: "04", desc: "04 янв 2024"},
        //     {label: "05", desc: "05 янв 2024"},
        //     {label: "06", desc: "06 янв 2024"},
        //     {label: "07", desc: "07 янв 2024"},
        //     {label: "08", desc: "08 янв 2024"},
        //     {label: "09", desc: "09 янв 2024"},
        //     {label: 10, desc: "10 янв 2024"},
        //     {label: 11, desc: "11 янв 2024"},
        //     {label: 12, desc: "12 янв 2024"},
        //     {label: 13, desc: "13 янв 2024"},
        //     {label: 14, desc: "14 янв 2024"},
        //     {label: 15, desc: "15 янв 2024"},
        //     {label: 16, desc: "16 янв 2024"},
        //     {label: 17, desc: "17 янв 2024"},
        //     {label: 18, desc: "18 янв 2024"},
        //     {label: 19, desc: "19 янв 2024"},
        //     {label: 20, desc: "20 янв 2024"},
        //     {label: 21, desc: "21 янв 2024"},
        //     {label: 22, desc: "22 янв 2024"},
        //     {label: 23, desc: "23 янв 2024"},
        //     {label: 24, desc: "24 янв 2024"},
        //     {label: 25, desc: "25 янв 2024"},
        //     {label: 26, desc: "26 янв 2024"},
        //     {label: 27, desc: "27 янв 2024"},
        //     {label: 28, desc: "28 янв 2024"},
        //     {label: 29, desc: "29 янв 2024"},
        //     {label: 30, desc: "30 янв 2024"},
        //     {label: 31, desc: "31 янв 2024"}
        //   ]
        // },
      ],
      labelsRaw: [
        {label: "01", desc: "01 янв 2023"},
        {label: "02", desc: "02 янв 2023"},
        {label: "03", desc: "03 янв 2023"},
        {label: "04", desc: "04 янв 2023"},
        {label: "05", desc: "05 янв 2023"},
        {label: "06", desc: "06 янв 2023"},
        {label: "07", desc: "07 янв 2023"},
        {label: "08", desc: "08 янв 2023"},
        {label: "09", desc: "09 янв 2023"},
        {label: 10, desc: "10 янв 2023"},
        {label: 11, desc: "11 янв 2023"},
        {label: 12, desc: "12 янв 2023"},
        {label: 13, desc: "13 янв 2023"},
        {label: 14, desc: "14 янв 2023"},
        {label: 15, desc: "15 янв 2023"},
        {label: 16, desc: "16 янв 2023"},
        {label: 17, desc: "17 янв 2023"},
        {label: 18, desc: "18 янв 2023"},
        {label: 19, desc: "19 янв 2023"},
        {label: 20, desc: "20 янв 2023"},
        {label: 21, desc: "21 янв 2023"},
        {label: 22, desc: "22 янв 2023"},
        {label: 23, desc: "23 янв 2023"},
        {label: 24, desc: "24 янв 2023"},
        {label: 25, desc: "25 янв 2023"},
        {label: 26, desc: "26 янв 2023"},
        {label: 27, desc: "27 янв 2023"},
        {label: 28, desc: "28 янв 2023"},
        {label: 29, desc: "29 янв 2023"},
        {label: 30, desc: "30 янв 2023"},
        {label: 31, desc: "31 янв 2023"}
      ],
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
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.theme-btn {
  width: 100%;
  max-width: 200px;
  padding: 10px 25px;
}
</style>
