"use client";

import { cn } from "@/lib/utils";
import {
  AuthErrorResponse,
  AuthResponse,
} from "@/utils/types/server-response.type";
import {
  createContext,
  FormEventHandler,
  type ReactNode,
  use,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Props {
  action: (
    prevState: AuthResponse | undefined,
    formData: FormData
  ) => Promise<AuthResponse | undefined>;
  children: ReactNode;
  onSuccess?: () => void;
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export const FormContext = createContext<{
  isSubmitting: boolean;
  error: string;
  setError?: (error: string) => void;
  setIsDisabled?: (isDisabled: boolean) => void;
  isDisabled: boolean;
}>({ isSubmitting: false, isDisabled: false, error: "" });

export const FormError = ({ className }: { className?: string }) => {
  const { error } = use(FormContext);
  return (
    <p
      className={cn(
        "text-red-500 text-sm text-center -my-4 max-w-5/6 self-center",
        className
      )}
    >
      {error}
    </p>
  );
};

const AuthForm = ({
  action,
  onSuccess,
  children,
  className = "",
  onSubmit,
}: Props) => {
  const initialState: AuthErrorResponse = { error: "" };
  const [state, formAction, isSubmitting] = useActionState(
    action,
    initialState
  );
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (state && "status" in state) onSuccess?.();
  }, [state, onSuccess]);

  const formError =
    state && "error" in state && state.error ? state.error : error;

  const formStateControls = useMemo(
    () => ({
      isSubmitting,
      isDisabled: isSubmitting || isDisabled,
      setIsDisabled,
      setError,
      error: formError,
    }),
    [isSubmitting, isDisabled, formError]
  );

  return (
    <form
      className={cn(
        "flex flex-col gap-6 max-w-2xs mx-auto text-black px-4",
        className
      )}
      action={formAction}
      onSubmit={onSubmit}
    >
      <FormContext value={formStateControls}>{children}</FormContext>
    </form>
  );
};

export default AuthForm;
