export const getIPprefixUrl = (ipPrefix: string) => {
  // return `https://stat.ripe.net/app/launchpad/S1_${encodeURIComponent(ipPrefix)}_C13C31C20eC6C7C1eC18C29C30C14eC17C24eC27C2C21eC37C16C11C10`;
  return `https://stat.ripe.net/resource/${ipPrefix}#tab=overview`;
};

export const getDuration = (duration: number) => {
  let seconds = Math.ceil(duration / 1000); // 转换为总秒数

  const days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24); // 剩余秒数

  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;

  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  if (seconds > 0) parts.push(`${seconds}秒`);

  if (parts.length === 0) return "1秒";

  return parts.join("");
};
