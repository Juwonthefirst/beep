import ChatList from "@/components/chat/chat-list";
import SearchBar from "@/components/search-bar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-[calc(100vh-56px)]">
      <div className="flex flex-col gap-6 w-1/3  border-r h-full overflow-y-auto border-neutral-200 p-4">
        <SearchBar />
        <ChatList />
      </div>
      <div className="bg-neutral-50 w-2/3">{children}</div>
    </section>
  );
}
