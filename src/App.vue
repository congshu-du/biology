<script setup lang="ts">
// import { theme } from "ant-design-vue";
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import en_GB from "ant-design-vue/es/locale/en_GB";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { theme } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { darkConfig, lightConfig, ConfigKeyType } from "antd-token-extra-config";

dayjs.locale("zh-cn");

const { locale } = useI18n();

const themeType = localStorage.getItem("theme") || "light";
</script>

<template>
  <a-config-provider
    :locale="locale === 'en' ? en_GB : zhCN"
    :theme="{
      algorithm: themeType === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      token: {
        colorPrimary: '#086ec1',
        fontFamily: 'HYQiHei55J',

        ...(themeType === 'light' ? lightConfig : darkConfig),
        // colorBg1: '#050505',
        // colorBg2: '#161617',
        // colorBg3: '#28282A',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>
