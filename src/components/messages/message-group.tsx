import type { MessageGroup } from "@/utils/types/client.type";
import { RefObject } from "react";
import MessageCard from "./message-card";
import { GroupMember } from "@/utils/types/server-response.type";
import { cn } from "@/lib/utils";
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
  isGroupMessage,
  hasDateHeader,
}: MessageGroupProps) => {
  return (
    <div className="w-full">
      {hasDateHeader && (
        <p className="mb-6 mt-8 text-xs text-center opacity-70">
          {parseDateString({
            dateString: messages.at(-1)?.created_at || "",
            fullDate: true,
          })}
        </p>
      )}

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
      {!sentByMe && isGroupMessage && (
        <p className={cn("text-sm font-medium m-2 ml-1")}>
          @{sender_detail.username}
        </p>
      )}
    </div>
  );
};

export default MessageGroup;
