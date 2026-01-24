import { UserPlus } from "lucide-react";
import Link from "next/link";

const AddFriendBtn = () => {
  return (
    <Link
      href="/friends/add"
      type="button"
      className="absolute bottom-32 right-4 rounded-full p-3 bg-theme/80 text-white z-20"
    >
      <UserPlus />
    </Link>
  );
};

export default AddFriendBtn;
