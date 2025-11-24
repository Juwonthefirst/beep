import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";
import { Message } from "@/utils/types/server-response.type";
import { Reply } from "lucide-react";

type MessageCardProps = Message & { sentByMe: boolean };

const ReplyToMessageCard = ({ body, sentByMe }: MessageCardProps) => {
  return (
    <div className="flex gap-2 items-center w-fit mb-1 mt-2">
      <Reply size={18} className="rotate-y-180" />
      <div
        className={cn(
          "flex flex-col  rounded-lg bg-neutral-100 text-black p-1"
        )}
      >
        <p className="text-xs opacity-70">{body}</p>
      </div>
    </div>
  );
};

const MessageCard = ({
  body,
  sender,
  reply_to,
  timestamp,
  sentByMe,
}: MessageCardProps) => {
  return (
    <div
      className={cn("max-w-4/5", {
        "self-end ": sentByMe,
        "": !sentByMe,
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
          "flex flex-col py-1 px-2 rounded-b-xl text-sm w-fit text-left",
          {
            "rounded-tl-xl bg-theme/90  text-white self-end ": sentByMe,
            "rounded-tr-xl bg-neutral-100 text-black": !sentByMe,
          }
        )}
        role="log"
      >
        {/* <p className="">{sender}</p> */}

        <p>{body}</p>
        <p className={cn("text-xs opacity-70", { "self-start": !sentByMe })}>
          {parseDateString({ dateString: timestamp, timeOnly: true })}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
