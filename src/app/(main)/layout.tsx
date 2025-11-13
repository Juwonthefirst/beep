import ChatSocketProvider from "@/components/providers/chat-socket.provider";
import QueryProvider from "@/components/providers/query.provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MainLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  if (!cookieStore.has("refresh_token")) {
    //cookieStore.set("requested_url", "/");
    redirect("/login");
  }
  return (
    <QueryProvider>
      <ChatSocketProvider>{children}</ChatSocketProvider>
    </QueryProvider>
  );
};

export default MainLayout;
