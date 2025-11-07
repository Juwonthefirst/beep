import "server-only";

import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import type { ApiMethods } from "./types/client.types";
import { getAndSetCookies } from "./helpers";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
});

interface RequestProp {
  method: ApiMethods;
  path: string;
  data?: unknown;
  config?: AxiosRequestConfig;
}

export const request = async <ResponseSuccessType, ResponseErrorType>({
  method,
  path,
  data,
  config,
}: RequestProp) => {
  try {
    if (method === "get") {
      const response = await api.get<ResponseSuccessType>(path, config);
      await getAndSetCookies(response.headers["set-cookie"] || []);
      return response;
    }

    const response = await api[method]<ResponseSuccessType>(path, data, config);
    await getAndSetCookies(response.headers["set-cookie"] || []);
    return response;
  } catch (e: unknown) {
    if (isAxiosError<ResponseErrorType>(e)) {
      const cookieStrings = e.response?.headers["set-cookie"];
      if (cookieStrings) await getAndSetCookies(cookieStrings);
      return { error: e.response || e.message };
    }
    console.error(e);
    return { error: "failed" };
  }
};
