import ChatSection from "@/components/chat/chat-section";
import { NavBar } from "@/components/navbar/nav-bar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-dvh ">
      <div className="bg-neutral-100 ">
        <NavBar className="hidden md:flex flex-col-reverse gap-4 px-2 py-4  *:text-black *:data-[current=true]:bg-theme/80 *:data-[current=true]:text-white *:rounded-lg *:hover:bg-black/5 *:hover:opacity-100! *:data-[current=false]:opacity-70" />
      </div>
      <ChatSection className="hidden md:flex flex-col gap-6 md:w-1/3 shrink-0 border-r border-neutral-200 h-full overflow-y-auto px-4 py-2" />
      {children}
    </section>
  );
}
