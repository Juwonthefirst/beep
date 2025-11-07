"use client";

import { use, type ReactNode } from "react";
import { FormContext } from "./form";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
interface SematicsProps {
  children: ReactNode;
  className?: string;
}

export const FormHeader = ({ children, className }: SematicsProps) => (
  <h1 className={cn("font-semibold text-2xl mb-1", className)}>{children}</h1>
);

export const FormDescription = ({ children, className }: SematicsProps) => (
  <span className={cn("text-sm opacity-70", className)}>{children}</span>
);

interface Props {
  disabled?: boolean;
  children: ReactNode;
}

export const SubmitBtn = ({ disabled = false, children }: Props) => {
  const isSubmitting = use(FormContext);
  return (
    <button
      className={cn(
        "bg-black rounded-md text-white px-2 py-1 flex flex-col items-center disabled:opacity-70 disabled:cursor-not-allowed w-full",
        { "cursor-wait": isSubmitting }
      )}
      type="submit"
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? <LoaderCircle className="animate-spin" /> : children}
    </button>
  );
};
