import Cechart from "@/components/echart/Cechart";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import datajson from "@/utils/4837to852.json";
import { Button, Input, Select, Space, theme } from "ant-design-vue";
import styled from "@vue-styled-components/core";
import { cloneDeep } from "lodash-es";
import { getAllPaths } from "@/services/as";

const targets = [
  {
    target_asn: 1,
  },
  {
    target_asn: 2,
  },
  {
    target_asn: 3,
  },
  {
    target_asn: 20,
  },
  {
    target_asn: 24,
  },
  {
    target_asn: 42,
  },
  {
    target_asn: 57,
  },
  {
    target_asn: 59,
  },
  {
    target_asn: 62,
  },
  {
    target_asn: 72,
  },
  {
    target_asn: 77,
  },
  {
    target_asn: 81,
  },
  {
    target_asn: 91,
  },
  {
    target_asn: 101,
  },
  {
    target_asn: 103,
  },
  {
    target_asn: 109,
  },
  {
    target_asn: 112,
  },
  {
    target_asn: 137,
  },
  {
    target_asn: 160,
  },
  {
    target_asn: 173,
  },
  {
    target_asn: 174,
  },
  {
    target_asn: 195,
  },
  {
    target_asn: 202,
  },
  {
    target_asn: 209,
  },
  {
    target_asn: 210,
  },
  {
    target_asn: 224,
  },
  {
    target_asn: 226,
  },
  {
    target_asn: 237,
  },
  {
    target_asn: 250,
  },
  {
    target_asn: 260,
  },
  {
    target_asn: 271,
  },
  {
    target_asn: 278,
  },
  {
    target_asn: 286,
  },
  {
    target_asn: 293,
  },
  {
    target_asn: 297,
  },
  {
    target_asn: 376,
  },
  {
    target_asn: 513,
  },
  {
    target_asn: 549,
  },
  {
    target_asn: 553,
  },
  {
    target_asn: 557,
  },
  {
    target_asn: 559,
  },
  {
    target_asn: 577,
  },
  {
    target_asn: 668,
  },
  {
    target_asn: 680,
  },
  {
    target_asn: 701,
  },
  {
    target_asn: 702,
  },
  {
    target_asn: 703,
  },
  {
    target_asn: 714,
  },
  {
    target_asn: 715,
  },
  {
    target_asn: 719,
  },
  {
    target_asn: 721,
  },
  {
    target_asn: 766,
  },
  {
    target_asn: 786,
  },
  {
    target_asn: 803,
  },
  {
    target_asn: 812,
  },
  {
    target_asn: 819,
  },
  {
    target_asn: 852,
  },
  {
    target_asn: 855,
  },
  {
    target_asn: 1030,
  },
  {
    target_asn: 1100,
  },
  {
    target_asn: 1101,
  },
  {
    target_asn: 1103,
  },
  {
    target_asn: 1120,
  },
  {
    target_asn: 1126,
  },
  {
    target_asn: 1136,
  },
  {
    target_asn: 1140,
  },
];

const startOption = ["10099", "4837", "9929"];

const PathChart = defineComponent(() => {
  const pathId = ref();
  const startAS = ref("4837");
  const endAs = ref(1);
  const { token } = theme.useToken();
  const lastData = reactive({
    origin: [],
    data: [],
    lines: [],
  });

  watchEffect(async () => {
    const res = await getAllPaths({
      sourceAsn: startAS.value,
      targetAsn: endAs.value,
      dataYear: 2024,
    });
    if (res.code === 200) {
      const list = res.data.paths ?? [];

      const nodes: { name: string; category: number }[] = [];
      const lines: { source: string; target: string; id: string }[] = [];

      list.forEach((n) => {
        n.forEach((w, i) => {
          const name = w + "";
          if (i !== 0 && lines.findIndex((t) => t.id === `${n[i - 1]}-${w}`) === -1) {
            lines.push({ source: n[i - 1] + "", target: name, id: `${n[i - 1]}-${w}` });
          }
          const info = nodes.find((t) => t.name === name);
          if (!info) {
            nodes.push({ name: name, category: i + 1 });
          } else if (info.category < i + 1) {
            info.category = i + 1;
          }
        });
      });

      nodes.sort((a, b) => a.category - b.category);

      let xnum = 0;

      const data = nodes.map((n, i) => {
        if (i === 0 || nodes[i - 1].category !== n.category) {
          xnum = 0;
        } else {
          xnum += 1;
        }
        return {
          name: n.name,
          category: n.category,
          x: n.category * 300,
          y: (Math.ceil(xnum / 2) - 0) * 200 * (xnum % 2 === 0 ? 1 : -1),
        };
      });
      lastData.origin = list;
      lastData.data = data;
      lastData.lines = lines;
      pathId.value = undefined;
    }
  });

  const option = computed(() => {
    const edges = cloneDeep(lastData.lines);
    if (pathId.value) {
      const asList = pathId.value.split("-");
      asList.forEach((n, i) => {
        if (i !== 0) {
          const id = `${asList[i - 1]}-${n}`;
          const info = edges.find((x) => x.id === id);
          if (info) {
            info.lineStyle = { color: token.value.red, opacity: 1, width: 3 };
          }
        }
      });
    }
    return {
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          type: "graph",
          layout: "none",
          // symbolSize: 50,
          roam: true,
          label: {
            show: true,
          },
          symbol: "circle",
          symbolSize: [60, 40],
          edgeSymbol: ["circle", "arrow"],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 20,
          },
          itemStyle: {
            color: token.value["geekblue-4"],
          },
          tooltip: {
            show: false,
          },
          data: lastData.data,
          links: edges,
          lineStyle: {
            opacity: 0.7,
            width: 1,
            curveness: 0,
            color: token.value["cyan-2"],
          },
        },
      ],
    };
  });

  const SContainer = styled.div`
    /* border-radius: 8px;
      border: 1px solid ${token.value.colorBorder};
      background-color: ${token.value.colorBgBase}; */
    height: 100%;
    flex: 1;
  `;

  const Wrapper = styled.div`
    /* background-color: ${token.value.B2}; */
    border-top: 1px solid ${token.value.colorBorder};
    height: 100%;
  `;

  const LeftContainer = styled.div`
    /* border-radius: 8px; */
    border-right: 1px solid ${token.value.colorBorder};
    /* background-color: ${token.value.colorBgBase}; */
    height: 100%;
    margin-right: 16px;
    /* padding: 0 8px; */
  `;

  const Item = styled.div<{ checked: boolean }>`
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border-radius: 4px;
    /* border-bottom: 1px solid ${token.value.colorBorderSecondary}; */
    background-color: ${token.value.colorFillQuaternary};
    padding: 0 8px;
  `;

  return () => (
    <Wrapper
      style={{ height: "calc(100vh - 64px)", minHeight: "800px" }}
      class="h-full w-full flex flex-col overflow-hidden"
    >
      <div class="flex-1  pt-0 flex">
        <LeftContainer class="w-[300px]">
          <Item
            style={{ background: "none", borderRadius: 0, borderBottom: `1px solid ${token.value.colorBorder}` }}
            class="text-base font-semibold"
          >
            起始AS:{" "}
            <Select
              v-model={[startAS.value, "value"]}
              options={startOption.map((n) => ({ value: n, label: n }))}
              class="w-20"
            />
            <span class={"ml-2"}>目标AS: </span>
            <Select
              v-model={[endAs.value, "value"]}
              options={targets.map((n) => ({ value: n.target_asn, label: n.target_asn }))}
              class="w-20"
            />
          </Item>
          <div class="px-2">
            {lastData.origin.map((n) => {
              const id = n.join("-");
              const name = n.join(" -> ");
              return (
                <Item
                  class="cursor-pointer truncate mt-1"
                  title={name}
                  style={{ background: pathId.value === id ? token.value.colorPrimary : "" }}
                  key={id}
                  onClick={() => (pathId.value = id)}
                >
                  {name}
                </Item>
              );
            })}
          </div>
        </LeftContainer>
        <SContainer>
          <Cechart
            class="h-full w-full"
            // onClick={(params) => {
            //   if (params.dataType === "node") {
            //     window.open(`/as/base?as=${params.data.name}`);
            //   }
            // }}
            option={option.value}
            autoresize
          />
        </SContainer>
      </div>
    </Wrapper>
  );
});

export default PathChart;
