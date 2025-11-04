import { useState, type ChangeEventHandler, type RefObject } from "react";
import { Eye, EyeClosed } from "lucide-react";
import clsx from "clsx";

const className =
  "text-sm transistion-all duration-200  rounded-md py-1.5 px-3  outline has-focus:ring-4 has-focus:ring-offset-2 has-focus:outline-2  ring-neutral-500/20 outline-black/75 has-focus:outline-black text-black *:placeholder:text-sm";

interface InputFieldPropType {
  required?: boolean;
  label?: string;

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
}

const InputField = ({
  ref,
  label = "",
  name,
  placeholder,
  inputType = "text",
  value,
  onChange,
  required = true,
  error,
  validation,
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
    <div className="flex flex-col gap-2 ">
      <label className="font-medium" htmlFor={label + "-input"}>
        {label}
      </label>
      <div
        className={clsx(
          className,
          "flex",
          error ? "outline-2 outline-red-500!" : ""
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
      </div>
      {(error || validationError) && (
        <p className=" text-red-500 text-xs text-center -mt-1">
          {error || validationError}
        </p>
      )}
    </div>
  );
};

export const PasswordField = ({
  ref,
  label = "",
  name,
  placeholder,
  value,
  onChange,
  required = true,
  error,
  validation,
}: InputFieldPropType) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialValidation, setIsInitialValidation] = useState(true);
  const [validationError, setValidationError] = useState("");
  const validateField = async (value: string) => {
    if (isInitialValidation) setIsInitialValidation(false);
    const error = await validation?.(value);
    if (error) setValidationError(error);
    else setValidationError("");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium" htmlFor={label + "-input"}>
        {label}
      </label>

      <div
        className={clsx(className, "flex items-center gap-2", {
          "outline-2 outline-red-500!": error,
        })}
      >
        <input
          ref={ref}
          id={label + "-input"}
          name={name || label}
          value={value}
          className="focus:outline-0 grow"
          type={isVisible ? "text" : "password"}
          onChange={(event) => {
            onChange?.(event);
            if (!isInitialValidation) validateField(event.target.value);
          }}
          required={required}
          placeholder={placeholder}
          onBlur={(event) => {
            const value = event.target.value;
            if (!value) return;
            if (isInitialValidation) validateField(value);
          }}
        />
        <button type="button" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      </div>
      {(validationError || error) && (
        <p className=" text-red-500 text-xs text-center -mt-1">
          {error || validationError}
        </p>
      )}
    </div>
  );
};

export default InputField;
