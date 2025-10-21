import { computed, defineComponent, Ref, ref } from "vue";
import CPopover from "./Popover";
import { getTimeNameArr } from "./config";
import { CalendarOutlined, DownOutlined } from "@ant-design/icons-vue";
import { Popover, theme } from "ant-design-vue";
import styled, { tw } from "@vue-styled-components/core";
import { TooltipPlacement } from "ant-design-vue/es/tooltip";

export { getTimestampArr } from "./config";

interface CustomDatePickerType {
  value: Ref<string | undefined>;
  placement?: TooltipPlacement | undefined;
  options?: { label: string; value: string }[];
}

const CustomDatePicker = defineComponent<CustomDatePickerType>(
  ({ value, placement, options }) => {
    const { token } = theme.useToken();
    const open = ref(false);

    const timeArr = computed(() => getTimeNameArr(value.value, options));

    const changeStatus = (visible: boolean) => {
      open.value = visible;
    };
    const Box = styled.div`
      ${tw`px-3 h-8 rounded-md cursor-pointer  inline-flex items-center`}
      border: 1px solid ${token.value.colorBorder};
      background: ${token.value.colorFillQuaternary};
      &:hover {
        border: 1px solid ${token.value.colorPrimary};
      }
    `;

    const getComponent = () => {
      if (!timeArr.value) {
        return <span style={{ color: token.value.colorTextQuaternary }}>请选择时间</span>;
      } else if (typeof timeArr.value === "string") {
        return <span>{timeArr.value}</span>;
      } else {
        return (
          <span>
            {timeArr.value[0]} ~ {timeArr.value[1]}
          </span>
        );
      }
    };
    return () => (
      <div>
        <Popover
          destroyTooltipOnHide={true}
          trigger="click"
          overlayInnerStyle={{ padding: 0 }}
          onOpenChange={changeStatus}
          open={open.value}
          placement={placement}
          content={
            <div>
              <CPopover value={value} open={open} options={options} />
            </div>
          }
        >
          <Box>
            <CalendarOutlined
              class="mr-2 text-[16px] mb-[2px]"
              style={{ color: token.value.colorTextSecondary, verticalAlign: "bottom" }}
            />
            {getComponent()}
            <DownOutlined
              style={{ color: token.value.colorIcon, fontSize: "12px", marginLeft: "8px" }}
              rotate={open.value ? 180 : 0}
            />
          </Box>
        </Popover>
      </div>
    );
  },
  { props: ["value", "placement", "options"] },
);

export default CustomDatePicker;
