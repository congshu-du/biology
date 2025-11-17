import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import svgLoader from "vite-svg-loader";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader({ defaultImport: "component" })],
  server: {
    host: "0.0.0.0",
    port: 8000,
    proxy: {
      "/cloudflare": {
        target: "https://api.cloudflare.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudflare/, ""),
      },
      "/api": {
        target: "http://192.168.200.81:9201", // 目标 API 地址
        changeOrigin: true, // 是否改变源
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  build: {
    target: "esnext",
  },
});
