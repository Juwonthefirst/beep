import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Notifications from "@/components/notifications/notifications-display";
import ChatSocketProvider from "@/components/providers/chat-socket.provider";
import CallProvider from "@/components/providers/call-provider";
import { MobileNavBar, NavBar } from "@/components/navbar/nav-bar";
import SideSection from "@/components/side-section";

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
        <Notifications>
          <div className="flex h-dvh">
            <div className="bg-black/1 w-6/16 hidden md:flex border-r border-neutral-200 h-full">
              <NavBar className="flex flex-col-reverse self-start gap-4 px-2 py-4  *:text-black *:data-[current=true]:bg-theme/80 *:data-[current=true]:text-white *:rounded-lg *:hover:bg-black/5 *:hover:opacity-100! *:data-[current=false]:opacity-70" />
              <SideSection className="flex flex-col gap-6  flex-1  overflow-y-auto px-4 py-2 border-l border-neutral-200 bg-black/1" />
            </div>
            <div className="w-screen md:w-10/16">{children}</div>
            <MobileNavBar />
          </div>
        </Notifications>
      </ChatSocketProvider>
    </CallProvider>
  );
};

export default MainLayout;
