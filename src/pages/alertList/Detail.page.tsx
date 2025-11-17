import Cechart, { colorList } from "@/components/echart/Cechart";
import { getAlertDetail, getSankeyInfo } from "@/services/alert";
import { typeOptions } from "@/services/alert/contant";
import { AlertType, BgpmonEventSankeyType } from "@/services/alert/interface";
import { getDuration, getIPprefixUrl } from "@/utils/config";
import { token } from "@/utils/theme";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import styled, { tw } from "@vue-styled-components/core";
import { Button, Descriptions, Skeleton, Space, Tag, Tooltip } from "ant-design-vue";
import dayjs from "dayjs";
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Graph, alg } from "@dagrejs/graphlib";

const Detail = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const info = ref<AlertType>();
  const sankeyData = ref<BgpmonEventSankeyType>();

  watchEffect(async () => {
    try {
      loading.value = true;
      const result = await getAlertDetail(route.query.eventId as string);
      if (result.code !== 200) {
        throw new Error();
      }
      info.value = result.data ?? undefined;
      const res = await getSankeyInfo(route.query.eventId as string);
      if (res.code !== 200) {
        throw new Error();
      }
      const gra = new Graph({ directed: true, multigraph: false });
      res.data?.data.forEach((n) => {
        gra.setNode(n.name);
      });
      res.data?.links.forEach((n) => {
        gra.setEdge(n.source, n.target);
      });

      if (alg.isAcyclic(gra)) {
        sankeyData.value = res.data ?? undefined;
      } else {
        const cycleList: string[] = [];
        const removeCycle = () => {
          const cycles = alg.findCycles(gra);
          if (cycles.length > 0) {
            for (const cycle of cycles) {
              const cycleStr = cycle.join("-");
              if (!cycleList.includes(cycleStr)) {
                gra.removeEdge(cycle[0], cycle.at(-1)!);
                cycleList.push(cycleStr);
              } else {
                for (let i = 0; i < cycle.length; i++) {
                  for (let j = i + 1; j < cycle.length; j++) {
                    gra.removeEdge(cycle[i], cycle[j]);
                  }
                }
              }
            }
          }
          if (!alg.isAcyclic(gra)) {
            removeCycle();
          }
        };
        removeCycle();

        const links = gra.edges().map((n) => {
          const info = res.data?.links.find((item) => item.source === n.v && item.target === n.w);
          return { source: n.v, target: n.w, ...info };
        });
        sankeyData.value = {
          data: res.data?.data ?? [],
          links: links as BgpmonEventSankeyType["links"],
          relatedBgpData: res.data?.relatedBgpData ?? [],
        };
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  });

  const getTag = (text: number) => {
    let color = token.red;
    const label = typeOptions.find((item) => item.value === text)?.label;
    if (text === 1) {
      color = token.orange;
    } else if (text === 2) {
      color = token.cyan;
    }
    return <Tag color={color}>{label}</Tag>;
  };

  const getAsLink = (text, countryIso) => {
    if (!text) return "-";
    const country = countryIso?.toLowerCase();
    return (
      <span class="inline-flex items-center ">
        <span hidden={!country} class={`text-2xl fi fi-${country} mr-2`}></span>{" "}
        <a onClick={() => router.push(`/as/base?as=${text}`)}>AS{text}</a>
      </span>
    );
  };

  const getDurations = (record: AlertType | undefined) => {
    if (!record?.eventStartTime || !record?.eventEndTime) return "-";
    return getDuration(dayjs(record?.eventEndTime).valueOf() - dayjs(record?.eventStartTime).valueOf());
  };

  const option = computed(() => {
    const obj = sankeyData.value?.data.reduce((acc, cur) => {
      acc[cur.name] = cur.countryIso?.toLowerCase();
      return acc;
    }, {});

    const _option = {
      tooltip: {
        formatter: (params) => {
          if (params.dataType === "edge") {
            const country1 = obj?.[params.data.source];
            const country2 = obj?.[params.data.target];

            return `<span>
            <span class="text-xl fi fi-${country1} mr-1"></span>${params.data.source} <span class="mx-2 text-lg font-semibold" style="color:${token["orange"]}">←</span> <span class="text-xl fi fi-${country2} mr-1"></span>${params.data.target}</span> <a class=" ml-5">${params.data.value}</a>`;
          } else if (params.dataType === "node") {
            const country = obj?.[params.data.name];
            return `<span>
            <span class="text-xl fi fi-${country} mr-1"></span>${params.data.name}</span>`;
          }
        },
      },
      color: colorList,
      series: {
        type: "sankey",
        layout: "none",
        emphasis: {
          // focus: "adjacency",
          // focus: "none",
          opacity: 1,
        },
        left: "16px",
        right: "60px",
        bottom: "20px",
        top: "20px",
        draggable: false,
        lineStyle: {
          opacity: 0.7, // 设置线条透明度
        },
        data: sankeyData.value?.data ?? [],
        links:
          sankeyData.value?.links?.map((n) => ({
            ...n,
            lineStyle: {
              opacity: 0.7,
              color: n.type === 1 ? token["red"] : n.type === 2 ? token["orange"] : token.colorFill,
            },
            emphasis: {
              lineStyle: {
                opacity: 1, // 鼠标悬浮时的透明度
              },
            },
          })) ?? [],
      },
      graphic: {
        invisible: sankeyData.value?.data.length !== 0,
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: loading.value ? "加载中..." : "暂无数据",
          fontSize: 14,
          fill: token.colorTextQuaternary,
        },
      },
    };
    return _option;
  });

  const doDownload = () => {
    const data = JSON.stringify(sankeyData.value?.relatedBgpData);
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bgp_data.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    // window.open(url);
    // URL.revokeObjectURL(url);
  };

  return () => (
    <div class="min-h-full p-4 pt-0">
      <Skeleton paragraph={{ rows: 30 }} loading={loading.value} active>
        <div class="h-12 flex justify-between items-center mb-2">
          <div class="inline-flex items-center">
            <a onClick={() => router.back()} class="mr-2 flex items-center ">
              <ArrowLeftOutlined class="text-lg translate-y-[-2px] translate-x-[-2px]" />
              {/* <span style={{ fontSize: "16px" }}>返回</span> */}
            </a>
            <span class="text-base ">告警详情</span>
          </div>
          <Button onClick={() => router.push("/alert/playback?eventId=" + route.query.eventId)}>告警回放</Button>
        </div>
        <div class="mb-4 pl-[2px]">
          <div class=" text-base  inline-flex items-center">
            <div class="inline-block w-1 h-4 mr-2" style={{ background: token.geekblue }} />
            <span>基本信息</span>
          </div>
        </div>

        <DetailDiv class="mb-4 pt-4">
          <Descriptions>
            <Descriptions.Item label="告警类型">{getTag(info.value?.eventType ?? 1)}</Descriptions.Item>
            <Descriptions.Item label="告警ID">{info.value?.eventId}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(info.value?.startTime).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
            {info.value?.eventType === typeOptions[0].value && (
              <>
                <Descriptions.Item label="劫持者AS号">
                  {getAsLink(info.value?.attackerAsn, info.value?.attackerAs?.countryIso)}
                </Descriptions.Item>

                <Descriptions.Item label="受害者AS号">
                  {getAsLink(info.value?.victimAsn, info.value?.victimAs?.countryIso)}
                </Descriptions.Item>
                <Descriptions.Item label="劫持前缀">
                  {info.value?.prefix ? (
                    <a onClick={() => window.open(getIPprefixUrl(info.value?.prefix as string))}>
                      {info.value?.prefix}
                    </a>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
              </>
            )}
            {info.value?.eventType === typeOptions[1].value && (
              <>
                <Descriptions.Item label="泄露方">
                  {getAsLink(info.value?.leakByAsn, info.value?.leakByAs?.countryIso)}
                </Descriptions.Item>
                <Descriptions.Item label="泄露给">
                  {info.value?.leakToAsnList.map((item: any) => {
                    const country = info.value?.leakToAsList?.find((n) => n.asn === item)?.countryIso?.toLowerCase();
                    return getAsLink(item, country);
                  })}
                </Descriptions.Item>
              </>
            )}
            {info.value?.eventType === typeOptions[2].value && (
              <Descriptions.Item label="中断方">
                {getAsLink(info.value?.outageAsn, info.value?.outageAs?.countryIso)}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="开始时间">
              {info.value?.eventStartTime ? dayjs(info.value?.eventStartTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {info.value?.eventEndTime ? dayjs(info.value?.eventEndTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="时长">{getDurations(info.value)}</Descriptions.Item>
            <Descriptions.Item span={3} label="同谋方">
              <Space>
                {info.value?.conspiratorList?.map((n) => <a onClick={() => router.push(`/as/base?as=${n}`)}>AS{n}</a>)}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </DetailDiv>
        <div class="mb-4 text-base  inline-flex items-center  pl-[2px]">
          <div class="inline-block w-1 h-4 mr-2" style={{ background: token.geekblue }} />
          <span>告警轨迹</span>
        </div>
        <DetailDiv
          class="pt-0 min-h-[400px] relative"
          style={{ height: (sankeyData.value?.data?.length ?? 0) * 16 + "px" }}
        >
          <div class="absolute top-1 right-2 z-10">
            <Tooltip title="下载">
              <Button
                disabled={(sankeyData.value?.relatedBgpData?.length ?? 0) === 0}
                onClick={doDownload}
                icon={<DownloadOutlined style={{ fontSize: "16px" }} />}
                type="link"
              ></Button>
            </Tooltip>
          </div>
          <Cechart class="h-full" option={option.value} autoresize />
        </DetailDiv>
      </Skeleton>
    </div>
  );
});

export default Detail;

const DetailDiv = styled.div`
  ${tw`rounded-lg px-4`}
  border: 1px solid ${token.colorBorderSecondary};
  background-color: ${token.B2};
`;
