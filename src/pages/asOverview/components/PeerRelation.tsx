import Cechart, { colorList2 } from "@/components/echart/Cechart";
// import { token } from "@/utils/theme";
// import { token } from "@/utils/theme";

import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const Ipv4PeerRelation = defineComponent<{
  data: {
    nodes: { name: string; category: string }[];
    title: string;
    key: string;
    links: { source: string; target: string }[];
  };
}>(
  (props) => {
    const legend = ref("");
    const router = useRouter();
    const option = computed(() => {
      return {
        legend: {
          top: "56px",
          orient: "vertical",
          data: ["provider", "peer", "customer"],
          selected: legend.value,
          right: "26px",
        },
        title: {
          top: "14px",
          text: props.data.title,
          // textStyle: {
          //   fontSize: 36,
          // },

          // text: `${props.type} Peer(${props.as})-年`,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },

        series: [
          {
            type: "graph",
            layout: "force",
            // symbolSize: 30,
            roam: "move",
            label: {
              show: true,
            },
            force: {
              repulsion: 400, // 可以尝试减少此值
              gravity: 0.5, // 增大重力值，节点更容易聚拢
              edgeLength: [50, 100], // 边长度，减少范围
              layoutAnimation: false, // 关闭布局动画，加速显示
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [2, 6],
            edgeLabel: {
              show: false,
              // formatter: "{c}",
              fontSize: 12,
            },
            tooltip: {
              formatter: (params) => {
                if (params.dataType === "node") {
                  const info = params.data;
                  const country = info?.iso?.toLocaleLowerCase();
                  return `<div>
                    <div class="mb-1"><span style="display: inline-block; width: 76px;">AS号:</span><a>${info?.name}</a></div>
                    <div class="mb-1"><span style="display: inline-block; width: 76px;">AS名称:</span><a>${info?.asnName}</a></div>
                    <div class="mb-1"><span style="display: inline-block; width: 76px;">AS邻居数:</span><a>${info?.degree}</a></div>
                    <div class="mb-1"><span style="display: inline-block; width: 76px;">国家/地区:</span><a><span class="fi fi-${country}"></span><span class="ml-1">${info?.country === "Taiwan" ? "China-Taiwan" : info?.country || ""}<span></a></div>
                  </div>`;
                }
              },
            },
            data: (() => {
              // const centerNode = {
              //   name: props.as,
              //   id: props.as,
              //   // x: 0,
              //   // y: 0,
              //   symbolSize: 80,
              //   itemStyle: { color: token["red-7"] },
              //   category: "center",
              // };

              // const radius = 300;
              const result = [
                // centerNode,
                ...props.data.nodes.slice(0, 500).map((node, index) => ({
                  ...node,
                  // symbolSize: 50,
                  id: node.name,
                  // x: radius * Math.cos((2 * Math.PI * index) / otherNodes.length),
                  // y: radius * Math.sin((2 * Math.PI * index) / otherNodes.length),
                })),
              ];
              return result;
            })(),
            links: props.data.links.slice(0, 500),
            categories: [
              { name: "center", itemStyle: { color: colorList2[0] } },
              { name: "peer", itemStyle: { color: colorList2[2] } },
              { name: "provider", itemStyle: { color: colorList2[1] } },

              { name: "customer", itemStyle: { color: colorList2[3] } },
            ],
            lineStyle: {
              opacity: 0.9,
              width: 1,
              curveness: 0.1,
            },
          },
        ],
      };
    });
    return () => (
      <Cechart
        onLegendselectchanged={(aa) => {
          legend.value = aa.selected;
        }}
        onClick={(info) => {
          if (info.dataType === "node" && info.name) {
            router.push("/as/peer?as=" + info.name);
          }
        }}
        key={props.data.key + JSON.stringify(legend.value)}
        class="h-full w-full"
        option={option.value}
        autoresize
      />
    );
  },
  { props: ["data"] },
);

export default Ipv4PeerRelation;
