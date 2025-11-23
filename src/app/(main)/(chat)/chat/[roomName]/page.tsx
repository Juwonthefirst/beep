import ChatHeader from "@/components/chat/chat-header";
import MessaageView from "@/components/chat/messages/message-view";

export default async function Page({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = await params;
  return (
    <section>
      <ChatHeader roomName={roomName} />
      <MessaageView roomName={roomName} />
    </section>
  );
}
