import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import ChatList from "./chat/chat-list";
import Logo from "./logo";
import Menu from "./menu";
import SearchBar from "./search-bar";
import Link from "next/link";

const ChatSection = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className)}>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center">
          <Logo className="self-start ml-2" />
          <Menu>
            <Link className="flex gap-2 items-center" href="/chat/group">
              <Users className="text-theme " size={20} />
              <p>Create group</p>
            </Link>
          </Menu>
        </div>
        <SearchBar />
      </div>

      <h2 className="text-xl font-semibold -my-4 ml-2">Chats</h2>
      <ChatList />
    </div>
  );
};

export default ChatSection;
