import { ReplyMessage } from "@/utils/types/server-response.type";
import { Reply, X } from "lucide-react";
import Attachment from "./attachment";
import { cn } from "@/lib/utils";

export const ReplyMessageCardWithCancel = ({
  id,
  body,
  attachment,
  sender,
  onCancel,
}: ReplyMessage & { onCancel: () => void }) => {
  return (
    <div className="flex gap-2 items-center mb-1 mt-2 relative w-full">
      <Reply size={18} className="rotate-y-180" />
      <button
        className="text-red-500 p-1 rounded-full absolute top-0 right-0 hover:bg-red-500/10 transition-all [&:hover,&:active]:scale-110"
        type="button"
        onClick={onCancel}
      >
        <X size={16} strokeWidth={2.5} />
      </button>
      <div className="flex gap-1 bg-neutral-100 text-black p-0.5 items-center rounded-lg w-full">
        {attachment && (
          <Attachment
            {...attachment}
            message_id={String(id)}
            className="min-w-9 min-h-9 rounded-sm overflow-hidden"
            imageSizes="72px"
          />
        )}
        <div className={cn("flex flex-col gap-1 text-xs py-1 px-2")}>
          <p>{sender}</p>
          <p className="line-clamp-1 opacity-70 ">{body}</p>
        </div>
      </div>
    </div>
  );
};
const ReplyMessageCard = ({
  id,
  body,
  attachment,
  sender,
  className,
}: ReplyMessage & { className?: string }) => {
  return (
    <div className={cn("flex gap-2 items-center w-fit mb-1 mt-2", className)}>
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

export default ReplyMessageCard;
