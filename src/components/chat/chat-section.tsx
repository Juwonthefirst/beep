import { cn } from "@/lib/utils";
import Logo from "../logo";
import SearchBar from "../search-bar";
import ChatList from "./chat-list";
import { MobileNavBar } from "../navbar/nav-bar";
import Menu from "../menu";
import Link from "next/link";
import { Users } from "lucide-react";

const ChatSection = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
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
      <MobileNavBar />
    </div>
  );
};

export default ChatSection;
