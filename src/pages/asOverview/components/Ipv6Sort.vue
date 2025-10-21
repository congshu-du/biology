<script lang="ts" setup>
import CEchart from "@/components/echart/Cechart";
import { computed } from "vue";
const option = computed(() => ({
  title: {
    text: "ipv6前缀统计",
    left: "center",
    top: "8px",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  // legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: "category",
    data: ["32", "29", "36", "40", "48"],
  },
  series: [
    {
      name: "2011",
      type: "bar",
      data: [18203, 23489, 29034, 104970, 131744],
    },
  ],
}));
</script>

<template>
  <CEchart class="h-full w-full" :option="option" autoresize />
</template>

<style scoped>
/* 这里是样式 */
</style>
