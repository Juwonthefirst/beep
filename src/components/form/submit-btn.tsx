"use client";

import { use, type ReactNode } from "react";
import { FormContext } from "./form";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  isSubmitting?: boolean;
  children: ReactNode;
}

const SubmitBtn = ({ disabled = false, isSubmitting, children }: Props) => {
  const { isSubmitting: isFormSubmitting, isDisabled: isFormDisabled } =
    use(FormContext);

  return (
    <button
      className={cn(
        "bg-black rounded-md text-white px-3 py-1.5 flex flex-col items-center disabled:opacity-70 disabled:cursor-not-allowed w-full",
        { "cursor-wait!": isSubmitting || isFormSubmitting }
      )}
      type="submit"
      disabled={disabled || isFormDisabled}
    >
      {isSubmitting || isFormSubmitting ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitBtn;
