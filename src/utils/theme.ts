import { theme } from "ant-design-vue";
import { MapToken } from "ant-design-vue/es/theme/interface";
import { darkConfig, lightConfig, ConfigKeyType } from "antd-token-extra-config";

export const themeType = localStorage.getItem("theme") || "light";

const { defaultAlgorithm, darkAlgorithm, defaultSeed } = theme;

// 使用与国家生物信息中心门户（CNCB）相近的主色调，保持 Ant Design 和 Tailwind 的色彩一致
const CNCB_PRIMARY = "#1a59b0";

export const token = (
  themeType === "light"
    ? defaultAlgorithm({ ...defaultSeed, colorPrimary: CNCB_PRIMARY, ...lightConfig })
    : darkAlgorithm({ ...defaultSeed, colorPrimary: CNCB_PRIMARY, ...darkConfig })
) as MapToken & { [key in ConfigKeyType]: string };

export const darkToken = darkAlgorithm({ ...defaultSeed, colorPrimary: CNCB_PRIMARY, ...darkConfig }) as MapToken & {
  [key in ConfigKeyType]: string;
};
