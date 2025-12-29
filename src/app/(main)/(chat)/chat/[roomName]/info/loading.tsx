import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Phone, Video } from "lucide-react";

const Loading = () => {
  const iconSize = 22;
  return (
    <section className="flex flex-col items-center flex-1 pt-10">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="size-36 rounded-full shadow-md" />
        <Skeleton className="h-7 w-full mb-2" />

        <div className="flex gap-4 items-center  *:flex  *:items-center *:p-2 *:gap-2 *:border-[1.5px] *:border-theme/60 *:text-sm *:text-theme *:rounded-md *:hover:ring-4 *:hover:ring-theme/10">
          <div>
            <MessageCircle size={iconSize} />
          </div>
          <div>
            <Phone size={iconSize} />
          </div>
          <div>
            <Video size={iconSize} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
