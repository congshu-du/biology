import Cechart from "@/components/echart/Cechart";
import { computed, defineComponent, watchEffect } from "vue";
import { token } from "@/utils/theme";
import styled, { tw } from "@vue-styled-components/core";
import { ref } from "vue";
import { getEveryYearDegree } from "@/services/as";
import { colorList2 } from "@/components/echart/Cechart";
// import { colorList } from "@/services/as/contant";

const HistoryBar = defineComponent<{ type: "IPv4" | "IPv6"; value: string; year: number }>(
  (props) => {
    // const type = ref<"IPv4" | "IPv6">("IPv4");
    const years = ref<string[]>([]);
    const allList = ref<any[]>([]);

    watchEffect(async () => {
      try {
        const res = await getEveryYearDegree({
          dataYear: 1998 + props.year,
          asn: Number(props.value),
          ipType: props.type === "IPv4" ? 4 : 6,
        });
        if (res.code !== 200) {
          throw new Error();
        }
        const obj = res.data.reduce((pre, cur) => {
          pre[`${cur.dataYear}-${cur.relatedType}-${cur.ipType}`] = cur.totalDegree;
          return pre;
        }, {});

        const status = props.type === "IPv4" ? 4 : 6;
        // const data = res.data.filter((n) => n.ipType === status);
        const _years: string[] = [];
        const series: { name: string; type: string; stack: string; data: number[]; itemStyle: any }[] = [
          {
            name: "provider",
            type: "bar",
            stack: "total",
            itemStyle: { color: colorList2[1] },
            data: [],
          },
          {
            name: "peer",
            type: "bar",
            stack: "total",
            itemStyle: { color: colorList2[2] },
            data: [],
          },

          {
            name: "customer",
            type: "bar",
            itemStyle: { color: colorList2[3] },
            stack: "total",
            data: [],
          },
        ];

        // const categoryObj = {
        //   1: "peer",
        //   2: "provider",
        //   3: "customer",
        // };
        for (let i = 0; i <= props.year; i++) {
          const peerNum: number = obj[`${1998 + i}-1-${status}`] ?? 0;
          const customerNum: number = obj[`${1998 + i}-3-${status}`] ?? 0;
          const providerNum: number = obj[`${1998 + i}-2-${status}`] ?? 0;

          series[0].data.push(providerNum);
          series[1].data.push(peerNum);
          series[2].data.push(customerNum);

          _years.push(`${1998 + i}`);
        }
        allList.value = series;
        years.value = _years;
        // const list = res.data.filter()
      } catch (error) {}
    });

    const option = computed(() => {
      return {
        title: {
          // text: `${type.value} Peer历史统计`,
          left: "center",
          top: "8px",
        },
        xAxis: {
          type: "category",
          data: years.value,
        },
        tooltip: {
          show: true,
        },
        yAxis: {
          type: "value",
        },
        grid: {
          top: "40px",
          bottom: "30px",
          left: "3%",
          right: "16px",
        },
        legend: {
          // selectedMode: false,
          top: "8px",
        },
        series: allList.value,
      };
    });

    return () => (
      <div class="relative h-full">
        <SContainer class="h-full w-full">
          <Cechart class="h-full w-full" option={option.value} autoresize />
        </SContainer>
      </div>
    );
  },
  {
    props: ["value", "year", "type"],
  },
);

export default HistoryBar;

const SContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${token.colorBorderSecondary};
  background-color: ${token.B2};
`;
