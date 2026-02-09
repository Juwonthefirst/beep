import { cn } from "@/lib/utils";
import { Pencil, X } from "lucide-react";

interface Props {
  onCancel: () => void;
  body: string;
}

const EditMessageCard = ({ body, onCancel }: Props) => {
  return (
    <div className="flex gap-2 items-center mb-1 mt-2 relative w-full">
      <button
        className="text-red-500 p-1 rounded-full absolute top-0 right-0 hover:bg-red-500/10 transition-all [&:hover,&:active]:scale-110"
        type="button"
        onClick={onCancel}
      >
        <X size={16} strokeWidth={2.5} />
      </button>
      <div className="flex gap-2 bg-neutral-100 text-black p-0.5 items-center rounded-lg w-full">
        <div className={cn("flex flex-col gap-1 text-sm py-1 px-2")}>
          <div className="flex items-center gap-1 text-xs">
            <Pencil size={14} />
            <p>Editing this message</p>
          </div>
          <p className="line-clamp-1 ">{body}</p>
        </div>
      </div>
    </div>
  );
};

export default EditMessageCard;
