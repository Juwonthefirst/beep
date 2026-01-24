import { cn } from "@/lib/utils";
import { RefObject, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: RefObject<HTMLTextAreaElement | null>;
  label?: string;
}

const TextArea = ({ ref, className, label, ...props }: Props) => {
  return (
    <div className={cn("flex flex-col gap-2 items-center w-full")}>
      {label && (
        <label className="font-medium self-start" htmlFor={label + "-input"}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        ref={ref}
        onChange={(event) => {
          event.target.style.height = "auto";
          event.target.style.height = event.target.scrollHeight + "px";
          props.onChange?.(event);
        }}
        className={cn(
          "focus:outline-0 w-full resize-none overflow-y-auto max-h-30 p-1",
          className
        )}
        rows={1}
      />

      {/* {props.maxLength && (
        <p className="text-xs ml-auto mr-1 opacity-70 text-black">{`${wordCount}/${inputProps.maxLength} characters`}</p>
      )} */}
    </div>
  );
};

export default TextArea;
