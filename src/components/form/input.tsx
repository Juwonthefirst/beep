"use client";

import {
  type ReactNode,
  useState,
  type ChangeEventHandler,
  type RefObject,
} from "react";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";

const className =
  "text-sm transistion-all duration-200  rounded-md py-1.5 px-3 bg-neutral-100 shadow-xs has-focus:bg-white has-focus:ring-4 has-focus:ring-offset-2 has-focus:outline-2  ring-neutral-500/20 has-focus:outline-black text-black *:placeholder:text-sm";

interface InputFieldPropType {
  required?: boolean;
  label?: string;
  fieldClassName?: string;
  inputClassName?: string;
  name?: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
  error?: string;
  inputType?: string;
  value?: string | number;
  validation?: (
    value: string
  ) => string | undefined | Promise<string | undefined>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  elementInField?: ReactNode;
}

const InputField = ({
  ref,
  label = "",
  inputClassName = "",
  fieldClassName = "",
  name,
  placeholder,
  inputType = "text",
  value,
  onChange,
  required = true,
  error,
  validation,
  elementInField,
}: InputFieldPropType) => {
  const [isInitialValidation, setIsInitialValidation] = useState(true);
  const [validationError, setValidationError] = useState("");
  const validateField = async (value: string) => {
    if (isInitialValidation) setIsInitialValidation(false);
    const error = await validation?.(value);
    if (error) setValidationError(error);
    else setValidationError("");
  };

  return (
    <div className={cn("flex flex-col gap-2 items-center", fieldClassName)}>
      <label
        className="font-medium self-start text-base"
        htmlFor={label + "-input"}
      >
        {label}
      </label>
      <div
        className={cn(
          className,
          "flex w-full items-center gap-2",
          {
            "outline-2 outline-red-500! ring-red-500/20":
              error || validationError,
          },
          inputClassName
        )}
      >
        <input
          ref={ref}
          name={name || label}
          id={label + "-input"}
          className="focus:outline-0 grow"
          type={inputType}
          value={value}
          onChange={(event) => {
            const value = event.target.value;
            onChange?.(event);
            if (!isInitialValidation) validateField(value);
          }}
          required={required}
          placeholder={placeholder}
          onBlur={(event) => {
            const value = event.target.value;
            if (!value) return;
            if (isInitialValidation) validateField(value);
          }}
        />
        {elementInField}
      </div>
      {(error || validationError) && (
        <p className="text-red-500 text-xs text-center -mt-1 w-full">
          {error || validationError}
        </p>
      )}
    </div>
  );
};

export const PasswordField = (
  props: Omit<InputFieldPropType, "elementInField">
) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      {...props}
      inputType={isVisible ? "text" : "password"}
      elementInField={
        <button type="button" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      }
    />
  );
};

export default InputField;
