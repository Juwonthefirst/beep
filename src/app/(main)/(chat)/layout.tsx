import ChatList from "@/components/chat/chat-list";
import SearchBar from "@/components/search-bar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-[calc(100vh-56px)]">
      <div className="hidden md:flex flex-col gap-6 md:w-1/3  border-r h-full overflow-y-auto border-neutral-200 p-4 ">
        <SearchBar />
        <h2 className="text-xl font-semibold -my-2 ml-2">Chats</h2>
        <ChatList />
      </div>
      <div className="w-full md:w-2/3">{children}</div>
    </section>
  );
}
