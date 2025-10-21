import dayjs from "dayjs";

export const timeOptions = [
  { label: "最近10分钟", value: "now-10m~now" },
  { label: "最近30分钟", value: "now-30m~now" },
  { label: "最近1小时", value: "now-1h~now" },
  { label: "最近4小时", value: "now-4h~now" },
  { label: "最近12小时", value: "now-12h~now" },
  { label: "最近24小时", value: "now-24h~now" },
  { label: "最近7天", value: "now-7d~now" },
  { label: "最近30天", value: "now-30d~now" },
  { label: "最近60天", value: "now-60d~now" },
  { label: "最近90天", value: "now-90d~now" },
  { label: "最近120天", value: "now-120d~now" },
  { label: "最近1年", value: "now-1y~now" },
  { label: "最近2年", value: "now-2y~now" },
  { label: "最近3年", value: "now-3y~now" },
];

const unitObj: Record<string, string> = {
  m: "分钟",
  w: "周",
  h: "小时",
  d: "天",
  y: "年",
};

export const reg = /^(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}|now(?:[-+][0-9]+[mhdwy])?)$/;

export const getTimeNameArr = (val: string | undefined, options?: { label: string; value: string }[]) => {
  if (!val) return undefined;
  const timeOptionsObj = (options || timeOptions).reduce((obj: Record<string, string>, item) => {
    obj[item.value] = item.label;
    return obj;
  }, {});
  if (timeOptionsObj[val]) {
    return timeOptionsObj[val];
  }
  const arr = val.split("~");
  if (arr.length === 2) {
    return arr.map((n) => getTimeName(n));
  }
  return undefined;
};

const getTimeName = (val: string) => {
  if (/^now(?:[-+][0-9]+[mhdwy])?$/.test(val)) {
    if (val === "now") return "现在";
    const unit = val.slice(-1);
    const symbol = val.slice(3, 4);
    const num = val.slice(4, -1);
    return `${num}${unitObj[unit]}${symbol === "-" ? "之前" : "之后"}`;
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
    return val;
  }
  return undefined;
};

export const getTimestampArr = (val: string | undefined) => {
  if (val) {
    const arr = val.split("~");
    if (arr.length === 2 && reg.test(arr[0]) && reg.test(arr[1])) {
      return arr.map((n) => getTimestamp(n));
    }
  }
  return undefined;
};

export const getTimestamp = (val: string) => {
  if (/^now(?:[-+][0-9]+[mhdwy])?$/.test(val)) {
    if (val === "now") {
      return dayjs().valueOf();
    }
    const unit = val.slice(-1);
    const symbol = val.slice(3, 4);
    const num = val.slice(4, -1);
    if (symbol === "-") {
      return dayjs()
        .subtract(Number(num), unit as any)
        .valueOf();
    } else {
      return dayjs()
        .add(Number(num), unit as any)
        .valueOf();
    }
  } else {
    return dayjs(val).valueOf();
  }
};
