import Icon from "@ant-design/icons-vue";
import { IconComponentProps } from "@ant-design/icons-vue/lib/components/Icon";
import { Component } from "vue";
import { svgNames } from "@/assets/svgs";

type IconType = Record<(typeof svgNames)[number], Component>;

const iconObj: IconType = {} as IconType;
for (const item of svgNames) {
  iconObj[item] = await import(`@/assets/svgs/${item}.svg`);
}

interface NewIconType extends IconComponentProps {
  type: (typeof svgNames)[number];
}

export const IconSvg = (props: NewIconType) => {
  return <Icon component={iconObj[props.type]} {...props} />;
};
