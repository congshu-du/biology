import { getTimestampArr } from "@/components/datePicker/Index";
import CEchart from "@/components/echart/Cechart";
import { getAlertStatistic } from "@/services/alert";
import { token } from "@/utils/theme";
import { BarChartOutlined, DownOutlined } from "@ant-design/icons-vue";
import styled, { tw } from "@vue-styled-components/core";
import { Button, Col, Divider, Popover, Row, Space } from "ant-design-vue";
import { computed, defineComponent, ref, watchEffect } from "vue";
import { timeDimensionObj } from "@/services/alert/contant";
import { AlertStatisticProps } from "@/services/alert/interface";
import dayjs from "dayjs";

/**
 * 时间维度列表
 *
 * @description 时间维度列表
 * @type {Array<{ value: string, label: string, number: number }>}
 */
const timeList = [
  {
    value: "10minutes",
    label: timeDimensionObj.MINUTE_10,
    number: 10 * 60 * 1000,
  },
  {
    value: "1hour",
    label: timeDimensionObj.HOUR,
    number: 60 * 60 * 1000,
  },
  {
    value: "1day",
    label: timeDimensionObj.DAY,
    number: 24 * 60 * 60 * 1000,
  },
  {
    value: "1month",
    label: timeDimensionObj.MONTH,
    number: 30 * 24 * 60 * 60 * 1000,
  },
];

/**
 * 事件统计组件
 *
 * @description 事件统计组件
 * @returns {JSX.Element} 事件统计组件的 JSX 元素
 */
const AlertStatistic = defineComponent<{ time: string; type: number; search: any }>(
  (props) => {
    const loading = ref(false);
    const isShowChart = ref(true);
    const data = ref<AlertStatisticProps[]>([]);
    const options = ref<{ label: string; value: string }[]>([]);
    const gran = ref("1day");

    watchEffect(() => {
      const timestampArr = getTimestampArr(props.time);
      const timestamp = timestampArr![1] - timestampArr![0];
      const _options = timeList.filter((n) => {
        return n.number <= timestamp && timestamp / n.number <= 100;
      });
      options.value = _options;
      gran.value = _options[0]?.value;
    });

    watchEffect(async () => {
      try {
        const timestampArr = getTimestampArr(props.time);
        loading.value = true;
        const res = await getAlertStatistic({
          searchStartTime: timestampArr![0],
          searchEndTime: timestampArr![1],
          eventType: props.type,
          bucketType: gran.value,
          ...props.search,
        });
        if (res.code !== 200) {
          throw new Error();
        }
        data.value = res.data ?? [];
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    });
    const option = computed(() => ({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      // legend: {},
      grid: {
        left: "16px",
        right: "16px",
        bottom: "8px",
        top: "16px",
        containLabel: true,
      },
      xAxis: {
        show: data.value.length > 0,
        type: "time",
        // data: data.value.map((n) => dayjs(n.timeBucket).valueOf()),
      },

      yAxis: {
        show: data.value.length > 0,
        type: "value",
        splitNumber: 3,
        // interval: 3,
      },
      graphic: {
        invisible: data.value.length !== 0,
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: loading.value ? "加载中..." : "暂无数据",
          fontSize: 14,
          fill: token.colorTextQuaternary,
        },
      },
      series: [
        {
          data: data.value.map((n) => ({ value: [dayjs(n.timeBucket).valueOf(), n.eventCount] })),
          name: "告警数量",
          itemStyle: {
            color: token.C1,
          },
          barMinHeight: 1,
          // barCategoryGap: "2px",
          type: "bar",
        },
      ],
    }));
    return () => (
      <div>
        <Space.Compact class="absolute top-[15px] left-4 z-10 ">
          <Button
            type={isShowChart.value ? "primary" : "default"}
            onClick={() => (isShowChart.value = !isShowChart.value)}
            icon={<BarChartOutlined />}
          ></Button>
          <Popover
            placement="bottomLeft"
            trigger={isShowChart.value ? "hover" : "contextmenu"}
            content={
              isShowChart.value ? (
                <div>
                  <div class=" font-semibold">时间粒度</div>
                  <Divider class="my-2" />
                  <Row gutter={[8, 8]} class="w-60">
                    {options.value.map(({ value, label }) => (
                      <Col key={value} span={8}>
                        <Item
                          style={{ backgroundColor: gran.value === value ? token.colorPrimary : "" }}
                          onClick={() => (gran.value = value)}
                        >
                          {label}
                        </Item>
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : null
            }
          >
            <Button disabled={isShowChart.value === false} icon={<DownOutlined />} />
          </Popover>
        </Space.Compact>

        {isShowChart.value && (
          <div style={{ border: `1px solid ${token.colorBorder}` }} class=" mt-4 h-32 rounded-md">
            <CEchart class="h-full w-full" option={option.value} autoresize />
          </div>
        )}
      </div>
    );
  },
  { props: ["time", "type", "search"] },
);

export default AlertStatistic;

const Item = styled.div`
  ${tw`flex justify-center items-center h-8 rounded-lg cursor-pointer`};
  background-color: ${token.colorFillTertiary};
`;
