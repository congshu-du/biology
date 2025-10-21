export type APIParams = {
  results: number;
  page?: number;
  sortField?: string;
  sortOrder?: number;
  [key: string]: any;
};
export type APIResult = {
  results: {
    gender: "female" | "male";
    name: string;
    email: string;
  }[];
  total: number;
};
