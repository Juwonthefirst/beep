import { cn } from "@/lib/utils";
import {
  isPendingMessage,
  isSentMessage,
  type Message,
  type ReplyMessage,
} from "@/utils/types/server-response.type";
import { Clock, Reply } from "lucide-react";
import Attachment from "./attachment";
import { type RefObject } from "react";

interface MessageCardProps {
  message: Message;
  ref?: RefObject<HTMLDivElement | null>;
  sentByMe: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const ReplyToMessageCard = ({ id, body, attachment, sender }: ReplyMessage) => {
  return (
    <div className="flex gap-2 items-center w-fit mb-1 mt-2">
      <Reply size={18} className="rotate-y-180" />
      <div className="flex gap-1 bg-neutral-100 text-black p-0.5 items-center rounded-lg ">
        {attachment && (
          <Attachment
            {...attachment}
            message_id={String(id)}
            className="min-w-9 min-h-9 rounded-sm overflow-hidden"
            imageSizes="72px"
          />
        )}
        <div className={cn("flex flex-col text-xs py-1 px-2")}>
          <p>{sender}</p>
          <p className="line-clamp-1 opacity-70 ">{body}</p>
        </div>
      </div>
    </div>
  );
};

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
      className={cn("max-w-3/4 ", {
        "self-end ": sentByMe,
      })}
    >
      {message.reply_to && <ReplyToMessageCard {...message.reply_to} />}

      <div
        className={cn("flex px-3 py-1.5 w-fit text-left gap-1", {
          "bg-theme/90 rounded-l-2xl rounded-r-[6px]  text-white ml-auto":
            sentByMe,
          " bg-neutral-100 rounded-r-2xl rounded-l-[6px] text-black": !sentByMe,
          "rounded-t-2xl!": isLast,
          "rounded-b-2xl!": isFirst,
        })}
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
