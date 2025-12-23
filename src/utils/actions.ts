"use server";

import { cookies } from "next/headers";

import type {
  AuthResponse,
  AuthSuccessResponse,
  CallAccessToken,
  FormResponse,
  GroupCreateResponse,
  SignupResponse,
} from "./types/server-response.type";
import { request } from "./request-client";
import {
  getORfetchAccessToken,
  stringifyResponseErrorStatusCode,
} from "./helpers/server-helper";
import { CallState } from "./types/client.type";

export const login = async (
  prevState: AuthResponse | undefined,
  formData: FormData
): Promise<FormResponse> => {
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
        response.error?.data
      ),
    };
  }
  return { status: "success", data: response.data };
};

export const getOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData
): Promise<FormResponse> => {
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
        response.error?.data
      ),
    };
  }
  return { status: "success", data: response.data };
};

export const verifyOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData
): Promise<FormResponse> => {
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
        response.error?.data
      ),
    };
  }
  return { status: "success", data: response.data };
};

export const signup = async (
  prevState: AuthResponse | undefined,
  formData: FormData
): Promise<FormResponse> => {
  const cookieStore = await cookies();

  if (!formData.has("username"))
    return { status: "error", error: "Enter a username" };
  if (!formData.has("password"))
    return { status: "error", error: "Enter a password" };

  // const profilePicture = formData.get("profile_picture");
  // formData.delete("profile_picture");
  // if (
  //   profilePicture &&
  //   profilePicture instanceof Blob &&
  //   profilePicture.size &&
  //   profilePicture.type
  // )
  //   formData.set("profile_picture", await processFile(profilePicture));
  // else return { status: "error", error: "profile picture requires" };

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
        response.error?.data
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
        response.error?.data
      ),
    };
  }

  return response.data;
};

export const getAccessToken = async () => {
  return await getORfetchAccessToken();
};

export const createGroup = async (
  prevState: FormResponse | undefined,
  formData: FormData
): Promise<FormResponse<GroupCreateResponse>> => {
  if (!formData.has("name")) {
    return {
      status: "error",
      error: "Enter your group name",
    };
  }

  const accessToken = await getORfetchAccessToken();
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
        response.error?.data
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
}: CallState): Promise<FormResponse<CallAccessToken>> => {
  const accessToken = await getORfetchAccessToken();
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
        response.error?.data
      ),
    };
  }

  return { status: "success", data: response.data };
};

export const addGroupMembers = async (
  groupId: number,
  memberIds: number[]
): Promise<FormResponse<{ status: string }>> => {
  const accessToken = await getORfetchAccessToken();
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
        response.error?.data
      ),
    };
  }

  return { status: "success", data: response.data };
};
