//import "client-only";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface WithRetry<Type> {
  func: () => Promise<Type>;
  maxRetryCount?: number;
}

export const withRetry = async <Type>({
  func,
  maxRetryCount = 3,
}: WithRetry<Type>): Promise<Type> => {
  let retryCount = 0;
  let retryTimeout = 1 * 1000;

  while (true) {
    try {
      return await func();
    } catch (error) {
      retryCount++;
      if (retryCount > maxRetryCount) {
        throw error;
      }
    }
    await delay(Math.min(retryTimeout, 10 * 1000));
    retryTimeout *= 1.5;
  }
};

export const createMediaURL = (
  type: "attachment" | "profile-picture" | "group-avatar",
  id: string
) => {
  if (type === "attachment") return `/uploads/attachment/` + id;
  const extension = ".webp";
  const mediaURL = process.env.NEXT_PUBLIC_MEDIA_URL;
  const path =
    type === "profile-picture"
      ? "/uploads/profile-picture/"
      : "/uploads/group-avatar/";

  return mediaURL + path + id + extension;
};
