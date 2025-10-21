import { defineComponent, reactive, Ref } from "vue";
import { timeOptions, reg, getTimestampArr } from "./config";
import { Dayjs } from "dayjs";
import { Form, message, theme } from "ant-design-vue";
import styled, { tw } from "@vue-styled-components/core";
import { css } from "@emotion/css";

interface CusPopoverType {
  value: Ref<string | undefined>;
  open: Ref<boolean>;
  options?: { label: string; value: string }[];
}

const CusPopover = defineComponent<CusPopoverType>(
  ({ value, open, options }) => {
    const { token } = theme.useToken();

    const formData = reactive<{ startTime: string | undefined; endTime: string | undefined }>({
      startTime: undefined,
      endTime: undefined,
    });

    if (value.value) {
      const arr = value.value?.split("~");
      formData.startTime = arr[0];
      formData.endTime = arr[1];
    }

    const save = () => {
      const data = (value.value = [formData.startTime, formData.endTime].join("~"));
      const timestampArr = getTimestampArr(data);
      if (timestampArr && timestampArr[0] > timestampArr[1]) {
        message.warn("开始时间不能大于结束时间");
        return;
      }
      value.value = data;
      open.value = false;
    };

    const onChange = (val: string) => {
      value.value = val;
      open.value = false;
    };

    const changeDate = (val: Dayjs, key: "startTime" | "endTime") => {
      formData[key] = val.format("YYYY-MM-DD HH:mm:ss");
    };

    const Item = styled.div`
      ${tw`py-3 px-8 text-center cursor-pointer`};
      color: ${token.value.colorTextSecondary};
      &:hover {
        background-color: ${token.value.colorBgContainer};
      }
    `;

    const customePick = css`
      padding: 8px 8px !important;
      input {
        display: none !important;
      }
      .ant-picker-suffix {
        margin-inline-start: 0 !important;
      }
    `;

    return () => (
      <div class="w-[500px] flex h-[380px]">
        <div class="flex-1 h-full p-4">
          <Form layout="vertical" model={formData} name="validate_other" onFinish={save}>
            <div class="mb-2">开始时间</div>
            <a-row gutter={8}>
              <a-col flex="1">
                <a-form-item
                  name="startTime"
                  rules={[
                    {
                      required: true,
                      message: "开始时间必填",
                    },
                    {
                      pattern: reg,
                      message: "时间格式不正确",
                    },
                  ]}
                >
                  <a-input v-model={[formData.startTime, "value"]} placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col>
                <a-date-picker
                  allowClear={false}
                  class={customePick}
                  show-time
                  placeholder="Select Time"
                  onChange={(val: Dayjs) => changeDate(val, "startTime")}
                />
              </a-col>
            </a-row>
            <div class="mb-2">结束时间</div>
            <a-row gutter={8}>
              <a-col flex="1">
                <a-form-item
                  name="endTime"
                  rules={[
                    {
                      required: true,
                      message: "结束时间必填",
                    },
                    {
                      pattern: reg,
                      message: "时间格式不正确",
                    },
                  ]}
                >
                  <a-input v-model={[formData.endTime, "value"]} placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col>
                <a-date-picker
                  allowClear={false}
                  class={customePick}
                  show-time
                  placeholder="Select Time"
                  onChange={(val: Dayjs) => changeDate(val, "endTime")}
                />
              </a-col>
            </a-row>
            <a-form-item>
              <a-button html-type="submit" type="primary">
                确定
              </a-button>
            </a-form-item>
          </Form>
        </div>
        <div
          style={{ background: token.value.colorFillTertiary }}
          class="w-[194px] h-full bg-[#F7F8F9] overflow-y-auto scrollbar-w-0"
        >
          {(options ?? timeOptions).map((item) => (
            <Item onClick={() => onChange(item.value)} key={item.value}>
              {item.label}
            </Item>
          ))}
        </div>
      </div>
    );
  },
  { props: ["value", "open", "options"] },
);

export default CusPopover;
