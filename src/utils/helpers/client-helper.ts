import {
  Attachment,
  isSentMessage,
  type Message,
  type PaginatedResponse,
} from "../types/server-response.type";
import type { MessageGroup } from "../types/client.type";
import axios, { isAxiosError } from "axios";

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
  onIntersecting: () => void,
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

export const nestedObjectedLookup = <ObjectType extends object>(
  object: ObjectType,
  lookupKeys: readonly string[],
) => {
  return lookupKeys.reduce<unknown>((currentObject, currentValue) => {
    if (typeof currentObject !== "object") return currentObject;
    return (currentObject as Record<string, unknown>)?.[currentValue];
  }, object);
};

export const filterOutObjectFromResponse = <ObjectType>(
  object_property: unknown,
  lookup_property: keyof ObjectType,
  apiResponses: PaginatedResponse<ObjectType>[],
): [PaginatedResponse<ObjectType>[], ObjectType | undefined] => {
  let removedObject: ObjectType | undefined;

  const filteredResponse = apiResponses.map((response) => ({
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

// function for getting an object from a list of responses (returns immediately the object is found)

export const findObjectInResponse = <ObjectType>(
  object_property: unknown,
  lookup_property: keyof ObjectType,
  apiResponses: PaginatedResponse<ObjectType>[],
): ObjectType | undefined => {
  let object: ObjectType | undefined;

  for (const response of apiResponses) {
    const requestedObject = response.results.find(
      (result) => result[lookup_property] === object_property,
    );
    if (requestedObject) {
      object = requestedObject;
      break;
    }
  }

  return object;
};

export const createMessageGroups = (
  messages: Message[],
  currentUserId: number,
) => {
  const groups: MessageGroup[] = [];
  let lastUserId: number | undefined;
  let lastTime: number | undefined;
  const timeDifferenceLimit = 60 * 30 * 1000;
  messages.forEach((message) => {
    const sender = isSentMessage(message) ? message.sender : currentUserId;
    const messageTimeInSeconds = new Date(message.created_at).getTime();
    const hasSurpassedTimeDifference =
      !lastTime || lastTime - messageTimeInSeconds > timeDifferenceLimit;

    if (lastUserId !== sender || hasSurpassedTimeDifference) {
      if (hasSurpassedTimeDifference) lastTime = messageTimeInSeconds;
      groups.push({
        type: "message",
        userId: sender,
        hasDateHeader: hasSurpassedTimeDifference,
        messages: [message],
      });
      lastUserId = sender;
      return;
    }
    const lastGroup = groups.at(-1);
    lastGroup?.messages.push(message);
  });

  return groups;
};

export const uploadFileToUrl = async (file: File, uploadURL: string) => {
  return await withRetry({
    func: () => {
      return axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });
    },
  });
};

export const uploadAttachment = async (
  file: File,
  onComplete: (attachmentId: number) => void,
  onError: (errorMessage: string) => void,
) => {
  try {
    const response = await withRetry<Attachment>({
      func: () =>
        axios
          .post<Attachment>("/api/upload/attachment", {
            filename: file.name,
            mime_type: file.type,
            size: file.size,
          })
          .then((res) => res.data),
    });
    try {
      await uploadFileToUrl(file, response.upload_url!);
      onComplete(response.id);
    } catch (e) {
      if (isAxiosError(e)) {
        await withRetry({
          func: () => axios.delete(`/api/upload/attachment/${response.id}`),
        });
      }

      throw new Error();
    }
  } catch {
    onError("Something went wrong, try again later");
  }
};

export const removeAttachment = async (
  attachmentId: number,
  asBeacon = false,
) => {
  if (asBeacon) {
    navigator.sendBeacon();
  }
  const response = await withRetry({
    func: () => axios.delete(`/api/upload/attachment/${attachmentId}`),
  });
};

export const stringifyResponseErrorStatusCode = (
  status: number,
  error?: string,
) => {
  switch (status) {
    case 400:
      return error || "Something went wrong, try again later";
    case 401:
      return "You are not authenticated";
    case 403:
      return "You are not allowed here";
    case 404:
      return "Sorry, we can't find what you are looking for";
    case 500:
      return "Something went wrong at our end";
    case 600:
      return "Unable to connect to our server";
    default:
      return "Something went wrong, try again later";
  }
};
