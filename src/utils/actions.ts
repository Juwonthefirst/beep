"use server";

import axios from "axios";
import { CurrentUser } from "./types";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
});

export const login = async (formData: FormData) => {
  const identification = formData.get("username/email");
  const password = formData.get("password");

  if (!identification) return { error: "Enter a username or email" };
  else if (!password) return { error: "Enter your password" };
  return api
    .post<CurrentUser>("/login/", { identification, password })
    .then((res) => res.data);
};

export const getOtp = async (formData: FormData) => {
  const email = formData.get("email");
  if (!email) return { error: "Enter a valid email" };
  return api
    .post<{ session_id: string }>("/auth/get-otp/", { email })
    .then((res) => res.data);
};

export const verifyOtp = async (formData: FormData) => {
  const otp = formData.get("otp");
  const session_id = formData.get("session_id");

  if (!otp) return { error: "Enter the otp sent to your mail" };
  return api
    .post<{ session_id: string }>("/auth/verify-otp/", { otp, session_id })
    .then((res) => res.data);
};

export const signup = async (formData: FormData) => {
  if (!formData.has("username")) return { error: "Enter a username" };
  const username = formData.get("username");
  const password = formData.get("password");
  const profilePicture = formData.get("username");

  return api
    .post<CurrentUser>("/auth/signup/", formData)
    .then((res) => res.data);
};
