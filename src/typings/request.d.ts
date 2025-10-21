declare namespace API {
  type RequestResult<T> = {
    code: number;
    data: T | null;
    msg?: string;
  };
  type RequestPageResult<T> = {
    code?: number;
    data: {
      current: number;
      data: T[];
      pageSize: number;
      total: number;
      totalPage: number;
    };
    msg?: string;
  };
  type RequestAllListResult<T> = {
    code?: number;
    data: T[];
    msg?: string;
  };
  type PageParams = {
    current: number;
    pageSize: number;
  };
}
