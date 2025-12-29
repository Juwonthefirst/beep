import ChatHeader, { ChatHeaderSkeleton } from "@/components/chat/chat-header";
import InputBox from "@/components/messages/input-box";
import MessageLoading from "@/components/messages/message-loading";
import MessaageView from "@/components/messages/message-view";
import ChatroomProvider from "@/components/providers/chatroom-state.provider";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = await params;
  return (
    <section className="flex flex-col h-dvh flex-1 md:w-2/3">
      <ChatroomProvider roomName={roomName}>
        <Suspense fallback={<ChatHeaderSkeleton />}>
          <ChatHeader />
        </Suspense>
        <Suspense
          fallback={
            <MessageLoading className="flex flex-1 items-start justify-center pt-4" />
          }
        >
          <MessaageView />
        </Suspense>

        <InputBox />
      </ChatroomProvider>
    </section>
  );
}
