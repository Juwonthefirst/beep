"use client";

import { CallerInfo } from "@/utils/types/client.type";
import { createContext, type ReactNode } from "react";

interface Props {
  value: CallerInfo;
  children: ReactNode;
}

export const CallerInfoContext = createContext<CallerInfo>({
  username: "",
  avatar: "",
});

const CallerInfoProvider = ({ value, children }: Props) => {
  return <CallerInfoContext value={value}>{children}</CallerInfoContext>;
};

export default CallerInfoProvider;
