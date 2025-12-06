import ChatSection from "@/components/chat/chat-section";
import NavBar from "@/components/navbar/nav-bar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-dvh ">
      <div className=""></div>
      <ChatSection className="hidden md:flex flex-col gap-6 md:w-1/3 shrink-0  border-r border-neutral-200 h-full overflow-y-auto px-4 py-2" />
      {children}
    </section>
  );
}
