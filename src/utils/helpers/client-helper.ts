import "client-only";

import type { Message, PaginatedResponse } from "../types/server-response.type";
import type { MessageGroup } from "../types/client.type";
import axios from "axios";

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
    retryTimeout *= 2;
  }
};

export const watchElementIntersecting = (
  target: HTMLElement | null,
  onIntersecting: () => void
) => {
  if (!target) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      onIntersecting();
    }
  });
  observer.observe(target);

  return observer;
};

interface ParseDateStringParam {
  dateString: string;
  fullDate?: boolean;
  timeOnly?: boolean;
}

export const parseDateString = ({
  dateString,
  fullDate = false,
  timeOnly = false,
}: ParseDateStringParam) => {
  const currentDate = new Date();
  const date = new Date(dateString);
  const yesterdayDate = new Date(dateString);
  yesterdayDate.setDate(yesterdayDate.getDate() + 1);

  const timeStyleOption: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const currentTime = date.toLocaleTimeString("en-US", timeStyleOption);

  if (
    currentDate.toLocaleDateString() === date.toLocaleDateString() ||
    timeOnly
  )
    return currentTime;
  else if (
    currentDate.toLocaleDateString() === yesterdayDate.toLocaleDateString()
  )
    return fullDate ? `Yesterday, ${currentTime}` : "Yesterday";
  else
    return fullDate
      ? date.toLocaleString("en-GB", {
          ...timeStyleOption,
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : date.toLocaleDateString("en-GB");
};

export const filterOutObjectFromResponse = <ObjectType>(
  object_property: unknown,
  lookup_property: keyof ObjectType,
  apiResponse: PaginatedResponse<ObjectType>[]
): [PaginatedResponse<ObjectType>[], ObjectType | undefined] => {
  let removedObject: ObjectType | undefined;

  const filteredResponse = apiResponse.map((response) => ({
    ...response,
    results: response.results.filter((result) => {
      if (result[lookup_property] === object_property) {
        removedObject = result;
        return false;
      }
      return true;
    }),
  }));

  return [filteredResponse, removedObject];
};

export const createMessageGroups = (messages: Message[]) => {
  const groups: MessageGroup[] = [];
  let lastUserId: number | undefined;
  let lastTime: number | undefined;
  const timeDifferenceLimit = 60 * 30 * 1000;
  messages.forEach((message) => {
    const messageTimeInSeconds = new Date(message.created_at).getTime();
    const hasSurpassedTimeDifference =
      !lastTime || lastTime - messageTimeInSeconds > timeDifferenceLimit;

    if (lastUserId !== message.sender || hasSurpassedTimeDifference) {
      if (hasSurpassedTimeDifference) lastTime = messageTimeInSeconds;
      groups.push({
        type: "message",
        userId: message.sender,
        hasDateHeader: hasSurpassedTimeDifference,
        messages: [message],
      });
      lastUserId = message.sender;
      return;
    }
    const lastGroup = groups.at(-1);
    lastGroup?.messages.push(message);
  });

  return groups;
};

export const uploadFileToUrl = async (file: File, uploadURL: string) => {
  return await withRetry({
    func: async () => {
      return await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });
    },
  });
};

export const muteTrack = () => {};
