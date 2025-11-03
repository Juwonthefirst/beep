import { AuthErrorResponse, AuthResponse } from "@/utils/types";
import clsx from "clsx";
import {
  createContext,
  type ReactNode,
  useActionState,
  useEffect,
} from "react";

interface Props {
  action: (
    prevState: AuthResponse | undefined,
    formData: FormData
  ) => Promise<AuthResponse | undefined>;
  children: ReactNode;
  onSuccess: () => void;
  className?: string;
}

export const FormContext = createContext(false);

const AuthForm = ({ action, onSuccess, children, className = "" }: Props) => {
  const initialState: AuthErrorResponse = { error: "" };
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state && "status" in state) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form
      className={clsx(
        "flex flex-col gap-6 max-w-3xs mx-auto text-black",
        className
      )}
      action={formAction}
    >
      <FormContext value={isPending}>{children}</FormContext>
    </form>
  );
};

export default AuthForm;
