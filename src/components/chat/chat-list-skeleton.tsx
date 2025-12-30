import { Skeleton } from "../ui/skeleton";

const ChatPreviewSkeleton = () => (
  <div className="flex items-center gap-4 p-2">
    <Skeleton className="min-w-12 min-h-12 rounded-full " />
    <div className="flex gap-2 flex-col justify-center w-full">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-3.5 w-full" />
      </div>
    </div>
  </div>
);

const ChatListLoading = () => {
  return (
    <div>
      {Array.from({ length: 10 }).map((s, index) => (
        <ChatPreviewSkeleton key={String(s) + index} />
      ))}
    </div>
  );
};

export default ChatListLoading;
