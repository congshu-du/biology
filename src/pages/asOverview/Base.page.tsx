import { Col, Drawer, List, Row, Statistic, Table } from "ant-design-vue";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import styled, { tw } from "@vue-styled-components/core";
import { token } from "@/utils/theme";
import Ipv4Sort from "./components/base/Ipv4Sort";
import Ipv6Sort from "./components/base/Ipv6Sort";
import { getAsInfo, getAsIpprefixStatistic } from "@/services/as";
import PrefixList from "./components/base/PrefixList";
import { AsnInfoType, PrefixStatistic } from "@/services/as/interface";
// import { useRequest } from "vue-request";
import { getIPprefixUrl } from "@/utils/config";
import { useRouter } from "vue-router";

export default defineComponent<{ value: string; year: number }>(
  (props) => {
    const statistic = reactive<{ ipv4StatisticsList: PrefixStatistic[]; ipv6StatisticsList: PrefixStatistic[] }>({
      ipv4StatisticsList: [],
      ipv6StatisticsList: [],
    });
    const info = ref<AsnInfoType>();
    const open = ref(false);
    const firstOpen = ref(false);
    const router = useRouter();

    watchEffect(async () => {
      if (!props.value) return;
      try {
        const res = await getAsIpprefixStatistic(props.value);
        if (res.code !== 200) {
          throw new Error();
        }
        statistic.ipv4StatisticsList = res.data?.ipv4StatisticsList ?? [];
        statistic.ipv6StatisticsList = res.data?.ipv6StatisticsList ?? [];
      } catch (error) {}
    });

    watchEffect(async () => {
      if (!props.value) return;
      try {
        const res = await getAsInfo(props.value);
        if (res.code !== 200) {
          throw new Error();
        }
        info.value = res.data ?? undefined;
      } catch (error) {}
    });

    const PrefixCount = computed(() => {
      return {
        ipv4: statistic.ipv4StatisticsList.reduce((pre, cur) => pre + cur.prefixCount, 0),
        ipv6: statistic.ipv6StatisticsList.reduce((pre, cur) => pre + cur.prefixCount, 0),
      };
    });

    const countryIcon = computed(() => {
      const name = info.value?.asInfo?.country?.iso?.toLocaleLowerCase();
      return name === "tw" ? "cn" : name;
    });

    return () => (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <SItem>
              <Row>
                <Col span={8}>
                  <div class="h-32 py-4 pl-6">
                    <Statistic title="AS号" value={`${info.value?.asn} `} />
                  </div>
                </Col>
                <Col span={8}>
                  <div class="h-32 py-4 pl-6">
                    <Statistic title="AS名称" value={info.value?.asnName} />
                  </div>
                </Col>
                <Col span={8}>
                  <div class="h-32 py-4 pl-6">
                    <Statistic
                      title="所属国家/地区"
                      prefix={<span class={`fi fi-${countryIcon.value} text-2xl`}></span>}
                      value={info.value?.countryName === "Taiwan" ? "China-Taiwan" : info.value?.countryName}
                    ></Statistic>
                  </div>
                </Col>
                <Col span={8}>
                  <div class="h-32 py-4 pl-6">
                    <Statistic title="AS组织ID" value={info.value?.organizationOrgId} />
                  </div>
                </Col>
                <Col span={16}>
                  <div class="h-32 py-4 pl-6">
                    <Statistic
                      title="AS组织"
                      value={
                        info.value?.organizationOrgName === "CHINA UNICOM Industrial Internet Backbone"
                          ? "China Unicom Backbone"
                          : info.value?.organizationOrgName
                      }
                    />
                  </div>
                </Col>
              </Row>
            </SItem>
            <Row gutter={[16, 16]} class="mt-4 overflow-hidden ">
              <Col span={8}>
                <SStatistic class="h-30">
                  <Statistic title="AS排名" valueRender={() => <div class="text-center">{info.value?.rank}</div>} />
                </SStatistic>
              </Col>

              <Col span={8}>
                <SStatistic class="h-30">
                  <Statistic
                    title="Bogon前缀数量"
                    valueRender={() => (
                      <div class="text-center">
                        {info.value?.asBogonEventInfo.bogusPrefixesListSize ? (
                          <a onClick={() => (open.value = true)}>
                            {info.value?.asBogonEventInfo?.bogusPrefixesListSize?.toLocaleString()}
                          </a>
                        ) : (
                          0
                        )}
                      </div>
                    )}
                  />
                </SStatistic>
              </Col>
              <Col span={8}>
                <SStatistic class="h-30">
                  <Statistic
                    title="转发的Bogon前缀数量"
                    valueRender={() => (
                      <div class="text-center">
                        {info.value?.asBogonEventInfo.firstHopAsListSize ? (
                          <a onClick={() => (firstOpen.value = true)}>
                            {info.value?.asBogonEventInfo?.firstHopAsListSize?.toLocaleString()}
                          </a>
                        ) : (
                          0
                        )}
                      </div>
                    )}
                  />
                </SStatistic>
              </Col>
              <Col span={8}>
                <SStatistic class="h-30">
                  <Statistic
                    title="AS customer cone"
                    valueStyle={{ textAlign: "center" }}
                    value={info.value?.asInfo?.cone?.numberAsns}
                  />
                </SStatistic>
              </Col>
              <Col span={8}>
                <SStatistic class="h-30">
                  <Statistic title="IPV4前缀数量" valueStyle={{ textAlign: "center" }} value={PrefixCount.value.ipv4} />
                </SStatistic>
              </Col>

              <Col span={8}>
                <SStatistic class="h-30">
                  <Statistic title="IPV6前缀数量" valueStyle={{ textAlign: "center" }} value={PrefixCount.value.ipv6} />
                </SStatistic>
              </Col>
            </Row>
          </Col>

          <Col span={12}>
            <SItem>
              <Ipv4Sort data={statistic.ipv4StatisticsList} />
            </SItem>

            <SItem class="mt-4">
              <Ipv6Sort data={statistic.ipv6StatisticsList} />
            </SItem>
          </Col>
        </Row>

        <ASdiv>
          <PrefixList value={props.value} />
        </ASdiv>
        <Drawer bodyStyle={{ padding: "16px" }} title="Bogon前缀列表" v-model:open={open.value}>
          <List
            bordered
            dataSource={info.value?.asBogonEventInfo?.bogusPrefixesList}
            renderItem={({ item }) => (
              <List.Item>
                <a
                  onClick={() => {
                    window.open(getIPprefixUrl(item.ipPrefix));
                  }}
                >
                  {item.prefix}
                </a>
              </List.Item>
            )}
          />
        </Drawer>
        <Drawer bodyStyle={{ padding: "16px" }} width={500} title="转发的Bogon前缀列表" v-model:open={firstOpen.value}>
          <Table
            dataSource={info.value?.asBogonEventInfo?.firstHopAsList}
            rowKey="prefix"
            pagination={false}
            bordered
            size="middle"
            columns={[
              {
                title: "起源AS",
                dataIndex: "originAs",
                customRender: ({ text }) => (
                  <a
                    onClick={() => {
                      router.push(`/as/base?as=${text}`);
                      firstOpen.value = false;
                    }}
                  >
                    AS{text}
                  </a>
                ),
              },
              {
                title: "IP前缀",
                dataIndex: "prefix",
                customRender: ({ text }) => (
                  <a
                    onClick={() => {
                      window.open(getIPprefixUrl(text));
                    }}
                  >
                    {text}
                  </a>
                ),
              },
            ]}
          />
        </Drawer>
      </div>
    );
  },
  { props: ["value", "year"] },
);

const ASdiv = styled.div`
  ${tw`mt-4 mb-4`}
  border-radius: 8px;
  border: 1px solid ${token.colorBorderSecondary};
  background-color: ${token.B2};
`;

const SItem = styled.div`
  ${tw`h-64 rounded-lg`};
  background-color: ${token.B2};
  border: 1px solid ${token.colorBorderSecondary};
`;

const SStatistic = styled.div`
  ${tw` h-[120px] rounded-lg flex items-center justify-center`};
  background-color: ${token.B2};
  border: 1px solid ${token.colorBorderSecondary};
`;
