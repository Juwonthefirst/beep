import "server-only";

import { cookies } from "next/headers";
import SetCookie from "set-cookie-parser";
import { refreshAccessToken } from "../actions";

// export const processFile = async (file: File) => {
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const processedFileBuffer = await sharp(buffer)
//     .resize(350, 350, {
//       withoutEnlargement: true,
//       fit: "cover",
//     })
//     .sharpen()
//     .webp({ quality: 75 })
//     .toBuffer();

//   return new File(
//     [new Uint8Array(processedFileBuffer)],
//     "profile_picture.webp",
//     {
//       type: "image/webp",
//     },
//   );
// };

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

export const retrieveAccessToken = async () => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("access_token");
  return accessTokenCookie?.value;
};

export const getOrFetchAccessToken = async () => {
  const accessToken = await retrieveAccessToken();
  if (accessToken) return accessToken;

  return await refreshAccessToken();
};
