import { createI18n } from "vue-i18n";
import en from "./en.json";
import cn from "./cn.json";

const i18n = createI18n({
  locale: "cn", // 默认语言
  messages: { en, cn }, // 语言资源
});

export default i18n;
