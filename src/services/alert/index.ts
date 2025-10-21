import { request } from "@/utils/request";
import { AlertStatisticProps, BgpmonEventSankeyType, CountryLinkProps } from "./interface";
import { AlertType } from "./interface";

export async function getAlertList(
  data: { searchEndTime: number; searchStartTime: number; eventType?: number } & API.PageParams,
) {
  return request<API.RequestPageResult<AlertType>>("/api/route-safe-service/bgpmon-event/detail/page", {
    method: "POST",
    data,
  });
}

export async function getAlertDetail(id: string) {
  return request<API.RequestResult<AlertType>>(`/api/route-safe-service/bgpmon-event/event-id/${id}`, {
    method: "GET",
  });
}

export async function getSankeyInfo(id: string) {
  return request<API.RequestResult<BgpmonEventSankeyType>>(`/api/route-safe-service/bgpmon-event/sankey/${id}`, {
    method: "GET",
  });
}

export async function getAlertStatistic(data: {
  searchEndTime: number;
  searchStartTime: number;
  eventType?: number;
  bucketType?: string;
}) {
  return request<API.RequestAllListResult<AlertStatisticProps>>("/api/route-safe-service/bgpmon-event/time-bucket", {
    method: "POST",
    data,
  });
}

export async function getAlertIprefixStatistic(data: {
  searchEndTime: number;
  searchStartTime: number;
  ipType?: number;
}) {
  return request<API.RequestAllListResult<{ prefixLength: number; count: number }>>(
    "/api/route-safe-service/dashboard/hijack/ip-prefix-count",
    {
      method: "POST",
      data,
    },
  );
}

export async function getAlertEconomyregionCountStatistic(data: {
  searchEndTime: number;
  searchStartTime: number;
  role: "VICTIM" | "ATTACKER";
}) {
  return request<API.RequestAllListResult<{ economyRegion: string; count: number }>>(
    "/api/route-safe-service/dashboard/hijack/economy-region-count",
    {
      method: "POST",
      data,
    },
  );
}

export async function getAlertHijackCountryLink(data: { searchEndTime: number; searchStartTime: number }) {
  return request<API.RequestAllListResult<CountryLinkProps>>("/api/route-safe-service/dashboard/hijack/country-link", {
    method: "POST",
    data,
  });
}
