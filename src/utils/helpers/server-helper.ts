import "server-only";

import { cookies } from "next/headers";
import SetCookie from "set-cookie-parser";
import sharp from "sharp";
import { request } from "../request-client";

export const processFile = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const processedFileBuffer = await sharp(buffer)
    .resize(350, 350, {
      withoutEnlargement: true,
      fit: "cover",
    })
    .sharpen()
    .webp({ quality: 75 })
    .toBuffer();

  return new File(
    [new Uint8Array(processedFileBuffer)],
    "profile_picture.webp",
    {
      type: "image/webp",
    }
  );
};

export const getAndSetCookies = async (cookieStrings: string[]) => {
  const cookieStore = await cookies();
  const parsedCookies = SetCookie.parse(cookieStrings);
  const allowedCookies = process.env.ALLOWED_COOKIES?.split(",") || [];
  console.log(parsedCookies);
  for (const cookie of parsedCookies) {
    if (allowedCookies.includes(cookie.name) || allowedCookies.includes("*")) {
      cookieStore.set({
        ...cookie,
        sameSite: cookie.sameSite as "lax" | "strict" | "none",
      });
    }
  }
};

export const getCookieString = async () => {
  const cookieStore = await cookies();
  const allowedCookies = process.env.ALLOWED_COOKIES?.split(",") || [];
  const cookieStrings = [];

  for (const cookie of allowedCookies) {
    if (cookieStore.has(cookie)) {
      const cookieValue = cookieStore.get(cookie)?.value;
      cookieStrings.push(`${cookie}=${cookieValue}`);
    }
  }
  return cookieStrings.join("; ");
};

export const getORfetchAccessToken = async () => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("access_token");
  if (accessTokenCookie) return accessTokenCookie.value;

  const response = await request<undefined>({
    path: "/auth/token/refresh/",
    config: {
      headers: {
        "X-CSRFToken": cookieStore.get("csrftoken")?.value,
      },
    },
  });

  if ("error" in response) {
    if (typeof response.error !== "string" && response.error.status === 401) {
      cookieStore.delete("refresh_token");
    }
    return;
  }
  const responseCookies = response.headers["set-cookie"];
  if (responseCookies)
    return SetCookie.parse(responseCookies, { map: true }).access_token.value;
};
