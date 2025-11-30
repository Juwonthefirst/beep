"use client";

import ChatViewportProvider, {
  bindComposerKeyboard,
} from "@/components/providers/chat-viewport.provider";
import MessaageView from "@/components/messages/message-view";
import InputBox from "@/components/messages/input-box";
import { useEffect, useRef } from "react";

export default function ChatArea({ roomName }: { roomName: string }) {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanup = bindComposerKeyboard({
      messagesEl: messagesRef.current,
      composerEl: composerRef.current,
    });
    return cleanup;
  }, []);

  return (
    <ChatViewportProvider>
      <div className="chat-root">
        <div ref={messagesRef} className="messages">
          <MessaageView roomName={roomName} />
        </div>

        <div ref={composerRef} className="composer">
          <InputBox roomName={roomName} />
        </div>
      </div>
    </ChatViewportProvider>
  );
}
