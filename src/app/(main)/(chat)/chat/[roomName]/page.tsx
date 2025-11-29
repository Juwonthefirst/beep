import ChatHeader, { ChatHeaderSkeleton } from "@/components/chat/chat-header";
import InputBox from "@/components/messages/input-box";
import MessageLoading from "@/components/messages/message-loading";
import MessaageView from "@/components/messages/message-view";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = await params;
  return (
    <section className="flex flex-col w-full h-full">
      <Suspense fallback={<ChatHeaderSkeleton />}>
        <ChatHeader roomName={roomName} />
      </Suspense>
      <Suspense
        fallback={
          <MessageLoading className="flex flex-1 items-start justify-center pt-4" />
        }
      >
        <MessaageView roomName={roomName} />
      </Suspense>

      <InputBox roomName={roomName} />
    </section>
  );
}
