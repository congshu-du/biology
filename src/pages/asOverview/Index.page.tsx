import { Input, Segmented, theme } from "ant-design-vue";
import { defineComponent, ref, watchEffect } from "vue";
import styled from "@vue-styled-components/core";
import { RouterView, useRoute, useRouter } from "vue-router";
import _ from "lodash";

const items = [
  { label: "基本信息", value: "/as/base" },
  { label: "邻居关系", value: "/as/peer" },
  { label: "流量", value: "/as/traffic" },
  { label: "BGP消息", value: "/as/bgp" },
  { label: "全球连接态势", value: "/as/relationship" },
  { label: "国内连接态势", value: "/as/relationshipMap" },
];

export default defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const { token } = theme.useToken();
  const asNum = ref<string>((route.query.as as string) || "7497");
  const asNumber = ref<string>((route.query.as as string) || "7497");
  const ifShow = ref<boolean>(true);

  watchEffect(() => {
    if (route.query.as) {
      asNum.value = route.query.as as string;
    }
  });

  const Sdiv = styled.div`
    border-radius: 8px;
    border: 1px solid ${token.value.colorBorderSecondary};
  `;

  const getNumber = _.debounce((value: string) => {
    asNumber.value = value;
  }, 800);

  watchEffect(() => {
    getNumber(asNum.value);
  });

  watchEffect(() => {
    if (["4837", "9929", "10099"].includes(asNumber.value)) {
      ifShow.value = true;
    } else {
      ifShow.value = false;
      if (route.path === "/as/relationshipMap") {
        router.push("/as/base");
      }
    }
  });

  return () => (
    <div style={{}} class="flex flex-col h-full px-4">
      <Sdiv
        style={{ background: token.value.B2, border: `1px solid ${token.value.colorBorderSecondary}` }}
        class="p-2 mb-4"
      >
        <Input type="number" size="large" class="w-40 mr-4" v-model={[asNum.value, "value"]} />
        <Segmented
          size="large"
          onChange={(e: any) => router.push(e)}
          options={items.slice(0, items.length - 1 + Number(ifShow.value))}
          value={route.path}
        />
      </Sdiv>

      <RouterView>{({ Component }) => <Component value={asNumber.value} year={26} />}</RouterView>
    </div>
  );
});
