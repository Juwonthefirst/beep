"use server";

import { cookies } from "next/headers";

import type {
  AuthResponse,
  AuthSuccessResponse,
} from "./types/server-response.type";
import { request } from "./request-client";
import { processFile } from "./helpers";

export const login = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const identification = formData.get("identification");
  const password = formData.get("password");

  if (!identification) return { error: "Enter a username or email" };
  else if (!password) return { error: "Enter your password" };
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
      error:
        typeof response.error === "string"
          ? response.error
          : response.error?.data?.error,
    };
  }
  return response.data;
};

export const getOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const email = formData.get("email");
  if (!email) return { error: "Enter a valid email" };
  const response = await request<AuthSuccessResponse>({
    method: "post",
    path: "/auth/get-otp/",
    data: {
      email,
    },
  });

  if ("error" in response) {
    return {
      error:
        typeof response.error === "string"
          ? response.error
          : response.error?.data?.error,
    };
  }
  return response.data;
};

export const verifyOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const cookieStore = await cookies();

  const otp = formData.get("otp");
  if (!otp) return { error: "Enter the otp sent to your mail" };
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
      error:
        typeof response.error === "string"
          ? response.error
          : response.error?.data?.error,
    };
  }
  return response.data;
};

export const signup = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const cookieStore = await cookies();

  if (!formData.has("username")) return { error: "Enter a username" };
  if (!formData.has("password")) return { error: "Enter a password" };

  const profilePicture = formData.get("profile_picture");
  formData.delete("profile_picture");
  if (
    profilePicture &&
    profilePicture instanceof Blob &&
    profilePicture.size &&
    profilePicture.type
  )
    formData.set("profile_picture", await processFile(profilePicture));

  const response = await request<AuthSuccessResponse>({
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
      error:
        typeof response.error === "string"
          ? response.error
          : response.error?.data?.error,
    };
  }
  return response.data;
};

export const googleAuthenicate = async (code: unknown) => {
  const response = await request<AuthSuccessResponse>({
    path: "/auth/social/google/code/",
    data: { code },
  });

  if ("error" in response) {
    return {
      error:
        typeof response.error === "string"
          ? response.error
          : response.error?.data.error,
    };
  }

  return response.data;
};
