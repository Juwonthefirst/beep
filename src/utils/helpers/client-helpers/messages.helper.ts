import {
  Attachment,
  isSentMessage,
  PaginatedResponse,
  type Message,
} from "@/utils/types/server-response.type";
import type { AttachmentState, MessageGroup } from "@/utils/types/client.type";
import { InfiniteData } from "@tanstack/react-query";
import { ChatState } from "@/components/providers/chat-state.provider";
import { UUID } from "crypto";

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

export const updateMessageCache =
  (
    chatState: ChatState,
    inputValue: string,
    messageUUID: UUID | null,
    attachments: AttachmentState[],
  ) =>
  (old: InfiniteData<PaginatedResponse<Message>, unknown> | undefined) => {
    if (!old) return old;
    const newData = structuredClone(old);
    const now = new Date().toString();
    if (chatState.mode !== "edit" && messageUUID)
      newData.pages[0].results = [
        {
          body: inputValue,
          uuid: messageUUID,
          attachments: attachments.map((attachment) => {
            const kind = attachment.file.type.split("/")[0];
            return {
              id: 0,
              filename: attachment.file.name,
              path: "",
              url: URL.createObjectURL(attachment.file),
              mime_type: attachment.file.type,
              size: attachment.file.size,
              kind:
                kind in ["image", "audio", "video"]
                  ? (kind as Attachment["kind"])
                  : "document",
              uploaded_at: now,
            };
          }),
          reply_to:
            chatState.mode === "reply"
              ? { ...chatState.messageObject!, sender: "You" }
              : null,
          created_at: now,
        },
        ...newData.pages[0].results,
      ];

    return newData;
  };
