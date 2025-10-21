import { token } from "@/utils/theme";
import styled, { tw } from "@vue-styled-components/core";
import { Button, Col, Modal, Radio, Row, Segmented, Select, Switch } from "ant-design-vue";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import PeerRelation from "./components/PeerRelation";
import ProviderBar from "./components/ProviderBar";
import PeerBar from "./components/PeerBar";
import CustomerBar from "./components/CustomerBar";
import AsTable from "./components/AsTable";
import { getAsRelationList } from "@/services/as";
import HistoryBar from "./components/HistoryBar";
import { PauseOutlined, StepForwardOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";

const categoryObj = {
  1: "peer",
  2: "provider",
  3: "customer",
};

const yearNum = dayjs().year() - 1998;

const options = Array(yearNum + 1)
  .fill(0)
  .map((_, index) => {
    return {
      label: `${1998 + index}年`,
      value: index,
    };
  })
  .reverse();

const Ipv4Peer = defineComponent(
  (props) => {
    const year = ref<number>(yearNum);
    const type = ref<"IPv4" | "IPv6">("IPv4");
    const thisYear = ref<number>(yearNum);
    const isPlay = ref(false);
    // const open = ref(false);

    const data = reactive<{ nodes: any[]; links: any[]; title: string; key: string }>({
      nodes: [],
      links: [],
      title: "",
      key: "",
    });

    watchEffect(() => {
      if (props.value) {
        isPlay.value = false;
      }
    });

    watchEffect((cleanup) => {
      let timer: number = 0;
      if (isPlay.value) {
        year.value = 4;
        timer = setInterval(() => {
          if (year.value < yearNum) {
            year.value = thisYear.value + 1;
          } else {
            clearInterval(timer);
            isPlay.value = false;
          }
        }, 2000);
      } else {
        clearInterval(timer);
      }
      cleanup(() => {
        if (timer) {
          clearInterval(timer);
        }
      });
    });

    watchEffect(async () => {
      const { value } = props;
      try {
        const res = await getAsRelationList({
          asn: Number(value),
          ipType: type.value === "IPv4" ? 4 : 6,
          relatedType: -1,
          dataYear: year.value + 1998,
        });
        if (res.code !== 200) {
          throw new Error();
        }
        const nodes: any[] = [];
        const lines: any[] = [];
        res.data.forEach((item) => {
          if (item.relatedAsn === Number(value)) {
            nodes.push({
              name: value,
              asnName: item.asnName,
              // itemStyle: { color: token["red-7"] },
              category: "center",
              country: item.countryName,
              orgName: item.organizationOrgName,
              symbolSize: getSymbolSize(item.degree) + 15,
              iso: item.countryIso,
              degree: item.degree,
              label: {
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                opacity: 0.8,
              },
            });
          } else {
            nodes.push({
              name: item.relatedAsn + "",
              asnName: item.asnName,
              category: categoryObj[item.relatedType],
              relatedType: item.relatedType,
              country: item.countryName,
              orgName: item.organizationOrgName,
              iso: item.countryIso,
              degree: item.degree,
              // label: {
              //   color: "white",
              // },
              symbolSize: getSymbolSize(item.degree) + (item.relatedAsn === 4134 && year.value === 4 ? 16 : 0),
            });
            lines.push({ source: value, target: item.relatedAsn + "" });
          }
        });
        data.nodes = nodes;
        data.links = lines;
        // data.title = `中国联通全球路由直连关系（AS${value}）`;
        data.title = `全球路由直连关系（AS${value}）`;
        data.key = `${type.value}-${value})-${1998 + year.value}`;
        thisYear.value = year.value;
      } catch (error) {}
    });

    const getSymbolSize = (value: number) => {
      return Math.ceil(value / 200) + 39;
    };

    const list = computed(() => {
      return data.nodes.filter((n) => n.name !== props.value);
    });

    return () => (
      <div class="relative ">
        <div class="absolute z-10 top-4 left-4">
          <div class="mb-4">
            <Select
              class="w-[90px] mr-4 "
              options={options}
              v-model={[year.value, "value"]}
              size="small"
              placeholder="请输入截至年份"
            />

            <Radio.Group
              size="small"
              value={type.value}
              onChange={(e) => (type.value = e.target.value)}
              button-style="solid"
            >
              <Radio.Button value="IPv4">IPv4</Radio.Button>
              <Radio.Button value="IPv6">IPv6</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <Button onClick={() => (isPlay.value = !isPlay.value)}>
              {isPlay.value ? (
                <span>
                  <PauseOutlined />
                  暂停
                </span>
              ) : (
                <span>
                  <StepForwardOutlined />
                  发展史
                </span>
              )}
            </Button>
          </div>
        </div>
        <Row gutter={16}>
          <Col span={16}>
            <SContainer class="h-[900px]">
              <PeerRelation data={data} />
            </SContainer>
          </Col>
          <Col span={8}>
            <SContainer class="h-[290px]">
              <CustomerBar type={type.value} list={list.value} />
            </SContainer>
            <SContainer class="h-[290px] my-4">
              <PeerBar type={type.value} list={list.value} />
            </SContainer>
            <SContainer class="h-[290px]">
              <ProviderBar type={type.value} list={list.value} />
            </SContainer>
          </Col>
        </Row>
        <div class="h-[300px] mt-4">
          <HistoryBar value={props.value} year={year.value} type={type.value} />
        </div>
        <AsTable allList={list.value} />
      </div>
    );
  },
  {
    props: ["value"],
  },
);

export default Ipv4Peer;

const SContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${token.colorBorderSecondary};
  /* background-color: black; */
  background-color: ${token.B2};
`;
