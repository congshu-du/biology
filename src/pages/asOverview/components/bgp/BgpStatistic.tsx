import CEchart from "@/components/echart/Cechart";
import { token } from "@/utils/theme";
import { computed, defineComponent } from "vue";
import dayjs from "dayjs";
import { BgpStatisticProps } from "@/services/as/interface";

const BgpStatistic = defineComponent<{ data: BgpStatisticProps[]; loading: boolean }>(
  (props) => {
    const option = computed(() => {
      const data = props.data ?? [];
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          appendToBody: true,
        },
        // legend: {},
        grid: {
          left: "16px",
          right: "20px",
          bottom: "8px",
          top: "40px",
          containLabel: true,
        },
        xAxis: {
          show: data.length > 0,
          type: "time",
          axisLabel: {
            formatter: function (value: number) {
              return `${dayjs(value).format("HH:mm \n YYYY-MM-DD ")}`;
            },
          },
        },
        yAxis: [
          {
            show: data.length > 0,
            type: "value",
            position: "left",
            name: "宣告数量",
            splitNumber: 3,
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: token.C1,
              },
            },
            nameTextStyle: {
              fontSize: 16, // 设置字体大小
              fontWeight: "bold", // 设置字体加粗
              color: token.C1,
            },
            axisLabel: {
              fontSize: 14, // 设置刻度数字的字体大小
              color: token.C1, // 设置刻度数字的字体颜色
            },
          },
          {
            type: "value",
            show: data.length > 0,
            name: "撤销数量",
            position: "right",
            splitNumber: 3,
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: token.yellow,
              },
            },
            axisLabel: {
              fontSize: 14,
              color: token.yellow,
              formatter: (value) => {
                return Number.isInteger(value) ? value.toLocaleString() : "";
              },
            },
            nameTextStyle: {
              fontSize: 16, // 设置字体大小
              fontWeight: "bold", // 设置字体加粗
              color: token.yellow,
            },
          },
        ],
        graphic: {
          invisible: data.length !== 0,
          type: "text",
          left: "center",
          top: "middle",
          style: {
            text: props.loading ? "加载中..." : "暂无数据",
            fontSize: 14,
            fill: token.colorTextQuaternary,
          },
        },
        series: [
          {
            data: data.map((n) => ({ value: [dayjs(n.time).valueOf(), n.a] })),
            name: "宣告数量",
            itemStyle: {
              color: token.C1,
            },
            areaStyle: {
              opacity: 0.4,
            },
            type: "line",
            z: 2,
          },
          {
            data: data.map((n) => ({ value: [dayjs(n.time).valueOf(), n.w] })),
            name: "撤销数量",
            yAxisIndex: 1,
            areaStyle: {
              opacity: 0.2,
            },
            itemStyle: {
              color: token.yellow,
            },
            type: "line",
            z: 1,
          },
        ],
      };
    });
    return () => (
      <div
        style={{ border: `1px solid ${token.colorBorder}`, backgroundColor: token.B2 }}
        class=" mb-4 h-[260px] rounded-md"
      >
        <CEchart
          class="h-full w-full"
          loadingOptions={{ maskColor: "transparent", textColor: token.colorText }}
          loading={props.loading}
          option={option.value}
          autoresize
        />
      </div>
    );
  },
  { props: ["data", "loading"] },
);

export default BgpStatistic;
