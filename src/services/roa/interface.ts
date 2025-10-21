/**
 * RoaCaInfoQuery, ROA-CA-信息查询请求体
 */
export interface RoaType {
  asn?: number;
  /**
   * 认证授权状态：-1:过期，0：初始状态，1：已认证，2：已授权
   */
  authStatus: number;
  /**
   * CA证书表主键ID
   */
  caId: number;
  createTime?: Date;
  createUser?: string;
  /**
   * 生效结束时间
   */
  effectiveEndTime?: Date;
  /**
   * 生效起始时间
   */
  effectiveStartTime?: Date;
  /**
   * 主键ID
   */
  id?: number;
  /**
   * IP前缀
   */
  ipPrefix?: string;
  /**
   * 4:IPv4,6:IPv6
   */
  ipType?: number;
  isDelete?: number;
  /**
   * IP前缀
   */
  maxPrefixLength?: number;
  /**
   * 掩码长度
   */
  prefixLength?: number;
  /**
   * RIR机构
   */
  rir?: string;
  updateTime?: Date;
  updateUser?: string;
}

export interface CaFileType {
  /**
   * CA证书地址
   */
  caFile?: string;
  /**
   * CA证书名称
   */
  caFileName: string;
  /**
   * 主键ID
   */
  id: number;
  asnList?: number[];

  createTime?: Date;
  createUser?: string;
  /**
   * 生效结束时间
   */
  effectiveEndTime?: Date;
  /**
   * 生效起始时间
   */
  effectiveStartTime?: Date;

  /**
   * ip前缀列表
   */
  ipPrefixList?: string[];
  isDelete?: number;
  updateTime?: Date;
  updateUser?: string;
  caFileMd5?: string;
}

export interface BgpInfoType {
  asn?: number;
  createTime?: Date;
  id?: number;
  ipPrefix?: string;
  ipType?: number;
  nextHop?: string;
  prefixLength?: number;
  rir?: string;
  roaInfo?: string;
  roaVerify?: number;
  startTime?: Date;
  [property: string]: any;
}
