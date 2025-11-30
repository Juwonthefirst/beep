import type { MessageGroup } from "@/utils/types/client.type";
import React, { RefObject } from "react";
import MessageCard from "./message-card";
import { GroupMember } from "@/utils/types/server-response.type";

interface MessageGroupProps extends Omit<MessageGroup, "userId"> {
  intersectionRef?: RefObject<HTMLDivElement | null>;
  sentByMe: boolean;
  isGroupMessage: boolean;
  sender_detail: { username: string } | GroupMember;
}

const MessageGroup = ({
  messages,
  intersectionRef,
  sentByMe,
  sender_detail,
}: MessageGroupProps) => {
  return (
    <div className="w-full">
      <p className="mb-4 text-xs text-center opacity-70">
        {messages[0].timestamp}
      </p>
      <div className="flex flex-col-reverse gap-0.5">
        {messages.map((message, index) => (
          <MessageCard
            key={message.uuid}
            {...message}
            ref={
              intersectionRef && index === Math.min(0, messages.length - 4)
                ? intersectionRef
                : undefined
            }
            sentByMe={sentByMe}
            isFirst={index === 0}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageGroup;
