import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Notifications from "@/components/notifications/notifications-display";
import ChatSocketProvider from "@/components/providers/chat-socket.provider";
import CallProvider from "@/components/providers/call-provider";

const MainLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  if (!cookieStore.has("refresh_token")) {
    redirect("/login");
  }
  return (
    <CallProvider>
      <ChatSocketProvider>
        <Notifications>{children}</Notifications>
      </ChatSocketProvider>
    </CallProvider>
  );
};

export default MainLayout;
