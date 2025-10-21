import Cechart from "@/components/echart/Cechart";
import styled, { tw } from "@vue-styled-components/core";
import { Col, Row, theme } from "ant-design-vue";
import { computed, defineComponent, reactive, watchEffect } from "vue";
// import { getAsList } from "@/services/as";
// import _ from "lodash-es";

// import { getPathList } from "@/services/as";

const RelationshipChart = defineComponent(
  (props) => {
    const { token } = theme.useToken();

    const data = reactive({
      nodes: [],
      lines: [],
      asObj: {},
    });

    // const addPeer = async (asns: string) => {
    //   const asArr = asns.split("-").length;
    //   const _nodes = _.cloneDeep(data.nodes);
    //   const _asObj = _.cloneDeep(data.asObj);
    //   const lines = [];
    //   Object.values(outputData).forEach((item) => {
    //     const id = item.join("-");
    //     if (
    //       item.length === asArr + 1 &&
    //       id.startsWith(asns) &&
    //       _nodes.findIndex((t) => t.id2 === id) === -1 &&
    //       lines.length < 100
    //     ) {
    //       const len = item.length;
    //       _nodes.push({
    //         id2: id,
    //         name: item[len - 1],
    //         category: len - 1,
    //         itemStyle: { color: colorList[len - 1] },
    //       });
    //       lines.push({
    //         id: `${item[len - 2]}-${item[len - 1]}`,
    //         source: `${item[len - 2]}`,
    //         target: `${item[len - 1]}`,
    //       });
    //     }
    //   });

    //   if (lines.length > 0) {
    //     const asList = await getAsList({
    //       asns: lines.map((n) => n.target),
    //     });
    //     if (asList.data) {
    //       asList.data.forEach((n) => {
    //         _asObj[n.asn] = {
    //           country: n.asInfo.country.name,
    //           asName: n.asInfo.asnName,
    //           total: n.asInfo.asnDegree.total,
    //           asInfo: n.asInfo,
    //         };
    //       });
    //     }
    //     data.nodes = _nodes;
    //     data.lines = data.lines.concat(lines);
    //     data.asObj = _asObj;
    //   }
    // };

    // watchEffect(async () => {
    //   const nodes = [];
    //   const lines = [];
    //   const asObj = {};
    //   Object.values(outputData).forEach((item) => {
    //     if (item.length <= 2) {
    //       item.forEach((n, i) => {
    //         const id = Array(i + 1)
    //           .fill("0")
    //           .map((_, i) => item[i])
    //           .join("-");
    //         const nodeInfo = nodes.find((t) => t.id2 === id);
    //         if (!nodeInfo) {
    //           nodes.push({
    //             id2: id,
    //             name: n,
    //             category: i,
    //             itemStyle: { color: colorList[i] },
    //           });
    //         }
    //         //  else if (nodeInfo.category > i) {
    //         //   nodeInfo.category = i;
    //         //   nodeInfo.itemStyle = { color: colorList[i] };
    //         // }

    //         if (item.length > 1 && i > 0) {
    //           const lineIndex = lines.findIndex((t) => t.id === `${item[i - 1]}-${n}`);
    //           if (lineIndex === -1) {
    //             lines.push({
    //               id: `${item[i - 1]}-${n}`,
    //               source: `${item[i - 1]}`,
    //               target: `${n}`,
    //             });
    //           }
    //         }
    //       });
    //     }
    //   });
    //   const asList = await getAsList({
    //     asns: nodes.map((n) => n.name),
    //   });
    //   if (asList.data) {
    //     asList.data.forEach((n) => {
    //       asObj[n.asn] = {
    //         country: n.asInfo.country.name,
    //         asName: n.asInfo.asnName,
    //         total: n.asInfo.asnDegree.total,
    //         asInfo: n.asInfo,
    //       };
    //     });
    //   }

    //   data.nodes = nodes;
    //   data.lines = lines;
    //   data.asObj = asObj;
    // });

    const optins = computed(() => {
      return {
        animate: false,
        title: {
          text: "AS关系图",
          left: "center",
          top: "12px",
        },
        tooltip: {},
        roam: true,
        animationDuration: 500,
        series: [
          {
            type: "graph",
            layout: "force",
            animation: false,
            // label: {
            //   position: "right",
            //   formatter: "{b}",
            // },
            // draggable: true,
            data: data.nodes.map(function (node, idx) {
              // node.id = idx;
              node.symbolSize = 20;
              if (node.name === "4837") {
                node.symbolSize = 40;
              }
              return node;
            }),
            roam: true,
            zoom: 1,
            // categories: webkitDep.categories,
            force: {
              repulsion: 180, // 可以尝试减少此值
              gravity: 0.5, // 增大重力值，节点更容易聚拢
              // edgeLength: [30, 80], // 边长度，减少范围
              layoutAnimation: false, // 关闭布局动画，加速显示
            },
            tooltip: {
              formatter: (params) => {
                if (params.dataType === "node") {
                  const info = data.asObj[params.data.name];
                  console.log(info?.asInfo, 9999);
                  const country = info?.asInfo?.country?.iso?.toLocaleLowerCase();
                  return `<div>
                  <div class="mb-1"><span style="display: inline-block; width: 76px;">AS号:</span><a>${params.data.name}</a></div>
                  <div class="mb-1"><span style="display: inline-block; width: 76px;">AS名称:</span><a>${info?.asName}</a></div>
                  <div class="mb-1"><span style="display: inline-block; width: 76px;">AS邻居数:</span><a>${info?.total}</a></div>
                  <div class="mb-1"><span style="display: inline-block; width: 76px;">国家/地区:</span><a><span class="fi fi-${country}"></span><span class="ml-1">${info?.asInfo?.country?.name}<span></a></div>
                </div>`;
                }
              },
            },
            edges: data.lines,
          },
        ],
      };
    });

    const SContainer = styled.div`
      margin-top: 16px;
      border-radius: 8px;
      border: 1px solid ${token.value.colorBorderSecondary};
      background-color: ${token.value.colorBgBase};
    `;

    return () => (
      <div class="h-full w-full">
        <SContainer class="h-full w-full ">
          <Cechart
            key={data.nodes.length}
            class="h-full w-full"
            onClick={(params) => {
              if (params.dataType === "node") {
                addPeer(params.data.id2);
              }
            }}
            option={optins.value}
            autoresize
          />
        </SContainer>
      </div>
    );
  },
  { props: ["current"] },
);

export default RelationshipChart;
