import type { MessageGroup } from "@/utils/types/client.type";
import React, { RefObject } from "react";
import MessageCard from "./message-card";
import { GroupMember } from "@/utils/types/server-response.type";
import { parseDateString } from "@/utils/helpers/client-helper";

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
      <p className="my-6 text-xs text-center opacity-70">
        {parseDateString({
          dateString: messages[messages.length - 1].timestamp,
          fullDate: true,
        })}
      </p>
      <p className="text-sm">{sender_detail.username}</p>
      <div className="flex flex-col-reverse gap-0.5">
        {messages.map((message, index) => (
          <MessageCard
            key={message.uuid}
            {...message}
            ref={
              intersectionRef && index === Math.max(0, messages.length - 4)
                ? intersectionRef
                : undefined
            }
            sentByMe={sentByMe}
            isFirst={index === 0}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
      {/* <p className={cn("text-sm opacity-80", { "text-right": sentByMe })}>
        {sender_detail.username}
      </p> */}
    </div>
  );
};

export default MessageGroup;
