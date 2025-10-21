export interface PrefixStatistic {
  prefixLength: number;
  prefixCount: number;
}

export interface AsnInfoType {
  asn: number;
  asnName: string;
  countryIso: string;
  countryName: string;
  degree: number;
  latitude: number;
  longitude: number;
  organizationOrgId: string;
  organizationOrgName: string;
  rank: number;
  relatedAsn: number;
  relatedType: number;
  asInfo?: any;
  asBogonEventInfo?: any;
}

export interface AsnListType {
  asn: string;
  countryIso: string;
  countryName: string;
}

export interface PrefixType {
  /**
   * AS号
   */
  asn?: number;
  id: number;
  /**
   * 认证授权状态：-1:过期，0：初始状态，1：已认证，2：已授权
   */
  authStatus?: number;
  /**
   * CA证书表主键ID
   */
  caId?: number;
  /**
   * 生效结束时间
   */
  effectiveEndTime?: Date;
  /**
   * 生效起始时间
   */
  effectiveStartTime?: Date;
  /**
   * 虚拟或者现实：1：真实，2：虚拟
   */
  formType?: number;
  /**
   * IP前缀
   */
  ipPrefix?: string;
  /**
   * 4:IPv4,6:IPv6
   */
  ipType?: number;
  /**
   * 前缀掩码长度
   */
  prefixLength?: number;
  /**
   * RIR机构
   */
  rir?: string;
  /**
   * 来源：1：公网数据，2：人工添加
   */
  sourceType?: number;
  roaSourceType: number;
  countryIso: string;
  countryName: string;
}

export interface BGPUpdateType {
  /**
   * 是否原子聚合：AG：原子聚合，NAG：非原子聚合。
   */
  agStatus?: string;
  /**
   * AS路径
   */
  asPath?: string;
  /**
   * 团体属性
   */
  community?: string;
  /**
   * 插入数据时间戳（13位）
   */
  createTime?: number;
  /**
   * 扩展community属性
   */
  extendedCommunity?: string;
  /**
   * 对等路由ASN
   */
  targetAsn?: string;
  /**
   * 对等路由IP地址
   */
  fromIp?: string;
  id?: string;
  /**
   * 本地优先级：通常用于内部路由选择。值为 0 表示未设置。
   */
  localPreference?: string;
  /**
   * Multi-Exit Discriminator多出口鉴别器，通常用于外部路由选择。值为 0 表示未设置。
   */
  med?: string;
  /**
   * 下一跳IP地址
   */
  nextHop?: string;
  /**
   * 起源属性: IGP,EGP,Incomplete
   */
  origin?: string;
  /**
   * 消息类型：例如BGP4MP
   */
  protocolType?: string;
  /**
   * 路由前缀
   */
  routePrefix?: string;
  /**
   * Unix 时间戳（13位）
   */
  timestamp?: number;
  /**
   * Update类型：A:Announcement,W:Withdrawal
   */
  updateType?: string;
  ipType?: "4" | "6";
  [property: string]: any;
}

export interface BgpStatisticProps {
  time: number;
  a: number;
  w: number;
}
