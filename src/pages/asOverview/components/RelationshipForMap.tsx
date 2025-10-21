import { computed, defineComponent, ref, watchEffect } from "vue";
// import asjson from "@/utils/asns.jsonl";
import shiduantu from "@/assets/img/shiduantu.png";
import CEchart, { colorList2 } from "@/components/echart/Cechart";
// import { asns } from "@/utils/asns";
import styled, { tw } from "@vue-styled-components/core";
import { Radio, Tag, theme } from "ant-design-vue";
import { getCountryRegionBatchList, getCountryRegionList } from "@/services/as";
import { countryNameMap, echartCountryList, echartCountryNameMap } from "@/assets/data/contry";
import { groupBy } from "lodash-es";

const echartNames = echartCountryList.map((n) => echartCountryNameMap[n] ?? n);

const getLevelCount = (data: Record<string, number>) => {
  const countryObj = {};
  echartNames.forEach((n) => {
    countryObj[n] = data[n];
  });
  const list = Object.values(countryObj);

  const obj = groupBy(list, (n) => n);
  return obj;
  // return list;
};

const liantongAsns = ["4837", "10099", "9929"];

const totalLev = 5;

const RelationshipForMap = defineComponent(
  (props) => {
    const { token } = theme.useToken();
    const otherColor = ref<boolean>(false);
    const number = ref(totalLev - 1);
    const regions = ref<{ name: string; level: number; itemStyle: any }[]>([]);
    const scope = ref<"all" | "excludeUS">("all");
    const levelCountryObj = ref<Record<string, any[]>>({});

    watchEffect(() => {
      if (!liantongAsns.includes(props.value)) {
        scope.value = "all";
      }
    });

    watchEffect(async () => {
      const _regions: { name: string; level: number; itemStyle: any }[] = [];
      const countryLevelObj: Record<string, number> = {};
      let result: any = undefined;
      if (liantongAsns.includes(props.value) && scope.value === "excludeUS") {
        result = await getCountryRegionList({
          hop: number.value,
          businessCode: 1,
          sourceAsn: props.value,
        });
      } else {
        result = await getCountryRegionBatchList({
          hop: number.value,
          businessCode: 0,
          sourceAsn: props.value,
        });
      }

      if (result.code !== 200) {
        return;
      }
      result.data.forEach((n, i) => {
        n?.countryNameList?.forEach((x) => {
          const name = x === "Hong Kong" ? "China" : x;
          if (countryLevelObj[name] === undefined) {
            countryLevelObj[name] = i;
          }
          if (!_regions.find((x) => x.name === name)) {
            _regions.push({
              name: name,
              level: i,
              itemStyle: {
                color: colorList2[i],
              },
            });
          }
        });
      });
      const obj = getLevelCount(countryLevelObj);
      levelCountryObj.value = obj;

      // for (let i = 0; i <= number.value; i++) {
      //   const res = await getCountryRegionList({
      //     hop: i,
      //     businessCode: scope.value === "excludeUS" ? 1 : 0,
      //     sourceAsn: props.value,
      //   });
      //   res?.data?.forEach((n) => {
      //     if (!_regions.find((x) => x.name === n)) {
      //       _regions.push({
      //         name: n,
      //         level: i,
      //         itemStyle: {
      //           color: colorList[i],
      //         },
      //       });
      //     }
      //   });
      // }
      regions.value = _regions;
    });

    // watchEffect(() => {
    //   const { nodes, lines, asObj } = props.data;
    //   const _regions = [];
    //   nodes?.forEach((n) => {
    //     const counry = asObj[n.name]?.country;
    //     const info = _regions.find((x) => x.name === counry);
    //     if (!info) {
    //       _regions.push({
    //         name: counry,
    //         level: n.category,
    //         itemStyle: {
    //           color: colorList[n.category],
    //         },
    //       });
    //     } else if (info.level > n.category) {
    //       info.level = n.category;
    //       info.itemStyle = {
    //         color: colorList[n.category],
    //       };
    //     }
    //   });
    //   console.log(nodes, _regions, asObj, 8888);
    //   regions.value = _regions;
    // });

    const option = computed(() => ({
      title: {
        // text: "中国联通路由可达国家分布图",
        text: "路由可达国家分布图",
        left: "center",
        top: "8px",
      },
      tooltip: {
        trigger: "item",
      },
      graphic: {
        type: "image",
        left: "24", // 图片水平居中
        bottom: "24", // 图片垂直居中
        style: {
          image: shiduantu,
          width: 116,
          height: 160,
        },
        tooltip: {
          formatter: () => {
            return "中国";
          },
        },
      },
      geo: {
        map: "world",
        roam: "move", // 允许缩放和平移
        label: {
          emphasis: {
            show: true,
          },
          // show: true,
          // color: token.value.colorText,
        },
        nameMap: echartCountryNameMap,
        regions: regions.value,
        // regions: [
        //   {
        //     name: "China",
        //     itemStyle: {
        //       color: "red",
        //     },
        //   },
        // ],
        // itemStyle: {
        //   borderColor: "#eeeeee",
        //   borderDashOffset: 0,
        // },
        itemStyle: {
          borderColor: token.value.colorBorder,
          // borderDashOffset: 0,
          // color: "blue",
          color: otherColor.value ? token.value["orange-7"] : token.value.colorFillSecondary,
        },
        emphasis: {
          disabled: true,
        },
        tooltip: {
          formatter: (params) => {
            return countryNameMap[params.name] ?? params.name;
          },
        },
      },
      series: [
        // {
        // name: "Hijack path",
        // type: "lines",
        // coordinateSystem: "geo",
        // zlevel: 1,
        // large: true,
        // lineStyle: {
        //   width: 2,
        //   color: "#a58fd2",
        //   opacity: 0.5,
        //   curveness: 0.2,
        // },
        // effect: {
        //   show: true,
        //   constantSpeed: 60,
        //   symbol: "arrow",
        //   symbolSize: 8,
        //   trailLength: 0,
        // },
        // data: [
        //   // 示例数据
        //   [{ coord: [-77.0369, 38.9072] }, { coord: [2.3522, 48.8566] }], // 从纽约到巴黎
        //   [{ coord: [-0.1276, 51.5074] }, { coord: [139.6917, 35.6895] }], // 从伦敦到东京
        //   // [{ coord: [2.3522, 48.8566] }, { coord: [139.6917, 35.6895] }],
        //   [{ coord: [116.4074, 39.9042] }, { coord: [-99.1332, 19.4326] }], // 从北京到墨西哥城
        // ],
        // },
        // {
        //   name: "Victim",
        //   type: "scatter",
        //   coordinateSystem: "geo",
        //   zlevel: 2,
        //   rippleEffect: {
        //     brushType: "stroke",
        //   },
        //   label: {
        //     show: false,
        //   },
        //   symbolSize: 10,
        //   // itemStyle: {
        //   //   color: "green",
        //   // },
        //   data: [
        //     { name: "New York", value: [-77.0369, 38.9072], itemStyle: { color: "red" } },
        //     // { name: "London", value: [-0.1276, 51.5074] },
        //     // { name: "Beijing", value: [116.4074, 39.9042] },
        //     ...nodeList,
        //   ],
        // },
        // {
        //   name: "Attacker",
        //   type: "effectScatter",
        //   coordinateSystem: "geo",
        //   zlevel: 2,
        //   rippleEffect: {
        //     brushType: "stroke",
        //   },
        //   label: {
        //     show: false,
        //   },
        //   symbolSize: 10,
        //   itemStyle: {
        //     color: "red",
        //   },
        //   data: [
        //     // { name: "Paris", value: [2.3522, 48.8566] },
        //     // { name: "Tokyo", value: [139.6917, 35.6895] },
        //     // { name: "Mexico City", value: [-99.1332, 19.4326] },
        //   ],
        // },
      ],
    }));
    const SContainer = styled.div`
      ${tw`relative h-full`}
      border-radius: 8px;
      border: 1px solid ${token.value.colorBorderSecondary};
      background-color: ${token.value.B2};
    `;
    return () => (
      <SContainer>
        <div class="absolute top-4 left-4 z-10">
          {Array(totalLev)
            .fill(1)
            .map((_, index) => (
              <div class="mb-2 cursor-pointer" onClick={() => (number.value = index)}>
                <Tag color={index <= number.value ? colorList2[index] : token.value.colorFillSecondary}>
                  <span class="inline-block w-5"></span>
                </Tag>
                <span
                  style={{ color: index <= number.value ? token.value.colorText : token.value.colorTextDisabled }}
                  class=" text-xs"
                >
                  第{index}跳 {index <= number.value && `(${levelCountryObj.value[index]?.length ?? 0})`}
                </span>
              </div>
            ))}
          <div onClick={() => (otherColor.value = !otherColor.value)} class="mt-8 cursor-pointer">
            <Tag color={otherColor.value ? token.value["orange-7"] : token.value.colorFillSecondary}>
              <span class="inline-block w-5"></span>
            </Tag>
            <span
              style={{ color: otherColor.value ? token.value.colorText : token.value.colorTextDisabled }}
              class=" text-xs"
            >
              不可达 ({levelCountryObj.value["undefined"]?.length})
            </span>
          </div>
        </div>

        <div hidden={!liantongAsns.includes(props.value)} class="absolute top-4 right-4 z-10">
          <Radio.Group size="small" v-model={[scope.value, "value"]} button-style="solid">
            <Radio.Button value="all">全部国家</Radio.Button>
            <Radio.Button value="excludeUS">美国断连</Radio.Button>
          </Radio.Group>
        </div>
        <CEchart
          onClick={(params) => {
            if (params.componentType === "geo") {
              // console.log(params, 3445);
            }
          }}
          class="h-full w-full"
          option={option.value}
          autoresize
        />
      </SContainer>
    );
  },
  { props: ["value"] },
);

export default RelationshipForMap;
