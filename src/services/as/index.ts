import { request } from "@/utils/request";
import { AsnInfoType, AsnListType, BgpStatisticProps, BGPUpdateType, PrefixStatistic, PrefixType } from "./interface";

// export async function getAsList(data: { asns: string[] }) {
//   return request<API.RequestAllListResult<any>>("/oldapi/route-demo/as-info/asns", {
//     method: "POST",
//     data,
//   });
// }

export async function getAsInfo(as: string) {
  return request<API.RequestResult<AsnInfoType>>(`/api/route-safe-service/as-format-info/asn/${as}`, {
    method: "GET",
  });
}

export async function getAllPaths(data) {
  return request<API.RequestResult<any>>("/api/route-safe-service/cu-as-relation-path/path-info", {
    method: "POST",
    data: {
      ...data,
      // dataYear: 2024,
    },
  });
}

export async function getAsIpprefixPageList(data: { asn: string; ipType?: 4 | 6 } & API.PageParams) {
  return request<API.RequestPageResult<any>>("/api/route-safe-service/as-ip-prefix/page", {
    method: "POST",
    data,
  });
}

export async function getAsIpprefixStatistic(asn: string) {
  return request<API.RequestResult<{ ipv4StatisticsList: PrefixStatistic[]; ipv6StatisticsList: PrefixStatistic[] }>>(
    `/api/route-safe-service/as-ip-prefix/statistics/${asn}`,
    {
      method: "GET",
    },
  );
}

export async function getBogonEventStatistic(asn: string) {
  return request<API.RequestResult<{ bogusPrefixesList: any[]; bogusPrefixesListSize: number }>>(
    `/api/route-safe-service/as-format-info/bogon-event/${asn}`,
    {
      method: "GET",
    },
  );
}

export async function getCountryRegionList(data: { sourceAsn: string; hop: number; businessCode: number }) {
  return request<API.RequestAllListResult<string>>(`/api/route-safe-service/as-hop/cache/cu/many/country-region-list`, {
    method: "POST",
    data,
  });
}

export async function getCountryRegionBatchList(data: { sourceAsn: string; hop: number; businessCode: number }) {
  return request<API.RequestAllListResult<{ hop: number; countryNameList: string[] }>>(
    `/api/route-safe-service/as-hop/cache/many/country-region-list`,
    {
      method: "POST",
      data,
    },
  );
}

export async function getAsRelationList(data: {
  relatedType?: number;
  ipType?: number;
  asn?: number;
  dataYear: number;
  onlyCN?: boolean;
}) {
  return request<API.RequestAllListResult<AsnInfoType>>(`/api/route-safe-service/cu-as-relation/list`, {
    method: "POST",
    data,
  });
}

export async function getEveryYearDegree(data: {
  dataYear: number;
  relatedType?: number;
  ipType?: number;
  asn: number;
}) {
  return request<
    API.RequestAllListResult<{ dataYear: number; relatedType: number; ipType: number; totalDegree: number }>
  >(`/api/route-safe-service/cu-as-relation/every-year-degree`, {
    method: "POST",
    data,
  });
}

export async function getAsnCountryListPage(data: { asn?: string; countryName?: string } & API.PageParams) {
  return request<API.RequestPageResult<AsnListType>>(`/api/route-safe-service/rpki-common/asn-country/page`, {
    method: "POST",
    data,
  });
}

export async function getPrefixListPage(data: { asn?: string; countryName?: string } & API.PageParams) {
  return request<API.RequestPageResult<PrefixType>>(`/api/route-safe-service/rpki-common/as-ip-prefix/auth/page`, {
    method: "POST",
    data,
  });
}

export async function getBgpListPage(
  data: {
    targetAsnList?: string[];
    updateType?: "A" | "W";
    searchStartTime: number;
    searchEndTime: number;
    routePrefix?: string;
  } & API.PageParams,
) {
  return request<API.RequestPageResult<BGPUpdateType>>("/api/route-safe-service/bgp-updates/page", {
    method: "POST",
    data,
  });
}

export async function getBgpStatistic(
  data: {
    targetAsnList?: string[];
    updateType?: "A" | "W";
    searchStartTime: number;
    searchEndTime: number;
    routePrefix?: string;
  } & API.PageParams,
) {
  return request<API.RequestAllListResult<BgpStatisticProps>>("/api/route-safe-service/bgp-updates/update-type-count", {
    method: "POST",
    data,
  });
}
