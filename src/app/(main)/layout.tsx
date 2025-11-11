import QueryProvider from "@/components/providers/query.provider";
import React from "react";

//Add an header
const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default MainLayout;
