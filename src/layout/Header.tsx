import { DownOutlined, FullscreenOutlined, UserOutlined } from "@ant-design/icons-vue";
import { Avatar, Divider, Dropdown, Menu, Space } from "ant-design-vue";
import { computed, defineComponent } from "vue";
import { token } from "@/utils/theme";
// import LiantongSvg from "@/assets/svgs/liantong.svg";
import logo from "@/assets/img/logo2.png";
import styled, { tw } from "@vue-styled-components/core";
import { useRoute, useRouter } from "vue-router";
import { IconSvg } from "@/components/icon/Index";
import { useFullScreen } from "@/store";

const SwitchCom = defineComponent<{ value: boolean; onChange: (e: boolean) => void; token: any }>(
  ({ value, onChange, token }) => {
    return () => (
      <div
        style={{ border: `1px solid ${token.colorBorder}`, background: token.colorFill }}
        class="flex items-center rounded-3xl cursor-pointer"
        onClick={() => onChange(!value)}
      >
        <div
          style={{ background: token.B1, opacity: value ? 1 : 0 }}
          class="h-[22px] w-6 rounded-3xl flex justify-center items-center"
        >
          <IconSvg type="moon" class="text-[16px]" />
        </div>
        <div
          style={{ background: token.B1, opacity: value ? 0 : 1 }}
          class="h-[22px] w-6 rounded-3xl flex justify-center items-center"
        >
          <IconSvg type="sun" class="text-[16px]" />
        </div>
      </div>
    );
  },
  { props: ["value", "onChange", "token"] },
);

const Header = defineComponent(() => {
  const fullScreen = useFullScreen();
  const router = useRouter();
  const location = useRoute();
  const selectedKeys = computed(() => {
    const paths = location.matched.slice(1).map((item) => item.path);
    return paths;
  });

  const items = [
    { key: "/", label: "仪表盘" },
    { key: "/alert", label: "告警列表" },
    {
      key: "/dataPlatform",
      label: "数据平台",
      children: [
        { key: "/dataPlatform/bgp", label: "路由数据" },
        { key: "/dataPlatform/server", label: "服务数据" },
        { key: "/dataPlatform/detection", label: "探测数据" },
      ],
    },
    // {
    //   key: "/routeData",
    //   label: (
    //     <span>
    //       <span class="mr-2">数据平台</span>
    //       <DownOutlined class="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.8)" }} />
    //     </span>
    //   ),
    //   popupOffset: [-18, 4],
    //   theme: "light",
    //   children: [
    //     { key: "/routeData/data", label: "数据采集点" },
    //     { key: "/routeData/malicious", label: "恶意自治域分布" },
    //     { key: "/routeData/longshortmalicious", label: "长短时恶意自治域分布" },
    //   ],
    // },
    // { key: "/interconnection", label: "全球互联态势" },
    { key: "/as", label: "AS概览" },
    // {
    //   key: "/analysis",
    //   label: (
    //     <span>
    //       <span class="mr-2">分析工具</span>
    //       <DownOutlined class="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.8)" }} />
    //     </span>
    //   ),
    //   popupOffset: [-18, 4],
    //   theme: "light",
    //   children: [
    //     { key: "/analysis/georel", label: "AS地理商业关系" },
    //     // { key: "/analysis/spreadpath", label: "BGP路由传播路径" },
    //     { key: "/analysis/asconnection", label: "AS互联关系" },
    //     { key: "/analysis/ipaddrspace", label: "IP空间矩阵" },
    //     { key: "/analysis/pcp", label: "AS多元属性分析" },
    //     { key: "/analysis/aspath", label: "AS路径图" },
    //   ],
    // },
    // {
    //   key: "/resources",
    //   label: (
    //     <span>
    //       {/* <SettingOutlined /> */}
    //       <span class="mr-2 ml-1">RPKI资源管理</span>
    //       <DownOutlined class="text-[10px]" style={{ color: token.colorTextTertiary }} />
    //     </span>
    //   ),
    //   popupOffset: [-18, 4],
    //   theme: "light",
    //   children: [
    //     { key: "/resources/bgp", label: "路由器BGP消息" },
    //     { key: "/resources/roa", label: "ROA与地址证书管理" },
    //     { key: "/resources/prefix", label: "IP前缀RPKI状态" },
    //   ],
    // },
    { key: "/digital-twin", label: "处置演练" },
    {
      key: "/setting",
      label: "系统设置",
      children: [
        { key: "/setting/probe", label: "探针列表" },
        { key: "/setting/detectionSource", label: "检测源" },
        { key: "/setting/whitelist", label: "监测白名单" },
      ],
    },
  ];

  const changePath = (path: string) => {
    router.push(path);
  };

  const Sitem = styled("div", { checked: Boolean, token: Object as any })`
    ${tw`h-9 flex items-center justify-center px-4`}
    cursor: pointer;
    border-radius: 8px;
    color: #ffffff;
    background-color: ${(p) => (p.checked ? "rgba(255, 255, 255, 0.25)" : "transparent")};
    box-shadow: ${(p) => (p.checked ? "0px 6px 32px 0px rgba(147, 160, 255, 0.3)" : "")};
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `;

  return () => (
    <div
      style={{
        paddingInline: "20px",
        color: "#ffffff",
        background: "linear-gradient(135deg, #1a59b0, #71a6e1)",
        // background: "#157BC6",
      }}
      class={"flex px-6 items-center fixed z-50 w-full h-16"}
    >
      <div class=" inline-flex items-center">
        <img style={{ height: "50px" }} src={logo} />
        {/* <LiantongSvg style={{ fill: token.colorText }} color={token.colorText} /> */}
        <span class="ml-4 text-xl inline-flex items-center text-white">重要生物信息平台断网监控</span>
      </div>
      <div class="flex-1 flex justify-center">
        <div
          style={{
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.15)",
            // border: `1px solid ${token.BL2}`,
            padding: "4px",
          }}
          class="flex gap-[2px] items-center"
        >
          {items.map((n) => (
            <Dropdown
              open={n.children && n.children.length > 0 ? undefined : false}
              overlay={
                <div class="pt-1">
                  <Menu
                    onClick={(e) => changePath(e.key as string)}
                    selectedKeys={selectedKeys.value}
                    items={n.children}
                  />
                </div>
              }
            >
              <Sitem token={token} checked={selectedKeys.value.includes(n.key)} onClick={() => changePath(n.key)}>
                {n.label}
              </Sitem>
            </Dropdown>
          ))}
        </div>
      </div>

      <div>
        <Space align="center">
          {/* <Button onClick={changeLang} type="primary" size="small">
          {t("lang")}
        </Button>
        <Divider type="vertical" class="mx-1" /> */}
          {/* <Button icon={} onClick={() => (fullScreen.full = true)}></Button> */}
          <FullscreenOutlined
            style={{ fontSize: "18px", verticalAlign: "middle", color: "#ffffff" }}
            onClick={() => (fullScreen.full = true)}
          />
          <Divider type="vertical" class="mx-1" />
          {/* <SwitchCom
            token={token}
            value={localStorage.getItem("theme") === "dark"}
            onChange={(e) => {
              localStorage.setItem("theme", e ? "dark" : "light");
              window.location.reload();
            }}
          />
          <Divider type="vertical" class="mx-1" /> */}
          <Dropdown
            placement="bottomLeft"
            open={false}
            overlay={
              <Menu>
                <Menu.Item onClick={() => router.push("/register")}>注册账号</Menu.Item>
                <Menu.Item onClick={() => router.push("/login")}>退出登录</Menu.Item>
              </Menu>
            }
          >
            <span class="flex items-center cursor-pointer pr-3 text-white">
              <Avatar
                style={{ background: "rgba(255, 255, 255, 0.3)" }}
                size={24}
                class="mr-2"
                icon={<UserOutlined />}
              />{" "}
              <span>admin</span>
            </span>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
});

export default Header;
