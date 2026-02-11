"use server";

import { cookies } from "next/headers";

import type {
  AuthResponse,
  AuthSuccessResponse,
  CallAccessToken,
  ServerResponse,
  GroupCreateResponse,
  SignupResponse,
} from "./types/server-response.type";
import { request } from "./request-client";
import {
  retrieveAccessToken,
  getOrFetchAccessToken,
  getAndSetCookies,
  getCookieString,
} from "./helpers/server-helper";
import { stringifyResponseErrorStatusCode } from "./helpers/client-helper";
import { CallState } from "./types/client.type";
import SetCookie from "set-cookie-parser";
import axios, { isAxiosError } from "axios";

export const login = async (
  prevState: AuthResponse | undefined,
  formData: FormData,
): Promise<ServerResponse> => {
  const identification = formData.get("identification");
  const password = formData.get("password");

  if (!identification)
    return { status: "error", error: "Enter a username or email" };
  else if (!password) return { status: "error", error: "Enter your password" };
  const response = await request<AuthSuccessResponse>({
    method: "post",
    path: "/auth/login/",
    data: {
      identification,
      password,
    },
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }
  return { status: "success", data: response.data };
};

export const getOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData,
): Promise<ServerResponse> => {
  const email = formData.get("email");
  if (!email) return { status: "error", error: "Enter a valid email" };
  const response = await request<AuthSuccessResponse>({
    method: "post",
    path: "/auth/get-otp/",
    data: {
      email,
    },
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }
  return { status: "success", data: response.data };
};

export const verifyOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData,
): Promise<ServerResponse> => {
  const cookieStore = await cookies();

  const otp = formData.get("otp");
  if (!otp)
    return { status: "error", error: "Enter the otp sent to your mail" };
  const response = await request<AuthSuccessResponse>({
    method: "post",
    path: "/auth/verify-otp/",
    data: {
      otp,
    },
    config: {
      headers: {
        "X-CSRFToken": cookieStore.get("csrftoken")?.value,
      },
    },
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }
  return { status: "success", data: response.data };
};

export const signup = async (
  prevState: AuthResponse | undefined,
  formData: FormData,
): Promise<ServerResponse> => {
  const cookieStore = await cookies();

  if (!formData.has("username"))
    return { status: "error", error: "Enter a username" };
  if (!formData.has("password"))
    return { status: "error", error: "Enter a password" };

  const response = await request<SignupResponse>({
    method: "post",
    path: "/auth/signup/",
    data: formData,
    config: {
      headers: {
        "X-CSRFToken": cookieStore.get("csrftoken")?.value,
      },
    },
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const googleAuthenicate = async (code: unknown) => {
  const response = await request<AuthSuccessResponse>({
    path: "/auth/social/google/code/",
    data: { code },
  });

  if ("error" in response) {
    return {
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return response.data;
};

export const getAccessToken = async () => {
  return await getOrFetchAccessToken();
};

export const createGroup = async (
  prevState: ServerResponse | undefined,
  formData: FormData,
): Promise<ServerResponse<GroupCreateResponse>> => {
  if (!formData.has("name")) {
    return {
      status: "error",
      error: "Enter your group name",
    };
  }

  const accessToken = await retrieveAccessToken();
  const response = await request<GroupCreateResponse>({
    path: "/groups/",
    data: formData,
    config: {
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
      },
    },
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const fetchCallAccessToken = async ({
  roomName,
  startedCall,
  callId,
  callType,
}: CallState): Promise<ServerResponse<CallAccessToken>> => {
  const accessToken = await retrieveAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  };

  const response = await (() => {
    if (startedCall)
      return request<CallAccessToken>({
        path: `/chats/${roomName}/call/start/`,
        data: { is_video: callType === "video" },
        config,
      });

    return request<CallAccessToken>({
      method: "get",
      path: `/chats/${roomName}/call/${callId}/join/`,
      config,
    });
  })();

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const addGroupMembers = async (
  groupId: number,
  memberIds: number[],
): Promise<ServerResponse<{ status: string }>> => {
  const accessToken = await retrieveAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  };
  const response = await request<{ status: string }>({
    path: `/groups/${groupId}/members/add/`,
    data: { member_ids: memberIds },
    config,
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const leaveGroup = async (
  groupId: number,
): Promise<ServerResponse<{ status: string }>> => {
  const accessToken = await retrieveAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  };
  const response = await request<{ status: string }>({
    method: "delete",
    path: `/groups/${groupId}/leave/`,
    config,
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const unFriend = async (
  friendId: number,
): Promise<ServerResponse<{ status: string }>> => {
  const accessToken = await retrieveAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  };
  const response = await request<{ status: string }>({
    method: "delete",
    path: `/auth/friends/${friendId}/`,
    config,
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const addFriend = async (
  friendId: number,
): Promise<ServerResponse<{ status: string }>> => {
  const accessToken = await retrieveAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  };
  const response = await request<{ status: string }>({
    method: "post",
    path: "/auth/user/friends/requests/send/",
    data: { friend_id: friendId },
    config,
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};
export const cancelFriendRequest = async (
  friendId: number,
): Promise<ServerResponse<{ status: string }>> => {
  const accessToken = await retrieveAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  };
  const response = await request<{ status: string }>({
    method: "post",
    path: "/auth/user/friends/requests/send/",
    data: { friend_id: friendId },
    config,
  });

  if ("error" in response) {
    return {
      status: "error",
      error: stringifyResponseErrorStatusCode(
        response.error?.status || 600,
        response.error?.data.error,
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const refreshAccessToken = async () => {
  const cookieStore = await cookies();
  try {
    const response = await axios.post(
      process.env.BACKEND_URL + "auth/token/refresh/",
      undefined,
      {
        headers: {
          Cookie: await getCookieString(),
          "X-CSRFToken": cookieStore.get("csrftoken")?.value,
        },
      },
    );

    const responseCookies = response.headers["set-cookie"];

    if (responseCookies) {
      await getAndSetCookies(responseCookies || []);
      return SetCookie.parse(responseCookies, { map: true }).access_token.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      cookieStore.delete("refresh_token");
      await getAndSetCookies(error.response.headers["set-cookie"] || []);
    }

    return;
  }
};
