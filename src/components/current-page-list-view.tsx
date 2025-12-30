"use client";

import { usePathname } from "next/navigation";
import {} from "react";
import ChatList from "./chat/chat-list";
import FriendList from "./friends/friend-list";

const CurrentPageListView = () => {
  const pathName = usePathname();
  const headerText =
    pathName.startsWith("/chat") || pathName === "/"
      ? "Chats"
      : pathName.startsWith("/friends")
      ? "Friends"
      : undefined;
  return (
    <>
      <h2 className="text-xl font-semibold -my-4 ml-2">{headerText}</h2>
      {pathName.startsWith("/chat") || pathName === "/" ? (
        <ChatList />
      ) : pathName.startsWith("/friends") ? (
        <FriendList />
      ) : undefined}
    </>
  );
};

export default CurrentPageListView;
