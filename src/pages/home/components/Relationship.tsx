import { computed, defineComponent, watch, watchEffect, ref } from "vue";

import CEchart from "@/components/echart/Cechart";
import { themeType, token } from "@/utils/theme";
import { countryNameMap, echartCountryNameMap } from "@/assets/data/contry";
import shiduantu from "@/assets/img/shiduantu.png";
import shiduantu_light from "@/assets/img/shiduantu_light.png";
import { getTimestampArr } from "@/components/datePicker/config";
import { getAlertHijackCountryLink } from "@/services/alert";
import { countryCoordinateMap } from "@/assets/data/contry";
import * as d3 from "d3";

const attackerCoordinateObj = {};

const victimCoordinateObj = {};

for (const key in countryCoordinateMap) {
  attackerCoordinateObj[key] = [countryCoordinateMap[key].lng, countryCoordinateMap[key].lat];
  victimCoordinateObj[key] = [countryCoordinateMap[key].lng + 1, countryCoordinateMap[key].lat + 1];
}

const sizeScale = d3.scaleLinear().domain([0, 6000]).range([10, 40]);

/**
 * Relationship 组件
 *
 * @description 关系图组件
 * @returns {JSX.Element} 关系图组件的 JSX 元素
 */
const Relationship = defineComponent(
  (props) => {
    /**
     * 攻击者列表
     *
     * @description 攻击者的列表
     * @type {Array<{ name: string, value: number }>}
     */
    const attackerList = ref<{ name: string; value: number }[]>([]);
    /**
     * 受害者列表
     *
     * @description 受害者的列表
     * @type {Array<{ name: string, value: number }>}
     */
    const victimList = ref<{ name: string; value: number }[]>([]);
    /**
     * 关系列表
     *
     * @description 攻击者和受害者的关系列表
     * @type {Array<{ source: string, target: string, value: number }>}
     */
    const linkList = ref<{ source: string; target: string; value: number }[]>([]);
    watchEffect(async () => {
      try {
        const timestamp = getTimestampArr(props.time);

        const res = await getAlertHijackCountryLink({
          searchStartTime: timestamp![0],
          searchEndTime: timestamp![1],
        });
        if (res.code !== 200) {
          throw new Error();
        }
        const nodes1: { name: string; value: number }[] = [];
        const nodes2: { name: string; value: number }[] = [];
        const links: { source: string; target: string; value: number }[] = [];
        res.data.forEach((n) => {
          const attackerName = n.attackerCountryName;
          const victimName = n.victimCountryName;
          const info1 = nodes1.find((t) => t.name === attackerName);
          const info2 = nodes2.find((t) => t.name === victimName);
          if (info1) {
            info1.value += n.eventCount;
          } else {
            nodes1.push({ name: attackerName, value: n.eventCount });
          }
          if (info2) {
            info2.value += n.eventCount;
          } else {
            nodes2.push({ name: victimName, value: n.eventCount });
          }
          links.push({ source: attackerName, target: victimName, value: n.eventCount });
        });
        attackerList.value = nodes1;
        victimList.value = nodes2;
        linkList.value = links;
      } catch (error) {}
    });
    const option = computed(() => {
      const links = linkList.value
        .filter((n) => attackerCoordinateObj[n.source] && victimCoordinateObj[n.target])
        .map((n) => {
          return [
            { coord: attackerCoordinateObj[n.source], name: n.source },
            { coord: victimCoordinateObj[n.target], name: n.target },
          ];
        });
      return {
        title: {
          text: "全球BGP路由异常实时态势图",
          left: "center",
          top: "8px",
        },
        tooltip: {
          trigger: "item",
        },
        geo: [
          {
            map: "world",
            roam: false, // 允许缩放和平移
            label: {
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              // borderColor: token["geekblue-5"],
              color: token["geekblue-2"],
              // borderColor: token.CL5,
              // color: token.C5,
              areaColor: token["geekblue-2"],
            },
            emphasis: {
              disabled: true,
            },
            nameMap: echartCountryNameMap,
            tooltip: {
              formatter: (params) => {
                return countryNameMap[params.name] ?? params.name;
              },
            },
          },
        ],
        graphic: {
          type: "image",
          left: "24", // 图片水平居中
          bottom: "24", // 图片垂直居中
          style: {
            image: themeType === "light" ? shiduantu_light : shiduantu,
            width: 76,
            height: 100,
          },
          tooltip: {
            formatter: () => {
              return "中国";
            },
          },
        },

        series: [
          {
            type: "lines",
            coordinateSystem: "geo",
            zlevel: 1,
            large: true,
            lineStyle: {
              width: 0,
              opacity: 0.1,
              curveness: 0.2,
              color: token.CL1,
            },
            data: links,
            effect: {
              constantSpeed: 100,
              show: true,
              trailLength: 0.1,
              symbolSize: 3,
            },
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
            itemStyle: {
              color: token["green-7"],
            },
            data: victimList.value.map((n) => ({
              name: n.name,
              value: victimCoordinateObj[n.name],
              symbolSize: sizeScale(n.value),
              num: n.value,
            })),
            tooltip: {
              formatter: (params) => {
                return `<div>
              <div style="margin-bottom: 4px;font-weight: bold;color: ${token["green-7"]}">被劫持者</div>
              <div><span style="display: inline-block; width: 46px;">国家:</span><span style="font-weight: bold">${countryNameMap[params.name]}</span></div>
              <div><span style="display: inline-block; width: 46px;">次数:</span><span style="font-weight: bold">${params.data.num}</span></div>
            </div>`;
              },
            },
            // data: [
            //   { name: "New York", value: [-77.0369, 38.9072] },
            //   { name: "London", value: [-0.1276, 51.5074] },
            //   { name: "Beijing", value: [116.4074, 39.9042] },
            // ],
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
            symbolSize: 10,
            itemStyle: {
              color: token["red-7"],
            },
            tooltip: {
              formatter: (params) => {
                return `<div>
              <div style="margin-bottom: 4px;font-weight: bold;color: ${token["red-7"]}">劫持者</div>
              <div><span style="display: inline-block; width: 46px;">国家:</span><span style="font-weight: bold">${countryNameMap[params.name]}</span></div>
              <div><span style="display: inline-block; width: 46px;">次数:</span><span style="font-weight: bold">${params.data.num}</span></div>
            </div>`;
              },
            },
            data: attackerList.value.map((n) => ({
              name: n.name,
              value: attackerCoordinateObj[n.name],
              symbolSize: sizeScale(n.value),
              num: n.value,
            })),
            // data: [
            //   { name: "Paris", value: [2.3522, 48.8566] },
            //   { name: "Tokyo", value: [139.6917, 35.6895] },
            //   { name: "Mexico City", value: [-99.1332, 19.4326] },
            // ],
          },
        ],
      };
    });
    return () => {
      return <CEchart option={option.value} class="h-full w-full" autoresize />;
    };
  },
  { props: ["time"] },
);

export default Relationship;
