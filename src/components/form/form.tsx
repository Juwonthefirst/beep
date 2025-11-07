"use client";

import { cn } from "@/lib/utils";
import {
  AuthErrorResponse,
  AuthResponse,
} from "@/utils/types/server-response.types";
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
  onSuccess?: () => void;
  className?: string;
}

export const FormContext = createContext(false);

const AuthForm = ({ action, onSuccess, children, className = "" }: Props) => {
  const initialState: AuthErrorResponse = { error: "" };
  const [state, formAction, isSubmitting] = useActionState(
    action,
    initialState
  );

  useEffect(() => {
    if (state && "status" in state) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form
      className={cn(
        "flex flex-col gap-6 max-w-3xs mx-auto text-black px-2",
        className
      )}
      action={formAction}
    >
      <FormContext value={isSubmitting}>{children}</FormContext>
      {state && "error" in state && (
        <p className=" text-red-500 text-sm text-center -mt-5 max-w-5/6 self-center">
          {state.error}
        </p>
      )}
    </form>
  );
};

export default AuthForm;
