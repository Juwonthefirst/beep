import ChatHeader from "@/components/chat/chat-header";

export default async function Page({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = await params;
  return (
    <section>
      <ChatHeader roomName={roomName} />
    </section>
  );
}
