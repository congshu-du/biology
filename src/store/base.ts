import { defineStore } from "pinia";

export const useModeStatus = defineStore("modeStatus", {
  state: () => {
    return {
      isDark: localStorage.getItem("theme") === "dark",
    };
  },
});

export const useFullScreen = defineStore("fullScreen", {
  state: () => {
    return {
      full: false,
    };
  },
});
