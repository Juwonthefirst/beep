import { cn } from "@/lib/utils";
import Logo from "../logo";
import SearchBar from "../search-bar";
import ChatList from "./chat-list";
import NavBar from "../navbar/nav-bar";

const ChatSection = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-col gap-3 mb-6">
        <Logo className="self-start ml-2" />
        <SearchBar />
      </div>

      <h2 className="text-xl font-semibold -my-4 ml-2">Chats</h2>
      <ChatList />
      <NavBar />
    </div>
  );
};

export default ChatSection;
