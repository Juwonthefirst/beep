import "server-only";

import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import type { ApiMethods } from "./types/client.type";
import { getAndSetCookies, getCookieString } from "./helpers/server-helper";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
});

interface RequestProp {
  method?: ApiMethods;
  path: string;
  data?: unknown;
  config?: AxiosRequestConfig;
}

export const request = async <
  ResponseSuccessType,
  ResponseErrorType = {
    error: string;
  }
>({
  method = "post",
  path,
  data,
  config,
}: RequestProp) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        Cookie: await getCookieString(),
        ...config?.headers,
      },
    };

    const response =
      method === "get"
        ? await api.get<ResponseSuccessType>(path, requestConfig)
        : await api[method]<ResponseSuccessType>(path, data, requestConfig);

    await getAndSetCookies(response.headers["set-cookie"] || []);
    return response;
  } catch (e: unknown) {
    if (isAxiosError<ResponseErrorType>(e)) {
      console.error(e.response?.data);
      const cookieStrings = e.response?.headers["set-cookie"];
      if (cookieStrings) await getAndSetCookies(cookieStrings);
      return { error: e.response || e.message };
    }
    console.error(e);
    return { error: "failed" };
  }
};
