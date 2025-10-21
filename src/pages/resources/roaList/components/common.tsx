import { token } from "@/utils/theme";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";

export const getStatusUi = (status?: number) => {
  if (status === null || status === undefined) {
    return "";
  } else if (status === 2) {
    return (
      <div
        style={{ border: token.colorSuccessBorder, background: token.colorSuccessBg, color: token.colorSuccess }}
        class="justify-center items-center py-1 px-3 gap-1 rounded inline-block"
      >
        <SafetyCertificateOutlined /> 已授权
      </div>
    );
  } else if (status === 1) {
    return (
      <div
        style={{ border: token["gold-3"], background: token["gold-1"], color: token["gold-6"] }}
        class=" justify-center items-center py-1 px-3 gap-1 rounded inline-block"
      >
        <CheckCircleOutlined /> 已认证
      </div>
    );
  } else if (status === 0) {
    return (
      <div
        style={{ border: token["orange-3"], background: token["orange-1"], color: token["orange-6"] }}
        class=" justify-center items-center py-1 px-3 gap-1 rounded inline-block"
      >
        <WarningOutlined /> 未认证
      </div>
    );
  } else if (status === -1) {
    return (
      <div
        style={{ border: token.colorErrorBorder, background: token.colorErrorBg, color: token.colorError }}
        class=" justify-center items-center py-1 px-3 gap-1 rounded inline-block"
      >
        <WarningOutlined /> 已过期
      </div>
    );
  } else if (status === -2) {
    return (
      <div
        style={{ border: token["volcano-3"], background: token["volcano-1"], color: token["volcano-6"] }}
        class=" justify-center items-center py-1 px-3 gap-1 rounded inline-block"
      >
        <RollbackOutlined /> 已撤销
      </div>
    );
  }
};

export const statusOptions = [
  {
    label: "已授权",
    value: 2,
  },
  {
    label: "已认证",
    value: 1,
  },
  {
    label: "已过期",
    value: -1,
  },
  {
    label: "已撤销",
    value: -2,
  },
  {
    label: "未认证",
    value: 0,
  },
];
