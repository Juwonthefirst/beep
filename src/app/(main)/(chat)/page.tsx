import ChatList from "@/components/chat/chat-list";
import SearchBar from "@/components/search-bar";

export default function Page() {
  return (
    <div>
      <div className="md:hidden flex flex-col gap-6 w-screen md:w-1/3  border-r h-full overflow-y-auto border-neutral-200 p-4 ">
        <SearchBar />
        <h2 className="text-xl font-semibold -my-2 ml-2">Chats</h2>
        <ChatList />
      </div>
    </div>
  );
}
