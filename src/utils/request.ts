import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
// import qs from "qs";
// import { BASE_URL, hideHeader } from "./global";
// import notification from "./notification";
// import { navigateToLogin } from "./tool";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const errorStatusObj: Record<number, string> = {
  400: "错误的请求",
  401: "验证不通过",
  403: "没有权限，请联系管理员",
  404: "加载失败",
  405: "不允许的方法",
};

const axiosInstance: AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: "http://172.10.20.99",
  // baseURL: process?.env?.NODE_ENV !== "development" || hideHeader ? BASE_URL : "",
  // paramsSerializer: function (params) {
  //   return qs.stringify(params, { arrayFormat: "repeat" });
  // },
});

axiosInstance.interceptors.request.use(
  function (config: any) {
    const token = localStorage.getItem("token");
    config.headers.set("Authorization", `Bearer ${token}`);
    // if (!import.meta.env.DEV) {
    //   if (config.url.startsWith("/api2")) {
    //     config.url = "http://10.10.24.100:9002" + config.url.slice(5);
    //   } else if (config.url.startsWith("/api")) {
    //     config.url = "http://10.10.24.100:9201" + config.url.slice(4);
    //   }
    // }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    const { method, returnAll, showTip = true } = response?.config ?? {};
    if (response.status === 200) {
      // const code = method === "get" ? "requestFail" : "optFail";
      const result = response.data;
      if (result.code !== 200 && result.code < 10000 && showTip) {
        message.error(result.msg);
      } else if (result.code >= 10000 && showTip) {
        message.warning(result.msg);
      }
    }
    return returnAll ? response : response.data;
  },
  (error) => {
    if (errorStatusObj[error?.response?.status]) {
      if (error?.response?.status === 401) {
        router.push("/login");
      }
      message.error(errorStatusObj[error?.response?.status]);
    } else if (error?.response?.status >= 500) {
      message.error("服务连接失败");
    } else if (error.message !== "canceled") {
      message.error("服务异常");
    }
    return Promise.reject(error);
  },
);

interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  showTip?: boolean;
  content?: string;
}

interface IRequest {
  <T = any>(url: string, opts?: AxiosRequestConfigExtend, formData?: FormData): Promise<T>;
}

const request: IRequest = (url: string, opts: any = { method: "GET" }, formData?: FormData) => {
  if (formData) return axiosInstance.request({ ...opts, url, data: formData });
  else return axiosInstance.request({ ...opts, url });
};

export { request, axiosInstance };
