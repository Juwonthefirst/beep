import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";
import { GroupMember, Message } from "@/utils/types/server-response.type";
import { Reply } from "lucide-react";
import Attachment from "./attachment";
import { RefObject } from "react";

type MessageCardProps = Message & {
  ref?: RefObject<HTMLDivElement | null>;
  sentByMe: boolean;
  isGroupMessage: boolean;
  sender_detail: { username: string } | GroupMember;
};

const ReplyToMessageCard = ({ id, body, attachment }: MessageCardProps) => {
  return (
    <div className="flex gap-2 items-center w-fit mb-1 mt-2">
      <Reply size={18} className="rotate-y-180" />
      <div className="flex gap-1 bg-neutral-100 text-black p-0.5 items-center rounded-lg ">
        {attachment && (
          <Attachment
            {...attachment}
            message_id={String(id)}
            className="min-w-9 min-h-9 rounded-sm overflow-hidden"
            imageSizes="64px"
          />
        )}
        <div className={cn("flex flex-col text-xs py-1 px-2")}>
          <p className="">{"You"}</p>
          <p className="line-clamp-1 opacity-70">{body}</p>
        </div>
      </div>
    </div>
  );
};

const MessageCard = ({
  id,
  ref,
  body,
  sender,
  sender_detail,
  reply_to,
  timestamp,
  attachment,
  sentByMe,
}: MessageCardProps) => {
  return (
    <div
      ref={ref}
      className={cn("max-w-4/5 ", {
        "self-end ": sentByMe,
      })}
    >
      {reply_to && (
        <ReplyToMessageCard
          {...reply_to}
          sentByMe={
            (sentByMe && sender === reply_to.sender) ||
            (!sentByMe && sender !== reply_to.sender)
          }
        />
      )}

      <div
        className={cn(
          "flex flex-col px-2 p-1 rounded-b-xl text-sm w-fit text-left min-w-18",
          {
            "rounded-tl-xl bg-theme/90  text-white ml-auto": sentByMe,
            "rounded-tr-xl bg-neutral-100 text-black": !sentByMe,
          }
        )}
        role="log"
      >
        <p>{body}</p>
        <p className={cn("text-xs opacity-70", { "self-start": !sentByMe })}>
          {parseDateString({ dateString: timestamp, timeOnly: true })}
        </p>
      </div>
      {attachment && (
        <Attachment
          {...attachment}
          message_id={String(id)}
          className="overflow-hidden rounded-lg w-44 h-48 ml-auto shadow-md mt-0.5 mb-2"
          imageSizes="352px"
        />
      )}
    </div>
  );
};

export default MessageCard;
