import { FriendListType } from "@/utils/types/client.type";
import { UserX } from "lucide-react";

const NoFriendsFallback = ({
  friendListType,
}: {
  friendListType: FriendListType;
}) => {
  return (
    <div className="opacity-70 flex flex-col items-center gap-4 text-sm w-3/4 text-center mx-auto mt-6">
      <UserX size={64} strokeWidth={1.5} />
      <p>Looks like you don&apos;t have any {friendListType}</p>
    </div>
  );
};

export default NoFriendsFallback;
