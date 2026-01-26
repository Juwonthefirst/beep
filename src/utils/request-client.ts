import "server-only";

import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import type { ApiMethods } from "./types/client.type";
import {
  getAndSetCookies,
  getCookieString,
  retrieveAccessToken,
} from "./helpers/server-helper";
import { refreshAccessToken } from "./actions";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      let newAccessToken: string | undefined;

      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        newAccessToken = await refreshAccessToken();
        isRefreshing = false;
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken ?? (await retrieveAccessToken())}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export interface RequestProp {
  method?: ApiMethods;
  path: string;
  data?: unknown;
  config?: AxiosRequestConfig;
}

export const request = async <
  ResponseSuccessType,
  ResponseErrorType = {
    error: string;
  },
>({
  method = "post",
  path,
  data = {},
  config,
}: RequestProp) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        Referer: process.env.DOMAIN_ADDRESS,
        Cookie: await getCookieString(),
        ...config?.headers,
      },
    };

    const response =
      method === "get" || method === "delete"
        ? await api[method]<ResponseSuccessType>(path, requestConfig)
        : await api[method]<ResponseSuccessType>(path, data, requestConfig);

    await getAndSetCookies(response.headers["set-cookie"] || []);
    console.log(JSON.stringify(response.data));
    return response;
  } catch (e: unknown) {
    if (isAxiosError<ResponseErrorType>(e)) {
      console.error(e.response?.data);
      const cookieStrings = e.response?.headers["set-cookie"];
      if (cookieStrings) await getAndSetCookies(cookieStrings);
      return { error: e.response };
    }
    console.error(e);
    return { error: undefined };
  }
};
