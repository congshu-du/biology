import { getTimestampArr } from "@/components/datePicker/config";
import Cechart from "@/components/echart/Cechart";
import { token } from "@/utils/theme";
import dayjs from "dayjs";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { options } from "./config";
import { message, Switch } from "ant-design-vue";

const MobileVsDesktop = defineComponent(
  (props) => {
    const loading = ref(false);
    const isBot = ref(false);
    const data = reactive({
      timestamps: [],
      desktop: [],
      mobile: [],
      other: [],
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
        if (!isBot.value) {
          params.push(`botClass=Likely_Human`);
        }
        const res = await fetch(
          `/cloudflare/client/v4/radar/http/timeseries_groups/device_type?${params.join("&")}&format=json`,
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
        data.desktop = res.result?.total?.desktop ?? [];
        data.mobile = res.result.total?.mobile ?? [];
        data.other = res.result.total?.other ?? [];
        data.timestamps = res.result.total?.timestamps ?? [];
        loading.value = false;
      } catch (error) {
        message.error("请求失败");
        loading.value = false;
      }
      // data.timestamps =
    });

    const option = computed(() => {
      return {
        title: {
          text: `Mobile vs Desktop`,
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
          // formatter: (params) => {
          //   const seriesName1 = params[0].seriesName || "";
          //   const value1 = (params[0]?.value[1] * 100)?.toFixed(1);
          //   const value3 = (params[2]?.value[1] * 100)?.toFixed(1);
          //   const seriesName2 = params[1].seriesName || "";
          //   const value2 = (params[1]?.value[1] * 100)?.toFixed(1);
          //   const value4 = (params[3]?.value[1] * 100)?.toFixed(1);
          //   const lastVal1 = value1 + "%" + (isRelation.value > -1 ? `(${value3}% Previous)` : "");
          //   const lastVal2 = value2 + "%" + (isRelation.value > -1 ? `(${value4}% Previous)` : "");
          //   return `<div>
          //     <div class="text-base font-semibold mb-2">${dayjs(params[0].value[0]).format("YYYY-MM-DD HH:mm:ss")}</div>
          //     <div class="mb-2"><span class="font-semibold" style="color:${params[0].color}">${seriesName1}:</span> ${lastVal1}</div>
          //     <div><span class="font-semibold" style="color:${params[1].color}">${seriesName2}:&nbsp;</span> ${lastVal2}</div>
          //   </div>`;
          // },
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
          data: ["Mobile", "Desktop", "Other"],
        },
        series: [
          {
            name: "Mobile",
            type: "line",
            stack: "总量",
            areaStyle: {},
            itemStyle: { color: token.C1 },
            lineStyle: {
              width: 3,
            },
            data: data.mobile.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), Number(n)]),
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
            name: "Desktop",
            type: "line",
            itemStyle: { color: token.C2 },
            lineStyle: {
              width: 3,
            },
            stack: "总量",
            areaStyle: {},
            data: data.desktop.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), Number(n)]),
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
          {
            name: "Other",
            type: "line",
            stack: "总量",
            itemStyle: { color: token.C3 },
            lineStyle: {
              width: 3,
              // type: "dashed", // 设置折线为虚线
              // opacity: 0.7,
            },
            data: data.other.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), Number(n)]),
            symbol: "none",
            areaStyle: {},
            z: 1,
          },
          // {
          //   name: name,
          //   type: "line",
          //   lineStyle: {
          //     width: 1,
          //     type: "dashed",
          //     // opacity: 0.7,
          //   },
          //   itemStyle: { color: token.yellow },
          //   data: data.pre_http.map((n, i) => [dayjs(data.timestamps[i]).valueOf(), n]),
          //   symbol: "none",
          // },
        ],
      };
    });
    return () => (
      <div class="h-full w-full relative">
        <div class="absolute top-2 right-4 z-10 inline-flex items-center">
          <span class="mr-1">包含机器人: </span>
          <Switch v-model:checked={isBot.value} />
        </div>
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

export default MobileVsDesktop;
