import { MessageCircleOffIcon } from "lucide-react";

const NoChatRoom = () => {
  return (
    <div className="opacity-70 flex flex-col items-center gap-4 text-sm w-3/4 text-center mx-auto mt-6">
      <MessageCircleOffIcon size={64} strokeWidth={1.5} />
      <p>
        Looks like you don&apos;t have any chats, add a friend to start a chat
      </p>
    </div>
  );
};

export default NoChatRoom;
