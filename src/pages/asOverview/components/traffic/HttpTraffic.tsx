import { getTimestampArr } from "@/components/datePicker/config";
import Cechart from "@/components/echart/Cechart";
import { token } from "@/utils/theme";
import dayjs from "dayjs";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { options } from "./config";
import { message } from "ant-design-vue";

const HttpTraffic = defineComponent(
  (props) => {
    const loading = ref(false);
    const data = reactive({
      timestamps: [],
      http: [],
      pre_http: [],
    });
    const isRelation = computed(() => options.findIndex((item) => item.value === props.time));

    watchEffect(async () => {
      try {
        loading.value = true;
        const params: string[] = [];
        if (isRelation.value > -1) {
          const relativeTime = props.time.slice(4, -4);
          const timeStr = `dateRange=${relativeTime}`;
          params.push(`name=http&${timeStr}&asn=${props.asn}`, `name=pre_http&${timeStr}Control&asn=${props.asn}`);
        } else {
          const timestamp = getTimestampArr(props.time);
          const timeStr = `dateStart=${encodeURIComponent(dayjs(timestamp![0]).toISOString())}&dateEnd=${encodeURIComponent(dayjs(timestamp![1] - 5000).toISOString())}`;
          params.push(`name=http&${timeStr}&asn=${props.asn}`);
        }
        const res = await fetch(`/cloudflare/client/v4/radar/http/timeseries?${params.join("&")}&format=json`, {
          method: "get",
          headers: {
            Authorization: "Bearer NLl1s-Ankb_WbT1OkhB7bpd460A4KMV50bvE2ihs",
          },
        }).then((res) => res.json());
        if (!res.success) {
          throw new Error();
        }
        data.http = res.result?.http?.values ?? [];
        data.pre_http = res.result.pre_http?.values ?? [];
        data.timestamps = res.result.http?.timestamps ?? [];
        loading.value = false;
      } catch (error) {
        message.error("请求失败");
        loading.value = false;
      }
      // data.timestamps =
    });

    const option = computed(() => {
      let name = "Previous 7天";
      if (isRelation.value > 2) {
        name = "Previous " + options[isRelation.value].label.slice(2);
      }
      return {
        title: {
          text: `HTTP traffic`,
          left: "16px",
          top: "8px",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },

          formatter: (params) => {
            const info1 = params.find((n) => n.seriesName === "HTTP requests");
            const htmlstr: string[] = [];
            if (info1) {
              const seriesName1 = info1.seriesName || "";
              const value1 = (info1?.value[1] * 100)?.toFixed(1);
              let preStr = "";
              if (isRelation.value > -1) {
                const value2 = (data.pre_http[info1.dataIndex] * 100)?.toFixed(1);
                preStr = `(${value2}% Previous)`;
              }
              htmlstr.push(
                `<div class="mt-2"><span class="font-semibold" style="color:${info1.color}">${seriesName1}:</span> ${value1}%${preStr}</div>`,
              );
            }

            return `<div>
              <div class="text-base font-semibold">${dayjs(params[0].value[0]).format("YYYY-MM-DD HH:mm:ss")}</div>
              ${htmlstr.join("")}
            </div>`;
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
          // data: data.timestamps.map((n) => dayjs(n).valueOf()),
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value) => `${(value * 100).toFixed(0)}%`, // 转换成百分比
          },
        },
        legend: {
          show: true,
          top: "12px",
        },
        series: [
          {
            name: "HTTP requests",
            type: "line",
            itemStyle: { color: token.C1 },
            lineStyle: {
              width: 3,
            },
            data: data.http.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), n]),
            symbol: "none",
            emphasis: {
              focus: "series", // 鼠标移上去高亮整个系列
              itemStyle: {
                opacity: 1, // 确保悬停时点可见
              },
              symbol: "circle", // 悬停时显示点
              symbolSize: 8, // 悬停时点的大小
            },
          },
          {
            name: name,
            type: "line",
            lineStyle: {
              width: 1,
              type: "dashed",
              // opacity: 0.7,
            },
            itemStyle: { color: token.C1 },
            data: data.pre_http.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), n]),
            symbol: "none",
          },
        ].slice(0, isRelation.value > -1 ? 2 : 1),
      };
    });
    return () => (
      <Cechart
        loadingOptions={{ maskColor: "transparent", textColor: token.colorText }}
        loading={loading.value}
        class="h-full w-full"
        option={option.value}
        autoresize
      />
    );
  },
  { props: { time: String, asn: String } },
);

export default HttpTraffic;
