import { ChatPreviewSkeleton } from "./chat-preview";

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
