"use server";

import axios, { isAxiosError } from "axios";

import type {
  AuthErrorResponse,
  AuthResponse,
  AuthSuccessResponse,
} from "./types";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
});

export const login = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const identification = formData.get("identification");
  const password = formData.get("password");

  if (!identification) return { error: "Enter a username or email" };
  else if (!password) return { error: "Enter your password" };
  try {
    const res = await api.post<AuthSuccessResponse>("/auth/login/", {
      identification,
      password,
    });
    return res.data;
  } catch (e: unknown) {
    if (isAxiosError<AuthErrorResponse>(e)) {
      return { error: e.response?.data?.error || e.message };
    }
  }
};

export const getOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const email = formData.get("email");
  if (!email) return { error: "Enter a valid email" };
  try {
    const res = await api.post<AuthSuccessResponse>("/auth/get-otp/", {
      email,
    });
    return res.data;
  } catch (e: unknown) {
    if (isAxiosError<AuthErrorResponse>(e)) {
      return { error: e.response?.data?.error || e.message };
    }
  }
};

export const verifyOtp = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  const otp = formData.get("otp-0");
  console.log(formData);

  if (!otp) return { error: "Enter the otp sent to your mail" };
  try {
    const res = await api.post<AuthSuccessResponse>("/auth/verify-otp/", {
      otp,
    });
    return res.data;
  } catch (e: unknown) {
    if (isAxiosError<AuthErrorResponse>(e)) {
      return { error: e.response?.data?.error || e.message };
    }
  }
};

export const signup = async (
  prevState: AuthResponse | undefined,
  formData: FormData
) => {
  if (!formData.has("username")) return { error: "Enter a username" };
  if (!formData.has("password")) return { error: "Enter a password" };
  try {
    const res = await api.post<AuthSuccessResponse>("/auth/signup/", formData);
    return res.data;
  } catch (e: unknown) {
    if (isAxiosError<AuthErrorResponse>(e)) {
      return { error: e.response?.data?.error || e.message };
    }
  }
};
