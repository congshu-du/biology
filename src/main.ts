import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Antd from "ant-design-vue";
import { router } from "./router/index";
import { createPinia } from "pinia";
import i18n from "./lang/index";
import "ant-design-vue/dist/reset.css";
import "flag-icons/css/flag-icons.min.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const app = createApp(App);

if (localStorage.getItem("theme")) {
  localStorage.removeItem("theme");
}

app.use(Antd).use(router).use(createPinia()).use(i18n).mount("#app");
