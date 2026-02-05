"use client";

import { usePathname } from "next/navigation";
import ChatList from "./chat/chat-list";
import FriendList from "./friends/friend-list";
import AddFriendBtn from "./friends/buttons/add-friend-btn";

const CurrentPageListView = () => {
  const pathName = usePathname();
  const headerText =
    pathName.startsWith("/chat") || pathName === "/"
      ? "Chats"
      : pathName.startsWith("/friends") || pathName.startsWith("/users")
        ? "Friends"
        : undefined;
  return (
    <>
      <h2 className="text-xl font-semibold -my-4 ml-2">{headerText}</h2>
      {pathName.startsWith("/chat") || pathName === "/" ? (
        <ChatList />
      ) : pathName.startsWith("/friends") || pathName.startsWith("/users") ? (
        <>
          <FriendList />
          <AddFriendBtn />
        </>
      ) : undefined}
    </>
  );
};

export default CurrentPageListView;
