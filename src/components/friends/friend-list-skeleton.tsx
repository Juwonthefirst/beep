import { Skeleton } from "../ui/skeleton";

const FriendListSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 10 }).map((s, index) => (
        <div className="flex items-center p-2" key={String(s) + index}>
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-5 w-1/2 ml-3" />
        </div>
      ))}
    </div>
  );
};

export default FriendListSkeleton;
