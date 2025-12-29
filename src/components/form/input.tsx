"use client";

import {
  type ReactNode,
  useState,
  type RefObject,
  InputHTMLAttributes,
} from "react";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";

const className =
  "text-sm transistion-all duration-200  rounded-md py-2 px-4 bg-neutral-100 shadow-xs has-focus:bg-white has-focus:ring-4 has-focus:ring-offset-2 has-focus:outline-2  ring-neutral-500/20 has-focus:outline-black text-black *:placeholder:text-sm";

interface InputFieldPropType extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  fieldClassName?: string;
  inputClassName?: string;
  ref?: RefObject<HTMLInputElement>;
  error?: string;
  inputType?: string;
  validation?: (
    value: string
  ) => string | undefined | Promise<string | undefined>;
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
  onChange,
  required = true,
  error,
  validation,
  elementInField,
  ...inputProps
}: InputFieldPropType) => {
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [validationError, setValidationError] = useState("");
  const validateField = async (value: string) => {
    if (!validateOnChange) setValidateOnChange(true);
    const error = await validation?.(value);
    if (error) setValidationError(error);
    else setValidationError("");
  };
  const [wordCount, setWordCount] = useState(0);

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
          {...inputProps}
          ref={ref}
          name={name || label}
          id={label + "-input"}
          className="focus:outline-0 grow"
          type={inputType}
          onChange={(event) => {
            const value = event.target.value;
            setWordCount(value.length);
            onChange?.(event);
            if (validateOnChange) validateField(value);
          }}
          required={required}
          placeholder={placeholder}
          onBlur={(event) => {
            const value = event.target.value;
            if (!value) return;
            if (!validateOnChange) validateField(value);
          }}
        />
        {elementInField}
      </div>
      {inputProps.maxLength && (
        <p className="text-xs ml-auto mr-1 opacity-70 text-black">{`${wordCount}/${inputProps.maxLength} characters`}</p>
      )}
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
          {isVisible ? <Eye size={20} /> : <EyeClosed size={20} />}
        </button>
      }
    />
  );
};

export default InputField;
