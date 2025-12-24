import { createContext, type ReactNode } from "react";

type Props = { value: number; children: ReactNode };
export const CurrentUserIdContext = createContext(0);

const CurrentUserIdProvider = ({ value, children }: Props) => (
  <CurrentUserIdContext value={value}>{children}</CurrentUserIdContext>
);

export default CurrentUserIdProvider;
