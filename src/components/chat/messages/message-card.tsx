import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";
import { Message } from "@/utils/types/server-response.type";

type MessageCardProps = Message & { sentByMe: boolean };

const ReplyToMessageCard = ({ body, sentByMe }: MessageCardProps) => {
  return (
    <div className={cn("flex flex-col")}>
      <p className="text-xs opacity-70">{body}</p>
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
      className={cn(
        "flex flex-col max-w-2/5 py-1 px-2 rounded-b-xl text-sm w-fit text-left",
        {
          "rounded-tl-xl bg-theme/90  text-white self-end ": sentByMe,
          "rounded-tr-xl bg-neutral-100 text-black": !sentByMe,
        }
      )}
      role="log"
    >
      {/* <p className="">{sender}</p> */}
      {reply_to && (
        <ReplyToMessageCard
          {...reply_to}
          sentByMe={
            (sentByMe && sender === reply_to.sender) ||
            (!sentByMe && sender !== reply_to.sender)
          }
        />
      )}
      <p>{body}</p>
      <p className={cn("text-xs opacity-70", { "self-start": !sentByMe })}>
        {parseDateString({ dateString: timestamp, timeOnly: true })}
      </p>
    </div>
  );
};

export default MessageCard;
