"use client";

import { chatListQueryOption } from "@/utils/queryOptions";
import { useRef } from "react";
import ChatPreview from "./chat-preview";
import ChatListSkeleton from "./chat-list-skeleton";
import NoChatRoom from "./no-chat-room";
import { useParams } from "next/navigation";
import InifinteDataView from "../infinite-data-view";

const ChatList = () => {
  const intersectingElementRef = useRef<HTMLAnchorElement | null>(null);
  const { roomName } = useParams();

  return (
    <InifinteDataView
      className="flex flex-col gap-4 px-1"
      queryOption={chatListQueryOption}
      triggerElementRef={intersectingElementRef}
      emptyFallback={<NoChatRoom />}
      loadingFallback={<ChatListSkeleton />}
    >
      {(chatRoom, isTriggerElement) => (
        <ChatPreview
          key={chatRoom.id}
          ref={isTriggerElement ? intersectingElementRef : undefined}
          {...chatRoom}
          isCurrentRoom={roomName === chatRoom.name}
        />
      )}
    </InifinteDataView>
  );
};

export default ChatList;
