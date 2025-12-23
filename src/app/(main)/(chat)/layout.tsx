import ChatSection from "@/components/chat/chat-section";
import { NavBar } from "@/components/navbar/nav-bar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-dvh">
      <div className="bg-black/1 w-6/16 hidden md:flex border-r border-neutral-200 h-full">
        <NavBar className="flex flex-col-reverse self-start gap-4 px-2 py-4  *:text-black *:data-[current=true]:bg-theme/80 *:data-[current=true]:text-white *:rounded-lg *:hover:bg-black/5 *:hover:opacity-100! *:data-[current=false]:opacity-70" />
        <ChatSection className="flex flex-col gap-6  flex-1  overflow-y-auto px-4 py-2 border-l border-neutral-200" />
      </div>
      {children}
    </section>
  );
}
