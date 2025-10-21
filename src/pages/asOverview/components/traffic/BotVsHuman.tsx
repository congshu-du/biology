import { getTimestampArr } from "@/components/datePicker/config";
import Cechart from "@/components/echart/Cechart";
import { token } from "@/utils/theme";
import dayjs from "dayjs";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { options } from "./config";
import { message, Switch } from "ant-design-vue";

const BotVsHuman = defineComponent(
  (props) => {
    const loading = ref(false);
    const data = reactive({
      timestamps: [],
      bot: [],
      human: [],
    });

    const isRelation = computed(() => options.findIndex((item) => item.value === props.time));

    watchEffect(async () => {
      try {
        loading.value = true;
        const params: string[] = [];
        if (isRelation.value > -1) {
          const relativeTime = props.time.slice(4, -4);
          const timeStr = `dateRange=${relativeTime}`;
          params.push(`name=total&${timeStr}&asn=${props.asn}`);
        } else {
          const timestamp = getTimestampArr(props.time);
          const timeStr = `dateStart=${encodeURIComponent(dayjs(timestamp![0]).toISOString())}&dateEnd=${encodeURIComponent(dayjs(timestamp![1] - 5000).toISOString())}`;
          params.push(`name=total&${timeStr}&asn=${props.asn}`);
        }
        // if (!isBot.value) {
        //   params.push(`botClass=Likely_Human`);
        // }
        const res = await fetch(
          `/cloudflare/client/v4/radar/http/timeseries_groups/bot_class?${params.join("&")}&format=json`,
          {
            method: "get",
            headers: {
              Authorization: "Bearer NLl1s-Ankb_WbT1OkhB7bpd460A4KMV50bvE2ihs",
            },
          },
        ).then((res) => res.json());
        if (!res.success) {
          throw new Error();
        }
        data.bot = res.result?.total?.bot ?? [];
        data.human = res.result.total?.human ?? [];
        data.timestamps = res.result.total?.timestamps ?? [];
        loading.value = false;
      } catch (error) {
        message.error("请求失败");
        loading.value = false;
      }
    });

    const option = computed(() => {
      return {
        title: {
          text: `Bot Vs Human`,
          left: "16px",
          top: "8px",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          valueFormatter: (val) => {
            return val + "%";
          },
        },
        grid: {
          left: "20px",
          right: "20px",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "time",
          axisLabel: {
            formatter: {
              // month: "{yy}-{MM}",
              day: "{MM}/{dd}",
            },
          },
        },
        yAxis: {
          type: "value",
          max: "dataMax",
          axisLabel: {
            formatter: (value) => `${value.toFixed(0)}%`, // 转换成百分比
          },
        },
        legend: {
          show: true,
          top: "12px",
          // data: ["bot", "human"],
        },
        series: [
          {
            name: "Bot",
            type: "line",
            stack: "总量",
            areaStyle: {},
            itemStyle: { color: token.C1 },
            lineStyle: {
              width: 3,
            },
            data: data.bot.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), Number(n)]),
            symbol: "none",
            z: 2,
            // emphasis: {
            //   focus: "series", // 鼠标移上去高亮整个系列
            //   itemStyle: {
            //     opacity: 1, // 确保悬停时点可见
            //   },
            //   symbol: "circle", // 悬停时显示点
            //   symbolSize: 8, // 悬停时点的大小
            // },
          },
          {
            name: "Human",
            type: "line",
            itemStyle: { color: token.C2 },
            lineStyle: {
              width: 3,
            },

            stack: "总量",
            areaStyle: {},
            data: data.human.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), Number(n)]),
            symbol: "none",
            z: 1,

            // emphasis: {
            //   focus: "series",
            //   itemStyle: {
            //     opacity: 1,
            //   },
            //   symbol: "circle",
            //   symbolSize: 8,
            // },
          },
        ],
      };
    });

    return () => (
      <div class="h-full w-full">
        <Cechart
          loadingOptions={{ maskColor: "transparent", textColor: token.colorText }}
          loading={loading.value}
          class="h-full w-full"
          option={option.value}
          autoresize
        />
      </div>
    );
  },
  { props: { time: String, asn: String } },
);

export default BotVsHuman;
