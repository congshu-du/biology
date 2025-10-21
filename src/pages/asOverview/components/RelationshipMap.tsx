import { computed, defineComponent, ref, watchEffect } from "vue";
// import asjson from "@/utils/asns.jsonl";

import CEchart from "@/components/echart/Cechart";
import styled, { tw } from "@vue-styled-components/core";
import { Radio, theme } from "ant-design-vue";
import { getAsRelationList } from "@/services/as";
import { AsnInfoType } from "@/services/as/interface";
// import { getLiantongCustomerList } from "@/services/as";

const asArr = [
  { name: "10099", value: [114.1694, 22.3193] },
  { name: "4808", city: "北京", value: [116.4074, 39.9042], asnName: "" },
  { name: "10206", city: "宁夏", value: [106.2309, 38.4872], asnName: "" },
  { name: "17621", city: "上海", value: [121.4737, 31.2304], asnName: "" },
  { name: "17622", city: "广州", value: [113.2644, 23.1291], asnName: "" },
  { name: "17623", value: [114.0579, 22.5431], asnName: "" },
  { name: "17816", value: [113.486140586252, 24.3847800309627], asnName: "" },
  { name: "133118", value: [116.372030044733, 39.9138258009389], asnName: "" },
  { name: "133119", value: [116.217196010701, 39.7723469775222], asnName: "" },
  { name: "134542", value: [116.389750639345, 39.9095946512695], asnName: "" },
  { name: "134543", value: [113.320831544952, 23.0837374934536], asnName: "" },
  { name: "135061", city: "深圳", value: [114.0579, 22.5431], asnName: "" },
  { name: "136958", city: "广州", value: [113.2644, 23.1291], asnName: "" },
  { name: "136959", city: "佛山", value: [113.1214, 23.0215], asnName: "" },
  { name: "137539", city: "哈尔滨", value: [126.5349, 45.8038], asnName: "" },
  { name: "138421", city: "", value: [120.006714405699, 33.9659298334604], asnName: "" },
  { name: "140707", city: "宁夏", value: [106.2309, 38.4872], asnName: "" },
  { name: "140716", city: "无锡", value: [120.3, 31.5747], asnName: "" },
  { name: "140717", city: "苏州", value: [120.5853, 31.2989], asnName: "" },
  { name: "140726", city: "合肥", value: [117.2857, 31.8612], asnName: "" },
  { name: "140979", city: "上海", value: [121.4737, 31.2304], asnName: "" },
  { name: "152120", city: "天津", value: [117.3616, 39.3434], asnName: "" },
  { name: "139646", city: "香港", value: [114.1694, 22.3193], asnName: "" },
  { name: "137794", city: "北京", value: [116.4074, 39.9042], asnName: "" },
  { name: "131526", city: "乌鲁木齐", value: [87.6168, 43.8256], asnName: "" },
  { name: "24429", city: "厦门", value: [120.1551, 30.2741], asnName: "" },
  { name: "38057", city: "杭州", value: [118.0894, 24.4798], asnName: "" },
  { name: "45102", city: "杭州", value: [118.0894, 24.4798], asnName: "" },
  { name: "134687", city: "香港", value: [114.1694, 22.3193], asnName: "" },
];

const liantongObj = asArr.reduce((pre, cur) => {
  pre[cur.name] = cur.value;
  return pre;
}, {});

const mainNodes = ["4837", "10099", "9929"];

const RelationshipMap = defineComponent(() => {
  const { token } = theme.useToken();
  const scope = ref<"china" | "world">("china");

  const nodeList = ref<number[]>([]);
  const lineList = ref<string[]>([]);
  const asObj = ref<Record<string, AsnInfoType>>({});

  watchEffect(async () => {
    try {
      const res4837 = await getAsRelationList({
        asn: 4837,
        relatedType: -1,
        onlyCN: true,
        dataYear: 2024,
      });
      const res10099 = await getAsRelationList({
        asn: 10099,
        relatedType: -1,
        onlyCN: true,
        dataYear: 2024,
      });
      const res9929 = await getAsRelationList({
        asn: 9929,
        relatedType: -1,
        onlyCN: true,
        dataYear: 2024,
      });
      if (res4837.code !== 200 || res10099.code !== 200 || res9929.code !== 200) {
        throw new Error();
      }
      const _nodeList: number[] = [];
      const _lineList: string[] = [];
      const _asObj: Record<string, AsnInfoType> = {};

      res4837.data?.forEach((item) => {
        _asObj[item.relatedAsn] = {
          ...item,
          longitude: liantongObj[item.relatedAsn] ? liantongObj[item.relatedAsn][0] : item.longitude,
          latitude: liantongObj[item.relatedAsn] ? liantongObj[item.relatedAsn][1] : item.latitude,
        };
        if (!_nodeList.includes(item.relatedAsn) && item.relatedType === 3 && item.relatedAsn !== 4837) {
          _nodeList.push(item.relatedAsn);
          _lineList.push(`${item.relatedAsn}-${item.asn}`);
        }
      });
      res10099.data?.forEach((item) => {
        _asObj[item.relatedAsn] = {
          ...item,
          longitude: liantongObj[item.relatedAsn] ? liantongObj[item.relatedAsn][0] : item.longitude,
          latitude: liantongObj[item.relatedAsn] ? liantongObj[item.relatedAsn][1] : item.latitude,
        };

        if (!_nodeList.includes(item.relatedAsn) && item.relatedType === 3 && item.relatedAsn !== 10099) {
          _nodeList.push(item.relatedAsn);
          _lineList.push(`${item.relatedAsn}-${item.asn}`);
        }
      });
      res9929.data?.forEach((item) => {
        _asObj[item.relatedAsn] = {
          ...item,
          longitude: liantongObj[item.relatedAsn] ? liantongObj[item.relatedAsn][0] : item.longitude,
          latitude: liantongObj[item.relatedAsn] ? liantongObj[item.relatedAsn][1] : item.latitude,
        };

        if (!_nodeList.includes(item.relatedAsn) && item.relatedType === 3 && item.relatedAsn !== 9929) {
          _nodeList.push(item.relatedAsn);
          _lineList.push(`${item.relatedAsn}-${item.asn}`);
        }
      });
      nodeList.value = _nodeList;
      lineList.value = _lineList;
      asObj.value = _asObj;
    } catch (error) {}
  });
  // const mainNodes = targetList.map((item) => {
  //   const info = asns.find((n) => n.asn === item.name);
  //   return {
  //     name: item.name,
  //     value: item.value ?? [info?.longitude, info?.latitude],
  //     asn: item.name,
  //     country: info?.country.name,
  //     asnName: info?.asnName,
  //     peerNumber: info?.asnDegree.total,
  //   };
  // });
  // asns
  //   .filter((item) => targetList.includes(item.asn))
  //   .map((item) => ({
  //     name: item.asn,
  //     value: [item.longitude, item.latitude],
  //     asn: item.asn,
  //     country: item.country.name,
  //     asnName: item.asnName,
  //     peerNumber: item.asnDegree.total,
  //   }));

  const option = computed(() => {
    const nodes = nodeList.value.map((item) => {
      const info = asObj.value[item];
      return {
        name: info.relatedAsn + "",
        value: [info.longitude, info.latitude],
        asn: info.relatedAsn + "",
        asnName: info?.asnName,
        peerNumber: info?.degree,
      };
    });
    const lines = lineList.value.map((item) => {
      const arr = item.split("-");
      return [
        { coord: [asObj.value[arr[0]]?.longitude, asObj.value[arr[0]]?.latitude], name: arr[0] },
        { coord: [asObj.value[arr[1]]?.longitude, asObj.value[arr[1]]?.latitude], name: arr[1] },
      ];
    });
    const mains = mainNodes.map((n) => {
      const info = asObj.value[n];
      return {
        name: info?.relatedAsn + "",
        value: [info?.longitude, info?.latitude],
        asn: info?.relatedAsn + "",
        asnName: info?.asnName,
        peerNumber: info?.degree,
      };
    });
    return {
      // title: {
      //   text: "联通相关AS号",
      //   left: "center",
      //   top: "8px",
      // },
      tooltip: {
        trigger: "item",
      },
      geo: {
        map: scope.value,
        roam: "move", // 允许缩放和平移
        label: {
          emphasis: {
            show: true,
          },
        },
        regions: [
          // {
          //   name: "北京",
          //   itemStyle: {
          //     color: token.value["red-5"],
          //   },
          // },
          // {
          //   name: "湖北",
          //   itemStyle: {
          //     color: "blue",
          //   },
          // },
        ],

        itemStyle: {
          borderColor: token.value["geekblue-5"],
          // borderDashOffset: 0,
          color: token.value["geekblue-3"],
          // areaColor: token.value["geekblue-1"],
        },
        emphasis: {
          itemStyle: {
            areaColor: token.value["geekblue-4"],
          },
          // disabled: true,
        },
      },

      series: [
        {
          name: "Hijack path",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 1,
          large: true,
          lineStyle: {
            width: 1,
            color: token.value["green-5"],
            opacity: 0.5,
            curveness: 0.2,
          },
          effect: {
            show: true,
            constantSpeed: 30,
            symbol: "arrow",
            symbolSize: 6,
            trailLength: 0,
          },
          tooltip: {
            show: false,
            // formatter: (params) => {
            //   console.log(params, 888);
            //   return 123;
            // },
          },

          data: lines,
        },
        {
          name: "Victim",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke",
          },
          label: {
            show: false,
          },
          symbolSize: 10,
          itemStyle: {
            color: token.value["blue-6"],
          },
          data: [
            // { name: "New York", value: [-77.0369, 38.9072] },
            // { name: "London", value: [-0.1276, 51.5074] },
            // { name: "Beijing", value: [116.4074, 39.9042] },
            ...nodes,
          ],
          tooltip: {
            formatter: (params) => {
              return `<div>
              <div><span style="display: inline-block; width: 76px;">AS号:</span><a>${params.data.name}</a></div>
              <div><span style="display: inline-block; width: 76px;">AS名称:</span><a>${params.data.asnName}</a></div>
              <div><span style="display: inline-block; width: 76px;">AS邻居数:</span><a>${params.data.peerNumber}</a></div>
            </div>`;
            },
          },
        },
        {
          name: "Attacker",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke",
          },
          label: {
            show: false,
          },
          symbolSize: 16,
          itemStyle: {
            color: token.value["red-6"],
          },
          data: [...mains],
          tooltip: {
            formatter: (params) => {
              return `<div>
              <div><span style="display: inline-block; width: 76px;">AS号:</span><a>${params.data.name}</a></div>
              <div><span style="display: inline-block; width: 76px;">AS名称:</span><a>${params.data.asnName}</a></div>
              <div><span style="display: inline-block; width: 76px;">AS邻居数:</span><a>${params.data.peerNumber}</a></div>
            </div>`;
            },
          },
        },
      ],
    };
  });

  const SContainer = styled.div`
    ${tw`h-full`}
    border-radius: 8px;
    border: 1px solid ${token.value.colorBorderSecondary};
    background-color: ${token.value.B2};
  `;
  return () => (
    <div class="h-full w-full relative">
      {/* <div class="absolute top-4 right-4 z-10">
        <Radio.Group size="small" v-model={[scope.value, "value"]} button-style="solid">
          <Radio.Button value="china">中国</Radio.Button>
          <Radio.Button value="world">世界</Radio.Button>
        </Radio.Group>
      </div> */}

      <SContainer>
        <CEchart class="h-full w-full" option={option.value} autoresize />
      </SContainer>
    </div>
  );
});

export default RelationshipMap;
