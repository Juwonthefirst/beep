import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col self-center items-center gap-4 pt-10">
      <Skeleton className="size-36 rounded-full" />
      <Skeleton className="h-8 w-48 rounded-md" />
    </div>
  );
}
