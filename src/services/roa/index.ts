import { request } from "@/utils/request";
import { BgpInfoType, CaFileType, RoaType } from "./interface";

export async function getRoaListPage(data) {
  return request<API.RequestPageResult<RoaType>>(`/api/route-safe-service/rpki-common/roa-ca/page`, {
    method: "POST",
    data,
  });
}

export async function addCaFile(data) {
  return request<API.RequestPageResult<RoaType>>(`/api/route-safe-service/rpki-common/ca/auth`, {
    method: "POST",
    data,
  });
}

export async function updateCaFile(data) {
  return request<API.RequestResult<any>>(`/api/route-safe-service/rpki-common/ca-file`, {
    method: "PUT",
    data,
  });
}

export async function getCafileListPage(data) {
  return request<API.RequestPageResult<CaFileType>>(`/api/route-safe-service/rpki-common/ca-file/base/page`, {
    method: "POST",
    data,
  });
}

export async function getCafileDetail(caId) {
  return request<API.RequestResult<CaFileType>>(`/api/route-safe-service/rpki-common/ca-file/${caId}`, {
    method: "GET",
  });
}

export async function getAllCountryList() {
  return request<API.RequestAllListResult<{ countryIso: string; countryName: string }>>(
    `/api/route-safe-service/rpki-common/country-list`,
    {
      method: "GET",
    },
  );
}

export async function saveRoaAuthorized(data: {
  asn: number;
  caId: number;
  id?: number;
  ipPrefix: string;
  maxPrefixLength: number;
}) {
  return request<API.RequestPageResult<RoaType>>(`/api/route-safe-service/rpki-common/roa/authorized`, {
    method: "POST",
    data,
  });
}

export async function revokeRoaAuthorized(id: number) {
  return request<API.RequestPageResult<RoaType>>(`/api/route-safe-service/rpki-common/roa-ca/revoke/${id}`, {
    method: "PUT",
  });
}

export async function getBgpDataPage(
  data: {
    asn: number | undefined;
    ipPrefix: string | undefined;
    roaVerify: number | undefined;
    searchEndTime: number | undefined;
    searchStartTime: number | undefined;
  } & API.PageParams,
) {
  return request<API.RequestPageResult<BgpInfoType>>(`/api/route-safe-service/rpki-common/bgp/page`, {
    method: "POST",
    data,
  });
}
