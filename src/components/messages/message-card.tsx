import { cn } from "@/lib/utils";
import {
  isPendingMessage,
  isSentMessage,
  type Message,
} from "@/utils/types/server-response.type";
import { Clock } from "lucide-react";
import Attachment from "./attachment";
import { type RefObject } from "react";
import MessageMenu from "./message-menu";
import ReplyMessageCard from "./reply-message-card";

interface MessageCardProps {
  message: Message;
  ref?: RefObject<HTMLDivElement | null>;
  sentByMe: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const MessageCard = ({
  ref,
  message,
  sentByMe,
  isFirst,
  isLast,
}: MessageCardProps) => {
  return (
    <div
      ref={ref}
      className={cn("w-4/5 relative group", {
        "self-end": sentByMe,
      })}
    >
      {message.reply_to && (
        <ReplyMessageCard
          {...message.reply_to}
          className={sentByMe ? "ml-auto" : "mr-auto"}
        />
      )}

      <div
        className={cn(
          "flex px-3 py-1.5 w-fit text-left gap-1 max-w-3/4 relative",
          {
            "bg-theme/90 rounded-l-2xl rounded-r-[6px]  text-white ml-auto":
              sentByMe,
            " bg-neutral-100 rounded-r-2xl rounded-l-[6px] text-black":
              !sentByMe,
            "rounded-t-2xl!": isLast,
            "rounded-b-2xl!": isFirst,
          },
        )}
        role="log"
      >
        <p className="whitespace-pre-wrap wrap-anywhere">{message.body}</p>
        {isPendingMessage(message) && (
          <Clock
            className={cn(
              "shrink-0 justify-end",
              sentByMe ? "self-end" : "self-start",
            )}
            size={12}
          />
        )}
        <MessageMenu message={message} sentByMe={sentByMe} />
      </div>
      {isSentMessage(message) && message.attachment && (
        <Attachment
          {...message.attachment}
          message_id={String(message.id)}
          className="overflow-hidden rounded-lg w-44 h-48 ml-auto shadow-md mt-0.5 mb-2"
          imageSizes="352px"
        />
      )}
    </div>
  );
};

export default MessageCard;
