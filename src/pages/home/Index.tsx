import DatePicker from "@/components/datePicker/Index";
import Relationship from "./components/Relationship";
import Ipv6Sort from "./components/Ipv6Sort";
import Ipv4Sort from "./components/Ipv4Sort";
import { defineComponent, ref } from "vue";
import HijackerCountry from "./components/HijackerCountry";
import HijackedCountry from "./components/HijackedCountry";
// import Statistic1 from "./components/Statistic1";
// import Statistic2 from "./components/Statistic2";
// import Statistic3 from "./components/Statistic3";
// import Statistic4 from "./components/Statistic4";
import { theme } from "ant-design-vue";
import styled from "@vue-styled-components/core";
/**
 * src/pages/home/Index.tsx: 首页组件
 *
 * @description 应用的首页组件，包含日期选择器、统计图表和其他信息
 * @author [您的名字]
 */
const Home = defineComponent(() => {
  // watchEffect(async ()=>{
  //   const res = await getRoaInfo();
  //   console.log(res, 444333);
  // })

  const time = ref<string>("now-7d~now");

  /**
   * 主题 token
   *
   * @description ant-design-vue 主题 token
   * @type {object}
   */
  const { token } = theme.useToken();

  /**
   * Item 组件
   *
   * @description 自定义 Item 组件，用于展示统计图表
   * @type {JSX.Element}
   */
  const Item = styled.div`
    border-radius: 8px;
    border: 1px solid ${token.value.colorBorderSecondary};
    background-color: ${token.value.B2};
  `;
  return () => (
    <div class="p-4">
      <div class="mb-4">
        <DatePicker value={time} placement="bottomLeft" />
      </div>
      <a-row gutter={[16, 16]}>
        <a-col span={16}>
          <Item class="w-full" style={{ height: "816px" }}>
            <Relationship time={time.value} />
          </Item>
        </a-col>
        <a-col span={8}>
          <Item class="w-full" style={{ height: "400px" }}>
            <Ipv6Sort time={time.value} />
          </Item>
          <Item class="w-full mt-4" style={{ height: "400px" }}>
            <Ipv4Sort time={time.value} />
          </Item>
        </a-col>
      </a-row>
      <a-row class="mt-4" gutter={[16, 16]}>
        <a-col span={12}>
          <Item class="w-full" style={{ height: "400px" }}>
            <HijackerCountry time={time.value} />
          </Item>
        </a-col>
        <a-col span={12}>
          <Item class="w-full" style={{ height: "400px" }}>
            <HijackedCountry time={time.value} />
          </Item>
        </a-col>
      </a-row>
      {/* <a-row class="mt-4" gutter={[16, 16]}>
        <a-col span={6}>
          <Item class="w-full" style={{ height: "300px" }}>
            <Statistic1 />
          </Item>
        </a-col>
        <a-col span={6}>
          <Item class="w-full" style={{ height: "300px" }}>
            <Statistic2 />
          </Item>
        </a-col>
        <a-col span={6}>
          <Item class="w-full" style={{ height: "300px" }}>
            <Statistic3 />
          </Item>
        </a-col>
        <a-col span={6}>
          <Item class="w-full" style={{ height: "300px" }}>
            <Statistic4 />
          </Item>
        </a-col>
      </a-row> */}
    </div>
  );
});

export default Home;
