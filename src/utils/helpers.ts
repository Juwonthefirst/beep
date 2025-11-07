import "server-only";

import { cookies } from "next/headers";
import SetCookie from "set-cookie-parser";
import sharp from "sharp";

export const processFile = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const processedFileBuffer = await sharp(buffer)
    .resize(350, 350)
    .sharpen()
    .webp({ quality: 75 })
    .toBuffer();

  return new Blob([new Uint8Array(processedFileBuffer)], {
    type: "image/webp",
  });
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
